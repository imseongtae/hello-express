const express = require('express');
const router = express.Router();
const crypto = require('crypto')
// const pbkdf2 = require('pbkdf2')

const models = require("../models");


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
    res.redirect("/users/sign_up");
  })
  .catch( err => {
    console.log('무슨 에러인가 모르겠구만');
    console.log(err)
  })
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