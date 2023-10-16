const { appDataSource } = require('./datasource')

// 신규 회원가입
const signUp = async(req,res)=>{
    const userName = req.body.nickname
    const userEmail = req.body.email
    const userPassword = req.body.password
    if (userEmail.indexOf("@")==-1 || userEmail.indexOf(".")==-1) {return res.json({message : "이메일의 형식이 올바르지 않습니다"})}
    if (userPassword.length!==8){return res.json({message : "비밀번호는 8자 이상이어야 합니다."})}
    // 이미지 주소를 따로 안받을때 기본 이미지를 넣는 함수 추가
    // 이메일 형식과 비밀번호 조건을 두가지 모두 충족하지 않을 시 두가지 모두를 알리는 함수 추가
    const userData = await appDataSource.query(`
        insert into users (nickname, email, password)
            values ('${userName}', '${userEmail}', '${userPassword}')
    `)
    console.log('TYPEORM RETURN DATA : ',userData)
    return res.status(201).json({message:'SIGNUP_SUCCESS'})
}

// 모든 유저 정보 조회
const allUserSearch = async(req,res)=>{
    const userSearch = await appDataSource.query(`
        select * from users
    `)
    return res.status(200).json(userSearch)
}

module.exports = { signUp, allUserSearch }