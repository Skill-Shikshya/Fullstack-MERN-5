const auth = (req,res,next) => {
    if(req.headers["authorization"].split(" ")[1] === "Awdkjbawhdbahjwbdhawbd") return next() // pass
    return  res.status(401).json({status:false,message:"unauthorized access"})
};

module.exports = {
    auth
}