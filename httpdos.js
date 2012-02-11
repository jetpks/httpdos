#!/usr/local/bin/node
(function () {
  "use strict"

  var http = require('http')
    , concurrent
    , timeLimit
    , target
    , argNumber = 4
    , failures = 0
    , successes = 0
    , EventEmitter = require('events').EventEmitter
    , supervisor = new EventEmitter()
    ;


  function initialize() {
    function usage() {
      console.log("Usage: "
      , process.argv[0]
      , process.argv[1]
      , "<target> <concurrent_connections> [time_limit_in_seconds]"
      );
    }

    function isInt(theNumber) {
      return ((parseFloat(theNumber) == parseInt(theNumber)) && !isNaN(theNumber)) ? true : false;
    }

    if(!(process.argv.length < argNumber && isInt(process.argv[3]))) {
      target = process.argv[2];
      concurrent = process.argv[3];
    } else {
      usage();
      process.exit(1);
    }

    if(typeof process.argv[4] != 'undefined' && isInt(process.argv[4])) {
      timeLimit = process.argv[4];
    } else {
      timeLimit = -1;
    }
    supervisor.emit('initialized');
  }

  function answer(res) {
    if(res.statusCode < 399) {
      supervisor.emit('oneDone', 'success');
    } else {
      supervisor.emit('oneDone', 'failure');
    }
  }

  function runMany() {
    var index = 0;
    while(index++ < concurrent) {
      http.get({ host: target, port: 80, path: '/', headers: {connection: 'close'}}, answer);
    }
  }

  supervisor.on('oneDone', function(type) {
    if(type == 'success') {
      successes += 1;
    } else {
      failures += 1;
    }
    if((successes + failures) % concurrent == 0) {
      console.log('Batch finished! Success:', successes, ' Fail:', failures);
      runMany();
    }
  });

  supervisor.on('initialized', runMany);

  initialize();

}());
