
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
    $('#divLoading').hide();


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


        $scope.data_all = [];

        $scope.user_name = conFig.user_name();
        $scope.flow_role_type = conFig.role_type();//admin,request,responder,approver
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
        var sub_software = '';
        var type_doc = 'search';

        $.ajax({
            url: url_ws + "Flow/load_home_tasks",
            data: '{"sub_software":"' + sub_software + '","user_name":"' + user_name + '","token_doc":"' + token_doc + '","type_doc":"' + type_doc + '"}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
            headers: {
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val() // รับค่าจาก form เพื่อป้องกัน CSRF
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

                $scope.data_all = arr;
                arr.resultes = $filter('orderBy')(arr.resultes, 'due_date');
                var iNoNew = 1;
                for (let i = 0; i < arr.resultes.length; i++) {
                    arr.resultes[i].task = (iNoNew);
                    iNoNew++;
                };
                $scope.data_resultes = arr.resultes;

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
        $scope.pha_type_doc = 'review_document';

        next_page(controller_text, '');
    }

    $scope.editActionFollowup = function (item) {
        //open document 
        var controller_text = item.pha_type;

        $scope.pha_seq = item.id_pha;
        $scope.pha_type_doc = 'followup';

        next_page(controller_text, '', item.user_name);
    }
    $scope.editActionReviewFollowup = function (item) {
        //open document 
        var controller_text = item.pha_type;

        $scope.pha_seq = item.id_pha;
        $scope.pha_type_doc = 'review_followup';

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

        var user_name = conFig.user_name();
        var role_type = conFig.role_type();

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
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val() // รับค่าจาก form เพื่อป้องกัน CSRF
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
        var pha_type_doc = $scope.pha_type_doc;


        $.ajax({
            url: "home/next_page",
            data: '{"pha_seq":"' + pha_seq + '","pha_type_doc":"' + pha_type_doc + '"'
                + ',"pha_sub_software":"' + sub_software + '","pha_status":"' + pha_status + '"'
                + ',"responder_user_name":"' + responder_user_name + '"'
                + ',"controller_action_befor":"home/hometasks"'
                + '}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
            headers: {
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val() // รับค่าจาก form เพื่อป้องกัน CSRF
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
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val() // รับค่าจาก form เพื่อป้องกัน CSRF
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

                if (arr.length > 0) {
                    if (arr[0].ATTACHED_FILE_NAME != '') {
                        var path = (url_ws).replace('/api/', '') + arr[0].ATTACHED_FILE_PATH;
                        var name = arr[0].ATTACHED_FILE_NAME;
                        $scope.exportfile[0].DownloadPath = path;
                        $scope.exportfile[0].Name = name;


                        $('#modalExportFile').modal('show');
                        apply();
                    }
                } else {
                    set_alert('Error', arr[0].IMPORT_DATA_MSG);
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

});
