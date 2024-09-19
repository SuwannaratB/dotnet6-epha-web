
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
AppMenuPage.controller("ctrlAppPage", function ($scope, $http, $filter, conFig,$timeout) {
    $('#divLoading').hide();


    $scope.subSoftwateChange = function () {
        $scope.data_resultes = $filter('filter')($scope.data, function (item) {
            return (item.pha_type == $scope.select_pha_type)
        });
    }

    $scope.actionReqChange = function () {
        $scope.data_resultes = $filter('filter')($scope.data, function (item) {

            if ($scope.select_actionReq_type === 'all') {
                return (item.pha_type == $scope.select_pha_type)
            } else {
                var matches = item.action_required === $scope.select_actionReq_type && item.pha_type == $scope.select_pha_type;
                return matches;
            }
        });
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
        $scope.data_all = [];
        $scope.flow_status = 0;
        $scope.due_date_up = true;
        $scope.due_date_sort_by = 'due_date';
        $scope.exportfile = [{ DownloadPath: '', Name: '' }];
    }
    function page_load() {
        arr_def();
        get_data(true);
    }
    function get_data(page_load) {

        var user_name = $scope.user_name;
        var token_doc = '';
        var sub_software = 'hazop';
        var type_doc = 'search';

        $.ajax({
            url: url_ws + "Flow/load_home_tasks",
            data: '{"sub_software":"' + sub_software + '","user_name":"' + user_name + '","token_doc":"' + token_doc + '","type_doc":"' + type_doc + '"}',
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

                $scope.data_all = arr;
                arr.resultes = $filter('orderBy')(arr.resultes, 'due_date');
                var iNoNew = 1;
                for (let i = 0; i < arr.resultes.length; i++) {
                    arr.resultes[i].task = (iNoNew);
                    iNoNew++;
                };
                // $scope.data_resultes = arr.resultes;
                $scope.data = arr.resultes;

                // Assuming pha_type_filter is the variable storing the pha_type you want to filter 
                let phaTypes = ['HAZOP', 'JSEA', 'WHATIF', 'HRA'];
                $scope.select_pha_type = null; 
                for (let type of phaTypes) {
                    arr_module = $filter('filter')(arr.resultes, item => item.pha_type === type);
                    if (arr_module?.length > 0) {
                        $scope.select_pha_type = type;
                        break;
                    }
                } 
                $scope.select_actionReq_type = 'all'
                $scope.subSoftwateChange();
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
    $scope.task_sort = function () {

        if ($scope.task_up == true) {
            $scope.task_up = false;
            $scope.due_date_sort_by = 'task'; // เรียงลำดับเริ่มต้นตาม due_date
        } else {
            $scope.task_up = true;
            $scope.due_date_sort_by = '-task'; // เรียงลำดับเริ่มต้นตาม due_date
        }
        apply();
    }
    $scope.due_date_sort = function () {

        if ($scope.due_date_up == true) {
            $scope.due_date_up = false;
            $scope.due_date_sort_by = 'due_date'; // เรียงลำดับเริ่มต้นตาม due_date
        } else {
            $scope.due_date_up = true;
            $scope.due_date_sort_by = '-due_date'; // เรียงลำดับเริ่มต้นตาม due_date
        }
        apply();
    }
    $scope.selectDoc = function (item) {
        //open document 
        var controller_text = item.pha_type;

        $scope.pha_seq = item.id_pha;
        $scope.pha_no = item.document_number;
        $scope.pha_type_doc = 'review_document';

        next_page(controller_text, '');
    }
    $scope.editActionApprove = function (item) {
        //open document 
        var controller_text = item.pha_type;

        $scope.pha_seq = item.id_pha;
        $scope.pha_no = item.document_number;
        $scope.pha_type_doc = 'edit';

        next_page(controller_text, '', item.user_name);
    }
    $scope.editActionFollowup = function (item) {
        //open document 
        var controller_text = item.pha_type;

        $scope.pha_seq = item.id_pha;
        $scope.pha_no = item.document_number;
        $scope.pha_type_doc = 'edit';

        alert($scope.pha_no)
        next_page(controller_text, '', item.user_name);
    }
    $scope.editActionReviewFollowup = function (item) {
        //open document 
        var controller_text = item.pha_type;

        $scope.pha_seq = item.id_pha;
        $scope.pha_no = item.document_number;
        $scope.pha_type_doc = 'edit';

        next_page(controller_text, '');
    }
    $scope.editActionApprover = function (item) {
        //open document 
        var controller_text = item.pha_type;

        $scope.pha_seq = item.id_pha;
        $scope.pha_no = item.document_number;
        $scope.pha_type_doc = 'edit';

        next_page(controller_text, '');
    }    
    $scope.confirmApprove = function (item, action) {

        $scope.approve_type = 'approve';
        $scope.approve_comment = '';

        $('#modalMsgConfirmApprove').modal('show');
    }
    $scope.confirmReject = function (item) {
        $scope.approve_type = 'reject_no_comment';
        $scope.approve_comment = '';

        $('#modalMsgConfirmApprove').modal('show');
    }
    $scope.confirmArppoved = function () {

        var user_name = $scope.user_name
        var role_type = $scope.flow_role_type;

        var pha_seq = $scope.id_pha;
        var action = $scope.approve_type;
        var comment = $scope.approve_comment;

        if (action == 'reject_no_comment' && comment == '') {
            $('#modalMsg').modal('show');
            return;
        }

        $.ajax({
            url: url_ws + "flow/set_approve",
            data: '{"user_name":"' + user_name + '","role_type":"' + role_type + '","token_doc":"' + pha_seq + '","action":"' + action + '","comment":"' + comment + '"}',
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
                console.log(arr);
                if (arr[0].status == 'true') {
                    $scope.msg_save = 'Data has been successfully saved.';
                } else {
                    $scope.msg_save = 'Error:' + arr[0].remark;
                }
                apply();
                $('#modalMsgSave').show();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status == 500) {
                    alert('Internal error: ' + jqXHR.responseText);
                } else {
                    alert('Unexpected ' + textStatus);
                }
            }

        });


        $('#modalMsgConfirmApprove').modal('hide');
    }
    function next_page(sub_software, pha_status, responder_user_name) {

        //controller_text = controller_text.toLowerCase();
        var pha_seq = $scope.pha_seq;
        var pha_no = $scope.pha_no;
        var pha_type_doc = $scope.pha_type_doc;
        var user_name = $scope.user_name;

        $.ajax({
            url: "home/next_page",
            data: '{"pha_seq":"' + pha_seq + '","pha_no":"' + pha_no + '","pha_type_doc":"' + pha_type_doc +'"'
                + ',"pha_sub_software":"' + sub_software + '","pha_status":"' + pha_status + '"'
                + ',"responder_user_name":"' + responder_user_name + '","user_name":"' + user_name + '"'
                + ',"controller_action_befor":"home/hometasks"'
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
    $scope.confirmBack = function () {
        var page = 'home/portal';
        window.open(page, "_top")
    }
    $scope.confirmExport = function (item, data_type) {

        var sub_software = (item.pha_type == 'HAZOP' ? 'hazop'
            : (item.pha_type == 'JSEA' ? 'jsea'
                : 'whatif'));

        var seq = item.id_pha;
        var user_name = $scope.user_name;

        var action_export_report_type = "export_" + sub_software + "_report";

        $.ajax({
            url: url_ws + "Flow/" + action_export_report_type,
            data: '{"sub_software":"hazop","user_name":"' + user_name + '","seq":"' + seq + '","export_type":"' + data_type + '"}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $scope.token
            },
            xhrFields: {
                withCredentials: true // เปิดการส่ง Cookie ไปพร้อมกับคำขอ
            },
            beforeSend: function () {
                //$('#modalLoadding').modal('show');
                $('#divLoading').show();
            },
            complete: function () {
                //$('#modalLoadding').modal('hide');
                $('#divLoading').hide();
            },
            success: function (data) {
                var arr = data;

                                                    
                if (arr && arr.msg && arr.msg[0].STATUS === "true") {

                    const jsonArray = arr;

                    if (jsonArray) {
                        var file_path = (url_ws).replace('/api/', '') + jsonArray.msg[0].ATTACHED_FILE_PATH;
                        var file_name = jsonArray.msg[0].ATTACHED_FILE_NAME;
                        $scope.exportfile[0].DownloadPath = file_path;
                        $scope.exportfile[0].Name = file_name;


                        $('#modalExportFile').modal('show');
                        apply();
                    }

                    $("#divLoading").hide(); 

                }else{
                    $("#divLoading").hide();                     
                    set_alert('Warning', 'An unexpected error occurred. Please try again later or reach out to support if the problem continues.');
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

    function set_alert(header, detail) {
        $scope.Action_Msg_Header = header;
        $scope.Action_Msg_Detail = detail;

        $timeout(function() {
            $('#modalMsgAlert').modal({
                backdrop: 'static',
                keyboard: false 
            }).modal('show');
    
            if (header === 'Success') {
                $timeout(function() {
                    $('#modalMsgAlert').modal('hide');
                }, 2000);
            }
        });
    };

});
