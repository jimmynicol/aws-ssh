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
      }
    }
  };

  prompt.get(schema, function(err, result){
    if (fs.existsSync(configFile)){
      config = JSON.parse(fs.readFileSync(configFile));
      config.accessKeyId = result.accessKeyId;
      config.secretAccessKey = result.secretAccessKey;
      fs.writeFileSync(configFile, JSON.stringify(config));
    } else {
      fs.writeFileSync(configFile, JSON.stringify(result));
    }

    console.log('✎', configFile.green, 'written!\n\n');
  });
}

if (program.config){
  if (fs.existsSync(configFile)){
    config = JSON.parse(fs.readFileSync(configFile));

    console.log('\n★  Your config settings are:\n'.yellow);
    console.log('accessKeyId:     ', config.accessKeyId.grey.bold);
    console.log('secretAccessKey: ', config.secretAccessKey.grey.bold);
    console.log('');
  } else {
    console.log('Please run `aws-ssh init` to build your config settings'.red);
  }
}

if (program.args.length > 0){

}
