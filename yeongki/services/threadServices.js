const { appDataSource } = require('./datasource')

// post 신규등록
const addPost = async(req,res)=>{
    const userId = req.body.id
    const content = req.body.content
    const postData = await appDataSource.query(`
        insert into threads (user_id,content)
            values('${userId}','${content}')
    `)
    console.log('TYPEORM RETURN DATA : ',postData)
    return res.status(201).json({message:'ADDPOST_SUCCESS'})
}
// 모든 post 조회
const postSearch = async(req,res)=>{
    const postSearch = await appDataSource.query(`
        select * from threads
    `)
    return res.status(200).json(postSearch)
}
// 특정 id의 post 조회
const userPostSearch = async(req,res)=>{
    const data = req.params.userId
    const postSearch = await appDataSource.query(`
        select * from threads where user_id = '${data}' order by created_at desc
    `)
    return res.status(200).json(postSearch)
}
// 기존에 있던 포스트의 내용만 변경
const changePost = async(req,res)=>{
    const userId = req.body.userId
    const threadId = req.params.postingId
    const replaceContent = req.body.postingContent
    const existThread = await appDataSource.query(`
        select * from threads where id = '${threadId}'
    `)
    if(existThread.length==0){return res.status(400).json({message : "존재하지 않는 게시물"})}
    const existUserId = await appDataSource.query(`
        select * from users where id = '${userId}'
    `)
    if(existUserId.length==0){return res.status(400).json({message : "존재하지 않는 계정"})}
    const correctUserThreads = await appDataSource.query(`
        select * from threads where id = '${threadId}' and user_id = '${userId}'
    `)
    console.log(correctUserThreads)
    if(correctUserThreads==0){return res.status(403).json({message : "일치하지 않는 게시물"})}
    const postReplacement = await appDataSource.query(`
        update threads set content='${replaceContent}' where id = '${threadId}' and user_id = '${userId}'
    `)
    const changedCheck = await appDataSource.query(`
        select * from threads where id = '${threadId}'
    `)
    console.log('TYPEORM RETURN DATA : ',postReplacement)
    return res.status(201).json({message:'CHANGEPOST_SUCCESS',changedCheck})
}
// 특정 포스트 삭제(body로 삭제할 포스트id를 받음)
const deletePost = async(req,res)=>{
    const deleteUserId = req.param('userid')
    const deletePostId = req.param('postid')
    const existPost = await appDataSource.query(`
        select * from threads where id = '${deletePostId}' and user_id = '${deleteUserId}'
    `)
    if(existPost.length==0){return res.status(403).json({message : "일치하는 게시물이 없습니다"})}
    const deletePost = await appDataSource.query(`
         delete from threads where id = '${deletePostId}' and user_id = '${deleteUserId}'
     `)
    console.log('TYPEORM RETURN DATA : ',deletePost)
    return res.status(204).json({message:'DELETEPOST_SUCCESS'})
}
// 좋아요 누르기
const addLike = async(req,res)=>{
    const likeUserId = req.body.userId
    const likeThreadId = req.body.postingId
    const likeThread = await appDataSource.query(`
        insert into thread_likes(user_id,thread_id) values('${likeUserId}', '${likeThreadId}')
    `)
    res.status(201).json({message:'LIKE_SUCCESS'})
}
// 좋아요 삭제
const removeLike = async(req,res) => {
    const hateUserId = req.query.userid
    const hateThreadId = req.query.postid
    const existThread = await appDataSource.query(`
        select * from thread_likes where user_id = '${hateUserId}' and thread_id = '${hateThreadId}'
    `)
    if (existThread.length===0) {return res.status(404).json({message:"CORRECT_DATA_NOT_EXIST"})}
    const hateThread = await appDataSource.query(`
        delete from thread_likes where user_id = '${hateUserId}' and thread_id = '${hateThreadId}'
    `)
    res.status(200).json({message : "UNLIKE_SUCCESS"})
}

module.exports={addPost,userPostSearch,changePost,deletePost,addLike,postSearch,removeLike}