import express from 'express';


import userRoutes from './users-router';
import postRoutes from './posts-router';
import commentsRoutes from './comments-routes';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentsRoutes);

export default router;