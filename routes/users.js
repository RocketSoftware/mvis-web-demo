/*
This router handles all internal requests and responses. Used for updating the front end with new data without reloading the entire page.
This type of internal router is required to adhere to CORS Policy.
© 2019 Rocket Software, Inc. or its affiliates. All Rights Reserved
Written by Andrew Gorovoy
*/
var express = require('express');
var router = express.Router();
const request = require('request');
const config = require('../config');

/*
This route is used when a specifc number of table rows are wanted. A quantity or num is passed into the request.
*/
router.get('/:num', function(req, response, next) {  
  var prodList = [];
  var num = req.params.num;
  if (num > 100) {
    num = 100;
  }
  var URL = config.mvis.baseEndPointURL + config.mvis.port + '/Xdemo/Products?max=' + num;
  console.log(URL);
  request(URL, { json: true }, (err, res, body) => {
    if (err) { console.log(err); return null; }
    if (body.Products == undefined) {return response.send([]);}
      body.Products.forEach(el => { 
        prodList.push(el);
      });
    prodData = prodList;
    response.send(prodList);
  }).auth('agorovoy@rs.com','admin',true);
  
});

/*
This route is used to find information on a specific product. The product id is passed into the query.
*/
router.get('/prodID/:prodID',function(req,response){
  var prodList = [];
  var id = req.params.prodID;
  console.log(id);
  var URL = config.mvis.baseEndPointURL + config.mvis.port + '/Xdemo/Products/' + id ;
  request(URL, { json: true }, (err, res, body) => {
    if (err) { console.log(err);  return null; }
    if (body == undefined) {return response.send([]);}
    response.send(body);
  }).auth('agorovoy@rs.com','admin',true);
});

/*
This route handles filters. The front end will construct a MVIS select query, pass it to this route, which will then be sent to MVIS, and filtered data will be returned.
*/
router.get('/filter/:query',function(req,response){
  var searchQuery = req.params.query;
  var prodList = [];
  var URL = config.mvis.baseEndPointURL + config.mvis.port + '/Xdemo/Products?select=' + searchQuery;
  console.log("URL: " + URL);
  request(URL, { json: true }, (err, res, body) => {
    if (err) { console.log(err); return null; }
    if (body.Products == undefined) {return response.send([]);}
    body.Products.forEach(el => { 
      prodList.push(el);
    });
    prodData = prodList;
    response.send(prodList);
    }).auth('agorovoy@rs.com','admin',true);
});




module.exports = router;
