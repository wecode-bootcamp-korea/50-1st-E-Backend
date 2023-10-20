const { appDataSource } = require('./datasource')
const jwt = require('jsonwebtoken')

// post 신규등록
const addPost = async(req,res)=>{
    try{
        console.log("게시글 입력 시도", new Date()+9)
        const tokken = req.headers.authorization
        const token = tokken.substr(7,tokken.length)
        const unlockToken = jwt.verify(token, process.env.TYPEORM_SECRETKEY)
        const userId = unlockToken.id
        const content = req.body.content
        const postData = await appDataSource.query(`
            insert into threads (user_id,content)
                values('${userId}','${content}')
        `)
        console.log('TYPEORM RETURN DATA : ',postData)
        return res.status(201).json({message:'ADDPOST_SUCCESS'})
    }catch(err){
        res.json({message:"토큰만료"})
    }
}
// 모든 post 조회
const postSearch = async(req,res)=>{
    console.log("모든 포스트 조회 시도", new Date()+9)
    const postSearch = await appDataSource.query(`
        select t.id as postid, u.profile_image as profile_pic, u.nickname, t.content from threads t join users u on t.user_id=u.id order by t.created_at desc;
    `)
    return res.status(200).json(postSearch)
}

// 특정 id의 post 조회
const userPostSearch = async(req,res)=>{
    const email = req.params.userEmail
    const postSearch = await appDataSource.query(`
        select u.nickname, t.content, t.created_at,t.updated_at
        from threads t join users u on t.user_id = u.id
        where email = '${email}' order by created_at desc
    `)
    return res.status(200).json(postSearch)
}

// 기존에 있던 포스트의 내용만 변경
const changePost = async(req,res)=>{
    try{
        console.log("포스트 수정 시도", new Date()+9)
        const tokken = req.headers.authorization
        const token = tokken.substr(7,tokken.length)
        const unlockToken = jwt.verify(token, process.env.TYPEORM_SECRETKEY)    // 토큰 검증
        const userId = unlockToken.id
        const threadId = req.params.postId
        const replaceContent = req.body.content
        // 쓰레드 존재여부 확인
        const existThread = await appDataSource.query(`
        select * from threads
        where user_id = '${userId}'
        `)
        if(existThread.length==0){
            return res.status(400).json({message : "존재하지 않는 게시물"})}
        // 게시물의 작성자와 유저가 일치한지 확인
        const correctUserThreads = await appDataSource.query(`
            select * from threads
            where id = '${threadId}' and user_id = '${userId}'
        `)
        if(correctUserThreads==0){
            return res.status(403).json({message : "일치하지 않는 게시물"})}
        const postReplacement = await appDataSource.query(`
            update threads set content='${replaceContent}'
            where id = '${threadId}' and user_id = '${userId}'
        `)
        const changedCheck = await appDataSource.query(`
            select * from threads
            where id = '${threadId}'
        `)
        console.log('TYPEORM RETURN DATA : ',postReplacement)
        return res.status(201).json({message:'CHANGEPOST_SUCCESS',changedCheck})
    }catch(err){
        res.json({message:"토큰만료"})
    }
}
// 특정 포스트 삭제(body로 삭제할 포스트id를 받음)
const deletePost = async(req,res)=>{
    try{
        const tokken = req.headers.authorization
        const token = tokken.substr(7,tokken.length)
        const unlockToken = jwt.verify(token, process.env.TYPEORM_SECRETKEY)    // 토큰 검증
        const userId = unlockToken.id
        const postId = req.params.postid
        const existPost = await appDataSource.query(`
            select * from threads
            where
            id = '${postId}'
            and user_id = '${userId}'
        `)
        if(existPost.length==0){
            return res.status(403).json({message : "일치하는 게시물이 없습니다"})}
        const deletePost = await appDataSource.query(`
            delete from threads
            where id = '${postId}'
            and user_id = '${userId}'
        `)
        console.log('TYPEORM RETURN DATA : ',deletePost)
        return res.status(200).json({message:'DELETEPOST_SUCCESS'})
    }catch(err){
        res.json({message:"토큰만료"})
    }
}
// 좋아요 누르기
const addLike = async(req,res)=>{
    try{
        console.log("좋아요 시도")
        const tokken = req.headers.authorization
        const token = tokken.substr(7,tokken.length)
        const unlockToken = jwt.verify(token, process.env.TYPEORM_SECRETKEY)    // 토큰 검증
        const userId = unlockToken.id
        const threadId = req.body.postId
        const likeThread = await appDataSource.query(`
            insert into
            thread_likes(
                user_id,
                thread_id)
            values(
                '${userId}',
                '${threadId}')
        `)
        console.log('TYPEORM RETURN DATA : ',likeThread)
        res.status(201).json({message:'LIKE_SUCCESS'})
    }catch(err){
        res.json({message:"토큰만료"})
    }
}
// 좋아요 삭제
const removeLike = async(req,res) => {
    try{
        console.log("좋아요 삭제 시도")
        const tokken = req.headers.authorization
        const token = tokken.substr(7,tokken.length)
        const unlockToken = jwt.verify(token, process.env.TYPEORM_SECRETKEY)    // 토큰 검증
        const userId = unlockToken.id
        const threadId = req.query.postId
        const existThread = await appDataSource.query(`
            select * from thread_likes
            where user_id = '${userId}'
            and thread_id = '${threadId}'
        `)
        if (existThread.length===0) {return res.status(404).json({message:"CORRECT_DATA_NOT_EXIST"})}
        const hateThread = await appDataSource.query(`
            delete from thread_likes
            where user_id = '${userId}'
            and thread_id = '${threadId}'
        `)
        res.status(200).json({message : "UNLIKE_SUCCESS"})
    }catch(err){
        res.json({message:"토큰만료"})
    }
}
// 댓글 쓰기
const addComment = async(req,res) =>{
    try{
        console.log("댓글 쓰기 시도")
        const tokken = req.headers.authorization
        const token = tokken.substr(7,tokken.length)
        const unlockToken = jwt.verify(token, process.env.TYPEORM_SECRETKEY)    // 토큰 검증
        const userId = unlockToken.id
        const threadId = req.body.postId
        const content = req.body.content
        const plusComment = await appDataSource.query(`
            insert into
            thread_comments(
                user_id,
                thread_id,
                content)
            values(
                '${userId}',
                '${threadId}',
                '${content}')
        `)
        res.status(201).json({message : "ADD_COMMENT_SUCCESS"})
    }catch(err){
        res.json({message:"토큰만료"})
    }

}

module.exports={addPost,userPostSearch,changePost,deletePost,addLike,postSearch,removeLike,addComment}