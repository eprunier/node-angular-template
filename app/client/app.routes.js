'use strict';

angular.module('app').config(function ($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('home', {
			url: '/',
			views: {
				'main': {
					templateUrl: 'views/home.html',
				}
			}
		})
		.state('login', {
			url: '/login',
			views: {
				'main': {
					templateUrl: 'views/login.html'
				}
			}
		})
		.state('account', {
			url: '/account',
			views: {
				'main': {
					templateUrl: 'views/account.html',
					controller: 'AccountController',
					controllerAs: 'account'
				}
			}
		});
});