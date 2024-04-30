angular.module('myApp', []).controller('myController', function ($scope, $filter) {
        
    // ข้อมูลจำลอง

    $scope.master_apu = [
      { id: 'A', name: 'A' },
      { id: 'C', name: 'C' },
      { id: 'B', name: 'B' },
      { id: 'D', name: 'D' },
      { id: 'E', name: 'E' },
      { id: 'F', name: 'F' },
    ];

    $scope.functional_list = [
      {name: "TPX-76-LICSA-001-TX"},
      {name: "TPX-76-LICSA-002-TX"},
      {name: "TPX-76-LICSA-003-TX"},
      {name: "TPX-76-LICSA-004-TX"},
      {name: "TPX-77-LICSA-001-TX"},
      {name: "TPX-77-LICSA-002-TX"},
      {name: "TPX-77-LICSA-003-TX"},
      {name: "TPX-77-LICSA-004-TX"},
    ];


  });