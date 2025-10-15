const AdminUser = require('../models/AdminUser');
const bcrypt = require('bcrypt');

/**
 * Get all admin users
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await AdminUser.find()
      .select('-password_hash')
      .sort({ created_at: -1 });
    
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin users',
      error: error.message
    });
  }
};

/**
 * Get user by ID
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await AdminUser.findById(id).select('-password_hash');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

/**
 * Create new admin user
 */
const createUser = async (req, res) => {
  try {
    const { username, email, password, role, full_name, phone, department } = req.body;
    
    // Check if user already exists
    const existingUser = await AdminUser.findOne({
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? 'Email already exists' : 'Username already exists'
      });
    }
    
    // Create new user
    const newUser = new AdminUser({
      username,
      email,
      password_hash: password, // Will be hashed by pre-save middleware
      role: role || 'admin',
      full_name,
      phone,
      department
    });
    
    await newUser.save();
    
    // Return user without password
    const userResponse = await AdminUser.findById(newUser._id).select('-password_hash');
    
    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: userResponse
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};

/**
 * Update admin user
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Don't allow updating password through this endpoint
    delete updates.password_hash;
    
    const user = await AdminUser.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).select('-password_hash');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

/**
 * Delete admin user
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Don't allow deleting super admin users
    const user = await AdminUser.findById(id);
    if (user && user.role === 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete super admin users'
      });
    }
    
    const deletedUser = await AdminUser.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

/**
 * Change user password
 */
const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    
    const user = await AdminUser.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    user.password_hash = newPassword; // Will be hashed by pre-save middleware
    await user.save();
    
    res.json({
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
};

/**
 * Toggle user status (active/inactive)
 */
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    
    const user = await AdminUser.findByIdAndUpdate(
      id,
      { is_active },
      { new: true }
    ).select('-password_hash');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: `User ${is_active ? 'activated' : 'deactivated'} successfully`,
      data: user
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: error.message
    });
  }
};

/**
 * Get user statistics
 */
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await AdminUser.countDocuments();
    const activeUsers = await AdminUser.countDocuments({ is_active: true });
    const superAdmins = await AdminUser.countDocuments({ role: 'super_admin' });
    const admins = await AdminUser.countDocuments({ role: 'admin' });
    const editors = await AdminUser.countDocuments({ role: 'editor' });
    
    res.json({
      success: true,
      data: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers,
        byRole: {
          super_admin: superAdmins,
          admin: admins,
          editor: editors
        }
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
  toggleUserStatus,
  getUserStats
};
