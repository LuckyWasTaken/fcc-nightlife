const mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

const barSchema = mongoose.Schema({
    name: String,
    going: {
        type: [String],
        'default': []
    }
});
barSchema.plugin(findOrCreate);
const Bar = mongoose.model("Bar", barSchema);

module.exports = Bar;