const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview');
const JobApplication = require('../models/JobApplication');
const EmailService = require('../services/emailService');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get all interviews with filters
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      type,
      applicationId,
      interviewerId,
      dateFrom,
      dateTo,
      sortBy = 'scheduledDate',
      sortOrder = 'asc'
    } = req.query;

    const query = {};

    if (status) query.status = status;
    if (type) query.type = type;
    if (applicationId) query.applicationId = applicationId;
    if (interviewerId) query['interviewers.userId'] = interviewerId;

    if (dateFrom || dateTo) {
      query.scheduledDate = {};
      if (dateFrom) query.scheduledDate.$gte = new Date(dateFrom);
      if (dateTo) query.scheduledDate.$lte = new Date(dateTo);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [interviews, totalInterviews] = await Promise.all([
      Interview.find(query)
        .populate('applicationId')
        .populate('jobId', 'title jobCode')
        .populate('interviewers.userId', 'fullName email')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Interview.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: interviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalInterviews / parseInt(limit)),
        totalInterviews
      }
    });
  } catch (error) {
    console.error('Error fetching interviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interviews',
      error: error.message
    });
  }
});

// Get today's interviews
router.get('/today', async (req, res) => {
  try {
    const interviews = await Interview.getToday();
    res.status(200).json({
      success: true,
      data: interviews
    });
  } catch (error) {
    console.error('Error fetching today\'s interviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch today\'s interviews',
      error: error.message
    });
  }
});

// Get upcoming interviews
router.get('/upcoming', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const interviews = await Interview.getUpcoming(days);
    
    res.status(200).json({
      success: true,
      data: interviews
    });
  } catch (error) {
    console.error('Error fetching upcoming interviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch upcoming interviews',
      error: error.message
    });
  }
});

// Get interviews by interviewer
router.get('/my-interviews', async (req, res) => {
  try {
    const userId = req.user._id;
    const interviews = await Interview.getByInterviewer(userId);
    
    res.status(200).json({
      success: true,
      data: interviews
    });
  } catch (error) {
    console.error('Error fetching interviewer\'s interviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your interviews',
      error: error.message
    });
  }
});

// Get single interview
router.get('/:id', async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate({
        path: 'applicationId',
        populate: { path: 'jobId' }
      })
      .populate('interviewers.userId', 'fullName email');

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    res.status(200).json({
      success: true,
      data: interview
    });
  } catch (error) {
    console.error('Error fetching interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interview',
      error: error.message
    });
  }
});

// Create interview
router.post('/', async (req, res) => {
  try {
    const interviewData = req.body;
    
    if (req.user) {
      interviewData.createdBy = req.user._id;
    }

    const interview = new Interview(interviewData);
    await interview.save();

    // Update application status
    const application = await JobApplication.findById(interviewData.applicationId)
      .populate('jobId');
    
    if (application) {
      application.interviews.push(interview._id);
      application.status = 'interview_scheduled';
      await application.save();

      // Send interview invitation
      try {
        await EmailService.sendInterviewSchedule(application, application.jobId, interview);
      } catch (emailError) {
        console.error('Failed to send interview invitation:', emailError);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Interview scheduled successfully',
      data: interview
    });
  } catch (error) {
    console.error('Error creating interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to schedule interview',
      error: error.message
    });
  }
});

// Update interview
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body;
    updates.updatedBy = req.user?._id;

    const interview = await Interview.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Interview updated successfully',
      data: interview
    });
  } catch (error) {
    console.error('Error updating interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update interview',
      error: error.message
    });
  }
});

// Reschedule interview
router.post('/:id/reschedule', async (req, res) => {
  try {
    const { newDate, newTime, reason } = req.body;

    if (!newDate || !newTime) {
      return res.status(400).json({
        success: false,
        message: 'New date and time are required'
      });
    }

    const interview = await Interview.findById(req.params.id)
      .populate({
        path: 'applicationId',
        populate: { path: 'jobId' }
      });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    await interview.reschedule(newDate, newTime, reason, req.user._id);

    // Send reschedule notification
    try {
      await EmailService.sendInterviewReschedule(
        interview.applicationId,
        interview.applicationId.jobId,
        interview,
        reason
      );
    } catch (emailError) {
      console.error('Failed to send reschedule notification:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Interview rescheduled successfully',
      data: interview
    });
  } catch (error) {
    console.error('Error rescheduling interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reschedule interview',
      error: error.message
    });
  }
});

// Cancel interview
router.post('/:id/cancel', async (req, res) => {
  try {
    const { reason } = req.body;

    const interview = await Interview.findById(req.params.id)
      .populate({
        path: 'applicationId',
        populate: { path: 'jobId' }
      });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    await interview.cancel(reason, req.user._id);

    // Send cancellation notification
    try {
      await EmailService.sendInterviewCancellation(
        interview.applicationId,
        interview.applicationId.jobId,
        interview,
        reason
      );
    } catch (emailError) {
      console.error('Failed to send cancellation notification:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Interview cancelled successfully',
      data: interview
    });
  } catch (error) {
    console.error('Error cancelling interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel interview',
      error: error.message
    });
  }
});

// Add feedback to interview
router.post('/:id/feedback', async (req, res) => {
  try {
    const feedbackData = req.body;

    const interview = await Interview.findById(req.params.id)
      .populate('applicationId');

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    await interview.addFeedback(feedbackData, req.user._id);

    // Update application status
    if (interview.applicationId) {
      interview.applicationId.status = 'interviewed';
      await interview.applicationId.save();
    }

    res.status(200).json({
      success: true,
      message: 'Feedback added successfully',
      data: interview
    });
  } catch (error) {
    console.error('Error adding feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add feedback',
      error: error.message
    });
  }
});

// Delete interview
router.delete('/:id', async (req, res) => {
  try {
    const interview = await Interview.findByIdAndDelete(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    // Remove interview reference from application
    await JobApplication.findByIdAndUpdate(
      interview.applicationId,
      { $pull: { interviews: interview._id } }
    );

    res.status(200).json({
      success: true,
      message: 'Interview deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete interview',
      error: error.message
    });
  }
});

module.exports = router;

