const userService = require('../services/userService');

const signUp = async (req, res) => {
  try {
    const { nickname, email, password} = req.body;

    if ( !nickname || !email || !password) {
      return res.status(400).json({ message: 'KEY_ERROR' });
    }
    await userService.signUp( nickname, email, password );
    console.log(nickname,email,password)
    return res.status(201).json({
      message: 'SIGNUP_SUCCESS',
    });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const login = async(req,res) => {
  try{
    const {email,password} = req.body

    if(!email || !password){
      return res.status(400).json({message: 'KEY_ERROR'})
    }
    const loginResult = await userService.login(email, password)
    
    return res.status(200).json({
      message: "로그인 성공!",
      token: loginResult.token,
      userId: loginResult.userId,
      email: loginResult.email
    })
  }catch(err){
    return res.status(500).json({message: "실패!"})
  }
}

module.exports = {
	signUp,login
}