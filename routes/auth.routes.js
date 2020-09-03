const {Router} = require('express')
const User = require('../models/User')
const router = Router()
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')

// /api/auth/register
router.post(
    '/register',
    [
        // check('email', 'некорректный email').isEmail(),
        check('password', 'минимальная длинна 6 символов').isLength({min: 6})
    ],
    async (req,res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: 'некорректные данные'})
            }

            const {login, password} = req.body

            const candidate = await User.findOne({login})

            if (candidate) {
                return res.status(400).json({message: 'Уже существует'})
            }

            const hashedPassword =await bcrypt.hash(password, 12)
            const user = new User({login, password: hashedPassword, rating: 1500})
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

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({message: 'пароль неверный'})
            }

            const token = jwt.sign(
                {userId: user.id},
                config.get('jwtSecret'),
                {expiresIn: '20 days'}
            )

            res.json({token, userId: user.id, name: login})

        } catch (e) {
            // console.log(e)
            res.status(500).json({message : 'something wrong..'})
        }
    })

module.exports = router