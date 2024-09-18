
AppMenuPage.filter('MultiFieldFilter', function () {
    return function (items, searchMultiText) {
        if (!searchMultiText.pha_no
            && !searchMultiText.data_by
            && !searchMultiText.user_displayname) {
            return items;
        }
        var search_data_by = searchMultiText.data_by.toLowerCase();

        var search_pha_no = searchMultiText.pha_no.toLowerCase();
        var search_user_displayname = searchMultiText.user_displayname.toLowerCase();

        if (search_data_by == 'worksheet') {
             
            return items.filter(function (item) {
                return (
                    item.data_by.toLowerCase().includes(search_data_by.toLowerCase()) &&
                    item.pha_no.toLowerCase().includes(search_pha_no.toLowerCase()) 
                )

            });
        } else {
            return items.filter(function (item) {
                return (
                    item.data_by.toLowerCase().includes(search_data_by.toLowerCase()) &&
                    item.responder_user_displayname.toLowerCase().includes(search_user_displayname.toLowerCase())
                )

            });

        }
    };
});

AppMenuPage.controller("ctrlAppPage", function ($scope, $http, $filter, conFig) {
    $('#divLoading').hide();


    $scope.customFunction = function () {
        // Perform custom logic on button click
        console.log('Button clicked! Custom function called.');
    };
    $scope.searchMultiChange = function () {
        $scope.searchMultiText.data_by = $scope.tabChange;
    }
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
    $("#divLoading").hide();
    page_load();
    $scope.handleLinkClick = function (val) {
        // ทำสิ่งต่าง ๆ เมื่อคลิกลิงก์
        console.log('Link clicked!');
        // คุณสามารถเพิ่มโค้ดอื่น ๆ ที่คุณต้องการทำในฟังก์ชันนี้ได้

        $scope.tabChange = val;
        $scope.searchMultiChange();
    }

    function arr_def() {
        //conFig.controller_action_befor = 'Hazop/Index';
        //alert(conFig.controller_action_befor());
        $scope.user = JSON.parse(localStorage.getItem('user'));
        $scope.token = JSON.parse(localStorage.getItem('token'))
        $scope.user_name = $scope.user['user_name'];
        $scope.flow_role_type = $scope.user['role_type'];
        // $scope.user_name = conFig.user_name();
        // $scope.flow_role_type = conFig.role_type();//admin,request,responder,approver
        $scope.pha_sub_software = conFig.pha_sub_software();

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
        $scope.tabUpdateFollowUp = true;

        $scope.flow_status = 0;


        $scope.searchMultiText = { pha_no: '', user_displayname: '', data_by: 'worksheet' };
    }
    function page_load() {
        arr_def();
        get_data(true);
    }
    function get_data(page_load) {
        var user_name = $scope.user_name;
        var token_doc = '';

        var sub_software = 'hazop';
        //var sub_software = $scope.pha_sub_software.toLowerCase();
        var type_doc = 'search';

        $.ajax({
            url: url_ws + "Flow/load_follow_up",
            data: '{"sub_software":"' + sub_software +'","user_name":"' + user_name + '","token_doc":"' + token_doc + '","type_doc":"' + type_doc + '"}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $scope.token
            },
            xhrFields: {
                withCredentials: true // เปิดการส่ง Cookie ไปพร้อมกับคำขอ
            },
            beforeSend: function () {
                $("#divLoading").show();
                $('#divPage').addClass('d-none');

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
                    $scope.data_general[0].pha_sub_software = 'HAZOP';
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
  
                $('#divPage').removeClass('d-none');

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
    $scope.actionChangedData = function (arr) {
        arr.action_change = 1;
        apply();
    }
    $scope.selectDetails = function (arr) {

        $scope.tabUpdateFollowUp = true;

        var sub_software = $scope.pha_sub_software.toLowerCase();
        var controller_text = 'Hazop';//fix เนื่องจากมีหน้าเดียวใช้ด้วยกัน
        var pha_type_doc = 'followupupdate';
        var pha_sub_software = arr.pha_sub_software;
        var pha_seq = arr.pha_seq;
        var pha_status = arr.pha_status;
        var responder_user_name = '';
        var user_name = $scope.user_name;


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
                + ',"controller_page":"' + controller_text + '","pha_status":"' + pha_status + '","user_name":"' + user_name + '"'
                + ',"controller_action_befor":"hazop/followup"'
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

    function next_page(controller_text, pha_status) {
        controller_text = controller_text.toLowerCase();
        var user_name = $scope.user_name;

        $.ajax({
            url: controller_text + "/next_page",
            data: '{"pha_seq":"' + conFig.pha_seq + '","pha_no":"' + conFig.pha_no + '","pha_type_doc":"' + conFig.pha_type_doc + '"'
                + ',"pha_sub_software":"' + controller_text + '","pha_status":"' + pha_status + '","user_name":"' + user_name +'"}',
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

    $scope.confirmCancle = function () {
        //var page = conFig.controller_action_befor();
        //window.open(page, "_top")
        window.open('Home/Portal', "_top")

    }
    $scope.confirmCreate = function () {

        var controller_text = 'hazop'; 

        if ($scope.data_header && $scope.data_header.length > 0 && $scope.data_header[0].pha_sub_software) {
            controller_text = $scope.data_header[0].pha_sub_software;
        }
        
        conFig.pha_seq = null;
        conFig.pha_type_doc = 'create';
        var pha_status = '11';
        var user_name = $scope.user_name;

        //window.open("hazop/index", "_top")
        $.ajax({
            url: controller_text + "/next_page",
            data: '{"pha_seq":"' + conFig.pha_seq + '","pha_type_doc":"' + conFig.pha_type_doc + '"'
                + ',"pha_sub_software":"' + controller_text + '","pha_status":"' + pha_status + '","user_name":"' + user_name + '"}',
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

});
