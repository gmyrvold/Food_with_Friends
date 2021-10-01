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
            ingredients: ['Tomatoes'],
            directions: ['Cook tomatoes'],
            img: '/images/TomatoSoup.jpeg',
            link: 'https://www.youtube.com/watch?v=MkULY-TuRz0',
            qty: 5,
            publicRecipe: true
        },{
            name: 'Chicken Noodle Soup',
            ingredients: ['chicken', 'noodle', 'chicken stock', 'carrots', 'celery'],
            directions: ['add vegetables until soft', 'add broth and cook with chicken'],
            img: '/images/ChickenNoodleSoup.jpeg',
            link: 'https://www.youtube.com/watch?v=MkULY-TuRz0',
            qty: 5,
            publicRecipe: false
        },{
            name: 'Mac and Cheese',
            ingredients: ['1lb elbow pasta', '1/2 cup butter', '1/2 cup flour', '2 1/2 cups half and half', '4 cups sharp cheddar cheese', '2 cups gruyere cheese', '1/2 Tbs salt'],
            directions: ['Preheat oven to 325 degrees F and grease a 3 qt baking dish (9x13").  Set aside.', 'Bring a large pot of salted water to a boil and cook pasta', 'Melt butter and add flour and half and half', 'Remove from heat and add cheeses', 'Add both pasta and cheese mix to baking dish, bake for 15 mins'],
            img: '/images/MacAndCheese.jpeg',
            link: 'https://www.youtube.com/watch?v=snsEjQKO-s8',
            qty: 8,
            publicRecipe: false
        },{
            name: 'Chicken Parmesan',
            ingredients: ['2 TBS oil', '2 chicken breasts', '1 egg', '1 cup panko bread crumbs', '1/2 cup parmesan cheese', '1 tsp oregano', '1 cup marinara', '1 1/2 cups mozzarella'],
            directions: ['Preheat oven to 400 degrees', 'cut chicken in halves, flatten with a rolling pin', 'seperately mix panko bread crumbs, parmesan and spices', 'bread the chicken and bake for 15 mins on both sides', 'top with marinara and mozzarella'],
            img: '/images/ChickenParmesan.jpeg',
            link: 'https://www.youtube.com/watch?v=MkULY-TuRz0',
            qty: 8,
            publicRecipe: true
        }, {
            name: 'Chicken Pesto Pasta',
            ingredients: ['1 TBS oil', '1 1/4 lbs chicken breasts', '1 lb penne pasta', '1 jar pesto', '1 cup plain greek yogurt', '10 oz frozen spinach', '2 pints cherry tomatoes', '1 cup mozzarella'],
            directions: ['preheat oven to 375 degrees', 'add chicken and oil to a pan and cook for 4 mins', 'boil water in a pot and add pasta until al dente', 'whisk together pesto and yogurt. Once combined add spinach and add to the pasta', 'add chicken and tomatoes and put everything in a baking dish', 'top with mozzarella and bake for 20-25 mins'],
            img: '/images/PestoPasta.jpeg',
            link: 'https://www.youtube.com/watch?v=MkULY-TuRz0',
            qty: 6,
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