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

function parseSteps (body) {
    var steps = body.TrackResponse.TrackInfo.TrackDetail;
    for (var i=0; i < steps.length; i++)
    {
        var step = steps[i];
        splitStep = step.split(" ");
        
        var status = "";
        for (var j = 4; j < splitStep.length - 1; j++)
        {
            status += splitStep[j] + " ";
        }

        var parsedData = {
            "location": splitStep[splitStep.length - 1].replace(".", ""),
            "date":     splitStep[0] + " " + splitStep[1],
            "time":     splitStep[2] + " " + splitStep[3],
            "status":   status

        };

        data.steps.push(parsedData);
    }

    //data.steps.reverse();
}

function getSubstringIndex(str, substring, n) {
    var times = 0, index = null;

    while (times < n && index !== -1) {
        index = str.indexOf(substring, index+1);
        times++;
    }

    return index;
}

/**
* parses the status page.
*
* @param string body Response body from connection to tracking API
* @param function callback function (error: null|<{"msg": <string>}>, page: <string>);
* @access private
* @final
*/
this.parse = function (body, callback) {
    var jsBody = convertBody(body, callback);
    if (jsBody)
    {
        parseState(jsBody);
        parseSteps(jsBody);

        callback(null, data);
    }
};
