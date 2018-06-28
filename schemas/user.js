
var mongoose = require('mongoose');

module.exports = new moogoose.Schema({
    username:String,
    password:String,
    isAdmin:{
        type: Boolean,
        default: false
    }
})