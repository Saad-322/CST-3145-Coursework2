const express = require('express')
const path = require('path')
const fs = require('fs')
const cors = require('cors')

let app = express()

app.use(cors())

app.get('/lessons',function(request,response,next){
    var filePath = path.join(__dirname,"static",'lessons.txt')
    fs.stat(filePath,function(err,fileInfo){
        if(err){
            next()
            return
        }
        else if(fileInfo.isFile()) response.sendFile(filePath)
    })
})

app.get('/user',function(request,response,next){
    var filePath = path.join(__dirname,"static",'users.txt')
    fs.stat(filePath,function(err,fileInfo){
        if(err){
            next()
            return
        }
        else if(fileInfo.isFile()){
            response.sendFile(filePath)
        }
    })
})

app.use(function(request,response){
    response.send("Error: File not found")
})
app.listen(3000)