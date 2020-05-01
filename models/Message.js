const {Schema, model} = require('mongoose')

const schema = new Schema ({
	author : {type: String, required: true},
	text : {type: String, required: true},
	date : {type: Number, required: true},
})
module.exports = model('Message', schema)