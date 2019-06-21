//var urlPre = 'http://127.0.0.1:8000';
var urlPre = 'http://52.82.124.217:9998';
/*
 * 顶部导航栏固定置顶
 */
$(function(){
    var navH = $(".header").offset().top;//获取要定位元素距离浏览器顶部的距离
    $(window).scroll(function(){//滚动条事件
        var scroH = $(this).scrollTop();//获取滚动条的滑动距离
        if(scroH >  navH ){//滚动条的滑动距离大于等于定位元素距离浏览器顶部的距离，就固定，反之就不固定
            $(".header").css({"position":"fixed","top":0,"left":0});
        }
        else if(scroH <= navH ){
            $(".header").css({"position":"static","margin":"0 auto"});
        }
    })
})


/*
 * 二级菜单的显示与消失
 */
$(function(){
    $(".header").find("li").eq(0).hover(function(){
        $(".second-nav").css("display","block");
    });
    $(".header").hover(function(){},function(){
        $(".second-nav").css("display","none");
    });
})

/*
 * 底部置底
 */
function footerFixed(){
    var windowH = $(window).height();
    var bodyH = $("body").height();
    if(windowH > bodyH){
        $(".footer").css({"position":"fixed","bottom":0});
    }
    else if(windowH <= bodyH){
        $(".footer").css({"position":"static"});
    }
}
$(function(){
    footerFixed();
    $(window).resize(function(){
        footerFixed();
    })
    $("body").bind('DOMNodeInserted', function(e) {
        footerFixed();
    })
})

/*
 * 搜索弹框
 */
$(function(){
    /*
     * 弹框
     * 请求数据
     */
    $("#searchBtn").click(function(){
        $(".search-wrap").css("display","block");
        $.ajax({
            type: "GET",
            //url:"json/search.json",
            url: urlPre+"/api/search",
            data: {
                "hotwordSize": 10
            },
            dataType: "json",
            success: function(data){
                console.log(data);
                if(data.msg=="success"){
                    $("#searchInput").attr("placeholder",data.placeholder);
                    var hotwords = data.hotwords;
                    console.log(hotwords);
                    var list = $(".hotwords-wrap").find("ul");
                    list.empty();
                    for(var i=0;i<hotwords.length;i++){
                        var hotword = $("<li>").addClass("hotword"+hotwords[i].hotLevel).text(hotwords[i].hotText).appendTo(list);
                    }
                }
            }
        })
    })
    /*
     * 关闭弹框
     */
    $("#searchCloseBtn").click(function(){
        $(".search-wrap").css("display","none");
    })
    /*
     * 搜索框搜索
     */
    $("#searchInputBtn").click(function(){
        var searchWord = $("#searchInput").val();
        if(!searchWord){
            searchWord = $("#searchInput").attr("placeholder");
        }
        window.open("list.html?searchWord="+searchWord,"_self");
    })
    /*
     * 热搜词搜索
     */
    $(".hotwords-wrap").on('click',"li",function(){
        var searchWord = $(this).text();
        window.open("list.html?searchWord="+searchWord,"_self");
    })

})


/*
 * 返回顶部
 */
$(".return-top").on('click',function(){
    $('html,body').animate({
        'scrollTop':0
    },200);
});

var cookieid = getCookie("cookieid");
if(cookieid!=""){
    $("#logBtn").css({"background":"url(images/icon05.jpeg) no-repeat","background-size":"100% 100%"});
}

/*
 * 登录/注册弹框
 */
$(function(){
    /*
     * 弹框或个人中心
     */
    $("#logBtn").click(function(){
        var cookieid = getCookie("cookieid");
        $.ajax({
            type: "GET",
            //url:"json/user.json",
            url: urlPre+"/api/user/online",
            data:{
                "cookieid":cookieid
            },
            dataType: "json",
            success: function(data){
                console.log(data);
                if(data.status=='1'){//个人中心
                    window.open("personalCenter.html");
                }else{
                    document.cookie="cookieid=";
                    $(".login-wrap").css("display","block");
                }
            }
        })
    })
    /*
     * 关闭弹框
     */
    $("#loginCloseBtn").click(function(){
        $(".login-wrap").css("display","none");
    })
})

/*
 * 护眼模式
 */
