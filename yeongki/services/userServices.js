const { appDataSource } = require('./datasource')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// 로그인
const signIn = async(req,res) =>{
    console.log("로그인 시도", new Date()+9)
    const userEmail = req.body.email
    const userPassword = req.body.password
    console.log(req.body)
    const findData = await appDataSource.query(`
        select id, password from users where email = '${userEmail}'
    `)
    console.log(findData)
    if (findData.length === 0) {
        console.log('no user')
        return res.status(400).json({message: "EMAIL_NOT_FOUND"})
    }
    const findedId = findData[0].id
    const findedPassword = findData[0].password
    console.log(findedId)
    console.log(findedPassword)
    const test = await bcrypt.compare(userPassword,findedPassword)
    if(!test){return res.status(403).json({message:"WRONG_PASSWORD"})}
    // 토큰 발급
    const newToken = jwt.sign({id:findedId,email:userEmail},process.env.TYPEORM_SECRETKEY,{expiresIn : 60*60})
    return res.status(200).json({message : "LOGIN_SUCCESS",token : newToken})    
}

// 신규 회원가입
const signUp = async(req,res)=>{
    console.log("회원가입시도", new Date()+9)
    console.log(req.body)
    const userNickname = req.body.nickname || 'yeongki'
    const userEmail = req.body.email
    const userPassword = req.body.password
    const userPhonenumber = req.body.phoneNumber || ""
    const userBirthday = req.body.birthday || "1990-01-01"
    const userProfileImage = req.body.profileImage || "https://raw.githubusercontent.com/5yoonl/gitgithub/main/wecode_symbol_b%402x.png"
    if (userEmail.indexOf("@")==-1 || userEmail.indexOf(".")==-1) {return res.json({message : "이메일의 형식이 올바르지 않습니다"})}
    if (userPassword.length < 10){return res.json({message : "비밀번호는 10자 이상이어야 합니다."})}
    const searchData = await appDataSource.query(`
        select email from users where email = '${userEmail}'
    `)
    if (searchData.length!==0){return res.status(400).json({message:"OVERLAPED_EMAIL"})} // 이메일이 중복된 경우 프론트에게 알리기
    const hashedUserPassword = await bcrypt.hash(userPassword,10)   // 비밀번호 암호화
    const userData = await appDataSource.query(`
        insert into users (nickname, email, password, phone_number, birth_day, profile_image)
            values ('${userNickname}', '${userEmail}', '${hashedUserPassword}', '${userPhonenumber}', '${userBirthday}', '${userProfileImage}')
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

module.exports = { signUp, allUserSearch, signIn }