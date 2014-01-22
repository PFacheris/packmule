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

    var dateFormat = "MMMM DD, YYYY h:mm a";
    
    for (var i = 0; i < parsedData.steps.length; i++)
    {
        var step = parsedData.steps[i];
        var date = "";
        if (step.date)
        {
            date = moment(step.date + " " + step.time, dateFormat);
        }
        
        var gatheredData = {
            "location": {
                            "address": "",
                            "city": (step.location.city && step.location.city.length > 0) ? step.location.city : "",
                            "zip": (step.location.zip && step.location.zip.length > 0) ? step.location.zip : "",
                            "state": (step.location.state && step.location.state.length > 0) ? step.location.state : "",
                            "country": (step.location.country && step.location.country.length > 0) ? step.location.country : ""
                        },
            "date":     date.valueOf(),
            "status":   step.status
        };
        cleanedSteps.push(gatheredData);
    }
    
    model.steps  = cleanedSteps;

    callback(null, model);
};
