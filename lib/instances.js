'use strict';

var fs, _, Q, AWS, configFile, config, generateFilters, Server;

// load the necessary modules
require('colors');
fs     = require('fs');
_      = require('lodash');
Q      = require('q');
AWS    = require('aws-sdk');
Server = require('./server');

// load the config file
configFile = process.env.HOME + '/.awssshrc';
config = JSON.parse(fs.readFileSync(configFile));

// initialize the AWS object
AWS.config.update(config);

// List all available instances that match the query
exports.listInstances = function(q){
  var ec2, servers, deferred;

  ec2 = new AWS.EC2();
  deferred = Q.defer();

  ec2.describeInstances(
    { Filters: generateFilters(q) },
    function(err, results){
    if(err){
      deferred.reject(new Error(err));
    } else {
      servers = _.map(results.Reservations, function(data){
        return new Server(data.Instances[0]);
      });
      deferred.resolve(servers);
    }
  });

  return deferred.promise;
};


generateFilters = function(q){
  var filters = {};

  if (/^i-/.test(q)){
    return [{ Name: 'instance-id', Values: [q] }];
  }

  filters = [{ Name: 'tag:Name', Values: ['*' + q + '*'] }];

  return filters;
};