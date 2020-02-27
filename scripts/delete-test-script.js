var resultJsonDto = {};
try{
    resultJsonDto = pm.response.json();
}catch(err){
    resultJsonDto = {
        success:false,
        data:{status:"response data is nothing"}
    }
}

pm.test("삭제 success코드 정상", ()=>{
    pm.expect(resultJsonDto.success).eql(true);
})

pm.test("삭제 응답코드 정상",()=>{
    pm.expect(pm.response.code).to.be.oneOf([200,202,204]);
})

pm.test("삭제한 내용이 정상 처리됨", ()=>{
    pm.expect(resultJsonDto.data).not.eql(0); 
})