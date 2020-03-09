/*
* @author into collection
* @jira into each request
* pre-script related to JWT
* standard assertion code into each request
* environment 변수 파일은 서버에 static 으로 가지고 있다가 동시에 다운로드 되도록 한다.
* 
*/
var fs = require('fs');
var swag2pman = require("swagger2-postman-generator");
var repository = require('./gen.db');
var request = require('request');
var transformer = require('postman-collection-transformer');
var ejs = require('ejs');

//함수영역
const generageEnvironment = (author, swaggerUrl, envName) => { //deprecated
    var pmanEnv =
        swag2pman.convertSwagger()
            .fromUrl(swaggerUrl)
            .toPostmanEnvironment({
                environment: {
                    name: envName,
                    customVariables: [{
                        key:"jwt",
                    },{
                        key:"jwt_expired_time"
                    }]
                }
            })
    var availableEnv = ['scheme', 'host', 'port', 'jwt', 'jwt_expired_time'];            
    var customValues = pmanEnv.values.filter(variable => {
        return availableEnv.includes(variable.key);
    });

    pmanEnv.values = customValues;
    return pmanEnv;
}

const generageEnvironmentFromJson = (author, swaggerJson, envName) => {
    //var title = swaggerJson.info.title;
    var swaggerObj = JSON.parse(swaggerJson);
    var title = swaggerObj.info.title;
    var host = swaggerObj.host;
    var idx = host.lastIndexOf(':');
    var hostAddr = host.substring(0,idx);
    var pmanPort = '80';
    if (idx > -1){
        pmanPort = host.substr(idx+1);
    }

    //authScheme, authHost, authPort, authContext 는 jwt를 리턴하는 서비스 api의 환경변수임.
    //개발동안은 임시로 foev프로젝트의 사용자로그인으로 사용하며
    //http://localhost:8090/ev 까지가 each 환경변수에 입력되며
    //full URL은 http://localhost:8090/ev/jwt/login임
    var pmanEnv =
        swag2pman.convertSwagger()
            .fromJson(swaggerJson)
            .toPostmanEnvironment({
                environment: {
                    name: envName+'_for_'+title,
                    customVariables: [{
                        key:"jwt",
                    },{
                        key:"jwt_expired_time"
                    },{
                        key:"tokenType"
                    },{
                        key:"authScheme",
                        value:"http"
                    },{
                        key:"authHost",
                        value:"27.122.139.210"
                    },{
                        key:"authPort",
                        value:"8050"
                    },{
                        key:"authContext",
                        value:"/fo/cu"
                    }]
                }
            })
    var availableEnv = ['scheme', 'host', 'port', 'jwt', 'jwt_expired_time','tokenType','authScheme','authHost','authPort','authContext'];            
    var customValues = pmanEnv.values.filter(variable => {
        return availableEnv.includes(variable.key);
    });

    customValues.forEach(item=>{
        if (item.key === 'port'){
            item.value = pmanPort;
        }else if(item.key === 'host'){
            item.value = hostAddr;
        }
    })

    pmanEnv.values = customValues;
    return pmanEnv;
}

/*
 * 인서트할 스크립트 파일의 따옴표는 모두 쌍따옴표로 되어 있어야 함
 *
 */
const generateCollection = function (author, swaggerUrl) {//deprecated
    var author = author;
    var swaggerUrl = swaggerUrl;

    var pmanCollection =
        swag2pman.convertSwagger()
            .fromUrl(swaggerUrl)
            .toPostmanCollection({
                prettyPrint: true
            });

    var preScript = fs.readFileSync("./scripts/pre-script.js", "utf-8").split("\n");
    var postScript = fs.readFileSync("./scripts/post-script.js", "utf-8").split("\n");

    pmanCollection.name = author + '_' + pmanCollection.name;
    pmanCollection.description = '@author ' + author;
    pmanCollection.events = [{
        "listen": "prerequest",
        "script": {
            "id": "f8384b11-f3a7-4a87-86a5-9fa54f7e1c73",
            "type": "text/javascript",
            "exec": preScript
        }
    }];
    pmanCollection.requests.forEach((item) => {
        item.description = '@jira';
        item.events = [{
            "listen": "test",
            "script": {
                "id": "fa1c2cce-39bc-467a-b7e5-a7187edafb01",
                "type": "text/javascript",
                "exec": postScript
            }
        }]
    })

    //transform v2.0
    var options = {
        inputVersion: '1.0.0',
        outputVersion: '2.0.0',
        retainIds: true
    };

    var testConv = transformer.convert(pmanCollection, options, function(err, converted){
        if (!err){
            //console.log(JSON.stringify(converted));
            return converted;
        }
    })

    //console.log('testconv ='+JSON.stringify(testConv));
    return testConv;

    // return pmanCollection;
}

