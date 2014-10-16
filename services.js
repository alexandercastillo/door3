angular.module('triviaApp.services', [])
.factory('FreebaseQueryService', function($http) {

	var results = {};

	results.request = function(query) {
		return $http.get('https://www.googleapis.com/freebase/v1/mqlread?query=' + JSON.stringify(query));
	}

	return results;
});


//url: 'https://www.googleapis.com/freebase/v1/mqlread?query=' + JSON.stringify(query)
