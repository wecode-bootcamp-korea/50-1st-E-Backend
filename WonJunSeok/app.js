// setting 0. nodemon 설치
// 0-1 
// 1. 회원가입하는 함수 생성
// 1-1. request body로 부터 사용자 정보 꺼내기 (받아오기)
// 1-2. email, password, name를 Databases 에 저장한다.
// 1-3. DB에 저장되었는지 확인하기
// 1-4. front 에게 저장이 잘 되었다는 소식을 보내기

//2. 우리의 Express app에 회원가입하는 함수 연결
//2-1 HTTP method 와 HTTp url 같이 설정
//2-1-1 appDataSourcs 만들기
//2-1-2 sql문 명령하기
//2-2 진짜로 연결

const http = require('http')
const express = require('express')
// const { DataSource } = require('typeorm')
const { signup, modified , deleteThreads,
        threadLike, threadLikeDelete, creatingPost,} 
= require('./services/postSerices')
const { specificUsers, getAllThreads } = require('./services/appServices')
const mysql = require('mysql2');
const { appDataSource } = require('./services/appdatasource');
//const appDataSource = new DataSource({
//  type: 'mysql',
// host: 'localhost',
//  port: '3306',
//  username: 'root',
//  password: '863870',
//  database: 'wecode_thread'
//})

const app = express()
app.use(express.json())

app.get('/ping', async (req, res) => {
  res.status(200).json({ message: '/pong' })
})

app.delete('/deleteThread', deleteThreads)
app.post("/users/sign-up", signup)
app.get ('/threads/getAllThreads', getAllThreads)
app.get ('/threads', specificUsers)
app.post('/threads/modifiedThread', modified)
app.post("/users/creatingPost", creatingPost)
app.post("/threadLike", threadLike)
app.post("/threadLikeDelete", threadLikeDelete)

const server = http.createServer(app)
server.listen(8000, () => {
  console.log('서버가 포트8000에서 돌아가고있어요!')
})
//appDataSource.initialize()
//  .then(() => {
//    console.log("Data Source has been initialized!")
//  })




