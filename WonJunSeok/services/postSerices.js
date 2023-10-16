const { appDataSource } = require('./appdatasource')

// 유저 회원가입

const signup = async (req, res) => {
  // const requestBody = req.body

  const userName = req.body.name;
  const userEmail = req.body.email;
  const userPassoword = req.body.passoword;

  const userData = await appDataSource.query(`
      insert into users (
        nickname,
        passoword,
        email
      )
      values (
      '${userName}',
      '${userPassoword}', 
      '${userEmail}'
      )
    `)

  console.log(userData)

  res.status(200).json({ 'message': 'signup-success' })
}

// 유저 게시글 등록

const creatingPost = async (req, res) => {
  const userId = req.body.user_id;
  const userContent = req.body.content;

  const userData1 = await appDataSource.query(`
  insert into threads (
    user_id,
    content
  )values (
    '${userId}',
    '${userContent}'
  )
`)
  console.log(userData1)
  res.status(200).json({ 'mesage': 'postCreated!' })
}


// 1. 게시물 수정
const modified = async (req, res) => {
  const threadId1 = req.body.threadId;
  const userContent1 = req.body.content;

  const threadexist = await appDataSource.query(`
  select id from threads where id= 10
  `)
  if (threadexist.length === 0) {
    return res.status(400).json({ 'message': 'not found thread!' })
  }

  const userNotMatch = await appDataSource.query(`
  select users.id, threads.user_id from users, threads;
  `)
  
  // 1. 게시글 수정 

  const appData = await appDataSource.query(`
  update threads set content = '${userContent1}' where id= '${threadId1}'
  `)

  // 2. 결과값 반환 
  const data = await appDataSource.query(`
  select id , content from threads where id = '${threadId1}'
  `)

  res.status(200).json({ 'data': data })
}


// 게시물 삭제하기

const deleteThreads = async (req, res) => {
  const threadId2 = req.body.threadId;

  const userData5 = await appDataSource.query(`
  DELETE FROM threads WHERE id = '${threadId2}'
  `)
  res.status(200).json({ 'message': 'postingDeleted' })
}

// 좋아요 누르기 종아요 를 누르면 db에 저장해야 하는 내용?
// 
const threadLike = async (req, res) => {
  const userId = req.body.user;
  const threadId = req.body.thread

  const userData6 = await appDataSource.query(`
  insert into thread_likes(user_id, thread_id) values ('${userId}','${threadId}' )
  `)
  res.status(200).json({ 'message': 'LikeCreated!' })

}

// 좋아요 취소

const threadLikeDelete = async (req, res) => {
  const userId = req.body.user;
  const threadId = req.body.thread

  await appDataSource.query(`
  delete from thread_likes where user_id = ('${userId}') and thread_id = ('${threadId}')
  `)
  res.status(200).json({ 'message': 'LikeDeleted!' })
}

module.exports =
  { modified, deleteThreads, threadLike, threadLikeDelete, signup, creatingPost };
