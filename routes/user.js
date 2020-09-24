
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey("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")


const userModel = require('../model/user')


router.post('/register', (req, res) => {
    // email check -> password 암호화 -> model/user db저장
    const {nickName, email, phoneNumber, password} = req.body

    userModel
        .findOne({email})
        .then(user => {
            if (user) {
                return res.json({
                    message: 'Check again'
                })
            }
            else {
                const payload = {email, nickName, password, phoneNumber}
                const token = jwt.sign(
                    payload,
                    "jwt_account_key",
                    { expiresIn: '20m' }
                )

                const emailDate = {
                    from: "joke716@naver.com",
                    to: email,
                    subject: 'Account activation link',
                    html: `
                        <h1>Please use the following to activate your account</h1>
                        <p>${token}</p>
                        <hr />
                    `
                }

                sgMail
                    .send(emailDate)
                    .then(() => {
                        res.json({
                            message: `email has been sent to ${email}`
                        })
                    })
                    .catch(err => {
                        res.json({
                            message: err.message
                        })
                    })
                // const newUser = new userModel({
                //     email, nickName, password, phoneNumber
                // })
                //
                // newUser
                //     .save()
                //     .then(user => {
                //         res.json({
                //             message: 'WELCOME',
                //             userInfo: user
                //         })
                //     })
                //     .catch(err => {
                //         res.json ({
                //             message: err.message
                //         })
                //     })
                // bcrypt.hash(req.body.password, 10, (err, hash) => {
                //     if (err) {
                //         return res.json({
                //             message: err.message
                //         })
                //     }
                //     else {
                //         //autorlize make a avatar
                //         const avatar = normalize(
                //             gravatar.url(email, {
                //                 s: '200',
                //                 r: 'pg',
                //                 d: 'mm'
                //             }),
                //             { forceHttps: true }
                //         )
                //
                //
                //         const newUser = new userModel({
                //             nickName,
                //             email,
                //             password: hash,
                //             phoneNumber,
                //             avatar
                //         })
                //
                //         newUser
                //             .save()
                //             .then(user => {
                //                 res.json({
                //                     message: 'HI Glad see you',
                //                     userInfo: user
                //                 })
                //
                //             })
                //             .catch(err => {
                //                 res.json({
                //                     message: err.message
                //                 })
                //             })
                //
                //     }
                // })
            }
        })
        .catch(err => {
            res.json({
                message: err.message
            })
        })

})

router.post('/login', (req, res) => {
    //emailcheck - password match - make a token, token return
    const {email, password} = req.body

    userModel
        .findOne({email})
        .then(user => {
            if (!user) {
                return res.json({
                    message: 'email wasnt registed',
                })
            }
            else {

                //password matching
                user
                    .comparePassword(password, (err, isMatch) => {
                        if (err || !isMatch) {
                            return res.json ({
                                message: 'wrong password'
                            })
                        }
                        else {
                            const token = jwt.sign(
                                {
                                    email: user.email,
                                    id: user._id
                                },
                                'key',
                                { expiresIn: '1d' }
                            )
                            res.json({
                                message: 'auth successful',
                                isMatch,
                                token: token
                            })
                        }
                    })
                // bcrypt.compare(password, user.password, (err, result) => {
                //
                //     if (err || result === false) {
                //         return res.json({
                //             message: 'wrong password'
                //         })
                //     }
                //     else {
                //         // make a token
                //         const token = jwt.sign(
                //             {
                //                 email: user.email,
                //                 id: user._id
                //             },
                //             'key',
                //             {expiresIn: '1d'}
                //         )
                //         res.json({
                //             message: 'auth successful',
                //             token: token
                //         })
                //     }
                // })
            }
        })
        .catch(err => {
            res.json({
                message: err.message
            })
        })
})







module.exports = router