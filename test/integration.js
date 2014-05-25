Tinytest.addAsync(
  'Integration - Light Added',
  function(test, done) {
    var pubName = "pub_" + Random.id();
    var collName = 'coll_' + Random.id()
    var coll = new Meteor.Collection(collName);
    coll.insert({aa: 20, _id: 'aa'});

    Meteor.publish(pubName, function() {
      return coll.find({}, {light: true});
    });

    var client = GetConnection(test);
    var clientColl = new Meteor.Collection(collName, {connection: client});

    SubscribeAndWait(client, pubName);
    var docs = clientColl.find().fetch();
    test.equal(docs, [{aa: 20, _id: 'aa'}]);
    client.close();
    done();
  }
);

Tinytest.addAsync(
  'Integration - Light Added & Changed',
  function(test, done) {
    var pubName = "pub_" + Random.id();
    var collName = 'coll_' + Random.id()
    var coll = new Meteor.Collection(collName);
    coll.insert({aa: 20, _id: 'aa'});

    Meteor.publish(pubName, function() {
      return coll.find({}, {light: true});
    });

    var client = GetConnection(test);
    var clientColl = new Meteor.Collection(collName, {connection: client});

    SubscribeAndWait(client, pubName);
    var docs = clientColl.find().fetch();
    test.equal(docs, [{aa: 20, _id: 'aa'}]);

    coll.update({_id: 'aa'}, {$set: {'bb': 20}});
    Wait(100);

    var docs = clientColl.find().fetch();
    test.equal(docs, [{aa: 20, _id: 'aa', bb: 20}]);

    client.close();
    done();
  }
);

Tinytest.addAsync(
  'Integration - Light Added & Removed',
  function(test, done) {
    var pubName = "pub_" + Random.id();
    var collName = 'coll_' + Random.id()
    var coll = new Meteor.Collection(collName);
    coll.insert({aa: 20, _id: 'aa'});

    Meteor.publish(pubName, function() {
      return coll.find({}, {light: true});
    });

    var client = GetConnection(test);
    var clientColl = new Meteor.Collection(collName, {connection: client});

    SubscribeAndWait(client, pubName);
    var docs = clientColl.find().fetch();
    test.equal(docs, [{aa: 20, _id: 'aa'}]);

    coll.remove({_id: 'aa'});
    Wait(100);

    var docs = clientColl.find().fetch();
    test.equal(docs, []);

    client.close();
    done();
  }
);