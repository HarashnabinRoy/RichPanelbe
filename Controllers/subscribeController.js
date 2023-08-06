const subcribeSchema = require('../Models/subscriptionModel')
const planSchema = require('../Models/planModel')
const userSchema = require('../Models/userModel')

var mongodb = require('mongodb');
const Stripe = require('stripe')
const dotenv  = require('dotenv')
dotenv.config({path:'./config.env'})

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

function formatDateToDDMMYYYY(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}
exports.susbcribe = async (req,res)=>{
    try{
        const {name,email} = req.user
        const {planId,paymentMethod} = req.body
        // console.log("")
        console.log(planId)
        const plan = await planSchema.findById(planId)
        console.log("crash???")
        if(!plan){
            res.status(404).json({
              message:"Please send correct planId"
            })
        }
        let interval;
        const unit_amount = parseInt(plan.planPrice)*10
        let producttype
        if(plan.planType=="Monthly"){
          interval = "month"
          producttype = "Monthly subscription"
        }else{
          interval = "year"
          producttype = "yearly subscription"
        }
        console.log(unit_amount)
        // Create Customer
        console.log(req.user.name)
        console.log(paymentMethod)

        const customer = await stripe.customers.create({
            email,
            name,
            payment_method:paymentMethod,
            invoice_settings:{default_payment_method:paymentMethod}
        })
        console.log("2")
        // Create a Product
        const product  = await stripe.products.create({
            name:producttype
        })
        //  Create a subscription
        const amt_str = unit_amount+'0'
        console.log("3")
        console.log(amt_str)
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [
              {
                price_data: {
                  currency: "INR",
                  product: product.id,
                  unit_amount: amt_str,
                  recurring: {
                    interval: interval,
                  },
                },
              },
            ],
      
            payment_settings: {
              payment_method_types: ["card"],
              save_default_payment_method: "on_subscription",
            },
            expand: ["latest_invoice.payment_intent"],
          });
          // Send back the client secret for payment
          res.status(200).json({
            message: "Subscription successfully initiated",
            clientSecret: subscription.latest_invoice.payment_intent.client_secret,
            subscriptionId:subscription.id
          });
    }catch(err){
        console.log("1")
        res.status(500).json({message:err.message})
    }
}
exports.paymentSuccess = async(req,res)=>{
  try{
    const userId = req.user._id
    const planId = req.body.PlanId

    const plan = await planSchema.findById(planId)
    if(!plan){
      res.status(404).json({
        message:"Please send correct planId"
      })
    }
    req.body.UserId = userId
    req.body.planStatus = "Active"
    const currentDate = new Date();

    const nextYearDate = new Date(currentDate);
    nextYearDate.setFullYear(currentDate.getFullYear() + 1);

    const nextMonthDate = new Date(currentDate);
    nextMonthDate.setMonth(currentDate.getMonth() + 1);
    if(plan.planType=="Monthly"){
      req.body.planExpiryDate = formatDateToDDMMYYYY(nextMonthDate)
    }else{
      req.body.planExpiryDate = formatDateToDDMMYYYY(nextYearDate) 
    }
    req.body.planStartDate = formatDateToDDMMYYYY(currentDate)
    const isAlreadSubcribed = await subcribeSchema.findOne({UserId:userId})
    if(isAlreadSubcribed){
      console.log("okokokokokok")
      const subscriptionId = isAlreadSubcribed.StripeSubscriptionId
      await stripe.subscriptions.del(subscriptionId);
      await subcribeSchema.deleteOne({UserId:req.user._id})
    }
    const subscription = await subcribeSchema.create(req.body)
    res.status(201).json({
      message:"Success",
      subscription:subscription
    })
  }catch(err){
    console.log(err.message)
    res.status(404).json({
      message:"Error in creation of payment success in database"
    })
  }
}
exports.cancelSubscription = async(req,res)=>{
  try{
    console.log("1")
    let subscriptionId 

    if(!req.body.subscriptionId){
      const userId = req.user._id
      const subscription = await subcribeSchema.findOne({UserId:userId})
      subscriptionId = subscription.StripeSubscriptionId
    }else{
      subscriptionId = req.body.susbscriptionId
    }
    const canceledSubscription = await stripe.subscriptions.del(subscriptionId);
    const deleteSubscription = await subcribeSchema.deleteOne({StripeSubscriptionId:subscriptionId})
    res.status(200).json({
      message:"Successfully cancelled the subscription",
    })
  }catch(err){
    console.log(err.message)
    res.status(404).json({
      message:"ServerError",
    })
  }
}
// PlanType
// PhoneDevice
// Price
// Monthly/yearly

exports.getSubscriptionDetails = async(req,res)=>{
  try{
    const userId = req.user._id
    const subscription = await subcribeSchema.findOne({UserId:userId})
    let data = {
    
    }
    console.log("okokoko")
    console.log(userId)
    const plans = await planSchema.findById({_id:subscription.PlanId})
    data.planName = plans.planName
    data.planPrice = plans.planPrice
    data.expiryDate = subscription.planExpiryDate
    data.startDate = subscription.planStartDate
    if(plans.planType=="Monthly"){
      data.planType = "mo" 
    }else
    data.planType = "yr"
    data.DeviceYouCanWatch = plans.DeviceYouCanWatch
    res.status(200).json({
      message:"Success",
      data
    })
  }catch(err){
    console.log(err.message)
    res.status(404).json({
      message:"ServerError",
    })
  }
}