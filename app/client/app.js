'use strict';

angular.module('app', [
	'ui.router',
	'mainController',
	'loginController',
	'accountController',
	'authService'
]).config(function($httpProvider) {
	$httpProvider.interceptors.push('AuthInterceptor');
});
