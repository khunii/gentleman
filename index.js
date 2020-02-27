var logger = require('morgan');
var cors      = require('cors');
var express = require('express');
var errorhandler = require('errorhandler');
var bodyParser = require('body-parser');
var rootIndex = require('./api');
var gentleman = require('./api/gentleman');


const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json({
    limit: "50mb"
}));
app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended:true
}));

app.use(function(err, req, res, next){
    if(err.name === 'StatusError'){
        res.send(err.status, err.message);
    }else{
        next(err);
    }
});

app.use(errorhandler());


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));

//routing
app.use('/', rootIndex);
app.use('/gentleman',gentleman);

//export for testing
module.exports = app;
