/*
* Based off similar tracking module at github.com/syranez/dhl
* Difference is that this does not scrape from tracking pages, as this is not possible on some services.
* This module attempts to create a simple wrapper package tracking at all major carriers.
*
* Requires API credentials and package information.
*
*
*/

var fedex = require('./lib/fedex/fedex.js');
var usps = require('./lib/usps/usps.js');

var carriers = [
    "fedex",
    "usps"
];

this.track = function track (credentials, parcel, callback) {

    if (!parcel) {
        console.log("Parcel not given.");
        return false;
    }

    if (!parcel.number) {
        console.log("Parcel tracking number is not given.");
        return false;
    }

    if (!parcel.carrier) {
        console.log("Parcel carrier is not given.");
        return false;
    }

    if (!this.isCarrier(parcel.carrier)) {
        console.log("The carrier, " + parcel.carrier + ", is not available.");
        return false;
    }

    if (typeof callback != "function") {
        console.log("Callback function is not given.");
        return false;
    }

    if (!credentials) {
        console.log("Credentials are not given.");
    }

    var carrier = getCarrier(parcel.carrier);
    carrier.validate(credentials, function(error) {
        if (error) {
            callback({
                "status": false,
                "data": {},
                "issues": [
                    "Could not validate all necessary credentials for the selected carrier."
                ]
            });

            return;

        }

        carrier.get(credentials, parcel.number, function (error, body) {
            if (error) {
                callback({
                    "status": false,
                    "data": {},
                    "issues": [
                        "Could not retrieve response from server."
                    ]
                });

                return;
            }

            carrier.parse(credentials, body,  function (error, track) {
                if (error) {
                    callback({
                        "status": false,
                        "data": {},
                        "issues": [
                            error.msg
                        ]
                    });

                    return;
                }

                carrier.normalize(track, function (error, model) {
                    if (error) {
                        callback({
                            "status": false,
                            "data": {},
                            "issues": [
                                "Could not normalize parsed data."
                            ]
                        });

                        return;
                    }

                    callback({
                        "status": true,
                        "data":   model,
                        "issues": []
                    });
                });
            });
        });
    });

    return true;
};

this.isCarrier = function isCarrier (carrier) {

    if (!carrier) {
        return false;
    }

    if (carriers.indexOf(carrier) === -1) {
        return false;
    }

    return true;
}

function getCarrier (serviceName) {

    switch (serviceName) {
        case "fedex":
            return fedex;
        //case "ups":
            //    return ups;
        case "usps":
                return usps;
    }

    return null;
}
