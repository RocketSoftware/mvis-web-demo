/*
This router handles all requests originating from the browser. 
© 2019 Rocket Software, Inc. or its affiliates. All Rights Reserved
Written by Andrew Gorovoy
*/

var express = require('express');
var router = express.Router();
const request = require('request');
const config = require('../config');

global.prodData = [];

/*
This route renders the landing page. Sends request to MVIS to get data and then sends it to the front end to get displayed.
*/

router.get('/', function(req, response, next) {
  console.log("hello");
  port = req.body.port;
  console.log(port);
  var prodList = [];
  var url2 = config.mvis.baseEndPointURL + config.mvis.port + '/Xdemo/Products?max=20';
  request(url2, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
      body.Products.forEach(el => { 
        prodList.push(el);
      });
    prodData = prodList;
    response.render('index',{prodList:prodList});
  }).auth('agorovoy@rs.com','admin',true);
});


module.exports = router;
