import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import compress from 'compression'
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/blogRoutes.js';
import path from 'path'

dotenv.config();

const app = express()

const port =  5000 || process.env.PORT
app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use(compress());
app.use(cors());

app.use('/', router)






app.get('/', (req, res) => {
    res.send('Whats really up yo!')
})

// app.listen( ( err) => {
//     if (err) {
//         console.log(err)
//     }
//     console.info(`Server started on port ${port}.`)
// })

app.listen(port, (err) => {
    if (err) {
        console.log(err)
    }
    console.info("Server started on port .", port)
})