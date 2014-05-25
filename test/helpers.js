var Future = Npm.require('fibers/future');

GetConnection = function (test) {
  var f = new Future();
  makeTestConnection(test, function(client) {
    f.return(client);
  });
  return f.wait();
}

SubscribeAndWait = function(client, name, args) {
  var f = new Future();
  var args = Array.prototype.splice.call(arguments, 1);
  args.push({
    onError: function(err) {
      f.return(err);
    },
    onReady: function() {
      f.return();
    }
  });

  var handler = client.subscribe.apply(client, args);
  var error = f.wait();

  if(error) {
    throw error;
  } else {
    return handler;
  }
};

Wait = function (time) {
  var f = new Future();
  Meteor.setTimeout(function () {
    f.return();
  }, time);
  f.wait();
  return;
}