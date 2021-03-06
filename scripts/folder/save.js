var fs = require('fs-extra');
var helper = require('helper');
var yesno = require('yesno');
var join = require('path').join;
var blog_dir = join(helper.rootDir, 'blogs');
var save_db = require('../db/save');
var dumps = join(__dirname, 'dumps');

if (require.main === module) {

  var options = require('minimist')(process.argv.slice(2));

  main(options._[0], function(err){

    if (err) throw err;

    process.exit();
  });
}


function main (label, callback) {

  verify_overwrite(label, join(dumps, label), function(err){
    
    if (err) return callback(err);
    
    fs.emptyDirSync(join(dumps, label));
    
    fs.copy(blog_dir, join(dumps, label), function(err) {

      if (err) return callback(err);
        
      save_db(label, function(err){

        if (err) return callback(err);

        callback();
      });
    });
  });
}
function exists (path) {

  var result = true;

  try {
    fs.statSync(path);
  } catch (e) {
    result = false;
  }

  return result;

}

function verify_overwrite (identifier, path, callback) {

  if (!exists(path)) return callback();

  yesno.ask("Overwrite existing folder ‘" + identifier + "’? y / n", false, function(yes){

    if (yes) {
      callback();
    } else {
      callback('Do not overwrite file');
    }
  });
}

// save the contents of the blogs folder to /dumps

// save the state of the database

