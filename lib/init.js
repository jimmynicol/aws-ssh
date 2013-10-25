'use strict';

var fs, prompt, schema, config;

prompt = require('prompt');
fs = require('fs');


module.export = function(configFile){
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
};
