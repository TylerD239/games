const jwt = require("jsonwebtoken")
const config = require('config')

const checkToken = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]

    try {
        const verify = jwt.verify(token, config.get('jwtSecret'))
        res.json(verify)
    } catch (e) {
        res.json(false)
    }
}
module.exports = checkToken