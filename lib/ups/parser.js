var parseString = require('xml2js').parseString;

function convertBody (body, callback) {
    var jsBody;
    parseString(body, {explicitArray: false}, function (err, result) {
        if (err)
        {
            callback({"msg": "Unable to parse response body."});
            return;
        }
        jsBody = result;
    });

    return jsBody;
}

var data = {
    "status": "undefined",
    "steps": []
};

function parseState (credentials, body) {
    data.status = body.TrackResponse.Shipment.Package.Activity[0].Status.StatusType.Description;
}

function parseSteps (credentials, body) {
    var steps = body.TrackResponse.Shipment.Package.Activity;
    for (var i=0; i < steps.length; i++)
    {
        var step = steps[i];

        var parsedData = {
            "location": step.ActivityLocation.Address.PostalCode,
            "date":     step.Date,
            "time":     step.Time,
            "status":   step.Status.StatusType.Description

        };

        data.steps.push(parsedData);
    }
}

/**
* parses the status page.
*
* @param string body Response body from connection to tracking API
* @param function callback function (error: null|<{"msg": <string>}>, page: <string>);
* @access private
* @final
*/
this.parse = function (credentials, body, callback) {
    var jsBody = convertBody(body, callback);
    if (jsBody)
    {

        parseState(credentials, jsBody);
        parseSteps(credentials, jsBody);

        callback(null, data);
    }
};
