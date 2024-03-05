
var app = angular.module("myApp",[]); 

app.controller("MyController",function($scope){

    //Area Process Unit = APU
    $scope.master_apu=[{
        id: 'A',
        name: 'A'
    },{
        isbn: 'B',
        name: 'B'
    },{
        isbn: 'C',
        name: 'C'
    },{
        isbn: 'D',
        name: 'D'
    }]
    
    $scope.master_area=[{
        id: 'E',
        name: 'E'
    },{
        isbn: 'F',
        name: 'F'
    }
 ]




    $scope.groups = []; // Array to store groups

    $scope.addGroup = function() {
      $scope.groups.push({ name: "" }); // Add an empty group
    };

    $scope.deleteGroup = function(index) {
      $scope.groups.splice(index, 1); // Remove the group at the specified index
    };

});

