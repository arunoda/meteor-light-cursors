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
  ], 'server');
  
  api.add_files([
    
  ], 'server');
});

function configurePackage(api) {
  api.use(['expose'], 'server');
  api.add_files([

  ], 'server');
}
