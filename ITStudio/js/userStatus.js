//var urlPre = 'http://127.0.0.1:8000';
var urlPre = 'http://52.82.124.217:9998';

/*
 * 获取某个cookie
 */
function getCookie(cname){
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
    }
    return "";
}

var cookieid = getCookie("cookieid");
/*
 * 判断登录状态
 */
$.ajax({
    type: "GET",
    //url: "json/user.json",
    url: urlPre+"/api/user/online",
    data:{
        "cookieid":cookieid
    },
    dataType: "json",
    async:false,
    success: function(data){
        if(data.status=='0'){
            document.cookie="cookieid=";
            alert("请先登录！");
            window.open("index.html?status=0","_self");
        }
    }
})