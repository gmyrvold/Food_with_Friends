const mongoose = require('mongoose')
const {Schema , model} = mongoose

const productsSchema = new Schema({
    name: {type: String,required: true},
    description: {type: String},
    img: {type: String},
    link: {type: String},
    qty: {type: Number, min: 0}
})

const Recipe = model('Recipe', productsSchema)
module.exports = Recipe