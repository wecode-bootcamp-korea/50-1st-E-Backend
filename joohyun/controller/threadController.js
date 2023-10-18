const threadService = require('../services/threadService')
const getThreads = async (req,res) => {
    try{
        const threads = await threadService.getThreads()
        console.log(threads)
        res.status(200).json({threads}) 
    }catch(err){
        res.status(500).json({message: "error"})
    }
}

const getThread = async (req,res) => {
    const id = req.params.id
    try{
        const thread = await threadService.getThread(id)
        res.status(200).json({thread})
    }catch(err){
        res.status(404).json({message: "error"})
    }
}

const createThread = async(req,res) => {
    const {userId,content} = req.body
    try{
        await threadService.createThread(userId,content)
        res.status(200).json({message: "threadCreated"})

    }catch(err){
        res.status(404).json({message: "error"})
    }
}

const updateThread = async(req,res) => {
    const {userId,threadId,content} = req.body
    const {token} = req
    console.log(token)
    try{
        await threadService.updateThread(userId,threadId,content)
        res.status(200).json({message: "threadUpdated"})
    }catch(err){
        res.status(404).json({message: "error"})
    }
}
const deleteThread = async(req,res) => {
    const id = req.params.id
    const threadId = req.params.threadId
    // const checkUser = await userService.checkUser(id)

    // if(checkUser !== id){
    //     res.status(400).json({message: "User not found"})
    // }

    try{
        await threadService.deleteThread(id,threadId)
        res.status(200).json({ message: 'Thread deleted' });
    }catch(err){
        res.status(404).json({message: "error"})
    }
}
module.exports = {
    getThreads,getThread,createThread,updateThread,deleteThread
}