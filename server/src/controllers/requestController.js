import Request from '../models/Request.js';
import Item from '../models/Item.js';
import { createNotification } from './notificationController.js';

/**
 * Submit a new borrow request
 * POST /api/requests
 */
export const createRequest = async (req, res, next) => {
  try {
    const { itemId, startDate, dueDate, purpose } = req.body;

    if (!itemId || !dueDate || !purpose) {
      return res.status(400).json({
        success: false,
        error: 'Please provide itemId, intended due date, and academic purpose.',
      });
    }

    const item = await Item.findById(itemId);
    if (!item || item.status === 'ARCHIVED') {
      return res.status(404).json({ success: false, error: 'Resource not found' });
    }

    // Domain Constraint: A student cannot request their own item
    if (item.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: 'You cannot request to borrow your own listed item.',
      });
    }

    // Check if item is available for new requests
    if (['BORROWED', 'RESERVED', 'HANDOVER_PENDING', 'MAINTENANCE', 'HIDDEN', 'ARCHIVED'].includes(item.status)) {
      return res.status(400).json({
        success: false,
        error: `This resource is currently not available for borrowing (status: ${item.status}).`,
      });
    }

    // Check for existing active (pending or approved) request from same student
    const existingActive = await Request.findOne({
      itemId,
      borrowerId: req.user._id,
      status: { $in: ['PENDING', 'APPROVED'] },
    });

    if (existingActive) {
      return res.status(409).json({
        success: false,
        error: `You already have an active ${existingActive.status.toLowerCase()} request for this item.`,
      });
    }

    const reqStart = startDate ? new Date(startDate) : new Date();
    const reqDue = new Date(dueDate);

    if (reqDue <= reqStart) {
      return res.status(400).json({
        success: false,
        error: 'Due date must be after the borrow start date.',
      });
    }

    // Validate max duration against item limits using rounded day count
    const durationDays = Math.max(1, Math.round((reqDue.getTime() - reqStart.getTime()) / (1000 * 60 * 60 * 24)));
    if (item.maxDuration && durationDays > item.maxDuration) {
      return res.status(400).json({
        success: false,
        error: `Requested duration (${durationDays} days) exceeds maximum allowed (${item.maxDuration} days).`,
      });
    }

    const request = await Request.create({
      itemId,
      ownerId: item.ownerId,
      borrowerId: req.user._id,
      startDate: reqStart,
      dueDate: reqDue,
      purpose: purpose.trim(),
      status: 'PENDING',
    });

    // Notify item owner
    await createNotification({
      recipientId: item.ownerId,
      type: 'REQUEST_RECEIVED',
      title: `New Borrow Request: ${item.title}`,
      message: `${req.user.name} requested to borrow "${item.title}" for ${durationDays} days (${purpose.trim()}).`,
      relatedId: request._id,
    });

    const populatedRequest = await Request.findById(request._id)
      .populate('itemId', 'title images category location maxDuration depositPoints')
      .populate('ownerId', 'name email department reputationScore')
      .populate('borrowerId', 'name email department semester reputationScore points');

    res.status(201).json({
      success: true,
      message: 'Borrow request submitted successfully',
      request: populatedRequest,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all requests sent by authenticated student
 * GET /api/requests/sent
 */
export const getSentRequests = async (req, res, next) => {
  try {
    const requests = await Request.find({ borrowerId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('itemId', 'title images category location maxDuration depositPoints status')
      .populate('ownerId', 'name email department reputationScore avatar');

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all incoming requests for items owned by authenticated student
 * GET /api/requests/incoming
 */
export const getIncomingRequests = async (req, res, next) => {
  try {
    const requests = await Request.find({ ownerId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('itemId', 'title images category location maxDuration depositPoints status')
      .populate('borrowerId', 'name email department semester reputationScore points avatar');

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single request details
 * GET /api/requests/:id
 */
export const getRequestById = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('itemId', 'title images category location maxDuration depositPoints status')
      .populate('ownerId', 'name email department reputationScore')
      .populate('borrowerId', 'name email department semester reputationScore points');

    if (!request) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    // Only owner, borrower, or admin can view
    const isOwner = request.ownerId._id.toString() === req.user._id.toString();
    const isBorrower = request.borrowerId._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isBorrower && !isAdmin) {
      return res.status(403).json({ success: false, error: 'Unauthorized to view this request' });
    }

    res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Owner approves a borrow request
 * PATCH /api/requests/:id/approve
 */
export const approveRequest = async (req, res, next) => {
  try {
    const { responseNote } = req.body;
    const request = await Request.findById(req.params.id)
      .populate('itemId')
      .populate('borrowerId', 'name email')
      .populate('ownerId', 'name email');

    if (!request) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    // Domain Constraint: Only the item owner can accept (case-insensitive admin check)
    const isOwner = request.ownerId._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role?.toUpperCase() === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized. Only the item owner can approve this request.',
      });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        error: `Cannot approve request with status '${request.status}'`,
      });
    }

    // Check item availability before approving
    const item = await Item.findById(request.itemId._id || request.itemId);
    if (!item || item.status !== 'AVAILABLE') {
      return res.status(400).json({
        success: false,
        error: `Item is no longer available for approval (current status: ${item ? item.status : 'not found'}).`,
      });
    }

    // Update request to APPROVED
    request.status = 'APPROVED';
    request.decidedAt = new Date();
    if (responseNote) request.responseNote = responseNote.trim();
    await request.save();

    // Update item status to RESERVED (per spec and AGENTS.md)
    item.status = 'RESERVED';
    await item.save();

    // Reject other overlapping pending requests for this item
    await Request.updateMany(
      { itemId: item._id, _id: { $ne: request._id }, status: 'PENDING' },
      { $set: { status: 'REJECTED', responseNote: 'Item reserved for another approved student request', decidedAt: new Date() } }
    );

    // Notify borrower
    await createNotification({
      recipientId: request.borrowerId._id,
      type: 'REQUEST_APPROVED',
      title: `Borrow Request Approved!`,
      message: `${req.user.name} approved your request for "${request.itemId.title}". Meet at ${item?.location || 'Campus'} for QR handover.`,
      relatedId: request._id,
    });

    res.status(200).json({
      success: true,
      message: 'Request approved successfully',
      request,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Owner declines a borrow request
 * PATCH /api/requests/:id/reject
 */
export const rejectRequest = async (req, res, next) => {
  try {
    const { responseNote } = req.body;
    const request = await Request.findById(req.params.id)
      .populate('itemId', 'title')
      .populate('borrowerId', 'name email');

    if (!request) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    // Domain Constraint: Only the item owner can decline
    const isOwner = request.ownerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role?.toUpperCase() === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized. Only the item owner can decline this request.',
      });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        error: `Cannot decline request with status '${request.status}'`,
      });
    }

    request.status = 'REJECTED';
    request.decidedAt = new Date();
    if (responseNote) request.responseNote = responseNote.trim();
    await request.save();

    // Notify borrower
    await createNotification({
      recipientId: request.borrowerId._id,
      type: 'REQUEST_REJECTED',
      title: `Borrow Request Declined`,
      message: `${req.user.name} was unable to accept your request for "${request.itemId.title}". ${responseNote ? `Reason: ${responseNote}` : ''}`,
      relatedId: request._id,
    });

    res.status(200).json({
      success: true,
      message: 'Request declined',
      request,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Borrower cancels their pending request
 * PATCH /api/requests/:id/cancel
 */
export const cancelRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('itemId', 'title')
      .populate('ownerId', 'name');

    if (!request) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    // Domain Constraint: Only the borrower can cancel
    const isBorrower = request.borrowerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role?.toUpperCase() === 'ADMIN';

    if (!isBorrower && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized. Only the student who requested this item can cancel it.',
      });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        error: `Cannot cancel request with status '${request.status}'`,
      });
    }

    request.status = 'CANCELLED';
    request.decidedAt = new Date();
    await request.save();

    // Notify owner
    await createNotification({
      recipientId: request.ownerId._id,
      type: 'REQUEST_CANCELLED',
      title: `Borrow Request Cancelled`,
      message: `${req.user.name} cancelled their request for "${request.itemId.title}".`,
      relatedId: request._id,
    });

    res.status(200).json({
      success: true,
      message: 'Request cancelled successfully',
      request,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Unified decision endpoint
 * PATCH /api/requests/:id/decision
 */
export const decideRequest = async (req, res, next) => {
  const decision = (req.body.decision || req.body.status || '').toUpperCase();
  if (decision === 'APPROVE' || decision === 'APPROVED') {
    return approveRequest(req, res, next);
  }
  if (decision === 'REJECT' || decision === 'REJECTED' || decision === 'DECLINE') {
    return rejectRequest(req, res, next);
  }
  return res.status(400).json({
    success: false,
    error: "Invalid decision value. Must be 'approve' or 'reject'.",
  });
};
