'use strict';

angular.module('app')
		.config(function ($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.otherwise('/');

			$stateProvider
				.state('home', {
					url: '/',
					views: {
						'main': {
							templateUrl: 'views/home.html'
						}
					}
				})
				.state('login', {
					url: '/login',
					views: {
						'main': {
							templateUrl: 'views/layout.html',
							controller: 'loginController',
							controllerAs: 'login'
						}
					}
				})
				.state('login.content', {
					views: {
						'content': {
							templateUrl: 'views/login.html'
						}
					}
				});
		});