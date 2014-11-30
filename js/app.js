"use strict";
/*
    app.js, main Angular application script
    define your module and controllers here
*/
var url = 'https://api.parse.com/1/classes/Comments';

angular.module('Comments', ['ui.bootstrap']) 
	.config(function($httpProvider) {
		$httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'xTnrMHh9a0RMrTNVYcTefIfmxo1SNI4uQwDDN8IZ';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'qjKsp2b8Fj7wiqoEOpR7AxuhV5vxyEmG4WJki3eU';
	})
	.controller('CommentController', function($scope, $http) {
		$scope.refreshComments = function(){
			$scope.loading = true;
			$http.get(url + '?order=-votes')
				.success(function(data) {
					$scope.comments = data.results;
				})
				.error(function(err) {
					$scope.errorMessage = err;
				})
				.finally(function() {
					$scope.loading = false;
				});
		};

		$scope.refreshComments();

		$scope.addComment = function() {
			$scope.posting = true;
			$http.post(url, $scope.newComment)
				.success(function(data) {
					$scope.newComment.objectId = data.objectId;
					$scope.comments.push($scope.newComment);
					$scope.newComment = '';
				})
				.error(function(err) {
					$scope.errorMessage = err;
				})
				.finally(function(){ 
					$scope.posting = false;
				});
		};

		$scope.deleteComment = function(comment) {
            $scope.loading = true;
            $http.delete(url + '/' + comment.objectId, comment)
                .success(function() {
                   var index = $scope.comments.indexOf(comment);
                   if(index > -1) {
                   		$scope.comments.splice(comment, 1);
                   }
                })
                .error(function(err){
                    $scope.errorMessage = err;
                });		
            $scope.loading = false;
        };//deleteTask()
        
		$scope.incrementVotes = function(comment, amount) {
	        $scope.updating = true;
            $http.put(url + '/' + comment.objectId, {
                votes: {
                    __op: 'Increment',
                    amount: amount
                }
            })
                .success(function(data) {
                	if(data.votes >= 0) {
                    	comment.votes = data.votes;
                    }
                })
                .error(function(err) {
                    $scope.errorMessage = err;
                })
                .finally(function() {
                    $scope.updating = false;
                });
        }; //incrementVotes()
	});