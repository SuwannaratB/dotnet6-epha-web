/*const { apply } = require("core-js/fn/reflect");*/

//const { upperCase } = require("lodash");

AppMenuPage.controller("ctrlAppPage", function ($scope, $http, conFig) {
    var url_ws = conFig.service_api_url();
     
    role_menu();

    function role_menu() {
        $scope.user = JSON.parse(localStorage.getItem('user'))
        $scope.token = JSON.parse(localStorage.getItem('token'))
        $scope.user_name = $scope.user['user_name'];
        $scope.role_type = $scope.user['role_type'];
        // $scope.role_type = conFig.role_type();
        // $scope.user_name = conFig.user_name();
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

        $.ajax({
            url: url_ws + `Login/check_authorization_page`,
            // url: url_ws + "Login/check_authorization_page_fix",
            data: '{"user_name":"' + $scope.user_name + '","page_controller":"' + '' + '"}',
            type: "POST", contentType: "application/json; charset=utf-8",
            headers: {
                'X-CSRF-TOKEN': $scope.token
            },
            xhrFields: {
                withCredentials: true // เปิดการส่ง Cookie ไปพร้อมกับคำขอ
            },
            beforeSend: function () {
                $('#divLoading').show();
            },
            complete: function () {
                $('#divLoading').hide();
            },
            success: function (data) {

                try {
                    if (typeof data === "string") {
                        // Step 1: Decode the HTML-encoded response
                        const decodedData = htmlDecode(data);
        
                        // Step 2: Try to parse the decoded data as JSON
                        const jsonData = JSON.parse(decodedData);
        
                        console.log("Decoded and Parsed Data:", jsonData);

                        var arr = jsonData;
                        if (arr) {
                            console.log("================================================",arr)
                            if (arr.length > 0) {
                                $scope.menu_hazop = arr.some(item => item.page_controller === 'hazop');
                                $scope.menu_jsea = arr.some(item => item.page_controller === 'jsea');
                                $scope.menu_whatif = arr.some(item => item.page_controller === 'whatif');
                                $scope.menu_hra = arr.some(item => item.page_controller === 'hra');
                                $scope.menu_bowtie = arr.some(item => item.page_controller === 'bowtie');
                                $scope.menu_report = arr.some(item => item.page_controller === 'report');
                                $scope.menu_master = arr.some(item => item.page_controller === 'master');
            
                                $scopefollowup_page_hazop = arr.some(item => item.page_controller === 'hazop' && item.followup_page === 1);
                                $scopefollowup_page_jsea = arr.some(item => item.page_controller === 'jsea' && item.followup_page === 1);
                                $scopefollowup_page_whatif = arr.some(item => item.page_controller === 'whatif' && item.followup_page === 1);
                                $scopefollowup_page_hra = (arr.some(item => item.page_controller === 'hra' && item.followup_page === 1) ? 1 : 0);
                                $scopefollowup_page_bowtie = arr.some(item => item.page_controller === 'bowtie' && item.followup_page === 1);
                                $scopefollowup_page_report = arr.some(item => item.page_controller === 'report' && item.followup_page === 1);
                                $scopefollowup_page_master = arr.some(item => item.page_controller === 'master' && item.followup_page === 1);
                            }
            
                            apply();
                        }

                    } else {
                        // If it's already an object, log it
                        console.log("Parsed Data:", data);
                    }
                } catch (err) {
                    console.error('Failed to parse JSON:', err);
                    console.error('Received data:', data);
                }

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
    function htmlDecode(input) {
        const doc = new DOMParser().parseFromString(input, 'text/html');
        return doc.documentElement.textContent;
    }

    $scope.selected_menu = function (page) {
      
        var controller_action_befor = 'Home/Portal'; 
        var controller_text = "home";
        var pha_type_doc = 'create'; 
        var pha_sub_software = page.toUpperCase(); 
        var user_name = $scope.user_name; 

        $.ajax({
            url: controller_text + "/next_page",
            data: '{"controller_action_befor":"' + controller_action_befor + '","user_name":"' + user_name + '","pha_type_doc":"' + pha_type_doc + '","pha_sub_software":"' + pha_sub_software + '"}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $scope.token
            },
            xhrFields: {
                withCredentials: true // เปิดการส่ง Cookie ไปพร้อมกับคำขอ
            },
            beforeSend: function () {
                //$("#divLoading").show();
            },
            complete: function () {
                //$("#divLoading").hide();
            },
            success: function (data) {
                var arr = data;
                window.open(data.page, "_top");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status == 500) {
                    alert('Internal error: ' + jqXHR.responseText);
                } else {
                    alert('Unexpected ' + textStatus);
                }
            }

        });

        return true;
    }; 

    $scope.redirect = function(){
        window.location.href = 'http://localhost:4200/'
    }

});