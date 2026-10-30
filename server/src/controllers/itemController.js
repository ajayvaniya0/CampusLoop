import Item from '../models/Item.js';
import User from '../models/User.js';

// Default realistic campus items for initial demonstration
const SAMPLE_CAMPUS_ITEMS = [
  {
    title: 'TI-84 Plus CE Graphing Calculator',
    description: 'Perfect condition Texas Instruments color graphing calculator. Comes with slide cover and USB charging cable. Ideal for Calculus I/II and Physics.',
    category: 'Calculators',
    images: ['https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80'],
    condition: 'Like New',
    actionTypes: ['Borrow'],
    location: 'Engineering Building Room 204 / Library',
    maxDuration: 14,
    depositPoints: 15,
    tags: ['math', 'calculus', 'calculator', 'texas instruments'],
  },
  {
    title: 'Arduino Uno Ultimate Starter Kit with Sensors',
    description: 'Complete kit containing Arduino Uno R3, breadboard, 30+ sensors (ultrasonic, temperature, IR), stepper motor, and jumper wires. Great for IoT and Embedded Systems labs.',
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80'],
    condition: 'Good',
    actionTypes: ['Borrow'],
    location: 'Electrical Dept Lab 3',
    maxDuration: 10,
    depositPoints: 20,
    tags: ['arduino', 'electronics', 'microcontroller', 'sensors'],
  },
  {
    title: 'Campbell Biology 12th Edition (Hardcover)',
    description: 'Standard textbook for General Biology and Biotech majors. Minimal highlighting in chapters 1-4, spine and pages in excellent state.',
    category: 'Textbooks',
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
    condition: 'Good',
    actionTypes: ['Borrow'],
    location: 'Central Library 2nd Floor',
    maxDuration: 30,
    depositPoints: 25,
    tags: ['biology', 'textbook', 'biotech', 'campbell'],
  },
  {
    title: 'Fluke 115 True-RMS Digital Multimeter',
    description: 'High precision digital multimeter with test leads and magnetic holster. Measures AC/DC voltage, resistance, capacitance, and continuity.',
    category: 'Lab Equipment',
    images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'],
    condition: 'Like New',
    actionTypes: ['Borrow'],
    location: 'Robotics Workshop / Mech Quad',
    maxDuration: 7,
    depositPoints: 20,
    tags: ['multimeter', 'lab', 'electrical', 'measurement'],
  },
  {
    title: 'Professional Engineering Drawing Mini Drafter & Board',
    description: 'Complete engineering graphics kit with adjustable clamp mini-drafter, sheet clips, and compass set for semester 1/2 drafting classes.',
    category: 'Engineering Tools',
    images: ['https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80'],
    condition: 'Good',
    actionTypes: ['Borrow'],
    location: 'Design Studio 101',
    maxDuration: 21,
    depositPoints: 15,
    tags: ['drafting', 'drawing', 'civil', 'mechanical'],
  },
  {
    title: 'Raspberry Pi 4 Model B (4GB RAM) with Case',
    description: 'Includes 32GB micro SD card with Raspberry Pi OS preloaded, official micro-HDMI cable, and 5V USB-C power supply.',
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80'],
    condition: 'Like New',
    actionTypes: ['Borrow'],
    location: 'CS Department Common Room',
    maxDuration: 14,
    depositPoints: 25,
    tags: ['raspberry pi', 'linux', 'coding', 'python'],
  },
];

/**
 * Get all items with search, filters, sorting, and pagination
 * GET /api/items
 */
