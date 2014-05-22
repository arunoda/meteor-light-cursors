Tinytest.add(
  'Session - lightAdded new document',
  function(test) {
    var session = new Expose.Session({}, 'pre1', new FakeSocket(), {});
    var payloadFields = {aa: 20};
    var payloadCollectionName = 'coll1';
    var payloadId = 'id1';
    var sendAddedCount = 0;
    session.sendAdded = function(collectionName, id, fields) {
      test.equal(collectionName, payloadCollectionName);
      test.equal(id, 'id1');
      test.equal(fields, payloadFields);

      sendAddedCount++;
    };
    
    session.lightAdded('sub1', payloadCollectionName, payloadId, payloadFields);
    var cv = session.getCollectionView(payloadCollectionName);
    test.equal(cv.documents[payloadId].getFields(), {});

    test.equal(sendAddedCount, 1);
  }
);

Tinytest.add(
  'Session - lightAdded new document twice (no new fields)',
  function(test) {
    var session = new Expose.Session({}, 'pre1', new FakeSocket(), {});
    var payloadFields = {aa: 20};
    var payloadCollectionName = 'coll1';
    var payloadId = 'id1';
    var sendAddedCount = 0;
    session.sendAdded = function(collectionName, id, fields) {
      sendAddedCount++;
      test.equal(collectionName, payloadCollectionName);
      test.equal(id, 'id1');

      if(sendAddedCount == 1) {
        test.equal(fields, payloadFields);
      } else if(sendAddedCount == 2) {
        test.equal(fields, {});
      }
    };
    
    session.lightAdded('sub1', payloadCollectionName, payloadId, payloadFields);
    var cv = session.getCollectionView(payloadCollectionName);
    test.equal(cv.documents[payloadId].getFields(), {});

    session.lightAdded('sub1', payloadCollectionName, payloadId, payloadFields);
    test.equal(cv.documents[payloadId].getFields(), {});

    test.equal(sendAddedCount, 2);
  }
);

Tinytest.add(
  'Session - lightAdded new document twice (with new fields)',
  function(test) {
    var session = new Expose.Session({}, 'pre1', new FakeSocket(), {});
    var payloadFields = {aa: 20};
    var payloadCollectionName = 'coll1';
    var payloadId = 'id1';
    var sendAddedCount = 0;
    session.sendAdded = function(collectionName, id, fields) {
      sendAddedCount++;
      test.equal(collectionName, payloadCollectionName);
      test.equal(id, 'id1');

      if(sendAddedCount == 1) {
        test.equal(fields, payloadFields);
      } else if(sendAddedCount == 2) {
        test.equal(fields, {bb: 40});
      }
    };
    
    session.lightAdded('sub1', payloadCollectionName, payloadId, payloadFields);
    var cv = session.getCollectionView(payloadCollectionName);
    test.equal(cv.documents[payloadId].getFields(), {});

    session.lightAdded('sub1', payloadCollectionName, payloadId, {bb: 40});
    test.equal(cv.documents[payloadId].getFields(), {});

    test.equal(sendAddedCount, 2);
  }
);

Tinytest.add(
  'Session - lightAdded new document three times (with new fields, only once)',
  function(test) {
    var session = new Expose.Session({}, 'pre1', new FakeSocket(), {});
    var payloadFields = {aa: 20};
    var payloadCollectionName = 'coll1';
    var payloadId = 'id1';
    var sendAddedCount = 0;
    session.sendAdded = function(collectionName, id, fields) {
      sendAddedCount++;
      test.equal(collectionName, payloadCollectionName);
      test.equal(id, 'id1');

      if(sendAddedCount == 1) {
        test.equal(fields, payloadFields);
      } else if(sendAddedCount == 2) {
        test.equal(fields, {bb: 40});
      } else if(sendAddedCount == 3) {
        test.equal(fields, {});
      }
    };
    
    session.lightAdded('sub1', payloadCollectionName, payloadId, payloadFields);
    var cv = session.getCollectionView(payloadCollectionName);
    test.equal(cv.documents[payloadId].getFields(), {});

    session.lightAdded('sub1', payloadCollectionName, payloadId, {bb: 40});
    test.equal(cv.documents[payloadId].getFields(), {});

    session.lightAdded('sub1', payloadCollectionName, payloadId, {aa: 20, bb: 40});
    test.equal(cv.documents[payloadId].getFields(), {});
    test.equal(sendAddedCount, 3);
  }
);

