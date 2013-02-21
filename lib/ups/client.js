var https = require('https');

var hosts = {testing: "wwwcie.ups.com.", production: "onlinetools.ups.com"};
var port = "443";
var path = "/ups.app/xml/Track";
var method = "POST";

function assembleData(credentials, tracking) {

    var data = "<AccessRequest xml:lang='en-US'><AccessLicenseNumber>" + 
                credentials.key +
                "</AccessLicenseNumber><UserId>" +
                credentials.user + 
                "</UserId><Password>" + 
                credentials.password + "</Password></AccessRequest><TrackRequest xml:lang='en-US'><Request><TransactionReference><CustomerContext>QAST Track</CustomerContext><XpciVersion>1.0</XpciVersion></TransactionReference><RequestAction>Track</RequestAction><RequestOption>activity</RequestOption></Request><TrackingNumber>" +
                tracking + 
                "</TrackingNumber></TrackRequest>";

        return data;

}

function assembleOptions(testing, length) {
    var host = hosts.production;
    if (testing)
        host = hosts.testing;
        
    var options = {
        host: host,
        port: port,
        path: path,
        method: method,
        headers: {
            'Content-Type': 'image/gif',
            'Content-Length': length
        }
    };

    return options;
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
    var request_data = assembleData(credentials, tracking);
    var request_options = assembleOptions(credentials.testing, request_data.length);

    var post_req = https.request(request_options, function(response) {
        var body = "";
        response.setEncoding('utf8');
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

    post_req.write(request_data);
    post_req.end();
};
