var parseString = require('xml2js').parseString;

function convertBody (body, callback) {
    var jsBody;
    parseString(body.replace(/v6:/g,""), {explicitArray: false}, function (err, result) {
        if (err)
        {
            callback({"msg": "Unable to parse response body."});
            return;
        }
        jsBody = result;
    });

    if (!jsBody.TrackReply)
    {
        callback({"msg": "Track attempt failed, check credentials and tracking number."});
        return;
    }

    if (!jsBody.TrackReply.TrackDetails || jsBody.TrackReply.TrackDetails.length < 1)
    {
        callback({"msg": "Unable to access tracking details."});
        return;  
    }

    if (jsBody.TrackReply.TrackDetails.length > 1)
    {
        callback({"msg": "Multiple tracking results returned, fix for this coming in future versions."});
        return;
    }

    return jsBody;
}

var data = {
    "status": "undefined",
    "steps": []
};

function parseState (credentials, body) {
    if (credentials.testing)
    {
        if (body.TrackReply.TrackDetails[0].StatusDescription)
        {
            data.status = codes[body.TrackReply.TrackDetails.StatusDescription];
        }
        else if (body.TrackReply.TrackDetails[0].StatusCode)
        {
            data.status = codes[body.TrackReply.TrackDetails.StatusCode];
        }
    }
    else
    {
        data.status = body.TrackReply.TrackDetails.StatusDescription;
    }
}

function parseSteps (credentials, body) {
    if (credentials.testing)
    {
        var steps = body.TrackReply.TrackDetails;
        for (var i=0; i < steps.length; i++)
        {
            var step = steps[i];

            var parsedData = {
                "location": step.PostalCode,
                "date":     step.ShipTimestamp,
                "status":   step.StatusDescription

            };

            data.steps.push(parsedData);
        }
    }
    else
    {
        var steps = body.TrackReply.TrackDetails.Events;
        for (var i=0; i < steps.length; i++)
        {
            var step = steps[i];

            var parsedData = {
                "location": step.Address.PostalCode,
                "date":     step.Timestamp,
                "status":   step.EventDescription

            };

            data.steps.push(parsedData);
        }
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
