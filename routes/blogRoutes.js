import express from 'express'
// import blogCtrl from '../controller/blogPosts.controller.js'
import mongoose from 'mongoose';
import multer from 'multer';
// import formidable from 'formidable'
import fs from 'fs';
// import GridFsStorage from 'multer-gridfs-storage';
import { promisify } from 'util';
import stream from 'stream';
// import { fileURLToPath } from 'url';
import BlogPosts from '../models/blogPosts.model.js'
// import crypto from 'crypto';
import dotenv from 'dotenv';
import { dirname } from 'path';
import path from 'path'

dotenv.config();


// const pipeline = promisify(stream.pipeline)

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname();
// const upload = multer();

const router = express.Router()


// db
 
const uri = `mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@merndb.kcirj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

// const connector = mongoose.createConnection(uri, {
    
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true
// });


mongoose.connect(uri, {
    
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${uri}`)
    console.log('Hey db connected')
})




// let gfs;
// connector.once('error', () => {
    // throw new Error(`unable to connect to database: ${uri}`)
    // gfs = new mongoose.mongo.GridFSBucket(connector.db, {
    //     bucketName: 'uploads'
    // })
// })

// mongoose.connection.once('open', () => {
//     // gfs = new mongoose.mongo.GridFSBucket(connect.db, {
//     //     bucketName: "uploads"
//     // });
// });



// router.route('/api/blogposts')
//     .get(blogCtrl.list)
//     .post(blogCtrl.create)



// const storage = new GridFsStorage({
//     url : uri,
//     file: (req, file) => {
//         return new Promise((resolve, reject) => {
//             crypto.randomBytes(16, (err, buf) => {
//                 if (err) {
//                     return reject(err);
//                 }
//                 const filename = buf.toString('hex') + path.extname(file.originalname);
//                 const fileInfo = {
//                     filename: filename,
//                     bucketName: 'uploads'
//                 };
//                 resolve(fileInfo);
//             });
//         });
//     }
// });

// const upload = multer({ storage });


const storage =    multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./../client/public/uploads/images")
    },
    filename: (req, file, callback) => {
        callback(null, req.body.title + file.detectedFileExtension)
    }
});


// const upload = multer({ storage: storage })

const upload = multer();
    
router.post('/api/blogposts', upload.single('photo'), async(req, res) => {
   
    
    // console.log(req.file.originalname)
    const blogPost = new BlogPosts({
        title: req.body.title,
        content: req.body.content,
        photo: req.file.originalname
        
    });


    // const { file, body: { title, content }
    // } = req

    // const filename = title + file.detectedFileExtension;
    try {

    //     await pipeline(
    //         file.stream, fs.createWriteStream(`${__dirname}/../client/public/uploads/images/${filename}`)
    //     )

        await blogPost.save().then((post) => {
            res.status(200).send("Post uploaded successfully")
        })

            // res.send(`post uploaded`)
        console.log(blogPost)
    } catch (error) {
        res.send(error.message)
        console.log(error)
        // return res.send(err)
    }
})

// router.post('/api/blogposts', (req, res, next) => {
//     let form = new formidable.IncomingForm()
//     form.keepExtentions = true
    
//     form.parse(req, async (err, fields, files) => {
//         if (err) {
//             return res.status(400).json({
//                error: "Image could not be uploaded"
//            })
//         }

//         let newPost = new BlogPosts(fields);
//         newPost.photo = files.photo
//         if (files.photo) {
            
//             console.log(files)
//         newPost.photo.data = fs.readFileSync(files.photo.path)
//         newPost.photo.contentType = files.photo.type;
//             // console.log(newPost)
//         }
        
//     } )

// })


router.get('/api/blogposts', async (req, res) => {
            //  await BlogPosts.deleteMany({})
    try {
        let posts = await BlogPosts.find({})
        
        console.log(posts)
        const dateSorted = await posts.sort(
            (a, b) => b.created - a.created
        );
        res.json(posts)
    } catch (err) {
        return res.status(400).json({error: err})   
    }

})

// single post
router.get('/api/blogposts/:id', async (req, res) => {
   
    try {
        let post = await BlogPosts.findById(req.params.id)
        res.status(201).send(post)
    } catch (error) {
        return res.status(500).json(error)
    }


})


// router.route('/api/blogPosts/:postId')
//     .get(blogCtrl.read)
//     .put(blogCtrl.update)
//     .delete(blogCtrl.remove)


// router.param('postId', blogCtrl.postByID)
    
export default router