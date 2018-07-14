var http = require("http");
var fs = require("fs");
const PORT=process.env.PORT || 8000;

function serverFunc(req,res){
    if(req.url==="/"){
        res.end("hooh i am alive");
    }
}

var server = http.createServer(serverFunc);
server.listen(PORT);