var fs = require('fs');
var path = require('path');
var buildPathFile = path.join(__dirname, 'dist/geojson.sql');

fs.writeFile(buildPathFile, 'hello world!\r\n', {
    flag: 'a'
}, function(err) {
    if (err) {
        return console.log(err);
    }
    console.log('The file was saved!!');
})