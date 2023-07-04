import express, { Request, Response } from 'express';
import sql from '../../db/connection';
import { marked } from 'marked';
import { readFile } from 'fs';
import ejs from 'ejs';

const router = express.Router();

router.get('/:blogId', async (req, res, next) => {
    const blogId = req.params.blogId;

    if (isNaN(Number(blogId))) {
        res.status(404).redirect('/');
        return;
    }

    try {
        const filePaths = await
            sql<{ file_path: string }[]>`SELECT file_path FROM Posts WHERE post_id = ${blogId};`;

        renderAndSend(filePaths, req, res);
    }
    catch (_) {
        res.status(404).redirect('/');
    }
});

router.get('/', async (req, res, next) => {
    const filePaths = await
        sql<DatabaseResult>`SELECT file_path FROM Posts ORDER BY created_date DESC LIMIT 1;`;

    await renderAndSend(filePaths, req, res);
});

type DatabaseResult = { file_path: string }[];

async function renderAndSend(filePaths: DatabaseResult, req: Request, res: Response) {
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

    readFile(`./blog/${filePath}`, (err, data) => {
        if (err) {
            res.status(404).redirect('/404');
            console.error(err);
            return;
        }

        const blogHtml = marked.parse(data.toLocaleString(), {
            mangle: false,
            headerIds: false,
        });

        ejs.renderFile("templated/blog.ejs", {
            user: req.oidc.user,
            blogHtml,
            allPosts
        }, function (err, compiled) {
            if (err) {
                res.status(404).send("404 not found ;(");
            } else {
                res.status(200).send(compiled);
            }
        });

    });
}

export default router;