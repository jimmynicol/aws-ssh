'use strict';

var fs, _, Q, AWS, configFile, config, Server;

fs = require('fs');
_ = require('lodash');
Q = require('q');
AWS = require('aws-sdk');


configFile = process.env.HOME + '/.awssshrc';
config = JSON.parse(fs.readFileSync(configFile));


AWS.config.update(config);


exports.listInstances = function(){
  var ec2, servers, deferred;

  ec2 = new AWS.EC2();
  deferred = Q.defer();

  ec2.describeInstances({}, function(err, results){
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


Server = (function(){

  function Server(data){
    this.data = data;

    this.id = this.data.InstanceId;
    this.ami = this.data.ImageId;
    this.tags = this._tags();
    this.publicDns = this.data.PublicDnsName;
    this.privateDns = this.data.PrivateDnsName;
    this.state = this.data.State.Name;
    this.key = this.data.KeyName;
    this.instanceType = this.data.InstanceType;
    this.zone = this.data.Placement.AvailabilityZone;
    this.securityGroups = this.data.SecurityGroups;
  }

  Server.prototype = {

    _tags: function(){
      var t = {};
      for(var i in this.data.Tags){
        t[this.data.Tags[i].Key] = this.data.Tags[i].Value;
      }
      return t;
    },

    toHash: function(){
      return {
        id: this.id,
        ami: this.ami,
        tags: this.tags,
        publicDns: this.publicDns,
        privateDns: this.privateDns,
        state: this.state,
        key: this.key,
        instanceType: this.instanceType,
        zone: this.zone,
        securityGroups: this.securityGroups
      };
    }

  };

  return Server;
})();