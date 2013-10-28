'use strict';

var fs, cp, sshProcess;

fs = require('fs');
cp = require('child_process');



module.exports = function(server){
  var keyPath;

  keyPath = process.env.HOME + '/.ssh/' + server.key;

  if (!fs.existsSync(keyPath)){
    keyPath = process.env.HOME + '/.ssh/' + server.key + '.pem';
    if (!fs.existsSync(keyPath)){
      throw 'Listed key: ' + server.key.bold + ' does not exist!';
    }
  }

  server.print();

  console.log('\n--------------------\n'.black);

  sshProcess(server, keyPath);
};


sshProcess = function (server, keyPath) {
  var ssh, opts;

  opts = [
    '-o', 'TCPKeepAlive=yes',
    '-p', '22',
    'ubuntu@' + server.publicDns,
    '-i', keyPath
  ];

  ssh = cp.spawn('ssh', opts, {stdio: 'inherit'});

  ssh.on('error', function(){
    console.log(arguments);
  });

  ssh.on('exit', function(){
    console.log(
      '\n--------------------\n'.black,
      'Connection closed to: ',
      server.name.cyan.bold,
      '\n');
  });
};