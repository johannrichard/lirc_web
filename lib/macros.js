function exec(macro, lircNode, iter) {
  var i = iter || 0;

  // select the command from the sequence
  var command = macro[i];

  i = i + 1;

  if (!command) { return false; }

  // if the command is delay, wait N msec and then execute next command
  if (command[0] === 'delay') {
    setTimeout(function () {
      exec(macro, lircNode, i);
    }, command[1]);
  } else if (Array.isArray(command[1])) {
    // send_start hold command and set timeout for hold time to call send_stop
    lircNode.cmd('SEND_START', command[0], command[1][0], function () {
      setTimeout(function () {
        lircNode.cmd('SEND_STOP', command[0], command[1][0], function () {
          setTimeout(function () {
            exec(macro, lircNode, i);
          }, 100);
        });
      }, command[1][1]);
    });
  } else {
    // By default, wait 100msec before calling next command
    lircNode.cmd('SEND_ONCE', command[0], command[1], function () {
      setTimeout(function () {
        exec(macro, lircNode, i);
      }, 100);
    });
  }

  return true;
}

exports.exec = exec;
