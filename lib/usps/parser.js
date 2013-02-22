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
    data.status = body.TrackResponse.TrackInfo.TrackSummary;
}

function parseSteps (credentials, body) {
    var steps = body.TrackResponse.TrackInfo.TrackDetail;
    for (var i=0; i < steps.length; i++)
    {
        var step = steps[i];
        if (credentials.testing)
        {
            splitStep = step.split(" ");

            var status = "";
            for (var j = 4; j < splitStep.length - 1; j++)
            {
                status += splitStep[j] + " ";
            }

            var parsedData = {
                "location": { "zip": splitStep[splitStep.length - 1].replace(".", "")},
                "date":     splitStep[0] + " " + splitStep[1],
                "time":     splitStep[2] + " " + splitStep[3],
                "status":   status

            };
        }
        else
        {
            var splitStep = step.split(", ");
            var stateAndZip = splitStep[splitStep.length - 1].split(" ");

            var parsedData = {};
            try {
                var parsedData = {
                    "location": {
                        "zip": stateAndZip[1],
                        "state": stateAndZip[0],
                        "city": splitStep[4]
                    },
                    "date":     splitStep[1] + " " + splitStep[2],
                    "time":     splitStep[3],
                    "status":   splitStep[0]

                };
            }
            catch (err)
            {
                console.log("USPS returned data of unexpected format, please report this error.");
            }
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
