'use strict';

angular.module('mainController', [])
	.controller('MainController', function ($rootScope, $state, $location, Auth) {
		var vm = this;

		vm.loginData = {};
		vm.authError = false;

		$rootScope.$on('$stateChangeStart', function () {
			vm.loggedIn = Auth.isLoggedIn();
			Auth.getUser().then(function (user) {
				vm.user = user;
			});
		});

		vm.doLogin = function () {
			Auth
				.login(vm.loginData.email, vm.loginData.password)
				.then(function () {
					$location.path('/');
				})
				.catch(function () {
					vm.authError = true;
				});
		};

		vm.doLogout = function () {
			Auth.logout();

			vm.loggedIn = Auth.isLoggedIn();
			Auth.getUser().then(function (user) {
				vm.user = user;
			});

			$location.path('/');
		};

		vm.doCreateAccount = function () {
			Auth.createUser(vm.creationData);
		};
	});
