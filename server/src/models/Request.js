import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: [true, 'Request must refer to an item'],
      index: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Request must have an item owner'],
      index: true,
    },
    borrowerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Request must have a borrower'],
      index: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Please specify a borrow start date'],
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: [true, 'Please specify an intended due/return date'],
    },
    purpose: {
      type: String,
      required: [true, 'Please state the academic purpose or course for this borrow request'],
      trim: true,
      maxlength: [300, 'Purpose cannot exceed 300 characters'],
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'],
      default: 'PENDING',
      index: true,
    },
    decidedAt: {
      type: Date,
      default: null,
    },
    responseNote: {
      type: String,
      default: '',
      trim: true,
      maxlength: [300, 'Response note cannot exceed 300 characters'],
    },
  },
  {
    timestamps: true,
  }
);

const Request = mongoose.model('Request', requestSchema);

export default Request;
