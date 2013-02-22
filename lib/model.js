this.Model = function Model () {
    this.delivered = false;
    this.steps = [];
}

this.toTitleCase = function toTitleCase(str)
{
    if (str)
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    
    return str;
}
