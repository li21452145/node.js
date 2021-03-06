var http=require("http");
var url =require("url");
var fs=require("fs");
var mime =require("mime");


http.createServer(function(req,res){
    var urlObj=url.parse(req.url,true);

    if(urlObj.pathname=="/"){
        res.setHeader("Content-Type",mime.lookup("./index.html")+";charset=uft8");
        fs.createReadStream("./index.html").pipe(res);
    }
    else if(urlObj.pathname=="/getList")
    {
        //获取数据
        var dataStr=fs.readFileSync("./2.txt");
        //将字符串数据转换成对象
        var data=JSON.parse(dataStr).result;
        //算出起始位置 和 结束位置
        //第1页   0 10    (page-1)*pagesize  page*pagesize
        //第2页   10 20   (page-1)*pagesize  page*pagesize
        //第3页   20 30   (page-1)*pagesize  page*pagesize
        var start=(urlObj.query.page-1)*urlObj.query.pagesize;
        var end=urlObj.query.page*urlObj.query.pagesize;
        //判断边界值
        //11
        //0 10
        //10 20
        //20 30
        var obj={};
        if(data.length>start){
            //算出有多少也
            var allPage= Math.ceil(data.length/urlObj.query.pagesize);
            //截取对应的数
            var result=data.slice(start,end);
            obj.success="ok";
            obj.result=result;
            obj.allPage=allPage;
            obj.index=urlObj.query.page;

        }
        else
        {
            obj.success="no";
            obj.error="没有数据了！";
        }
        //将数据返回给客户端
        console.log(JSON.stringify(obj));
        res.end(JSON.stringify(obj));
    }
    else
    {
        res.setHeader("Content-Type",mime.lookup(urlObj.pathname)+";charset=uft8");
        //通过拼拼接出来的路径读取文件
        fs.readFile("."+urlObj.pathname,function(err,data){
            if(err){
                res.status=404;
                //res.end("404");
            }
            else {
                res.end(data);
            }
        })
        //console.log(urlObj.pathname);
        //fs.createReadStream("."+urlObj.pathname).pipe(res);

    }
    //else if(urlObj.pathname=="/public/jquery.js"){
    //
    //    res.setHeader("Content-Type",mime.lookup(urlObj.pathname)+";charset=uft8");
    //    fs.createReadStream("./public/jquery.js").pipe(res);
    //}
    //else if(urlObj.pathname=="public/bootstrap.js"){
    //    res.setHeader("Content-Type",mime.lookup(urlObj.pathname)+";charset=uft8");
    //
    //    fs.createReadStream("./bootstrap.js").pipe(res);
    //}


}).listen(8080,function(){console.log("服务器已经开始！")})
