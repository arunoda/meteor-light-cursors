Expose.MongoCursor.prototype._publishCursor = function(sub) {
  var self = this;
  var collection = self._cursorDescription.collectionName;
  var addedMethod = (self._cursorDescription.options.light)? "lightAdded": "added";

  var observeHandle = self.observeChanges({
    added: function (id, fields) {
      sub[addedMethod](collection, id, fields);
    },
    changed: function (id, fields) {
      sub.changed(collection, id, fields);
    },
    removed: function (id) {
      sub.removed(collection, id);
    }
  });

  // We don't call sub.ready() here: it gets called in livedata_server, after
  // possibly calling _publishCursor on multiple returned cursors.

  // register stop callback (expects lambda w/ no args).
  sub.onStop(function () {observeHandle.stop();});
};