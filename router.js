const Authentication = require('./controllers/authentication')
const passportService = require('./services/passport')
const passport = require('passport')

const requireAuth = passport.authenticate('jwt', {session: false})
const requireSignin = passport.authenticate('local', {session:false})

module.exports = (app) => {
  //TEST
  app.get('/', requireAuth, (req, res, next) => {//request, response, next
    res.send(['Tim Plate', 'Jason Skema'])
  })

  console.log('router')
  //signup
  app.post('/signin', requireSignin, Authentication.signin)
  app.post('/signup', Authentication.signup)



}
