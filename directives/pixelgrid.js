(function(angular, undefined){
    'use strict';

    var module = angular.module('kola.directives', []);
    //show the grid
    module.directive('ngPixelGrid', ['$parse', '$window', '$timeout', function($parse, $window, $timeout){
            return {
                restrict: 'AE',
                //replace: 'true',
                scope: {
                    game: '=ngModel',
                    'pixelClick': '&onPixelClick'
                },
                require: 'ngModel', 
                templateUrl: 'directives/ng-pixel-grid-template.html'
            };
        }]);
    //sing;e pixel slideshow
    module.directive('ngPixelSlide', ['$parse', '$window', '$timeout', function($parse, $window, $timeout){
            return {
                restrict: 'AE',
                scope: {
                    pixels: '=ngModel'
                },
                require: ['ngModel' 
                            //, 'ngClick' 
                            ], 
                
                //scope: true,
                //require: ['^screen','widget'],
                controller: function($scope) {
                    $scope.pixel_index = -1;
                    
                    $scope.nextPixel = function() {
                        
                        if($scope.pixels.versions && Object.keys($scope.pixels.versions).length > 0){
                            
                            var pixSize = Object.keys($scope.pixels.versions).length;
                          
                            //console.log('next called before:' + $scope.pixel_index);
                            
                            if($scope.pixel_index + 1 < pixSize +1){
                                $scope.pixel_index++;
                            }else if($scope.pixel_index + 1 == pixSize + 1){
                                $scope.pixel_index = -1;
                            }
                            //console.log('next called next:' + $scope.pixel_index);
                            
                            $timeout(function () {
                                $scope.nextPixel(); 
                            }, 3000);
                        }      
                    };
                    
                    $scope.nextPixel();

                },
                templateUrl: 'directives/ng-pixel-slide-template.html'
            };
        }]);
        
}(angular));

