import mongoose from "mongoose"


const blogPostSchema =new mongoose.Schema({
    title: {
        type: String,
        required: "Post title is required",
        unique: true
    },
    
    
    content: {type: String,
        required: "Post content is required"
    },
    
    photo: {
        
        type: String,
        required: true
    
    },
    created: {
        type: Date,
        default: Date.now()
    }
});


export default mongoose.model("BlogPosts", blogPostSchema)