var green = getCookie("green");
if(green=="1"){
    $("body").css("background-color","rgba(210,227,199,1)");
    $(".header").css("background-color","rgba(210,227,199,1)");
    $(".second-nav").css("background-color","rgba(199,214,188,1)");
    $(".articles").on('mouseover',".article-item",function(){
        $(this).css({"border":"10px solid rgba(210,227,199,1)","margin":"-10px 0 18px -10px","cursor":"pointer"});
    }).on('mouseout',".article-item",function(){
        $(this).css({"border":"0","margin":"0 0 28px 0"});
    });
} else {
    $("body").css("background-color","rgba(0, 0, 0, 0)");
    $(".header").css("background-color","rgba(255, 255, 255, 1)");
    $(".second-nav").css("background-color","rgb(244, 244, 244)");
    $(".articles").on('mouseover',".article-item",function(){
        $(this).css({"border":"10px solid rgba(255, 255, 255, 1)","margin":"-10px 0 18px -10px","cursor":"pointer"});
    }).on('mouseout',".article-item",function(){
        $(this).css({"border":"0","margin":"0 0 28px 0"});
    });
}
$("#greenBtn").click(function(){
    if($("body").css("background-color")=="rgba(0, 0, 0, 0)"){
        document.cookie="green=1";
        //document.cookie="green=1; expires=Thu, 18 Dec 2043 12:00:00 GMT; path=/";
        $("body").css("background-color","rgba(210,227,199,1)");
        $(".header").css("background-color","rgba(210,227,199,1)");
        $(".second-nav").css("background-color","rgba(199,214,188,1)");
        $(".articles").on('mouseover',".article-item",function(){
            $(this).css({"border":"10px solid rgba(210,227,199,1)","margin":"-10px 0 18px -10px","cursor":"pointer"});
        }).on('mouseout',".article-item",function(){
            $(this).css({"border":"0","margin":"0 0 28px 0"});
        });
    }else {
        document.cookie="green=0";
        //document.cookie="green=0; expires=Thu, 18 Dec 2043 12:00:00 GMT; path=/";
        $("body").css("background-color","rgba(0, 0, 0, 0)");
        $(".header").css("background-color","rgba(255, 255, 255, 1)");
        $(".second-nav").css("background-color","rgb(244, 244, 244)");
        $(".articles").on('mouseover',".article-item",function(){
            $(this).css({"border":"10px solid rgba(255, 255, 255, 1)","margin":"-10px 0 18px -10px","cursor":"pointer"});
        }).on('mouseout',".article-item",function(){
            $(this).css({"border":"0","margin":"0 0 28px 0"});
        });
    }
    console.log(document.cookie);
})

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

/*
 * 验证码
 */
!(function(window, document) {
    var size = 5;//设置验证码长度
    function GVerify(options) { //创建一个图形验证码对象，接收options对象为参数
        this.options = { //默认options参数值
            id: "", //容器Id
            canvasId: "verifyCanvas", //canvas的ID
            width: "80", //默认canvas宽度
            height: "35", //默认canvas高度
            type: "blend", //图形验证码默认类型blend:数字字母混合类型、number:纯数字、letter:纯字母
            code: "",
        }
        if(Object.prototype.toString.call(options) == "[object Object]"){//判断传入参数类型
            for(var i in options) { //根据传入的参数，修改默认参数值
                this.options[i] = options[i];
            }
        }else{
            this.options.id = options;
        }

        this.options.numArr = "0,1,2,3,4,5,6,7,8,9".split(",");
        this.options.letterArr = getAllLetter();

        this._init();
        this.refresh();
    }

    GVerify.prototype = {
        /**版本号**/
        version: '1.0.0',

        /**初始化方法**/
        _init: function() {
            var con = document.getElementById(this.options.id);
            var canvas = document.createElement("canvas");
            this.options.width = con.offsetWidth > 0 ? con.offsetWidth : "80";
            this.options.height = con.offsetHeight > 0 ? con.offsetHeight : "35";
            canvas.id = this.options.canvasId;
            canvas.width = this.options.width;
            canvas.height = this.options.height;
            canvas.style.cursor = "pointer";
            canvas.innerHTML = "您的浏览器版本不支持canvas";
            con.appendChild(canvas);
            var parent = this;
            canvas.onclick = function(){
                parent.refresh();
            }
        },

        /**生成验证码**/
        refresh: function() {
            this.options.code = "";
            var canvas = document.getElementById(this.options.canvasId);
            if(canvas.getContext) {
                var ctx = canvas.getContext('2d');
            }else{
                return;
            }

            ctx.textBaseline = "middle";

            ctx.fillStyle = randomColor(180, 240);
            ctx.fillRect(0, 0, this.options.width, this.options.height);

            if(this.options.type == "blend") { //判断验证码类型
                var txtArr = this.options.numArr.concat(this.options.letterArr);
            } else if(this.options.type == "number") {
                var txtArr = this.options.numArr;
            } else {
                var txtArr = this.options.letterArr;
            }

            for(var i = 1; i <=size; i++) {
                var txt = txtArr[randomNum(0, txtArr.length)];
                this.options.code += txt;
                ctx.font = randomNum(this.options.height/2, this.options.height) + 'px SimHei'; //随机生成字体大小
                ctx.fillStyle = randomColor(50, 160); //随机生成字体颜色
                ctx.shadowOffsetX = randomNum(-3, 3);
                ctx.shadowOffsetY = randomNum(-3, 3);
                ctx.shadowBlur = randomNum(-3, 3);
                ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
                var x = this.options.width / (size+1) * i;
                var y = this.options.height / 2;
                var deg = randomNum(-30, 30);
                /**设置旋转角度和坐标原点**/
                ctx.translate(x, y);
                ctx.rotate(deg * Math.PI / 180);
                ctx.fillText(txt, 0, 0);
                /**恢复旋转角度和坐标原点**/
                ctx.rotate(-deg * Math.PI / 180);
                ctx.translate(-x, -y);
            }
            /**绘制干扰线**/
            for(var i = 0; i < 4; i++) {
                ctx.strokeStyle = randomColor(40, 180);
                ctx.beginPath();
                ctx.moveTo(randomNum(0, this.options.width), randomNum(0, this.options.height));
                ctx.lineTo(randomNum(0, this.options.width), randomNum(0, this.options.height));
                ctx.stroke();
            }
            /**绘制干扰点**/
            for(var i = 0; i < this.options.width/4; i++) {
                ctx.fillStyle = randomColor(0, 255);
                ctx.beginPath();
                ctx.arc(randomNum(0, this.options.width), randomNum(0, this.options.height), 1, 0, 2 * Math.PI);
                ctx.fill();
            }
        },

        /**验证验证码**/
        validate: function(code){
            var code = code.toLowerCase();
            var v_code = this.options.code.toLowerCase();
            if(code == v_code){
                return true;
            }else{
                this.refresh();
                return false;
            }
        }
    }
    /**生成字母数组**/
    function getAllLetter() {
        var letterStr = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
        return letterStr.split(",");
    }
    /**生成一个随机数**/
    function randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    /**生成一个随机色**/
    function randomColor(min, max) {
        var r = randomNum(min, max);
        var g = randomNum(min, max);
        var b = randomNum(min, max);
        return "rgb(" + r + "," + g + "," + b + ")";
    }
    window.GVerify = GVerify;
})(window, document);

