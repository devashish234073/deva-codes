var popupFunc = null;

function popupInput(prmpt,func){
    var form = document.querySelector("#popup");
    var btn = document.querySelector("#prmptBtn");
    if(form===undefined || form===null) {
        form = document.createElement("form");
        form.setAttribute("id","popup");
        form.setAttribute("style","z-index:1;display:block;position:fixed;left:50px;top:50px;background-color:rgba(70,150,100,0.8);width:350px;height:70px;border-radius:13px;");
        formInner="<table style='padding:20px;'><tr>";
        formInner+="<td><font color='white' size=2 id='prmptLabel'>"+prmpt+"</font></td>";
        formInner+="<td>"+"<input type='text' id='prmptTxt'></td>";
        formInner+="<td>"+"<input type='button' value='OK' id='prmptBtn'></td>";
        formInner+="</tr></table>";
        form.innerHTML=formInner;
        document.body.appendChild(form);
        btn = document.querySelector("#prmptBtn");
        btn.addEventListener("click",(evt)=>{
            var form = document.querySelector("#popup");
            form.style.display="none";        
        });
    } else {
        var p = document.querySelector("#prmptLabel");
        p.innerText=prmpt;
        var txt = document.querySelector("#prmptTxt");
        txt.value="";
        form.style.display="block";
    }
    if(popupFunc!==null){
        btn.removeEventListener("click",popupFunc,true);
        popupFunc = null;
    }
    btn.addEventListener("click",func,true);
    popupFunc=func;
}

function hasInvalidChar(strr) {
    if(strr.indexOf(".")>-1 || strr.indexOf(",")>-1 || strr.indexOf(":")>-1 || strr.indexOf("/")>-1 || strr.indexOf("\\")>-1){  
        return true;
    }
    return false;
}

function isValidVersion(verr){
    var verrSplit = verr.split(".");
    if(verrSplit.length>1){
        for(indx in verrSplit){
            if(isNaN(verrSplit[indx])){
                return false;
            }
        }
        return true;
    }
    return false;
}

var mvn = {pName:"",projectCreated:false,pomGenerated:false,clss:{},tempClass:""};

function createNewProject(id,addtionalFiles){
    popupInput("Enter project name:",(evt)=>{
        var txt = document.querySelector("#prmptTxt");
        var pName=txt.value.trim();
        var np=document.querySelector("#"+id);
        if(pName!==null && pName!=undefined && pName!==""){
            if(hasInvalidChar(pName)){
                alert(". , : / \\ are invalid characters");
            } else {
                mvn.pName=pName;
                var innerData="<ul>";
                innerData+="<li>|--"+pName+"</li>";
                innerData+="<li>|----src</li>";
                innerData+="<li>|------main</li>";
                innerData+="<li>|--------java</li>";
                for(indx in addtionalFiles){
                    innerData+="<li>|----<redN>"+addtionalFiles[indx]+"</redN></li>";
                }
                innerData+="</ul>";
                np.innerHTML=innerData;
                mvn.projectCreated=true;
                mvn.classAdded=0;
                mvn.clss=[];
                mvn.pomGenerated=false;
            }
        } else {
            alert("'"+pName+"' is "+"not a valid project name");
            np.innerHTML="";
            mvn.projectCreated=false;
        }
    });
}

