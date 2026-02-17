// controllers/userController.js
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = {
  login: (req, res) => {
    const { email, password, portalType } = req.body;

    // Use executeAsync instead of callback pattern
    db.executeAsync(
      'SELECT u.*, r.Role_Name FROM users u JOIN userroles r ON u.Role_ID = r.Role_ID WHERE u.Email = ?',
      [email]
    )
    .then(([results]) => {
      if (results.length === 0) {
        return res.status(401).json({ 
          success: false,
          error: "Invalid email or password" 
        });
      }

      const user = results[0];
      
      // Verify portal access
      const requestedRole = portalType === 'Admin' ? 1 : 2;
      if (user.Role_ID !== requestedRole) {
        return res.status(403).json({ 
          success: false,
          error: `Access denied. Please use the ${user.Role_ID === 1 ? 'Admin' : 'User'} portal` 
        });
      }

      bcrypt.compare(password, user.Password)
        .then(passwordMatch => {
          if (!passwordMatch) {
            return res.status(401).json({ 
              success: false,
              error: "Invalid email or password" 
            });
          }

          const token = jwt.sign(
            { 
              userId: user.User_ID,
              username: user.Username,
              role: user.Role_ID,
              roleName: user.Role_Name
            },
            process.env.SECRET || 'your-secret-key',
            { expiresIn: "8h" }
          );

          res.status(200).json({
            success: true,
            token,
            user: {
              id: user.User_ID,
              name: user.Name,
              email: user.Email,
              username: user.Username,
              role: user.Role_ID,
              roleName: user.Role_Name,
              contactInfo: user.ContactInfo
            }
          });
        })
        .catch(error => {
          console.error("Password comparison error:", error);
          res.status(500).json({ 
            success: false,
            error: "Internal server error" 
          });
        });
    })
    .catch(error => {
      console.error("Login query error:", error);
      res.status(500).json({ 
        success: false,
        error: "Internal server error" 
      });
    });
  },

  signup: async (req, res) => {
    const { name, email, username, password, role, contactInfo } = req.body;

    try {
      // Validate role
      if (role == 1) { // Admin role
        const adminCode = req.body.adminCode;
        if (adminCode !== process.env.ADMIN_SIGNUP_CODE) {
          return res.status(403).json({
            success: false,
            error: "Invalid admin registration code"
          });
        }
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Check if user already exists
      const [existingUser] = await db.executeAsync(
        'SELECT User_ID FROM users WHERE Email = ? OR Username = ?',
        [email, username]
      );

      if (existingUser.length > 0) {
        return res.status(400).json({
          success: false,
          error: "User with this email or username already exists"
        });
      }

      // Insert new user
      const [result] = await db.executeAsync(
        'INSERT INTO users (Name, Email, Username, Password, Role_ID, ContactInfo) VALUES (?, ?, ?, ?, ?, ?)',
        [name, email, username, hashedPassword, role, contactInfo]
      );

      const token = jwt.sign(
        { 
          userId: result.insertId,
          username,
          role,
          name,
          email
        },
        process.env.SECRET || 'your-secret-key',
        { expiresIn: "8h" }
      );

      res.status(201).json({
        success: true,
        token,
        user: {
          id: result.insertId,
          name,
          email,
          username,
          role,
          contactInfo
        }
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error"
      });
    }
  },

  checkEmail: async (req, res) => {
    const email = req.query.email;

    try {
      const [results] = await db.executeAsync(
        'SELECT COUNT(*) as count FROM users WHERE Email = ?',
        [email]
      );

      res.status(200).json({
        success: true,
        isAvailable: results[0].count === 0
      });
    } catch (error) {
      console.error("Email check error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error"
      });
    }
  },

  checkUsername: async (req, res) => {
    const username = req.query.username;

    try {
      const [results] = await db.executeAsync(
        'SELECT COUNT(*) as count FROM users WHERE Username = ?',
        [username]
      );

      res.status(200).json({
        success: true,
        isAvailable: results[0].count === 0
      });
    } catch (error) {
      console.error("Username check error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error"
      });
    }
  },

  // Get current user's profile
  getUserProfile: async (req, res) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User ID not found in token'
        });
      }

      const [rows] = await db.executeAsync(
        'SELECT User_ID, Username, Name, Email, ContactInfo, Role_ID, Created_At, Updated_At FROM users WHERE User_ID = ?',
        [userId]
      );

      if (!rows || rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        data: rows[0]
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching user profile',
        error: error.message
      });
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const userId = req.user?.userId;
      const { Name, Email, ContactInfo } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User ID not found in token'
        });
      }

      // Check if email already exists for another user
      if (Email) {
        const [existingEmail] = await db.executeAsync(
          'SELECT User_ID FROM users WHERE Email = ? AND User_ID != ?',
          [Email, userId]
        );

        if (existingEmail.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'Email already in use by another account'
          });
        }
      }

      await db.executeAsync(
        'UPDATE users SET Name = ?, Email = ?, ContactInfo = ?, Updated_At = NOW() WHERE User_ID = ?',
        [Name, Email, ContactInfo, userId]
      );

      // Fetch updated user
      const [updatedUser] = await db.executeAsync(
        'SELECT User_ID, Username, Name, Email, ContactInfo, Role_ID FROM users WHERE User_ID = ?',
        [userId]
      );

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser[0]
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating profile',
        error: error.message
      });
    }
  },

  // Change password
  changePassword: async (req, res) => {
    try {
      const userId = req.user?.userId;
      const { currentPassword, newPassword } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User ID not found in token'
        });
      }

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password and new password are required'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters'
        });
      }

      // Get current user password
      const [userRows] = await db.executeAsync(
        'SELECT Password FROM users WHERE User_ID = ?',
        [userId]
      );

      if (!userRows || userRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Verify current password
      const passwordMatch = await bcrypt.compare(currentPassword, userRows[0].Password);
      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      await db.executeAsync(
        'UPDATE users SET Password = ?, Updated_At = NOW() WHERE User_ID = ?',
        [hashedPassword, userId]
      );

      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({
        success: false,
        message: 'Error changing password',
        error: error.message
      });
    }
  },

  // Get user details by ID (for admin)
  getUserDetails: async (req, res) => {
    try {
      const userId = req.params.userId;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      const [rows] = await db.executeAsync(
        'SELECT User_ID, Username, Name, Email, ContactInfo, Role_ID, Created_At FROM users WHERE User_ID = ?',
        [userId]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        user: rows[0]
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching user details',
        error: error.message
      });
    }
  }
};