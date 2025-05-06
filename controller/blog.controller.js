const { Blog } = require("../schema/blog.schema");

const blogGet = async (req,res) =>{
    const data = await Blog.find()
    .populate({
        path:"author",
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


const blogPost = async (req,res) => {
    let {title,description,author} = req.body || {};
    if(!title || !description || !author) return res.status(403).json({
        status : false,
        message : "some fields are required."
    });
    const newData  = await Blog.create({title,description,author});
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


const blogPut = async (req,res) => {
    let {title,description,author} = req.body || {};
    const findBlog = await User.findById(req.params.id);
    if(!findBlog) return res.status(406).json({
        status : false,
        message : "blog not found."
    });

    findBlog.title = title || findBlog.title;
    findBlog.description = description || findBlog.description;
    findBlog.author = author || findBlog.author;
    await findBlog.save();

    return res.status(200).json({
        status : true,
        message : "updated",
        data : findBlog
    })
};


const blogDelete = async (req,res) => {
    const findBlog = await Blog.findById(req.params.id);
    if(!findBlog) return res.status(406).json({
        status : false,
        message : "blog not found."
    });

    await Blog.findByIdAndDelete(req.params.id);
    return res.status(204).json({
        status : true,
        message : "success"
    })
};


module.exports = {
    blogGet,
    blogPost,
    blogPut,
    blogDelete
}