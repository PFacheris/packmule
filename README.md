# packmule
Wrapper that returns standardized javascript objects from various shipping APIs.

## Usage:
Get tracking information:

    var packet = {
        "carrier":      "usps",
        "number":       "EJ958088694US"
    };

    var credentials = {id: 'YOUR_USER_ID', testing: true};
    //use testing: true to use testing rather than production servers

    tracking.track(credentials, packet, function (tracking) {
        console.log("USPS");
        if (tracking.status)
            console.log(tracking.data); 
        else
            console.log(tracking.issues);
    });

## Active Carriers:

* fedex
  * Example Credentials:
    `{key: 'YOUR_KEY', password: 'YOUR_PASSWORD', number: 'YOUR_ACCOUNT_NUMBER', meter: 'YOUR_METER_NUMBER'}`
* usps
  * Example Credentials:
    `{id: 'YOUR_USER_ID'}`

## Installation:
`npm install packmule`

... or to install the package globally:

`npm install -g packmule`

## Thank You To:
Michael Nowack (github.com/syranez), who originally created the dhl module, which scrapes from carrier tracking sites. Much of the organization of this module is based on his.

## License:
Copyright (c) 2013 Patrick Facheris, MIT LICENSE
