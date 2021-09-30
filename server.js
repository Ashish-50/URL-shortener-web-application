const express = require('express');
const app=express();
const mongoose = require('mongoose');
const port = process.env.PORT||8008;
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cookieparser = require('cookie-parser');
const Shortener = require('./models/urlschema');



// making database connection with mongoose
mongoose.connect('mongodb+srv://Ashish:Backend@cluster0.vgss5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useUnifiedTopology:true,
    useNewUrlParser:true

}).then(()=>{
    console.log('database connected')
}).catch((err)=>{
    console.log(err)
});



//setting template engine
app.set('view engine','ejs');

//middleware
app.use(express.urlencoded({extended:false}));
//cookie middleware
app.use(cookieparser());







//home route get all the url links and shortener link
app.get('/',async(req,res)=>{
    const getall = await Shortener.find()
    res.render('index',{shortener:getall})
});







//create route
app.post('/shortener',async(req,res)=>{
    const shorturl = Shortener(req.body);

    const savingurl = await shorturl.save();
    console.log(savingurl)
    res.redirect('/')
});







//dashboard route
app.get('/dashboard',async(req,res)=>{
    const findingurl = await Shortener.find() 
    res.render('dashboard',{shortener:findingurl})
});






app.get('/details',async(req,res)=>{
        res.redirect('/:shortUrl?[\+\]')
});



//details of url short link
app.get('/:shortUrl?[\+\]',async(req,res)=>{
    // console.log(req.params['shortUrl'])
    const url = await Shortener.findOne({short:req.params['shortUrl']})
    url.visits++
    url.save()
    res.render('details',{details:url});
})








//openeing of short url
app.get('/:shortUrl',async(req,res)=>{
    const url = await Shortener.findOne({short: req.params.shortUrl})
    if(url==null) return res.sendStatus(404);
    url.visits++ //incramenting clicks
    
    url.save(); // saving clicks or visits


    let isWin = process.platform; // fetching windows method in javascript but in nodejs it is process
    osname="unknow";
    if (isWin=="win32" !=-1) {
        osname="windows"
    }
    else if(isWin=="darwin" !=-1) {osname="Mac"}
    else if(isWin=="aix" !=-1) {osname="aix"}
    else if(isWin=="linux" !=-1) {osname="linux"}
    else if(isWin=="freebsd" !=-1) {osname="freebsd"}
    // const plateform = req.headers['sec-ch-ua-platform'] // this will detect the plateform with responsive of website

    var userdata = await fetch('https://geolocation-db.com/json/').then(res=>res.json()) // fetching ip adress and country name with amazon aws api

    //detecting time
    let time = new Date().toLocaleTimeString()
    
    const broname = req.headers['sec-ch-ua']

    // responsive cookies
    res.cookie('timestamp',time,{httpOnly:true,maxAge:259200});//3 days cookie time
    res.cookie('OS',osname,{httpOnly:true,maxAge:259200});//3 days cookie time
    res.cookie('browser',broname,{httpOnly:true,maxAge:259200});//3 days cookie time
    res.cookie('IP',userdata.IPv4,{httpOnly:true,maxAge:259200});//3 days cookie time
    res.cookie('Country name',userdata.country_name,{httpOnly:true,maxAge:259200});//3 days cookie time

    //redirecting to original url
    res.redirect(url.full)
});







app.listen(port,()=>{
    console.log(`server started at port ${port}`)
});



