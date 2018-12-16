const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
  email:{ type:String, require: true},
  password:{ type:String, required: true},
  mobile: {type: String, required: true},
  pin: {type: String, required: true},
});

UserSchema.pre('save',function(next){
  var user = this;
  if (this.isModified('password') || this.isNew){
    bcrypt.genSalt(10, function(err,salt){
      if (err){
        return next(err);
      }
      bcrypt.hash(user.password,salt,null,function(err,hash){
        if (err){
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  }
});

UserSchema.methods.comparePassword = function(passw,cb){
  bcrypt.compare(passw,this.password,function(err,isMatch){
    if (err){
      return cb(err);
    }
    cb(null,isMatch);
  })
}

module.exports = mongoose.model('User',UserSchema);