var resultJsonDto = pm.response.json();

pm.test("수정(갱신) success코드 정상", ()=>{
    pm.expect(resultJsonDto.success).eql(true);
})

pm.test("수정(갱신) 응답코드 정상",()=>{
    pm.expect(pm.response.code).to.be.oneOf([200,202,204]);
})

/*
   Update후 정상처리 확인을 request와 resonse의 내용으로 실시하는 테스트
   'checkFieldName' 에 체크하고자 하는 필드명을 입력하시고 사용하세요
 */
pm.test("수정한 내용이 정상 처리됨", ()=>{
    var checkFieldName = 'userName'; //username이 체크하고자 하는 필드명임을 가정함
    var reqBody = JSON.parse(request.data);
    var requestParam = reqBody[`${checkFieldName}`]; 
    var responseParam = resultJsonDto.data[`${checkFieldName}`]; //응답에서 userName을 가져옴

    pm.expect(responseParam).eql(requestParam); 
})