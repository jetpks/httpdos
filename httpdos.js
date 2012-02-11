#!/usr/local/bin/node
(function () {
  "use strict"

  var request = require('ahr2')
    , concurrent
    , timeLimit
    , target
    , argNumber = 4
    , fails
    ;

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

  if(typeof process.argv[4] == 'undefined') {
    timeLimit = -1;
  }




}());
