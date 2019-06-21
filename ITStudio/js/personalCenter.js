//var urlPre = 'http://127.0.0.1:8000';
var urlPre = 'http://52.82.124.217:9998';

var cookieid = getCookie("cookieid");
/*
 * 个人中心数据
 */

$.ajax({
    type:"GET",
    //url:"json/person.json",
    url:urlPre+"/api/user/getInfo",
    data:{
        "cookieid":cookieid
    },
    dataType:"json",
    success:function(data){
        console.log(data);
        if(data.status=='1'){
            /*
             * 个人信息
             */
            var info = data.userInfo;
            $(".info-main").find("img").attr("src",info.userIcon);
            $(".info-main").find("h1").text(info.userName);
            $(".info-main").find("p").text(info.userDescrip);
            var userdata = [info.userCompany,info.userCareer,info.userWeibo,info.userWechat,info.userMail,info.userPhone];
            var i=0;
            $(".info-detail").find("p").each(function(){
                $(this).text(userdata[i++]);
            })

            /*
             * 阅读量统计
             */
            var reading = data.readStatistics;
            var chart = $(".read-chart").find("ul");
            var begin = reading[0].year+"-"+reading[0].month+"-"+reading[0].day;
            var end = reading[reading.length-1].year+"-"+reading[reading.length-1].month+"-"+reading[reading.length-1].day;
            var count = getAll(begin,end);
            console.log(count);
            for(var i=0,j=0;i<count.length;i++){
                var y = count[i].substr(0,4);
                var m = count[i].substr(5,2);
                var d = count[i].substr(8,2);
                console.log(y+"-"+m+"-"+d);
                var li = $("<li>").appendTo(chart);
                if(y==reading[j].year && m==reading[j].month && d==reading[j].day){
                    console.log(y+"-"+m+"-"+d);
                    var num = $("<span>").text(reading[j].reading).appendTo(li);
                    var col = $("<div>").css("height",reading[j].reading*5+'px').addClass("level"+reading[j].readLevel).appendTo(li);
                    //var date = $("<p>").text(reading[j].month + "." + reading[j].day).appendTo(li);
                    j++;
                }else {
                    var num = $("<span>").appendTo(li);
                    var col = $("<div>").css("height",0).appendTo(li);
                    //var date = $("<p>").appendTo(li);
                }
                if(d%5==0){
                    var date = $("<p>").text(y.substr(2,2)+"."+m+"."+d).appendTo(li);
                }else {
                    var date = $("<p>").appendTo(li);
                }
            }
            // for(var i=0;i<reading.length;i++){
            //     var y = reading[i].year+"";
            //     var li = $("<li>").appendTo(chart);
            //     var num = $("<span>").text(reading[i].reading).appendTo(li);
            //     var col = $("<div>").css("height",reading[i].reading+'px').addClass("level"+reading[i].readLevel).appendTo(li);
            //     var date = $("<p>").text(reading[i].month + "." + reading[i].day).appendTo(li);
            // }

            /*
             * 收藏
             */
            var article = data.laterWatch;
            var list = $(".articles");
            for(var i=0;i<article.length;i++){
                var articleItem = $("<div>").attr("id","issay"+article[i].articleId).addClass("p-article-item").appendTo(list);
                var img = $("<img>").attr("src",article[i].articleImg).appendTo(articleItem);
                var articleInfo = $("<div>").addClass("article-info").appendTo(articleItem);
                var title = $("<h1>").text(article[i].articleTitle).addClass("hot"+article[i].articleHot).appendTo(articleInfo);
                var through = $("<span>").text(article[i].articleThrough+"人浏览").appendTo(articleInfo);
                var time = $("<span>").text(getDateDiff(article[i].articleTime)).appendTo(articleInfo);
                var later = article[i].articleLater=="not-later-watch"?$("<button>").addClass("not-later-watch").appendTo(articleInfo):$("<button>").addClass("later-watch").appendTo(articleInfo);
                var deleteArticle = $("<button>").addClass("delete-article").appendTo(articleInfo);
                var reading = $("<p>").text(article[i].articleReading).appendTo(articleInfo);
            }
        }
    }
})


/*
 * 从稍后再看中删除
 */
