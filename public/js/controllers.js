angular.module('moviesApp')
.controller('MovieListCtrl', ['$log', 'MoviesAPI', function ($log, moviesAPI) {
  var movieListCtrl = this;
  // TODO move types list to service (esp. since it will be used by the search controller too)
  movieListCtrl.types = [
    'Any',
    'Movie',
    'Series',
    'Episode'
  ];
  movieListCtrl.movies = [];
  movieListCtrl.titleFilter = '';
  movieListCtrl.categoryFilter = '';
  movieListCtrl.typeFilter = movieListCtrl.types[0];

  // TODO move to backend ???
  function restructureMovie(movie) {
    var arrays = [
      "writer",
      "actors"
    ];
    var temp;
    var k;
    for (k in movie) {
      if (movie.hasOwnProperty(k)) {
        if (k[0] !== k[0].toLowerCase()) {
          movie[k.toLowerCase()] = movie[k];
          delete movie[k];
          k = k.toLowerCase();
        }
        if (arrays.indexOf(k) !== -1) {
          movie[k] = movie[k].split(',');
        }
      }
    }
  }

  moviesAPI.getMovies()
  .then(function (response) {
    var movies = response.data;
    var i;
    for (i = 0; i < movies.length; i++) {
      moviesAPI.getOtherMovie(movies[i]['imdbID'])
      .then(function (response) {
        var movie = response.data;
        var i;
        for (i = 0; i < movies.length; i++) {
          if (movies[i]['imdbID'] == movie['imdbID']) {
            break;
          }
        }
        movie.categories = movies[i].categories;
        movie.formats = movies[i].formats;
        restructureMovie(movie);
        movieListCtrl.movies.push(movie);
      });
    }
  });
}])
.controller('MovieSearchCtrl', ['$log', 'MoviesAPI', function ($log, moviesAPI) {
  var movieSearchCtrl = this;
  movieSearchCtrl.queryString = '';
  movieSearchCtrl.results = [];
  movieSearchCtrl.search = function() {
    var searchIds = [];
    moviesAPI.searchOtherMovies(movieSearchCtrl.queryString)
    .then(function (response) {
      $log.log(response);
    });
  };
}]);
