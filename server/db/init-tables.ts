import fs from 'fs';
import glob from 'glob';

(async () => {
    for (const sqlFile of (await glob('./server/db/scripts/tables/*.sql'))) {
        console.log(sqlFile);
    }
})();
