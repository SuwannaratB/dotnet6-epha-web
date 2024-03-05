
AppMenuPage.controller("ctrlAppPage", function ($scope, $http, $filter, conFig) {
    $('#divLoading').hide();

    //  add file 
    $scope.clearFileName = function (inputId) {

        var fileUpload = document.getElementById('attfile-' + inputId);
        var fileNameDisplay = document.getElementById('filename' + inputId);
        var del = document.getElementById('del-' + inputId);
        fileUpload.value = ''; // ล้างค่าใน input file
        fileNameDisplay.textContent = ''; // ล้างข้อความที่แสดงชื่อไฟล์
        del.style.display = "none";

        var arr = $filter('filter')($scope.data_details, function (item) { return (item.seq == seq); });
        if (arr.length > 0) {
            arr[0].document_file_name = null;
            arr[0].document_file_size = 0;
            arr[0].document_file_path = null;
            arr[0].action_type = 'delete';
            arr[0].action_change = 1;
            apply();
        }
        clear_form_valid();
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

            //var arr = $filter('filter')($scope.data_details, function (item) { return (item.seq == seq); });
            var arr = $filter('filter')($scope.data_drawingworksheet, function (item) { return (item.seq == seq); });
            if (arr.length > 0) {
                arr[0].document_file_name = file_name;
                arr[0].document_file_size = file_size;
                arr[0].document_file_path = url_ws + 'AttachedFileTemp/FollowUp/' + file_name;
                arr[0].document_module = $scope.document_module;
                arr[0].action_change = 1;
                apply();
            }
        } catch (ex) { alert(ex); }

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
    function clear_form_valid() {
        $scope.id_worksheet_select = null;
        $scope.ready_to_complate = false;
        $scope.form_valid = { valid_document_file: false };
    }

    function arr_def() {
        //conFig.controller_action_befor = 'Hazop/Index';
        //alert(conFig.controller_action_befor());

        $scope.selectViewTypeFollowup = true;
        $scope.action_part = 1;
        $scope.user_name = conFig.user_name();

        $scope.data_all = [];

        $scope.master_apu = [];
        $scope.master_bussiness_unit = [];
        $scope.master_unit_no = [];
        $scope.master_functional = [];


        $scope.data_header = [];
        $scope.data_general = [];
        $scope.data_approver = [];
        $scope.data_drawingworksheet = [];
        $scope.data_drawingworksheet_delete = [];
        $scope.document_module = 'followup';

        $scope.data_drawingworksheet_responder = [];

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

        $scope.flow_role_type = conFig.role_type();//admin,request,responder,approver
        $scope.flow_status = 0;

        //alert($scope.flow_role_type);
        $scope.tab_general_active = false;
        if ($scope.flow_role_type == 'admin') {
            $scope.tab_general_active = true;
        }

        $scope.seq_select = [];
        $scope.exportfile = [{ DownloadPath: '', Name: '' }];
        clear_form_valid();

    }
    function page_load() {
        arr_def();
        get_detail(true);
    }

    $scope.actionChangedData = function (item) {
        clear_form_valid();
        item.action_change = 1;
        apply();
    }
    $scope.actionChangedDataComment = function (item) {
        item.action_change = 1;
        apply();
    }
    $scope.selectDocPreview = function () {

        //open document 
        var controller_text = 'hazop';//item.pha_sub_software;
        var pha_status = $scope.flow_status;

        conFig.pha_seq = $scope.data_details[0].seq;
        conFig.pha_type_doc = 'preview';

        $.ajax({
            url: controller_text + "/next_page",
            data: '{"pha_seq":"' + conFig.pha_seq + '","pha_type_doc":"' + conFig.pha_type_doc + '"'
                + ',"pha_sub_software":"' + controller_text + '","pha_status":"' + pha_status + '"}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
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


    //add Drawing
    $scope.addDataWorksheetDrawing = function (item_draw, seq_nodeworksheet) {
        //item_draw = data_drawingworksheet
        var seq = item_draw.seq;
        var id_pha = item_draw.id_pha;
        var id_worksheet = seq_nodeworksheet;

        var xseq = Number($scope.MaxSeqdata_drawing_worksheet) + 1;
        $scope.MaxSeqdata_drawing_worksheet = xseq;

        //add Item Drawing 
        var add_items = {
            create_by: null,
            update_by: null,
            action_change: 0,
            action_type: "insert",
            descriptions: null,
            document_file_name: null,
            document_file_path: null,
            document_file_size: null,
            document_name: null,
            document_module: $scope.document_module,
            document_no: null,
            id_pha: id_pha,
            id_worksheet: id_worksheet,
            id: xseq,
            seq: xseq,
            no: 1
        }

        $scope.data_drawingworksheet.push(add_items);
        var ino = 0;
        for (const value of $scope.data_drawingworksheet) {
            value.no = ino; ino++;
        }
        apply();
    }
    $scope.removeDataWorksheetDrawing = function (item_draw, seq_nodeworksheet) {
        var seq = item_draw.seq;
        var fileUpload = document.getElementById('attfile-' + seq);
        var fileNameDisplay = document.getElementById('filename' + seq);

        fileUpload.value = ''; // ล้างค่าใน input file
        fileNameDisplay.textContent = ''; // ล้างข้อความที่แสดงชื่อไฟล์

        //var del = document.getElementById('del-' + seq);
        //del.style.display = "none";


        var arr = $filter('filter')($scope.data_drawingworksheet, function (item) { return (item.seq == seq); });
        if (arr.length > 0) {
            arr[0].document_file_name = null;
            arr[0].document_file_size = 0;
            arr[0].document_file_path = null;
            arr[0].action_type = 'delete';
            arr[0].action_change = 1;
            apply();
        }
        clear_form_valid();

    }

    function next_page(controller_text, pha_status) {
        controller_text = controller_text.toLowerCase();

        $.ajax({
            url: controller_text + "/next_page",
            data: '{"pha_seq":"' + conFig.pha_seq + '","pha_type_doc":"' + conFig.pha_type_doc + '"'
                + ',"pha_sub_software":"' + controller_text + '","pha_status":"' + pha_status + '"}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
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
    function get_detail() {

        var user_name = $scope.user_name;
        var pha_no = conFig.pha_no();
        var token_doc = conFig.pha_seq();
        var responder_user_name = conFig.responder_user_name();
        var sub_software = 'hazop';

        //alert($scope.flow_role_type);
        if ($scope.flow_role_type != 'admin') {
            responder_user_name = user_name;
        }
        //แสดงปุ่ม 
        $scope.cancle_type = true;
        $scope.export_type = false;
        $scope.submit_type = true;
        //reviewer_comment
        $.ajax({
            url: url_ws + "Flow/load_follow_up_details",
            data: '{"sub_software":"' + sub_software + '","user_name":"' + user_name + '"'
                + ',"token_doc":"' + token_doc + '"'
                + ',"pha_no":"' + pha_no + '","responder_user_name":"' + responder_user_name + '"}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
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

                $scope.data_pha_doc = arr.pha_doc;//pha_status,pha_no
                $scope.data_general = arr.general;
                $scope.data_details = arr.details;
                $scope.data_drawingworksheet = arr.drawingworksheet;
                $scope.data_drawingworksheet_responder = arr.drawingworksheet_responder;
                $scope.data_drawingworksheet_reviewer = arr.drawingworksheet_reviewer;

                if (true) {
                    $scope.MaxSeqdata_drawing_worksheet = 0;
                    var arr_check = $filter('filter')(arr.max, function (item) { return (item.name == 'drawingworksheet'); });
                    var iMaxSeq = 1; if (arr_check.length > 0) { iMaxSeq = arr_check[0].values; }
                    $scope.MaxSeqdata_drawing_worksheet = iMaxSeq;
                }

                //เพิ่มแสดงข้อมูล RAM
                if (true) {
                    //ram,ram_level,ram_color,security_level,likelihood_level
                    $scope.master_ram = arr.ram;
                    $scope.master_ram_level = arr.ram_level;
                    $scope.master_ram_color = arr.ram_color;
                    $scope.master_ram_priority = [{ id: 1, name: 'H' }, { id: 2, name: 'M' }, { id: 3, name: 'L' }, { id: 4, name: 'N' }, { id: 5, name: 'N/A' }];
                    $scope.master_ram_criterion = [{ id: 'N', name: 'N' }, { id: 'Y', name: 'Y' }];
                    $scope.master_security_level = arr.security_level;
                    $scope.master_likelihood_level = arr.likelihood_level;
                    $scope.master_no = [{ id: 4, name: 4 }, { id: 5, name: 5 }, { id: 6, name: 6 }, { id: 7, name: 7 }, { id: 8, name: 8 }, { id: 9, name: 9 }, { id: 10, name: 10 }];
                    $scope.ram_rows_level = 5;
                    $scope.ram_columns_level = 5;
                }

                console.log($scope);

                // a.seq, a.pha_no, a.pha_version, a.pha_status, ms.descriptions
                $scope.flow_status = arr.pha_doc[0].pha_status;
                $scope.DetailsShow = '' + arr.pha_doc[0].pha_no + ' (' + arr.pha_doc[0].pha_request_name + ')';
                $scope.DetailsShow2 = '' + arr.pha_doc[0].pha_status_desc;
                $scope.document_module = (arr.pha_doc[0].pha_status == 13 ? 'followup' : 'review_followup');
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
        var page = conFig.controller_action_befor(); 
        window.open(page, "_top");
    }
    $scope.confirmFollowBack = function () {
        var page = conFig.controller_action_befor();
        window.open(page, "_top")
    }
    $scope.confirmCancle = function () {
        var page = conFig.controller_action_befor();
        window.open(page, "_top")
    }

    $scope.actionSave = function (item) {

        if ($scope.flow_status == 13) {
            item.action_change = 1;
            $scope.confirmSaveFollowup('save', item);

        } else if ($scope.flow_status == 14) {

            item.action_change = 1;
            $scope.confirmSaveReviewFollowup('save', item);
        }

    };
    $scope.showConfirmDialogSubmit = function (item, action) {
        clear_form_valid();

        if (action == 'submit') {

            //เนื่องจากย้ายมาในระดับ row
            $scope.id_worksheet_select = item.seq;
            //if (item.document_file_size == 0 || item.document_file_size == null) {
            //    $scope.form_valid.valid_document_file = true;
            //    return;
            //}
            //var fileUploadOwner = document.getElementById('attfile-owner-' + inputId);
            if ($scope.data_drawingworksheet == null) { $scope.form_valid.valid_document_file = true; return; }
            if ($scope.data_drawingworksheet.length > 0) {
                var arr_drawing = $filter('filter')($scope.data_drawingworksheet, function (item) {
                    return (item.id_worksheet == $scope.id_worksheet_select && item.document_file_name != null);
                });
                if (arr_drawing.length == 0) { $scope.form_valid.valid_document_file = true; return; } else {
                    //document_file_name 
                }
            }


            if ($scope.flow_status == 14) {
                // item.reviewer_action_type
                var arr_active = [];
                angular.copy($scope.data_details, arr_active);

                debugger;

                var arr_json = $filter('filter')(arr_active, function (item) {
                    return (item.reviewer_action_type == null
                        || item.reviewer_action_type < 2);
                });
                if (arr_json.length == 1) {
                    //กรณีที่เป็นการ Approve รายการสุดท้าย ให้แสดง Popup แจ้ง
                    //- HAZOP Ready to complate. 
                    $scope.ready_to_complate = true;
                }

            }

            $('#modalConfirmSubmit').modal('show');
            $scope.seq_select = item.seq;

        }
    };
    $scope.ConfirmDialogSubmit = function (action) {

        if (action == 'confirm_submit_reviewer') {

            var arr_active = [];
            angular.copy($scope.data_details, arr_active);
            var arr_json = $filter('filter')(arr_active, function (item) {
                return (item.seq == $scope.seq_select);
            });

            $('#modalLoading').modal('show');

            $scope.confirmSaveFollowup('submit', arr_json[0]);
            $('#modalConfirmSubmit').modal('hide');

        } else if (action == 'confirm_approve_close') {

            var arr_active = [];
            angular.copy($scope.data_details, arr_active);
            var arr_json = $filter('filter')(arr_active, function (item) {
                return (item.seq == $scope.seq_select);
            });

            $scope.confirmSaveReviewFollowup('submit', arr_json[0]);
            $('#modalConfirmSubmit').modal('hide');

        } else { $('#modalConfirmSubmit').modal('hide'); }
    };
    function check_data_drawingworksheet(id_worksheet) {

        var pha_seq = $scope.data_details[0].id_pha;
        //var id_worksheet = $scope.data_details[0].id_worksheet;

        for (var i = 0; i < $scope.data_drawingworksheet.length; i++) {
            $scope.data_drawingworksheet[i].id = Number($scope.data_drawingworksheet[i].seq);
            $scope.data_drawingworksheet[i].id_pha = pha_seq;
        }

        var arr_active = [];
        angular.copy($scope.data_drawingworksheet, arr_active);
        var arr_json = $filter('filter')(arr_active, function (item) {
            return (
                ((item.action_type == 'update' && item.action_change == 1)
                    || (item.action_type == 'insert' && item.action_change == 1))
                && item.id_worksheet == id_worksheet
            );
        });

        //ข้อมูลที่ delete อยู่ใน data_drawingworksheet ไม่ได้เก็บไว้ใน data_drawingworksheet_delete
        //ต้องไปปรับ $scope.removeDataWorksheetDrawing 
        for (var i = 0; i < $scope.data_drawingworksheet_delete.length; i++) {
            if ($scope.data_drawingworksheet_delete[i].id_worksheet == id_worksheet) {
                $scope.data_drawingworksheet_delete[i].action_type = 'delete';
                arr_json.push($scope.data_drawingworksheet_delete[i]);
            }
        }

        return angular.toJson(arr_json);
    }

    $scope.confirmSaveFollowup = function (action, _item) {

        var arr_active = [];
        angular.copy($scope.data_details, arr_active);

        if (action == 'save') {
            var arr_json = $filter('filter')(arr_active, function (item) {
                return ((item.seq == _item.seq && item.action_type == 'update' && item.action_change == 1)
                    || item.action_type == 'insert');
            });
        } else {
            var arr_json = $filter('filter')(arr_active, function (item) {
                return (item.seq == _item.seq);
            });
        }

        var json_managerecom = angular.toJson(arr_json);
        var json_drawingworksheet = check_data_drawingworksheet(_item.seq);

        var user_name = $scope.user_name;
        var flow_action = action;
        var token_doc = _item.ID_PHA;

        //alert(url_ws + "Flow/set_follow_up");
        var sub_software = 'hazop';

        $.ajax({
            url: url_ws + "Flow/set_follow_up",
            data: '{"sub_software":"' + sub_software + '","user_name":"' + user_name + '","token_doc":"' + token_doc + '"'
                + ',"flow_action": "' + flow_action + '"'
                + ', "json_managerecom": ' + JSON.stringify(json_managerecom)
                + ', "json_drawingworksheet": ' + JSON.stringify(json_drawingworksheet)
                + '}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
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
                    return ((item.seq == _item.seq && item.action_type == 'update'));
                });
                if (arr.length > 0) {
                    arr[0].action_type = 'update';
                    arr[0].action_change = 0;
                    arr[0].responder_action_type = (action == 'save' ? 1 : 2);

                    //update data_drawingworksheet  
                    $scope.data_drawingworksheet_delete = [];
                    for (let i = 0; i < $scope.data_drawingworksheet.length; i++) {
                        if ($scope.data_drawingworksheet[i].id_worksheet == _item.seq) {
                            if ($scope.data_drawingworksheet[i].action_type == 'update'
                                || ($scope.data_drawingworksheet[i].action_type == 'insert' && $scope.data_drawingworksheet[i].action_change == 1)) {
                                $scope.data_drawingworksheet[i].action_type = 'update';
                                $scope.data_drawingworksheet[i].action_change = 0;
                            }
                        }
                    }
                    if (action == 'save') {
                        $scope.Action_Msg_Header = 'Success';
                        $scope.Action_Msg_Detail = 'Data has been successfully saved.';
                    } else {
                        $scope.Action_Msg_Header = 'Success';
                        $scope.Action_Msg_Detail = 'Data has been successfully submitted.';
                    }
                    apply();

                    if (true) {
                        var arr = $filter('filter')($scope.data_details, function (item) {
                            return (item.responder_action_type == 2);
                        });

                        if (arr.length == $scope.data_details.length) {
                            window.open("Home/Portal", "_top");
                        } else {
                            //window.open("hazop/FollowupUpdate", "_top");
                            //set_alert('Success', 'Data has been successfully saved.');
                            $('#modalMsg').modal('show');
                        }
                    }

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
    $scope.confirmSaveReviewFollowup = function (action, _item) {
          
        var json_drawingworksheet = check_data_drawingworksheet(_item.seq);

        var arr_active = [];
        angular.copy($scope.data_details, arr_active);
        if (action == 'save') {
            var arr_json = $filter('filter')(arr_active, function (item) {
                return (item.seq == _item.seq && (item.action_type == 'update' && item.action_change == 1));
            });
            if (action == 'submit' && arr_json.length == 0) {
                for (let i = 0; i < arr_json.length; i++) {
                    arr_json[i].action_change = 1;
                };
            }
        } else {
            var arr_json = $filter('filter')(arr_active, function (item) {
                return (item.seq == _item.seq);
            });
            if (action == 'submit' && arr_json.length == 0) {
                for (let i = 0; i < arr_json.length; i++) {
                    arr_json[i].action_change = 1;
                };
            }
        }
        var json_managerecom = angular.toJson(arr_json);


        var user_name = $scope.user_name;
        var flow_action = action;
        var token_doc = conFig.pha_seq();
        var sub_software = 'hazop';

        $.ajax({
            url: url_ws + "Flow/set_follow_up_review",
            data: '{"sub_software":"' + sub_software + '","user_name":"' + user_name + '","token_doc":"' + token_doc + '"'
                + ',"flow_action": "' + flow_action + '"'
                + ', "json_managerecom": ' + JSON.stringify(json_managerecom)
                + ', "json_drawingworksheet": ' + JSON.stringify(json_drawingworksheet)
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
                var arr = $filter('filter')($scope.data_details, function (item) {
                    return ((item.seq == _item.seq && item.action_type == 'update'));
                });
                if (arr.length > 0) {
                    arr[0].action_type = 'update';
                    arr[0].action_change = 0;
                    arr[0].reviewer_action_type = (action == 'save' ? 1 : 2);

                    //update data_drawingworksheet  
                    $scope.data_drawingworksheet_delete = [];
                    for (let i = 0; i < $scope.data_drawingworksheet.length; i++) {
                        if ($scope.data_drawingworksheet[i].id_worksheet == _item.seq) {
                            if ($scope.data_drawingworksheet[i].action_type == 'update'
                                || ($scope.data_drawingworksheet[i].action_type == 'insert' && $scope.data_drawingworksheet[i].action_change == 1)) {
                                $scope.data_drawingworksheet[i].action_type = 'update';
                                $scope.data_drawingworksheet[i].action_change = 0;
                            }
                        }
                    }
                    if (action == 'save') {
                        $scope.Action_Msg_Header = 'Success';
                        $scope.Action_Msg_Detail = 'Data has been successfully saved.';
                    } else {
                        $scope.Action_Msg_Header = 'Success';
                        $scope.Action_Msg_Detail = 'Data has been successfully submitted.'; 
                    }
                    apply();

                    if (true) {
                        var arr = $filter('filter')($scope.data_details, function (item) {
                            return (item.reviewer_action_type == 2);
                        });

                        if (arr.length == $scope.data_details.length) {
                            window.open("Home/Portal", "_top");
                        } else {
                            //window.open("hazop/FollowupUpdate", "_top");
                            //set_alert('Success', 'Data has been successfully saved.');
                            $('#modalMsg').modal('show');
                        }
                    }

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

    $scope.openModalDataRAM = function (ram_type, _item, ram_type_action, id_ram, preview) {
        var seq = _item.seq;

        $scope.selectdata_nodeworksheet = seq;
        $scope.selectedDataNodeWorksheetRamType = ram_type;
        $scope.selectedDataRamTypeAction = ram_type_action;

        $scope.selectedDataID_Ram = id_ram;
        if (ram_type_action == 'after') {
            $scope.cal_ram_action_security = _item.ram_after_security;
            $scope.cal_ram_action_likelihood = _item.ram_after_likelihood;
            $scope.cal_ram_action_risk = _item.ram_after_risk;
        } else {
            $scope.cal_ram_action_security = _item.ram_action_security;
            $scope.cal_ram_action_likelihood = _item.ram_action_likelihood;
            $scope.cal_ram_action_risk = _item.ram_action_risk;
        }
        $scope.cal_ram_action_security = ($scope.cal_ram_action_security == null ? 'N/A' : $scope.cal_ram_action_security);
        $scope.cal_ram_action_likelihood = ($scope.cal_ram_action_likelihood == null ? 'N/A' : $scope.cal_ram_action_likelihood); 
        $scope.cal_ram_action_risk = ($scope.cal_ram_action_risk == null ? 'N/A' : $scope.cal_ram_action_risk);

        var arr_items = $filter('filter')($scope.master_ram_level, function (item) { return (item.id_ram == id_ram); });
        var category_type = Number(arr_items[0].category_type);
        $scope.selectedDataRamType = category_type;

        $scope.previewRam = (preview == true ? true : false);
        if ($scope.data_details.length > 0) {

            if (($scope.flow_status == 14 ? _item.reviewer_action_type : _item.responder_action_type) == 2) {
                $scope.previewRam = true;
            }

        }


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

    $scope.downloadFile = function (item) {

        //<b>{{(item.document_file_size>0? item.document_file_name + '('+  item.document_file_size + 'KB)' : '')}}</b>

        //document_file_name:"HAZOP Report 202311281602.pdf"
        //document_file_path:"https://localhost:7098/AttachedFileTemp/hazop/HAZOP-2023-0000001-DRAWING-202312251052.PDF"
        //document_file_size:288

        if (item.document_file_name != '') {
            //var path = (url_ws).replace('/api/', '') + item.document_file_path;
            var path = item.document_file_path;
            var name = item.document_file_name;

            $scope.exportfile[0].DownloadPath = path;
            $scope.exportfile[0].Name = name;

            $('#modalExportFile').modal('show');
            apply();
        }
    }

    $scope.downloadFileOwner = function (item) {

        $scope.id_worksheet_select = item.seq;

        $('#modalExportResponderFile').modal('show');
    }

    $scope.downloadFileReviewer = function (item) {

        $scope.id_worksheet_select = item.seq;

        $('#modalExportReviewerFile').modal('show');
    }
});
