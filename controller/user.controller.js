const { store } = require("../helper/index.helper");

const userGet = (req,res) => {

    return res.status(200).json({
        status : true,
        message : "success, from user controller",
        count: store.length,
        data : store
    })
};


const userPost = (req,res) => {

    return res.status(200).json({
        status : true,
        message : "success, from user controller",
        count: store.length,
        data : store
    })
};

module.exports = {
    userGet,
    userPost
}