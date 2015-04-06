function getQueryString(obj) {
  var str = '';
  var piece;
  var k;
  for (k in obj) {
    if (obj.hasOwnProperty(k)) {
      piece = k + '=' + obj[k];
      piece = piece.replace(/\ /g, '+');
      if (str === '') {
        str = '?' + piece;
      } else {
        str += '&' + piece;
      }
    }
  }
  return str;
}

function normalize(req, res, next) {
  var modified = false;
  var path = req.path;
  if (path !== path.toLowerCase()) {
    path = path.toLowerCase();
    modified = true;
  }
  if (path.substr(-1) == '/' && path.length > 1) {
    path = path.slice(0, -1);
    modified = true;
  }
  if (modified) {
    res.redirect(301, path + getQueryString(req.query));
  } else {
    next();
  }
}

module.exports.normalize = normalize;
