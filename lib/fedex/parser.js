var parseString = require('xml2js').parseString;

var codes = {
    'AA':	'At Airport',
    'AD':	'At Delivery',
    'AF':	'At FedEx Facility',
    'AP':	'At Pickup',
    'CA':	'Shipment Canceled',
    'CH':	'Location Changed',
    'DE':	'Delivery Exception',
    'DL':	'Delivered',
    'DP':	'Departed FedEx Location',
    'DR':	'Vehicle Furnished, Not Used',
    'DS':	'Vehicle dispatched',
    'DY':	'Delay',
    'EA':	'Enroute to Airport delay',
    'ED':	'Enroute to Delivery',
    'EO':	'Enroute to Origin airport',
    'EP':	'Enroute to Pickup',
    'EO':	'Enroute to Origin Airport',
    'EP':	'Enroute to Pickup',
    'FD':	'At FedEx Destination',
    'HL':	'Hold at Location',
    'IT':	'In Transit',
    'LO':	'Left Origin',
    'OC':	'Order Created',
    'OD':	'Out for Delivery',
    'PF':	'Plane in Flight',
    'PL':	'Plane Landed',
    'PU':	'Picked Up',
    'RS':	'Return to Shipper',
    'SE':	'Shipment Exception',
    'SF':	'At Sort Facility',
    'SP':	'Split status - multiple statuses',
    'TR':	'Transfer'
};

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

    return jsBody;
}

var data = {
    "status": "undefined",
    "steps": []
};

function parseState (body) {
    if (body.TrackReply.TrackDetails[0].StatusDescription)
    {
        data.status = codes[body.TrackReply.TrackDetails.StatusDescription];
    }
    else if (body.TrackReply.TrackDetails[0].StatusCode)
    {
        data.status = codes[body.TrackReply.TrackDetails.StatusCode];
    }
}

function parseSteps (body) {
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
