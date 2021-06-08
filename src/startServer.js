const express = require("express");
const { getRoutes } = require("./routes");
const logger = require("loglevel");
const cors = require("cors");
require("dotenv").config();

function startServer({ port = process.env.PORT } = {}) {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(
        cors({
            origin: process.env.FRONTEND_URL
        })
    );

    app.use("/api", getRoutes());
    app.use(errorMiddleware);

    return new Promise((resolve) => {
        const server = app.listen(port, () => {
            console.log(`App running on port port ${server.address().port}`);
            const serverClose = server.close.bind(server);
            server.close = () => {
                return new Promise((resolveServerClose) => {
                    serverClose(resolveServerClose);
                });
            };

            setupExitHandler(server);
            resolve(server);
        });
    });

    function errorMiddleware(error, req, res, next) {
        logger.error(error);
        res.status(500);
        res.json({
            message: error.message,
            ...(process.env.NODE_ENV === "production"
                ? null
                : {
                      stack: error.stack
                  })
        });
    }
}

function setupExitHandler(server) {
    async function exitHandler({ options = {} }) {
        await server
            .close()
            .then(() => {
                logger.info("Server successfully closed");
            })
            .catch((err) => {
                logger.error(
                    "Something went wrong closing the server",
                    err.stack
                );
            });
        if (options.exit) process.exit();
    }

    process.on("SIGINT", exitHandler.bind(null, { exit: true }));
    process.on("SIGTERM", exitHandler.bind(null, { exit: true }));

    process.on("uncaughtException", (err) => {
        log.error("There was uncaught error: ", err);
        process.exit(1);
    });
}

module.exports = { startServer };
