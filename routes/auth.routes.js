const {Router} = require('express')
const User = require('../models/User')
const router = Router()
const jwt = require('jsonwebtoken')
const config = require('config')

// /api/auth/register
router.post(
    '/register',
    async (req,res) => {
        try {

            const {login, password} = req.body

            const candidate = await User.findOne({login})

            if (candidate) {
                return res.status(400).json({message: 'Уже существует'})
            }

            const user = new User({login, password})
            await user.save()

            res.status(201).json({message: 'user created'})

        } catch (e) {
            res.status(500).json({message : 'something wrong..'})
        }
    })


// /api/auth/login
router.post(
    '/login',
    async (req,res) => {
        try {

            const {login, password} = req.body
            const user = await User.findOne({login})

            if (!user) {
                return res.status(400).json({message: 'пользователь не найден'})
            }

            const isMatch = password === user.password

            if (!isMatch) {
                return res.status(400).json({message: 'пароль неверный'})
            }

            const token=jwt.sign(
                {userId: user.id},
                config.get('jwtSecret'),
                {expiresIn: '1h'}
            )

            res.json({token, userId: user.id, name: login})

        } catch (e) {
            console.log(e)
            res.status(500).json({message : 'something wrong..'})
        }
    })

module.exports = router