var http = require("http");
var fs = require("fs");
const PORT=process.env.PORT || 8000;

var data = fs.readFileSync("content.txt");
data = data.toString('utf-8');
data = data.replace(/\r/g,"");
data = data.split("\n");

var urls = [];
var curr = "";
var heads = {};
var contents = {};

for(var i=0;i<data.length;i++){
    var d = data[i];
    if(d.indexOf("XXXXXXX")===0){
        curr = "";
    } else if(d.indexOf("----URL:")===0){
        urls.push(d.replace("----URL:",""));
        curr = d.replace("----URL:","");
    } else if(d.indexOf("----HEAD:")===0){
        if(curr!==""){
            heads[curr]=d.replace("----HEAD:","");
        }
    } else if(d.indexOf("----CONTENT-START:")===0){
        i++;
        if(curr!==""){
            while(data[i].indexOf("----CONTENT-END:")!==0){
                if(contents[curr]===undefined){
                    contents[curr]=data[i];
                } else {
                    contents[curr]+=data[i];
                    if(data[i].indexOf("<code>")>-1){
                        while(data[i].indexOf("</code>")===-1){
                            i++;
                            var code = data[i];
                            if(data[i].indexOf("</code>")===-1){
                                code = data[i].replace(/</g,"&lt;").replace(/>/g,"&gt;");
                            }
                            contents[curr]+="<br>"+code;
                        }
                    }
                }
                i++;
            }
        }
    }
}

var home = "<h3>Welcome to deva-codes</h3><h5>Visit one of the below:</h5><ul>";
for(var i=0;i<urls.length;i++){
    home+="<li><a href='"+urls[i]+"'>"+heads[urls[i]]+"</a></li>";
}
home+="</ul>";

function serverFunc(req,res){
    res.writeHead(200,{"Content-Type":"text/html"});
    if(req.url==="/"){
        res.end(home);        
    } else {
        var url = req.url.substring(1);
        if(urls.indexOf(url)!==-1){
            res.end(contents[url].replace(/    /g,"&ensp;&ensp;&ensp;&ensp;"));
        } else {
            res.end("Invalid URL!");
        }
    }
}

var server = http.createServer(serverFunc);
server.listen(PORT);
console.log("listening at PORT: "+PORT);
