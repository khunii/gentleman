var resultJsonDto = {};
try{
    resultJsonDto = pm.response.json();
}catch(err){
    resultJsonDto = {
        success:false,
        data:{status:"response data is nothing"}
    }
}


pm.test("입력(등록) success코드 정상", ()=>{
    pm.expect(resultJsonDto.success).eql(true);
})

pm.test("응답코드 정상",()=>{
    pm.expect(pm.response.code).to.be.oneOf([200,201]);
})

/*
   필수항목 필드 지정방법
   아래의 requiredProperty 배열에 필수항목 필드명을 입력하시면 됩니다.
   ex) productId, price 가 필수일때
   var requiredProperty = ['productId', 'price'];
 */
pm.test('필수입력 항목이 입력됨', ()=>{
    var reqBody = JSON.parse(request.data);
    var requiredProperty = [];
    
    for(var i = 0; i < requiredProperty.length; i++){
        pm.expect(reqBody).to.have.property(requiredProperty[i]);
        pm.expect(reqBody[requiredProperty[i]]).not.to.be.oneOf([null, ""]);
    }
});