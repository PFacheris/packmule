var tracking = require('../index.js');

//FEDEX
var packet = {
    "carrier":      "fedex",
    "number":       "123456789012"
};

var credentials = {key: 'YOUR_KEY', password: 'YOUR_PASSWORD', number: 'YOUR_ACCOUNT_NUMBER', meter: 'YOUR_METER NUMBER', testing: true};

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

var credentials2 = {id: 'YOUR_ID', testing: true};

tracking.track(credentials2, packet2, function (tracking) {
    console.log("USPS");
    if (tracking.status)
        console.log(tracking.data); 
    else
        console.log(tracking.issues);
});
console.log("\n");
