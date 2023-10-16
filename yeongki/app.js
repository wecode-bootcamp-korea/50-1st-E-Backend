const http = require('http')
const express = require('express')
const { signUp, allUserSearch } = require('./services/userServices')
const { addPost, userPostSearch, changePost, deletePost, addLike, postSearch, removeLike } = require('./services/threadServices')

const app = express()
app.use(express.json())

app.get('/threads/:userId',userPostSearch)  // 특정 id의 포스트 조회
app.get('/users/list',allUserSearch)        // 모든 유저 정보 조회
app.get('/allthreads',postSearch)          // 모든 포스트 조회

app.post('/users/signup',signUp)            // 회원가입
app.post('/threads/addpost',addPost)        // 게시글 등록
app.post('/threads/like',addLike)           // 좋아요 등록
// url에는 가능하면 동사를 넣지 않는다
// 애초에 포스트 메소드로 들어와서 수정이나 등록인걸 알수가 있고, 그걸 어디서 하는지 /threads로 알기만 하면 되게끔 심플하게 쓴다

app.put('/threads/change/:postingId',changePost)     // 게시글 수정

app.delete('/threads',deletePost)           // 게시글 삭제
app.delete('/threads/like',removeLike)    // 좋아요 취소




const server = http.createServer(app)
const start = async () => {
  try {
    server.listen(8000, () => console.log(`Server is listening on 8000`))
  } catch (err) { 
    console.error(err)
  }
}
start()