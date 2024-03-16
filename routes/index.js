const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const SECRET = 'secret'

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
  const auth = req.header('Authorization')
  if (typeof auth === "undefined") {
      res.render('index', { username: "" });
      return
  }
  token = auth.replace('Bearer ', '')
  try {
      const decoded = jwt.verify(token, SECRET)
      console.log('decoded', decoded)
      if (decoded.user == "user") {
          res.render('index', {
              username: decoded.user
          });
      }
  } catch {
      res.status(401).render('index', {});
  }
});


router.post('/login', function (req, res) {
    if (req.body.username === "user" && req.body.password === "pass") {
        const token = jwt.sign({ user: req.body.username }, SECRET, { expiresIn: '1 day' })
        res.json({
            token
        });
    } else {
        res.redirect('/');
    }
})
router.get('/content', function (req, res) {
    const auth = req.header('Authorization')
    if (typeof auth === "undefined") {
        res.status(401).send({ error: 'Please authenticate.' })
        console.log(48)
        return
    }
    token = auth.replace('Bearer ', '')
    try {
        // 驗證JWT
        const decoded = jwt.verify(token, SECRET)
        if (decoded.user == "user") {
            res.status(200).send({ data: 'Welcome!' })
        }
    } catch {
        res.status(401).send({ error: 'Please authenticate.' })
    }
})

router.get('/test', function (req, res){
    res.json({
        message:'test work !'
    })
})

module.exports = router;
