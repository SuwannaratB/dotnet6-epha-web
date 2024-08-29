
AppMenuPage.controller("ctrlAppPage", function ($scope, $http, $filter, conFig,$rootScope,$window,$timeout) {
    $('#divLoading').hide();


    //  add file 
    $scope.clearFileName = function (detail_seq,inputId) {

        /*var fileUpload = document.getElementById('attfile-' + inputId);
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
        clear_form_valid();*/
        
        var fileInput = document.getElementById('attfile-' + inputId);
        if (fileInput) {
            fileInput.value = '';
        }

        const fileInfoSpan = document.getElementById('filename' + inputId);
        fileInfoSpan.textContent = "";
        $scope.status_upload = false;

        var arr = $filter('filter')($scope.data_drawingworksheet,
            function (item) { return (item.seq == inputId); }
        );

        if (arr.length > 0) {
            arr[0].document_file_name = null;
            arr[0].document_file_size = null;
            arr[0].document_file_path = null;
            arr[0].action_change = 1;
            apply();
        }

        var arr_details = $filter('filter')($scope.data_details, function (item) { return (item.seq == detail_seq); });
        if (arr_details.length > 0 ) {
            if($scope.data_header[0].pha_status === 13){
                arr_details[0].document_file_name_owner = null;
                arr_details[0].document_file_size_owner = null;
                arr_details[0].document_file_path_owner = null;
                arr_details[0].action_change = 1;
                apply();
            }else if($scope.data_header[0].pha_status === 14){
                arr_details[0].document_file_name = null;
                arr_details[0].document_file_size = null;
                arr_details[0].document_file_path = null
                arr_details[0].action_change = 1;
                apply();
            }
        }

    };

    $scope.fileSelect = function (input, file_part) {
        //drawing, responder, approver
        var file_doc = $scope.data_header[0].pha_no;
        const fileInput = input;
        const fileSeq = fileInput.id.split('-')[1];
        const fileInfoSpan = document.getElementById('filename' + fileSeq);

        // Function to truncate file name
        function truncateFilename(filename, length) {
            if (!filename) return '';
            if (filename.length <= length) return filename;
            const start = filename.slice(0, Math.floor(length / 2));
            const end = filename.slice(-Math.floor(length / 2));
            return `${start}.......${end}`;
        }

        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const fileName = file.name;
            const fileSize = Math.round(file.size / 1024);
            try {
                const truncatedFileName = truncateFilename(fileName, 20);
                if (fileInfoSpan) {
                    fileInfoSpan.textContent = `${truncatedFileName} (${fileSize} KB)`;
                }
            } catch (error) {
                console.error('Error updating file info:', error);
            }


            if (file) {
                const allowedFileTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'png', 'gif'];
            
                const fileExtension = fileName.split('.').pop().toLowerCase(); 
                if (allowedFileTypes.includes(fileExtension)) {
                    var file_path = uploadFile(file, fileSeq, fileName, fileSize, file_part, file_doc);
                } else {
                    set_alert('Warning', "The selected file type is not supported. Please upload a PDF, Word, Excel, or Image file.");
                }
            
            } else {
                set_alert('Error', "No file selected. Please select a file to upload.");
            }

        } else {
            fileInfoSpan.textContent = "";
        }
    }   

    function uploadFile(file_obj, seq, file_name, file_size, file_part, file_doc) {

        console.log("call upload file ")
        var fd = new FormData();
        //Take the first selected file
        fd.append("file_obj", file_obj);
        fd.append("file_seq", seq);
        fd.append("file_name", file_name);
        fd.append("file_doc", file_doc);
        fd.append("file_part", file_part);//drawing, responder, approver
        fd.append("file_doc", file_doc);

        fd.append("file_doc", file_doc);
        fd.append("file_part", file_part);//drawing, responder, approver

        // JavaScript file-like object 
        try {
            //const request = new XMLHttpRequest();
            //request.open("POST", url_ws + 'Flow/uploadfile_data_followup');
            //request.send(fd);
             
            //var arr = $filter('filter')($scope.data_drawingworksheet, function (item) { return (item.seq == seq); });
            //if (arr.length > 0) {
            //    arr[0].document_file_name = file_name;
            //    arr[0].document_file_size = file_size;
            //    arr[0].document_file_path = url_ws + 'AttachedFileTemp/FollowUp/' + file_name;
            //    arr[0].document_module = $scope.document_module;
            //    arr[0].action_change = 1;
            //    apply();
            //}


            try {
                $("#divLoading").show(); 
                const request = new XMLHttpRequest();
                request.open("POST", url_ws + 'Flow/uploadfile_data_followup');

                request.onreadystatechange = function () {
                    if (request.readyState === XMLHttpRequest.DONE) {
                        if (request.status === 200) {
                            // รับค่าที่ส่งมาจาก service ที่ตอบกลับมาด้วย responseText
                            const responseFromService = request.responseText;
                            let parsedResponse;
                            
                            try {
                                parsedResponse = JSON.parse(responseFromService);
                            } catch (e) {
                                console.error("Failed to parse JSON response:", e);
                                return;
                            }

                            if (parsedResponse && parsedResponse.msg && parsedResponse.msg[0].STATUS === "true") {

                                // ทำอะไรกับข้อมูลที่ได้รับเช่น แสดงผลหรือประมวลผลต่อไป
                                const jsonArray = JSON.parse(responseFromService);
    
                                var file_name = jsonArray.msg[0].ATTACHED_FILE_NAME;
                                var file_path = jsonArray.msg[0].ATTACHED_FILE_PATH;
                                
                                var arr_details = $filter('filter')($scope.data_details, function (item) { return (item.seq == $scope.seqUpload); });
                                if (arr_details.length > 0 ) {
                                    if($scope.data_header[0].pha_status === 13){
                                        arr_details[0].document_file_name_owner = file_name;
                                        arr_details[0].document_file_size_owner = file_size;
                                        arr_details[0].document_file_path_owner = service_file_url + file_path;// (url_ws.replace('/api/', '/')) + 'AttachedFileTemp/Hazop/' + file_name;
                                        arr_details[0].action_change = 1;
                                        apply();
                                    }else if($scope.data_header[0].pha_status === 14){
                                        arr_details[0].document_file_name = file_name;
                                        arr_details[0].document_file_size = file_size;
                                        arr_details[0].document_file_path = service_file_url + file_path;// (url_ws.replace('/api/', '/')) + 'AttachedFileTemp/Hazop/' + file_name;
                                        arr_details[0].action_change = 1;
                                        apply();
                                    }
                                }

                                var arr = $filter('filter')($scope.data_drawingworksheet, function (item) { return (item.seq == seq); });
                                if (arr.length > 0) {
                                    arr[0].document_file_name = file_name;
                                    arr[0].document_file_size = file_size;
                                    arr[0].document_file_path = service_file_url + file_path;// (url_ws.replace('/api/', '/')) + 'AttachedFileTemp/Hazop/' + file_name;
                                    arr[0].document_module = $scope.document_module;
                                    arr[0].action_change = 1;
                                    clear_valid_items('upload_file-'+ $scope.seqUpload);
                                    $scope.seqUpload = null;
                                    apply();

                                }

                                $("#divLoading").hide(); 
                                set_alert('Success', 'File attached successfully.');
    
                            }else{
    
                                $("#divLoading").hide(); 
                                set_alert('Warning', 'Unable to connect to the service. Please check your internet connection or try again later.');
                            }

                        } else {
                            $("#divLoading").hide(); 

                            // กรณีเกิดข้อผิดพลาดในการร้องขอไปยัง server
                            console.error('มีข้อผิดพลาด: ' + request.status);
                        }
                    }
                };

                request.send(fd);

            } catch {$("#divLoading").hide();  }

        } catch (ex) { alert(ex); }

    }

    $scope.truncateFilename = function(filename, length) {
        if (!filename) return '';
        if (filename.length <= length) return filename;
        const start = filename.slice(0, Math.floor(length / 2));
        const end = filename.slice(-Math.floor(length / 2));
        return `${start}.......${end}`;
    };


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

    $scope.toggleChanged = function() {

        if($scope.flow_role_type === 'admin'){
            return false;
        }

        $scope.toggleStatus = !$scope.toggleStatus
        if ($scope.toggleStatus) {
            var list =  $filter('filter')($scope.data_details_old, function (item) { 
                return (item.responder_user_name == $scope.user_name); 
            });
            $scope.data_details = list;
        } else{
            $scope.data_details = $scope.data_details_old;
        }
    };

    function arr_def() {
        $scope.toggleStatus = false;

        $scope.selectViewTypeFollowup = true;
        $scope.action_part = 1;
        $scope.user_name = conFig.user_name();

        $scope.pha_sub_software = conFig.pha_sub_software().toLowerCase()

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

        $scope.select_rows_level = 5;
        $scope.select_columns_level = 5;
        $scope.selected_ram_img = (url_ws.replace('/api/', '/')) + 'AttachedFileTemp/rma-img-' + $scope.select_rows_level + 'x' + $scope.select_columns_level + '.png';


        $scope.employeelist = [];
        $scope.implementItem = [];
        $scope.fileInfoSpan = '';

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
    $scope.actionChangedRisk = function (item) {
        console.log(item)
        item.residual_risk_rating = item.residual_risk;
        item.action_change = 1;
        apply();
    }
    $scope.actionChangedDataComment = function (item) {
        item.action_change = 1;
        apply();
    }
    $scope.selectDocPreview = function () {

        //open document 
        var controller_text =  'hazop';//item.pha_sub_software;
        var pha_sub_software = conFig.pha_sub_software().toLowerCase()//'hazop';//item.pha_sub_software;
        var pha_status = $scope.flow_status;

        conFig.pha_seq = $scope.data_details[0].seq;
        conFig.pha_type_doc = 'preview';

        $.ajax({
            url: controller_text + "/next_page",
            data: '{"pha_seq":"' + conFig.pha_seq + '","pha_type_doc":"' + conFig.pha_type_doc + '"'
                + ',"pha_sub_software":"' + pha_sub_software + '","pha_status":"' + pha_status + '"}',
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
        console.log("item_draw",item_draw)
        console.log("$scope.data_drawingworksheet",$scope.data_drawingworksheet)
        var seq = item_draw.seq;
        /*var fileUpload = document.getElementById('attfile-' + seq);
        var fileNameDisplay = document.getElementById('filename' + seq);

        fileUpload.value = ''; // ล้างค่าใน input file
        fileNameDisplay.textContent = ''; // ล้างข้อความที่แสดงชื่อไฟล์*/

        //หา same  id_worksheet if > 1 splice item_draw , if === 1 set null
        var item_draw_worksheet = $scope.data_drawingworksheet.filter(function(item) {
            return item.id_worksheet === item_draw.id_worksheet;
        });
    
        if (item_draw_worksheet.length === 1) {
            item_draw.document_file_name = "";
            item_draw.document_file_path = "";
            item_draw.document_file_size = 0;
        } else {
            var del_item_draw = $scope.data_drawingworksheet.findIndex(function(item) {
                return item.seq === item_draw.seq;
            });
            if (del_item_draw !== -1) {
                $scope.data_drawingworksheet.splice(del_item_draw, 1);
            }
        }

        //var del = document.getElementById('del-' + seq);
        //del.style.display = "none";

        /*if ($scope.data_drawingworksheet.length > 1) {
            var arr = $filter('filter')($scope.data_drawingworksheet, function (item) { 
                return (item.seq != seq); 
            });
            $scope.data_drawingworksheet = arr;
        }*/

        // var arr = $filter('filter')($scope.data_drawingworksheet, function (item) { return (item.seq == seq); });
        // if (arr.length > 0) {
        //     arr[0].document_file_name = null;
        //     arr[0].document_file_size = 0;
        //     arr[0].document_file_path = null;
        //     arr[0].action_type = 'delete';
        //     arr[0].action_change = 1;
        //     apply();
        // }

        // var arr = $filter('filter')($scope.data_drawingworksheet, function (item) { 
        //     return (item.seq == seq && !(item.action_type == 'delete')); 
        // });

        // if (arr.length == 0) {
        //     $scope.addDataWorksheetDrawing(item_draw, seq_nodeworksheet);
        // }

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
        var sub_software = conFig.pha_sub_software().toLowerCase(); //'hazop';
        
        if (responder_user_name == "undefined") {
            responder_user_name = "";
        }

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
                $('#divPage').addClass('d-none');

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

                if (arr.general[0].pha_sub_software == 'hra') {
                    arr.details = setupDetails(arr.details)
                    arr.drawingworksheet = setupDrawingworksheet(arr.drawingworksheet, arr.details)
                }

                $scope.data_pha_doc = arr.pha_doc;//pha_status,pha_no
                $scope.data_header = arr.general;
                $scope.data_general = arr.general;
                $scope.data_details = arr.details;
                $scope.data_details_old = arr.details;

                //call to check who can Access
                /*console.log($scope.data_details[0].responder_user_name)
                if($scope.data_details){
                    $scope.canAccess($scope.data_details)
                }*/
                $scope.data_drawingworksheet = arr.drawingworksheet;
                $scope.data_drawingworksheet_responder = arr.drawingworksheet_responder;
                $scope.data_drawingworksheet_reviewer = arr.drawingworksheet_reviewer;
                $scope.selected_ram_img = (url_ws.replace('/api/', '/')) + 'AttachedFileTemp/rma-img-' + $scope.select_rows_level + 'x' + $scope.select_columns_level + '.png';

                // add key implement def true for status 13 
                $scope.data_details.forEach(function(_item) {
                    if ($scope.data_pha_doc != 14  && _item.responder_action_type === 0) {
                        _item.implement = false;
                    }else{
                        console.log("it ")
                        _item.implement = _item.implement === 1 ? true : false;
                    }
                });


                if (true) {
                    $scope.MaxSeqdata_drawing_worksheet = 0;
                    var arr_check = $filter('filter')(arr.max, function (item) { return (item.name == 'drawingworksheet'); });
                    var iMaxSeq = 1; if (arr_check.length > 0) { iMaxSeq = arr_check[0].values; }
                    $scope.MaxSeqdata_drawing_worksheet = iMaxSeq;
                }

                //เพิ่มแสดงข้อมูล RAM
                if (true) {

                    for (let i = 0; i < arr.ram.length; i++) {
                        arr.ram[i].document_file_path = (url_ws.replace('/api/', '/')) + arr.ram[i].document_file_path;
                        arr.ram[i].document_definition_file_path = (url_ws.replace('/api/', '/')) + arr.ram[i].document_definition_file_path;
                    }

                    
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
                
                // a.seq, a.pha_no, a.pha_version, a.pha_status, ms.descriptions
                $scope.flow_status = arr.pha_doc[0].pha_status;
                $scope.DetailsShow = '' + arr.pha_doc[0].pha_no + ' (' + arr.pha_doc[0].pha_request_name + ')';
                $scope.DetailsShow2 = '' + arr.pha_doc[0].pha_status_desc;
                $scope.document_module = (arr.pha_doc[0].pha_status == 13 ? 'followup' : 'review_followup');
 
                if($scope.flow_role_type != 'admin'){
                    $scope.toggleStatus = false;
                    $scope.toggleChanged();
                }                


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

    function setupDetails(details){
        if(!details) return [];

        details.forEach(element => {
            element.recommendations
        });

        details = $filter('filter')(details, function (_item) {
            return _item.recommendations
        });

        return details
    }

    function setupDrawingworksheet(drawing, details){
        if(!drawing && !details) return [];

        const result = drawing.filter(dw =>
            details.some(detail => detail.seq === dw.id_worksheet)
          );

        return result
    }
 
    $scope.confirmFollowBackSearch = function () {
        var page = conFig.controller_action_befor(); 
        window.open(page, "_top");
    }
    $scope.confirmFollowBack = function () {
        window.open('home/hometasks', "_top")
        // var page = conFig.controller_action_befor();
        // window.open(page, "_top")
    }
    $scope.confirmCancle = function () {
        var page = conFig.controller_action_befor();
        window.open(page, "_top")
    }

    $scope.actionSave = function (item) {

        if ($scope.flow_status == 13) {
            item.action_change = 1;

            if (item.implement) {
                // const validRemark = set_valid_items(item.responder_comment, 'remark-'+ item.seq);
                /*const validUploadFile = set_valid_items($scope.fileInfoSpan, 'upload_file-'+ item.seq);

                if (!validUploadFile) {
                    $scope.confirmSaveFollowup('save', item);
                }*/
                    $scope.confirmSaveFollowup('save', item);
            }else {
                var docfiles = $filter('filter')($scope.data_drawingworksheet, function (_item) {
                    return (_item.id_worksheet == item.seq && 
                            _item.action_type != 'delete' 
                    );
                })[0];

                const validRemark = set_valid_items(item.responder_comment, 'remark-'+ item.seq);
                //const validUploadFile = set_valid_items(docfiles.document_file_name, 'upload_file-'+ item.seq);
                const validComment= set_valid_items(item.reviewer_comment, 'comment-'+ item.seq);
                if (!validRemark  && !validComment) {
                    $scope.confirmSaveFollowup('save', item);
                }
            }//&& !validUploadFile

        } else if ($scope.flow_status == 14) {
            item.action_change = 1;

            if (item.action_status == 'Close with condition') {
                const validComment = set_valid_items(item.reviewer_comment, 'comment-'+ item.seq);

                if(validComment) return
            }
            $scope.confirmSaveReviewFollowup('save', item);
        }

    };

    $scope.actionImplement = function (item) {
        var docfiles = $filter('filter')($scope.data_drawingworksheet, function (_item) {
            return (_item.id_worksheet == item.seq && 
                    _item.action_type != 'delete' &&
                    _item.document_file_name != null
            );
        });

        if (docfiles.length > 0) {
            $scope.fileInfoSpan = docfiles[0].document_file_name;
        }else {
            $scope.fileInfoSpan = '';
        }

        $scope.data_details.forEach(function (_item) {
            if (item.seq == _item.seq) {
                _item.implement = !_item.implement;

                if (!_item.implement) {
                    set_valid_items(_item.responder_comment, 'remark-'+_item.seq);
                    set_valid_items($scope.fileInfoSpan, 'upload_file-'+_item.seq);
                }else {
                    clear_valid_items('remark-'+_item.seq);
                    clear_valid_items('upload_file-'+_item.seq);
                }
             
            }
        });
    }

    $scope.actionInput = function (item) {
        $scope.data_details.forEach(function (_item) {
            if (item.seq == _item.seq && !item.implement) {
                // const field = 'remark-'+_item.seq
                set_valid_items(_item.responder_comment, 'remark-'+_item.seq);
                // set_valid_items(_item.responder_comment, 'upload_file-'+_item.seq);
            }
        });

    }

    $scope.setSeqUpload = function (seq) {

        $scope.seqUpload = seq;
    }

    function set_valid_items(_item, field) {
        try {
            var id_valid = document.getElementById('valid-' + field);
            if (_item == '' || _item == null) {
                id_valid.className = "feedback text-danger";
                id_valid.focus();
                return true;
            } else { 
                id_valid.className = "invalid-feedback text-danger"; 
                return false; 
            }

        } catch (ex) { }
    }

    function clear_valid_items(field) {
        var id_valid = document.getElementById('valid-' + field);

        try{
            id_valid.className = "invalid-feedback text-danger";

        }catch{}
    }
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

            // if ($scope.data_drawingworksheet == null) { 
            //     $scope.form_valid.valid_document_file = true; 
            //     return; 
            // }

            // check implement
            if (item.implement) {
                if ($scope.data_header[0].pha_status === 13) {
                    if (!item.document_file_name_owner) {
                        const validUploadFile = set_valid_items(item.document_file_name, 'upload_file-' + item.seq);
                        if (validUploadFile) {
                            return;
                        }
                    }
                } else if ($scope.data_header[0].pha_status === 14) {
                    if (!item.document_file_name) {
                        const validUploadFile = set_valid_items(item.document_file_name, 'upload_file-' + item.seq);
                        if (validUploadFile) {
                            return;
                        }
                    }
                }

            }else {
                var docfiles = $filter('filter')($scope.data_drawingworksheet, function (_item) {
                    return (_item.id_worksheet == item.seq && 
                            _item.action_type != 'delete' 
                    );
                })[0];

                const validRemark = set_valid_items(item.responder_comment, 'remark-'+ item.seq);
                const validUploadFile = set_valid_items(docfiles.document_file_name, 'upload_file-'+ item.seq);
                if (validRemark || validUploadFile) {
                    return
                }
            }


            if ($scope.data_drawingworksheet.length > 0) {
                var arr_drawing = $filter('filter')($scope.data_drawingworksheet, function (item) {
                    return (item.id_worksheet == $scope.id_worksheet_select); /* && item.document_file_name != null*/
                });
                if (arr_drawing.length == 0) { $scope.form_valid.valid_document_file = true; return; } else {
                    //document_file_name 
                }
            }


            if ($scope.flow_status == 14) {
                // item.reviewer_action_type
                var arr_active = [];
                angular.copy($scope.data_details, arr_active);
                 
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

            //item$scope.isSelectFile = true;

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
                return ((item.seq == _item.seq && item.action_type == 'update' && item.action_change == 1 )
                    || item.action_type == 'insert');
            });

        } else {
            var arr_json = $filter('filter')(arr_active, function (item) {
                return (item.seq == _item.seq);
            });

            for (let i = 0; i < arr_json.length; i++) {
                arr_json[i].responder_action_type = arr_json[i].responder_action_type = 2;
                arr_json[i].action_change = arr_json[i].action_change = 1;
            }    
        }

        // Set item.implement bfor save
        for (let i = 0; i < arr_json.length; i++) {
            arr_json[i].implement = arr_json[i].implement === true ? 1 : 0;
        }        

        var json_managerecom = angular.toJson(arr_json);
        var json_drawingworksheet = check_data_drawingworksheet(_item.seq);

        var user_name = $scope.user_name;
        var flow_action = action;
        var token_doc = _item.ID_PHA;

        //alert(url_ws + "Flow/set_follow_up");
        var sub_software = conFig.pha_sub_software().toLowerCase(); 

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
                    arr[0].action_status = 'Responed';
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
                        if (action === 'save' || $scope.flow_role_type === 'admin') {
                            
                            
                            var arr = $filter('filter')($scope.data_details, function(item) {
                                return item.responder_action_type === 0 || item.responder_action_type === 1;
                            });

                            if(arr.length > 0){
                                get_detail(true);
                            }else if ($scope.flow_role_type === 'admin') {
                                window.open("Home/Portal", "_top");
                            }

                        } else {

                            var arr = $filter('filter')($scope.data_details, function(item) {
                                return item.responder_action_type === 0 || item.responder_action_type === 1;
                            });
                    
                            if (arr.length && $scope.user_name) {
                                var userExists = arr.some(function(detail) {
                                    return detail.responder_user_name === $scope.user_name;
                                });
                    
                                if (userExists) {
                                    get_detail(true);
                                } else {
                                    window.open("Home/Portal", "_top");
                                }
                            } else { 
                                setTimeout(function() {
                                    $('#modalMsg').modal('show');
                                }, 1000); 
                    
                                $('#modalMsg').modal('hide');
                    
                                setTimeout(function() {
                                    window.open("Home/Portal", "_top");
                                }, 2000); 
                            }
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
          
        console.log(action, _item)
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
        console.log("arr_json",arr_json)


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

        // Set item.implement bfor save
        for (let i = 0; i < arr_json.length; i++) {
            arr_json[i].implement = arr_json[i].implement === true ? 1 : 0;
        }  

        console.log("arr_json",arr_json)

        var json_managerecom = angular.toJson(arr_json);

        var user_name = $scope.user_name;
        var flow_action = action;
        var token_doc = conFig.pha_seq();
        var sub_software = conFig.pha_sub_software().toLowerCase() 

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
                            $('#modalMsg').modal('show');
                        }
                    }
                    page_load()
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
        if (arr_items.length > 0) {

            //$scope.select_rows_level = arr_items[0].rows_level;
            //$scope.select_columns_level = arr_items[0].columns_level;
        }
        var category_type = Number(arr_items[0].category_type);
        $scope.selectedDataRamType = category_type;

        $scope.previewRam = (preview == true ? true : false);
        if ($scope.data_details.length > 0) {

            if (($scope.flow_status == 14 ? _item.reviewer_action_type : _item.responder_action_type) == 2) {
                $scope.previewRam = true;
            }

        }



        apply();

        $('#modalRAM').modal({
            backdrop: 'static',
            keyboard: false 
        }).modal('show');
        
    };

    $scope.closeModalDataRAM_Worksheet = function() {
        $scope.cal_ram_action_security = null;
        $scope.cal_ram_action_likelihood = null;
        $scope.cal_ram_action_risk = null; 
    };

    /*$scope.openModalDataRAM = function (ram_type, _item, ram_type_action, id_ram, preview) {
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
        if (arr_items.length > 0) {

            //$scope.select_rows_level = arr_items[0].rows_level;
            //$scope.select_columns_level = arr_items[0].columns_level;
            $scope.selected_ram_img = (url_ws.replace('/api/', '/')) + arr_items[0].document_file_path;
        }
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
    }*/
    $scope.selectDataRAM = function (ram_type, id_select) {

        var xseq = $scope.selectdata_nodeworksheet;
        var xbefor = $scope.selectedDataRamTypeAction;

        for (let i = 0; i < $scope.data_details.length; i++) {
            try {

                if ($scope.data_details[i].seq !== xseq) { continue; }

                if (xbefor == "befor" && ram_type == "s") { $scope.data_details[i].ram_befor_security = id_select; }
                if (xbefor == "befor" && ram_type == "l") { $scope.data_details[i].ram_befor_likelihood = id_select; }

                if (xbefor == "after" && ram_type == "s") { $scope.data_details[i].ram_after_security = id_select; }
                if (xbefor == "after" && ram_type == "l") { $scope.data_details[i].ram_after_likelihood = id_select; }

                if (xbefor == "action" && ram_type == "s") { $scope.data_details[i].ram_action_security = id_select; }
                if (xbefor == "action" && ram_type == "l") { $scope.data_details[i].ram_action_likelihood = id_select; }

                var ram_security = $scope.data_details[i].ram_befor_security + "";
                var ram_likelihood = $scope.data_details[i].ram_befor_likelihood + "";
                var ram_risk = "";
                if (xbefor == "after") {
                    ram_security = $scope.data_details[i].ram_after_security + "";
                    ram_likelihood = $scope.data_details[i].ram_after_likelihood + "";
                }
                if (xbefor == "action") {
                    ram_security = $scope.data_details[i].ram_action_security + "";
                    ram_likelihood = $scope.data_details[i].ram_action_likelihood + "";
                }
                if (ram_security == "" || ram_likelihood == "") {
                    if (xbefor == "befor") { $scope.data_details[i].ram_befor_risk = ""; }
                    else if (xbefor == "after") { $scope.data_details[i].ram_after_risk = ""; }
                    else if (xbefor == "action") { $scope.data_details[i].ram_action_risk = ""; }
                    break;
                }


                var safety_critical_equipment = 'N';
                var id_ram = ($scope.data_general[0].id_ram === undefined || $scope.data_general[0].id_ram === null) ? '5' : $scope.data_general[0].id_ram;

                var arr_items = $filter('filter')($scope.master_ram_level, function (item) {
                    return (item.id_ram == id_ram && item.security_level == ram_security);
                });

                if (arr_items.length > 0) {
                    //check ram_likelihood ว่าตก columns ไหน เพื่อหา ram1_priority
                    if (ram_likelihood == arr_items[0].likelihood1_level) { ram_risk = arr_items[0].ram1_priority; safety_critical_equipment = arr_items[0].likelihood1_criterion; }
                    else if (ram_likelihood == arr_items[0].likelihood2_level) { ram_risk = arr_items[0].ram2_priority; safety_critical_equipment = arr_items[0].likelihood2_criterion; }
                    else if (ram_likelihood == arr_items[0].likelihood3_level) { ram_risk = arr_items[0].ram3_priority; safety_critical_equipment = arr_items[0].likelihood3_criterion; }
                    else if (ram_likelihood == arr_items[0].likelihood4_level) { ram_risk = arr_items[0].ram4_priority; safety_critical_equipment = arr_items[0].likelihood4_criterion; }
                    else if (ram_likelihood == arr_items[0].likelihood5_level) { ram_risk = arr_items[0].ram5_priority; safety_critical_equipment = arr_items[0].likelihood5_criterion; }
                    else if (ram_likelihood == arr_items[0].likelihood6_level) { ram_risk = arr_items[0].ram6_priority; safety_critical_equipment = arr_items[0].likelihood6_criterion; }
                    else if (ram_likelihood == arr_items[0].likelihood7_level) { ram_risk = arr_items[0].ram7_priority; safety_critical_equipment = arr_items[0].likelihood7_criterion; }
                    else if (ram_likelihood == arr_items[0].likelihood8_level) { ram_risk = arr_items[0].ram8_priority; safety_critical_equipment = arr_items[0].likelihood8_criterion; }
                    else if (ram_likelihood == arr_items[0].likelihood9_level) { ram_risk = arr_items[0].ram9_priority; safety_critical_equipment = arr_items[0].likelihood9_criterion; }
                    else if (ram_likelihood == arr_items[0].likelihood10_level) { ram_risk = arr_items[0].ram10_priority; safety_critical_equipment = arr_items[0].likelihood10_criterion; }
                }

                if (xbefor == "befor" && (ram_type == "s" || ram_type == "l")) {
                    $scope.data_details[i].safety_critical_equipment = safety_critical_equipment;
                }

                if (xbefor == "befor") { $scope.data_details[i].ram_befor_risk = ram_risk; }
                else if (xbefor == "after") { $scope.data_details[i].ram_after_risk = ram_risk; }
                else if (xbefor == "action") { $scope.data_details[i].ram_action_risk = ram_risk; }

                if ($scope.data_details[i].action_type == 'update') {
                    $scope.data_details[i].action_change = 1;
                }

                var ram_type_action = $scope.selectedDataRamTypeAction;
                if (ram_type_action == 'after') {
                    $scope.cal_ram_action_security = $scope.data_details[i].ram_after_security;
                    $scope.cal_ram_action_likelihood = $scope.data_details[i].ram_after_likelihood;
                    $scope.cal_ram_action_risk = $scope.data_details[i].ram_after_risk;
                } else if (ram_type_action == 'befor') {
                    $scope.cal_ram_action_security = $scope.data_details[i].ram_befor_security;
                    $scope.cal_ram_action_likelihood = $scope.data_details[i].ram_befor_likelihood;
                    $scope.cal_ram_action_risk = $scope.data_details[i].ram_befor_risk;
                } else if (ram_type_action == 'action') {
                    $scope.cal_ram_action_security = $scope.data_details[i].ram_action_security;
                    $scope.cal_ram_action_likelihood = $scope.data_details[i].ram_action_likelihood;
                    $scope.cal_ram_action_risk = $scope.data_details[i].ram_action_risk;
                }
                action_type_changed($scope.data_details[i], $scope.data_details[i].seq);

                break;

            } catch (e) { }
        }

        apply();

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


    $scope.openModalTempletes = function(data_type, actions,seq_worksheet) {
        var user_name = $scope.data_details[0].responder_user_name;
        var seq = $scope.data_details[0].id_pha;
        var sub_software = $scope.data_details[0].pha_sub_software;
    
        var url = '';
        var data = '';

        console.log("seq_worksheet",seq_worksheet)
    
        // Determine the URL and data string based on the action type
        if (actions === 'owner') {
            url = url_ws + "Flow/export_recommendation_by_action_owner";
            data = '{"sub_software":"' + sub_software + 
                    '","user_name":"' + user_name + 
                    '","seq":"' + seq + 
                    '","export_type":"' + data_type + 
                    '"}'
        } else if (actions === 'item') {
            url = url_ws + "Flow/export_recommendation_by_item";
            data = '{"sub_software":"' + sub_software + 
                    '","user_name":"' + user_name + 
                    '","seq":"' + seq + 
                    '","export_type":"' + data_type +
                    '","seq_worksheet":"' + seq_worksheet + 
                    '"}'
        }

        $.ajax({
            url: url,
            data: data,
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
            beforeSend: function () {
                $('#modalExportFile').modal('hide');
                $('#divLoading').show();
            },
            complete: function () {
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
                        $('#modalTemplates').modal('show');
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

    function set_alert(header, detail) {
        $scope.Action_Msg_Header = header;
        $scope.Action_Msg_Detail = detail;
    
        $timeout(function() {
            $('#modalMsg').modal({
                backdrop: 'static',
                keyboard: false 
            }).modal('show');
    
            if (header === 'Success') {
                $timeout(function() {
                    $('#modalMsg').modal('hide');
                }, 2000);
            }
        });
    }

    //access each role
    $scope.Access_check = function(task) {
        // If user is an admin, allow access
        if ($scope.flow_role_type === 'admin') {
            return true;
        }
        
        // If user is an employee and the task belongs to them, allow access
        if ($scope.flow_role_type === 'employee' && $scope.user_name === task.responder_user_name) {
            return true;
        }
        
        //originator cant edit?
        return false;
    };
    
        //access each role
        $scope.Access_check = function(task) {
            let accessInfo = {
                canAccess: false,
                isAdmin: false,
                isEmployee: false,
                isOwner:false
            };
        
            // If user is an admin, allow access
            if ($scope.flow_role_type === 'admin') {
                accessInfo.canAccess = true;
                accessInfo.isAdmin = true;
                                
                return accessInfo;
            }
        
            // If user is an employee
            if ($scope.flow_role_type === 'employee') {
                // Check if the task belongs to the user (TA2)
                if ($scope.user_name === task.user_name) {

                    accessInfo.isOwner = true;
                    accessInfo.canAccess = true; 
                } else {

                    accessInfo.isEmployee = true;
                    accessInfo.canAccess = false; 
                }
            }
        
            return accessInfo;
        };
    
        
    $scope.hasResponderUserDisplayName = function(item) {
        return item.responder_user_displayname && item.responder_user_displayname.trim() !== '';
    };

    
});