Tinytest.add(
  'Session - lightAdded then changed',
  function(test) {
    var session = new Expose.Session({}, 'pre1', new FakeSocket(), {});
    var payloadFields = {aa: 20};
    var payloadCollectionName = 'coll1';
    var payloadId = 'id1';
    var sendAddedCount = 0;
    var sendChangedCount = 0;

    session.sendAdded = function(collectionName, id, fields) {
      test.equal(collectionName, payloadCollectionName);
      test.equal(id, 'id1');
      test.equal(fields, payloadFields);

      sendAddedCount++;
    };
    
    session.sendChanged = function(collectionName, id, fields) {
      test.equal(collectionName, payloadCollectionName);
      test.equal(id, 'id1');
      test.equal(fields, {aa: 30, bb: 40});

      sendChangedCount++;
    };

    session.lightAdded('sub1', payloadCollectionName, payloadId, payloadFields);
    var cv = session.getCollectionView(payloadCollectionName);
    test.equal(cv.documents[payloadId].getFields(), {});

    session.changed('sub1', payloadCollectionName, payloadId, {aa: 30, bb: 40});
    test.equal(cv.documents[payloadId].getFields(), {aa: 30, bb: 40});

    test.equal(sendAddedCount, 1);
    test.equal(sendChangedCount, 1);
  }
);

Tinytest.add(
  'Session - lightAdded then changed twice',
  function(test) {
    var session = new Expose.Session({}, 'pre1', new FakeSocket(), {});
    var payloadFields = {aa: 20};
    var payloadCollectionName = 'coll1';
    var payloadId = 'id1';
    var sendAddedCount = 0;
    var sendChangedCount = 0;

    session.sendAdded = function(collectionName, id, fields) {
      test.equal(collectionName, payloadCollectionName);
      test.equal(id, 'id1');
      test.equal(fields, payloadFields);

      sendAddedCount++;
    };
    
    session.sendChanged = function(collectionName, id, fields) {
      sendChangedCount++;
      test.equal(collectionName, payloadCollectionName);
      test.equal(id, 'id1');

      if(sendChangedCount == 1) {
        test.equal(fields, {aa: 30, bb: 40});
      } else {
        test.equal(fields, {aa: 40});
      }
    };

    session.lightAdded('sub1', payloadCollectionName, payloadId, payloadFields);
    var cv = session.getCollectionView(payloadCollectionName);
    test.equal(cv.documents[payloadId].getFields(), {});

    session.changed('sub1', payloadCollectionName, payloadId, {aa: 30, bb: 40});
    test.equal(cv.documents[payloadId].getFields(), {aa: 30, bb: 40});

    session.changed('sub1', payloadCollectionName, payloadId, {aa: 40});
    test.equal(cv.documents[payloadId].getFields(), {aa: 40, bb: 40});

    test.equal(sendAddedCount, 1);
    test.equal(sendChangedCount, 2);
  }
);

