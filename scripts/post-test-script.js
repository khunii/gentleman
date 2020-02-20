
pm.test("입력(등록) success코드 정상", ()=>{
    pm.expect(pm.response.json().success).eql(true);
})

pm.test("응답코드 정상",()=>{
    pm.expect(pm.response.code).to.be.oneOf([200,201]);
})

/*
  예외 테스트(필수입력 체크)가 필요한 경우 requiredCheckTestSkip 을 false로 변경하세요
  requiredProperty 배열에는 필수입력 필드의 json Key명을 입력하세요.

  개발중 : snippet업데이트 필요함
 */
const requiredCheckTestSkip = true;
(requiredCheckTestSkip ? pm.test.skip : pm.test)('필수입력 항목이 입력되지 않음', ()=>{
    var reqBody = JSON.parse(request.data);
    var requiredProperty = ['userName', 'userId', 'address'];
    
    for(var i = 0; i < requiredProperty.length; i++){
        pm.expect(reqBody).to.have.property(requiredProperty[i]);
        pm.expect(reqBody[requiredProperty[i]]).to.be.oneOf([null, ""]);
    }
});

