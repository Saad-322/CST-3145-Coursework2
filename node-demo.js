let url = require('url')
let http = require('http')
let Mustache = require('mustache')//curly brackets
let parsedURL = url.parse('https://www.domain.com/folder/index.html?parameter=value')
let result = Mustache.render("Hi, {{first}} {{second}}",{
    first:"Saad",
    second:"Ahmad"
});
function requestHandler(request,response){
    console.log("incoming request from "+request.url)//server
    response.end("hello from the node.js server")//client
}
let server = http.createServer(requestHandler)
server.listen(3000)//start server on port 3000