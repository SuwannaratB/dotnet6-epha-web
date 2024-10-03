
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

    var url_ws = conFig.service_api_url();

    get_data();

    ///////////////////////////  API Function  ///////////////////////////
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
            headers: {
                'X-CSRF-TOKEN': $scope.token
            },
            xhrFields: {
                withCredentials: true // เปิดการส่ง Cookie ไปพร้อมกับคำขอ
            },
            beforeSend: function () {
                $("#divLoading").show();

            },
            complete: function () {
                $("#divLoading").hide();
            },
            success: function (data) {
                var arr = data;
                if(arr[0].status == 'false') {
                    showAlert('Error', arr[0].status, 'error', function() {
                        apply()
                    });
                    return
                }
                $scope.pha_type_doc = 'update';
                showAlert('Success', 'Data has been successfully saved.', 'success', function() {
                    get_data_after_save();
                    apply();
                });
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

    function call_api_load() {
        var user_name = $scope.user_name;
        var flow_role_type = $scope.flow_role_type;
        $.ajax({
            url: url_ws + "masterdata/get_manageuser",
            data: '{"user_name":"' + user_name + '","row_type":"' + flow_role_type + '"}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $scope.token
            },
            xhrFields: {
                withCredentials: true // เปิดการส่ง Cookie ไปพร้อมกับคำขอ
            },
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
                $scope.data_filter = $scope.data_register;
                $scope.data_register_def = clone_arr_newrow(arr.register_account);
                $scope.employeelist = arr.employee;
                $scope.data_filter_employee = $scope.employeelist;
                $scope.employeelist_def = clone_arr_newrow(arr.employee);
                setPagination()
                setPaginationEmp()
                get_max_id();
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
    }

    function getEmployees(keywords, callback) {
        var user_name = $scope.user_name;
        var flow_role_type = $scope.flow_role_type;
        $.ajax({
            url: url_ws + "Flow/employees_search",
            data: '{"user_filter_text":"' + keywords + '","user_name":"' + user_name + '","row_type":"' + flow_role_type + '"'
                + ',"max_rows":"10"'
                + '}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $scope.token
            },
            xhrFields: {
                withCredentials: true // เปิดการส่ง Cookie ไปพร้อมกับคำขอ
            },
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

    ///////////////////////////  Main Functions  ///////////////////////////

    function get_data() {
        arr_def();
        call_api_load();
    }

    function get_data_after_save() {
        call_api_load();
    }

    function get_max_id() {
        var arr = $filter('filter')($scope.data_all.max, function (item) {
            return (item.name == 'register_account');
        });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqDataRegister = iMaxSeq;
    }

    function arr_def() {
        $scope.user = JSON.parse(localStorage.getItem('user'));
        $scope.token = JSON.parse(localStorage.getItem('token'))
        $scope.user_name = $scope.user['user_name'];
        $scope.flow_role_type = $scope.user['role_type'];
        // $scope.user_name = conFig.user_name();
        // $scope.flow_role_type = conFig.role_type();//admin,request,responder,approver
        $scope.data_all = [];
        $scope.sqe_selected = 0;
        $scope.data_register = [];
        $scope.data_register_delete = [];
        $scope.employeelist = [];
        $scope.employeelist_def = [];
        $scope.employeelist_show = [];
        $scope.exportfile = [{ DownloadPath: '', Name: '' }];
        $scope.filterEmployee = {
            search: ''
        }
    }

    $scope.confirmSave = function () {
        if(!validation()) return showAlert(`Invalid Data`,`The data you entered is invalid. Please check and try again.`, `error`);
        if(!checkPasswordsMatch()) return showAlert(`Passwords do not match`,`Passwords do not match for user. Please check and try again.`, `error`);

        showConfirm('Are you sure?',    
            'Do you really want to proceed?', 
            'info',              
            'Yes, Save',            
            'No',  
            '#3874ff',      
            function() {
                save_data("save");
            }
        );
    }

    $scope.confirmBack = function () {
        window.open("/Master/Index", "_top");
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

    $scope.newData = function (item) {
        var seq = $scope.MaxSeqDataRegister;
        var newInput = clone_arr_newrow($scope.data_register_def)[0];
        newInput.id = seq;
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
        setDataFilter()
        setPagination()
        $scope.setPage($scope.totalPages)
        newTag(`new-${seq}`);
        apply();
        console.log(newInput)
    }

    $scope.removeData = function (item) {
        showConfirm(   'Are you sure?', 
            'Do you really want to proceed?',
            'error',  
            'Yes, Delete', 
            'No',  
            '#d33',      
            function() {
                if(!item) return showAlert('Error', 'Data remove not Found!', 'error');

                var del_item = $filter('filter')($scope.data_register, function (_item) {
                    return (_item.seq == item.seq);
                })[0];

                if(!del_item) return showAlert('Error', 'Data remove not Found!', 'error');
        
                $scope.data_register_delete.push(del_item)

                $scope.data_register = $filter('filter')($scope.data_register, function (_item) {
                    return (_item.seq != del_item.seq);
                });

                showAlert('Success', 'Data has been successfully Deleted.', 'success', function() {
                    setDataFilter()
                    setPagination()
                    apply();
                });
            }
        );
        
    }

    $scope.actionChangedData = function (arr, field) {
        arr.action_change = 1;
        if (field == "accept_status") {
            arr.accept_status = 0
        } else if (field == "inaccept_status") {
            arr.accept_status = 1
        }
        console.log(arr)
        apply();
    }

    $scope.fillterDataEmployeeAdd = function () {
        $scope.data_filter_employee = $scope.employeelist

        if (!$scope.filterEmployee.search) return setPaginationEmp()
            
        var searchText = $scope.filterEmployee.search;

        $scope.data_filter_employee = $filter('filter')($scope.data_filter_employee, function (_item) {
            return _item.employee_displayname.toLowerCase().includes(searchText.toLowerCase());
        });

        setPaginationEmp()
    };

    //////////////////////////  Future ///////////////////////////
    function validation(){
        var list = $filter('filter')($scope.data_register, function (_item) {
            return (!_item.user_name || !_item.user_displayname || !_item.user_email || !_item.user_password || !_item.user_password_confirm);
        });
        if(list.length > 0) return false
        return true
    }

    function checkPasswordsMatch(){
        var list = $filter('filter')($scope.data_register, function (_item) {
            return (_item.user_password != _item.user_password_confirm);
        });
        if(list.length > 0) return false
        return true
    }

    function setDataFilter(){
        $scope.data_filter = $scope.data_register
    }

    function newTag(id_elemet){
        setTimeout(() => {
            var element = document.getElementById(id_elemet);
            element.classList.remove("hidden");
        }, 10);
    }

    ///////////////////////////  Pagination  ///////////////////////////
    function setPagination(){
        // Pagination settings
        $scope.pageSize = 8; // จำนวนข้อมูลต่อหน้า
        $scope.currentPage = 1; // หน้าปัจจุบัน
        $scope.totalPages = Math.ceil($scope.data_filter.length / $scope.pageSize); // จำนวนหน้าทั้งหมด
        // สร้างลิสต์ของตัวเลขหน้า
        $scope.pages = Array.from({ length: $scope.totalPages }, (v, k) => k + 1);
        $scope.paginate()
    }

    // ฟังก์ชันสำหรับจัดข้อมูลตามหน้า
    $scope.paginate = function() {
        const start = ($scope.currentPage - 1) * $scope.pageSize;
        const end = start + $scope.pageSize;
        $scope.paginatedData = $scope.data_filter.slice(start, end);
    };

    // ฟังก์ชันสำหรับเปลี่ยนหน้า
    $scope.setPage = function(page) {
        $scope.currentPage = page;
        $scope.paginate();
    };

    // ฟังก์ชันสำหรับไปหน้าก่อนหน้า
    $scope.prevPage = function() {
        if ($scope.currentPage > 1) {
        $scope.currentPage--;
        $scope.paginate();
        }
    };

    // ฟังก์ชันสำหรับไปหน้าถัดไป
    $scope.nextPage = function() {
        if ($scope.currentPage < $scope.totalPages) {
        $scope.currentPage++;
        $scope.paginate();
        }
    };
    ///////////////////////////  Pagination Employee  ///////////////////////////
    function setPaginationEmp(){
        // Pagination settings
        $scope.pageSizeEmp = 8; // จำนวนข้อมูลต่อหน้า
        $scope.currentPageEmp = 1; // หน้าปัจจุบัน
        $scope.totalPagesEmp = Math.ceil($scope.data_filter_employee.length / $scope.pageSizeEmp); // จำนวนหน้าทั้งหมด
        // สร้างลิสต์ของตัวเลขหน้า
        $scope.pagesEmp = Array.from({ length: $scope.totalPagesEmp }, (v, k) => k + 1);
        $scope.paginateEmp()
    }

    // ฟังก์ชันสำหรับจัดข้อมูลตามหน้า
    $scope.paginateEmp = function() {
        const start = ($scope.currentPageEmp - 1) * $scope.pageSizeEmp;
        const end = start + $scope.pageSizeEmp;
        $scope.paginatedDataEmp = $scope.data_filter_employee.slice(start, end);
        console.log($scope.data_filter_employee)
    };

    // ฟังก์ชันสำหรับเปลี่ยนหน้า
    $scope.setPageEmp = function(page) {
        $scope.currentPageEmp = page;
        $scope.paginate();
    };

    // ฟังก์ชันสำหรับไปหน้าก่อนหน้า
    $scope.prevPageEmp = function() {
        if ($scope.currentPageEmp > 1) {
        $scope.currentPageEmp--;
        $scope.paginateEmp();
        }
    };

    // ฟังก์ชันสำหรับไปหน้าถัดไป
    $scope.nextPageEmp = function() {
        if ($scope.currentPageEmp < $scope.totalPagesEmp) {
        $scope.currentPageEmp++;
        $scope.paginateEmp();
        }
    };

    //////////////////////////  Alert ///////////////////////////
    function showAlert(title, text, icon, callback) {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            showConfirmButton: false, // ซ่อนปุ่มยืนยัน
            timer: 3000, // ตั้งเวลาให้ปิดเองหลังจาก 3 วินาที
            timerProgressBar: true, // แสดง progress bar
        }).then((result) => {
            if (typeof callback === 'function') {
                callback();
            }
        });
    }
    
    function showConfirm(title, text, icon, 
        confirmButtonText = 'OK', 
        cancelButtonText = 'Cancel', 
        confirmButtonColor, 
        callback) {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            showConfirmButton: true, // Show the confirm button
            showCancelButton: true, // Show the cancel button
            confirmButtonText: confirmButtonText, // Custom text for the confirm button
            cancelButtonText: cancelButtonText, // Custom text for the cancel button
            timer: null, // Do not auto-close
            timerProgressBar: false, // Disable progress bar
            confirmButtonColor: confirmButtonColor,
        }).then((result) => {
            // Check if the user clicked the confirm button
            if (result.isConfirmed && typeof callback === 'function') {
                callback();
            }
        });
    }

});
