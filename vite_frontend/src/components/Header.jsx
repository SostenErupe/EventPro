// src/components/Header.jsx
import { useState, useEffect } from 'react';
import { Menu, X, Calendar, Bell, Search, User, ChevronDown, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  // Mock user data (replace with actual auth)
  const currentUser = {
    name: 'John Doe',
    email: 'john@nairobi.dev',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100',
    isLoggedIn: true
  };

  // Mock notifications
  const notifications = [
    { id: 1, text: 'Nairobi Tech Week starts in 3 days', time: '2 min ago', unread: true },
    { id: 2, text: 'Your ticket for Web3 Summit is confirmed', time: '1 hour ago', unread: true },
    { id: 3, text: '5 people are interested in your IoT workshop', time: '2 hours ago', unread: false },
    { id: 4, text: 'New events in Westlands area', time: '5 hours ago', unread: false },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' 
        : 'bg-white py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl transform rotate-12 group-hover:rotate-0 transition-transform duration-300"></div>
              <Calendar className="relative h-8 w-8 text-white transform group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                NairobiEvents
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Discover • Connect • Grow</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link 
              to="/events" 
              className="text-gray-700 hover:text-blue-600 font-medium relative group"
            >
              Events
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/venues" 
              className="text-gray-700 hover:text-blue-600 font-medium relative group"
            >
              Venues
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/events/create" 
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-medium shadow-md hover:shadow-lg transition-all duration-300"
            >
              + Create Event
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Search Button */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Search className="h-5 w-5 text-gray-600" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border py-2">
                  <div className="px-4 py-2 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                    <p className="text-sm text-gray-500">{notifications.length} unread</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(notif => (
                      <div key={notif.id} className={`px-4 py-3 hover:bg-gray-50 ${notif.unread ? 'bg-blue-50' : ''}`}>
                        <p className="text-sm">{notif.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t">
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      Mark all as read
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden">
                  <img src={currentUser.avatar} alt={currentUser.name} className="h-full w-full object-cover" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">{currentUser.name}</p>
                  <p className="text-xs text-gray-500">Event Organizer</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border py-2">
                  <div className="px-4 py-3 border-b">
                    <p className="font-medium">{currentUser.name}</p>
                    <p className="text-sm text-gray-500">{currentUser.email}</p>
                  </div>
                  <div className="py-1">
                    <Link 
                      to="/dashboard" 
                      className="flex items-center px-4 py-2 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="h-4 w-4 mr-3" />
                      Dashboard
                    </Link>
                    <Link 
                      to="/profile" 
                      className="flex items-center px-4 py-2 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="h-4 w-4 mr-3" />
                      My Profile
                    </Link>
                    <Link 
                      to="/my-events" 
                      className="flex items-center px-4 py-2 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Calendar className="h-4 w-4 mr-3" />
                      My Events
                    </Link>
                    <Link 
                      to="/tickets" 
                      className="flex items-center px-4 py-2 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Calendar className="h-4 w-4 mr-3" />
                      My Tickets
                    </Link>
                  </div>
                  <div className="border-t py-1">
                    <button 
                      className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50"
                      onClick={() => {
                        // Handle logout
                        setShowUserMenu(false);
                        navigate('/login');
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t pt-4">
            <div className="space-y-3">
              <Link 
                to="/events" 
                className="block py-2 px-4 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </Link>
              <Link 
                to="/venues" 
                className="block py-2 px-4 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Venues
              </Link>
              <Link 
                to="/events/create" 
                className="block py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Create Event
              </Link>
              
              {/* Mobile User Section */}
              <div className="pt-4 border-t">
                {currentUser.isLoggedIn ? (
                  <>
                    <div className="flex items-center px-4 py-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden mr-3">
                        <img src={currentUser.avatar} alt={currentUser.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium">{currentUser.name}</p>
                        <p className="text-sm text-gray-500">Event Organizer</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Link to="/dashboard" className="block py-2 px-4 hover:bg-gray-50 rounded-lg">Dashboard</Link>
                      <Link to="/profile" className="block py-2 px-4 hover:bg-gray-50 rounded-lg">Profile</Link>
                      <Link to="/my-events" className="block py-2 px-4 hover:bg-gray-50 rounded-lg">My Events</Link>
                      <button className="block w-full text-left py-2 px-4 text-red-600 hover:bg-red-50 rounded-lg">
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Link 
                      to="/login" 
                      className="flex-1 py-2 text-center border rounded-lg hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      className="flex-1 py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;