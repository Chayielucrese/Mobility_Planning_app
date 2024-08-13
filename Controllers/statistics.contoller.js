const { where } = require('sequelize')
const User = require('../Models/user')
const Vehicle = require('../Models/vehicle')
const user = require('../Models/user')

exports.statVehicle = async(req, res)=>{
const user = req.user
const total_vehicle = await Vehicle.findAllAndCount({where:{owner:user.id}})

return res.status(200).json({msg: total_vehicle})
}

exports.StatDocumentStatus = async(req, res)=>{
    const doc_status = user.documentStatus
    return res.status(200).json({msg: doc_status})
}

