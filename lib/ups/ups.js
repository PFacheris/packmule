var validator   = require('./validator.js');
var client      = require('./client.js');
var parser      = require('./parser.js');
var normalizer  = require('./normalizer.js');

this.validate           = validator.validate; 
this.get                = client.get;
this.parse              = parser.parse;
this.normalize          = normalizer.normalize;
