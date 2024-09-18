
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

    function set_alert(status, msg) {
        alert(status + ":" + msg);
    } 

    function replace_hashKey_arr(_arr) {
        var json = JSON.stringify(_arr, function (key, value) {
            if (key == "$$hashKey") {
                return undefined;
            }
            return value;
        });
        return json;
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

    $("#divLoading").hide();
    $scope.handleLinkClick = function (val) {
        // ทำสิ่งต่าง ๆ เมื่อคลิกลิงก์
        console.log('Link clicked!');
        // คุณสามารถเพิ่มโค้ดอื่น ๆ ที่คุณต้องการทำในฟังก์ชันนี้ได้ 
        $scope.tabChange = val;
    }

    //call ws get data
    if (true) {
        get_data();

        function get_max_id() {
            var arr = $filter('filter')($scope.data_all.max, function (item) {
                return (item.name == 'seq');
            });
            var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
            $scope.MaxSeqData = iMaxSeq;
        }

        function arr_def() {
            $scope.user = JSON.parse(localStorage.getItem('user'));
            $scope.token = JSON.parse(localStorage.getItem('token'))
            $scope.user_name = $scope.user['user_name'];
            $scope.flow_role_type = $scope.user['role_type'];
            // $scope.user_name = conFig.user_name();
            // $scope.flow_role_type = conFig.role_type();//admin,request,responder,approver
            $scope.data_all = [];
            $scope.data = [];
            $scope.data_delete = [];
            //ไม่แน่ใจว่า list เก็บ model เป็น value หรือ text นะ 
            $scope.data_filter = [{ id_key1: 0, id_key2: 0 }]; 
        }

        function get_data() {
            arr_def();
            call_api_load();
        }

        function get_data_after_save() {
            call_api_load();
        }

        function call_api_load() {
            var user_name = $scope.user_name;
            $.ajax({
                url: url_ws + "masterdata/get_master_hazard_type",
                data: '{"user_name":"' + user_name + '"}',
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
                    $scope.data = arr.data;
                    $scope.data_filter = $scope.data;
                    $scope.data_def = clone_arr_newrow(arr.data);
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
    }

    //call ws set data
    if (true) {
        $scope.confirmBack = function () {
            window.open("/Master/Index", "_top");
        }
        // $scope.confirmSave = function () {

        //     var action = "";

        //     save_data();
        // }

        function save_data(action) {
            var user_name = $scope.user_name;
            var flow_role_type = $scope.flow_role_type;
            //save 
            var flow_action = action || 'save'; 
            var json_data = check_data();
            $.ajax({
                url: url_ws + "masterdata/set_master_hazard_type",
                data: '{"user_name":"' + user_name + '"'
                    + ',"role_type":"' + flow_role_type + '"' 
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

    }

    ///////////////////////////  Main Function  ///////////////////////////
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

    $scope.newData = function (item) {
        var seq = $scope.MaxSeqData;
        var newInput = clone_arr_newrow($scope.data_def)[0];
        newInput.seq = seq;
        newInput.id = 0;
        newInput.active_type = 1;
        newInput.name = '';
        newInput.descriptions = '';
        newInput.action_type = 'insert';
        newInput.action_change = 1;
        $scope.data.push(newInput);
        $scope.MaxSeqData = Number($scope.MaxSeqData) + 1
        setDataFilter()
        setPagination()
        $scope.setPage($scope.totalPages)
        newTag(`new-${seq}`)
        apply();
    }

    $scope.removeData = function(item){
        showConfirm(   'Are you sure?',   
            'Do you really want to proceed?', 
            'error',               
            'Yes, Delete',            
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

    $scope.actionChangedData = function (arr, field) {
        arr.action_change = 1;

        if (field == "accept_status") {
            arr.active_type = 0
        } else if (field == "inaccept_status") {
            arr.active_type = 1
        }
        apply();
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
        console.log(arr_json)
        return angular.toJson(arr_json);
    }

    //////////////////////////  Future ///////////////////////////
    function validation(){
        var list = $filter('filter')($scope.data, function (_item) {
            return (!_item.name);
        });
        if(list.length > 0) return false
        return true
    }

    function setDataFilter(){
        $scope.data_filter = $scope.data
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