export const getItems = async (req, res, next) => {
  try {
    const {
      q,
      category,
      condition,
      status,
      actionType,
      sort = 'newest',
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    // Filter by availability or status
    if (status) {
      query.status = status;
    } else {
      query.status = { $nin: ['ARCHIVED', 'HIDDEN'] };
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by condition
    if (condition && condition !== 'All') {
      query.condition = condition;
    }

    // Filter by action type
    if (actionType && actionType !== 'All') {
      query.actionTypes = actionType;
    }

    // Text Search query with word tokenization and escaped regex
    if (q && q.trim()) {
      const words = q
        .trim()
        .split(/\s+/)
        .map((w) => w.replace(/^[^\w+#]+|[^\w+#]+$/g, ''))
        .filter(Boolean)
        .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

      if (words.length > 0) {
        query.$and = words.map((word) => {
          const wordRegex = new RegExp(word, 'i');
          return {
            $or: [
              { title: wordRegex },
              { description: wordRegex },
              { tags: wordRegex },
              { location: wordRegex },
            ],
          };
        });
      }
    }

    // Sort order
    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'popular') sortOption = { viewCount: -1, createdAt: -1 };
    if (sort === 'duration_asc') sortOption = { maxDuration: 1 };
    if (sort === 'duration_desc') sortOption = { maxDuration: -1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    // Check if we need to auto-seed when no items exist
    const totalCount = await Item.countDocuments();
    if (totalCount === 0) {
      const demoOwner = await User.findOne();
      if (demoOwner) {
        const seedItems = SAMPLE_CAMPUS_ITEMS.map((item) => ({
          ...item,
          ownerId: demoOwner._id,
        }));
        await Item.insertMany(seedItems);
      }
    }

    const [items, total] = await Promise.all([
      Item.find(query)
        .populate('ownerId', 'name email department semester reputationScore avatar')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Item.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      items,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single item by ID
 * GET /api/items/:id
 */
export const getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      'ownerId',
      'name email department semester reputationScore avatar points createdAt'
    );

    if (!item || item.status === 'ARCHIVED') {
      return res.status(404).json({ success: false, error: 'Resource not found' });
    }

    // Increment view count asynchronously
    item.viewCount = (item.viewCount || 0) + 1;
    await item.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new item listing
 * POST /api/items
 */
export const createItem = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      images,
      condition,
      actionTypes,
      location,
      maxDuration,
      depositPoints,
      tags,
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        error: 'Title, description, and category are required.',
      });
    }

    // Default image if none supplied
    let itemImages = images;
    if (!itemImages || (Array.isArray(itemImages) && itemImages.length === 0)) {
      itemImages = ['https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?auto=format&fit=crop&w=800&q=80'];
    }

    const item = await Item.create({
      ownerId: req.user._id,
      title: title.trim(),
      description: description.trim(),
      category,
      images: Array.isArray(itemImages) ? itemImages : [itemImages],
      condition: condition || 'Good',
      actionTypes: actionTypes || ['Borrow'],
      location: location ? location.trim() : 'Campus Library / Student Center',
      maxDuration: Number(maxDuration) || 7,
      depositPoints: depositPoints !== undefined ? Number(depositPoints) : 10,
      tags: Array.isArray(tags)
        ? tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean)
        : (typeof tags === 'string' ? tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean) : []),
      status: 'AVAILABLE',
      availability: true,
    });

    const populatedItem = await Item.findById(item._id).populate(
      'ownerId',
      'name email department semester reputationScore avatar'
    );

    res.status(201).json({
      success: true,
      message: 'Resource listed successfully on CampusLoop',
      item: populatedItem,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get items listed by current user
 * GET /api/items/my-listings
 */
export const getMyListings = async (req, res, next) => {
  try {
    const items = await Item.find({
      ownerId: req.user._id,
      status: { $ne: 'ARCHIVED' },
    })
      .sort({ createdAt: -1 })
      .populate('ownerId', 'name email department reputationScore');

    res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing item
 * PUT /api/items/:id
 */
export const updateItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, error: 'Resource not found' });
    }

    // Only owner or admin can edit
    const isOwner = item.ownerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role?.toUpperCase() === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized. You can only edit your own listings.',
      });
    }

    const {
      title,
      description,
      category,
      images,
      condition,
      location,
      maxDuration,
      depositPoints,
      tags,
      status,
    } = req.body;

    if (title) item.title = title.trim();
    if (description) item.description = description.trim();
    if (category) item.category = category;
    if (images && Array.isArray(images) && images.length > 0) {
      item.images = images;
    } else if (images && typeof images === 'string') {
      item.images = [images];
    }
    if (condition) item.condition = condition;
    if (location) item.location = location.trim();
    if (maxDuration) item.maxDuration = Number(maxDuration);
    if (depositPoints !== undefined) item.depositPoints = Number(depositPoints);
    if (tags !== undefined) {
      item.tags = Array.isArray(tags)
        ? tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean)
        : (typeof tags === 'string' ? tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean) : []);
    }
    if (status) item.status = status;

    await item.save();

    const updatedItem = await Item.findById(item._id).populate(
      'ownerId',
      'name email department semester reputationScore avatar'
    );

    res.status(200).json({
      success: true,
      message: 'Listing updated successfully',
      item: updatedItem,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete or archive an item
 * DELETE /api/items/:id
 */
export const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, error: 'Resource not found' });
    }

    // Only owner or admin can delete
    const isOwner = item.ownerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role?.toUpperCase() === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized. You can only remove your own listings.',
      });
    }

    // If currently in active borrow cycle, prevent deletion
    if (['BORROWED', 'HANDOVER_PENDING', 'RETURN_PENDING'].includes(item.status)) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete item with active borrow transaction in progress.',
      });
    }

    item.status = 'ARCHIVED';
    item.availability = false;
    await item.save();

    res.status(200).json({
      success: true,
      message: 'Item listing archived successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Seed items endpoint (dev utility)
 * POST /api/items/seed
 */
export const seedItems = async (req, res, next) => {
  try {
    const user = req.user;
    const seedItems = SAMPLE_CAMPUS_ITEMS.map((item) => ({
      ...item,
      ownerId: user._id,
    }));

    await Item.insertMany(seedItems);

    res.status(201).json({
      success: true,
      message: `Seeded ${seedItems.length} campus items successfully`,
    });
  } catch (error) {
    next(error);
  }
};
