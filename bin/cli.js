#!/usr/bin/env node
'use strict';

var program, pkg, prompt, fs, configFile;

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
  var schema, config;

  prompt = require('prompt');
  prompt.message = '⇒ '.green;
  prompt.delimiter = ' ';

  console.log('\nPlease enter your AWS credentials:\n');
  prompt.start();

  schema = {
    properties: {
      accessKeyId: {
        description: 'Access Key ID (accessKeyId):',
        required: true
      },
      secretAccessKey: {
        description: 'Secret Access Key (secretAccessKey):',
        required: true
      },
      region: {
        description: 'Assign the region',
        required: true,
        default: 'us-east-1'
      }
    }
  };

  prompt.get(schema, function(err, result){
    console.log(result);

    if (fs.existsSync(configFile)){
      config = JSON.parse(fs.readFileSync(configFile));
      config.accessKeyId = result.accessKeyId;
      config.secretAccessKey = result.secretAccessKey;
      config.region = result.region;
      fs.writeFileSync(
        configFile,
        JSON.stringify(config),
        'UTF-8',
        {'flags': 'w+'}
      );
    } else {
      fs.writeFileSync(
        configFile,
        JSON.stringify(result),
        'UTF-8',
        {'flags': 'w+'}
      );
    }

    console.log('✎', configFile.green, 'written!\n\n');
  });
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
}

if (program.args.length > 0){
  require('../lib/instances').listInstances(program.args[0]);
}
