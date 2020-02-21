var resultJsonDto = pm.response.json();
var isList = Array.isArray(resultJsonDto.data)

//200 OK검증
pm.test("HTTP 응답 정상", function () {
    pm.response.to.have.status(200);
});

// success 검증
pm.test("응답은 success", ()=>{
    pm.expect(resultJsonDto.success).eql(true);
})

// 1건 이상 조회 검증(단건조회, 다건조회 공통)
pm.test("정상적으로 조회가 수행됨", ()=>{
    if (isList){
        pm.expect(resultJsonDto.data.length).to.be.above(0);
    }else{
        pm.expect(resultJsonDto.data).to.not.be.empty;
    }
})

/*
   단건 조회 데이터가 조회되었는지 검증이 필요한 경우 skipValidSingle를 false로 변경하세요.
 */
const skipValidSingle = true;
(skipValidSingle ? pm.test.skip : pm.test)("조회조건에 맞는 데이터가 조회됨", ()=>{
    //http://localhost:9080/fo/cu/users/jacob 이라는 요청에서 jacob을 얻기위해서는
    //pm.request.url.path 배열에서 구해야 함
    //여기서 path에는 [fo, cu, users, jacob] 처럼 입력되므로, 
    //jacob의 index인 3을 condIdx로 지정함
    var condIdx = 3;
    var property = 'userId' // response json에서 검증을 위해 찾아야할 property
    var requestParam = pm.request.url.path[condIdx];
    if (!isList){
        var responseParam = resultJsonDto.data[`${property}`];
        if (!isNaN(responseParam)){
            responseParam = responseParam.toString();
        }
        pm.expect(responseParam).eql(requestParam);
    }
})

/*
   페이지별 조회건수 제한 검증이 필요한 경우 limitTestSkip을 false로 변경 하세요
   var queryKey에 지정한 'paging' 대신 자신의 query param key명을 입력하면 됩니다.
   ex) http://localhost:9090/board?page=2&limit=20 의 경우 limit을 입력

 */
const limitTestSkip = true;
(limitTestSkip ? pm.test.skip : pm.test)("페이지별 조회건수 제한만큼 조회됨", ()=>{
    var queryKey = 'paging';
    var pagingParam = pm.request.url.query.map(
        function(item){
            if(item.key == `${queryKey}`){
                return item.value;
            }
        }
    )
    if (isList){
        pm.expect(resultJsonDto.data.length).to.be.below(pagingParam+1);
    }
})