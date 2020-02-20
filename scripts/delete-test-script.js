pm.test("삭제 success코드 정상", ()=>{
    pm.expect(pm.response.json().success).eql(true);
})

pm.test("삭제 응답코드 정상",()=>{
    pm.expect(pm.response.code).to.be.oneOf([200,202,204]);
})

pm.test("삭제한 내용이 정상 처리됨", ()=>{
    pm.expect(pm.response.json().data).not.eql(0); 
})

/*
    예외 테스트(수정 대상 건을 찾지못하는 케이스)가 필요한 경우, inValidTestSkip을 false로 변경하세요.
 */
const inValidTestSkip = true;
(inValidTestSkip ? pm.test.skip : pm.test)("삭제 대상 건을 찾지 못함", ()=>{
    //나중에 rsltJsonDto에서 메세지를 가지고 판단할 수 있도록 고쳐야 함
    pm.expect(pm.response.json().data).eql(0); //못찾을 경우 data에 0을 보내줌을 가정
})