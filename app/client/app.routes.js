'use strict';

angular.module('app').config(function ($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('home', {
			url: '/',
			views: {
				'page-content': {
					templateUrl: 'components/home/home.html',
				}
			}
		})
		.state('login', {
			url: '/login',
			views: {
				'page-content': {
					templateUrl: 'components/login/login.html',
					controller: 'LoginController',
					controllerAs: 'loginCtrl'
				}
			}
		})
		.state('account', {
			url: '/account',
			views: {
				'page-content': {
					templateUrl: 'components/account/account.html',
					controller: 'AccountController',
					controllerAs: 'accountCtrl'
				}
			}
		});
});