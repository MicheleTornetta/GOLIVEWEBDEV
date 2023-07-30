import httpProxy from 'http-proxy';
import http from 'http';
import dotenv from 'dotenv';
import fs from 'fs';

if (dotenv.config({ path: "./vars.env" }).error) {
    throw new Error('Missing vars.env!');
}

const PORT = process.env.PORT_HTTP;

httpProxy.createServer({
    target: {
        host: 'localhost',
        port: PORT
    },
    ssl: {
        key: fs.readFileSync(process.env.HTTPS_KEY_LOCATION as string, 'utf8'),
        cert: fs.readFileSync(process.env.HTTPS_CERT_LOCATION as string, 'utf8')
    },
}).listen(443);

http.createServer((req, res) => {
    res.writeHead(302, {
        'Location': 'https://www.golivewebdev.com/' + req.url,
    }).end();
}).listen(80);