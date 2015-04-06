angular.module('moviesApp')
.filter('movieFilter', [function () {
  // TODO, support regex
  function titleFilter(movie, titleFilter) {
    var filterValue = titleFilter.toLowerCase();
    var title = movie.title.toLowerCase();
    return title.match(filterValue) !== null;
  }

  // TODO, support regex
  function categoryFilter(movie, categoryFilter) {
    var filterValue = categoryFilter.toLowerCase();
    var categories = movie.categories;
    var category;
    var i;
    for (i = 0; i < categories.length; i++) {
      category = categories[i];
      if (category.toLowerCase().match(filterValue)) {
        return true;
      }
    }
    return false;
  }

  function typeFilter(movie, typeFilter) {
    var filterValue = typeFilter.toLowerCase();
    var type = movie.type.toLowerCase();
    if (filterValue === 'any') {
      return true;
    } else if (filterValue === type) {
      return true;
    } else {
      return false;
    }
  }

  return function (movies, title, category, type) {
    var filteredMovies = [];
    var movie;
    var i;
    for (i = 0; i < movies.length; i++) {
      movie = movies[i];
      if (titleFilter(movie, title)
          && categoryFilter(movie, category)
          && typeFilter(movie, type)) {
        filteredMovies.push(movie)
      }
    }
    return filteredMovies;
  }
}]);