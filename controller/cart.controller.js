const { Cart } = require("../schema/cart.schema");

const cartGet = async (req,res) =>{
    const data = await Cart.find()
    .populate({
        path:"userId",
        select:"fullName profileImage"
    }).sort({createdAt: -1});
    
    
    // => SELECT * from users
    return res.status(200).json({
        status : true,
        message : "success",
        count: data.length,
        data : data
    })
};


const cartUserGet = async (req,res) =>{
    const data = await Cart.aggregate([
        // {
        //     // $match : {amount : 500}
        //     // $sort : {amount : -1}
        //     // $skip : 1
        // }
        {
            $group :{
                _id : '$userId',
                totalAmount : {$sum : "$amount"},
                totalItem : {$sum: 1}
            }
        },
        {
            $lookup: {
                from: 'users', // Assuming your user collection is named 'users'
                localField: '_id', // This is the userId from the Cart collection
                foreignField: '_id', // This is the _id field in the User collection
                as: 'user' // The resulting array of matched user details will be stored here
            }
        },
        {
            $unwind: '$user' // If you want to flatten the user details array (assuming 1-to-1 match)
        },
        {
            $project : {
                _id:0,
                totalAmount : 1,
                totalItem:1,
                user: {
                    _id :"$user._id",
                    fullName :"$user.fullName",
                },
               
            }
        }
      
    ]);
    
    return res.status(200).json({
        status : true,
        message : "success",
        count: data.length,
        data : data
    })
};


const cartPost = async (req,res) => {
    let {userId,amount} = req.body || {};
    if(!userId || !amount) return res.status(403).json({
        status : false,
        message : "some fields are required."
    });
    const newData  = await Cart.create({userId,amount});
    if(!newData) return res.status(500).json({
        status : false,
        message : "something went wrong."
    });

    return res.status(201).json({
        status : true,
        message : "success",
        data : newData
    })
};


module.exports = {
    cartGet,
    cartPost,
    cartUserGet,
}