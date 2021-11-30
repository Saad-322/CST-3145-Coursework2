const express = require('express') //Requires the Express module
const fs = require('fs')
const path = require('path')
const http = require('http')
const { url } = require('inspector')

//calls the express function to stat a new Express application
const app = express()

app.use (function(request, response, next){//middleware
    console.log("server running for "+request.url)
    next()
})
app.use(function(request,response,next){
    var filePath = path.join(__dirname,"static",request.url);
    fs.stat(filePath,function(err,fileInfo){
        if(err){
            next()
            return
        }
        if(fileInfo.isFile()) response.sendFile(filePath)
    })
})
app.use(function(request,response){
    response.status(404)
    response.end("file not found BRO")
})

app.listen(3000,function(){
    console.log("Express server started.")
}) //Start the server