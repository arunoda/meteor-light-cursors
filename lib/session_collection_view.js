Expose.SessionCollectionView.prototype._initLightCursorFields = function() {
  if(!this._lightFields) {
    this._lightFields = {};
    this._lightFieldIds = {};
    this._nextLightFieldId = 1;
  }
};

Expose.SessionCollectionView.prototype._registerFields = function(docView, fields) {
  var self = this;
  var fieldNumIds = [];
  self._initLightCursorFields();

  _.each(fields, function(value, key) {
    if(!self._lightFields[key]) {
      self._registerField(key);
    } 

    fieldNumIds.push(self._lightFields[key]);
  });

  docView._lightFieldIds = fieldNumIds;
};

Expose.SessionCollectionView.prototype._pickNewFields = function(docView, fields, changeCollector) {
  var self = this;
  var exitingFields = {};
  self._initLightCursorFields();

  if(docView._lightFieldIds) {
    // process only if we've _lightFieldIds
    docView._lightFieldIds.forEach(function(numId) {
      exitingFields[self._lightFieldIds[numId]] = numId;
    });


    _.each(fields, function(value, key) {
      if(!exitingFields[key]) {
        self._registerField(key);
        changeCollector[key] = value;

        var numId = self._lightFields[key];
        docView._lightFieldIds.push(numId);
      } 
    });
  } 
};

Expose.SessionCollectionView.prototype._registerField = function(key) {
  var numId = this._nextLightFieldId++;
  this._lightFieldIds[numId] = key;
  this._lightFields[key] = numId;
};

// SessionCollectionView.lightAdded
Expose.SessionCollectionView.prototype.lightAdded = function(subscriptionHandle, id, fields) {
  var self = this;

  var exisitingDocView = self.documents[id];
  if(exisitingDocView && Object.keys(exisitingDocView.dataByKey).length > 0) {
    // this doc has more fields than _id 
    // (that means normal cursor has touched this or some changed happened)
    // so we need to handle it back to the original
    self.added(subscriptionHandle, id, fields);
  } else if(!exisitingDocView) {
    // this is first time collectionView looking at this object
    // initialize it
    var docView = new Expose.SessionDocumentView();
    self.documents[id] = docView;
    self.callbacks.added(self.collectionName, id, fields);

    // register fields we are sending, so we know which fields client have
    self._registerFields(docView, fields);
  } else if(exisitingDocView) {
    var changeCollector = {};
    // use the _filedNames inside the docView to detect new fields
    self._pickNewFields(exisitingDocView, fields, changeCollector);
    self.callbacks.added(self.collectionName, id, changeCollector);
  } 
};