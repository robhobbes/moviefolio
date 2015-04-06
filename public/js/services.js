angular.module('moviesApp')
.factory('MoviesAPI', ['$log', '$http', function ($log, $http) {
  var moviesAPI = this;
  var url = '/api/movies';
  var searchUrl = url + '/search';

  return {
    getMovies: function() {
      return $http.get(url);
    },
    addMovie: function(movie) {
      return $http.post(url, {
        msg: movie
      });
    },
    getOtherMovie: function(id) {
      return $http.get(searchUrl + '/' + id);
    },
    searchOtherMovies: function(searchString) {
      $log.log(searchString);
      return $http.get(searchUrl, {
        params: {
          search: searchString
        }
      });
    }
  };
}])
.factory('MovieTypes', [function () {
  // TODO like this ???
  return {
    getTypes: function() {
      return [
        'Movie',
        'Series',
        'Episode'
      ];
    }
  };
}]);
