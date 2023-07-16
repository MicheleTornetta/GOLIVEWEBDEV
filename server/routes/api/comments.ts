// External Dependencies

import express, { Request, Response } from "express";
import sql from "../../db/connection";
import rateLimit from "express-rate-limit";
import purify from '../../utils/purify';

const router = express.Router();

interface RawComment {
    text?: string,
    postId?: string,
}

const ONE_HOUR = 60 * 60 * 1000;

const commentRateLimiter = rateLimit({
    windowMs: ONE_HOUR,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/create-comment', commentRateLimiter, async (req: Request<any, any, RawComment>, res) => {
    if (!req.session.user) {
        res.status(400).send({
            error: 'Must be logged in to do this!'
        });
        return;
    }

    const { text: textRaw, postId: postIdRaw } = req.body;
    if (!textRaw) {
        res.status(400).send({
            error: 'Missing text'
        });
        return;
    }

    if (!postIdRaw) {
        res.status(400).send({
            error: 'Missing post id'
        });
        return;
    }

    const text = textRaw.trim();
    const postId = Number(postIdRaw);

    if (isNaN(postId)) {
        res.status(400).send({
            error: 'Invalid post id'
        });
        return;
    }

    if (text.length === 0 || text.length >= 2000) {
        res.status(400).send({
            error: 'Invalid text length'
        });
        return;
    }

    try {
        const userId = req.session.user.userId;

        await sql`INSERT INTO Comments (comment, created_date, user_id, post_id) VALUES (
            ${text}, ${new Date()}, ${userId}, ${postId}
        )`;

        res.status(200).send({
            text: purify(text),
        });
    }
    catch (ex) {
        console.error(ex);
        res.status(500).send({
            error: 'Something went wrong.'
        });
    }
});

export default router;
