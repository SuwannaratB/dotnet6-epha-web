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
        $scope.menu_List = [
            {
                id: 1,
                title: 'Manage User',
                icon: 'fa-solid fa-user-gear',
                active: false,
                sub_menu: [
                    {
                        id: 11,
                        title: 'Manage User (Employee and Contracter)',
                        path: 'Master/ManageUser',
                        active: false,
                    },
                    {
                        id: 12,
                        title: 'Authorization Setting',
                        path: 'Master/AuthorizationSetting',
                        active: false,
                    },
                ]
            },
            {
                id: 2,
                title: 'Systemwide Master Data',
                active: false,
                icon: 'fa-solid fa-sliders',
                sub_menu: [
                    {
                        id: 21,
                        title: 'Company, Department and Sections',
                        path: 'Master/StorageLocation',
                        active: false,
                    },
                    {
                        id: 22,
                        title: 'Area Process Unit',
                        path: 'Master/Area',
                        active: false,
                    },
                    {
                        id: 23,
                        title: 'Complex',
                        path: 'Master/Toc',
                        active: false,
                    },
                    {
                        id: 24,
                        title: 'Unit No/ Name of Area',
                        path: 'Master/BusinessUnit',
                        active: false,
                    },
                ]
            },
            {
                id: 3,
                title: 'HAZOP Module',
                active: false,
                icon: 'fa-solid fa-folder',
                sub_menu: [
                    {
                        id: 31,
                        title: 'Functional Location',
                        path: 'Master/FunctionalLocation',
                        active: false,
                    },
                    {
                        id: 32,
                        title: 'Guide Words',
                        path: 'Master/GuideWords',
                        active: false,
                    },
                ]
            },
            {
                id: 4,
                title: 'HRA Module',
                active: true,
                icon: 'fa-solid fa-folder',
                sub_menu: [
                    {
                        id: 42,
                        title: 'Name of Sub Area : Sections Group',
                        path: 'Master/SubArea',
                        active: false
                    },
                    {
                        id: 43,
                        title: 'Name of Sub Area : Equipment',
                        path: 'Master/SubAreaEquipment',
                        active: false
                    },
                    {
                        id: 44,
                        title: 'Type of Hazard',
                        path: 'Master/HazardType',
                        active: false
                    },
                    {
                        id: 45,
                        title: 'Health Hazard of Risk Factor',
                        path: 'Master/HazardRiskFactors',
                        active: false
                    },
                    // {
                    //     id: 46,
                    //     title: 'Health Effect Rating',
                    //     path: 'Master/HealthEffectRating',
                    //     active: false
                    // },
                    {
                        id: 46,
                        title: 'Work Group',
                        path: 'Master/WorkGroup',
                        active: false
                    },
                    {
                        id: 47,
                        title: 'Set Work Group',
                        path: 'Master/SetWorkGroup',
                        active: false
                    },
                    {
                        id: 48,
                        title: 'Set Worker Group',
                        path: 'Master/SetWorkerGroup',
                        active: false
                    },
                    {
                        id: 49,
                        title: 'Frequency Level',
                        path: 'Master/FrequencyLevel',
                        active: false
                    },
                    {
                        id: 410,
                        title: 'Exposure Rating',
                        path: 'Master/CompareExposureRating',
                        active: false
                    },
                    {
                        id: 411,
                        title: 'Initial Risk Rating',
                        path: 'Master/CompareInitialRiskRating',
                        active: false
                    }                   
                ]
            },
            {
                id: 5,
                title: 'JSEA Module',
                active: false,
                icon: 'fa-solid fa-folder',
                sub_menu: [
                    {
                        id: 51,
                        title: 'Mandatory Note',
                        path: 'Master/Mandatorynote',
                        active: false,
                    },
                    {
                        id: 52,
                        title: 'Task Type',
                        path: 'Master/TaskType',
                        active: false,
                    },
                    {
                        id: 52,
                        title: 'Tag ID',
                        path: 'Master/TagID',
                        active: false,
                    },
                ]
            },
        ]

        if ($scope.role_type == 'admin') {
            $scope.menu_report = true;

        } else {
            $scope.menu_report = false;
        }
        //call api
        var user_name = $scope.user_name;
        var flow_role_type = $scope.role_type;
        $.ajax({
            url: url_ws + "Login/check_authorization_page",
            data: '{"user_name":"' + user_name + '","row_type":"' + flow_role_type + '"}',
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
                                //$scope.menu_hazop = arr.some(item => item.page_controller === 'hazop');
                                //$scope.menu_jsea = arr.some(item => item.page_controller === 'jsea');
                                //$scope.menu_whatif = arr.some(item => item.page_controller === 'whatif');
                                //$scope.menu_hra = arr.some(item => item.page_controller === 'hra');
                                //$scope.menu_bowtie = arr.some(item => item.page_controller === 'bowtie');
                                //$scope.menu_report = arr.some(item => item.page_controller === 'report');
                                //$scope.menu_master = arr.some(item => item.page_controller === 'master');
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
    function htmlDecode(input) {
        const doc = new DOMParser().parseFromString(input, 'text/html');
        return doc.documentElement.textContent;
    }
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

    $scope.changeTabSidebar = function(item){
        $scope.menu_List.forEach(element => {
            if (element.active) {
                element.active = false;
            }
        });
        item.active = true;
    }

    $scope.onClickMenu = function(item){
        window.location.href = item.path
    }

    $scope.onReverse = function(item){
        window.location.href = '/home/portal'
    }
});