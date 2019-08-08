const User = require('../models/user')
const jwt = require('jwt-simple')
const config = require('../config.js')

function handleFail(why, res){
  return res.status(422).send({error: why}) //422 = unprocessable entity
}

function getUserToken(user) {
    const timestamp = new Date().getTime()
    return jwt.encode({
        sub: user.id,
        iat: timestamp
      }, config.secret)
}

exports.signin = function(req, res, next) {
  //user had their password hashed and authorized
  //give them a token
  console.log('auth signin', req)
  res.send({ token: getUserToken(req.user) })//comes from passport 'local'
}

exports.signup = function(req, res, next) {
  console.log('auth signup');
  const {email, password} = req.body

  if( !email ) return handleFail('no email', res)
  if( !password ) return handleFail('no password', res)

  User.findOne({ email: email}, (err, userRes) => {
    if(err) return next(err)

    if(userRes) return handleFail("email is in use", res)

    const user = new User({
      email,
      password
    })

    user.save( (err) => {
      if(err) return next(err)
      res.json({token: getUserToken(user)})
    })
  })


}
