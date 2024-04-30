
var app = angular.module("myApp", []);

app.controller("MyController", function ($scope) {
 
    get_emp() ;
    function get_emp() {
        //https://eosldashboard.thaioilgroup.com/netcore_service/api/wsform_admin/get_m_employee
alert(1);
        $.ajax({
            type: "POST",
             url: "https://eosldashboard.thaioilgroup.com/netcore_service/api/wsform_admin/get_m_employee",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {
                //$("#divLoading").show();
            },
            complete: function () {
                //$("#divLoading").hide();
            },
            success: function (data) {
         
                var arr = data;
                console.log(arr);
            
            },
            error: function (XHR, errStatus, errorThrown) {
                var err = JSON.parse(XHR.responseText);
                errorMessage = err.Message;
                alert("error:" + errorMessage);
            }
        });

    }


    $scope.groups = []; // Array to store groups

    $scope.CheckUserLogin = function (user_name, user_id) {
        $scope.groups.push({ name: "" });

    };

    $scope.deleteGroup = function (index) {
        $scope.groups.splice(index, 1); // Remove the group at the specified index
    };

});

