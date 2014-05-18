Tinytest.add(
  'SessionCollectionView - _registerFields',
  function(test) {
    var docView = {};
    var cv = new Expose.SessionCollectionView();
    cv._registerFields(docView, {aa: 10, bb: 20});
    var translatedFields = getTranslatedField(cv, docView);

    test.equal(translatedFields, ['aa', 'bb']);
  }
);

Tinytest.add(
  'SessionCollectionView - _pickNewFields',
  function(test) {
    var docView = {};
    var cv = new Expose.SessionCollectionView();
    cv._registerFields(docView, {aa: 10, bb: 20});

    var changeCollector = {};
    cv._pickNewFields(docView, {aa: 10, cc: 40}, changeCollector);
    
    var translatedFields = getTranslatedField(cv, docView);

    test.equal(translatedFields, ['aa', 'bb', 'cc']);
    test.equal(changeCollector, {cc: 40});
  }
);

Tinytest.add(
  'SessionCollectionView - _pickNewFields without docView._lightFieldIds',
  function(test) {
    var docView = {};
    var changeCollector = {};
    
    var cv = new Expose.SessionCollectionView();
    cv._pickNewFields(docView, {aa: 10, cc: 40}, changeCollector);

    test.equal(changeCollector, {});
  }
);

function getTranslatedField(collectionView, docView) {
  var translatedFields = [];

  docView._lightFieldIds.forEach(function(numId) {
    translatedFields.push(collectionView._lightFieldIds[numId]);
  });

  return translatedFields;
}