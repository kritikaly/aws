import express from "express";
import log from "./logger";
import connect from "./api/v1/model/db";
import routes from "./api/v1/routes";
import { serverErrorHandler } from "./config/helperFunctions";
import cors from "cors";
// import config from "config";

const port: number = 4545; // config.get("port") as number;
const host: string = 'localhost'; // config.get("host") as string;

const app = express();


app.use(express.json(), express.urlencoded({extended: false}));
app.use(cors());

app.use('/api/v1/', routes);

app.use(serverErrorHandler);

app.listen(port, host, () => {
    log.info(`server is live on port ${port}`);
    connect();
});

