import express from 'express';
import authRoutes from './auth/auth.routes.js';
import publicRoutes from './public/public.routes.js';
import adminRoutes from './admin/admin.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/public', publicRoutes);
router.use('/admin', adminRoutes);

// Legacy routes for backward compatibility
router.use('/', publicRoutes);

export default router;