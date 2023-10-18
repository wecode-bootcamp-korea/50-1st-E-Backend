const http = require('http')
const express = require('express')
const routes = require("./routes");

// const {signUp} = require('./services/userService')
// const {thread, getThread, getThreads,updateThread,deleteThread,threadLike } = require('./services/threadService')
const app = express()
app.use(express.json())
app.use(routes)

app.get('/',(req,res) => {
    res.status(200).json({
        message: "hello"
    })
})

// app.post("/users/sign-up", signUp)
// app.post("/threads/thread",thread)
// app.get("/threads",getThreads)
// app.get("/thread/:userId",getThread)
// app.put("/thread/update",updateThread)
// app.delete("/thread/delete",deleteThread)
// app.post("/thread/like",threadLike)

const server = http.createServer(app)

const start = async () => { // 서버를 시작하는 함수입니다.
    try {
      server.listen(8000, () => console.log(`Server is listening on 8000`))
      
    } catch (err) { 
      console.error(err)
    }
  }

start()
