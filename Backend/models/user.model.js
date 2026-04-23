const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
},{ timestamps: true });

//Hash password 
userSchema.pre("save", async function(){
  if(!this.isModified("password")) return;
 
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Compare password 
userSchema.methods.comparePassword = async function (enteredPassword){
    return bcrypt.compare(enteredPassword, this.password);
};

//Generate JWT token
userSchema.methods.generateToken = function () {
    return jwt.sign({
        id: this._id,
        role: this.role
    },process.env.JWT_SECRET, 
    { expiresIn: '7d' });
};

const user = mongoose.model('User', userSchema);

module.exports = user;
