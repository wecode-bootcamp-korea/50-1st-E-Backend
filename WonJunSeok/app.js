const http = require('http');
const express = require('express');
require('dotenv').config();

const { signup, modified , deleteThreads,threadLike, threadLikeDelete, creatingPost, login} = require('./services/postSerices')
const { specificUsers, getAllThreads } = require('./services/appServices')
const mysql = require('mysql2');
const { appDataSource } = require('./services/appdatasource');

const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.json())

app.get('/ping', async (req, res) => {
  res.status(200).json({ message: '/pong' })
})

app.delete('/deleteThread/:threadId', deleteThreads)
app.post("/users/sign-up", signup)
app.post("/login", login)
app.get ('/threads/getAllThreads', getAllThreads)
app.get ('/threads', specificUsers)
app.post('/threads/modifiedThread', modified)
app.post("/users/creatingPost", creatingPost)
app.post("/threadLike", threadLike)
app.post("/threadLikeDelete/", threadLikeDelete)

const server = http.createServer(app)
server.listen(8000, () => {
  console.log('서버가 포트8000에서 돌아가고있어요!')
})





