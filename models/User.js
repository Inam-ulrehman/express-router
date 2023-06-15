const mongoose = require('mongoose')
var bcrypt = require('bcryptjs')
const jose = require('jose')
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide name'],
      maxlength: 50,
      minlength: 3,
      lowercase: true,
      trim: true,
    },
    lastName: {
      type: String,
      maxlength: 50,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 100,
      minlength: 8,
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 8,
    },
    role: {
      type: String,
      default: 'user',
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      lowercase: true,
      trim: true,
    },
    dob: {
      type: Date,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [{ type: Number }],
        required: true,
      },
    },
    apartment: {
      type: String,
      maxlength: 50,
      lowercase: true,
      trim: true,
    },
    house: {
      type: String,
      maxlength: 50,
      lowercase: true,
      trim: true,
    },
    street: {
      type: String,
      maxlength: 100,
      lowercase: true,
      trim: true,
    },
    city: {
      type: String,
      maxlength: 100,
      lowercase: true,
      trim: true,
    },
    province: {
      type: String,
      maxlength: 50,
      lowercase: true,
      trim: true,
    },
    country: {
      type: String,
      maxlength: 50,
      lowercase: true,
      trim: true,
    },
    postalCode: {
      type: String,
      maxlength: 50,
      lowercase: true,
      trim: true,
    },

    recoveryToken: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)
userSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})
//  JWT token creation
userSchema.methods.createJWT = async function () {
  const alg = 'HS256'

  return await new jose.SignJWT({ userId: this._id, name: this.name })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer(this.role)
    .setAudience(`urn:example:audience`)
    .setExpirationTime(process.env.JWT_LIFETIME)
    .sign(new TextEncoder().encode(process.env.JWT_SECRET))
}

//  password reset token

userSchema.methods.createPasswordResetToken = async function () {
  const alg = 'HS256'

  return await new jose.SignJWT({ userId: this._id, name: this.name })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer(this.role)
    .setAudience(`urn:example:audience`)
    .setExpirationTime('1h')
    .sign(new TextEncoder().encode(process.env.JWT_SECRET))
}

//  compare password with hashed password

userSchema.methods.comparePassword = async function (candiDatePassword) {
  const isMatch = await bcrypt.compare(candiDatePassword, this.password)
  return isMatch
}

const User = mongoose.model('User', userSchema)

module.exports = User
