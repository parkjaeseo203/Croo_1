
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const normalize = require('normalize-url')
const gravatar = require('gravatar')


const userSchema = mongoose.Schema(
    {
        nickName:{
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
        },
        phoneNumber:{
            type: Number,
            required: true
        },
        avatar:{
            type: String
        },
        role:{
            type: String,
            default: 'user'
        },
        password:{
            type: String,
            required: true
        },
        resetPasswordLink:""
    },
    {
        timestamps: true
    }
)

userSchema.pre('save', async function (next) {
    try {
        console.log('entered')
        // make a avatar
        const avatar = await normalize(
            gravatar.url(this.email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            }),
            { forceHttps: true }
        )
        this.avatar = avatar
        //password 암호화
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(this.password, salt)
        this.password = passwordHash

        console.log('exited')
        next()
    }
    catch (error) {
        next(error)
    }
})

userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err)
        cb (null, isMatch)
    })
}



module.exports = mongoose.model('user', userSchema)