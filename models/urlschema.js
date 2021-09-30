const mongoose=require('mongoose');
const randomstring = require('randomstring')

var date = new Date().toLocaleTimeString()
var currdate = new Date().toLocaleDateString()


const UrlSchema = new mongoose.Schema({
    full:{
        type:String,
        required:true
    },
    short:{
        type:String,
        required:true,
        default:randomstring.generate({length:5}),
        unique:true
        // default:new Date().toLocaleTimeString()
    },
    visits:{
        type:Number,
        default:0,
        required:true
    },

    created:{
        type:String,
        default:date

    },
    createddate:{
        type:String,
        default:currdate
    }

});
const Shortener  = mongoose.model('Shortener',UrlSchema);
module.exports = Shortener;





//this api will fetch ip addess --- https://api.ipify.org?format=jsonp&callback=DisplayIP


