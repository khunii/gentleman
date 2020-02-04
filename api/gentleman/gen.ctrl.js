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

const generageEnvironment = (author, swaggerUrl, envName) => {
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
    var pmanEnv =
        swag2pman.convertSwagger()
            .fromJson(swaggerJson)
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

/*
 * 인서트할 스크립트 파일의 따옴표는 모두 쌍따옴표로 되어 있어야 함
 *
 */
const generateCollection = function (author, swaggerUrl) {
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
            console.log(JSON.stringify(converted));
            return converted;
        }
    })

    console.log('testconv ='+JSON.stringify(testConv));
    return testConv;

    // return pmanCollection;
}

const generateCollectionFromJson = function (author, swaggerJson) {
    var author = author;
    var swaggerJson = swaggerJson;

    var pmanCollection =
        swag2pman.convertSwagger()
            // .fromJson(JSON.stringify(swaggerJson))
            .fromJson(swaggerJson)
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
    return pmanCollection;
}

const index = function (req, res) {
    res.render('index.html');
}

const generate = function (req, res) {
    const author = req.body.author;
    const swaggerUrl = req.body.surl;
    console.log('author :' + author);
    console.log('url :' + swaggerUrl);

    if (!author || !swaggerUrl) {
        res.status(400).end("Jira 로그인ID 과 swaggerUrl 을 입력하세요!!!");
    } else {
        //swagger validation
        request(swaggerUrl, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                //db load and check
                repository.loadCollection('users', (users) => {
                    if (repository.isDup(users, author)) {
                        res.status(400).end("이미 생성한 Jira 로그인 ID입니다. 다른 로그인ID로 생성하세요");
                    } else {
                        var collectionJson = generateCollection(author, swaggerUrl);
                        console.log(JSON.stringify(collectionJson));
                        var envJson = generageEnvironment(author, swaggerUrl, 'gsretail_rest_env')
                        var newUser = {
                            userId: author
                        }
                        users.insert(newUser);
                        repository.db.saveDatabase();
                        res.end(JSON.stringify({
                            collection: collectionJson,
                            env: envJson
                        }))
                    }
                });
            } else {
                res.status(400).end("SwaggerURL이 정확하지 않거나, Swagger 서비스가 정상적이지 않습니다.");
            }
        });
    }
}

const generateFromJson = function (req, res) {
    const author = req.body.author;
    const swaggerJson = req.body.swgrJson;

    console.log('Hello generate from json');
    console.log(swaggerJson);

    if (!author || !swaggerJson) {
        res.status(400).end("Jira 로그인ID 와 swaggerUrl 을 입력하세요!!!");
    } else {
        //db load and checkgenerate
        repository.loadCollection('users', (users) => {
            if (repository.isDup(users, author)) {
                res.status(400).end("이미 생성한 Jira 로그인 ID입니다. 다른 로그인ID로 생성하세요");
            } else {
                var collectionJson = generateCollectionFromJson(author, swaggerJson);
                var envJson = generageEnvironmentFromJson(author, swaggerJson, 'gsretail_rest_env')
                var newUser = {
                    userId: author
                }
                users.insert(newUser);
                repository.db.saveDatabase();
                res.end(JSON.stringify({
                    collection: collectionJson,
                    env: envJson
                }))
            }
        });
    }
}


module.exports = { index, generate, generateFromJson };