Tinytest.add(
  'Session - lightAdded, changed and added',
  function(test) {
    var session = new Expose.Session({}, 'pre1', new FakeSocket(), {});
    var payloadFields = {aa: 20};
    var payloadCollectionName = 'coll1';
    var payloadId = 'id1';
    var sendAddedCount = 0;
    var sendChangedCount = 0;

    session.sendAdded = function(collectionName, id, fields) {
      test.equal(collectionName, payloadCollectionName);
      test.equal(id, 'id1');
      test.equal(fields, payloadFields);

      sendAddedCount++;
    };
    
    session.sendChanged = function(collectionName, id, fields) {
      sendChangedCount++;

      test.equal(collectionName, payloadCollectionName);
      test.equal(id, 'id1');

      if(sendChangedCount == 1) {
        test.equal(fields, {bb: 40});
      } else if(sendChangedCount == 2) {
        test.equal(fields, {aa: 20});
      }
    };

    session.lightAdded('sub1', payloadCollectionName, payloadId, payloadFields);
    var cv = session.getCollectionView(payloadCollectionName);
    test.equal(cv.documents[payloadId].getFields(), {});

    session.changed('sub1', payloadCollectionName, payloadId, {bb: 40});
    test.equal(cv.documents[payloadId].getFields(), {bb: 40});

    session.added('sub1', payloadCollectionName, payloadId, {aa: 20});
    test.equal(cv.documents[payloadId].getFields(), {aa: 20, bb: 40});

    test.equal(sendAddedCount, 1);
    test.equal(sendChangedCount, 2);
  }
);

Tinytest.add(
  'Session - lightAdded, changed and lightAdded',
  function(test) {
    var session = new Expose.Session({}, 'pre1', new FakeSocket(), {});
    var payloadFields = {aa: 20};
    var payloadCollectionName = 'coll1';
    var payloadId = 'id1';
    var sendAddedCount = 0;
    var sendChangedCount = 0;

    session.sendAdded = function(collectionName, id, fields) {
      test.equal(collectionName, payloadCollectionName);
      test.equal(id, 'id1');
      test.equal(fields, payloadFields);

      sendAddedCount++;
    };
    
    session.sendChanged = function(collectionName, id, fields) {
      sendChangedCount++;

      test.equal(collectionName, payloadCollectionName);
      test.equal(id, 'id1');

      if(sendChangedCount == 1) {
        test.equal(fields, {bb: 40});
      } else if(sendChangedCount == 2) {
        test.equal(fields, {aa: 20});
      }
    };

    session.lightAdded('sub1', payloadCollectionName, payloadId, payloadFields);
    var cv = session.getCollectionView(payloadCollectionName);
    test.equal(cv.documents[payloadId].getFields(), {});

    session.changed('sub1', payloadCollectionName, payloadId, {bb: 40});
    test.equal(cv.documents[payloadId].getFields(), {bb: 40});

    session.lightAdded('sub1', payloadCollectionName, payloadId, {aa: 20});
    test.equal(cv.documents[payloadId].getFields(), {aa: 20, bb: 40});

    test.equal(sendAddedCount, 1);
    test.equal(sendChangedCount, 2);
  }
);

Tinytest.add(
  'Session - lightAdded then removed',
  function(test) {
    var session = new Expose.Session({}, 'pre1', new FakeSocket(), {});
    var payloadFields = {aa: 20};
    var payloadCollectionName = 'coll1';
    var payloadId = 'id1';
    var sendAddedCount = 0;
    var sendRemovedCount = 0;

    session.sendAdded = function(collectionName, id, fields) {
      test.equal(collectionName, payloadCollectionName);
      test.equal(id, 'id1');
      test.equal(fields, payloadFields);

      sendAddedCount++;
    };
    
    session.sendRemoved = function(collectionName, id) {
      test.equal(collectionName, payloadCollectionName);
      test.equal(id, 'id1');

      sendRemovedCount++;
    };

    session.lightAdded('sub1', payloadCollectionName, payloadId, payloadFields);
    var cv = session.getCollectionView(payloadCollectionName);
    test.equal(cv.documents[payloadId].getFields(), {});

    session.removed('sub1', payloadCollectionName, payloadId);
    test.equal(cv.documents[payloadId], undefined);

    test.equal(sendAddedCount, 1);
    test.equal(sendRemovedCount, 1);
  }
);

function FakeSocket() {
  this.headers = {};
}

FakeSocket.prototype.send = function() {};