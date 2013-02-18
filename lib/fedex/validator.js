this.validate = function validate(credentials, callback)
{
    if (!credentials.key) {
        callback({"msg": "An API key is required to track with Fedex, include it as credentials.key"});
    }

    if (!credentials.password) {
        callback({"msg": "An API password is required to track with Fedex, include it as credentials.password"});
    }

    if (!credentials.number) {
        callback({"msg": "An account number is required to track with Fedex, include it as credentials.number"});
    }

    if (!credentials.meter) {
        callback({"msg": "A meter number is required to track with Fedex, include it as credentials.meter"});
    }

    callback(null); 
};
