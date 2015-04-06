var express = require('express');
var request = require('superagent');
var bodyParser = require('body-parser');

var apiRouter = express.Router({
  strict: true,
  caseSensitive: true
});
var externalAPI = 'http://www.omdbapi.com/';
var cache = {};

function apiHandler(req, res, url, params) {
  if (cache[req.url] !== undefined) {
    console.log('serving ' + url + ' from cache with params: ' + JSON.stringify(params));
    // TODO add cache lifetime / use cache library?
    res.json(cache[req.url]);
  } else {
    request
      .get(url)
      .query(params)
      .send()
      .end(function (error, response) {
        if (error) {
          // TODO
          console.log(error); // connectivity error
          res.send('error');
        } else if (response.error) {
          // TODO
          console.log(response.error); // 400 or 500 error
          res.send('error');
        } else {
          if (cache[req.url] === undefined) {
            cache[req.url] = JSON.parse(response.text.replace(/(\n)+/, ''));
          }
          res.json(JSON.parse(response.text.replace(/(\n)+/, '')));
        }
      });
  }
}

apiRouter.use(bodyParser.json());
apiRouter.use(bodyParser.urlencoded({
  extended: true
}));

apiRouter.get('/movies/search/:id', function (req, res) {
  var url = externalAPI;
  var params = {
    i: req.params.id
  };
  apiHandler(req, res, url, params);
});
apiRouter.get('/movies/search', function (req, res) {
  var url = externalAPI;
  var params = {
    s: req.query.search
  };
  if (req.query.search === undefined) {
    // TODO error
    res.send('error');
  } else {
    apiHandler(req, res, url, params);
  }
});
/*apiRouter.get('/movies/:id', function (req, res) {

});*/
apiRouter.get('/movies', function (req, res) {
  // TODO store title and year (so that we can display minimal information until the external API calls come back)
  var json = [
    {
      imdbID: "tt1772341",
      categories: [
        "Animation",
        "Adventure",
        "Comedy"
      ],
      formats: [
        "DVD",
        "Blu-ray"
      ]
    },
    {
      imdbID: "tt0481141",
      categories: [
        "Drama",
        "Romance"
      ],
      formats: [
        "DVD"
      ]
    },
    {
      imdbID: "tt0417299",
      categories: [
        "Animation",
        "Action",
        "Adventure"
      ],
      formats: [
        "DVD"
      ]
    },
    {
      imdbID: "tt0848537",
      categories: [
        "Animation",
        "Adventure",
        "Family"
      ],
      formats: [
        "DVD"
      ]
    },
    {
      imdbID: "tt1155076",
      categories: [
        "Action",
        "Drama",
        "Family"
      ],
      formats: [
        "DVD"
      ]
    },
    {
      imdbID: "tt0414387",
      categories: [
        "Drama",
        "Romance"
      ],
      formats: [
        "DVD"
      ]
    }
  ]
  res.json(json);
});

module.exports.router = apiRouter;
