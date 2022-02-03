const express = require('express')
const path = require('path')
const fs = require('fs')
const cors = require('cors')

let app = express()
app.use(express.json())
app.use(cors())

const mongoClient = require('mongodb').MongoClient

//connect to mongoDB
let db
mongoClient.connect('mongodb+srv://sa3063:1234@cluster0.mmu69.mongodb.net/lessons_store?retryWrites=true&w=majority', function(err,client){
    db = client.db('lessons_store')
})

//logger
app.use(function(req,res,next){
    console.log("Request ID: "+req.url)
    console.log("Request Date: "+ new Date())
    next()
})

//identify collection name for all requests
app.param('collectionName', function(req,res,next,collectionName){
    req.collection = db.collection(collectionName)
    return next()
})

//root url
app.get('/',function(req,res){
    res.send("/collection/lessons to view all lessons")
})

//serve static image files
app.get('/images/:image',function(req,res,next){
    let imageName = req.params.image+".jpeg"
    var filePath = path.join(__dirname,"images",imageName)
    fs.stat(filePath,function(err,fileInfo){
        if(err){
            next()
            return
        }
        else if(fileInfo.isFile()) res.sendFile(filePath)
    })
})

//gets all lessons
app.get('/collection/:collectionName',function(req,res,next){
    req.collection.find({}).toArray(function(err,results,next){
        if (err){
            return next(err)
        }
        else{
            res.send(results)
        }
    })
})

//gets searched lessons
app.get('/search/:searchValue/:collectionName',function(req,res,next){
    let searchString = req.params.searchValue
    req.collection.createIndex( { Subject: "text", Location: "text" } )
    req.collection.find( { $text: { $regex: "/"+searchString+"/"} } ).toArray(function(err,results,next){
        if (err){
            return next(err)
        }
        else{
            res.send(results)
        }
    })
})

//saves new order to the collection
app.post('/collection/:collectionName',function(req,res,next){
    req.collection.insertOne(req.body,function(err,result){
        if (err){
            return next(err)
        }
        else{
            res.send("success")
        }
    })
})

//updates number of spaces using unique lessonID after order is submitted
app.put('/collection/:collectionName/:lessonID',function(req,res,next){
    req.collection.updateOne(
        {lessonID: req.params.lessonID},
        {$set: req.body},
        {safe: true, multi:false},
        function(err,result){
            if (err){
                return next(err)
            }
            else{
                if(result.acknowledged){
                    res.send("success")
                }
                else{
                    res.send("error")
                }
            }
        }
    )
})

//Error handling
app.use(function(req,res){
    res.send("error")
})

const port = process.env.PORT || 3000
app.listen(port)