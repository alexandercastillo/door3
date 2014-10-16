'use strict';

angular.module('triviaApp.controllers', ['triviaApp.services'])
.controller('TriviaGeneratorController', function($scope, FreebaseQueryService) {
	
	this.submitArtist = function() {
		this.query(this.generateQuiz, this);
	}
	
	this.query = function(callbackFunction, scope) {
		var query = this.buildQuery();
	    FreebaseQueryService.request(query).success(function (response) {
			callbackFunction(response, scope);
    	});
	};
	
	this.buildQuery = function() {
		return [{
		  "type": "/music/album",
		  "mid": null,
		  "limit": 3,
		  "name": null,
		  "releases": {
		    "track": [],
		    "limit": 1
		  },
		  "artist": {
		    "name": $scope.artist,
		    "type": "/music/artist"
		  }
		}];
	}
	
	this.generateQuiz = function(response, scope) {
		var albumsFound = response.result.length;
		if (albumsFound < 2)
		{
			$scope.question = "not enough data found to generate quiz, please try a different artist.";
		} else {
			var albumSelected = Math.floor(Math.random() * albumsFound);
			$scope.question = "Which song appeared on the album " + response.result[albumSelected].name + " by " + response.result[albumSelected].artist.name + "?";
			var tracksFound = response.result[albumSelected].releases.track.length;
			var trackSelected = Math.floor(Math.random() * tracksFound);
			$scope.answer = response.result[albumSelected].releases.track[trackSelected];
			$scope.answers = [];  
			var noDupes = [];                  
			while ($scope.answers.length < 5)
			{                 
				var wrongTitle = scope.generateWrongAnswer(response, albumSelected, albumsFound);
				if ((noDupes.indexOf(wrongTitle) < 0) && ((wrongTitle != undefined) && (wrongTitle != "")))
				{
					var wrongAnswer = 
					{
						'title' : wrongTitle,
						'class' : 'answerUnknown'
					};                          
					$scope.answers.push(wrongAnswer);
					noDupes.push(wrongTitle)
				}
			}            
			var randomPosition = Math.floor(Math.random() * 5);
			$scope.answers[randomPosition] = {
				'title' : $scope.answer,
				'class' : 'answerUnknown'
			};
		}
	}                                                              
	
	this.generateWrongAnswer = function(response, albumSelected, albumsFound) {
		var wrongAlbum = albumSelected;
		while (wrongAlbum == albumSelected)
		{
			wrongAlbum = Math.floor(Math.random() * albumsFound);
		}
		var tracksFound = response.result[wrongAlbum].releases.track.length;
		var trackSelected = Math.floor(Math.random() * tracksFound);
		return response.result[wrongAlbum].releases.track[trackSelected];
	}
	
	this.guess = function(answer)
	{                                           
		if (answer == $scope.answer)
		{
			$scope.question = "YOU ARE RIGHT!";
		} else {
			$scope.question = "sorry, you are wrong. the answer is " + $scope.answer + ".";
		}  
		for (var i = 0; i < $scope.answers.length; i++)
		{                                 
			if ($scope.answers[i].title == $scope.answer)
			{
				$scope.answers[i].class = "answerRight";
			} else {
				$scope.answers[i].class = "answerWrong";
			}
			
		}
	}
});
