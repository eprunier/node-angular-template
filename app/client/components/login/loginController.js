'use strict';

angular.module('loginController', [])
	.controller('LoginController', function ($location, Auth) {
		var vm = this;

		vm.login = function () {
			Auth
				.login(vm.loginData.email, vm.loginData.password)
				.then(function () {
					$location.path('/');
				})
				.catch(function () {
					vm.authError = true;
				});
		};

		vm.createAccount = function () {
			Auth.createUser(vm.creationData);
			vm.creationSuccess = true;
			vm.creationData = {};
		};
	});