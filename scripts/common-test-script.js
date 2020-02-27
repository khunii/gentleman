//scheme검증
//응답 스키마 검증(dto제대로 사용하는지 체크 용도)
const schema = {
    "type": "object",
    "properties":{
        "success": {"type":"boolean"},
        "statusCode": {"type":["string","null"]},
        "statusMessage": {"type":["string","null"]},
        "data":{
            "type":["array","object","integer","string","null"]
        }
    },
    "required":["success","statusCode","statusMessage","data"]
};

pm.test("응답 스키마 구조가 정확함", ()=>{
    pm.response.to.have.jsonSchema(schema);
})


