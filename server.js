const express = require('express')
const app = express()
const Recipe = require('./models/recipes')

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

app.get('/recipes', (req,res) => {
    Recipe.find({}, (err, allRecipes) => {
        res.render('index.ejs', {
          recipes: allRecipes
        })
      })
    })

app.get('/recipes/new', (req,res) => {
    res.render('new.ejs')
})

app.get('/recipes/:id', (req,res)=> {
    Recipe.findById(req.params.id, (error, foundRecipe) => {
        res.render('show.ejs', { recipe: foundRecipe })
      })
    })

app.get('/seed', async (req, res) => {
    const newRecipes =
        [{
            name: 'Tomato Soup',
            ingredients: 'Tomatoes',
            directions: 'Cook tomatoes',
            img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ9Q_hovRHT0e7zYwqQ2qOFAznR2AHH7VMTg&usqp=CAU',
            link: 'https://www.youtube.com/watch?v=MkULY-TuRz0',
            qty: 5
        }]
      
    try {
        const seedItems = await Recipe.create(newRecipes)
        res.send(seedItems)
    } catch (err) {
        res.send(err.message)
    }
    res.redirect('/recipes')
    })

app.listen(3000, () => {
    console.log('Server is listening on PORT: 3000')
  })