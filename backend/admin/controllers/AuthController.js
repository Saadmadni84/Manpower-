const AdminUser = require('../models/AdminUser');
const { generateToken, recordLoginAttempt } = require('../middleware/auth');

class AuthController {
  // Admin login
  static async login(req, res) {
    try {
      const { username, password } = req.body;
      console.log('Login attempt:', { username, password: password ? '***' : 'missing' });

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username and password are required'
        });
      }

      // Find admin user
      const admin = await AdminUser.findOne({
        $or: [{ username }, { email: username }]
      });

      console.log('Admin user found:', admin ? { username: admin.username, is_active: admin.is_active } : 'Not found');

      if (!admin || !admin.is_active) {
        recordLoginAttempt(req, false);
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check password
      const isPasswordValid = await admin.comparePassword(password);
      console.log('Password validation result:', isPasswordValid);
      
      if (!isPasswordValid) {
        recordLoginAttempt(req, false);
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Update last login
      admin.last_login = new Date();
      await admin.save();

      // Generate token
      const token = generateToken(admin._id);

      // Record successful login
      recordLoginAttempt(req, true);

      // Set cookie
      res.cookie('adminToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          admin: {
            id: admin._id,
            username: admin.username,
            email: admin.email,
            role: admin.role,
            last_login: admin.last_login
          }
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Admin logout
  static async logout(req, res) {
    try {
      res.clearCookie('adminToken');
      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get current admin profile
  static async getProfile(req, res) {
    try {
      const admin = await AdminUser.findById(req.admin._id).select('-password_hash');
      
      res.json({
        success: true,
        data: {
          admin: {
            id: admin._id,
            username: admin.username,
            email: admin.email,
            role: admin.role,
            last_login: admin.last_login,
            created_at: admin.created_at
          }
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Change password
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password and new password are required'
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 8 characters long'
        });
      }

      const admin = await AdminUser.findById(req.admin._id);
      
      // Verify current password
      const isCurrentPasswordValid = await admin.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Update password
      admin.password_hash = newPassword;
      await admin.save();

      res.json({
        success: true,
        message: 'Password changed successfully'
      });

    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Verify token
  static async verifyToken(req, res) {
    try {
      res.json({
        success: true,
        data: {
          admin: {
            id: req.admin._id,
            username: req.admin.username,
            email: req.admin.email,
            role: req.admin.role
          }
        }
      });
    } catch (error) {
      console.error('Verify token error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = AuthController;
