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

// 1건 이상 조회 검증
/*
    pm.response.json().data가 Array.isArray()이면 가능하다.
    그렇지 않을 때는 ~json().data가 하나의 json을 리턴하는데 그것을 가지고 판단해야 한다.

 */

pm.test("정상적으로 조회가 수행됨", ()=>{
    if (isList){
        pm.expect(resultJsonDto.data.length).to.be.above(0);
    }else{
        pm.expect(resultJsonDto.data).to.not.be.empty;
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



/*
    예외 테스트가 필요한 경우, inValidTestSkip을 false로 변경하세요.
 */
const inValidTestSkip = true;
(inValidTestSkip ? pm.test.skip : pm.test)("조회 대상 데이터가 없음", ()=>{
    pm.expect(resultJsonDto.data.length).to.be.eql(0);
})