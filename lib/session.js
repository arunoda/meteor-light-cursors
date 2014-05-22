// Session.lightAdded
Expose.Session.prototype.lightAdded = function (subscriptionHandle, collectionName, id, fields) {
  var self = this;
  var view = self.getCollectionView(collectionName);
  view.lightAdded(subscriptionHandle, id, fields);
};