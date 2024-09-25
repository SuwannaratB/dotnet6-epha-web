AppMenuPage.controller("ctrlAppPage", function ($scope, $http, $filter, conFig){
    var url_ws = conFig.service_api_url();
    get_data();

    ///////////////////////////  API Function  ///////////////////////////
    function call_api_load() {
        var user_name = $scope.user_name;
        $.ajax({
            url: url_ws + "masterdata/get_master_group_list", // เปลี่ยน api ใหม่ด้วย
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
                // $scope.data = arr.data;
                $scope.data_def = clone_arr_newrow(arr.data);
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

        $scope.data_all = [];
        $scope.data = [];
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

    $scope.confirmBack = function () {
        window.open("/Master/Index", "_top");
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

    //////////////////////////  Future ///////////////////////////
    function validation(){
        var list = $filter('filter')($scope.data, function (_item) {
            return (!_item.name);
        });

        if(list.length > 0) return false

        return true
    }

    function setDataFilter(){
        // $scope.data.sort((a, b) => b.seq - a.seq);
        $scope.data_filter = $scope.data
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