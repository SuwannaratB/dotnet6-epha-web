AppMenuPage.controller("ctrlAppPage", function ($scope, $http, $filter, conFig){
    var url_ws = conFig.service_api_url();
    get_data();

    ///////////////////////////  API Function  ///////////////////////////
    function call_api_load() {
        var user_name = $scope.user_name;
        var flow_role_type = $scope.flow_role_type;
        $.ajax({
            url: url_ws + "masterdata/get_master_worker_list", // เปลี่ยน api ใหม่ด้วย
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
                // general
                $scope.data_all = arr;
                $scope.data = arr.data;
                $scope.data_def = clone_arr_newrow(arr.data);
                // master
                $scope.data_worker_group = $filter('filter')(arr.worker_group, item => item.id);
                // var
                $scope.selected['work_group'] = $scope.data_worker_group[0].id;
                // function
                setDataFilter()
                setPagination()
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

    function save_data(action) {
        var user_name = $scope.user_name;
        var flow_role_type = $scope.flow_role_type;
        //save 
        var flow_action = action || 'save'; 
        var json_data = check_data();
        $.ajax({
            url: url_ws + "masterdata/set_master_worker_list",
            data: '{"user_name":"' + user_name + '"'
                + ',"role_type":"' + flow_role_type + '"'
                + ',"page_name":"worker_group"'
                + ',"json_data": ' + JSON.stringify(json_data)
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
                    call_api_load();
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

    function getEmployees( indicator, callback){
        var user_name = $scope.user_name;
        $.ajax({
            url: url_ws + "Flow/employees_search",
            data: '{"user_indicator":"' + indicator + '",'
            + '"max_rows":"50"}',           
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

    function arr_def() {
        $scope.user = JSON.parse(localStorage.getItem('user'));
        $scope.token = JSON.parse(localStorage.getItem('token'))
        $scope.user_name = $scope.user['user_name'];
        $scope.flow_role_type = $scope.user['role_type'];
        // general
        $scope.data_delete = [];
        $scope.data_all = [];
        $scope.data = [];
        // master
        $scope.data_worker_group = [];
        // var
        $scope.selected = {
            search_emp: null,
            work_group: null,
            addEmployee: null,
        }
        // paginations
        $scope.currentPage = 1;
        $scope.itemsPerPage = 10; // Set the desired number of items per page
    }

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

    function get_max_id() {
        var arr = $filter('filter')($scope.data_all.max, function (item) {
            return (item.name == 'seq');
        });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqData = iMaxSeq;
    }

    function apply() {
        try {
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        } catch { }
    };

    $scope.confirmSave = function () {
        if(!validation()) {
            return showAlert(`Invalid Data`,`The data you entered is invalid. Please check and try again.`, `error`);
         } 
 
         showConfirm(   'Are you sure?',    
             'Do you really want to proceed?', 
             'info',              
             'Yes, Save',            
             'No',  
             '#3874ff',      
             function() {
                 save_data();
             }
         );
    }

    $scope.confirmBack = function () {
        window.open("/Master/Index", "_top");
    }

    $scope.newData = function (item) {
        var seq = Number($scope.MaxSeqData);
        var newInput = clone_arr_newrow($scope.data_def)[0];
        newInput.seq = seq;
        newInput.id = seq;
        newInput.no = seq;
        newInput.active_type = 1;
        newInput.disable_page = 0;
        newInput.action_type = 'insert';
        newInput.action_change = 1;
        newInput.id_worker_group = $scope.selected['work_group'];
        $scope.data.push(newInput);
        $scope.MaxSeqData = Number($scope.MaxSeqData) + 1
        setDataFilter()
        setPagination()
        $scope.setPage($scope.totalPages)
        newTag(`new-${seq}`)
        apply();
    }

    $scope.actionChangedData = function (arr, field) {
        arr.action_change = 1;
        if (field == "accept_status") {
            arr.active_type = 0
        } else if (field == "inaccept_status") {
            arr.active_type = 1
        }
        console.log(arr)
        apply();
    }

    $scope.actionfilter = function(type, data){
        // var data_section = $filter('filter')($scope.data_sections_def, function (item) {
        //     return (item.departments == data);
        // });
        // $scope.selectOption['sections'] = data_section[0].id
        console.log($scope.selected.work_group)
        setDataFilter();
        setPagination();
    }

    function check_data() {
        var arr_active = [];
        angular.copy($scope.data, arr_active);
        var arr_json = $filter('filter')(arr_active, function (item) {
            return ((item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert');
        });

        for (var i = 0; i < $scope.data_delete.length; i++) {
            $scope.data_delete[i].action_type = 'delete';
            arr_json.push($scope.data_delete[i]);
        }
        return angular.toJson(arr_json);
    }

    $scope.removeData = function(item){
        showConfirm(   'Are you sure?',             // Title
            'Do you really want to proceed?', // Text
            'error',                   // Icon (e.g., 'success', 'error', 'warning')
            'Yes, Delete',              // Custom text for the confirm button
            'No',  
            '#d33',      
            function() {
                if(!item) return showAlert('Error', 'Data remove not Found!', 'error');

                var del_item = $filter('filter')($scope.data, function (_item) {
                    return (_item.seq == item.seq);
                })[0];
        
                if(!del_item) return showAlert('Error', 'Data remove not Found!', 'error');
        
                $scope.data_delete.push(del_item)

                $scope.data = $filter('filter')($scope.data, function (_item) {
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

    $scope.choosDataEmployee = function(item){
        const data = $filter('filter')($scope.data, function (_item) {
            return (_item.seq == $scope.selected['addEmployee'].seq);
        })[0];

        data.user_displayname = item.employee_displayname
        data.user_name = item.employee_name
        data.id_worker_group = $scope.selected['work_group']
        data.action_change = 1
    }

    $scope.removeDataEmployee = function(){
        const data = $filter('filter')($scope.data, function (_item) {
            return (_item.seq == $scope.selected['addEmployee'].seq);
        })[0];
        data.user_displayname = null
        data.user_name = null
        data.action_change = 1
        $scope.selected['addEmployee'] = null
    }

    $scope.openModalEmployeeAdd = function(item){
        $scope.selected['addEmployee'] = item
        $('#modalEmployeeAdd').modal({
            backdrop: 'static',
            keyboard: false 
        }).modal('show');
    }

    $scope.fillterDataEmployeeAdd = function(){
        if($scope.selected['search_emp'].length < 3) return $scope.employeelist_show = []

        getEmployees($scope.selected['search_emp'], function(data) {
            data.employee.forEach(function(employee) {
                employee.isAdded = false; 
            });
    
            $scope.employeelist_page = data.employee;
            $scope.totalItems = $scope.employeelist_page.length; // Update totalItems
            $scope.employeelist_show = $scope.getPaginatedItems();
            // Calculate total pages
            $scope.totalPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
            apply();
            $('#modalEmployeeAdd').modal({
                backdrop: 'static',
                keyboard: false 
            })
        })
    }

    // ฟังเหตุการณ์เมื่อโมดัลถูกปิด
    $('#modalEmployeeAdd').on('hidden.bs.modal', function() {
        $scope.$apply(function() {
            $scope.selected['search_emp'] = null;
            $scope.selected['addEmployee'] = null;
            $scope.employeelist_show = [];
        });
    });

    $scope.getPaginatedItems = function() {
        var begin = ($scope.currentPage - 1) * $scope.itemsPerPage;
        var end = begin + $scope.itemsPerPage;
        $scope.loadingData = true; 
        setTimeout(function() {
            $scope.loadingData = false;
            $scope.$apply(); 
        }, 2000);
        var paginatedItems = $scope.employeelist_page.slice(begin, end);
        return paginatedItems;
    };

    $scope.setPageModal = function(page) {
        $scope.currentPage = page;
        $scope.employeelist_show = $scope.getPaginatedItems();
    };

    $scope.action_changepage = function(action) {
        switch (action) {
            case 'prevPage':
                if ($scope.currentPage > 1) {
                    $scope.setPageModal($scope.currentPage - 1);
                }
                break;
            case 'nextPage':
                if ($scope.currentPage < $scope.totalPages) {
                    $scope.setPageModal($scope.currentPage + 1);
                }
                break;
        }
    };

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

    //////////////////////////  Future ///////////////////////////
    function validation(){
        var list = $filter('filter')($scope.data, function (_item) {
            return (!_item.user_displayname || !_item.user_name || !_item.id_worker_group);
        });

        if(list.length > 0) return false

        return true
    }

    function setDataFilter(){
        // $scope.data.sort((a, b) => b.seq - a.seq);
        $scope.data_filter = $filter('filter')($scope.data, item =>
            item.id_worker_group == $scope.selected['work_group']
       )
    }

    function newTag(id_elemet){
        setTimeout(() => {
            var element = document.getElementById(id_elemet);
            element.classList.remove("hidden");
        }, 10);
    }

    function validationNumber(data, field) {
        const cleanedValue = data[field].replace(/[^0-9]/g, '');
        if (cleanedValue === '') {
            data[field] = null;
        } else {
            data[field] = cleanedValue;
        }
    }

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
} )