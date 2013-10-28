'use strict';

var _, Server;
_ = require('lodash');


Server = (function(){
  function Server(data){
    this.data = data;

    this.id = this.data.InstanceId;
    this.ami = this.data.ImageId;
    this.tags = this._tags();
    this.name = this.tags.Name;
    this.publicDns = this.data.PublicDnsName;
    this.privateDns = this.data.PrivateDnsName;
    this.publicIp = this.data.PublicIpAddress;
    this.privateIp = this.data.PrivateIpAddress;
    this.state = this.data.State.Name;
    this.key = this.data.KeyName;
    this.instanceType = this.data.InstanceType;
    this.availabilityZone = this.data.Placement.AvailabilityZone;
    this.securityGroups = this.data.SecurityGroups[0];
  }

  Server.prototype = {

    _tags: function(){
      var t = {};
      for(var i in this.data.Tags){
        t[this.data.Tags[i].Key] = this.data.Tags[i].Value;
      }
      return t;
    },

    print: function(){
      console.log(this.id.bold, '-', this.state[this.state === 'running' ? 'green' : 'red']);
      console.log('  Availability Zone:', this.availabilityZone.cyan);
      console.log('  Instance Type:', this.instanceType.cyan);
      console.log('  DNS Name:', String(this.publicDns).cyan);
      console.log('  Public IP:', String(this.publicIp).cyan);
      console.log('  Private IP:', String(this.privateIp).cyan);
      console.log('  Security Group:', ('' + this.securityGroups.GroupName + ' (' + this.securityGroups.GroupId + ')').cyan);
      console.log('  Key:', this.key.cyan);
      console.log('  Tags:');
      _.pick(this.tags, function(value, key){
        console.log('    ' + key + ':', value.cyan);
      });
    },

    printShort: function(prefix){
      var tagStr;

      tagStr = [];
      for(var i in this.data.Tags){
        tagStr.push(
          (this.data.Tags[i].Key + ': ').black + this.data.Tags[i].Value
        );
      }

      console.log(
        (prefix || '').yellow,
        this.id.bold,
        '-',
        this.state[this.state === 'running' ? 'green' : 'red'],
        '-',
        this.instanceType,
        '-',
        tagStr.join(' - ')
      );
    }

  };

  return Server;
})();


module.exports = Server;