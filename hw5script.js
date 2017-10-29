const app = angular.module('toyStore', ['ngAnimate'])
app.filter('searchFor', function() {
  return function(arr, searchTerm) {
    if (!searchTerm) {
      return arr
    }

    let result = []
    searchTerm = searchTerm.toLowerCase()
    angular.forEach(arr, function(toy) {
      if (toy.title.toLowerCase().indexOf(searchTerm) !== -1) {
        result.push(toy)
      }
    })
    return result
  }
})

app.controller('ToySearchController', function($scope, $http) {
  const url = 'toys.txt'
  $http.get(url)
    .then(function(toys) {
      console.log(toys)
      $scope.toys = toys.data
    })

    $scope.toggleDesc = function(toy) {
      toy.chosen = !toy.chosen
    }
})