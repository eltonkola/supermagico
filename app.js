'use strict';

var firebase_app = 'https://supermagico.firebaseio.com';

var magicApp = angular.module('MagicApp', ['ngRoute', 
                                                'ngMaterial', 
                                                'ngMdIcons', 
                                                'firebase', 
                                                //'luegg.directives', 
                                                //'angularMoment', 
                                                'ngSanitize', 
                                                //'sun.scrollable',
                                                'ngMessages',
                                                'magicControllers' ,
                                                'ngFileUpload', 
                                                'ngImgCrop',
                                                'ngAnimate',
                                                
                                                'kola.directives',
                                                'ngCookies', 'mdColorPicker'
                                                ]);
/*
magicApp.directive('ngPixelGrid', function() {
  return {
    restrict: 'A',
    require: '^ngModel',
    scope: {
      ngModel: '='
    },
    replace: true,
    templateUrl: 'directives/ng-pixel-grid-template.html',
    template: '<div class="ngPixelGrid"></div>'
  }
});
*/



magicApp.directive('schrollBottom', function () {
  return {
    scope: {
      schrollBottom: "="
    },
    link: function (scope, element) {
      scope.$watchCollection('schrollBottom', function (newValue) {
        if (newValue)
        {
          $(element).scrollTop($(element)[0].scrollHeight);
        }
      });
    }
  }
});

magicApp.directive('includeReplace', function () {
                    return {
                        require: 'ngInclude',
                        restrict: 'A', /* optional */
                        link: function (scope, el, attrs) {
                            el.replaceWith(el.children());
                        }
                    };
                });
                
                
                
                              
magicApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/index', {
        templateUrl: 'views/index.html',
        controller: 'MenuCtrl'
      }).
      when('/game/:gameId', {
        templateUrl: 'views/game.html',
        controller: 'GameCtrl'
      }).
      when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      }).
      otherwise({
        redirectTo: '/index'
      });
  }]);
  
  
magicApp.filter('decorate', [function() {

        function decorateFilter(text) {
            var patterns = [];
            var metachars = /[[\]{}()*+?.\\|^$\-,&#\s]/g;
      
            // build a regex pattern for each defined property
            for (var i in emoticons) {
              if (emoticons.hasOwnProperty(i)){ // escape metacharacters
                patterns.push('('+i.replace(metachars, "\\$&")+')');
              }
            }
          
            // build the regular expression and replace
            return text.replace(new RegExp(patterns.join('|'),'g'), function (match) {
              return typeof emoticons[match] != 'undefined' ?
                '<img src="'+emoticon_url+ 'emo_' + emoticons[match]+'"/>' :
                match;
            });
        }
      
      
      decorateFilter.$stateful = true;
    
      return decorateFilter;
    }]);
    
    
magicApp.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default').primaryPalette('blue-grey');
});