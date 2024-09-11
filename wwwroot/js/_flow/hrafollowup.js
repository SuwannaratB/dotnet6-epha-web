
AppMenuPage.controller("ctrlAppPage", function ($scope, $http, $filter, conFig) {
    $('#divLoading').hide();

    $scope.showConfirmDialog = function (item) {

        if ($scope.flow_status == 13) {
            if (item.action_status !== 'Open') {
                if (item.document_file_name == '') {

                    alert("Please select a document file");

                }
                var result = confirm("Do you want to update and close the item?");
                if (result) {

                    item.action_change = 1;
                    $scope.confirmSaveFollowup('update', item);
                }
            } else {
                item.action_change = 1;
                $scope.confirmSaveFollowup('save', item);
            }
        } else if ($scope.flow_status == 14) {

            item.action_change = 1;
            $scope.confirmSaveReviewFollowup('save', item);

        }

    };
    $scope.showConfirmDialogSubmit = function (item) {

        var arr = $filter('filter')($scope.data_details, function (item) {
            return (item.action_status == 'Open');
        });
        if (arr.length > 0) {

        }

        var result = confirm("Do you want to update and close the item?");
        if (result) {

            $scope.confirmSaveReviewFollowup('update', item);
        }

    };

    //  add file 
    $scope.clearFileName = function (inputId) {

        var fileUpload = document.getElementById('attfile-' + inputId);
        var fileNameDisplay = document.getElementById('filename' + inputId);
        var del = document.getElementById('del-' + inputId);
        fileUpload.value = ''; // ล้างค่าใน input file
        fileNameDisplay.textContent = ''; // ล้างข้อความที่แสดงชื่อไฟล์
        del.style.display = "none";
    };

    $scope.fileSelect = function (input) {
        const fileInput = input;
        const fileSeq = fileInput.id.split('-')[1];
        const fileInfoSpan = document.getElementById('filename' + fileSeq);

        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const fileName = file.name;
            const fileSize = Math.round(file.size / 1024);
            fileInfoSpan.textContent = `${fileName} (${fileSize} KB)`;

            var file_path = uploadFile(file, fileSeq, fileName, fileSize);

        } else {
            fileInfoSpan.textContent = "";
        }
    }
    function uploadFile(file_obj, seq, file_name, file_size) {

        var fd = new FormData();
        //Take the first selected file
        fd.append("file_obj", file_obj);
        fd.append("file_seq", seq);
        fd.append("file_name", file_name);


        // JavaScript file-like object

        try {
            const request = new XMLHttpRequest();
            request.open("POST", url_ws + 'Flow/uploadfile_data_followup');
            request.send(fd);

            var arr = $filter('filter')($scope.data_details, function (item) { return (item.seq == seq); });
            if (arr.length > 0) {
                arr[0].document_file_name = file_name;
                arr[0].document_file_size = file_size;
                arr[0].document_file_path = url_ws + 'AttachedFileTemp/FollowUp/' + file_name;
                arr[0].action_change = 1;
                apply();
            }
        } catch { }

    }

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

    function replace_hashKey_arr(_arr) {
        var json = JSON.stringify(_arr, function (key, value) {
            if (key == "$$hashKey") {
                return undefined;
            }
            return value;
        });
        return json;
    }

    $("#divLoading").hide();
    page_load();
    $scope.handleLinkClick = function (val) {
        // ทำสิ่งต่าง ๆ เมื่อคลิกลิงก์
        console.log('Link clicked!');
        // คุณสามารถเพิ่มโค้ดอื่น ๆ ที่คุณต้องการทำในฟังก์ชันนี้ได้

        $scope.tabChange = val;

    }

    function arr_def() {  
        //alert(conFig.controller_action_befor());
        $scope.user = JSON.parse(localStorage.getItem('user'));
        $scope.token = JSON.parse(localStorage.getItem('token'))
        $scope.user_name = $scope.user['user_name'];
        // $scope.user_name = conFig.user_name();

        $scope.selectViewTypeFollowup = true;
        $scope.action_part = 1;

        $scope.data_all = [];

        $scope.master_apu = [];
        $scope.master_bussiness_unit = [];
        $scope.master_unit_no = [];
        $scope.master_functional = [];


        $scope.data_header = [];
        $scope.data_header_all = [];
        $scope.data_general = [];
        $scope.data_approver = [];

        $scope.select_history_tracking_record = false;
        $scope.selectedDataRamType = null;


        $scope.employeelist = [];

        // ล้างช่องข้อมูลหลังจากเพิ่มข้อความ
        $scope.employee_id = '';
        $scope.employee_name = '';
        $scope.employee_displayname = '';
        $scope.employee_email = '';
        $scope.employee_type = 'Contract';
        $scope.employee_img = 'assets/img/team/avatar.webp'

        $scope.searchdata = '';
        $scope.searchEmployee = '';

        $scope.tabChange = 'worksheet';
        $scope.tabUpdateFollowUp = false;

        $scope.flow_role_type = conFig.role_type();//admin,request,responder,approver
        $scope.flow_status = 0;

        //alert($scope.flow_role_type);
    }
    function page_load() {
        arr_def();
        get_data(true);
    }
    function get_data(page_load) {
        var user_name = $scope.user_name;
        var token_doc = '';

        if (conFig.pha_seq() != '') {
            $scope.tabUpdateFollowUp = true;
            $scope.searchBySeq = true;

            token_doc = conFig.pha_seq();
        }
        var sub_software = 'hra';
        var type_doc = 'search';

        $.ajax({
            url: url_ws + "Flow/load_follow_up",
            data: '{"sub_software":"' + sub_software +'","user_name":"' + user_name + '","token_doc":"' + token_doc + '","type_doc":"' + type_doc + '"}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
            headers: {
                'Authorization': $scope.token 
            },
            beforeSend: function () {
                $("#divLoading").show();
            },
            complete: function () {
                $("#divLoading").hide();
            },
            success: function (data) {
                var arr = data;

                // Check if the array has at least one element and the status is not 'true'
                if (arr.length > 0 && arr[0].status && arr[0].status.toString() !== 'true') {

                    console.error('Status is not true. Potential issue detected:', arr[0].remark || 'No remark provided');

                    $scope.confirmCreate();
                } 

                if (page_load) {

                    $scope.data_all = arr;
                    // $scope.master_company = JSON.parse(replace_hashKey_arr(arr.company));
                    // $scope.master_apu = JSON.parse(replace_hashKey_arr(arr.apu));   
                    // $scope.master_toc = JSON.parse(replace_hashKey_arr(arr.toc));  
                    // $scope.master_unit_no = JSON.parse(replace_hashKey_arr(arr.unit_no));  
                    // $scope.master_tagid = JSON.parse(replace_hashKey_arr(arr.tagid));  
                    // $scope.master_tagid_audition = JSON.parse(replace_hashKey_arr(arr.tagid_audition));  //ใช้ใน tag id audition 
                    // $scope.master_approver = JSON.parse(replace_hashKey_arr(arr.employee)); 

                    // $scope.employeelist = JSON.parse(replace_hashKey_arr(arr.employee)); 

                    $scope.master_ram = arr.ram;
                    $scope.master_ram_level = arr.ram_level;
                    $scope.master_ram_color = arr.ram_color;
                    $scope.master_ram_priority = [{ id: 1, name: 'H' }, { id: 2, name: 'M' }, { id: 3, name: 'L' }, { id: 4, name: 'N' }, { id: 5, name: 'N/A' }];
                    $scope.master_ram_criterion = [{ id: 'N', name: 'N' }, { id: 'Y', name: 'Y' }];
                    $scope.master_security_level = arr.security_level;
                    $scope.master_likelihood_level = arr.likelihood_level;
                    $scope.master_no = [{ id: 4, name: 4 }, { id: 5, name: 5 }, { id: 6, name: 6 }, { id: 7, name: 7 }, { id: 8, name: 8 }, { id: 9, name: 9 }, { id: 10, name: 10 }];
                    $scope.ram_rows_level = 4;
                    $scope.ram_columns_level = 4;
                    $scope.master_approver_type = [{
                        id: 'AE', name: 'AE'
                    }, {
                        id: 'AGSI', name: 'AGSI'
                    }];
                     
                }

                var iNoNew = 1;
                for (let i = 0; i < arr.header.length; i++) {
                    arr.header[i].no = (iNoNew);
                    iNoNew++;
                };

                $scope.data_header_def = arr.header;
                $scope.data_header = arr.header;
                $scope.flow_status = arr.header[0].pha_status;

                $scope.data_header_all = arr.header_all;

                $scope.data_general = arr.general;
                if ($scope.data_general[0].pha_sub_software == null) {
                    $scope.data_general[0].pha_sub_software = 'HRA';
                    $scope.data_general[0].expense_type = 'OPEX';
                    $scope.data_general[0].id_apu = null;
                    $scope.data_general[0].approver_user_name = null;
                }
                angular.copy($scope.data_general, $scope.data_general_def);


                //แสดงปุ่ม 
                $scope.cancle_type = true;
                $scope.export_type = false;
                $scope.submit_type = true;
                 
                try {
                    if (conFig.pha_type_doc == 'followup') {
                        if ($scope.data_header[0].action_type == 'insert') {
                            var page = "Home/Portal";
                            window.open(page, "_top");
                        }
                    } else {
                        if ($scope.data_header[0].action_type == 'insert') {
                            $scope.confirmCreate();
                            return;
                        }
                    }
                } catch { }

                //admin,request,responder,approver
                if ($scope.flow_role_type == 'admin') { $scope.tabChange = 'worksheet'; } else { $scope.tabChange = 'responder'; }

                $scope.master_unit_no_show = $filter('filter')($scope.master_unit_no, function (item) { return (item.id_apu == $scope.master_apu[0].id); });

                if ($scope.data_general[0].master_apu == null || $scope.data_general[0].master_apu == '') {
                    $scope.data_general[0].master_apu = null;
                    var arr_clone_def = { id: $scope.data_general[0].master_apu, name: 'Please select' };
                    $scope.master_apu.splice(0, 0, arr_clone_def);
                }
                if ($scope.data_general[0].master_functional == null || $scope.data_general[0].master_functional == '') {
                    $scope.data_general[0].master_functional = null;
                    var arr_clone_def = { id: $scope.data_general[0].master_functional, name: 'Please select' };
                    $scope.master_functional.splice(0, 0, arr_clone_def);
                }
                // if ($scope.data_general[0].id_business_unit == null) {
                //     $scope.data_general[0].id_business_unit = null;
                //     var arr_clone_def = { id: $scope.data_general[0].id_business_unit, name: 'Please select' };
                //     $scope.master_business_unit.splice(0, 0, arr_clone_def);
                // }
                // if ($scope.data_general[0].master_unit_no == null || $scope.data_general[0].master_unit_no == '') {
                //     $scope.data_general[0].master_unit_no = null;
                //     var arr_clone_def = { id: $scope.data_general[0].master_unit_no, name: 'Please select' };
                //     $scope.master_unit_no.splice(0, 0, arr_clone_def);
                // }
                // if ($scope.master_approver[0].employee_name == null || $scope.master_approver[0].employee_name == '') {
                //     $scope.master_approver[0].employee_name = null;
                //     var arr_clone_def = { id: $scope.master_approver[0].employee_name, name: 'Please select' };
                //     $scope.master_approver.splice(0, 0, arr_clone_def);
                // }

                apply();
                console.log($scope);
                try {
                    if (page_load == true || true) {
                        const choices0 = new Choices('.js-choice-company');
                        const choices1 = new Choices('.js-choice-apu');
                        const choices2 = new Choices('.js-choice-toc');
                        const choices3 = new Choices('.js-choice-unit_no');
                        const choices4 = new Choices('.js-choice-tagid');
                        const choices5 = new Choices('.js-choice-tagid_audition');
                    }
                } catch { }


            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status == 500) {
                    alert('Internal error: ' + jqXHR.responseText);
                } else {
                    alert('Unexpected ' + textStatus);
                }
            }

        });


        if ($scope.tabUpdateFollowUp == true) {
            $.ajax({
                url: url_ws + "Flow/load_follow_up",
                data: '{"sub_software":"' + sub_software +'","user_name":"' + user_name + '","token_doc":"' + token_doc + '","type_doc":"' + type_doc + '"}',
                type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
                headers: {
                    'Authorization': $scope.token 
                },
                beforeSend: function () {
                    $("#divLoading").show();
                },
                complete: function () {
                    $("#divLoading").hide();
                },
                success: function (data) {
                    var arr = data;

                    // Check if the array has at least one element and the status is not 'true'
                    if (arr.length > 0 && arr[0].status && arr[0].status.toString() !== 'true') {

                        console.error('Status is not true. Potential issue detected:', arr[0].remark || 'No remark provided');

                        $scope.confirmCreate();
                    } 

                    var item = $filter('filter')(arr.header, function (item) {
                        return (item.pha_seq == conFig.pha_seq() && item.data_by == "worksheet");
                    })[0];

                    $scope.tabChange = 'worksheet';
                    $scope.flow_status = item.pha_status;
                    $scope.DetailsShow = 'PHA No. : ' + item.pha_no + ' (' + item.pha_request_name + ')';

                    get_detail(item.pha_no, ($scope.flow_role_type == 'admin' ? '' : user_name));

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
    $scope.actionChangedData = function (item) {
        item.action_change = 1;
        apply();
    }
    $scope.selectDetails = function (arr) {
        $scope.tabUpdateFollowUp = true;

        var controller_text = 'Hazop';//fix เนื่องจากมีหน้าเดียวใช้ด้วยกัน
        var pha_type_doc = 'followupupdate';
        var pha_sub_software = arr.pha_sub_software;
        var pha_seq = arr.pha_seq;
        var pha_status = arr.pha_status;
        var responder_user_name = '';


        //a.pha_sub_software, a.seq as pha_seq,a.pha_no, g.pha_request_name, a.pha_status, vw.user_displayname as responder_user_displayname
        if ($scope.tabChange == 'worksheet') {
            var _arrcheck = $filter('filter')($scope.data_header_all, function (item) {
                return (item.pha_no == arr.pha_no);
            });
        } else {
            var _arrcheck = $filter('filter')($scope.data_header_all, function (item) {
                return (item.responder_user_displayname == arr.responder_user_displayname);
            });
        }
        if (_arrcheck.length == 0) {
            return;
        } else {
            pha_seq = _arrcheck[0].pha_seq;
            pha_no = _arrcheck[0].pha_no;
            pha_status = _arrcheck[0].pha_status;
            responder_user_name = ''; //_arrcheck[0].responder_user_name;
        }

        $.ajax({
            url: controller_text + "/next_page",
            data: '{"pha_sub_software":"' + pha_sub_software + '","pha_seq":"' + pha_seq + '","pha_no":"' + pha_no + '","pha_type_doc":"' + pha_type_doc + '","responder_user_name":"' + responder_user_name + '"'
                + ',"controller_page":"' + controller_text + '","pha_status":"' + pha_status + '"'
                + ',"controller_action_befor":"hra/followup"'
                + '}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
            headers: {
                'Authorization': $scope.token 
            },
            beforeSend: function () {
                $("#divLoading").show();
            },
            complete: function () {
                $("#divLoading").hide();
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

    }
    $scope.selectDoc = function (item) {

        //open document 
        var controller_text = item.pha_sub_software;

        conFig.pha_seq = item.pha_seq;
        conFig.pha_type_doc = 'edit';

        next_page(controller_text, 'hra');
    }
    function next_page(controller_text, pha_status) {
        controller_text = controller_text.toLowerCase();

        $.ajax({
            url: controller_text + "/next_page",
            data: '{"pha_seq":"' + conFig.pha_seq + '","pha_type_doc":"' + conFig.pha_type_doc + '"'
                + ',"pha_sub_software":"' + controller_text + '","pha_status":"' + pha_status + '"}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
            headers: {
                'Authorization': $scope.token 
            },
            beforeSend: function () {
                $("#divLoading").show();
            },
            complete: function () {
                $("#divLoading").hide();
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
    }
    function get_detail(pha_no, responder_user_name) {
        var user_name = $scope.user_name;
        var token_doc = '';

        var sub_software = 'hra';
        var type_doc = 'search';

        $.ajax({
            url: url_ws + "Flow/load_follow_up_details",
            data: '{"sub_software":"' + sub_software +'","user_name":"' + user_name + '","token_doc":"' + token_doc + '","type_doc":"' + type_doc + '","pha_no":"' + pha_no + '","responder_user_name":"' + responder_user_name + '"}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
            headers: {
                'Authorization': $scope.token 
            },
            beforeSend: function () {
                $("#divLoading").show();
            },
            complete: function () {
                $("#divLoading").hide();
            },
            success: function (data) {
                var arr = data;

                var iNoNew = 1;
                for (let i = 0; i < arr.details.length; i++) {
                    arr.details[i].no = (iNoNew);
                    iNoNew++;
                };

                $scope.data_details = arr.details;
                console.log("data_details");
                console.log($scope.data_details);

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

    $scope.confirmFollowBackSearch = function () {

        var controller_text = $scope.data_header ? $scope.data_header[0].pha_sub_software : 'hra';
        $.ajax({
            url: controller_text + "/follow_back_search",
            data: '{"pha_seq":"","pha_type_doc":"search","pha_sub_software":"' + controller_text + '","pha_status":""}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
            headers: {
                'Authorization': $scope.token 
            },
            beforeSend: function () {
                $("#divLoading").show();
            },
            complete: function () {
                $("#divLoading").hide();
            },
            success: function (data) {
                $scope.tabUpdateFollowUp = false;
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
    $scope.confirmFollowBack = function () {
        var page = conFig.controller_action_befor();
        window.open(page, "_top")
    }
    $scope.confirmCancle = function () {
        var page = conFig.controller_action_befor();
        window.open(page, "_top")
    }
    $scope.confirmCreate = function () {

        var controller_text = 'hra'; 

        if ($scope.data_header && $scope.data_header.length > 0 && $scope.data_header[0].pha_sub_software) {
            controller_text = $scope.data_header[0].pha_sub_software;
        }
        conFig.pha_seq = null;
        conFig.pha_type_doc = 'create';
        var pha_status = '11'; 

        $.ajax({
            url: controller_text + "/next_page",
            data: '{"pha_seq":"' + conFig.pha_seq + '","pha_type_doc":"' + conFig.pha_type_doc + '"'
                + ',"pha_sub_software":"' + controller_text + '","pha_status":"' + pha_status + '"}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
            headers: {
                'Authorization': $scope.token 
            },
            beforeSend: function () {
                $("#divLoading").show();
            },
            complete: function () {
                $("#divLoading").hide();
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
        return;
    }
    $scope.confirmSaveFollowup = function (action, _item) {

        var arr_active = [];
        angular.copy($scope.data_details, arr_active);
        var arr_json = $filter('filter')(arr_active, function (item) {
            return ((item.seq == _item.seq && item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert');
        });
        if ($scope.flow_status == '13') {
            //กรณีที่เป็น admin กดแทนเพื่อปิด step
            if ($scope.flow_role_type == 'admin') {
                arr_json[0].responder_action_type = 2;
            } else {
                //กรณีที่เป็น owner update action
                if (arr_json[0].action_status !== 'Open') {
                    arr_json[0].responder_action_type = 2;
                }
            }
        }
        var json_managerecom = angular.toJson(arr_json);

        var user_name = $scope.user_name;
        var flow_action = action;
        var token_doc = 'update';
        var sub_software = 'hra';

        $.ajax({
            url: url_ws + "Flow/set_follow_up",
            data: '{"sub_software":"' + sub_software +'","user_name":"' + user_name + '","token_doc":"' + token_doc + '","flow_action":' + JSON.stringify(flow_action) + '"json_managerecom":' + JSON.stringify(json_managerecom) + '}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
            headers: {
                'Authorization': $scope.token 
            },
            beforeSend: function () {
                //$("#divLoading").show(); 
                $('#modalLoading').modal('show');
            },
            complete: function () {
                //$("#divLoading").hide();
                $('#modalLoading').modal('hide');
            },
            success: function (data) {
                var arr = data;

                var arr = $filter('filter')($scope.data_details, function (item) {
                    return ((item.seq == _item.seq && item.action_type == 'update' && item.action_change == 1));
                });
                if (arr.length > 0) {
                    arr[0].action_type = 'update';
                    arr[0].action_change = 0;
                    if (arr[0].document_file_name != '' && (arr[0].action_status !== 'Open')) { arr[0].responder_action_type = 2; }

                    var arr = $filter('filter')($scope.data_details, function (item) {
                        return (item.responder_action_type == 2);
                    });
                    if (arr.length == $scope.data_details.length) {
                        var page = "Home/Portal";
                        window.open(page, "_top");
                    } else { apply(); }

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
    $scope.confirmSaveReviewFollowup = function (action) {
        var arr_json_general = $filter('filter')($scope.data_general, function (item) {
            return ((item.seq == _item.seq && item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert');
        });
        var json_general = angular.toJson(arr_json_general);


        var arr_active = [];
        angular.copy($scope.data_details, arr_active);
        var arr_json = $filter('filter')(arr_active, function (item) {
            return ((item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert');
        });
        if (action == 'update' && arr_json.length == 0) {
            for (let i = 0; i < arr_json.length; i++) {
                arr_json[i].action_change = 1;
            };
        }
        var json_managerecom = angular.toJson(arr_json);


        var user_name = $scope.user_name;
        var flow_action = action;
        var token_doc = 'update';
        var sub_software = 'hra';

        $.ajax({
            url: url_ws + "Flow/set_follow_up_review",
            data: '{"sub_software":"' + sub_software +'","user_name":"' + user_name + '","token_doc":"' + token_doc + '","flow_action":' + JSON.stringify(flow_action) + ',"json_general":' + JSON.stringify(json_general) + ',"json_managerecom":' + JSON.stringify(json_managerecom) + '}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
            headers: {
                'Authorization': $scope.token 
            },
            beforeSend: function () {
                $("#divLoading").show();
            },
            complete: function () {
                $("#divLoading").hide();
            },
            success: function (data) {

                if (action == 'update') {

                    var page = "Home/Portal";
                    window.open(page, "_top");

                } else { get_data(false); }

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


    $scope.openModalDataRAM = function (ram_type, _item, ram_type_action, id_ram) {
        var seq = _item.seq;

        $scope.selectdata_nodeworksheet = seq;
        $scope.selectedDataNodeWorksheetRamType = ram_type;
        $scope.selectedDataRamTypeAction = ram_type_action;

        $scope.selectedDataID_Ram = id_ram;
        $scope.cal_ram_action_security = _item.ram_action_security;
        $scope.cal_ram_action_likelihood = _item.ram_action_likelihood;
        $scope.cal_ram_action_risk = _item.ram_action_risk;

        var arr_items = $filter('filter')($scope.master_ram_level, function (item) { return (item.id_ram == id_ram); });
        var category_type = Number(arr_items[0].category_type);
        $scope.selectedDataRamType = category_type;

        apply();

        $('#modalRAM').modal('show');
    }
    $scope.selectDataRAM = function (ram_type, id_select) {

        var xseq = $scope.selectdata_nodeworksheet;
        var xbefor = $scope.selectedDataRamTypeAction;

        for (let i = 0; i < $scope.data_details.length; i++) {
            try {

                if ($scope.data_details[i].seq !== xseq) { continue; }

                if (xbefor === "action" && ram_type === "s") { $scope.data_details[i].ram_action_security = id_select; }
                if (xbefor === "action" && ram_type === "l") { $scope.data_details[i].ram_action_likelihood = id_select; }

                var ram_security = $scope.data_details[i].ram_action_security + "";
                var ram_likelihood = $scope.data_details[i].ram_action_likelihood + "";
                var ram_risk = "";

                if (ram_security == "" || ram_likelihood == "") {
                    $scope.data_details[i].ram_action_risk = "";
                    $scope.cal_ram_action_risk = '';

                    $('#modalRAM').modal('show');
                    break;
                }

                var id_ram = $scope.selectedDataID_Ram;
                var arr_items = $filter('filter')($scope.master_ram_level, function (item) {
                    return (item.id_ram == id_ram && item.security_level == ram_security);
                });
                if (arr_items.length > 0) {
                    //check ram_likelihood ว่าตก columns ไหน เพื่อหา ram1_priority
                    if (ram_likelihood == arr_items[0].likelihood1_level) { ram_risk = arr_items[0].ram1_priority; }
                    else if (ram_likelihood == arr_items[0].likelihood2_level) { ram_risk = arr_items[0].ram2_priority; }
                    else if (ram_likelihood == arr_items[0].likelihood3_level) { ram_risk = arr_items[0].ram3_priority; }
                    else if (ram_likelihood == arr_items[0].likelihood4_level) { ram_risk = arr_items[0].ram4_priority; }
                    else if (ram_likelihood == arr_items[0].likelihood5_level) { ram_risk = arr_items[0].ram5_priority; }
                    else if (ram_likelihood == arr_items[0].likelihood6_level) { ram_risk = arr_items[0].ram6_priority; }
                    else if (ram_likelihood == arr_items[0].likelihood7_level) { ram_risk = arr_items[0].ram7_priority; }
                }

                $scope.data_details[i].ram_action_risk = ram_risk

                $scope.cal_ram_action_security = ram_security;
                $scope.cal_ram_action_likelihood = ram_likelihood;
                $scope.cal_ram_action_risk = ram_risk;

                if ($scope.data_details[i].action_type == 'update') {
                    $scope.data_details[i].action_change = 1;
                }
                $scope.action_type_changed($scope.data_details[i], $scope.data_details[i].seq);
                break;

            } catch (e) { }
        }

        $('#modalRAM').modal('show');
    }
    function action_type_changed(_arr, _seq) {
        if (_seq == undefined) { _seq = 1; }
        if (_arr.seq == _seq && _arr.action_type == '') {
            _arr.action_type = 'update';
            _arr.update_by = $scope.user_name;
            apply();
        } else if (_arr.seq == _seq && _arr.action_type == 'update') {
            _arr.action_change = 1;
            _arr.update_by = $scope.user_name;
            apply();
        }
    }

});
