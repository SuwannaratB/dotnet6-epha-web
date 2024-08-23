/*const { apply } = require("core-js/fn/reflect");*/

AppMenuPage.controller("ctrlAppPage", function ($scope, $http, conFig) {
    var url_ws = conFig.service_api_url();
    function apply() {
        try {
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        } catch { }
    }

    role_menu();

    function role_menu() {
        $scope.role_type = conFig.role_type();
        $scope.user_name = conFig.user_name();
        $scope.menu_hometasks = true;
        $scope.menu_search = true;
        $scope.menu_hazop = false;
        $scope.menu_jsea = false;
        $scope.menu_whatif = false;
        $scope.menu_hra = false;
        $scope.menu_bowtie = false;
        $scope.menu_master = false;

        if ($scope.role_type == 'admin') {
            $scope.menu_report = true;

        } else {
            $scope.menu_report = false;
        }
        //call api
        var user_name = $scope.user_name;
        $.ajax({
            url: url_ws + "Login/check_authorization_page",
            data: '{"user_name":"' + user_name + '"}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
            headers: {
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val() // รับค่าจาก form เพื่อป้องกัน CSRF
            },
            beforeSend: function () {
                $('#divLoading').show();
            },
            complete: function () {
                $('#divLoading').hide();
            },
            success: function (data) {
                var arr = data;
                if (arr.length > 0) {
                    //$scope.menu_hazop = arr.some(item => item.page_controller === 'hazop');
                    //$scope.menu_jsea = arr.some(item => item.page_controller === 'jsea');
                    //$scope.menu_whatif = arr.some(item => item.page_controller === 'whatif');
                    //$scope.menu_hra = arr.some(item => item.page_controller === 'hra');
                    //$scope.menu_bowtie = arr.some(item => item.page_controller === 'bowtie');
                    //$scope.menu_report = arr.some(item => item.page_controller === 'report');
                    //$scope.menu_master = arr.some(item => item.page_controller === 'master');
                }
                apply();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status == 500) {
                    // alert('Internal error: ' + jqXHR.responseText);
                } else {
                    // alert('Unexpected ' + textStatus);
                }
            }
        });
        role_menu_sub();
        $scope.menu_main_jseamodule = false;
        $scope.menu_main_whatifmodule = false;
    };

    function role_menu_sub() {
        var action_menu_def = true;
        //$scope.menu_main_manageuser = action_menu_def;
        //$scope.menu_main_storagelocation = action_menu_def;
        //$scope.menu_main_hazopmodule = action_menu_def;
        //$scope.menu_main_jseamodule = action_menu_def;
        //$scope.menu_main_whatifmodule = action_menu_def;
        //$scope.menu_main_hramodule = action_menu_def;
        $scope.menu_main_manageuser = action_menu_def;
        $scope.menu_manageuser = action_menu_def;
        $scope.menu_authorizationsetting = action_menu_def;

        $scope.menu_main_storagelocation = action_menu_def;
        $scope.menu_storagelocation = action_menu_def;
        $scope.menu_area = action_menu_def;
        $scope.menu_toc = action_menu_def;
        $scope.menu_businessunit = action_menu_def;

        $scope.menu_main_hazopmodule = action_menu_def;
        $scope.menu_functionallocation = action_menu_def;
        $scope.menu_guidewords = action_menu_def;

        $scope.menu_main_jseamodule = action_menu_def;
        $scope.menu_managementjsea = action_menu_def;
        $scope.menu_tageid = action_menu_def;
        $scope.menu_tasktype = action_menu_def;
        $scope.menu_mandatorynote = action_menu_def;

        $scope.menu_main_whatifmodule = action_menu_def;
        $scope.menu_managementwhatif = action_menu_def;

        action_menu_def = true;
        $scope.menu_main_hramodule = action_menu_def;
        $scope.menu_hazardtype = action_menu_def;
        $scope.menu_hazardriskfactors = action_menu_def;
        $scope.menu_workergrouplist = action_menu_def;
        $scope.menu_workergroupset = action_menu_def;
        $scope.menu_frequencylevel = action_menu_def;
        $scope.menu_compareexposurerating = action_menu_def;
        $scope.menu_compareinitialriskrating = action_menu_def; 
    }
});