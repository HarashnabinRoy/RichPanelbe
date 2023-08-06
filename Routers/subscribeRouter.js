const express = require('express')
const morgan = require('morgan')
const app = express()
const subscribeController = require('../Controllers/subscribeController')
const userController = require('../Controllers/userController')
const router = express.Router()

app.use(morgan('dev'))
app.use(express.json())

router.post('/ok',userController.protect,subscribeController.susbcribe)
router.post('/paymentSuccess',userController.protect,subscribeController.paymentSuccess)
router.post('/cancelSubscription',userController.protect,subscribeController.cancelSubscription)
router.get('/subscriptionDetails',userController.protect,subscribeController.getSubscriptionDetails)

module.exports = router