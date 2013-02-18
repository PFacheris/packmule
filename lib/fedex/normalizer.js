/**
* converts the parsed data to own tracking model.
*
*/

var Model  = require('../model.js');
var moment = require('moment');

var model = new Model.Model();

/**
* progress of the delivery
*
* @var array of strings
*/
var progress = [
    "In Transit",
    "Delivered"
];

/**
* converts the parsed data.
*
* @param object parsedData
* @param function callback function (error: null|<{"msg": <string>}>, model: <model>);
* @access private
* @final
*/
this.normalize = function normalize (parsedData, callback) {

    if (parsedData.status.toLowerCase() === "Delivered".toLowerCase()) {
        model.delivered = true;
    }

    var cleanedSteps = [];
    var dateFormat = "YYYY-MM-DD hh:mm:ss";

    for (var i = 0; i < parsedData.steps.length; i++)
    {
        var step = parsedData.steps[i];
        var date = "";
        
        if (step.date)
            date = moment(step.date.replace("T", " "), dateFormat);

        var gatheredData = {
            "location": step.location,
            "date":     date.valueOf(),
            "status":   step.status
        };
        cleanedSteps.push(gatheredData);
    }
    
    model.steps  = cleanedSteps;

    callback(null, model);
};
