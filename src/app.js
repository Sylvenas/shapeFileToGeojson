var url = require("url"),
    fs = require("fs"),
    http = require("http"),
    path = require("path"),
    query = require("querystring"),
    url = require('url'),
    util = require('util'),
    convertGeojsonToSql = require('./geojsonToSql'),
    formidable = require('formidable'),
    path = require('path');

var buildPathFile = path.join(__dirname, '../dist/geojson.sql');

http.createServer(function(req, res) {
    console.log(req.url);
    if (req.url != '/geo' && req.url != '/upload') {
        var pathname = __dirname + url.parse(req.url).pathname;
        if (path.extname(pathname) == "") {
            pathname += "/";
        }
        if (pathname.charAt(pathname.length - 1) == "/") {
            pathname += "index.html";
        }

        fs.exists(pathname, function(exists) {
            if (exists) {
                switch (path.extname(pathname)) {
                    case ".html":
                        res.writeHead(200, { "Content-Type": "text/html" });
                        break;
                    case ".js":
                        res.writeHead(200, { "Content-Type": "text/javascript" });
                        break;
                    case ".css":
                        res.writeHead(200, { "Content-Type": "text/css" });
                        break;
                    case ".gif":
                        res.writeHead(200, { "Content-Type": "image/gif" });
                        break;
                    case ".jpg":
                        res.writeHead(200, { "Content-Type": "image/jpeg" });
                        break;
                    case ".png":
                        res.writeHead(200, { "Content-Type": "image/png" });
                        break;
                    default:
                        res.writeHead(200, { "Content-Type": "application/octet-stream" });
                }

                fs.readFile(pathname, function(err, data) {
                    res.end(data);
                });
            } else {
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end("<h1>404 Not Found</h1>");
            }
        });
    } else if (req.url == '/geo') {
        var postdata = "";
        req.addListener("data", function(postchunk) {
                postdata += postchunk;
            })
            //POST结束输出结果
        req.addListener("end", function() {
            //console.log('postdata', postdata.geo)
            var params = query.parse(postdata);
            var buildPathFile = convertGeojsonToSql(params.geo);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(buildPathFile);
        })
    } else {
        var cacheFolder = 'files';

        var userDirPath = cacheFolder
        if (!fs.existsSync(userDirPath)) {
            fs.mkdirSync(userDirPath);
        }
        var form = new formidable.IncomingForm(); //创建上传表单
        form.encoding = 'utf-8'; //设置编辑
        form.uploadDir = userDirPath; //设置上传目录
        form.keepExtensions = true; //保留后缀
        form.maxFieldsSize = 2 * 1024 * 1024; //文件大小
        form.type = true;
        var displayUrl;
        form.parse(req, function(err, fields, files) {
            console.log(files.upload.type);
            if (err) {
                res.send(err);
                return;
            }
            var extName = 'zip'; //后缀名

            if (extName.length === 0) {
                res.writeHead(202, { 'Content-Type': 'text/plain' });
                res.end('<h1>只支持zip压缩文件</h1>');
                return;
            } else {
                var avatarName = '/' + Date.now() + '.' + extName;
                var newPath = form.uploadDir + avatarName;
                displayUrl = avatarName;
                fs.renameSync(files.upload.path, newPath); //重命名
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(displayUrl);
            }
        });
    };


}).listen(8080, "10.25.67.114");
console.log("Server running at http://10.25.67.114:8080/");