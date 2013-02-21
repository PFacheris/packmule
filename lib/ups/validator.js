this.validate = function validate(credentials, callback)
{
    if (!credentials.key) {
        callback({"msg": "An API key is required to track with Fedex, include it as credentials.key"});
    }

    if (!credentials.user) {
        callback({"msg": "A user id is required to track with Fedex, include it as credentials.user"});
    }

    if (!credentials.password) {
        callback({"msg": "An API password is required to track with Fedex, include it as credentials.password"});
    }

    callback(null); 
};
