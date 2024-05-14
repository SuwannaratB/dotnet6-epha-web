/*const { apply } = require("core-js/fn/reflect");*/

AppMenuPage.controller("ctrlAppPage", function ($scope, $http, conFig) {
    var url_ws = conFig.service_api_url();

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
            beforeSend: function () {
                $('#divLoading').show();
            },
            complete: function () {
                $('#divLoading').hide();
            },
            success: function (data) {
                var arr = data;
                if (arr.length > 0) {
                    $scope.menu_hazop = arr.some(item => item.page_controller === 'hazop');
                    $scope.menu_jsea = arr.some(item => item.page_controller === 'jsea');
                    $scope.menu_whatif = arr.some(item => item.page_controller === 'whatif');
                    $scope.menu_hra = arr.some(item => item.page_controller === 'hra');
                    $scope.menu_bowtie = arr.some(item => item.page_controller === 'bowtie');
                    $scope.menu_report = arr.some(item => item.page_controller === 'report');
                    $scope.menu_master = arr.some(item => item.page_controller === 'master');
                }
                apply();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status == 500) {
                    alert('Internal error: ' + jqXHR.responseText);
                } else {
                    alert('Unexpected ' + textStatus);
                }
            }

        }); 
    };

    function apply() {
        try {
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        } catch { }
    }
    $scope.selected_menu = function (page) {
        // alert(page);
        //var pha_no = $scope.pha_no;
        //var pha_status = $scope.pha_status;
        //HAZOP--> create, draft, conduct, follow, review
        //HAZOP CAPEX--> create, draft, conduct, approve, reject, follow, review

        conFig.controller_action_befor = 'Home/Portal';

        page = page + "/index"
        window.open(`@Url.Content("~/")${page}`, "_top")

        return true;
    };


});