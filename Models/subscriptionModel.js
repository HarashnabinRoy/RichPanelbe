const mongoose = require('mongoose')

const subscriptionSchema = new mongoose.Schema({
    UserId:{
        type:String,
        required:true
    },
    PlanId:{
        type:String,
        ref:'Plan'
    },
    StripeSubscriptionId:{
        type:String,
        required:true
    },
    planStatus:{
        type:String,
        required:true,
        enum:["Active","Cancelled","Expired"]
    },
    planExpiryDate:{
        type:String,
        required:true
    },
    planStartDate:{
        type:String,
        require:true
    }
})

const Subscription = mongoose.model('Subscription',subscriptionSchema)
module.exports = Subscription
