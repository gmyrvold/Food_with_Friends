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
  
const userController = require('./controllers/userController')
app.use('/users', userController)



// app.get('/recipes', (req,res) => {
//     Recipe.find({}, (err, allRecipes) => {
//         res.render('index.ejs', {
//           recipes: allRecipes
//         })
//       })
//     })

// app.get('/recipes/public', (req,res) => {
//     Recipe.find({publicRecipe: true}, (error, sharedRecipe) => {
//         if (error){
//             console.log(error)
//             res.send(error)
//         } else {
//             res.render('public.ejs', {recipes: sharedRecipe})
//         }
//     })
// })
// app.put('/recipes/:id/public', (req,res) => {
//     Recipe.findById(req.params.id, (error, sharedRecipe) => {
//         if (error){
//             res.send(error)
//         } else {
//             sharedRecipe.publicRecipe=true
//             sharedRecipe.save()
//             res.redirect('/recipes/public')
//         } 
//     })
// })

// app.get('/recipes/new', (req,res) => {
//     res.render('new.ejs')
// })

// app.get('/recipes/:id', (req,res)=> {
//     Recipe.findById(req.params.id, (error, foundRecipe) => {
//         res.render('show.ejs', { recipe: foundRecipe })
//       })
//     })

// app.post('/recipes', (req,res) => {
//     Recipe.create(req.body, (error, createdRecipe) => {
//         if (error){
//             console.log(error)
//             res.send(error)
//         } else {
//             res.redirect('/recipes')
//         }
//     })
// })

// app.get('/recipes/public/:id', (req,res)=> {
//     Recipe.findById(req.params.id, (error, foundRecipe) => {
//         res.render('publicShow.ejs', { recipe: foundRecipe })
//       })
//     //   let postButton = document.querySelector(".post")
//     // postButton.addEventListener("click", handleClickEvent)
//     // function handleClickEvent(event) {
//     //     body.style.h1 = event.target.dataset.color;}
//     })

// app.delete('/recipes/:id', (req,res) => {
//     Recipe.findByIdAndDelete(req.params.id, (error, deletedRecipe) => {
//         if (error) {
//             console.log(error)
//             res.send(error)
//         } else {
//             res.redirect('/recipes')
//         }
//     })
// })

// app.get('/recipes/:id/edit',(req,res) => {
//     Recipe.findById(req.params.id, (error, foundRecipe) => {
//         if (error) {
//           console.log(error)
//           res.send(error)
//         } else {
//           res.render('edit.ejs', {
//             recipe: foundRecipe,
//           })
//         }
//       })
//     })

// app.put('/recipes/:id',(req,res) => {
//     Recipe.findByIdAndUpdate(req.params.id, req.body,
//         {new: true,},
//         (error, updatedRecipe) => {
//         if (error) {
//             console.log(error)
//             res.send(error)
//             } else {
//             res.redirect('/recipes')
//             }
//         })
//     })

// app.get('/seed', async (req, res) => {
//     const newRecipes =
//         [{
//             name: 'Tomato Soup',
//             ingredients: 'Tomatoes',
//             directions: 'Cook tomatoes',
//             img: '/images/TomatoSoup.jpeg',
//             link: 'https://www.youtube.com/watch?v=MkULY-TuRz0',
//             qty: 5,
//             publicRecipe: true
//         },{
//             name: 'Chicken Noodle Soup',
//             ingredients: 'chicken, noodle, chicken stock, carrots, celery',
//             directions: 'add vegetables until soft, add broth and cook with chicken',
//             img: '/images/ChickenNoodleSoup.jpeg',
//             link: 'https://www.youtube.com/watch?v=MkULY-TuRz0',
//             qty: 5,
//             publicRecipe: false
//         }]
//     console.log(newRecipes)
//     try {
//         const seedItems = await Recipe.create(newRecipes)
//         res.send(seedItems)
//     } catch (err) {
//         res.send(err.message)
//     }
//     //res.redirect('/recipes')
//     })

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on PORT: ${process.env.PORT}`)
  })