const generateCollectionFromJson = function (author, swaggerJson, group) {
    var author = author;
    var swaggerJson = swaggerJson;
    var group = group;

    var pmanCollection =
        swag2pman.convertSwagger()
            // .fromJson(JSON.stringify(swaggerJson))
            .fromJson(swaggerJson)
            .toPostmanCollection({
                globalHeaders:[
                    "Authorization:{{tokenType}} {{jwt}}"
                ],
                prettyPrint: true
            });

    var preScript = fs.readFileSync("./scripts/pre-script.js", "utf-8").split("\n");
    var postScript;
    var commonTestScript = fs.readFileSync("./scripts/common-test-script.js", "utf-8").split("\n");
    var getTestScript = fs.readFileSync("./scripts/get-test-script.js", "utf-8").split("\n");
    var postTestScript = fs.readFileSync("./scripts/post-test-script.js", "utf-8").split("\n");
    var updateTestScript = fs.readFileSync("./scripts/update-test-script.js", "utf-8").split("\n");
    var deleteTestScript = fs.readFileSync("./scripts/delete-test-script.js", "utf-8").split("\n");

    // var group = pmanCollection.name;
    pmanCollection.name = author + '_' + pmanCollection.name;
    pmanCollection.description = '@author ' + author + '\n' + '@group ' + group;
    pmanCollection.events = [{
        "listen": "prerequest",
        "script": {
            //"id": "f8384b11-f3a7-4a87-86a5-9fa54f7e1c73",
            "type": "text/javascript",
            "exec": preScript
        }
      },
      {
        "listen": "test",
        "script": {
            //"id": "f8384b11-f3a7-4a87-86a5-9fa54f7e1c74",
            "type": "text/javascript",
            "exec": commonTestScript
        }
      }
    ];

    var rawtype = {};
    rawtype.language = 'json';
    pmanCollection.requests.forEach((item) => {

        if(item.method == 'GET'){
            postScript = getTestScript;
        }else if (item.method == 'POST'){
            postScript = postTestScript;

        }else if (item.method == 'PUT'){
            postScript = updateTestScript;

        }else if (item.method == 'DELETE'){
            postScript = deleteTestScript;
        }
        item.description = '@jira';
        item.events = [{
            "listen": "test",
            "script": {
                //"id": "fa1c2cce-39bc-467a-b7e5-a7187edafb01",
                "type": "text/javascript",
                "exec": postScript
            }
        }]

        //GET방식인데 @ReqeustBody로 매핑되어 body에 json이 포함된 api의 경우,
        //Postman에서 첫 import후 로드시켜 보면 body의 json이 모두 사라져 있게 된다.
        //Postman버그로 보이며(올드버전에서는 아예 GET인데 body가 있으면 request send도 안되었다고 한다.)
        //이를 최소의 노력으로 방지하기 위해 dataMode가 raw이면 분명 body가 존재한다는 것이므로 
        //그럴때는 타입을 json으로 , 거기다가 GET방식일때만 POST로 임시전환해서 컬렉션 생성한다.
        //사용자는 우선 body를 살리고(이게 더 effort가 듬), 단순히 방식만 POST에서 GET으로 변환 후 사용
        if (item.dataMode == 'raw'){
            item.dataOptions = {};
            item.dataOptions.raw = rawtype;//raw로 들어가는 body는 무조건 json type으로 지정
            if (item.method == 'GET'){
                item.method = 'POST'; 
            }
        }
    })
    //transform v2.0
    var options = {
        inputVersion: '1.0.0',
        outputVersion: '2.0.0',
        retainIds: true
    };

    var testConv = transformer.convert(pmanCollection, options, function(err, converted){
        if (!err){
            return converted;
        }
    })
    return testConv;
}


//routing영역(Controller)
const index = function (req, res) {
    res.render('index.html');
}