function addNewClass(id,addtionalFiles){
    popupInput("Enter class name:",(evt)=>{
        var txt = document.querySelector("#prmptTxt");
        var clssName=txt.value.trim();
        var np=document.querySelector("#"+id);
        if(clssName!==null && clssName!==undefined && clssName!=="" && mvn.projectCreated==true){
            if(hasInvalidChar(clssName)){
                alert(". , : / \\ are invalid characters");
            } else {
                mvn.tempClass=clssName;
                popupInput("Enter package name [leave blank for default]:",(evt)=>{
                    var txt = document.querySelector("#prmptTxt");
                    var pkgName=txt.value.trim();
                    if(hasInvalidChar(pkgName)){
                        alert(". , : / \\ are invalid characters.");
                    } else {
                        if(pkgName===""){
                            if(mvn.clss["DEF.DEFAULT"]===undefined) {
                                mvn.clss["DEF.DEFAULT"]=[mvn.tempClass];
                            } else {
                                mvn.clss["DEF.DEFAULT"].push(mvn.tempClass);
                            }
                        } else {
                            if(mvn.clss[pkgName]===undefined) {
                                mvn.clss[pkgName]=[mvn.tempClass];
                            } else {
                                if(mvn.clss[pkgName].indexOf(mvn.tempClass)===-1){
                                    mvn.clss[pkgName].push(mvn.tempClass);
                                } else {
                                    alert("'"+mvn.tempClass+"' class already exists");
                                }
                            }
                        }
                        var innerData="<ul>";
                        innerData+="<li>|--"+mvn.pName+"</li>";
                        innerData+="<li>|----src</li>";
                        innerData+="<li>|------main</li>";
                        innerData+="<li>|--------java</li>";
                        for(k in mvn.clss){
                            var xtra = "";
                            if(k!=="DEF.DEFAULT"){
                                innerData+="<li>|----------"+k+"</li>";
                                xtra = "--";
                            }
                            var lst=mvn.clss[k];
                            for(clssIndx in lst){
                                innerData+="<li>|----------"+xtra+"<greenN>"+lst[clssIndx]+".java</greenN></li>";
                            }
                        }
                        for(indx in addtionalFiles){
                            innerData+="<li>|----<redN>"+addtionalFiles[indx]+"</redN></li>";
                        }
                        innerData+="</ul>";
                        np.innerHTML=innerData;
                    }
                });
            }
        } else if(mvn.projectCreated===false) {
            alert("Create project first!");
        } else {
            alert("'"+clssName+"' is not a valid class name");
        }
    });
}

var mvn2 = {groupId:"groupId",artifactId:"artifactId",version:"1.0.0"};

function MavenProject_runMvnCompile() {
    popupInput("Enter group Id:",(evt)=>{
        var gId = document.querySelector("#prmptTxt").value;
        if(hasInvalidChar(gId)){
            alert("'"+gId+"' is not a valid groupId.");
        } else {
            mvn2.groupId = gId;
            popupInput("Enter artifact Id:",(evt)=>{
                var aId = document.querySelector("#prmptTxt").value;
                if(hasInvalidChar(aId)){
                    alert("'"+aId+"' is not a valid artifactId.");
                } else {
                    mvn2.artifactId = aId;
                    popupInput("Enter project version:",(evt)=>{
                        var verr = document.querySelector("#prmptTxt").value;
                        if(isValidVersion(verr)){
                            mvn2.version = verr;    
                            mvnCompile(mvn2);                        
                        } else {
                            alert("'"+verr+"' is not a valid version number.");
                        }
                    });
                }
            });
        }
    });
}

function mvnCompile(mvn){
    var pom=document.querySelector("#MavenProject_pom");
    var innerTxt='<textarea rows="22" cols="55"><project xmlns = "http://maven.apache.org/POM/4.0.0" xmlns:xsi = "http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation = "http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">\n';
    innerTxt+="    <modelVersion>4.0.0</modelVersion>\n";
    innerTxt+="    <groupId>"+mvn.groupId+"</groupId>\n";
    innerTxt+="    <artifactId>"+mvn.artifactId+"</artifactId>\n";
    innerTxt+="    <version>"+mvn.version+"</version>\n";

    innerTxt+="    <dependencies>\n";
    innerTxt+="        <dependency>\n";
    innerTxt+="            <groupId>commons-io</groupId>\n";
    innerTxt+="            <artifactId>commons-io</artifactId>\n";
    innerTxt+="            <version>2.6</version>\n";
    innerTxt+="        </dependency>\n";
    innerTxt+="    </dependencies>\n";

    innerTxt+="    <properties>\n";
    innerTxt+="        <maven.compiler.source>1.6</maven.compiler.source>\n";
    innerTxt+="        <maven.compiler.target>1.6</maven.compiler.target>\n";
    innerTxt+="    </properties>\n";
    innerTxt+="</project></textarea>\n";
    innerTxt+="<ul>";
    innerTxt+="<li>jar file gets added in the repository in <green>groupId:artefactId:version</green> path</li>";
    innerTxt+="<li>for this case it is <green>"+mvn.groupId+":"+mvn.artifactId+":"+mvn.version+"</green></li>";
    innerTxt+="<li>repository is in <blue>C:/Users/&lt;Username&gt;/.m2/repository</blue> path</li>";
    pom.innerHTML=innerTxt;
    alert("'pom.xml' generated with 'commons-io' is added as dependency for demo/illustration purpose.");
}