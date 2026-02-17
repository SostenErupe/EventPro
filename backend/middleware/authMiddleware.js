// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Token extracted:', token ? token.substring(0, 20) + '...' : 'NULL');

      // Verify token using the same secret used when signing
      const secret = process.env.SECRET || process.env.JWT_SECRET || 'your-secret-key';
      console.log('Secret being used:', secret ? secret.substring(0, 10) + '...' : 'NULL');
      
      const decoded = jwt.verify(token, secret);
      console.log('Decoded JWT payload:', decoded);

      // Support tokens that use either `userId` or `id` as the payload key
      const userId = decoded.userId || decoded.id;
      console.log('User ID from token:', userId);

      // Get user from token (use promise helper)
      const result = await db.queryAsync(
        'SELECT User_ID AS userId, Username, Name, Email, Role_ID FROM users WHERE User_ID = ?',
        [userId]
      );

      // `result` may be [rows, fields] or rows depending on driver; normalize
      let rows;
      if (Array.isArray(result) && result.length === 2) {
        rows = result[0];
      } else {
        rows = result;
      }

      console.log('Database query result for userId', userId, ':', rows ? rows.length : 0, 'rows found');

      if (!rows || rows.length === 0) {
        console.log('User not found in database, returning 401');
        return res.status(401).json({ 
          success: false,
          message: 'Not authorized' 
        });
      }
      console.log('DB user row for token userId:', rows[0]);

      // Normalize `req.user` to contain `userId` and role
      req.user = {
        userId: rows[0].userId,
        username: rows[0].Username,
        name: rows[0].Name,
        email: rows[0].Email,
        role: rows[0].Role_ID
      };

      console.log('req.user set successfully:', req.user);
      next();
    } catch (error) {
      console.error('JWT verify error:', error.message);
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized' 
      });
    }
  }

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ 
      success: false,
      message: 'Not authorized, no token' 
    });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user && Number(req.user.role) === 1) {
    next();
  } else {
    res.status(403).json({ 
      success: false,
      message: 'Access denied. Admin only.' 
    });
  }
};