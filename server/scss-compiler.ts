import sass from "node-sass";
import { Request, Response } from "express";

const compiledCSS: { [key: string]: string } = {};

function getCompileScssFunction(isProd: boolean) {
    return function compileScss(req: Request, res: Response, next: Function) {
        const requestedPath = req.url;

        if (isProd) {
            // We don't expect changes to CSS in prod
            const alreadyCompiledCss = compiledCSS[requestedPath];
            if (alreadyCompiledCss) {
                res.type('css').send(alreadyCompiledCss);
                return;
            }
        }

        const scssPath = './templated/' + requestedPath.replace('.css', '.scss');

        sass.render({
            file: scssPath,
        }, (err, result) => {
            if (err) {
                if (!isProd) {
                    const error = `[${err.name} (${err.status})] - ${err.message}\n\n${err.stack}`;

                    res.status(404).type('text').send(error);
                }
                else {
                    res.sendStatus(404);
                }
            }
            else {
                const css = result.css.toString();
                compiledCSS[requestedPath] = css;
                res.type('css').send(css);
            }
        });
    }
}

export default getCompileScssFunction;
