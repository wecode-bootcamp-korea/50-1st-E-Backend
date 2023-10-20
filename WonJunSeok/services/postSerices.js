const { appDataSource } = require('./appdatasource')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// const payLoad = { email: email };
// const secretKey = process.env.SECRET_KEY;
// const jwtToken = jwt.sign(payLoad, secretKey);
// console.log(jwtToken);

// 유저 회원가입

const signup = async (req, res) => {
  // const requestBody = req.body
  const userName = req.body.nickname || 'wonjunseok'
  const userEmail = req.body.email;
  const userPassoword = req.body.passoword;
  const userPhoneNumber = req.body.phoneNumber || null;
  const userprofileImage = req.body.profileImage || "https://www.thelec.kr/news/photo/201906/1962_1934_5855.jpg"
  const userBirthday = req.body.birthday || null;

  const dBuserEmail = await appDataSource.query(`
  select email from users where email = '${userEmail}'
  `)
  if (dBuserEmail.length !== 0) {
    return res.json({ 'message': '이미 존재하는 이메일입니다!' })
  }


  const saltRounds = 10
  const hashedpassword = await bcrypt.hashSync(userPassoword, saltRounds);
  console.log(hashedpassword)
  const userData = await appDataSource.query(`
      insert into users (
        nickname,
        passoword,
        email
      )
      values (
      '${userName}',
      '${hashedpassword}', 
      '${userEmail}'
      )
    `)
  console.log(userData)

  res.status(200).json({ 'message': 'signup-success' })
}
// 유저 로그인


const login = async (req, res) => {
  const { email, passoword } = req.body;
  try {
    const user = await appDataSource.query(`
      select * from users where email = '${email}'
    `);
    console.log(user)
    const dataBaseUserId = user[0].id
    console.log(dataBaseUserId)
    const secretPassword = user[0].passoword;
    const result = await bcrypt.compare(passoword, secretPassword);

    if (!result) {
      return res.status(403).json({ 'message': '로그인 정보 불일치!' });
    }
    // const userId = await appDataSource.query(`
    // SELECT id FROM users WHERE email = "${email}"
    // `)
    const payLoad = { email: email, user_id: dataBaseUserId };
    console.log(payLoad)
    const secretKey = process.env.SECRET_KEY;
    const jwtToken = jwt.sign(payLoad, secretKey);
    console.log(jwtToken);

    return res.status(200).send({ message: '로그인 성공!', authorization : jwtToken });
  } catch {
    return res.status(500).json({ 'message': '로그인 정보 불일치!' });
  }
};

// 유저 게시글 등록

const creatingPost = async (req, res) => {
  const content = req.body.content;
  const token = req.headers.authorization;
  const frontToken = token.substr(7)
  try {
    const secretKey = process.env.SECRET_KEY;
    const verifiedToken = jwt.verify(frontToken, secretKey);
    const verifiedId = verifiedToken.user_id
    // if (user_id !== verifiedToken.user_id) {
    //   return res.status(400).json({ 'message': '게시물을 등록할 수 없습니다!' })
    // }
    const userData = await appDataSource.query(`
  insert into threads (
    user_id,
    content
  )values (
    '${verifiedId}',
    '${content}'
  )
`)
    console.log(userData)
    return res.status(200).json({ 'message': 'postCreated!' })
  } catch (error) {
    return res.status(500).json({ 'message': '사용자가 일치하지 않습니다!' })
  }

}


// 1. 게시물 수정
const modified = async (req, res) => {
  const content = req.body.content;
  const token = req.headers.authorization;
  const frontToken = token.substr(7)
  const secretKey = process.env.SECRET_KEY;
  const verifiedToken = jwt.verify(frontToken, secretKey);
  const verifiedId = verifiedToken.user_id
  const dataBaseThreadId = await appDataSource.query(`
  select users.id, threads.user_id from users, threads where users.id = threads.user_id and users.id = '${verifiedId}'
  `)
  console.log(dataBaseThreadId[0].user_id)
  if(dataBaseThreadId[0].user_id !== verifiedId || dataBaseThreadId.length === 0){
    return res.status(500).json({'message' : '사용자가 아닙니다!'})
  }
  await appDataSource.query(`
  update threads set content = '${content}' where user_id = '${dataBaseThreadId[0].user_id}'
   `)

  const data = await appDataSource.query(`
  select content from threads where user_id = '${dataBaseThreadId[0].user_id}'
  `)
  return res.status(200).json({'message': '게시물이 수정되었습니다.', 'data' : data})
}

// 게시물 삭제하기
const deleteThreads = async (req , res) => {
  const threadId = req.params.threadId;
  console.log(threadId)
  const token = req.headers.authorization;
  const frontToken = token.substr(7);
  const secretKey = process.env.SECRET_KEY;
  const verifiedToken = jwt.verify(frontToken, secretKey);
  const verifiedId = verifiedToken.user_id
  const threadUserId = await appDataSource.query(`
    select user_id from threads where id = '${verifiedId}'
  `)
  console.log(threadUserId)
  if(threadUserId.length === 0 ){
    return res.status(500).json({'message': '쓰레드가 존재하지 않습니다!'})
  }
  await appDataSource.query(`
  delete from threads where id = '${threadId}' and user_id = '${verifiedId}' 
  `)
  res.status(200).json({'message' : '쓰레드가 삭제되었습니다!'})
}



// const deleteThreads = async (req, res) => {
//   const threadId2 = req.body.threadId;
  
//   const existTd = await appDataSource.query(`
//   select id, content, user_id from threads where threads.id = 1
//   `)
//   if (existTd.length === 0) {
//     res.status(401).json({ 'messgae': 'threads not found!' })
//   }
//   const existUdt = await appDataSource.query(`
//   select id, email from users where users.id = 3
//   `)

//   if (existUdt.length === 0) {
//     res.status(401).json({ 'message': 'users not found!' })
//   };

//   const postingthread1 = existTd[0].user_id;
//   const postinguser1 = existUdt[0].id;

//   if (postingthread1 !== postinguser1) {
//     res.status(401).json({ 'message': 'unauthorized person!' })
//   }

//   await appDataSource.query(`
//   DELETE FROM threads WHERE id = '${threadId2}'
//   `)
//   res.status(200).json({ 'message': 'postingDeleted' })
// }

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
  { modified, deleteThreads, threadLike, threadLikeDelete, signup, creatingPost, login };
