import express from 'express';


import postRoutes from './posts-router';
import commentsRoutes from './comments-routes';

const router = express.Router();

router.use('/posts', postRoutes);
router.use('/comments', commentsRoutes);

export default router;