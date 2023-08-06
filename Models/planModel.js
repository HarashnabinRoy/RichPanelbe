const mongoose = require('mongoose')

const planSchema = new mongoose.Schema({
    planName:{
        type:String,
        required:true
    },
    planPrice:{
        type:String,
        required:true,
    },
    planType:{
        type:String,
        required:true,
        enum:["Monthly","Yearly"]
    },
    videoQuality:{
        type:String,
        required:true
    },
    resolution:{
        type:String,
        required:true
    },
    DeviceYouCanWatch:{
        type:String,
        required:true
    },
    NumberOfScreens:{
        type:String,
        required:true
    }
})

const plan = mongoose.model('Plan',planSchema)

module.exports = plan