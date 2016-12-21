var fs = require('graceful-fs');
var path = require('path');
var buildPathFile = null;
var dateNow = null;
var shp = require('./shp');



function createNewFileName() {
    dateNow = new Date().getHours() + '_' + new Date().getMinutes() + '_' + new Date().getSeconds();
    return [path.join(__dirname, './dist/geojson_'), dateNow, '.sql'].join('');
}

function convertGeojsonToSql(geojson) {
    buildPathFile = createNewFileName()
    geojson = JSON.parse(geojson);
    var features = geojson['features'];
    for (let i = 0, len = features.length; i < len; i++) {
        var feature = features[i];
        var sql = "insert into double_geo (xh,coordinates,STCROSSID,EDCROSSID,RSID,CROSSID,ID,ROADID) values ('xh'," +
            "'" +
            arrToString(feature.geometry.coordinates) +
            "'," +
            feature.properties.STCROSSID +
            "," +
            feature.properties.EDCROSSID +
            "," +
            feature.properties.RSID +
            "," +
            feature.properties.CROSSID +
            "," +
            feature.properties.ID +
            "," +
            feature.properties.ROADID +
            ");";

        fs.writeFile(buildPathFile, sql + '\r\n', {
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
    console.log(buildPathFile);
    return dateNow;
}

function arrToString(arr) {
    var geo = "";
    for (var m = 0, n = arr.length; m < n; m++) {
        if (m == 0) {
            geo = '[[' + arr[m][0] + ',' + arr[m][1] + '],'
        } else if (m == n - 1) {
            geo += '[' + arr[m][0] + ',' + arr[m][1] + ']]'
        } else {
            geo += '[' + arr[m][0] + ',' + arr[m][1] + '],'
        }
    }
    return geo;
}
module.exports = convertGeojsonToSql;