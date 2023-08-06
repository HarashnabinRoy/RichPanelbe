const express = require('express')
const morgan = require('morgan')
const app = express()
const plansController = require('../Controllers/plansController')
const userController = require('../Controllers/userController')

const router = express.Router()

app.use(morgan('dev'))
app.use(express.json())

router.post('/createPlan',userController.protect,plansController.createPlan)
router.get('/getplans',userController.protect,plansController.getAllPlans)
router.get('/getplans/monthly',userController.protect,plansController.getPlanByMonth)
router.get('/getplans/yearly',userController.protect,plansController.getPlanByYear)
module.exports = router