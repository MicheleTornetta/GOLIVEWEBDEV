import express, { Request, Response } from 'express';
import sql from '../../db/connection';
import { marked } from 'marked';
import { readFile } from 'fs';
import ejs from 'ejs';
import { rateLimit } from 'express-rate-limit';
import { log } from 'console';

const router = express.Router();

router.get('/:blogId', async (req, res, next) => {
    const blogIdArg = req.params.blogId;
    const blogId = Number(blogIdArg);

    if (isNaN(blogId)) {
        res.status(404).redirect('/');
        return;
    }

    try {
        const filePaths = await
            sql<{ file_path: string }[]>`SELECT file_path FROM Posts WHERE post_id = ${blogId};`;

        renderAndSend(filePaths, blogId, req, res);
    }
    catch (_) {
        res.status(404).redirect('/');
    }
});

router.get('/', async (req, res, next) => {
    const filePathsAndPostId = await
        sql<{
            file_path: string,
            post_id: number,
        }[]>`SELECT file_path, post_id FROM Posts ORDER BY created_date DESC LIMIT 1;`;

    let filePaths: DatabaseResult = [];
    // This value will never be used if filePaths is empty
    let postId = -1;

    if (filePathsAndPostId.length === 1) {
        filePaths.push({ file_path: filePathsAndPostId[0].file_path });
        postId = filePathsAndPostId[0].post_id;
    }

    await renderAndSend(filePathsAndPostId, postId, req, res);
});

type DatabaseResult = { file_path: string }[];

async function renderAndSend(filePaths: DatabaseResult, postId: number, req: Request, res: Response) {
    if (filePaths.length !== 1) {
        res.status(404).redirect('/');
        return;
    }

    const filePath = filePaths[0].file_path;

    // Get all posts to display on the right navigation menu
    const allPosts = await sql<{
        post_id: number,
        title: string
    }[]>`SELECT post_id, title FROM Posts ORDER BY created_date DESC`;

    readFile(`./blog/${filePath}`, async (err, data) => {
        if (err) {
            res.status(404).redirect('/404');
            console.error(err);
            return;
        }

        let blogHtml = marked.parse(data.toLocaleString(), {
            mangle: false,
            headerIds: false,
        });

        const comments = await sql<{
            created_date: Date,
            commenter: string,
            text: string
        }[]>`
        SELECT 
            Comments.created_date, 
            comment as text, 
            COALESCE(Users.username, '<deleted>') as username
        FROM Comments 
            LEFT JOIN Users ON Users.user_id = Comments.user_id
            WHERE post_id = ${postId}
            ORDER BY Comments.created_date DESC`;

        ejs.renderFile("templated/blog.ejs", {
            user: req.session.user,
            blogHtml,
            allPosts,
            postId,
            comments
        }, function (err, compiled) {
            if (err) {
                console.error(err);
                res.status(404).send("Post not found");
            } else {
                res.status(200).send(compiled);
            }
        });

    });
}


export default router;