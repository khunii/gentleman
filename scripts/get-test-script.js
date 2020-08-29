var responseDto = {};
try{
    responseDto = pm.response.json();
}catch(err){
    responseDto = {};
}

var isList = Array.isArray(responseDto)


//200 OK검증
pm.test("HTTP 응답 정상", function () {
    pm.response.to.have.status(200);
});

// 1건 이상 조회 검증(단건조회, 다건조회 공통)
pm.test("정상적으로 조회가 수행됨", ()=>{
    if (isList){
        pm.expect(responseDto.length).to.be.above(0);
    }else{
        pm.expect(responseDto).to.not.be.empty;
    }
})
