import express from 'express';
import sql from '../../db/connection';
import { marked } from 'marked';
import { readFile } from 'fs';

const router = express.Router();

router.get('/:blogId', async (req, res, next) => {
    console.log(req.params);
    const blogId = req.params.blogId;

    const filePaths = await
        sql<{ file_path: string }[]>`SELECT file_path FROM Posts WHERE post_id = ${blogId};`;

    console.log(filePaths);

    if (filePaths.length !== 1) {
        res.status(404).redirect('/');
        return;
    }

    const filePath = filePaths[0].file_path;

    readFile(`./templated/blog/${filePath}`, (err, data) => {
        if (err) {
            res.status(404).redirect('/');

            console.error(err);
        }

        const parsedHtml = marked.parse(data.toLocaleString(), {
            mangle: false
        });

        res.status(200).type('html').send(parsedHtml);
    });
});

export default router;