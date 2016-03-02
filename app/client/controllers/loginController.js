'use strict';

angular.module('app')
	.controller('loginController', function ($state) {
		$state.transitionTo('login.content');
	});