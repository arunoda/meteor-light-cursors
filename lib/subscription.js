Expose.Subscription.prototype.lightAdded = function (collectionName, id, fields) {
  var self = this;
  if (self._isDeactivated())
    return;
  id = self._idFilter.idStringify(id);
  Meteor._ensure(self._documents, collectionName)[id] = true;
  self._session.lightAdded(self._subscriptionHandle, collectionName, id, fields);
};