$(".articles").on("click",".delete-article",function(){
    var id = $(this).parent().parent(".p-article-item").attr("id").substr(5);
    $.ajax({
        type: "GET",
        //url:"json/laterWatch",
        url: urlPre+"/api/laterWatch",
        data: {
            "cookieid":cookieid,
            "action": "delete",
            "articleId": id
        },
        dataType: "json",
        success: function (data) {
            console.log(data);
            if(data.msg=="success"){
                var article = data.laterWatch;
                var list = $(".articles");
                list.empty();
                for(var i=0;i<article.length;i++){
                    var articleItem = $("<div>").attr("id","issay"+article[i].articleId).addClass("p-article-item").appendTo(list);
                    var img = $("<img>").attr("src",article[i].articleImg).appendTo(articleItem);
                    var articleInfo = $("<div>").addClass("article-info").appendTo(articleItem);
                    var title = $("<h1>").text(article[i].articleTitle).addClass("hot"+article[i].articleHot).appendTo(articleInfo);
                    var through = $("<span>").text(article[i].articleThrough+"人浏览").appendTo(articleInfo);
                    var time = $("<span>").text(getDateDiff(article[i].articleTime)).appendTo(articleInfo);
                    var later = $("<button>").addClass("later-watch").appendTo(articleInfo);
                    var deleteArticle = $("<button>").addClass("delete-article").appendTo(articleInfo);
                    var reading = $("<p>").text(article[i].articleReading).appendTo(articleInfo);
                }
            }
        }
    })
    event.stopPropagation();
})


/*
 * 跳转详情页
 */
$(".container").on("click",".p-article-item",function(){
    console.log('hhhhhhhhhhhhhhh');
    var id = $(this).attr("id").substr(5);
    window.open("content.html?id="+id,"_self");
    $.ajax({
        type: "GET",
        //url:"json/laterWatch.json",
        url: urlPre+"/api/laterWatch",
        data: {
            "action": "delete",
            "articleId": id,
            "cookieid":cookieid
        },
        dataType: "json",
        success: function (data) {
            console.log(data);
            if(data.msg=="success"){
                window.open("content.html?id="+$(this).attr("id").substr(5),"_self");
            }
        }
    })
    event.stopPropagation();
})


/*
 * 阅读量统计按钮
 */

readClick();
function readClick(){
    //$(".read-chart ul").scrollLeft(allWidth);
    $(".chart-wrap").find("button").click(function(){
        var scrolLeft = $(".read-chart ul").scrollLeft();
        var liWidth = parseInt($(".read-chart").find("li").css("width"))+10;
        var liCount = $(".read-chart").find("li").length;
        var ulWidth = parseInt($(".read-chart ul").css("width"));
        var allWidth = liWidth*liCount-ulWidth;
        switch ($(this).attr("id")) {
            case "turnRight":
                if(allWidth>scrolLeft){
                    $(".read-chart ul").scrollLeft(scrolLeft+100);
                    scrolLeft += 100;
                }
                break;
            case "turnLeft":
                if(scrolLeft>0){
                    $(".read-chart ul").scrollLeft(scrolLeft-100);
                    scrolLeft -= 100;
                }
                break;
        }
    })

}


Date.prototype.format = function() {
    var s = '';
    var mouth = (this.getMonth() + 1)>=10?(this.getMonth() + 1):('0'+(this.getMonth() + 1));		        　　　　　
    var day = this.getDate()>=10?this.getDate():('0'+this.getDate());		        　　　　　
    s += this.getFullYear() + '-'; // 获取年份。		        　　　　　
    s += mouth + "-"; // 获取月份。		        　　　　　
    s += day; // 获取日。		        　　　　　
    return (s); // 返回日期。		    　
};		 		    　　
function getAll(begin, end) {		    	　　　　
    var arr = [];		        　　　　
    var ab = begin.split("-");		        　　　　
    var ae = end.split("-");		        　　　　
    var db = new Date();		        　　　　
    db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]-1);		        　　　　
    var de = new Date();		        　　　　
    de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]-1);		        　　　　
    var unixDb = db.getTime() - 24 * 60 * 60 * 1000;		        　　　　
    var unixDe = de.getTime() - 24 * 60 * 60 * 1000;		        　　　　
    for (var k = unixDb ; k <= unixDe;) {　　
        k = k + 24 * 60 * 60 * 1000;		            　　　　　　
        arr.push((new Date(parseInt(k))).format());		        　　　　
    }		        　　　　
    return arr;
}