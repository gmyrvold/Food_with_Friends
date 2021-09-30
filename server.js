const express = require('express')
const app = express()
const methodOverride = require('method-override')
const session = require('express-session')
const Recipe = require('./models/recipes')
require('dotenv').config();

const mongoose = require('mongoose')
const mongoURI = process.env.MONGO_URI
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

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static('public'))

const SESSION_SECRET = process.env.SESSION_SECRET
console.log('Here\'s SESSION_SECRET')
console.log(SESSION_SECRET)

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false, 
    saveUninitialized: false, 
  }))

app.get('/check-session-property', (req, res) => {
    if (req.session.someProperty) {
      res.send(req.session.someProperty)
    } else {
      res.send("We haven't set anything yet!")
    }
})
  
app.get('/set-session-property/:value', (req, res) => {
    req.session.someProperty = req.params.value
    res.redirect('/recipes')
})

app.get('/destroy-session', (req, res) => {
    req.session.destroy()
    res.redirect('/recipes')
})
  
const recipeController = require('./controllers/recipeController')
app.use('/recipes', recipeController)
  
const userController = require('./controllers/usercontroller')
app.use('/users', userController)

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on PORT: ${process.env.PORT}`)
  })

//file change