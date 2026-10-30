import express from 'express';
import {
  createRequest,
  getSentRequests,
  getIncomingRequests,
  getRequestById,
  approveRequest,
  rejectRequest,
  cancelRequest,
  decideRequest,
} from '../controllers/requestController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth); // All request routes require authentication

router.post('/', createRequest);
router.get('/sent', getSentRequests);
router.get('/incoming', getIncomingRequests);
router.get('/received', getIncomingRequests); // Spec route
router.get('/:id', getRequestById);
router.patch('/:id/approve', approveRequest);
router.patch('/:id/reject', rejectRequest);
router.patch('/:id/decision', decideRequest); // Spec route
router.patch('/:id/cancel', cancelRequest);

export default router;
