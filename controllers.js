var fb_app = "https://supermagico.firebaseio.com";
var pixel_dim = 34;
var pixel_size = 30;

var magicControllers = angular.module('magicControllers', []);

magicControllers.controller('MenuCtrl', ['$scope', '$firebaseArray', '$firebaseObject', '$window', 
  function ($scope, $firebaseArray, $firebaseObject, $window) {
    console.log('Main controller!');
    
    
    
    var refLogin = new Firebase(fb_app);
    $scope.authData = refLogin.getAuth();
   
    refLogin.onAuth(function(authData) {
        if (!$scope.authData) {
            refLogin.authWithOAuthRedirect("facebook", function (error) {
                console.log("Login Failed!", error);
            });
        }else {
            console.log("Authenticated successfully with payload:", authData);
            // refLogin.offAuth(onAuthCallback);
            
            var ref = new Firebase(fb_app + '/game_list');
            $scope.game_list = $firebaseArray(ref); //.limit(300)
                
            console.log($scope.game_list);

        }
    });
 
    $scope.rgb2hex = function(rgb){
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" + ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) + ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) + ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
    }
    
    $scope.addGame = function() {
            //create game on game list
 
            var image = new Image();//pixel_dim,pixel_dim
            image.onload = function() {
                var canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
            
                var context = canvas.getContext('2d');
                //context.drawImage(image, 0, 0);
                context.drawImage(image, 0, 0, pixel_dim, pixel_dim);
             
                var gameTemplate = new Array(canvas.width);
                
                for(var x = 0; x < canvas.width; x++){
                    gameTemplate[x] = new Array(canvas.height);
                    for(var y = 0; y < canvas.height; y++){
                        var pixel = context.getImageData(x, y, 1, 1);
                        var data = pixel.data;
                        var rgba = 'rgba(' + data[0] + ',' + data[1] +',' + data[2] + ',' + data[3] + ')';
                        //gameTemplate[x][y]= [{color: $scope.rgb2hex(rgba), creator:0}];
                        gameTemplate[x][y]= {
                                original : {color: $scope.rgb2hex(rgba), creator_id: $scope.authData.facebook.id, creator_name: $scope.authData.facebook.displayName, create_date: new Date().getTime()},
                                versions : []
                            };
               
                    }   
                }
                
                var mbaj = document.getElementById("mbaj");
                mbaj.appendChild(image);
                
                $scope.createGame($scope.rotateRight(gameTemplate));
                
            };
            image.src = $scope.croppedDataUrl;
            

        };
        
        $scope.rotateRight = function(structure){
            var temp = new Array(structure.length);
            var i, j;
            for(i = 0; i < temp.length; ++i){
                temp[i] = new Array(temp.length);
                for (j = 0; j < temp.length; ++j){
                    temp[i][j] = structure[temp.length - j - 1][i];
                }
            }
            return temp;
        };

        $scope.createGame = function(gameTemplate) {
             $scope.game_list.$add({
                created_date: new Date().getTime(), game_id: $scope.new_game_name
            });
            //create the real GameCtrl
            
            //create chat room
            
            var refChat = new Firebase(fb_app + '/game_chat/' + $scope.new_game_name);
            refChat.set([]);
           
            //create new blank game
            var refGame = new Firebase(fb_app +'/games/'+ $scope.new_game_name );
           
            refGame.set({id:$scope.new_game_name , dim_x: pixel_dim, dim_y: pixel_dim, pixels: gameTemplate });
            
            //reset
            $scope.new_game_name = "";
        };      
        
  }]);
  
magicControllers.controller('GameCtrl', ['$scope', '$firebaseObject', '$window', '$routeParams', '$mdDialog', '$mdMedia', '$firebaseArray',
  function ($scope, $firebaseObject, $window, $routeParams, $mdDialog, $mdMedia,  $firebaseArray) {
    console.log('Game controller:' + $routeParams.gameId);
     
    $scope.gameId = $routeParams.gameId;
    
    var refLogin = new Firebase(fb_app);
    $scope.authData = refLogin.getAuth();
   
    refLogin.onAuth(function(authData) {
        if (!$scope.authData) {
            refLogin.authWithOAuthRedirect("facebook", function (error) {
                console.log("Login Failed!", error);
            });
        }else {
            console.log("Authenticated successfully with payload:", $scope.authData);
            
            var refGame = new Firebase(fb_app +'/games/'+ $scope.gameId );
            
            $scope.canvas_dim = pixel_dim* pixel_size;
            
            //var syncObject = $firebaseObject(refGame);
            //syncObject.$bindTo($scope, "game");
            
            $scope.game = $firebaseObject(refGame);
            
            console.log($scope.game);
        }
    });
    
    /*
    var DialogController = function ($scope, $mdDialog) {
      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.answer = function(answer) {
        $mdDialog.hide(answer);
      };
    }  
    */
    
    $scope.cancelSavePixel  = function(x, y){
        $scope.showInsertPixel = false;    
    };
    
    $scope.doSavePixel  = function(){
        $scope.showInsertPixel = false;
       
        console.log('doSavePixel and hide view');
       
       var refPixelNew = new Firebase(fb_app +'/games/'+ $scope.gameId +'/pixels/' + $scope.pixel_y + '/'+ $scope.pixel_x + '/versions');
        
        //var newElement = refPixelNew.push();
        refPixelNew.push({
                color: $scope.pixelColor, creator_id: $scope.authData.facebook.id, creator_name: $scope.authData.facebook.displayName, create_date: new Date().getTime()
            });
        
        console.log('new pixel added on ' + $scope.pixel_y + 'x' + $scope.pixel_x );
    };
    
    $scope.createPixelAt  = function(x, y){
        console.log('createPixel ' + x + 'x' + y);

        $scope.pixel_x = x;
        $scope.pixel_y = y;
        $scope.showInsertPixel = true;

        /*
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        $mdDialog.show({
          controller: DialogController,
          templateUrl: 'views/create_pixel_dialog.html',
          parent: angular.element(document.body),
          clickOutsideToClose:false,
          fullscreen: useFullScreen
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
        $scope.$watch(function() {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
          $scope.customFullscreen = (wantsFullScreen === true);
        });
        */
    };

  }]);
  
  
magicControllers.controller('AboutCtrl', ['$scope', '$mdDialog', '$http',
    function($scope, $mdDialog, $http ) {
     console.log('About controller!');
  }]);