const generate = function (req, res) {
    const author = req.body.author;
    const swaggerUrl = req.body.surl;
    const allowDup = req.body.allowDup;

    if (!author || !swaggerUrl) {
        res.status(400).end("Jira 로그인ID 과 swaggerUrl 을 입력하세요!!!");
    } else {
        request(swaggerUrl, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                if(allowDup=='false'){
                        //db load and check
                    repository.loadCollection('users', (users) => {
                        if (repository.isDup(users, author+swaggerUrl)) {
                            res.status(400).end("이미 생성한 Jira 로그인 ID입니다. 다른 로그인ID로 생성하세요");
                        } else {
                            var collectionJson = generateCollection(author, swaggerUrl);
                            var envJson = generageEnvironment(author, swaggerUrl, 'envar')
                            var newUser = {
                                userId: author+swaggerUrl
                            }
                            users.insert(newUser);
                            repository.db.saveDatabase();
                            res.end(JSON.stringify({
                                collection: collectionJson,
                                env: envJson
                            }))
                        }
                    });
                }else{
                    var collectionJson = generateCollection(author, swaggerUrl);
                    var envJson = generageEnvironment(author, swaggerUrl, 'envar')
                    res.end(JSON.stringify({
                        collection: collectionJson,
                        env: envJson
                    }))
                }
            } else {
                res.status(400).end("SwaggerURL이 정확하지 않거나, Swagger 서비스가 정상적이지 않습니다.");
            }
        });
    }
}

const generateFromJson = function (req, res) {
    const author = req.body.author;
    const swaggerJson = req.body.swgrJson;
    const swaggerUrl = req.body.swgrUrl;
    const allowDup = req.body.allowDup;
    const group = req.body.group;

    if (!author || !swaggerJson) {
        res.status(400).end("Jira 로그인ID 와 swaggerUrl 을 입력하세요!!!");
    } else {
        if (allowDup == 'false'){
            //db load and checkgenerate
            repository.loadCollection('users', (users) => {
                if (repository.isDup(users, author+swaggerUrl)) {
                    res.status(400).end("이미 생성한 Jira 로그인 ID입니다. 다른 로그인ID로 생성하세요");
                } else {
                    var collectionJson = generateCollectionFromJson(author, swaggerJson, group);
                    var envJson = generageEnvironmentFromJson(author, swaggerJson, 'envar')
                    var newUser = {
                        userId: author+swaggerUrl
                    }
                    users.insert(newUser);
                    repository.db.saveDatabase();
                    res.end(JSON.stringify({
                        collection: collectionJson,
                        env: envJson
                    }))
                }
            });
        }else{
            var collectionJson = generateCollectionFromJson(author, swaggerJson, group);
            var envJson = generageEnvironmentFromJson(author, swaggerJson, 'envar')
            res.end(JSON.stringify({
                collection: collectionJson,
                env: envJson
            }))
        }
    }
}

const listapi = function(req, res){
    const author = req.body.hAuthor;
    const swaggerJson = req.body.hSwaggerJson;
    const group = req.body.hGroup;

    var collectionJson = generateCollectionFromJson(author, swaggerJson, group);
    var envJson = generageEnvironmentFromJson(author, swaggerJson, 'envar');

    //generate된 json에서 item 추출하여 아래에 전달필요.
    res.render('myapi.ejs', {
        collection:collectionJson,
        folder:collectionJson.item,
        env:envJson
    });
}

const showapis = function(req, res){
    
    const author = req.body.author;
    const swaggerJson = req.body.swaggerJson;

    var collectionJson = generateCollectionFromJson(author, swaggerJson);
    var envJson = generageEnvironmentFromJson(author, swaggerJson, 'envar');
    var newName = collectionJson.info.name;
    ejs.renderFile('views/appendableList.ejs',{folder:collectionJson.item},{},(err, html)=>{
        if(err){
            res.status(400).end('리스트 수신에 실패했습니다.');
        }else{
            res.json({
                html:html,
                folders:collectionJson.item,
                env:envJson,
                newName:newName
            });
        }
    })
}

const checkDupId = function(req, res){
    const author = req.body.author;
    const swaggerUrl = req.body.swgrUrl;

    if (!author) {
        res.status(400).end("Jira 로그인ID를 입력하세요!!!");
    } else {
        //db load and checkgenerate
        repository.loadCollection('users', (users) => {
            if (repository.isDup(users, author+swaggerUrl)) {
                res.status(400).end("이미 생성한 Jira 로그인 ID입니다. 다른 로그인ID로 생성하세요");
            } else {
                var newUser = {
                    userId: author+swaggerUrl
                }
                users.insert(newUser);
                repository.db.saveDatabase();
                res.end(JSON.stringify({status : 'success'}));
            }
        });
    }
}

const importcoll = function(req, res){
  var importedJson = JSON.parse(String(req.file.buffer).toString('utf-8'));
  
  if (importedJson.info){
    var isPostmanCollection = importedJson.info.hasOwnProperty('_postman_id');
    if (!isPostmanCollection) {
        res.status(400).end('포스트맨에서 export한 collection을 사용해 주십시오.')
    }
  }else{
    res.status(400).end('포스트맨에서 export한 collection을 사용해 주십시오.')
  }
  res.end(JSON.stringify(importedJson));
}

module.exports = { index, generate, generateFromJson, listapi, checkDupId, importcoll, showapis };
