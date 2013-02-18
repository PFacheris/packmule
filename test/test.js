var tracking = require('../index.js');

//FEDEX
var packet = {
    "carrier":      "fedex",
    "number":       "123456789012"
};

var credentials = {key: 'M5pqygaXiZPij1Uw', password: 'pb26fmr4U2ebAgxu28pqrCXkS', number: '510087720', meter: '100151321', testing: true};

tracking.track(credentials, packet, function (tracking) {
    console.log("FEDEX");
    if (tracking.status)
        console.log(tracking.data); 
    else
        console.log(tracking.issues);
});
console.log("\n");

//USPS
var packet2 = {
    "carrier":      "usps",
    "number":       "EJ958088694US"
};

var credentials2 = {id: '8521505I1183', testing: true};

tracking.track(credentials2, packet2, function (tracking) {
    console.log("USPS");
    if (tracking.status)
        console.log(tracking.data); 
    else
        console.log(tracking.issues);
});
console.log("\n");
