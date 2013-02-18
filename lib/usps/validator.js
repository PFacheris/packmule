this.validate = function validate(credentials, callback)
{
    if (!credentials.id) {
        callback({"msg": "A user ID is required to track with USPS, include it as credentials.id"});
    }

    callback(null); 
};
