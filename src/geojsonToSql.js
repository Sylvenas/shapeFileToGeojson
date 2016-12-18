var fs = require('fs');
var path = require('path');
var buildPathFile = null;

function createNewFileName() {
    return [path.join(__dirname, '../dist/geojson_'), new Date().getHours() + '_' + new Date().getMinutes() + '_' + new Date().getSeconds(), '.sql'].join('');
}

function convertGeojsonToSql(geojson) {
    buildPathFile = createNewFileName()
    geojson = JSON.parse(geojson);
    var features = geojson['features'];
    for (let i = 0, len = features.length; i < len; i++) {
        var feature = features[i];
        var coordinates = feature['geometry']['coordinates'];
        fs.writeFile(buildPathFile, coordinates + '\r\n', {
            flag: 'a'
        }, function(err) {
            if (err) {
                console.log('number:  ' + i + ' convert failed!')
                return console.log(err);
            }
            //console.log('第'+i+'个转换成功！');
        })
        console.log('number: ' + (i + 1) + ' convert successed------converted: ' + parseInt((i * 100) / (len - 1)) + '%');
    }
    console.log('All successed,convert end!');
    console.log('sql was saved at dist folder');
}

module.exports = convertGeojsonToSql;