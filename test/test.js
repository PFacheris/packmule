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

//UPS
packet = {
    "carrier":      "ups",
    "number":       "1Z12345E0291980793"
};

credentials = {key: 'YOUR_KEY', user: 'YOUR_USERNAME', password: 'YOUR_PASSWORD', testing: true};

tracking.track(credentials, packet, function (tracking) {
    console.log("UPS");
    if (tracking.status)
        console.log(tracking.data); 
    else
        console.log(tracking.issues);
});
console.log("\n");


//USPS
packet = {
    "carrier":      "usps",
    "number":       "EJ958088694US"
};

credentials = {id: 'YOUR_ID', testing: true};

tracking.track(credentials, packet, function (tracking) {
    console.log("USPS");
    if (tracking.status)
        console.log(tracking.data); 
    else
        console.log(tracking.issues);
});
console.log("\n");
