/**
* converts the parsed data to own tracking model.
*
*/

var Model  = require('../model.js');
var moment = require('moment');

var model = new Model.Model();

/**
* converts the parsed data.
*
* @param object parsedData
* @param function callback function (error: null|<{"msg": <string>}>, model: <model>);
* @access private
* @final
*/
this.normalize = function normalize (parsedData, callback) {

    if (parsedData.status.toLowerCase().indexOf("delivered") != -1) {
        model.delivered = true;
    }

    var cleanedSteps = [];

    var dateFormat = "MMMM DD, h:mm a";
    
    for (var i = 0; i < parsedData.steps.length; i++)
    {
        var step = parsedData.steps[i];
        var date = "";
        if (step.date)
        {
            date = moment(step.date + ", " + step.time, dateFormat);
            if (date)
            {
                var now = moment();
                date.year(now.year());
                if (date.diff(now) > 0)
                    date.year(now.year() - 1);
            }
        }
        
        var gatheredData = {
            "location": {
                            "city": Model.toTitleCase(step.location.city),
                            "zip": step.location.zip,
                            "state": step.location.state
                        },
            "date":     date.valueOf(),
            "status":   step.status
        };
        cleanedSteps.push(gatheredData);
    }
    
    model.steps  = cleanedSteps;

    callback(null, model);
};
