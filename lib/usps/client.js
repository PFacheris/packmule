var http = require('http');

var protocol = "http://";
var hosts = {testing: "testing.shippingapis.com/ShippingAPITest.dll", production: "production.shippingapis.com/ShippingAPI.dll"};

function assembleURI(credentials, tracking) {
    var host = hosts.production;
    if (credentials.testing)
        host = hosts.testing; 
    
    var URI = protocol + host;
    
    var xml_data = '<TrackRequest USERID="' + 
        credentials.id + 
        '"><TrackID ID="' + 
        tracking + 
        '"></TrackID></TrackRequest>';

    var data = "?API=TrackV2&XML=" + xml_data;
    
    URI += data;
    return URI;
}

/**
* Gets tracking results from fedex.
* @param object credentials Contains account key, password, account number, meter number. 
* @param string tracking Tracking number for a package.
* @param function callback function (error: null|<{"msg": <string>}>, result: <object>);
*
*/
this.get = function get(credentials, tracking, callback)
{
    var url = assembleURI(credentials, tracking);

    var get_req = http.get(url, function(response) {
        var body = "";
        response.on('data', function (chunk) {
            body += chunk;
        });
        response.on('end', function() {
            callback(null, body); 
        })
        response.on('error', function(err) {
            callback({"msg": "Error sending data."}); 
        });
    });
};
