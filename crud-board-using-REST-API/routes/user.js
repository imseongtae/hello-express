const express = require('express');
const router = express.Router();
const crypto = require('crypto')
// const pbkdf2 = require('pbkdf2')

const models = require("../models");

// 메인 페이지
router.get('/', function(req, res, next) {
  if (req.cookies) {
    console.log(req.cookies);
  }
  res.send('환영합니다~');
});

router.get('/sign_up', function(req, res, next) {
  res.render("user/signup");
});

// 참고 자료
// https://victorydntmd.tistory.com/33?category=677306
router.post("/sign_up", function(req,res,next){
  const body = req.body;

  const inputPassword = body.password;
  const salt = Math.round((new Date().valueOf() * Math.random())) + "";
  const hashPassword = crypto.createHash('sha512').update(inputPassword + salt).digest('hex')
  
  const result = models.user.create({
    name: body.userName,
    email: body.userEmail,
    password: hashPassword,
    salt
  })
  .then( result => {
    res.redirect("/user/sign_up");
  })
  .catch( err => {
    console.log('무슨 에러인가 모르겠구만');
    console.log(err)
  })
})

// 로그인 GET
router.get('/login', function(req, res, next) {
  const session = req.session;
  // res.render("user/login");
  res.render('user/login', {
    session
  })
});

router.post('/login', async (req, res, next) => {
  const body = req.body;

  const result = await models.user.findOne({
    where: {
      email: body.userEmail
    }
  })

  const dbPassword = result.dataValues.password;
  const inputPassword = body.password;
  const salt = result.dataValues.salt;
  const hashPassword = crypto.createHash('sha512').update(inputPassword + salt).digest('hex')

  if (dbPassword === hashPassword) {
    console.log('비밀번호 일치');
    req.session.email = body.userEmail;
    // cookie setting
    // res.cookie('user', body.userEmail, {
    //   expires: new Date(Date.now() + 900000),
    //   httpOnly: true,
    // });    
  } else {
    console.log('비밀번호 불일치');
  }
  // 성공시 성공화면, 실패한다면 실패화면
  res.redirect('/user/login')    
})

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie('sid')
  
  res.redirect('/user/login')
})

// router.post("/sign_up", function(req,res,next){
//   let body = req.body;

//   crypto.randomBytes(64, function(err, buf) {
//     crypto.pbkdf2(body.password, buf.toString('base64'), 100000, 64, 'sha512', async function(err, key){
//       await models.user.create({
//         name: body.userName,
//         email: body.userEmail,
//         password: key,
//         salt: buf
//       })
      
//       res.redirect("/users/sign_up");
//     });
//   });
// })




module.exports = router;