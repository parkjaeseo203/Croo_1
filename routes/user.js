
const express = require('express')
const router = express.Router()

const userModel = require('../model/user')


router.post('/register', (req, res) => {
    // email check -> password 암호화 -> model/user db저장
    const {nickName, email, phoneNumber} = req.body

    userModel
        .findOne({email})
        .then(user => {
            if (user) {
                return res.json({
                    message: 'Check again'
                })
            }
            else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.json({
                            message: err.message
                        })
                    }
                    else {
                        const newUser = new userModel({
                            nickName,
                            email,
                            password: hash,
                            phoneNumber
                        })

                        newUser
                            .save()
                            .then(user => {
                                res.json({
                                    message: 'HI Glad see you',
                                    userInfo: user
                                })

                            })
                            .catch(err => {
                                res.json({
                                    message: err.message
                                })
                            })

                    }
                })
            }
        })
        .catch(err => {
            res.json({
                message: err.message
            })
            })

})







module.exports = router