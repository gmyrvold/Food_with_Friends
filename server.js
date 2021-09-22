const express = require('express')
const app = express()
const Product = require('./models/recipes')

const mongoose = require('mongoose')
const mongoURI = "mongodb://127.0.0.1:27017/basiccrud"
const db = mongoose.connection

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, () => {
      console.log('database connected')
  })

db.on('error', (err) => { console.log('ERROR: ', err) })
db.on('connected', () => { console.log('mongo connected') })
db.on('disconnected', () => { console.log('mongo disconnected')})

app.get('/recipe', (req,res) => {
        res.render('index.ejs')
    })

app.listen(3000, () => {
    console.log('Server is listening on PORT: 3000')
  })