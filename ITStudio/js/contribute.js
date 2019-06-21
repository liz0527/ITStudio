//var urlPre = 'http://127.0.0.1:8000';
var urlPre = 'http://52.82.124.217:9998';

var url,dataURL;
/*
 * 图片处理
 */
function compress(url){
    var img = new Image,
        width = 640, //image resize
        quality = 0.8, //image quality
        canvas = document.createElement("canvas"),
        drawer = canvas.getContext("2d");
    img.setAttribute('crossOrigin', 'anonymous')  // 图片跨域时有用
    img.onload = function() {
        canvas.width = width;
        canvas.height = width * (img.height / img.width);
        drawer.drawImage(img, 0, 0, canvas.width, canvas.height);
        dataURL = canvas.toDataURL("image/jpeg", quality);
        console.log(dataURL);
    }
    img.src=url;
    img64 = $("#viewImg").attr("src");
    //console.log(canvas.toDataURL("image/png"));
}
function ImgToBase64(file, maxLen, callBack) {
    var img = new Image();

    var reader = new FileReader();//读取客户端上的文件
    reader.onload = function () {
        var url = reader.result;//读取到的文件内容.这个属性只在读取操作完成之后才有效,并且数据的格式取决于读取操作是由哪个方法发起的.所以必须使用reader.onload，
        img.src = url;//reader读取的文件内容是base64,利用这个url就能实现上传前预览图片
    };
    img.onload = function () {
        //生成比例
        var width = img.width, height = img.height;
        //计算缩放比例
        var rate = 1;
        if (width >= height) {
            if (width > maxLen) {
                rate = maxLen / width;
            }
        } else {
            if (height > maxLen) {
                rate = maxLen / height;
            }
        };
        img.width = width * rate;
        img.height = height * rate;
        //生成canvas
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var base64 = canvas.toDataURL('image/jpeg', 0.9);
        callBack(base64);
    };
    reader.readAsDataURL(file);
}
$(function () {
    $("#chooseImg").change(function () {
        var file = $(this)[0].files[0];//获取input file控件选择的文件

        ImgToBase64(file, 720, function (base64) {
            dataURL = base64;
            $("#viewImg")[0].src = base64;//预览页面上预留一个img元素，载入base64
            $("#viewImg")[0].width = 300;//设定宽高，不然会自动按照压缩过的图片宽高设定，有可能超出预想的范围。
            //直接利用ajax上传base64到服务器，完毕
        });
    })
})


//下拉框
$('select').selectMatch();



$("#imgInput").bind("input propertychange",function(event){
    var imgval = $(this).val();
    $("#viewImg").attr("src",imgval);
    //url = $("#imgInput").val();
    compress(imgval);
})

/*
 * 投稿页
 */
//编辑器初始化
var E = window.wangEditor
var editor = new E('#editor')
editor.create()

//投稿判断
$("#contributeBtn").click(function () {
    // 读取 text
    var title = $("#titleInput").val();
    var imgval = document.getElementById('viewImg');
    var img64;
    var content = editor.txt.text();
    var sort;
    $(".sort-title").find("input:checked").each(function(){
            sort = $(this).parent("div").find("label").eq(1).text();
    })
    var sortName = "";
    if(sort=="资讯"){
        sortName = $(".selected").text();
    }


    //compress(url);
    // console.log($("#viewImg").attr("src"));


        if(title && dataURL && content){
            var cookieid = getCookie("cookieid");
            var data = {
                "cookieid":cookieid,
                "sort":sort,
                "sortName":sortName,
                "title":title,
                "img":dataURL,
                "content":content
            };
            dataString = JSON.stringify(data);
            console.log(dataString);
            $.ajax({
                type: "POST",
                //url:"json/laterWatch.json",
                url: urlPre+"/api/user/contribute",
                data:dataString,
                dataType: "json",
                success: function(data){
                    if(data.msg=="success"){
                        alert("投稿成功");
                        window.open("personalCenter.html","_self");
                    }
                }
            })
        }else {
            alert("有内容为空！");
        }




})



