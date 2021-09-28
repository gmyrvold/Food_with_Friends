const express = require('express')
const app = express()
const Recipe = require('./models/recipes')
const methodOverride = require('method-override')

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

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static('public'))

app.get('/recipes', (req,res) => {
    Recipe.find({}, (err, allRecipes) => {
        res.render('index.ejs', {
          recipes: allRecipes
        })
      })
    })

app.get('/recipes/public', (req,res) => {
    //console.log(req.body)
    Recipe.find({publicRecipe: true}, (error, sharedRecipe) => {
        if (error){
            console.log(error)
            res.send(error)
        } else {
            console.log(sharedRecipe)
            res.render('public.ejs', {recipes: sharedRecipe})
        }
    })
})
app.put('/recipes/:id/public', (req,res) => {
    Recipe.findById(req.params.id, (error, sharedRecipe) => {
        if (error){
            res.send(error)
        } else {
            sharedRecipe.publicRecipe=true
            sharedRecipe.save()
            res.redirect('/recipes/public')
        } 
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

app.post('/recipes', (req,res) => {
    Recipe.create(req.body, (error, createdRecipe) => {
        if (error){
            console.log(error)
            res.send(error)
        } else {
            res.redirect('/recipes')
        }
    })
})

app.delete('/recipes/:id', (req,res) => {
    Recipe.findByIdAndDelete(req.params.id, (error, deletedRecipe) => {
        if (error) {
            console.log(error)
            res.send(error)
        } else {
            res.redirect('/recipes')
        }
    })
})

app.get('/recipes/:id/edit',(req,res) => {
    Recipe.findById(req.params.id, (error, foundRecipe) => {
        if (error) {
          console.log(error)
          res.send(error)
        } else {
          res.render('edit.ejs', {
            recipe: foundRecipe,
          })
        }
      })
    })

app.put('/recipes/:id',(req,res) => {
    Recipe.findByIdAndUpdate(req.params.id, req.body,
        {new: true,},
        (error, updatedRecipe) => {
        if (error) {
            console.log(error)
            res.send(error)
            } else {
            res.redirect('/recipes')
            }
        })
    })

app.get('/seed', async (req, res) => {
    const newRecipes =
        [{
            name: 'Tomato Soup',
            ingredients: 'Tomatoes',
            directions: 'Cook tomatoes',
            img: '/images/TomatoSoup.jpeg',
            link: 'https://www.youtube.com/watch?v=MkULY-TuRz0',
            qty: 5,
            publicRecipe: true
        },{
            name: 'Chicken Noodle Soup',
            ingredients: 'chicken, noodle, chicken stock, carrots, celery',
            directions: 'add vegetables until soft, add broth and cook with chicken',
            img: '/images/ChickenNoodleSoup.jpeg',
            link: 'https://www.youtube.com/watch?v=MkULY-TuRz0',
            qty: 5,
            publicRecipe: false
        }]
    console.log(newRecipes)
    try {
        const seedItems = await Recipe.create(newRecipes)
        res.send(seedItems)
    } catch (err) {
        res.send(err.message)
    }
    //res.redirect('/recipes')
    })

app.listen(3000, () => {
    console.log('Server is listening on PORT: 3000')
  })