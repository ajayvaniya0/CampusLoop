import express from 'express';
import {
  getItems,
  getItemById,
  createItem,
  getMyListings,
  updateItem,
  deleteItem,
  seedItems,
} from '../controllers/itemController.js';
import { createRequest } from '../controllers/requestController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getItems);
router.get('/my-listings', auth, getMyListings);
router.get('/:id', getItemById);

// Protected student routes
router.post('/', auth, createItem);
router.put('/:id', auth, updateItem);
router.patch('/:id', auth, updateItem);
router.delete('/:id', auth, deleteItem);
router.post('/seed', auth, seedItems);

// Spec: POST /api/items/:id/requests
router.post('/:id/requests', auth, (req, res, next) => {
  req.body.itemId = req.params.id;
  return createRequest(req, res, next);
});

export default router;
