const mongoose = require('mongoose')
const {Schema , model} = mongoose

const productsSchema = new Schema({
    name: {type: String,required: true},
    ingredients: [String],
    directions: [String],
    img: {type: String},
    link: {type: String},
    qty: {type: Number, min: 0},
    publicRecipe: {type: Boolean, default: false}
})

const Recipe = model('Recipe', productsSchema)
module.exports = Recipe