/*
 * 登录/注册
 */
var verifyCode = new GVerify("v_container");
$("#loginBtn").click(function(){
    var res = verifyCode.validate(document.getElementById("captchaInput").value);
    res=true;
    if(res){
        var name = $("#usernameInput").val();
        var psw = $("#userpswInput").val();
        var data = {
            "username":name,
            "password":psw
        };
        dataString = JSON.stringify(data);
        $.ajax({
            type: "POST",
            //url:"json/user.json",
            url: urlPre+"/api/user/login",
            data:dataString,
            dataType: "json",
            success: function(data){
                console.log(data);
                if(data.msg=="true"){
                    document.cookie="cookieid="+data.userId;
                    alert("成功登录");
                    $(".login-wrap").css("display","none");
                    $("#logBtn").css({"background":"url(images/icon05.jpeg) no-repeat"});

                }else {
                    alert("失败！");
                }
            }
        })
    }else{
        alert("验证码错误");
    }
})

$("#registerBtn").click(function(){
    var res = verifyCode.validate(document.getElementById("captchaInput").value);
    if(res){
        var name = $("#usernameInput").val();
        var psw = $("#userpswInput").val();
        var data = {
            "username":name,
            "password":psw
        };
        dataString = JSON.stringify(data);
        $.ajax({
            type: "POST",
            //url:"json/user.json",
            url: urlPre+"/api/user/register",
            data:dataString,
            dataType: "json",
            success: function(data){
                console.log(data);
                if(data.msg=="success"){
                    alert("成功注册");
                    $(".login-wrap").css("display","none");
                }else {
                    alert("失败！");
                }
            }
        })
    }else{
        alert("验证码错误");
    }
})

/*
 * 前往投稿页
 */
$("#submitBtn").click(function(){
    window.open("contribute.html","_self");
})


/*
 * 时间戳转时间
 */
function getDateDiff(timestamp){
    var arrTimestamp = (timestamp + '').split('');
    for (var start = 0; start < 13; start++) {
        if (!arrTimestamp[start]) {
            arrTimestamp[start] = '0';
        }
    }
    timestamp = arrTimestamp.join('') * 1;

    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();
    var diffValue = now - timestamp;

    // 如果本地时间反而小于变量时间
    if (diffValue < 0) {
        return '不久前';
    }

    // 计算差异时间的量级
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;

    // 数值补0方法
    var zero = function (value) {
        if (value < 10) {
            return '0' + value;
        }
        return value;
    };

    // 使用
    if (monthC > 12) {
        // 超过1年，直接显示年月日
        return (function () {
            var date = new Date(timestamp);
            return date.getFullYear() + '年' + zero(date.getMonth() + 1) + '月' + zero(date.getDate()) + '日';
        })();
    } else if (monthC >= 1) {
        return parseInt(monthC) + "月前";
    } else if (weekC >= 1) {
        return parseInt(weekC) + "周前";
    } else if (dayC >= 1) {
        return parseInt(dayC) + "天前";
    } else if (hourC >= 1) {
        return parseInt(hourC) + "小时前";
    } else if (minC >= 1) {
        return parseInt(minC) + "分钟前";
    }
    return '刚刚';

}
