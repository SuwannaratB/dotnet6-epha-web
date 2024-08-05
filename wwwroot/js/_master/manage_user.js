
AppMenuPage.filter('MultiFieldFilter', function () {
    return function (items, searchText) {
        if (!searchText) {
            return items;
        }

        searchText = searchText.toLowerCase();

        return items.filter(function (item) {
            return (
                item.document_number.toLowerCase().includes(searchText.toLowerCase()))

        });
    };
});
AppMenuPage.controller("ctrlAppPage", function ($scope, $http, $filter, conFig) {

    //  scroll  table header freezer 
    $scope.handleScroll = function () {
        const tableContainer = angular.element(document.querySelector('#table-container'));
        const thead = angular.element(document.querySelector('thead'));

        if (tableContainer && thead) {
            const containerRect = tableContainer[0].getBoundingClientRect();
            const containerTop = containerRect.top;
            const containerBottom = containerRect.bottom;

            const tableRect = thead[0].getBoundingClientRect();
            const tableTop = tableRect.top;
            const tableBottom = tableRect.bottom;

            if (containerTop > tableTop || containerBottom < tableBottom) {
                thead.addClass('sticky');
            } else {
                thead.removeClass('sticky');
            }
        }
    };

    var url_ws = conFig.service_api_url();

    function apply() {
        try {
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        } catch { }
    };
    function clone_arr_newrow(arr_items) {
        var arr_clone = []; var arr_clone_def = [];
        try {
            angular.copy(arr_items, arr_clone_def);

            if (arr_clone_def.length > 0) {
                arr_clone_def = arr_clone_def.map(function (item) {
                    var newObj = {};
                    for (var key in item) {
                        newObj[key] = null;
                    }
                    return newObj;

                });
                arr_clone.push(arr_clone_def[0]);
            } else { arr_clone = arr_clone_def; }

        } catch { }
        return arr_clone;
    }

    //$("#divLoading").hide();
    $scope.handleLinkClick = function (val) {
        // ทำสิ่งต่าง ๆ เมื่อคลิกลิงก์
        console.log('Link clicked!');
        // คุณสามารถเพิ่มโค้ดอื่น ๆ ที่คุณต้องการทำในฟังก์ชันนี้ได้ 
        $scope.tabChange = val;
    }


    function set_alert(status, msg) {
        alert(status + ":" + msg);
    }

    //call ws get data
    if (true) {
        get_data(true);
        function get_max_id() {
            var arr = $filter('filter')($scope.data_all.max, function (item) {
                return (item.name == 'register_account');
            });
            var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
            $scope.MaxSeqDataRegister = iMaxSeq;


        }
        function arr_def() {

            $scope.user_name = conFig.user_name();
            $scope.flow_role_type = conFig.role_type();//admin,request,responder,approver

            $scope.data_all = [];
            $scope.sqe_selected = 0;

            $scope.data_register = [];
            $scope.data_register_delete = [];

            $scope.employeelist = [];
            $scope.employeelist_def = [];
            $scope.employeelist_show = [];

            $scope.exportfile = [{ DownloadPath: '', Name: '' }];
        }
        function get_data(page_load) {
            arr_def();

            var user_name = conFig.user_name();
            call_api_load(page_load, user_name);
        }
        function get_data_after_save(page_load) {
            var user_name = conFig.user_name();
            call_api_load(false, user_name);
        }

        function call_api_load(page_load) {
            var user_name = $scope.user_name;

            $.ajax({
                url: url_ws + "masterdata/get_manageuser",
                data: '{"user_name":"' + user_name + '"}',
                type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
                beforeSend: function () {
                    $("#divLoading").show();
                },
                complete: function () {
                    $("#divLoading").hide();
                },
                success: function (data) {
                    var arr = data;

                    $scope.data_all = arr;
                    $scope.data_register = arr.register_account;
                    $scope.data_register_def = clone_arr_newrow(arr.register_account);

                    $scope.employeelist = arr.employee;
                    $scope.employeelist_def = clone_arr_newrow(arr.employee);

                    get_max_id();

                    apply();

                    console.log($scope);

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status == 500) {
                        alert('Internal error: ' + jqXHR.responseText);
                    } else {
                        alert('Unexpected ' + textStatus);
                    }
                }

            });

        }
        $scope.addDataEmployee = function (item) {

            //add new employee 
            var seq = $scope.MaxSeqDataRegister;

            var newInput = clone_arr_newrow($scope.data_register_def)[0];
            newInput.seq = seq;
            newInput.register_type = 0;
            newInput.accept_status = 1;
            newInput.user_name = '';
            newInput.user_displayname = '';
            newInput.user_email = '';
            newInput.user_password = '';
            newInput.user_password_confirm = '';

            newInput.action_type = 'insert';
            newInput.action_change = 1;

            $scope.data_register.push(newInput);

            $scope.MaxSeqDataRegister = Number($scope.MaxSeqDataRegister) + 1
            apply();
        }
        
        $scope.removeDataEmployee = function (seq, index) {
                // Show the confirmation dialog
                Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!"
                
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Perform the deletion if confirmed
                        var arrdelete = $filter('filter')($scope.data_register, function (item) {
                            return item.seq == seq;
                        });
        
                        if (arrdelete.length > 0) { 
                            $scope.data_register_delete.push(arrdelete[0]); 
                        }

                        $scope.data_register = $filter('filter')($scope.data_register, function (item) {
                            return item.seq != arrdelete[0].seq;
                        });
                        if ($scope.data_register.length == 0) {
                            $scope.addDataEmployee();
                            return;
                        }
                        
                        $scope.$apply(); 
                        
                        // Show success message
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success",
                            timer: 1000,
                            showConfirmButton: false
                        });
                    }
                });
        }

        $scope.actionChangedData = function (arr, field) {
            arr.action_change = 1;
            if(!arr.user_password || !arr.user_password_confirm && !(arr.user_password == arr.user_password_confirm)) {
                
                alert('Passwords do not match.');
            }
            apply();
        }
    }

    if (true) {
        $scope.fillterDataEmployeeAdd = function () {
            $scope.employeelist_show = [];
            var searchText = $scope.searchText;
            if (!searchText) { return; }

            var items = angular.copy($scope.employeelist_def, items);
            if (searchText.length < 3) { return items; }

            getEmployees(searchText, function (data) {
                $scope.employeelist_show = data.employee
                apply();
            });
        };
        function getEmployees(keywords, callback) {
            $.ajax({
                url: url_ws + "Flow/employees_search",
                data: '{"user_filter_text":"' + keywords + '"'
                    + ',"max_rows":"10"'
                    + '}',
                type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
                beforeSend: function () {
                    $("#divLoading").show();
                },
                complete: function () {
                    $("#divLoading").hide();
                },
                success: function (data) {
                    callback(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status == 500) {
                        alert('Internal error: ' + jqXHR.responseText);
                    } else {
                        alert('Unexpected ' + textStatus);
                    }
                }

            });
        }
    }

    //call ws set data
    if (true) {
        $scope.confirmBack = function () {
            window.open("/Master/Index", "_top");
        }
        $scope.confirmSave = function () {

            var arr = $scope.data_register;
            var passwordsMatch = true;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].user_password !== arr[i].user_password_confirm) {
                    passwordsMatch = false;
                    alert('Passwords do not match for user: ' + arr[i].username);
                    break;
                }
            }

            save_data("save");
        }
        function save_data(action) {

            var user_name = $scope.user_name;
            var role_type = $scope.flow_role_type;

            //save 
            var flow_action = action || 'save';

            var json_register = check_data_register();

            $.ajax({
                url: url_ws + "masterdata/set_manageuser",
                data: '{"user_name":"' + user_name + '"'
                    + ',"role_type":"' + role_type + '"'
                    + ',"json_register_account": ' + JSON.stringify(json_register)
                    + '}',
                type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
                beforeSend: function () {
                    $("#divLoading").show();

                },
                complete: function () {
                    $("#divLoading").hide();
                },
                success: function (data) {
                    var arr = data;
                    console.log(arr);

                    if (arr[0].status == 'true') {
                        $scope.pha_type_doc = 'update';

                        if (action == 'save') {
                            get_data_after_save(false);

                            set_alert('Success', 'Data has been successfully saved.');
                            apply();
                        }
                    }
                    else {
                        set_alert('Error', arr[0].status);
                        apply();
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

        }
        function check_data_register() {

            var arr_active = [];
            angular.copy($scope.data_register, arr_active);
            var arr_json = $filter('filter')(arr_active, function (item) {
                return ((item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert');
            });

            for (var i = 0; i < $scope.data_register_delete.length; i++) {
                $scope.data_register_delete[i].action_type = 'delete';
                arr_json.push($scope.data_register_delete[i]);
            }
            return angular.toJson(arr_json);
        }

    }


});
