var parseString = require('xml2js').parseString;

function convertBody (body, callback) {
    var jsBody;
    parseString(body, {explicitArray: false}, function (err, result) {
        if (err)
        {
            callback({"msg": "Unable to parse response body"});
            return;
        }
        jsBody = result;
    });

    if (!jsBody.TrackResponse)
    {
        callback({"msg": "Track attempt failed, check credentials and tracking number."});
        return;
    }

    if (!jsBody.TrackResponse.TrackInfo || !jsBody.TrackResponse.TrackInfo.TrackSummary || !jsBody.TrackResponse.TrackInfo.TrackDetail) 
    {
        callback({"msg": "Unable to access tracking details."});
        return;
    }

    return jsBody;
}

var data = {
    "status": "undefined",
    "steps": []
};

function parseState (body) {
    data.status = body.TrackResponse.TrackInfo.TrackSummary.Event;
}

function parseSteps (credentials, body) {
    var steps = body.TrackResponse.TrackInfo.TrackDetail;
    for (var i=0; i < steps.length; i++)
    {
        var step = steps[i];

        var parsedData = {};
        try {
            var parsedData = {
                "location": {
                    "zip": step.EventZIPCode,
                    "state": step.EventState,
                    "city": step.EventCity,
                    "country": step.EventCountry
                },
                "date":     step.EventDate,
                "time":     step.EventTime,
                "status":   step.Event

            };
        }
        catch (err)
        {
            console.log("USPS returned data of unexpected format, please report this error.");
        }
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
        parseState(jsBody);
        parseSteps(credentials, jsBody);

        callback(null, data);
    }
};
