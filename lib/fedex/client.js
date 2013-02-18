var https = require('https');

var hosts = {testing: "wsbeta.fedex.com", production: "ws.fedex.com"};
var port = "443";
var path = "/xml";
var method = "POST";

function assembleData(credentials, tracking) {

    var data = "<TrackRequest xmlns='http://fedex.com/ws/track/v6'><WebAuthenticationDetail><UserCredential><Key>" + 
        credentials.key +
        "</Key><Password>" + 
        credentials.password + 
        "</Password></UserCredential></WebAuthenticationDetail><ClientDetail><AccountNumber>" +
        credentials.number + 
        "</AccountNumber><MeterNumber>" + 
        credentials.meter +
        "</MeterNumber></ClientDetail><TransactionDetail><CustomerTransactionId>ActiveShipping</CustomerTransactionId></TransactionDetail>" + 
        "<Version><ServiceId>trck</ServiceId><Major>6</Major><Intermediate>0</Intermediate><Minor>0</Minor></Version><PackageIdentifier><Value>" + 
        tracking +
        "</Value><Type>TRACKING_NUMBER_OR_DOORTAG</Type></PackageIdentifier><IncludeDetailedScans>true</IncludeDetailedScans></TrackRequest>";

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

