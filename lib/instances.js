'use strict';

var fs, _, AWS, configFile, config;

fs = require('fs');
_ = require('lodash');
AWS = require('aws-sdk');


configFile = process.env.HOME + '/.awssshrc';
config = JSON.parse(fs.readFileSync(configFile));


AWS.config.update(config);


exports.listInstances = function(){
  var ec2, servers;

  ec2 = new AWS.EC2();

  ec2.describeInstances({}, function(err, results){

    servers = _.map(results.Reservations, function(){

    });

    console.log(results.Reservations[0]);
  });

};