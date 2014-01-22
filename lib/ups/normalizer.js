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
    var dateFormat = "YYYYMMDD HHmmss";

    for (var i = 0; i < parsedData.steps.length; i++)
    {
        var step = parsedData.steps[i];
        
        var gatheredData = {
            "location": {
                            "address": step.location.AddressLine ? Model.toTitleCase(step.location.AddressLine) : "",
                            "city": step.location.City ? Model.toTitleCase(step.location.City) : "",
                            "zip": step.location.PostalCode ? step.location.PostalCode : "",
                            "state": step.location.StateProvinceCode ? step.location.StateProvinceCode : "",
                            "country": step.location.CountryCode ? step.location.CountryCode : ""
                        },
            "date":     moment(step.date + " " + step.time, dateFormat).valueOf(),
            "status":   Model.toTitleCase(step.status)
        };
        cleanedSteps.push(gatheredData);
    }
    
    model.steps  = cleanedSteps;

    callback(null, model);
};
