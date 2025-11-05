import express from 'express';
import { env } from '~/config/environment';

import exitHook from 'async-exit-hook';
import { CLOSE_DB, CONNECT_DB, GET_DB } from '~/config/mongodb';
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware';

import { APIs_V1 } from '~/routes/v1';
import { corsOptions } from '~/config/cors';
import cors from 'cors';

const START_SERVER = () => {
    const app = express();
    //xu ly cors
    app.use(cors(corsOptions));

    //Enable req.body json data
    app.use(express.json());

    // de k bi quay lai cache tren web
    app.use((req, res, next) => {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        next();
    });

    // // use APIs_V1
    app.use('/v1', APIs_V1);

    // middlieware xu ly loi tap trung
    app.use(errorHandlingMiddleware);

    const HOST = env.APP_HOST || 'localhost';
    const PORT = env.APP_PORT || 8017;

    app.get('/', (req, res) => {
        // Test Absolute import mapOrder
        res.end('<h1>Hello World!</h1><hr>');
    });

    if (env.BUILD_MODE === 'prod') {
        app.listen(process.env.PORT, () => {
            // eslint-disable-next-line no-console
            console.log(`✅ Server is running at http://${HOST}:${process.env.PORT}/`);
        });
    } else {
        app.listen(PORT, HOST, () => {
            // eslint-disable-next-line no-console
            console.log(`✅ Server is running at http://${HOST}:${PORT}/`);
        });
    }

    exitHook((signal) => {
        CLOSE_DB();
    });
};

CONNECT_DB()
    .then(() => console.log('Connected to MongoDB'))
    .then(() => START_SERVER())
    .catch((e) => {
        console.error(e);
        process.exit(0);
    });
