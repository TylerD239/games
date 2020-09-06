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
        check('password', 'Минимальная длинна 6 символов').isLength({min: 6})
    ],
    async (req,res) => {
        try {
            const errors = validationResult(req)



            const {login, password} = req.body

            const candidate = await User.findOne({login})

            if (candidate) {
                return res.status(400).json({message: 'Такой пользователь уже существует'})
            }
            if (!errors.isEmpty()) {
                // console.log(errors.errors)
                return res.status(400).json({message: errors.errors[0].msg})
            }
            const hashedPassword =await bcrypt.hash(password, 12)
            const user = new User({login, password: hashedPassword, rating: 1500})
            await user.save()

            res.status(201).json({message: 'Пользователь создан'})

        } catch (e) {
            res.status(500).json({message : 'Something wrong...'})
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
                {userId: user.id, name: login},
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