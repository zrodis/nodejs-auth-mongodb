
const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')

const Schema = mongoose.Schema
//define model schema
//make sure the email or ID is unique
const userSchema = new Schema({
  email: {type: String,
          unique: true,
          lowercase: true },
  password: String
})

userSchema.pre('save', function (next) {//this cant be an arrow function for some reason...
  const user = this

  bcrypt.genSalt(10, function(err, salt) {
    if(err) return next(err)

    bcrypt.hash(user.password, salt, null, function(err, hash){
      if(err) return next(err)

      user.password = hash
      console.log('hashed', user.password);
      next()
    })

  })
})

//compare hashed password
userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return callback(err)
    return callback(null, isMatch)
  })

}


//create a mongoose.model
const ModelClass = mongoose.model('user', userSchema)
module.exports = ModelClass
