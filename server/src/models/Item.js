import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Item must belong to a registered student owner'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide an item title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a clear description of the item and its condition'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: [
        'Calculators',
        'Lab Equipment',
        'Textbooks',
        'Electronics',
        'Engineering Tools',
        'Notes & Stationery',
        'Other',
      ],
      default: 'Other',
      index: true,
    },
    images: {
      type: [String],
      default: [],
    },
    condition: {
      type: String,
      enum: ['Brand New', 'Like New', 'Good', 'Fair'],
      default: 'Good',
    },
    actionTypes: {
      type: [String],
      enum: ['Borrow', 'Rent', 'Giveaway'],
      default: ['Borrow'],
    },
    status: {
      type: String,
      enum: [
        'AVAILABLE',
        'RESERVED',
        'BORROWED',
        'HIDDEN',
        'REQUESTED',
        'HANDOVER_PENDING',
        'RETURN_PENDING',
        'MAINTENANCE',
        'ARCHIVED',
      ],
      default: 'AVAILABLE',
      index: true,
    },
    location: {
      type: String,
      default: 'Main Campus Library / Engineering Quad',
      trim: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    maxDuration: {
      type: Number,
      default: 7, // Maximum borrow duration in days
      min: [1, 'Minimum duration is 1 day'],
      max: [60, 'Maximum duration is 60 days'],
    },
    depositPoints: {
      type: Number,
      default: 10, // Green points deposit/incentive
      min: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    qrTokenHash: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for search queries
itemSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Item = mongoose.model('Item', itemSchema);

export default Item;
