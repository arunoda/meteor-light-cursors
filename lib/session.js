// SessionView.added
Expose.Session.prototype.lightAdded = function(subscriptionHandle, collectionName, id, fields) {
  var self = this;
  var collectionView = self.getCollectionView(collectionName);

  var exisitingDocView = collectionView.documents[id];
  if(exisitingDocView && Object.keys(exisitingDocView.dataByKey).length > 0) {
    // this doc has more fields than _id 
    // (that means normal cursor has touched this or some changed happened)
    // so we need to handle it back to the original
    self.added(subscriptionHandle, collectionName, id, fields);
  } else if(!exisitingDocView) {
    // this is first time collectionView looking at this object
    // initialize it
    var docView = new Expose.SessionDocumentView();
    collectionView.documents[id] = docView;
    collectionView.callbacks.added(collectionView.collectionName, id, fields);

    // register fields we are sending, so we know which fields client have
    collectionView._registerFields(docView, fields);
  } else if(exisitingDocView) {
    var changeCollector = {};
    // use the _filedNames inside the docView to detect new fields
    collectionView._pickNewFields(exisitingDocView, fields, changeCollector);
    collectionView.callbacks.added(collectionView.collectionName, id, changeCollector);
  } 
};