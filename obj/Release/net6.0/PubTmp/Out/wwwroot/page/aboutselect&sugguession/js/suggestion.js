angular.module('myApp', []).controller('myController', function ($scope, $filter) {
    
    // ข้อมูลจำลอง
    $scope.project_name = [
        {name: 'HAZOP2023001'},
        {name: 'HAZOP2023002'},
        {name: 'JSEA2023001'},
        {name: 'JSEA2023002'},
        {name: 'WHAT2023001'},
        {name: 'WHAT2023002'},
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


    $scope.showResults = false; // แสดง Result ก็ ต่อเมื่อค้นหา  1 อันต่อ 1 input 
    $scope.showResults1 = false; // แสดง Result ก็ ต่อเมื่อค้นหา  1 อันต่อ 1 input 

    $scope.resultLimit = 5; // จำกัด Result ที่จะแสดง 

    //แสดง List ทั้งหมดเมื่อกดปุ่ม "more"
    $scope.showAllResults = function (type) {
        if(type === 'projectname'){
            $scope.resultLimit = $scope.filteredResults.length;
        }
        
        if(type === 'projectname1'){
            $scope.resultLimit = $scope.filteredResults1.length;
        }
      
    };
  
    $scope.filterResults = function(inPutName) {

        // inPutName คือ  ng-keyup="filterResults('projectname1')"
        if(inPutName === 'projectname'){
            var searchText = $scope.searchText.toLowerCase();
            $scope.filteredResults = []; // เก็บข้อมูลที่พิมพ์ ถ้่าทำ input search suggeussion 
            for (var i = 0; i < $scope.project_name.length; i++) { //ผูกข้อมูลตรงนี้
                var result = $scope.project_name[i]; //ผูกข้อมูลตรงนี้
                if (result.name.toLowerCase().startsWith(searchText)) {
                $scope.filteredResults.push(result);
                }
            }

            $scope.showResults = searchText.length > 0;
        }

        if(inPutName === 'projectname1'){
            var searchText = $scope.searchName.toLowerCase();
            $scope.filteredResults1 = []; // เก็บข้อมูลที่พิมพ์ ถ้่าทำ input search suggeussion เพิ่ม ต้องทำ ตัวแปรนี้ซ้ำ
            for (var i = 0; i < $scope.functional_list.length; i++) { //ผูกข้อมูลตรงนี้
                var result = $scope.functional_list[i]; //ผูกข้อมูลตรงนี้
                if (result.name.toLowerCase().startsWith(searchText)) {
                $scope.filteredResults1.push(result);
                }
            }

            $scope.showResults1 = searchText.length > 0;
        }

    };
  
    $scope.selectResult = function(result,typef) {

      if(typef === 'projectname'){  
        $scope.searchText = result.name ;// ขอ้มูลที่จะถูกนำไปให้ Input พูกกับ model
        $scope.filteredResults = [];
        $scope.showResults = false;
      }

      if(typef === 'projectname1'){  
        $scope.searchName = result.name ;// ขอ้มูลที่จะถูกนำไปให้ Input พูกกับ model
        $scope.filteredResults1 = [];
        $scope.showResults1 = false;
      }

    };


});