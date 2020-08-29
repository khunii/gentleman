// collection의 하위 request가 호출될 때 마다 호출전 실행되는 공통 스크립트
const authScheme = pm.environment.get("authScheme");
const authHost = pm.environment.get("authHost");  
const authPort = pm.environment.get("authPort");
const authContext = pm.environment.get("authContext");

const userid = 'testuser';
const password = 'password';
  
const authSigninRequest = {  
    url : `${authScheme}://${authHost}:${authPort}${authContext}/jwt/login`,  
    method : "POST",  
    header : "Content-Type:application/json",  
    body:{  
        mode:"application/json",  
        raw: JSON.stringify(  
            {  
                "userId":`${userid}`,  
                "jobPosition":`${jobPosition}`  
            })  
    }  
};  
  
let getToken = true; 

var enabledHeaders = [];
enabledHeaders = pm.request.headers.filter((item)=>{
    return item.disabled !== true;
});

var isIncluded = false;

for(var i=0; i < enabledHeaders.length; i++){
    if (enabledHeaders[i].key === "Authorization"){
        isIncluded = true;
        break;
    }
}
  
if (isIncluded && userid && password){  
    console.log("pre-script, jwt check role in....");
    console.log(pm.environment.get("jwt_expired_time"));
    console.log( (new Date()).getTime());
    //environment check  
    if (!pm.environment.get("jwt_expired_time") || !pm.environment.get("jwt")){  
        console.log("jwt or jwt expired variable missed!!");  
    }else if (pm.environment.get("jwt_expired_time") <= (new Date()).getTime()){
        console.log("jwt expired!!");  
    }else{  
        console.log("jwt OK")  
        getToken = false;  
    }  
   
    //ucube초기에는 authorization을 헤더에 포함하지 않으므로, request가 실행되지는 않는다.
    // if expired , reassign  
    if (getToken && isIncluded){ //token을 새로 받아야 되는 상황이면서, header에 authorization을 가지는 collection일때만 token얻는 request실행  
        pm.sendRequest(authSigninRequest, function(err, res){  
            // console.log("resign start");  
            // console.log(err ? err : res.json().token);  
            if (err === null){  
                let jwt_token = res.json().data['jwtRslt'].idToken;  
                // let parsedToken = JSON.parse(atob(res.json().token.split(".")[1]));  
                let expiryDate = new Date();  
                expiryDate.setSeconds(expiryDate.getSeconds() + res.json().data['jwtRslt'].expiresIn);  
                pm.environment.set("jwt", jwt_token);  
                pm.environment.set("jwt_expired_time", expiryDate.getTime());  
                pm.environment.set("tokenType", res.json().data['jwtRslt'].tokenType)
            }  
  
        });  
    }  
}  