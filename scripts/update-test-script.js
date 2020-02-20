pm.test("수정(갱신) success코드 정상", ()=>{
    pm.expect(pm.response.json().success).eql(true);
})

pm.test("수정(갱신) 응답코드 정상",()=>{
    pm.expect(pm.response.code).to.be.oneOf([200,202,204]);
})

/*
   Update후 정상처리 확인을 request와 resonse의 내용으로 실시하는 테스트
   'checkFieldName' 에 체크하고자 하는 필드명을 입력하시고 사용하세요
 */
pm.test("수정한 내용이 정상 처리됨", ()=>{
    var checkFieldName = 'username';
    var reqBody = JSON.parse(request.data);
    var requestParam = reqBody[`${checkFieldName}`]; 

    var jsonData = pm.response.json();
    var responseParam = jsonData.data.userName; //응답에서 userName을 가져옴

    pm.expect(responseParam).eql(requestParam); 
})

/*
    예외 테스트(수정 대상 건을 찾지못하는 케이스)가 필요한 경우, inValidTestSkip을 false로 변경하세요.
 */
const inValidTestSkip = true;
(inValidTestSkip ? pm.test.skip : pm.test)("수정(갱신) 대상 건을 찾지 못함", ()=>{
    //나중에 rsltJsonDto에서 메세지를 가지고 판단할 수 있도록 고쳐야 함
    pm.expect(pm.response.json().data).eql(0); //못찾을 경우 data에 0을 보내줌을 가정
})
