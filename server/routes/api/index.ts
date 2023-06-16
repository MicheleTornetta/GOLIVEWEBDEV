import express from 'express';


import postRoutes from './posts-router';
import commentsRoutes from './comments';
import contact from './contact';

const router = express.Router();

router.use('/posts', postRoutes);
router.use('/comments', commentsRoutes);
router.use('/contact', contact);

export default router;