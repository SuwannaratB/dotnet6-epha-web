
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
        get_data(true);
        function get_max_id() {
            var arr = $filter('filter')($scope.data_all.max, function (item) {
                return (item.name == 'seq');
            });
            var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
            $scope.MaxSeqData = iMaxSeq;

        }
        
        function arr_def() {
            $scope.user_name = conFig.user_name();
            $scope.flow_role_type = conFig.role_type();//admin,request,responder,approver

            $scope.data_all = [];

            $scope.data = [];
            $scope.data_delete = [];

            $scope.data_departments = [];
            $scope.data_sections = [];
            $scope.data_toc = [];

            //ไม่แน่ใจว่า list เก็บ model เป็น value หรือ text นะ 
            $scope.data_filter = [{ id_key1: 0, id_key2: 0 }];

            $scope.area_selected = [0];
            $scope.plant_selected = [0];
            $scope.toc_selected = [0];

            $scope.selected = {
                hazard_type: ''
            };
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
                url: url_ws + "masterdata/get_master_hazard_riskfactors",
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

                    $scope.data = arr.data;
                    $scope.data_def = clone_arr_newrow(arr.data);
                    $scope.data_hazard_type = JSON.parse(replace_hashKey_arr(arr.hazard_type));
                    // $scope.hazard_type_selected = [arr.hazard_type[0].id]; 
                    setPagination()

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
         
        $scope.addData = function (item) {

            //add new  
            var id_sections_group = item.id_sections_group;
            var seq = $scope.MaxSeqData;

            var newInput = clone_arr_newrow($scope.data_def)[0];
            newInput.seq = seq;
            newInput.id = 0;
            newInput.active_type = 1;

            newInput.id_hazard_type = $scope.selected['hazard_type']; 
            // newInput.id_hazard_type = $scope.hazard_type_selected[0]; 
            newInput.health_hazards = '';
            newInput.hazards_rating = '';
            newInput.standard_type_text = '';
            newInput.standard_value = '';
            newInput.standard_unit = '';
            newInput.standard_desc = '';
      
            newInput.action_type = 'insert';
            newInput.action_change = 1;

            $scope.data.push(newInput);

            $scope.MaxSeqData = Number($scope.MaxSeqData) + 1
            apply();
        }
        
        $scope.removeData = function (seq, index) {
            var arrdelete = $filter('filter')($scope.data, function (item) {
                return (item.seq == seq);
            });

            if (arrdelete.length > 0) { $scope.data_delete.push(arrdelete[0]); }

            $scope.data = $filter('filter')($scope.data, function (item) {
                return (item.seq != arrdelete[0].seq);
            });
            if ($scope.data.length == 0) {
                $scope.addData();
                return;
            }
            apply();

        };
        $scope.actionChangeGroupSubArea = function (arr, field) {
            arr.action_change = 1;

            if (field == "accept_status") {
                arr.active_type = 0
            } else if (field == "inaccept_status") {
                arr.active_type = 1
            }
            apply();
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

        $scope.actionChangedMaster = function (field) {
            console.log(field)
            if (field == 'hazard_type') {
                console.log($scope.selected['hazard_type'])
            }

            //if (field == "plant") {
            //    $scope.plant_selected = [arr.plant[0].id];
            //}
            //if (field == "area") {
            //    $scope.area_selected = [arr.area[0].id];
            //} 
        }

        $scope.newData = function(){
            const row = document.getElementById('row-' + 20);
            if (row) {
                row.scrollIntoView({ behavior: 'smooth', block: 'end' });
                // เพิ่ม margin-top ให้กับ .table-container
                // const container = document.querySelector('.table-container');
                // if (container) {
                //     container.style.marginTop = '175px'; 
                //     console.log(container)
                // }
            }
           
        }


    }

    //call ws set data
    if (true) {
        $scope.confirmBack = function () {
            window.open("/Master/Index", "_top");
        }
        $scope.confirmSave = function () {

            var action = "";

            save_data();
        }
        function save_data(action) {

            var user_name = $scope.user_name;
            var flow_role_type = $scope.flow_role_type;

            //save 
            var flow_action = action || 'save';

            var json_data = check_data();

            $.ajax({
                url: url_ws + "masterdata/set_master_hazard_riskfactors",
                data: '{"user_name":"' + user_name + '"'
                    + ',"role_type":"' + flow_role_type + '"'
                    + ',"json_data": ' + JSON.stringify(json_data)
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
    }

    function setPagination(){
        // Pagination settings
        $scope.pageSize = 10; // จำนวนข้อมูลต่อหน้า
        $scope.currentPage = 1; // หน้าปัจจุบัน
        $scope.totalPages = Math.ceil($scope.data.length / $scope.pageSize); // จำนวนหน้าทั้งหมด

        // สร้างลิสต์ของตัวเลขหน้า
        $scope.pages = Array.from({ length: $scope.totalPages }, (v, k) => k + 1);
        $scope.paginate()

    }

    // ฟังก์ชันสำหรับจัดข้อมูลตามหน้า
    $scope.paginate = function() {
        const start = ($scope.currentPage - 1) * $scope.pageSize;
        const end = start + $scope.pageSize;
        $scope.paginatedData = $scope.data.slice(start, end);
        console.log( $scope.paginatedData)
        console.log( $scope.data)
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

});
