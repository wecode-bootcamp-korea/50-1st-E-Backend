const {appDataSource} = require('./appdatasource')
const jwt = require('jsonwebtoken')


// const token = jwt.sign({id : 1 , email : 'applepc24@naver.com'} , 'secret_Key')
// const varifiedToken = jwt.verify(token, 'secret_Key' )
// const userId = varifiedToken.id
// console.log(userId)


// 전체 게시물 조회하기
const getAllThreads = async (req, res) => {
  const userData = await appDataSource.query(`
  select users.id,
  users.profile_image,
  threads.user_id,
  threads.content
  from users, threads
  where users.id = threads.user_id 
  `)
 return res.status(200).json({userData})
}

//특정 게시물 조회하기
const specificUsers = async (req, res) => {
    const userData3 = await appDataSource.query(`
      select users.id,
      users.profile_image,
      threads.user_id,
      threads.content
      from users left join threads on users.id = threads.user_id;
    `)
    return res.status(200).json({userData3})
  }

module.exports = { getAllThreads, specificUsers }
