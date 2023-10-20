const http = require('http')
const express = require('express')
const cors = require('cors')
const { signUp,
        allUserSearch,
        signIn } = require('./services/userServices')
const { addPost,
        userPostSearch,
        changePost,
        deletePost,
        addLike,
        postSearch,
        removeLike,
        addComment} = require('./services/threadServices')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/users/list',allUserSearch)           // 모든 유저 정보 조회
app.get('/threads/all',postSearch)             // 모든 포스트 조회
// app.get('/threads/all',async(req,res)=>{res.json({message:"가긴 가나"})})
app.get('/threads/:userEmail',userPostSearch)  // 특정 id의 포스트 조회

app.post('/users/signin',signIn)             // 로그인

app.post('/users/signup',signUp)            // 회원가입
app.post('/threads/addpost',addPost)        // 게시글 등록
app.post('/threads/like',addLike)           // 좋아요 등록
app.post('/threads/addcomment',addComment)  // 댓글 쓰기
// url에는 가능하면 동사를 넣지 않는다
// 애초에 포스트 메소드로 들어와서 수정이나 등록인걸 알수가 있고, 그걸 어디서 하는지 /threads로 알기만 하면 되게끔 심플하게 쓴다

app.put('/threads/change/:postId',changePost)     // 게시글 수정

app.delete('/threads/:postingId',deletePost)           // 게시글 삭제
app.delete('/threads/like',removeLike)    // 좋아요 취소




const server = http.createServer(app)
const start = async () => {
  try {
    server.listen(process.env.TYPEORM_URLPORT, () => console.log(`Server is listening on ${process.env.TYPEORM_URLPORT}`))
  } catch (err) { 
    console.error(err)
  }
}
start()