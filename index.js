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
                    if(data[i].indexOf("<code")>-1){
                        while(data[i].indexOf("</code>")===-1){
                            i++;
                            var code = data[i];
                            if(data[i].indexOf("</code>")===-1){
                                code = data[i].replace(/</g,"&lt;").replace(/>/g,"&gt;");
                                code = code.replace(/{{/g,"&#10627;&#10627;").replace(/}}/g,"&#10628;&#10628;");
                            }
                            contents[curr]+="<br>"+code;
                        }
                    } else if(data[i].indexOf("<textarea")>-1){
                        while(data[i].indexOf("</textarea>")===-1){
                            i++;
                            var ta = data[i];
                            if(data[i].indexOf("</textarea>")===-1){
                                ta = data[i].replace(/</g,"&lt;").replace(/>/g,"&gt;");
                            }
                            contents[curr]+="\n"+ta;
                        }
                    }
                }
                i++;
            }
        }
    }
}

function getStyle(){
    var ret = "<style>"+fs.readFileSync("styles.css")+"</style>";
    return ret;
}

function getHomeStyle() {
    var ret = "<style>"+fs.readFileSync("homeStyles.css")+"</style>";
    return ret;
}

function getScript(){
    var script = "<script>"+fs.readFileSync("scripts.js")+"</script>";
    return script;
}

var home = "<div id='top'>Welcome to deva-codes</div>";
home+="<div id='bottom'>";
for(var i=0;i<urls.length;i++){
    home+="<a href='"+urls[i]+"'>"+heads[urls[i]]+" ("+contents[urls[i]].length+" chars)"+"</a>";
}
home+="</div>";
home="<html><meta name='viewport' content='width=device-width, initial-scale=1.0'><head>"+getHomeStyle()+"</head><body>"+home+"</body></html>";

function serverFunc(req,res){
    res.writeHead(200,{"Content-Type":"text/html"});
    if(req.url==="/"){
        res.end(home);        
    } else {
        var url = req.url.substring(1);
        if(urls.indexOf(url)!==-1){
        	var r = contents[url].replace(/    /g,"&ensp;&ensp;&ensp;&ensp;");
        	r = r.replace(/<code>/g,"<div class='code'><code>");
        	r = r.replace(/<\/code>/g,"</code></div>");
        	r = "<html><meta name='viewport' content='width=device-width, initial-scale=1.0'><head>"+getStyle()+"<body>"+r+getScript()+"</body></html>";
            res.end(r);
        } else {
            res.end("Invalid URL!");
        }
    }
}

var server = http.createServer(serverFunc);
server.listen(PORT);
console.log("listening at PORT: "+PORT);