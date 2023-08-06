const PlanSchema = require('../Models/planModel')

exports.createPlan = async(req,res)=>{
    try{
        const newPlan = await PlanSchema.create(req.body)
        res.status(201).json({
            message:"Success",
            body:newPlan
        })
    }catch(err){
        console.error(err);
        res.status(404).json({
            message:"Error in creation of plan",
            body:err
        })
    }
}

exports.getAllPlans = async(req,res)=>{
    try{
        const plans = await PlanSchema.find()
        const monthlyarray = [];
        const yearlyarray = [];
        for(let i=0;i<plans.length;i++){
            
            let obj = {}
            const planobj = plans[i]
            const devicesArr = planobj.DeviceYouCanWatch.split('+')
            obj.id = planobj._id
            obj.planfrequency = planobj.planType
            obj.type = planobj.planName,
            obj.cost = planobj.planPrice,
            obj.quality = planobj.videoQuality,
            obj.resolution = planobj.resolution,
            obj.devices1 = devicesArr[0]?devicesArr[0]:"",
            obj.devices2 = devicesArr[1]?devicesArr[1]:"",
            obj.devices3 = devicesArr[2]?devicesArr[2]:"",
            obj.devices4 = devicesArr[3]?devicesArr[3]:""
            if(planobj.planType=="Monthly"){
                monthlyarray.push(obj)
            }else{
                yearlyarray.push(obj)
            }
            
        }
        res.status(200).json({
            message:"Success",
            plans:{
                monthlyPlans:monthlyarray,
                yearlyPlans:yearlyarray
            }
        })
    }catch(err){
        console.error(err);
        res.status(404).json({
            message:"Error in Getting of data from databse",
            body:err
        })
    }
}

exports.getPlanByMonth = async(req,res)=>{
    try{
        const plans = await PlanSchema.find({planType:'Monthly'})
        const array = [];
        for(let i=0;i<plans.length;i++){
            let obj = {}
            const planobj = plans[i]
            const devicesArr = planobj.DeviceYouCanWatch.split('+')
            obj.id = planobj._id
            obj.type = planobj.planName,
            obj.cost = planobj.planPrice,
            obj.quality = planobj.videoQuality,
            obj.resolution = planobj.resolution,
            obj.devices1 = devicesArr[0]?devicesArr[0]:"",
            obj.devices2 = devicesArr[1]?devicesArr[1]:"",
            obj.devices3 = devicesArr[2]?devicesArr[2]:"",
            obj.devices4 = devicesArr[3]?devicesArr[3]:""

            array.push(obj)
        }
        res.status(200).json({
            message:"Success",
            plans:array
        })
    }catch(err){
        console.error(err);
        res.status(404).json({
            message:"Error in Getting of data from databse",
            body:err
        })
    }
}

exports.getPlanByYear = async(req,res)=>{
    try{
        const plans = await PlanSchema.find({planType:'Yearly'})
        const array = [];
        for(let i=0;i<plans.length;i++){
            let obj = {}
            const planobj = plans[i]
            const devicesArr = planobj.DeviceYouCanWatch.split('+')
            obj.id = planobj._id
            obj.type = planobj.planName,
            obj.cost = planobj.planPrice,
            obj.quality = planobj.videoQuality,
            obj.resolution = planobj.resolution,
            obj.devices1 = devicesArr[0]?devicesArr[0]:"",
            obj.devices2 = devicesArr[1]?devicesArr[1]:"",
            obj.devices3 = devicesArr[2]?devicesArr[2]:"",
            obj.devices4 = devicesArr[3]?devicesArr[3]:""

            array.push(obj)
        }
        res.status(200).json({
            message:"Success",
            plans:array
        })
    }catch(err){
        console.error(err);
        res.status(404).json({
            message:"Error in Getting of data from databse",
            body:err
        })
    }
}