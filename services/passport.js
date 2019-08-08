const passport  = require('passport')
const User = require('../models/user')
const config = require('../config')
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

const localOptions = {
  usernameField: 'email'
}

// does the user's account exist? and decode and see if password is correct
const localLogin = new LocalStrategy(localOptions , function(email, password, done){
  console.log('localLogin');
  User.findOne({email: email}, function(err, user){
    if(err) {return done(err)}
    if(!user) {return done(null, false)}

    console.log('localLogin2');

    //get the password comparision and log the user in
    user.comparePassword(password, function(err, isMatch){
      console.log('comparePassword call', err, isMatch);
      if(err) {return done(err);}
      if(!isMatch) {return done(null, false)};

      return done(null, user);//gets assigned to req.user
    })
  })

})

///// JWT auth strategy - decodes a token
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
}

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
  //payload = request that contains the decoded jwt token
  console.log('jwtLogin');
  User.findById(payload.sub, function(err, user) {
    if(err) return done(err, false)
    if(user) {
      done(null, user);
    }else{
      done(null, false);
    }
  })
})

passport.use(localLogin)
passport.use(jwtLogin)
