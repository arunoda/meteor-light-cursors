Expose.SessionCollectionView.prototype._initLightCursorFields = function() {
  if(!self._lightFields) {
    self._lightFields = {};
    self._lightFieldsIds = {};
    self._nextLightFieldId = 0;
  }
};

Expose.SessionCollectionView.prototype._registerFields = function(docView, fields) {
  var self = this;
  var fieldNumIds = [];
  self._initLightCursorFields();

  _.each(fields, function(key) {
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

  if(docView._lightFieldsIds) {
    // process only if we've _lightFieldsIds
    docView._lightFieldsIds.forEach(function(numId) {
      exitingFields[self._lightFieldsIds[numId]] = numId;
    });

    _.each(fields, function(key, value) {
      if(!exitingFields[key]) {
        self._registerField(key);
        changeCollector[key] = value;

        var numId = self._lightFields[key];
        docView._lightFieldsIds.push(numId);
      } 
    });
  } 
};

Expose.SessionCollectionView.prototype._registerField = function(key) {
  var numId = this._nextLightFieldId++;
  this._lightFieldsIds[numId] = key;
  this._lightFields[key] = numId;
};