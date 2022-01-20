const express = require('express')
const path = require('path')
const fs = require('fs')
const cors = require('cors')

let app = express()
app.use(express.json())

const mongoClient = require('mongodb').MongoClient

let db
mongoClient.connect('mongodb+srv://sa3063:1234@cluster0.mmu69.mongodb.net/lessons_store?retryWrites=true&w=majority', function(err,client){
    db = client.db('lessons_store')
})

app.param('collectionName', function(req,res,next,collectionName){
    req.collection = db.collection(collectionName)
    console.log(req.url)
    return next()
})
app.get('/collection/:collectionName',function(req,res){
    res.send('good')
})

app.post('/collection/:collectionName',function(req,res,next){
    req.collection.insertOne(req.body,function(e,result){
        if (e){
            return next(e)
        }
        else{
            res.send("good")
        }
    })
})

const objectID = require('mongodb').ObjectId
app.get('/collection/:collectionName/:id',function(req,res,next){
    req.collection.findOne({_id:objectID(req.params.id)},function(e,result){
        if (e){
            return next(e)
        }
        else{
            res.send(result)
        }
    })
})
app.put('/collection/:collectionName/:id',function(req,res,next){
    req.collection.updateOne(
        {_id: new objectID(req.params.id)},
        {$set: req.body},
        {safe: true, multi:false},
        function(e,result){
            if (e){
                return next(e)
            }
            else{
                res.send((result.result.n==1) ? {msg: 'success'} : {msg: 'error'})
            }
        }
    )
})
app.delete('/collection/:collectionName/:id',function(req,res,next){
    req.collection.deleteOne(
        {_id: new objectID(req.params.id)},
        {$set: req.body},
        {safe: true, multi:false},
        function(e,result){
            if (e){
                return next(e)
            }
            else{
                res.send((result.result.n==1) ? {msg: 'success'} : {msg: 'error'})
            }
        }
    )
})
app.listen(8080)