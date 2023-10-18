//routes/userRouter.js

const express = require('express');
const threadController = require("../controller/threadController")

const router = express.Router();

router.get('/all',threadController.getThreads)
router.get('/thread/:id',threadController.getThread)
router.post('/postThread',threadController.createThread)
router.put('/updateThread',threadController.updateThread)
router.delete('/deleteThread/:id/:threadId',threadController.deleteThread)

module.exports = {
	router
}