Package.describe({
  "summary": "Cursors without caching documents on the server"
});

Package.on_use(function(api) {
  configurePackage(api);

  api.export([]);
});

Package.on_test(function(api) {
  configurePackage(api);
  api.use([
    'tinytest',
    'test-helpers'
  ], 'server');
  
  api.add_files([
    'test/helpers.js',
    'test/session_collection_view.js',
    'test/light_added_logic.js',
    'test/integration.js'
  ], 'server');
});

function configurePackage(api) {
  api.use(['expose'], 'server');
  api.add_files([
    'lib/session_collection_view.js',
    'lib/session.js',
    'lib/subscription.js',
    'lib/cursor.js',
  ], 'server');
}
