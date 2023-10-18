//routes/index.js

const express = require("express");
const router = express.Router();

const userRouter = require("./userRouter");
const threadRouter = require("./threadRouter")
router.use("/users", userRouter.router);
router.use("/threads",threadRouter.router)


module.exports = router;