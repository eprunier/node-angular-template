'use strict';

angular.module('mainController', [])
	.controller('MainController', function ($rootScope, $state, $location, Auth) {
		var vm = this;

		vm.isLoggedIn = Auth.isLoggedIn;

		Auth.getUser().then(function (user) {
			vm.user = user;
		});

		vm.logout = function () {
			Auth.logout();
			$location.path('/');
		};
	});
