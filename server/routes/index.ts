import express from 'express';
import apiRoutes from './api';
import blogRoutes from './blog';

const router = express.Router();

router.use('/api', apiRoutes);
router.use('/blog', blogRoutes);

export default router;