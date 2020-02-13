const hostname = pm.environment.get("host");  
const port = pm.environment.get("port");
const username = 'username';
const password = 'password';
  
const authSigninRequest = {  
    url : `http://${hostname}:${port}/auth/signin`,  
    method : "POST",  
    header : "Content-Type:application/json",  
    body:{  
        mode:"application/json",  
        raw: JSON.stringify(  
            {  
                "username":`${username}`,  
                "password":`${password}`  
            })  
    }  
};  
  
let getToken = true;  
  
if (pm.request.headers.get("Authorization") && username && password){  
    console.log("pre-script, jwt check role in....");
    // console.log(pm.environment.get("jwt_expired_time"));
    // console.log( (new Date()).getTime());
    //environment check  
    // if (!pm.environment.get("jwt_expired_time") || !pm.environment.get("jwt")){  
    //     console.log("jwt or jwt expired variable missed!!");  
    // }else if (pm.environment.get("jwt_expired_time") <= (new Date()).getTime()){
    //     console.log("jwt expired!!");  
    // }else{  
    //     console.log("jwt OK")  
    //     getToken = false;  
    // }  
      
    // if expired , reassign  
    if (getToken){  
        pm.sendRequest(authSigninRequest, function(err, res){  
            // console.log("resign start");  
            console.log(err ? err : res.json().token);  
            if (err === null){  
                let jwt_token = res.json().token;  
                let parsedToken = JSON.parse(atob(res.json().token.split(".")[1]));  
                let expiryDate = new Date();  
                expiryDate.setSeconds(expiryDate.getSeconds() + parsedToken.exp);  
                pm.environment.set("jwt", jwt_token);  
                pm.environment.set("jwt_expired_time", expiryDate.getTime());  
            }  
  
        });  
    }  
}  