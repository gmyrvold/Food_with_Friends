const express = require('express')

const router = express.Router()
const Recipe = require('../models/recipes')

const authRequired = (req, res, next) => {
    if (req.session.currentUser) {
      next()
    } else {
      res.send('You must be logged in to do that')
    }
  }


router.get('/', (req,res) => {
    Recipe.find({}, (err, allRecipes) => {
        res.render('index.ejs', {
          recipes: allRecipes
        })
      })
    })

router.get('/public', (req,res) => {
    Recipe.find({publicRecipe: true}, (error, sharedRecipe) => {
        if (error){
            console.log(error)
            res.send(error)
        } else {
            res.render('public.ejs', {recipes: sharedRecipe})
        }
    })
})
router.put('/:id/public', (req,res) => {
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

router.get('/new', (req,res) => {
    res.render('new.ejs')
})
router.get('/seed', async (req, res) => {
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

router.get('/:id', (req,res)=> {
    Recipe.findById(req.params.id, (error, foundRecipe) => {
        res.render('show.ejs', { recipe: foundRecipe })
      })
    })

router.post('/', (req,res) => {
    Recipe.create(req.body, (error, createdRecipe) => {
        if (error){
            console.log(error)
            res.send(error)
        } else {
            res.redirect('/recipes')
        }
    })
})

router.get('/public/:id', (req,res)=> {
    Recipe.findById(req.params.id, (error, foundRecipe) => {
        res.render('publicShow.ejs', { recipe: foundRecipe })
      })
    //   let postButton = document.querySelector(".post")
    // postButton.addEventListener("click", handleClickEvent)
    // function handleClickEvent(event) {
    //     body.style.h1 = event.target.dataset.color;}
    })

router.delete('/:id', (req,res) => {
    Recipe.findByIdAndDelete(req.params.id, (error, deletedRecipe) => {
        if (error) {
            console.log(error)
            res.send(error)
        } else {
            res.redirect('/recipes')
        }
    })
})

router.get('/:id/edit',authRequired, (req,res) => {
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

router.put('/:id',(req,res) => {
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

    module.exports = router