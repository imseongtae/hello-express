const express = require('express');
const router = express.Router();
const mysql = require('mysql2')
const models = require('../models');

// let client = mysql.createConnection({
//   user: "root",
//   password: "12345",
//   database: 'pcs'
// })

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// router.get('/create', function(req, res, next) {
//   client.query("SELECT * FROM products;", function(err, result, fields){
//     if(err){
//       console.log(err);
//       console.log("쿼리문에 오류가 있습니다.");
//     }
//     else{
//       res.render('create', {
//         results: result
//       });
//     }
//   });
// });

router.get('/board', async (req, res, next) => {
  let result = await models.post.findAll();
  if(result) {
    for (const post of result) {
      let result2 = await models.post.findOne({
        include: {
          model: models.reply,
          where: {
            postId: post.id
          }
        }
      })
      if (result2) {
        post.replies = result2.replies
      }
    }
  }
  res.render('show', {
    posts: result
  })
});

router.post('/board', function(req, res, next) {
  let body = req.body;

  models.post.create({
    title: body.inputTitle,
    writer: body.inputWriter
  })
  .then( result => {
    console.log("데이터 추가 완료");
    res.redirect("/board");
  })
  .catch( err => {
    console.log("데이터 추가 실패");
  })
});

router.get('/edit/:id', function(req, res, next) {
  let postID = req.params.id;

  models.post.findOne({
    where: {id: postID}
  })
  .then( result => {
    res.render("edit", {
      post: result
    });
  })
  .catch( err => {
    console.log("데이터 조회 실패");
  });
});

router.put('/board/:id', function(req, res, next) {
  let  postID = req.params.id;
  let body = req.body;

  models.post.update({
    title: body.editTitle,
    writer: body.editWriter
  },{
    where: {id: postID}
  })
  .then( result => {
    console.log("데이터 수정 완료");
    res.redirect("/board");
  })
  .catch( err => {
    console.log("데이터 수정 실패");
  });
});

router.delete('/board/:id', function(req, res, next) {
  let postID = req.params.id;

  models.post.destroy({
    where: {id: postID}
  })
  .then( result => {
    res.redirect("/board")
  })
  .catch( err => {
    console.log("데이터 삭제 실패");
  });
});

// router.post('/create', function(req, res, next) {
//   var body = req.body;

//   client.query("INSERT INTO products (name, modelnumber, series) VALUES (?, ?, ?)", [
//     body.name, body.modelnumber, body.series
//   ], function(){
//     res.redirect("/create");
//   });
// });

router.post('/reply/:postId', function(req, res, next) {
  let postId = req.params.postId;
  let body = req.body;

  models.reply.create({
    postId: postId,
    writer: body.replyWriter,
    content: body.replyContent
  })
  .then(results => {
    res.redirect("/board");
  })
  .catch( err => {
    console.log(err);
  });
})

// router.post("/reply/:postID", function(req, res, next){
//   let postID = req.params.postID;
//   let body = req.body;

//   models.reply.create({
//     postId: postID,
//     writer: body.replyWriter,
//     content: body.replyContent
//   })
//   .then(results => {
//     res.redirect("/board");
//   })
//   .catch( err => {
//     console.log(err);
//   });
// });


module.exports = router;
