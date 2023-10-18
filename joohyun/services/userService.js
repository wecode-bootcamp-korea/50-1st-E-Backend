const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userDao = require('../models/userDao') 

// 유저 체크
const checkUser = async (user_id) =>{
    const result = await myDataSource.query(`
    SELECT *
        FROM users u
        LEFT JOIN threads t ON u.id = t.user_id
        WHERE u.id = ?
    `,[user_id])
    if(result.length !==null ){
        console.log("result2222",result)
        return result[0].id
    }else {
        return false
    }
}

const signUp = async (nickname, email, password) => {
    // password validation using REGEX
    const pwValidation = new RegExp(
      '^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{10,20})'
    );
    if (!pwValidation.test(password)) {
      const err = new Error('PASSWORD_IS_NOT_VALID');
      err.statusCode = 409;
      throw err;
    }
    const checkEmail = await userDao.login(email)
    if(checkEmail){
      const err = new Error('이미 가입됨')
      err.statusCode = 400
      throw err;
    }
    const emailRegex = new RegExp(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}$/)
    if(!emailRegex.test(email)){
      const err = new Error('이메일 형식이 올바르지 않습니다.')
      err.statusCode = 400
      throw err;
    }
      const createUser = await userDao.signUp(
          nickname,
          email,
          password,
        );
        return createUser;
      };

const login = async(email,password) => {
  try{
    const user = await userDao.login(email)
    console.log(user)

    if(!user){
      const err = new Error('USER NOT FOUND')
      err.statusCode = 404
      throw err
    }
    const passwordMatch = await bcrypt.compare(password, user.password)
    if(!passwordMatch){
      const err = new Error('패스워드가 틀립니다.')
      err.statusCode = 400
      throw err
    }
    const token = jwt.sign({userId: user.id, email: user.email},'key',{expiresIn: '1h'})
    console.log("tokenn",token)
    return {token,userId: user.id, email: user.email}

  }catch(err){
    throw err;
  }
}


module.exports = {
    signUp,checkUser,login
}