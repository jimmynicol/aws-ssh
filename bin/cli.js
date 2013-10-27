#!/usr/bin/env node
'use strict';

var program, pkg, fs, configFile, config;

program = require('commander');
pkg = require('../package.json');
fs = require('fs');
configFile = process.env.HOME + '/.awssshrc';
require('colors');


program
  .version(pkg.version)
  .option('init', 'Initialize your aws-ssh session')
  .option('config', 'List your current aws-ssh configuration')
  .option('-v, --version', 'Current aws-ssh version')
  .parse(process.argv);

// handle initializing the tool, asking for the key and secret
if (program.init){
  require('../lib/init')(configFile);
  process.exit(0);
}

// print out the config as listed
if (program.config){
  // make sure we have a config in place
  if (fs.existsSync(configFile)){
    config = JSON.parse(fs.readFileSync(configFile));
  } else {
    console.log('Please run `aws-ssh init` to build your config settings'.red);
  }

  console.log('\n★  Your config settings are:\n'.yellow);
  console.log('accessKeyId:     ', config.accessKeyId.grey.bold);
  console.log('secretAccessKey: ', config.secretAccessKey.grey.bold);
  console.log('region:          ', config.region.grey.bold);
  console.log('');
  process.exit(0);
}

if (program.args.length > 0){
  require('../lib/instances')
    .listInstances(program.args[0])
    .done(function(servers){
      console.log(servers);
    });
}
