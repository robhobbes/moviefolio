angular.module('moviesApp', ['ngRoute', 'ui.bootstrap'])
.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: '/html/movie-list.html',
    controller: 'MovieListCtrl as listCtrl'
  })
  .when('/list', {
    templateUrl: '/html/movie-list.html',
    controller: 'MovieListCtrl as listCtrl'
  });
  /*.when('/add', {

  })*/
}]);