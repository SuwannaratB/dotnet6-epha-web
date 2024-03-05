
AppMenuPage.filter('MemberteamMultiFieldFilter', function () {
    return function (items, searchText) {
        if (!searchText) {
            return items.slice(0, 10); // Return the top 10 items when no search text is provided
        }

        searchText = searchText.toLowerCase();

        const filteredItems = items.filter(function (item) {
            return (
                item.employee_id.toLowerCase().includes(searchText) ||
                item.employee_displayname.toLowerCase().includes(searchText) ||
                item.employee_email.toLowerCase().includes(searchText)
            );
        });

        return filteredItems.slice(0, 10); // Return the top 10 items after filtering
    };
});
AppMenuPage.filter('ResponderMultiFieldFilter', function () {
    return function (items, searchResponderText) {
        if (!searchResponderText) {
            return items.slice(0, 10);
        }

        searchResponderText = searchResponderText.toLowerCase();

        const filteredItems = items.filter(function (item) {
            return (
                item.employee_id.toLowerCase().includes(searchResponderText.toLowerCase()) ||
                item.employee_displayname.toLowerCase().includes(searchResponderText.toLowerCase()) ||
                item.employee_email.toLowerCase().includes(searchResponderText.toLowerCase())
            );
        });

        return filteredItems.slice(0, 10);
    };
});
AppMenuPage.filter('ApproverMultiFieldFilter', function () {
    return function (items, searchApproverText) {
        if (!searchApproverText) {
            return items.slice(0, 10);
        }

        searchApproverText = searchApproverText.toLowerCase();

        const filteredItems = items.filter(function (item) {
            return (
                item.employee_id.toLowerCase().includes(searchApproverText) ||
                item.employee_displayname.toLowerCase().includes(searchApproverText) ||
                item.employee_email.toLowerCase().includes(searchApproverText)
            );
        });

        return filteredItems.slice(0, 10);
    };
});

AppMenuPage.controller("ctrlAppPage", function ($scope, $http, $filter, conFig) {
    //search list function
    $scope.autoComplete = function (DataFilter, idinput) {

        try {

            if ($scope.object_items_name != idinput) {
                var dropdown = document.querySelector(`.autocomplete-dropdown-${$scope.object_items_name}`);
                dropdown.style.display = 'block';
            }
            var dropdown = document.querySelector(`.autocomplete-dropdown-${idinput}`);
            $scope.object_items_name = idinput;

            if ($scope.autoText[idinput] && $scope.autoText[idinput].length > 0) {
                $scope.filteredItems[idinput] = DataFilter.filter(function (item) {
                    return item.name.toLowerCase().includes($scope.autoText[idinput].toLowerCase());
                });

                if (dropdown) {
                    dropdown.style.display = 'block';
                }
            } else {
                $scope.filteredItems[idinput] = DataFilter;
            }
        } catch (error) {

        }
    };

    $scope.selectItem = function (item, idinput) {
        $scope.autoText[idinput] = item.name;
        $scope.filteredItems[idinput] = [];
        console.log($scope.autoText)
        try {
            var dropdown = document.querySelector(`.autocomplete-dropdown-${idinput}`);
            if (dropdown) {
                dropdown.style.display = 'none';
            }
        } catch (error) {

        }
    };

});
AppMenuPage.controller("ctrlAppPage", function ($scope, $http, $filter, conFig, $document,$element) {
    //file:///D:/04KUL_PROJECT_2023/e-PHA/phoenix-v1.12.0/public/apps/email/compose.html

    $('#divLoading').hide();

    $document.on('keydown', function (event) {
        if (event.key == 'Escape') {
            // Perform your desired action here
            try {

                //var dropdown = document.querySelector(`.autocomplete-dropdown-${$scope.object_items_name}`);
                //dropdown.style.display = 'block'; 

                var _id = $scope.filteredArr[0].fieldID;
                const item_focus = document.getElementById(_id);
                // item_focus.focus();
                item_focus.blur();
                $scope.filteredArr[0].fieldID = null;

                // For example, you might want to close a modal or reset a form
                //$scope.$apply(); // If needed, trigger a digest cycle

            } catch (error) {

            }
        }
    });
    $scope.clearFileUploadName = function (seq) {

        try {

            $scope.data_general[0].file_upload_name = fileName;
            $scope.data_general[0].file_upload_size = fileSize;
            $scope.data_general[0].file_upload_path = (url_ws.replace('/api/', '/')) + 'AttachedFileTemp/' + sub_software + '/' + fileName;
            $scope.data_general[0].action_change = 1;
            apply();
        } catch { }

    };
    $scope.clearFileName = function (seq) {

        //var fileUpload = document.getElementById('attfile-' + inputId);
        //var fileNameDisplay = document.getElementById('filename' + inputId);
        //var del = document.getElementById('del-' + inputId);
        //fileUpload.value = ''; // ล้างค่าใน input file
        //fileNameDisplay.textContent = ''; // ล้างข้อความที่แสดงชื่อไฟล์
        //del.style.display = "none";

        var arr = $filter('filter')($scope.data_drawing, function (item) { return (item.seq == seq); });
        if (arr.length > 0) {
            arr[0].document_file_name = null;
            arr[0].document_file_size = null;
            arr[0].document_file_path = null;
            arr[0].action_change = 1;
            apply();
        }

    };
    $scope.clearFileNameRAM = function (seq) {

        var arr = $filter('filter')($scope.master_ram, function (item) { return (item.seq == seq); });
        if (arr.length > 0) {
            arr[0].document_file_name = null;
            arr[0].document_file_size = null;
            arr[0].document_file_path = null;
            arr[0].action_change = 1;
            apply();
        }

    };

    $scope.changeTab = function (selectedTab, nameTab) {
        angular.forEach($scope.tabs, function (tab) {
            tab.isActive = false;
        });
        selectedTab.isActive = true;

        // Set focus to the clicked tab element
        try {
            // alert(event.target);
            //var ev = event.target;
            // if (ev == null || ev == undefined) {
            //     document.getElementById(selectedTab.name + "-tab").addEventListener("click", function (event) {
            //         ev = event.target
            //     });
            // } 
            document.getElementById(selectedTab.name + "-tab").addEventListener("click", function (event) {
                ev = event.target
            });

            var tabElement = angular.element(ev);
            tabElement[0].focus();
        } catch (error) { }

        check_tab(selectedTab.name);

        apply();
    };


    $scope.fileUploadSelect = function (input) {
     
        const fileInput = input;
        const fileSeq = fileInput.id.split('-')[1];
        const fileInfoSpan = document.getElementById('file_upload_name');

        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const fileName = file.name;
            const fileSize = Math.round(file.size / 1024);
            fileInfoSpan.textContent = `${fileName} (${fileSize} KB)`;

            if (fileName.toLowerCase().indexOf('.xlsx') == -1) {
                fileInfoSpan.textContent = "";
                set_alert('Warning', 'Please select a Excle file.');
                return;
            }
           
            var fd = new FormData();
            //Take the first selected file
            fd.append("file_obj", file);
            fd.append("file_seq", fileSeq);
            fd.append("file_name", fileName);
            fd.append("sub_software", 'jsea');

            try {
                const request = new XMLHttpRequest();
                request.open("POST", url_ws + 'Flow/uploadfile_data');
                request.send(fd);

                $scope.data_general[0].file_upload_name = fileName;
                $scope.data_general[0].file_upload_size = fileSize;
                $scope.data_general[0].file_upload_path = (url_ws.replace('/api/', '/')) + 'AttachedFileTemp/' + sub_software + '/' + fileName;
                $scope.data_general[0].action_change = 1;
                apply();
            } catch { }


        } else {
            fileInfoSpan.textContent = "";
        }
    }
    $scope.fileSelect = function (input) {

        const fileInput = input;
        const fileSeq = fileInput.id.split('-')[1];
        const fileInfoSpan = document.getElementById('filename' + fileSeq);

        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const fileName = file.name;
            const fileSize = Math.round(file.size / 1024);
            fileInfoSpan.textContent = `${fileName} (${fileSize} KB)`;

            const allowedExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];

            if (allowedExtensions.indexOf(fileExtension) === -1) {
                fileInfoSpan.textContent = "";
                set_alert('Warning', 'Please select a PDF, Word, or Excel file.');
                return;
            }
    

            var file_path = uploadFile(file, fileSeq, fileName, fileSize);

        } else {
            fileInfoSpan.textContent = "";
        }
    }
    $scope.fileSelectRAM = function (input) {

        const fileInput = input;
        const fileSeq = fileInput.id.split('-')[1];
        const fileInfoSpan = document.getElementById('filename_ram_' + fileSeq);

        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const fileName = file.name;
            const fileSize = Math.round(file.size / 1024);
            fileInfoSpan.textContent = `${fileName} (${fileSize} KB)`;

            if (fileName.toLowerCase().indexOf('.pdf') == -1) {
                fileInfoSpan.textContent = "";
                set_alert('Warning', 'Please select a PDF file.');
                return;
            }

            var file_path = uploadFileRAM(file, fileSeq, fileName, fileSize);

        } else {
            fileInfoSpan.textContent = "";
        }
    }
    function uploadFileRAM(file_obj, seq, file_name, file_size) {
        var sub_software = 'jsea';// ram เก็บไว้ที่เดียวกกัน
        var fd = new FormData();
        //Take the first selected file
        fd.append("file_obj", file_obj);
        fd.append("file_seq", seq);
        fd.append("file_name", file_name);
        fd.append("sub_software", sub_software);

        try {
            const request = new XMLHttpRequest();
            request.open("POST", url_ws + 'Flow/uploadfile_data');
            request.send(fd);

            var arr = $filter('filter')($scope.master_ram, function (item) { return (item.seq == seq); });
            if (arr.length > 0) {
                arr[0].document_file_name = file_name;
                arr[0].document_file_size = file_size;
                arr[0].document_file_path = (url_ws.replace('/api/', '/')) + 'AttachedFileTemp/' + sub_software + '/' + file_name;
                arr[0].action_change = 1;
                apply();
            }
        } catch { }

        return "";
    }

    function uploadFile(file_obj, seq, file_name, file_size) {
        var sub_software = 'jsea';
        var fd = new FormData();
        //Take the first selected file
        fd.append("file_obj", file_obj);
        fd.append("file_seq", seq);
        fd.append("file_name", file_name);
        fd.append("sub_software", sub_software);

        try {
            const request = new XMLHttpRequest();
            request.open("POST", url_ws + 'Flow/uploadfile_data');
            request.send(fd);

            var arr = $filter('filter')($scope.data_drawing, function (item) { return (item.seq == seq); });
            if (arr.length > 0) {
                arr[0].document_file_name = file_name;
                arr[0].document_file_size = file_size;
                arr[0].document_file_path = (url_ws.replace('/api/', '/')) + 'AttachedFileTemp/' + sub_software + '/' + file_name;
                arr[0].action_change = 1;
                apply();
            }
        } catch { }

        return "";
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

    $scope.showFileName = function (inputId) {
        var fileUpload = document.getElementById('file-upload-' + inputId);
        var fileNameDisplay = document.getElementById('fileNameDisplay-' + inputId);
        var del = document.getElementById('del' + inputId);

        if (fileUpload !== null) { // check ว่าตัวแปรเป็นค่าว่างไม 
            fileUpload.onchange = function () {
                const selectedFile = fileUpload.files[0].name; // get ชื่อไฟล์ 
                // console.log(selectedFile); // แสดงชื่อไฟล์ผ่าน console 
                fileNameDisplay.textContent = ' File is ' + selectedFile + '';
            };
            del.style.display = "block";
        } else {
            console.error("fileUpload null.");
        }
    };

    $scope.clearFileName_non_case = function (inputId) {
        var fileUpload = document.getElementById('file-upload-' + inputId);
        var fileNameDisplay = document.getElementById('fileNameDisplay-' + inputId);
        var del = document.getElementById('del' + inputId);
        fileUpload.value = ''; // ล้างค่าใน input file
        fileNameDisplay.textContent = ''; // ล้างข้อความที่แสดงชื่อไฟล์
        del.style.display = "none";
    };

    $scope.changeSearchApprover = function () {

    }
    $scope.showCauseText = function (responder_user_id, workstep_no) {
        $scope.data_tasks_worksheet_show = [];
        var arr = $filter('filter')($scope.data_tasks_worksheet, function (item) { return (item.responder_user_id == responder_user_id && item.workstep_no == workstep_no); });

        angular.copy(arr, $scope.data_tasks_worksheet_show);

        $('#modalCauseText').modal('show');
    };

    $scope.clickExportReport = function () {
        $('#modalExportImport').modal('show');
    }
    $scope.confirmExport = function (export_report_type, data_type) {

        var seq = $scope.data_header[0].seq;
        var user_name = $scope.user_name;

        var action_export_report_type = "jsea_report";

        if (export_report_type == "jsea_report") {
            action_export_report_type = "export_jsea_report";
        } else if (export_report_type == "jsea_worksheet") {
            action_export_report_type = "export_jsea_worksheet";
        } else if (export_report_type == "jsea_recommendation") {
            action_export_report_type = "export_jsea_recommendation";
        } else if (export_report_type == "jsea_ram") {
            action_export_report_type = "export_hazop_ram";
        } else {
            return;
        }

        $.ajax({
            url: url_ws + "Flow/" + action_export_report_type,
            data: '{"sub_software":"jsea","user_name":"' + user_name + '","seq":"' + seq + '","export_type":"' + data_type + '"}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
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
                        //$('#modalLoadding').modal('hide');
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


    $scope.export_template_data = function (item) {

        var seq = $scope.data_header[0].seq;
        var user_name = $scope.user_name;

        var action_export_report_type = "export_template_jsea";
        var data_type = "template";

        $.ajax({
            url: url_ws + "Flow/" + action_export_report_type,
            data: '{"sub_software":"jsea","user_name":"' + user_name + '","seq":"' + seq + '","export_type":"' + data_type + '"}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
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
                        //$('#modalLoadding').modal('hide');
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

    var url_ws = conFig.service_api_url();

    function arr_def() {
        $scope.object_items_name = null;

        $scope.selectViewTypeFollowup = true;

        $scope.action_part = 1;
        $scope.user_name = conFig.user_name();
        $scope.pha_seq = conFig.pha_seq();
        $scope.pha_type_doc = conFig.pha_type_doc();

        $scope.data_all = [];

        $scope.master_company = [];
        $scope.master_apu = [];
        $scope.master_toc = [];
        $scope.master_unit_no = [];
        $scope.master_tagid = [];
        $scope.master_ram = [];
        $scope.master_ram_level = [];
        $scope.master_security_level = [];
        $scope.master_likelihood_level = [];

        $scope.data_header = [];
        $scope.data_general = [];
        $scope.data_tagid_audition = [];
        $scope.data_session = [];
        $scope.data_memberteam = [];
        $scope.data_drawing = [];

        $scope.data_tasks_worksheet = [];

        $scope.data_session_delete = [];
        $scope.data_memberteam_delete = [];
        $scope.data_drawing_delete = [];

        $scope.data_tasks_worksheet_delete = [];

        $scope.select_history_tracking_record = false;

        $scope.selectedDataworksheetRamType = null;
        $scope.selectedDataNodeWorksheetRamType = null;

        $scope.select_rows_level = 5;
        $scope.select_columns_level = 5;
        $scope.selected_ram_img = (url_ws.replace('/api/', '/')) + 'AttachedFileTemp/rma-img-' + 5 + 'x' + 5 + '.png';

        $scope.data_tasks_worksheet_show = [];


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


        $scope.searchdataMemberTeam = '';
        $scope.searchdataResponder = '';
        $scope.searchdataApprover = '';

        $scope.sub_software = 'JSEA';

        $scope.tabs = [
            { name: 'general', action_part: 1, title: 'General Information', isActive: true, isShow: false },
            { name: 'ram', action_part: 2, title: 'RAM', isActive: false, isShow: false },
            { name: 'worksheet', action_part: 3, title: $scope.sub_software + ' Worksheet', isActive: false, isShow: false },
            { name: 'relatedpeople', action_part: 4, title: ' Review & Approver Person', isActive: false, isShow: false },
            { name: 'report', action_part: 5, title: 'Report', isActive: false, isShow: false }
        ];

    }

    function check_tab(val) {

        $scope.action_part = 1;
        var arr_tab = $filter('filter')($scope.tabs, function (item) { return (item.name == val); });
        if (arr_tab.length > 0) { $scope.action_part = Number(arr_tab[0].action_part); }
    }

    function get_max_id() {
        var arr = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'session'); });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqDataSession = iMaxSeq;

        var arr = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'memberteam'); });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqDataMemberteam = iMaxSeq;

        var arr = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'drawing'); });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqDataDrawingDoc = iMaxSeq;

        //whorksheet
        var arr = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'tasks_worksheet'); });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqdata_tasks_worksheet = iMaxSeq;

        var arr = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'workstep'); });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqdata_tasks_worksheetworkstep = iMaxSeq;

        var arr = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'taskdesc'); });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqdata_tasks_worksheettaskdesc = iMaxSeq;

        var arr = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'potentailhazard'); });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqdata_tasks_worksheetpotentailhazard = iMaxSeq;

        var arr = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'possiblecase'); });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqdata_tasks_worksheetpossiblecase = iMaxSeq;

        var arr = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'category'); });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqdata_tasks_worksheetcategoryegory = iMaxSeq;

        var arr = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'tasks_relatedpeople'); });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqdata_tasks_worksheetrelated_people = iMaxSeq;

        $scope.selectdata_session = 1;
        $scope.selectdata_memberteam = 1;
        $scope.selectdata_drawing = 1;

        $scope.selectdata_tasks_worksheet = 1;
        $scope.selectdata_tasks_worksheetworkstep = 1;
        $scope.selectdata_tasks_worksheettaskdesc = 1;
        $scope.selectdata_tasks_worksheetpotentailhazard = 1;
        $scope.selectdata_tasks_worksheetpossiblecase = 1;
        $scope.selectdata_tasks_worksheetcategoryegory = 1;
        $scope.selectdata_tasks_worksheetrelated_people = 1;

        $scope.exportfile = [{ DownloadPath: '', Name: '' }];
    }
    function apply() {
        try {
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        } catch { }
    }
    function replace_hashKey_arr(_arr) {
        var json = JSON.stringify(_arr, function (key, value) {
            if (key === "$$hashKey") {
                return undefined;
            }
            return value;
        });
        return json;
    }
    function page_load() {

        arr_def();

        if ($scope.user_name == null) {
            window.open('login/index', "_top");
            return;
        }

        get_data(true, false);
    }

    function save_data_create(action) {

        if ($scope.action_part != 4) { set_data_managerecom(); }

        check_data_general();
        check_data_tagid_audition();
        check_data_relatedpeople();

        var action_part = $scope.action_part;
        var user_name = $scope.user_name;
        var token_doc = $scope.token_doc + "";
        var pha_status = $scope.data_header[0].pha_status;
        var pha_version = $scope.data_header[0].pha_version;
        var pha_seq = $scope.data_header[0].seq;
        token_doc = pha_seq;

        var json_header = angular.toJson($scope.data_header);
        var json_general = angular.toJson($scope.data_general);
        //var json_tagid_audition = angular.toJson($scope.data_tagid_audition);
        var json_functional_audition = angular.toJson($scope.data_tagid_audition);

        var json_session = check_data_session();
        var json_memberteam = check_data_memberteam();
        var json_drawing = check_data_drawing();

        var json_tasks_worksheet = check_data_tasks_worksheet();

        //EPHA_M_RAM_LEVEL
        var json_ram_level = check_data_ram_level();
        var json_ram_master = check_master_ram();

        var json_tasks_relatedpeople = angular.toJson($scope.tasks_relatedpeople);

        var flow_action = action;
        if (flow_action == 'yes') { flow_action = "submit"; }

        $.ajax({
            url: url_ws + "Flow/set_jsea",
            data: '{"user_name":"' + user_name + '","token_doc":"' + token_doc + '","pha_status":"' + pha_status + '","pha_version":"' + pha_version + '","action_part":"' + action_part + '"'
                + ',"json_header":' + JSON.stringify(json_header)
                + ',"json_general":' + JSON.stringify(json_general)
                + ',"json_functional_audition":' + JSON.stringify(json_functional_audition)
                + ',"json_session":' + JSON.stringify(json_session)
                + ',"json_memberteam":' + JSON.stringify(json_memberteam)
                + ',"json_drawing":' + JSON.stringify(json_drawing)
                + ',"json_ram_level":' + JSON.stringify(json_ram_level)
                + ',"json_ram_master":' + JSON.stringify(json_ram_master)
                + ',"json_tasks_worksheet":' + JSON.stringify(json_tasks_worksheet)
                + ',"json_tasks_relatedpeople":' + JSON.stringify(json_tasks_relatedpeople)
                + ',"flow_action":' + JSON.stringify(flow_action)
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

                if (arr[0].status == 'true') {
                    $scope.pha_type_doc = 'update';
                    if (action == 'save') {

                        var controller_action_befor = conFig.controller_action_befor();
                        var pha_seq = conFig.pha_seq();
                        var pha_no = conFig.pha_no();
                        var pha_type_doc = "edit";

                        if (conFig.pha_seq() != null) {
                            pha_seq = arr[0].pha_seq;
                            pha_no = arr[0].pha_no;
                        }

                        var controller_text = "jsea";

                        $.ajax({
                            url: controller_text + "/set_session_doc",
                            data: '{"controller_action_befor":"' + controller_action_befor + '","pha_seq":"' + pha_seq + '"'
                                + ',"pha_no":"' + pha_no + '","pha_status":"' + pha_status + '","pha_type_doc":"' + pha_type_doc + '"}',
                            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
                            beforeSend: function () {
                                $("#divLoading").show();
                            },
                            complete: function () {
                                $("#divLoading").hide();
                            },
                            success: function (data) {

                                set_alert('Success', 'Data has been successfully saved.');

                                if ($scope.pha_seq == null || $scope.pha_seq == '') {
                                    $scope.pha_seq = arr[0].seq_new;
                                    conFig.pha_seq[0] = arr[0].seq_new;
                                }

                                get_data_after_save(false, (flow_action == 'submit' ? true : false), $scope.pha_seq);
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                if (jqXHR.status == 500) {
                                    alert('Internal error: ' + jqXHR.responseText);
                                } else {
                                    alert('Unexpected ' + textStatus);
                                }
                            }

                        });


                    } else {
                        set_alert('Success', 'Data has been successfully submitted.');
                        window.open('jsea/search', "_top");
                        return;
                    }
                } else {
                    apply();
                    set_alert('Error', arr[0].status);
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

    function get_data(page_load, action_submit) {
        var user_name = conFig.user_name();
        var pha_seq = conFig.pha_seq();
        if (page_load == true) {
            $scope.pha_seq = pha_seq;
            $scope.user_name = user_name;
        } else { pha_seq = $scope.pha_seq; }

        call_api_load(page_load, action_submit, user_name, pha_seq);
    }
    function get_data_after_save(page_load, action_submit, pha_seq) {
        var user_name = conFig.user_name();
        call_api_load(false, action_submit, user_name, pha_seq);
    }
    function call_api_load(page_load, action_submit, user_name, pha_seq) {
        var type_doc = $scope.pha_type_doc;//review_document
        

        $.ajax({
            url: url_ws + "Flow/get_jsea_details",
            data: '{"sub_software":"jsea","user_name":"' + user_name + '","token_doc":"' + pha_seq + '","type_doc":"' + type_doc + '"}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
            beforeSend: function () {
                //if (!page_load) { $('#modalLoadding').modal('show'); }
                $('#divLoading').show();
            },
            complete: function () {
                //if (!page_load) { $('#modalLoadding').modal('hide'); }
                $('#divLoading').hide();
            },
            success: function (data) {

                var action_part_befor = $scope.action_part;//(page_load == false ? $scope.action_part : 0);
                var tabs_befor = (page_load == false ? $scope.tabs : null);

                var arr = data;
                if (true) {
                    $scope.data_all = arr;
                    arr.company.push({ id: 9999, name: 'Other' })
                    arr.company.sort((a, b) => a.id - b.id);
                    $scope.master_company = arr.company;
                    $scope.master_apu = arr.apu;
                    $scope.master_toc = arr.toc;
                    $scope.master_unit_no = arr.unit_no;
                    $scope.master_tagid = arr.tagid;
                    $scope.master_tagid_audition = arr.tagid;//ใช้ใน tag id audition

                    $scope.employeelist_all = arr.employee;
                    $scope.employeelist = arr.employee.slice(0, 10);

                    //แก้ไขเบื้องต้น เนื่องจาก path file ผิดต้องเป็น folder jsea
                    for (let i = 0; i < arr.ram.length; i++) {
                        //arr.ram[i].document_file_path = (url_ws.replace('/api/', '/')) + arr.ram[i].document_file_path;
                        if (arr.ram[i] == 5) {
                            arr.ram[i].document_file_path = 'https://dev-epha-api.azurewebsites.net/AttachedFileTemp/rma-img-5x5.png';
                        } else { arr.ram[i].document_file_path = 'https://dev-epha-api.azurewebsites.net/AttachedFileTemp/rma-img-4x4.png'; }
                    }
                    
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
                    $scope.master_typeofhazard = [{ id: 1, name: 'YES' }, { id: 0, name: 'NO' }];

                    // set replace_hashKey_arr
                    $scope.master_apu = JSON.parse(replace_hashKey_arr(arr.apu));

                    arr.header[0].flow_mail_to_member = (arr.header[0].flow_mail_to_member == null ? 0 : arr.header[0].flow_mail_to_member);
                    $scope.data_header = arr.header;

                    var inputs = document.getElementsByTagName('switchEmailToMemberChecked');
                    for (var i = 0; i < inputs.length; i++) {
                        if (inputs[i].type == 'checkbox') {
                            if ($scope.data_header[0].flow_mail_to_member == 1) {
                                inputs[i].checked = true;
                            } else { inputs[i].checked = false; }
                        }
                    }

                    arr.general[0].input_type_excel = (arr.general[0].input_type_excel == null ? 0 : arr.general[0].input_type_excel);
                    arr.general[0].types_of_hazard = (arr.general[0].types_of_hazard == null ? 0 : arr.general[0].types_of_hazard);
                    $scope.data_general = arr.general;
                    //set id to 5
                    $scope.data_general.forEach(function(item) {
                        item.id_ram = 5;
                    });
                    

                    var inputs = document.getElementsByTagName('switchTypesOfHazardChecked');
                    for (var i = 0; i < inputs.length; i++) {
                        if (inputs[i].type == 'checkbox') {
                            if ($scope.data_general[0].types_of_hazard == 1) {
                                inputs[i].checked = true;
                            } else { inputs[i].checked = false; }
                        }
                    }

                    //เก็บข้อมูลลงตาราง functional_audition นี้แทน ตาราง general ???
                    $scope.data_tagid_audition = arr.tagid_audition;

                    $scope.data_session = arr.session;
                    $scope.data_session_def = clone_arr_newrow(arr.session);

                    $scope.data_memberteam = arr.memberteam;
                    $scope.data_memberteam_def = clone_arr_newrow(arr.memberteam);
                    $scope.data_memberteam_old = (arr.memberteam);

                    $scope.data_drawing = arr.drawing;
                    $scope.data_drawing_def = clone_arr_newrow(arr.drawing);

                    $scope.data_tasks_worksheet = arr.tasks_worksheet;
                    $scope.data_tasks_worksheet_def = clone_arr_newrow(arr.tasks_worksheet);

                    //data_attendees->mutti list
                    //data_specialist->mutti list
                    //data_reviewer->mutti list
                    //data_approver->create one row  
                    arr.attendees.forEach(function (item) {
                        item['user_type_main'] = 0;//1 = main, 0 = other
                        item['user_type_of'] = 'free_text';//member, related_people, free_text
                        item['id_session'] = 0;//มีเฉพาะ attendees
                    });
                    arr.specialist.forEach(function (item) {
                        item['user_type_main'] = 0;//1 = main, 0 = other
                        item['user_type_of'] = 'free_text';//member, related_people, free_text
                        item['id_session'] = 0;//มีเฉพาะ attendees
                    });
                    arr.reviewer.forEach(function (item) {
                        item['user_type_main'] = 0;//1 = main, 0 = other
                        item['user_type_of'] = 'free_text';//member, related_people, free_text
                        item['id_session'] = 0;//มีเฉพาะ attendees
                    }); 

                    //comb member,related,Freetext
                    //arr.attendees = [...arr.memberteam,...arr.attendees]

                    $scope.data_attendees = arr.attendees;
                    $scope.data_attendees_def = clone_arr_newrow(arr.attendees);
                    $scope.data_attendees_old = arr.attendees;

                    $scope.data_specialist = arr.specialist;
                    $scope.data_specialist_def = clone_arr_newrow(arr.specialist);
                    $scope.data_specialist_old = arr.specialist;

                    $scope.data_reviewer = arr.reviewer;
                    $scope.data_reviewer_def = clone_arr_newrow(arr.reviewer);
                    $scope.data_reviewer_old = arr.reviewer;
                    
                    $scope.data_approver = arr.approver;

                    get_max_id();
                    set_data_general();
                    set_data_related_people();
                    set_master_ram_likelihood('');

                    //get recommendations_no in tasks worksheet
                    if ($scope.data_tasks_worksheet.length > 0) {
                        var arr_copy_def = angular.copy($scope.data_tasks_worksheet, arr_copy_def);
                        arr_copy_def.sort((a, b) => Number(b.recommendations_no) - Number(a.recommendations_no));
                        var recommendations_no = Number(Number(arr_copy_def[0].recommendations_no) + 1);
                        for (let i = 0; i < $scope.data_tasks_worksheet; i++) {
                            if ($scope.data_tasks_worksheet[i].recommendations == null || $scope.data_tasks_worksheet[i].recommendations == '') {
                                if ($scope.data_tasks_worksheet[i].recommendations_no == null || $scope.data_tasks_worksheet[i].recommendations_no == '') {
                                    $scope.data_tasks_worksheet[i].recommendations_no = recommendations_no;
                                    recommendations_no += 1;
                                }
                            }
                        }
                    }


                }

                $scope.data_session_delete = [];
                $scope.data_memberteam_delete = [];
                $scope.data_drawing_delete = [];

                $scope.data_tasks_worksheet_delete = [];
                $scope.data_attendees_delete = [];
                $scope.data_specialist_delete = [];
                $scope.data_reviewer_delete = [];

                $scope.flow_role_type = conFig.role_type();// "admin";//admin,request,responder,approver
                $scope.flow_status = 0;

                //แสดงปุ่ม
                $scope.flexSwitchCheckChecked = false;
                $scope.back_type = true;
                $scope.cancle_type = false;
                $scope.export_type = false;
                $scope.save_type = true;
                $scope.submit_review = true;
                $scope.submit_type = true;

                $scope.selectActiveNotification = ($scope.data_header[0].active_notification == 1 ? true : false);

                set_form_action(action_part_befor, !action_submit, page_load);

                if (true) {

                    if (!page_load) {
                        if (!action_submit) {
                            $scope.action_part = action_part_befor;
                            $scope.tabs = tabs_befor;
                        }
                    }

                    var i = 0;
                    var id_ram = $scope.data_general[0].id_ram; //id_ram == 4
                    console.log($scope.data_general[0])
                    console.log(id_ram)

                    
                    var arr_items = $filter('filter')($scope.master_ram_level, function (item) { return (item.id_ram == id_ram); }); //id_ram == 4?
                    if (arr_items.length > 0) {

                        $scope.select_rows_level = arr_items[0].rows_level; // return 4
                        $scope.select_columns_level = arr_items[0].columns_level; // return 4
                        $scope.selected_ram_img = (url_ws.replace('/api/', '/')) + arr_items[0].document_file_path;
                    }

                    try {
                        $scope.master_company = JSON.parse(replace_hashKey_arr(arr.company));
                        $scope.master_apu = JSON.parse(replace_hashKey_arr(arr.apu));
                        $scope.master_toc = JSON.parse(replace_hashKey_arr(arr.toc));
                        $scope.master_unit_no = JSON.parse(replace_hashKey_arr(arr.unit_no));
                        $scope.master_tagid = JSON.parse(replace_hashKey_arr(arr.tagid));
                        $scope.master_ram = JSON.parse(replace_hashKey_arr(arr.ram));

                        
                        if ($scope.data_general[0].id_company == null || $scope.data_general[0].id_company == '') {
                            var arr_company = $filter('filter')($scope.master_company, function (item) { return (item.name == 'TOP'); });
                            $scope.data_general[0].id_company = arr_company[0].id;

                        }
                        if ($scope.data_general[0].id_ram == null || $scope.data_general[0].id_ram == '' || $scope.data_general[0].id_ram == '5') {
                            var arr_ram = $filter('filter')($scope.master_ram, function (item) { return (item.name == '5x5'); });
                            $scope.data_general[0].id_ram = arr_ram[0].id;
                        }
                        if ($scope.data_general[0].id_apu == null || $scope.data_general[0].id_apu == '') {
                            $scope.data_general[0].id_apu = null;
                            var arr_clone_def = { id: null, name: 'Please select' };
                            $scope.master_apu.splice(0, 0, arr_clone_def);
                        }
                        if ($scope.data_general[0].id_toc == null || $scope.data_general[0].id_toc == '') {
                            $scope.data_general[0].id_toc = null;
                            var arr_clone_def = { id: null, name: 'Please select' };
                            $scope.master_toc.splice(0, 0, arr_clone_def);
                        }
                        if ($scope.data_general[0].id_unit_no == null || $scope.data_general[0].id_unit_no == '') {
                            $scope.data_general[0].id_unit_no = null;
                            var arr_clone_def = { id: null, name: 'Please select' };
                            $scope.master_unit_no.splice(0, 0, arr_clone_def);
                        }
                        if ($scope.data_general[0].id_tagid == null || $scope.data_general[0].id_tagid == '') {
                            $scope.data_general[0].id_tagid = null;
                            var arr_clone_def = { id: null, name: 'Please select' };
                            $scope.master_tagid.splice(0, 0, arr_clone_def);
                        }
                        
                    } catch (ex) { alert(ex); console.clear(); }

                    $scope.$apply();
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

    function set_form_action(action_part_befor, action_save, page_load) {

        //แสดง tab ตาม flow
        $scope.tab_general_show = true;
        $scope.tab_worksheet_show = false;

        //เปิดให้แก้ไขข้อมูลในแต่ละ tab ตาม flow
        $scope.tab_general_active = true;
        $scope.tab_worksheet_active = true;

        for (let _item of $scope.tabs) {
            _item.isShow = true;
            _item.isActive = false;
        }

        $scope.action_part = action_part_befor;

        //option1 = form, option2 = exccel
        $scope.selectInputTypeForm = ($scope.data_general[0].input_type_excel == 0 ? 'option1' : 'option2');
        ////option1 = Yes, option2 = No
        //$scope.selectInputTypeForm = ($scope.data_general[0].types_of_hazard == 0 ? 'option1' : 'option2');

        $scope.submit_review = false;
        if (Number($scope.data_header[0].pha_status) == 81) {
            $scope.back_type = true;
            $scope.cancle_type = false;
            $scope.export_type = false;
            $scope.save_type = false;
            $scope.submit_type = false;
            $scope.submit_review = false;
            return;
        } else {
            $scope.export_type = true;
        }

        if ($scope.data_header[0].pha_status == 11) {

            if (page_load) {

                var tag_name = 'general';
                var arr_tab = $filter('filter')($scope.tabs, function (item) {
                    return ((item.action_part == $scope.action_part));
                });
                if (arr_tab.length > 0) {
                    $scope.changeTab(arr_tab[0], tag_name);
                    if (action_save == true) { $scope.action_part = arr_tab[0].action_part; }
                }

                $scope.cancle_type = true;
            }

        }
        else if ($scope.data_header[0].pha_status == 12) {
            var tag_name = 'worksheet';
            var arr_tab = $filter('filter')($scope.tabs, function (item) {
                return ((item.name == tag_name));
            });
            if (arr_tab.length > 0) {
                $scope.changeTab(arr_tab[0], tag_name);
                if (action_save == true) { $scope.action_part = arr_tab[0].action_part; }
            }
            check_case_member_review();

            $scope.tab_worksheet_show = true;
            $scope.tab_worksheet_active = true;

            $scope.submit_type = true;

            $scope.tab_general_active = true;
            $scope.tab_worksheet_active = true;
        }
        else if ($scope.data_header[0].pha_status == 13) {
            $scope.tab_worksheet_show = true;
            $scope.tab_worksheet_active = true;

            var tag_name = 'worksheet';
            var arr_tab = $filter('filter')($scope.tabs, function (item) {
                return ((item.name == tag_name));
            });
            if (arr_tab.length > 0) {
                $scope.changeTab(arr_tab[0], tag_name);
                if (action_save == true) { $scope.action_part = arr_tab[0].action_part; }
            }

            $scope.tab_general_active = false;
            $scope.tab_worksheet_active = false;

            $scope.save_type = false;
            $scope.submit_type = false;
        }
        else if (Number($scope.data_header[0].pha_status) == 21) {

            $scope.tab_general_show = true;
            $scope.tab_worksheet_show = true;
            $scope.tab_worksheet_active = true;

            $scope.save_type = true;
            $scope.submit_type = true;

            var tag_name = 'worksheet';
            var arr_tab = $filter('filter')($scope.tabs, function (item) {
                return ((item.name == tag_name));
            });
            if (arr_tab.length > 0) {
                $scope.changeTab(arr_tab[0], tag_name);
                if (action_save == true) { $scope.action_part = arr_tab[0].action_part; }
            }

            $scope.selectSendBack = ($scope.data_header[0].approve_status == 'approve' ? 'option1' : 'option2');

            $scope.tab_general_active = false;
            $scope.tab_worksheet_active = false;

        }
        else if ($scope.data_header[0].pha_status == 14) {
            $scope.tab_general_show = true;
            $scope.tab_worksheet_show = true;

            $scope.tab_worksheet_active = true;

            if ($scope.flow_role_type == "admin") {
                $scope.save_type = true;
                $scope.submit_type = true;
            }
            var tag_name = 'worksheet';
            var arr_tab = $filter('filter')($scope.tabs, function (item) {
                return ((item.name == tag_name));
            });
            if (arr_tab.length > 0) {
                $scope.changeTab(arr_tab[0], tag_name);
                if (action_save == true) { $scope.action_part = arr_tab[0].action_part; }
            }

            $scope.tab_general_active = false;
            $scope.tab_worksheet_active = false;
        }
        else if ($scope.data_header[0].pha_status == 91) {
            $scope.tab_general_show = true;
            $scope.tab_worksheet_show = true;

            $scope.tab_general_active = false;
            $scope.tab_worksheet_active = false;

            $scope.save_type = false;
            $scope.submit_type = false;
            $scope.export_type = true;

            var tag_name = 'worksheet';
            var arr_tab = $filter('filter')($scope.tabs, function (item) {
                return ((item.name == tag_name));
            });
            if (arr_tab.length > 0) {
                $scope.changeTab(arr_tab[0], tag_name);
                if (action_save == true) { $scope.action_part = arr_tab[0].action_part; }
            }

        }

        if ($scope.data_header[0].pha_status == 91 || $scope.data_header[0].pha_status == 81) {

        } else {

            $scope.tab_general_active = true;
            $scope.tab_worksheet_active = true;

        }

        if ($scope.pha_type_doc == 'review_document') {
            $scope.tab_general_active = false;
            $scope.tab_worksheet_active = false;

            $scope.back_type = true;
            $scope.cancle_type = false;
            $scope.export_type = true;
            $scope.save_type = false;
            $scope.submit_type = false;
            $scope.submit_review = false;
        }
    }
    function check_case_member_review() {

        if ($scope.data_session.length > 0) {
            var icount = $scope.data_session.length - 1;
            var id_session = $scope.data_session[icount].seq;
            var arr_team = $filter('filter')($scope.data_memberteam, function (item) {
                return ((item.id_session == id_session));
            });
            if (arr_team.length > 0) { $scope.submit_review = true; }
        }
    }
    function set_data_general() {

        if (($scope.data_general[0].id_ram + '') == '') {
            $scope.data_general[0].id_ram = 1;
        }

        if ($scope.data_general[0].target_start_date !== null) {
            const x = ($scope.data_general[0].target_start_date.split('T')[0]).split("-");
            $scope.data_general[0].target_start_date = new Date(x[0], x[1], x[2]);
        }

        for (let i = 0; i < $scope.data_session.length; i++) {
            $scope.data_session[i].no = (i + 1);

            if ($scope.data_session[i].meeting_date !== null) {
                const x = ($scope.data_session[i].meeting_date.split('T')[0]).split("-");
                $scope.data_session[i].meeting_date = new Date(x[0], x[1], x[2]);
            }
            if ($scope.data_session[i].meeting_start_time !== null) {
                //12/31/1969 7:55:00 PM
                const x = ($scope.data_session[i].meeting_start_time.split(' ')[1]).split(":");
                const x2 = $scope.data_session[i].meeting_start_time.split(' ')[2];
                var hh = ('00' + (x2 == "PM" ? x[0] + 12 : x[0])); var mm = ('00' + x[1]);
                var valtime = "1970-01-01T" + (hh).substring(hh.length - 2) + ":" + (mm).substring(mm.length - 2) + ":00.000Z";
                $scope.data_session[i].meeting_start_time = new Date(valtime);
            }
            if ($scope.data_session[i].meeting_end_time !== null) {
                //12/31/1969 7:55:00 PM
                const x = ($scope.data_session[i].meeting_end_time.split(' ')[1]).split(":");
                const x2 = $scope.data_session[i].meeting_end_time.split(' ')[2];
                var hh = ('00' + (x2 == "PM" ? x[0] + 12 : x[0])); var mm = ('00' + x[1]);
                var valtime = "1970-01-01T" + (hh).substring(hh.length - 2) + ":" + (mm).substring(mm.length - 2) + ":00.000Z";
                $scope.data_session[i].meeting_end_time = new Date(valtime);
            }
        }


        try {

            var tagid_audition = $scope.data_general[0].tagid_audition;
            if (!(tagid_audition == '' || tagid_audition == null)) {

                var xSplitFunc = (tagid_audition).replaceAll('"', '').replace('[', '').replace(']', '').split(",");
                var _functoArr = [];
                for (var i = 0; i < xSplitFunc.length; i++) {
                    _functoArr.push(xSplitFunc[i]);
                }
                console.log('_functoArr');
                $scope.data_general[0].tagid_audition = _functoArr;
                console.log($scope.data_general[0].tagid_audition);
            } else {
                $scope.data_general[0].tagid_audition = [];
            }
        } catch { }

        return;
    }
    function set_data_tasks_worksheet() {

    }
    function set_data_related_people() {

        if (true) {
            try {
                if ($scope.data_approver[0].reviewer_date !== null) {
                    const x = ($scope.data_approver[0].reviewer_date.split('T')[0]).split("-");
                    if (x[0] > 2000) {
                        $scope.data_approver[0].reviewer_date = new Date(x[0], x[1], x[2]);
                    }
                }
            } catch { }
        }

    }

    function set_master_ram_likelihood(ram_select) {

        $scope.master_ram_likelihood = [];
        var id_ram = $scope.data_general[0].id_ram;
        if (ram_select != '') { id_ram = ram_select; }

        var arr_items = $filter('filter')($scope.master_ram_level, function (item) { return (item.id_ram == id_ram); });

        var i = 0; var columns_level = 0;
        if (arr_items.length > 0) {
            columns_level = Number(arr_items[0].columns_level);
            $scope.select_rows_level = arr_items[0].rows_level;
            $scope.select_columns_level = arr_items[0].columns_level;
        }
        if (columns_level !== 5 || true) {
            var arr = [
                { columns_level: columns_level, seq: 1, level: arr_items[i].likelihood1_level, text: '', desc: '', criterion: '' }
                , { columns_level: columns_level, seq: 2, level: arr_items[i].likelihood2_level, text: '', desc: '', criterion: '' }
                , { columns_level: columns_level, seq: 3, level: arr_items[i].likelihood3_level, text: '', desc: '', criterion: '' }
                , { columns_level: columns_level, seq: 4, level: arr_items[i].likelihood4_level, text: '', desc: '', criterion: '' }
                , { columns_level: columns_level, seq: 5, level: arr_items[i].likelihood5_level, text: '', desc: '', criterion: '' }
                , { columns_level: columns_level, seq: 6, level: arr_items[i].likelihood6_level, text: '', desc: '', criterion: '' }
                , { columns_level: columns_level, seq: 7, level: arr_items[i].likelihood7_level, text: '', desc: '', criterion: '' }
                , { columns_level: columns_level, seq: 8, level: arr_items[i].likelihood8_level, text: '', desc: '', criterion: '' }
                , { columns_level: columns_level, seq: 9, level: arr_items[i].likelihood9_level, text: '', desc: '', criterion: '' }
                , { columns_level: columns_level, seq: 10, level: arr_items[i].likelihood10_level, text: '', desc: '', criterion: '' }
            ]
        } else {
            var arr = [
                { columns_level: columns_level, seq: 1, level: arr_items[i].likelihood1_level, text: arr_items[i].likelihood1_text, desc: arr_items[i].likelihood1_desc, criterion: arr_items[i].likelihood1_criterion }
                , { columns_level: columns_level, seq: 2, level: arr_items[i].likelihood2_level, text: arr_items[i].likelihood2_text, desc: arr_items[i].likelihood2_desc, criterion: arr_items[i].likelihood2_criterion }
                , { columns_level: columns_level, seq: 3, level: arr_items[i].likelihood3_level, text: arr_items[i].likelihood3_text, desc: arr_items[i].likelihood3_desc, criterion: arr_items[i].likelihood3_criterion }
                , { columns_level: columns_level, seq: 4, level: arr_items[i].likelihood4_level, text: arr_items[i].likelihood4_text, desc: arr_items[i].likelihood4_desc, criterion: arr_items[i].likelihood4_criterion }
                , { columns_level: columns_level, seq: 5, level: arr_items[i].likelihood5_level, text: arr_items[i].likelihood5_text, desc: arr_items[i].likelihood5_desc, criterion: arr_items[i].likelihood5_criterion }
            ]
        }
        $scope.master_ram_likelihood = arr;

    }
    function set_data_managerecom() {

        if (true) {
            var arr_worksheet = $scope.data_tasks_worksheet;
            for (var w = 0; w < arr_worksheet.length; w++) {

                //recommendations_no
                arr_worksheet[w].recommendations_no = (arr_worksheet[w].recommendations_no == null ? arr_worksheet[w].taskdesc_no : null);

                //Estimated Date  
                try {
                    if (arr_worksheet[w].estimated_start_date !== null) {
                        const x = (arr_worksheet[w].estimated_start_date.split('T')[0]).split("-");
                        if (x[0] > 2000) {
                            arr_worksheet[w].estimated_start_date = new Date(x[0], x[1], x[2]);
                        }
                    }
                } catch { }
                try {
                    if (arr_worksheet[w].estimated_end_date !== null) {
                        const x = (arr_worksheet[w].estimated_end_date.split('T')[0]).split("-");
                        if (x[0] > 2000) {
                            arr_worksheet[w].estimated_end_date = new Date(x[0], x[1], x[2]);
                        }
                    }
                } catch { }

            }
        }

    }

    // <==== (Kul)Session zone function  ====> 
    //Coppy Key 1st Array and set null
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
    function running_no_format_1(arr_items, iNo, newInput) {
        arr_items.sort((a, b) => a.no - b.no);
        var first_row = true;
        var iNoNew = iNo;//null
        if (newInput == null) {
            iNo = (iNo == null ? 1 : iNo) + 0;
            iNoNew = iNo;
        }

        for (let i = (iNo); i < arr_items.length; i++) {

            if (first_row == true && newInput !== null) {
                iNoNew++;
                newInput.no = (iNoNew);
                first_row = false;
            } else {
                arr_items[i].no = iNoNew;
            }
            iNoNew++;
        };
        
        if (newInput !== null && newInput.action_type == 'insert' ) {
            //if (iRow > 0) { newInput.no = Number(newInput.no) + 0.1; } 
            arr_items.push(newInput);
        }

        arr_items.sort((a, b) => a.no - b.no);
    }

    function running_no_format_2(arr_items, iNo, iRow, newInput) {

        //set running no ตาม type
        arr_items.sort((a, b) => a.no - b.no);
        var first_row = true;
        var iNoNew = iNo;
        if (newInput == null) {
            iNo = (iNo == null ? 1 : iNo) + 0;
            iNoNew = iNo;
        }

        for (let i = (iRow); i < arr_items.length; i++) {

            if (first_row == true && newInput !== null) {
                iNoNew++;
                newInput.no = (iNoNew);
                first_row = false;
            } else {
                arr_items[i].no = iNoNew;
            }
            iNoNew++;
        };

        if (newInput !== null && newInput.action_type == 'insert') {
            arr_items.push(newInput);
        }

        arr_items.sort((a, b) => a.no - b.no);

    }
    
    $scope.addDataSession = function (seq,index) {
        $scope.MaxSeqDataSession = Number($scope.MaxSeqDataSession) + 1;
        var xValues = $scope.MaxSeqDataSession;

        var arr = $filter('filter')($scope.data_session, function (item) { return (item.seq == seq); });
        var iNo = 1; if (arr.length > 0) { iNo = arr[0].no; }

        var newInput = clone_arr_newrow($scope.data_session_def)[0];
        newInput.seq = xValues;
        newInput.id = xValues;
        newInput.no = (iNo + 1);
        newInput.action_type = 'insert';
        newInput.action_change = 1;
        console.clear();
        
        running_no_format_2($scope.data_session, iNo,index, newInput);

        $scope.selectdata_session = xValues;
        apply();

    }

    $scope.copyDataSession = function (seq) {

        $scope.MaxSeqDataSession = Number($scope.MaxSeqDataSession) + 1;
        var xValues = $scope.MaxSeqDataSession;

        var id_session = xValues;
        var arr = $filter('filter')($scope.data_session, function (item) { return (item.seq == seq); });
        var iNo = 1; if (arr.length > 0) { iNo = arr[0].no; }
        for (let i = 0; i < arr.length; i++) {

            var newInput = clone_arr_newrow($scope.data_session_def)[0];
            newInput.seq = Number(xValues);
            newInput.id = Number(xValues);
            newInput.no = (iNo + 1);
            newInput.action_type = 'insert';
            newInput.action_change = 1;
            newInput.meeting_date = arr[i].meeting_date;
            newInput.meeting_start_time = arr[i].meeting_start_time;
            newInput.meeting_end_time = arr[i].meeting_end_time;

        };

        running_no_format_1($scope.data_session, iNo, newInput);

        $scope.selectdata_session = xValues;

            var arr_copy = [];
            angular.copy($scope.data_memberteam, arr_copy);
            var arrmember = $filter('filter')(arr_copy, function (item) { return (item.id_session == seq); });
            for (let i = 0; i < arrmember.length; i++) {
                arrmember[i].id_session = Number(id_session);
                arrmember[i].action_type = 'insert';
                arrmember[i].action_change = 1;

                arrmember[i].seq = $scope.selectdata_memberteam;
                arrmember[i].id = $scope.selectdata_memberteam;

                $scope.data_memberteam.push(arrmember[i]);
                $scope.selectdata_memberteam += 1;
        }

    }
    $scope.removeDataSession = function (seq,index) {
        var arrdelete = $filter('filter')($scope.data_session, function (item) {
            return (item.seq == seq && item.action_type == 'update');
        });
        if (arrdelete.length > 0) { $scope.data_session_delete.push(arrdelete[0]); }

        $scope.data_session = $filter('filter')($scope.data_session, function (item) {
            return !(item.seq == seq);
        });
        if ($scope.data_session.length == 0) {
            $scope.addDataSession();
        }

        //if delete row 1 clear to null
        if ($scope.data_session.length == 1 || $scope.data_session.no == 1) {
            var keysToClear = ['user_name', 'user_displayname'];


            keysToClear.forEach(function(key) {
                $scope.data_session[0][key] = null;
            });

            $scope.data_session[0].no = 1;
        }


        running_no_format_1($scope.data_session, null,index, null);
        apply();
    };
    $scope.openModalEmployeeCheck = function (seq) {
        $scope.selectdata_session = seq;

        $scope.selectdata_action_seq = seq;
        $scope.selectdata_action_type = 'memberteam';

        var arr = $scope.employeelist;
        for (let i = 0; i < arr.length; i++) {

            var ar_check = $filter('filter')($scope.data_memberteam
                , { id_session: seq, user_name: arr[i].employee_name });
            if (ar_check.length > 0) {
                $scope.employeelist[i].selected = true;
            } else {
                $scope.employeelist[i].selected = false;
            }

        };

        apply();

        $('#modalEmployeeCheck').modal('show');
    };
    $scope.openModalRelatedPeopleCheck = function (action_type, item)  {
        $scope.selectdata_action_seq = item.seq;
        $scope.selectdata_action_type = action_type;


        var arr = $scope.employeelist;
        for (let i = 0; i < arr.length; i++) {
            if (action_type == 'memberteam') {
                var ar_check = $filter('filter')($scope.data_memberteam, { id_session: seq, user_name: arr[i].employee_name });
                if (ar_check.length > 0) {
                    $scope.employeelist[i].selected = true;
                } else {
                    $scope.employeelist[i].selected = false;
                }

            } else if (action_type == 'attendees') {
                var ar_check = $filter('filter')($scope.data_attendees, { user_name: arr[i].employee_name });
                if (ar_check.length > 0) {
                    $scope.employeelist[i].selected = true;
                } else {
                    $scope.employeelist[i].selected = false;
                }

            } else if (action_type == 'specialist') {
                var ar_check = $filter('filter')($scope.data_specialist, { user_name: arr[i].employee_name });
                if (ar_check.length > 0) {
                    $scope.employeelist[i].selected = true;
                } else {
                    $scope.employeelist[i].selected = false;
                }
            } else if (action_type == 'reviewer') {
                var ar_check = $filter('filter')($scope.data_reviewer, { user_name: arr[i].employee_name });
                if (ar_check.length > 0) {
                    $scope.employeelist[i].selected = true;
                } else {
                    $scope.employeelist[i].selected = false;
                }
            }
        };
        apply();

        $('#modalEmployeeCheck').modal('show');


        /*reviewer */
    };


    $scope.AddDataEmpSession = function () {

        var seq = $scope.selectdata_action_seq;
        var action_type = $scope.selectdata_action_type;
        var user_type_of = $scope.selectdata_user_type_of;

        if (action_type == 'memberteam') {
            add_user_to_data_member();
        } else if (action_type == 'attendees' || action_type == 'specialist' || action_type == 'reviewer') {
            add_user_to_data_related_people(seq, action_type, user_type_of);
        }

        console.log()

    };
    function add_user_to_data_member() {

        var seq_session = $scope.selectdata_session;
        var arr = $filter('filter')($scope.employeelist, { selected: true });

        var arr_def = [];
        for (let i = 0; i < arr.length; i++) {

            var ar_check = $filter('filter')($scope.data_memberteam
                , { id_session: seq_session, user_name: arr[i].employee_name });

            if (ar_check.length > 0) {

                if (ar_check[0].user_displayname !== arr[i].employee_displayname) {
                    ar_check[0].user_displayname = arr[i].employee_displayname;
                    ar_check[0].action_change = 1;
                }
                arr_def.push(ar_check[0]);
                continue;
            }

            //add new employee 
            var seq = Number($scope.MaxSeqDataMemberteam);

            var newInput = clone_arr_newrow($scope.data_memberteam_def)[0];
            newInput.seq = seq;
            newInput.id = seq;
            newInput.no = (0);
            newInput.id_session = Number(seq_session);
            newInput.action_type = 'insert';
            newInput.action_change = 1;
            newInput.user_type_of = 'member';

            newInput.user_name = arr[i].employee_name;
            newInput.user_displayname = arr[i].employee_displayname;
            newInput.user_img = arr[i].employee_img;

            arr_def.push(newInput);

            $scope.MaxSeqDataMemberteam = Number($scope.MaxSeqDataMemberteam) + 1
        }

        var arr_copy_def = angular.copy($scope.data_memberteam, arr_copy_def);
        $scope.data_memberteam = [];
        $scope.data_memberteam = $filter('filter')(arr_copy_def, function (item) {
            return (item.id_session !== seq_session);
        });
        for (let i = 0; i < arr_def.length; i++) {
            $scope.data_memberteam.push(arr_def[i]);
        }


        running_no_format_1($scope.data_memberteam, null, null);        
        mergeData ('memberteam',$scope.data_memberteam)

        apply();

    }

    function add_user_to_data_related_people(seq, action_type) {

        var arr = $filter('filter')($scope.employeelist, { selected: true });
        var arr_def = [];
        for (let i = 0; i < arr.length; i++) {

            if (action_type == 'attendees') {
                var ar_check = $filter('filter')($scope.data_attendees, { user_name: arr[i].employee_name });
            } else if (action_type == 'specialist') {
                var ar_check = $filter('filter')($scope.data_specialist, { user_name: arr[i].employee_name });
            } else if (action_type == 'reviewer') {
                var ar_check = $filter('filter')($scope.data_reviewer, { user_name: arr[i].employee_name });
            }

            if (ar_check.length > 0) {

                if (ar_check[0].user_displayname !== arr[i].user_displayname) {
                    ar_check[0].user_displayname = arr[i].employee_displayname;
                    ar_check[0].action_change = 1;
                }
                arr_def.push(ar_check[0]);
                continue;
            }

            //add new employee 
            var seq = Number($scope.MaxSeqdata_tasks_worksheetrelated_people);

            var newInput = clone_arr_newrow($scope.data_attendees_def)[0];
            newInput.seq = seq;
            newInput.id = seq;
            newInput.no = (0);
            newInput.action_type = 'insert';
            newInput.action_change = 1;
            newInput.user_type_of = 'related_people';

            newInput.user_name = arr[i].employee_name;
            newInput.user_displayname = arr[i].employee_displayname;
            //newInput.user_img = arr[i].employee_img;

            arr_def.push(newInput);

            $scope.MaxSeqdata_tasks_worksheetrelated_people = Number($scope.MaxSeqdata_tasks_worksheetrelated_people) + 1
        }


        if (action_type == 'attendees') {
            /*var arr_copy_def = angular.copy($scope.data_attendees, arr_copy_def);
            $scope.data_attendees = [];
            $scope.data_attendees = $filter('filter')(arr_copy_def, function (item) { return (true); });
            for (let i = 0; i < arr_def.length; i++) {
                $scope.data_attendees.push(arr_def[i])
            }*/

            // add $scope.data_attendees
            let allUser_seq = $scope.data_attendees.map(item => item.seq); //=> seq of member user
            let uniqueItems = arr_def.filter(item => !allUser_seq.includes(item.seq)); //ดึงเฉพาะคน seq ไม่ซ้ำ
            

            // Remove unselected users from $scope.data_attendees
            for (let i = $scope.data_attendees.length - 1; i >= 0; i--) {
                let existingUser = $scope.data_attendees[i];
                if (!arr_def.find(item => item.seq === existingUser.seq)) {
                    $scope.data_attendees.splice(i, 1);
                }
            }

            $scope.data_attendees.push(...uniqueItems);

            running_no_format_1($scope.data_attendees, null, null);
            mergeData('attendees',$scope.data_attendees);

        } else if (action_type == 'specialist') {

            /*var arr_copy_def = angular.copy($scope.data_specialist, arr_copy_def);
            $scope.data_specialist = [];
            $scope.data_specialist = $filter('filter')(arr_copy_def, function (item) { return (true); });
            for (let i = 0; i < arr_def.length; i++) {
                $scope.data_specialist.push(arr_def[i]);
            }*/

            // check user from seq
            let allUser_seq = $scope.data_specialist.map(item => item.seq); //=> seq of member user
            let uniqueItems = arr_def.filter(item => !allUser_seq.includes(item.seq)); //ดึงเฉพาะคน seq ไม่ซ้ำ
            

            // Remove unselected users from $scope.data_attendees
            for (let i = $scope.data_specialist.length - 1; i >= 0; i--) {
                let existingUser = $scope.data_specialist[i];
                if (!arr_def.find(item => item.seq === existingUser.seq)) {
                    $scope.data_specialist.splice(i, 1);
                }
            }

            $scope.data_specialist.push(...uniqueItems);

            running_no_format_1($scope.data_specialist, null, null);
        } else if (action_type == 'reviewer') {

            /*var arr_copy_def = angular.copy($scope.data_reviewer, arr_copy_def);
            $scope.data_reviewer = [];
            $scope.data_reviewer = $filter('filter')(arr_copy_def, function (item) { return (true); });
            for (let i = 0; i < arr_def.length; i++) {
                $scope.data_reviewer.push(arr_def[i]);
            }*/

            let allUser_seq = $scope.data_reviewer.map(item => item.seq); //=> seq of member user
            let uniqueItems = arr_def.filter(item => !allUser_seq.includes(item.seq)); //ดึงเฉพาะคน seq ไม่ซ้ำ

            for (let i = $scope.data_reviewer.length - 1; i >= 0; i--) {
                let existingUser = $scope.data_reviewer[i];
                if (!arr_def.find(item => item.seq === existingUser.seq)) {
                    $scope.data_reviewer.splice(i, 1);
                }
            }

            $scope.data_reviewer.push(...uniqueItems);            

            running_no_format_1($scope.data_reviewer, null, null);
        }

        apply();
    }

    $scope.removeDataEmpSession = function (seq, seq_session) {

        var arrdelete = $filter('filter')($scope.data_memberteam, function (item) {
            return (item.seq == seq && item.action_type == 'update');
        });
        if (arrdelete.length > 0) { $scope.data_memberteam_delete.push(arrdelete[0]); }

        $scope.data_memberteam = $filter('filter')($scope.data_memberteam, function (item) {
            return !(item.seq == seq && item.id_session == seq_session);
        });

        //if delete row 1 clear to null
        if ($scope.data_memberteam.length == 1 || $scope.data_memberteam.no == 1) {
            var keysToClear = ['document_name', 'document_no', 'descriptions'];


            keysToClear.forEach(function(key) {
                $scope.data_memberteam[0][key] = null;
            });

            $scope.data_drawing[0].no = 1;
        }        

        running_no_format_1($scope.data_memberteam, null, null);
        apply();
    };

    // <==== (Kul)Drawing & Reference zone function  ====>     
    $scope.addDrawingDoc = function (seq, index) {

        $scope.MaxSeqDataDrawingDoc = Number($scope.MaxSeqDataDrawingDoc) + 1;
        var xValues = $scope.MaxSeqDataDrawingDoc;

        var arr = $filter('filter')($scope.data_drawing, function (item) { return (item.seq == seq); });
        var iNo = 1; if (arr.length > 0) { iNo = arr[0].no; }

        var newInput = clone_arr_newrow($scope.data_drawing_def)[0];
        newInput.seq = xValues;
        newInput.id = xValues;
        newInput.no = (iNo + 1);
        newInput.action_type = 'insert';
        newInput.action_change = 1;
        console.clear();

        running_no_format_2($scope.data_drawing, iNo, index, newInput);

        $scope.selectDrawingDoc = xValues;
        apply();
        
    }
    $scope.copyDrawingDoc = function (seq, index) {

        $scope.MaxSeqDataDrawingDoc = Number($scope.MaxSeqDataDrawingDoc) + 1;
        var xValues = $scope.MaxSeqDataDrawingDoc;

        var arr = $filter('filter')($scope.data_drawing, function (item) {
            return (item.seq == seq);
        });
        var iNo = 1; if (arr.length > 0) { iNo = arr[0].no; }

        for (let i = 0; i < arr.length; i++) {
            var newInput = clone_arr_newrow($scope.data_drawing_def)[0];
            newInput.seq = Number(xValues);
            newInput.id = Number(xValues);
            newInput.no = (iNo + 1);
            newInput.action_type = 'insert';
            newInput.action_change = 1;
            newInput.document_name = arr[i].document_name;
            newInput.drawing_no = arr[i].drawing_no;
            newInput.document_file = arr[i].document_file;
            newInput.comment = arr[i].comment;
        };
        running_no_format_1($scope.data_drawing, iNo, index, newInput);

        $scope.selectDrawingDoc = xValues;
        apply();
    }
    $scope.removeDrawingDoc = function (seq, index) {
        var arrdelete = $filter('filter')($scope.data_drawing, function (item) {
            return (item.seq == seq && item.action_type == 'update');
        });
        if (arrdelete.length > 0) { $scope.data_drawing_delete.push(arrdelete[0]); }

        $scope.data_drawing = $filter('filter')($scope.data_drawing, function (item) {
            return !(item.seq == seq);
        });

        if ($scope.data_drawing.length == 0) {
            $scope.addDrawingDoc();
        }

        //if delete row 1 clear to null
        if ($scope.data_drawing.length == 1 || $scope.data_drawing.no == 1) {
            var keysToClear = ['document_name', 'document_no', 'descriptions'];


            keysToClear.forEach(function(key) {
                $scope.data_drawing[0][key] = null;
            });

            $scope.data_drawing[0].no = 1;
        }

        running_no_format_1($scope.data_drawing, null, index, null); //index??

        apply();

    };


    // <==== (Kul)RAM zone function  ====>     
    $scope.openModalNewRAM = function (seq) {

        $('#modalNewRAM').modal('show');
    };

    $scope.ram_name =[];

    $scope.actionChange_ram_name = function (item) {
        
        $scope.ram_name = item ;
        apply();

    };

    $scope.confirmAddRAM = function () {
        $('#modalNewRAM').modal('show');
        //$scope.ram_rows_level = 4;
        //$scope.ram_columns_level = 4;

        //check data in maste_ram  
        var arr = $filter('filter')($scope.master_ram, function (item) {
            return (item.ram_rows_level == Number($scope.ram_rows_level) && item.ram_columns_level == Number($scope.ram_columns_level));
        });
        if (arr.length > 0) {
            $scope.ram_msg_level = 'Risk Assessment Matrix data is already in the system';
            var id_ram = Number(arr[0].id);
            $scope.data_general[0].id_ram = id_ram;
            apply();

            $('#modalNewRAM').modal('hide');
            return;
        }

        if (true) {
            //seq, id, name, descriptions, active_type, category_type, document_file_name, document_file_path
            var newInput = clone_arr_newrow($scope.master_ram)[0];
            newInput.seq = Number(0);
            newInput.id = Number(0);
            newInput.active_type = 1;
            newInput.category_type = 0;
            newInput.document_file_name = null;
            newInput.document_file_path = null;

            newInput.ram_rows_level = Number($scope.ram_rows_level);
            newInput.ram_columns_level = Number($scope.ram_columns_level);

            newInput.name = $scope.ram_rows_level + 'x' + $scope.ram_columns_level;
            newInput.descriptions = 'Risk Assessment Matrix :' + $scope.ram_rows_level + 'x' + $scope.ram_columns_level;
            newInput.ram_name = $scope.ram_name;

            newInput.action_change = 1;
            newInput.action_type = 'insert'
            $scope.master_ram.push(newInput);

            console.log($scope.master_ram)

        }
        var json_ram_master = angular.toJson($scope.master_ram);
        var user_name = $scope.user_name;

        $.ajax({
            url: url_ws + "Flow/set_master_ram",
            data: '{"user_name":"' + user_name + '"'
                + ',"json_ram_master":' + JSON.stringify(json_ram_master)
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
                
                if (arr.msg[0].status == 'true') {

                    //แก้ไขเบื้องต้น เนื่องจาก path file ผิดต้องเป็น folder jsea
                    for (let i = 0; i < arr.ram.length; i++) {
                        arr.ram[i].document_file_path = (url_ws.replace('/api/', '/')) + arr.ram[i].document_file_path;
                    }
                    $scope.master_ram = arr.ram;
                    $scope.master_ram_level = arr.ram_level;
                    $scope.master_security_level = arr.security_level;
                    $scope.master_likelihood_level = arr.likelihood_level;

                    var arr = $filter('filter')($scope.master_ram, function (item) {
                        return (item.ram_rows_level == Number($scope.ram_rows_level) && item.ram_columns_level == Number($scope.ram_columns_level));
                    });
                    if (arr.length > 0) {
                        var id_ram = Number(arr[0].id);
                        $scope.data_general[0].id_ram = id_ram;
                        set_master_ram_likelihood(id_ram);
                    }
                    apply();

                    $('#modalNewRAM').modal('hide');
                } else {
                    $scope.ram_msg_level = arr.msg[0].status;
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

    };


    // <==== (Kul) WorkSheet zone function  ====>    
    $scope.adddata_tasks_worksheet_lv1 = function (row_type, item, index) {
        if (row_type.indexOf('workstep') > -1) { row_type = 'workstep'; }
        else if (row_type.indexOf('taskdesc') > -1) { row_type = 'taskdesc'; }
        else if (row_type.indexOf('potentailhazard') > -1) { row_type = 'potentailhazard'; }
        else if (row_type.indexOf('possiblecase') > -1) { row_type = 'possiblecase'; }
        else if (row_type.indexOf('category') > -1) { row_type = 'category'; }

        var seq = item.seq;
        var seq_workstep = item.seq_workstep;1
        var seq_taskdesc = item.seq_taskdesc;
        var seq_potentailhazard = item.seq_potentailhazard;
        var seq_possiblecase = item.seq_possiblecase;
        var seq_category = item.seq_category;

        var no = Number(item.no);
        var workstep_no = Number(item.workstep_no);
        var taskdesc_no = Number(item.taskdesc_no);
        var potentailhazard_no = Number(item.potentailhazard_no);
        var possiblecase_no = Number(item.possiblecase_no);
        var category_no = Number(item.category_no);

        //row now
        var iNo = no;
        if (row_type == "workstep") {
            var arr = $filter('filter')($scope.data_tasks_worksheet, function (_item) {
                return (_item.no >= no && _item.seq_workstep == seq_workstep);
            });
            if (arr.length > 0) {
                arr.sort((a, b) => a.no - b.no);
                iNo = arr[arr.length - 1].no;
            }
        } else if (row_type == "taskdesc") {
            var arr = $filter('filter')($scope.data_tasks_worksheet, function (_item) {
                return (_item.no >= no && _item.seq_workstep == seq_workstep && _item.seq_taskdesc == seq_taskdesc);
            });
            if (arr.length > 0) { iNo = arr[arr.length - 1].no; }
        } else if (row_type == "potentailhazard") {
            var arr = $filter('filter')($scope.data_tasks_worksheet, function (_item) {
                return (_item.no >= no && _item.seq_workstep == seq_workstep && _item.seq_taskdesc == seq_taskdesc && _item.seq_potentailhazard == seq_potentailhazard);
            });
            if (arr.length > 0) { iNo = arr[arr.length - 1].no; }
        } else if (row_type == "possiblecase") {
            var arr = $filter('filter')($scope.data_tasks_worksheet, function (_item) {
                return (_item.no >= no && _item.seq_workstep == seq_workstep && _item.seq_possiblecase == seq_possiblecase && _item.seq_potentailhazard == seq_potentailhazard
                    && _item.seq_possiblecase == seq_possiblecase);
            });
            if (arr.length > 0) { iNo = arr[arr.length - 1].no; }
        } else if (row_type == "category") {
            var arr = $filter('filter')($scope.data_tasks_worksheet, function (_item) {
                return (_item.no >= no && _item.seq_workstep == seq_workstep && _item.seq_possiblecase == seq_possiblecase && _item.seq_potentailhazard == seq_potentailhazard
                    && _item.seq_possiblecase == seq_possiblecase && _item.seq_category == seq_category);
            });
            if (arr.length > 0) { iNo = arr[arr.length - 1].no; }
        }


        $scope.MaxSeqdata_tasks_worksheet = Number($scope.MaxSeqdata_tasks_worksheet) + 1;
        var xseq = $scope.MaxSeqdata_tasks_worksheet;

        if (row_type == "workstep") {
            $scope.MaxSeqdata_tasks_worksheetworkstep = Number($scope.MaxSeqdata_tasks_worksheetworkstep) + 1;
            seq_workstep = $scope.MaxSeqdata_tasks_worksheetworkstep;

            //กรณีที่เป็น workstep ให้ +1 
            workstep_no += 1;
            taskdesc_no = 1;
            potentailhazard_no = 1;
            possiblecase_no = 1;
            category_no = 1;
        }
        if (row_type == "taskdesc") {
            $scope.MaxSeqdata_tasks_worksheettaskdesc = Number($scope.MaxSeqdata_tasks_worksheettaskdesc) + 1;
            seq_taskdesc = $scope.MaxSeqdata_tasks_worksheettaskdesc;

            //กรณีที่เป็น taskdesc ให้ +1
            taskdesc_no += 1;
            potentailhazard_no = 1;
            possiblecase_no = 1;
            category_no = 1;
        }
        if (row_type == "potentailhazard") {
            $scope.MaxSeqdata_tasks_worksheetpotentailhazard = Number($scope.MaxSeqdata_tasks_worksheetpotentailhazard) + 1;
            seq_potentailhazard = $scope.MaxSeqdata_tasks_worksheetpotentailhazard;

            //กรณีที่เป็น taskdesc ให้ +1
            potentailhazard_no -= 1;
            possiblecase_no = 1;
            category_no = 1;
        }
        if (row_type == "possiblecase") {
            $scope.MaxSeqdata_tasks_worksheetpossiblecase = Number($scope.MaxSeqdata_tasks_worksheetpossiblecase) + 1;
            seq_possiblecase = $scope.MaxSeqdata_tasks_worksheetpossiblecase;

            //กรณีที่เป็น taskdesc ให้ +
            possiblecase_no += 1;
            category_no = 1;
        }
        if (row_type == "category") {
            $scope.MaxSeqdata_tasks_worksheetcategory = Number($scope.MaxSeqdata_tasks_worksheetcategory) + 1;
            category = $scope.MaxSeqdata_tasks_worksheetcategory;

            //กรณีที่เป็น cat ให้ +1
            category_no += 1;
        }

        var newInput = clone_arr_newrow($scope.data_tasks_worksheet_def)[0];
        newInput.seq = xseq;
        newInput.id = xseq;

        newInput.row_type = row_type;//workstep,taskdesc,potentailhazard,possiblecase,category

        newInput.seq_workstep = seq_workstep;
        newInput.seq_taskdesc = seq_taskdesc;
        newInput.seq_potentailhazard = seq_potentailhazard;
        newInput.seq_possiblecase = seq_possiblecase;
        newInput.seq_category = seq_category;

        newInput.no = no;
        newInput.workstep_no = workstep_no;
        newInput.taskdesc_no = taskdesc_no;
        newInput.potentailhazard_no = potentailhazard_no;
        newInput.possiblecase_no = possiblecase_no;
        newInput.category_no = category_no;

        //newInput.recommendations_no = recommendations_no; 
        newInput.row_type = row_type;

        newInput.action_type = 'insert';
        newInput.action_change = 1;
        newInput.action_status = 'Open';

        $scope.selectdata_tasks_worksheet = xseq;

        console.log($scope.data_tasks_worksheet);
        //console.clear();


        index = (iNo - 1);
        running_no_format_2($scope.data_tasks_worksheet, iNo, index, newInput);

        if (row_type == "workstep" || row_type == "taskdesc" || true) {
            //workstep,taskdesc,potentailhazard,possiblecase,category
            running_no_workstep();
            running_no_taskdesc(seq_workstep);
            running_no_potentailhazard(seq_workstep, seq_taskdesc);
            running_no_possiblecase(seq_workstep, seq_taskdesc, seq_potentailhazard);

        } else if (row_type == "category") {
            //not running
        }

        apply();


        console.log($scope.data_tasks_worksheet)
    }

    $scope.removeDataworksheet = function (row_type, item, index) {

        console.log("55555555")
        
        var seq = item.seq;
        var seq_workstep = item.seq_workstep;
        var seq_taskdesc = item.seq_taskdesc;
        var seq_potentailhazard = item.seq_potentailhazard;
        var seq_possiblecase = item.seq_possiblecase;

        //กรณีที่เป็นรายการเดียวไม่ต้องลบ ให้ cleare field 
        var arrCheck = [];
        if (true) {
            if (row_type == "workstep") {
                var arrCheck = $filter('filter')($scope.data_tasks_worksheet, function (_item) {
                    return (true);
                });
            } else if (row_type == "taskdesc") {
                var arrCheck = $filter('filter')($scope.data_tasks_worksheet, function (_item) {
                    return (_item.seq_workstep == seq_workstep);
                });
            } else if (row_type == "potentailhazard") {
                var arrCheck = $filter('filter')($scope.data_tasks_worksheet, function (_item) {
                    return (_item.seq_workstep == seq_workstep & _item.seq_taskdesc == seq_taskdesc);
                });
            } else if (row_type == "possiblecase") {
                var arrCheck = $filter('filter')($scope.data_tasks_worksheet, function (_item) {
                    return (_item.seq_workstep == seq_workstep & _item.seq_taskdesc == seq_taskdesc & _item.seq_potentailhazard == seq_potentailhazard);
                });
            } else if (row_type == "category") {
                var arrCheck = $filter('filter')($scope.data_tasks_worksheet, function (_item) {
                    return (_item.seq_workstep == seq_workstep & _item.seq_taskdesc == seq_taskdesc & _item.seq_potentailhazard == seq_potentailhazard & _item.seq_possiblecase == seq_possiblecase);
                });
            }
        }
        if (arrCheck.length == 1) {
            //กรณีที่เหลือ row เดียว  
            arrCheck[0].action_type = 'update';
            arrCheck[0].action_change = 1;
            arrCheck[0].action_status = 'Open';

            arrCheck[0].workstep = null;
            arrCheck[0].taskdesc = null;
            arrCheck[0].potentailhazard = null;
            arrCheck[0].possiblecase = null;

            arrCheck[0].category_type = null;

            arrCheck[0].ram_befor_security = null;
            arrCheck[0].ram_befor_likelihood = null;
            arrCheck[0].ram_befor_risk = null;
            arrCheck[0].major_accident_event = null;
            arrCheck[0].safety_critical_equipment = null;
            arrCheck[0].existing_safeguards = null;
            arrCheck[0].ram_after_security = null;
            arrCheck[0].ram_after_likelihood = null;
            arrCheck[0].ram_after_risk = null;
            arrCheck[0].recommendations = null;

            arrCheck[0].responder_user_id = null;
            arrCheck[0].responder_user_name = null;
            arrCheck[0].responder_user_email = null;
            arrCheck[0].responder_user_displayname = null;
            arrCheck[0].responder_user_img = null;

            arrCheck[0].row_type = row_type == "workstep";
            apply();
            return;
        }


        var arrdelete = $filter('filter')($scope.data_tasks_worksheet, function (item) {
            return (item.seq == seq && item.action_type == 'update');
        });
        if (arrdelete.length > 0) { $scope.data_tasks_worksheet_delete.push(arrdelete[0]); }

        $scope.data_tasks_worksheet = $filter('filter')($scope.data_tasks_worksheet, function (item) {
            return !(item.seq == seq);
        });

        running_no_format_2($scope.data_tasks_worksheet, 1, 0, null);
        if (row_type == "workstep") {
            running_no_workstep();
        } else if (row_type == "taskdesc") {
            running_no_workstep();
            running_no_taskdesc(seq_workstep);
        }
    };

    $scope.removedata_tasks_worksheet = function (seq) {

        $scope.data_tasks_worksheet = $filter('filter')($scope.data_tasks_worksheet, function (item) {
            return !(item.seq == seq);
        });

        var arrdelete = $filter('filter')($scope.data_tasks_worksheet, function (item) {
            return (item.seq == seq && item.action_type == 'update');
        });
        if (arrdelete.length > 0) { $scope.data_tasks_worksheet_delete.push(arrdelete[0]); }

        $scope.data_tasks_worksheet = $filter('filter')($scope.data_tasks_worksheet, function (item) {
            return !(item.seq == seq);
        });
        if ($scope.data_tasks_worksheet.length == 0) {
            $scope.adddata_tasks_worksheet_lv1('category', item)
        }

        //workstep,taskdesc,potentailhazard,possiblecase,category
        running_no_format_2($scope.data_tasks_worksheet, iNo, index, newInput);
        if (row_type == "workstep") {
            running_no_workstep();
        } else if (row_type == "taskdesc") {
            running_no_workstep();
            running_no_taskdesc(seq_workstep);
        }
    };
    function running_no_workstep() {
        var arr_items = $filter('filter')($scope.data_tasks_worksheet, function (item) {
            return ((item.row_type == 'workstep'));
        });
        arr_items.sort((a, b) => a.no - b.no);
        var first_row = true;
        var iNoNew = 1;

        for (let i = 0; i < arr_items.length; i++) {
            arr_items[i].workstep_no = (iNoNew);
            iNoNew++;
            if (i == 0) { arr_items[i].row_type == 'workstep'; }
            else { arr_items[i].row_type == ''; }
        };

        arr_items.sort((a, b) => a.workstep_no - b.workstep_no);

        arr_items = $filter('filter')($scope.data_tasks_worksheet, function (item) {
            return (true);
        });

        var bfor = ''; var after = ''; iNoNew = 1;
        for (let i = 0; i < arr_items.length; i++) {
            arr_items[i].no = (iNoNew);
            iNoNew++;
        };
    }
    function running_no_taskdesc(seq_workstep) {
        var arr_items = $filter('filter')($scope.data_tasks_worksheet, function (item) {
            return (item.seq_workstep == seq_workstep
                && (item.row_type == 'workstep' || item.row_type == 'taskdesc'));
        });
        arr_items.sort((a, b) => a.no - b.no);
        var first_row = true;
        var iNoNew = 1;

        for (let i = 0; i < arr_items.length; i++) {
            arr_items[i].taskdesc_no = (iNoNew);
            iNoNew++;
        };
        arr_items.sort((a, b) => a.taskdesc_no - b.taskdesc_no);
    }
    function running_no_potentailhazard(seq_workstep, seq_taskdesc) {
        //workstep,taskdesc,potentailhazard,possiblecase,category
        var arr_items = $filter('filter')($scope.data_tasks_worksheet, function (item) {
            return (item.seq_workstep == seq_workstep
                && item.seq_taskdesc == seq_taskdesc
                && (item.row_type == 'workstep' || item.row_type == 'taskdesc' || item.row_type == 'potentailhazard'));
        });
        arr_items.sort((a, b) => a.no - b.no);
        var first_row = true;
        var iNoNew = 1;

        for (let i = 0; i < arr_items.length; i++) {
            arr_items[i].potentailhazard_no = (iNoNew);
            iNoNew++;
        };
        arr_items.sort((a, b) => a.potentailhazard_no - b.potentailhazard_no);
    }
    function running_no_possiblecase(seq_workstep, seq_taskdesc, seq_potentailhazard) {
        //workstep,taskdesc,potentailhazard,possiblecase,category
        var arr_items = $filter('filter')($scope.data_tasks_worksheet, function (item) {
            return (item.seq_workstep == seq_workstep
                && item.seq_taskdesc == seq_taskdesc
                && item.seq_potentailhazard == seq_potentailhazard
                && (item.row_type == 'workstep' || item.row_type == 'taskdesc' || item.row_type == 'potentailhazard' || item.row_type == 'possiblecase'));
        });
        arr_items.sort((a, b) => a.no - b.no);
        var first_row = true;
        var iNoNew = 1;

        for (let i = 0; i < arr_items.length; i++) {
            arr_items[i].possiblecase_no = (iNoNew);
            iNoNew++;
        };
        arr_items.sort((a, b) => a.possiblecase_no - b.possiblecase_no);
    }

    function running_no_category(seq_workstep, seq_taskdesc, seq_potentailhazard, seq_possiblecase) {
        //workstep,taskdesc,potentailhazard,possiblecase,category
        var arr_items = $filter('filter')($scope.data_tasks_worksheet, function (item) {
            return (item.seq_workstep == seq_workstep
                && item.seq_taskdesc == seq_taskdesc
                && item.seq_potentailhazard == seq_potentailhazard
                && item.seq_possiblecase == seq_possiblecase
                && (item.row_type == 'workstep' || item.row_type == 'taskdesc' || item.row_type == 'potentailhazard' || item.row_type == 'possiblecase' || item.row_type == 'category'));
        });
        arr_items.sort((a, b) => a.no - b.no);
        var first_row = true;
        var iNoNew = 1;

        for (let i = 0; i < arr_items.length; i++) {
            arr_items[i].category_no = (iNoNew);
            iNoNew++;
        };
        arr_items.sort((a, b) => a.category_no - b.category_no);
    }
    $scope.openModalDataRAM = function (ram_type, seq, ram_type_action) {

        $scope.selectdata_tasks_worksheet = seq;
        $scope.selectedDataworksheetRamType = ram_type;
        $scope.selectedDataRamTypeAction = ram_type_action;

        $scope.selectedDataNodeWorksheetRamType = ram_type;

        apply();

        $('#modalRAM').modal('show');
    }
    $scope.openModalDataNotification = function (item) {
        //modalNotification

        //item.id_apu 
        $('#modalNotification').modal('show');
    }
    $scope.selectDataRAM = function (ram_type, id_select) {

        var xseq = $scope.selectdata_tasks_worksheet;
        var xbefor = $scope.selectedDataRamTypeAction;

        for (let i = 0; i < $scope.data_tasks_worksheet.length; i++) {
            try {

                if ($scope.data_tasks_worksheet[i].seq !== xseq) { continue; }

                if (xbefor == "befor" && ram_type == "s") { $scope.data_tasks_worksheet[i].ram_befor_security = id_select; }
                if (xbefor == "befor" && ram_type == "l") { $scope.data_tasks_worksheet[i].ram_befor_likelihood = id_select; }

                if (xbefor == "after" && ram_type == "s") { $scope.data_tasks_worksheet[i].ram_after_security = id_select; }
                if (xbefor == "after" && ram_type == "l") { $scope.data_tasks_worksheet[i].ram_after_likelihood = id_select; }

                var ram_security = $scope.data_tasks_worksheet[i].ram_befor_security + "";
                var ram_likelihood = $scope.data_tasks_worksheet[i].ram_befor_likelihood + "";
                var ram_risk = "";
                if (xbefor == "after") {
                    ram_security = $scope.data_tasks_worksheet[i].ram_after_security + "";
                    ram_likelihood = $scope.data_tasks_worksheet[i].ram_after_likelihood + "";
                }
                if (ram_security == "" || ram_likelihood == "") {
                    if (xbefor == "befor") { $scope.data_tasks_worksheet[i].ram_befor_risk = ""; }
                    else { $scope.data_tasks_worksheet[i].ram_after_risk = ""; }
                    break;
                }


                var safety_critical_equipment = 'N';
                //master_ram_level  | filter:{id_ram:data_general[0].id_ram}
                var id_ram = $scope.data_general[0].id_ram;
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
                //item.safety_critical_equipment
                if (xbefor == "befor" && (ram_type == "s" || ram_type == "l")) {
                    $scope.data_tasks_worksheet[i].safety_critical_equipment = safety_critical_equipment;
                }

                if (xbefor == "befor") { $scope.data_tasks_worksheet[i].ram_befor_risk = ram_risk; }
                else { $scope.data_tasks_worksheet[i].ram_after_risk = ram_risk; }

                if ($scope.data_tasks_worksheet[i].action_type == 'update') {
                    $scope.data_tasks_worksheet[i].action_change = 1;
                }


                $scope.actionChangeWorksheet($scope.data_tasks_worksheet[i], $scope.data_tasks_worksheet[i].seq);
                break;

                

            } catch (e) { }
        }


        $('#modalRAM').modal('hide');
    }
    $scope.openModalDataEmployee = function (form_type, seq) {
        $scope.selectDatFormType = form_type;
        $scope.selectdata_tasks_worksheet = seq;

        $scope.selectdata_action_seq = seq;
        $scope.selectdata_action_type = form_type;

        $('#modalEmployeeSelect').modal('show');
    }
    $scope.selectDataEmployee = function (item) {

        var id = item.id;
        var employee = item.employee_name;
        var employee_display = item.employee_displayname;
        var employee_email = item.employee_email;
        var profile = item.employee_img;

        var xseq = $scope.selectdata_tasks_worksheet;
        var xformtype = $scope.selectDatFormType;

        $scope.DataMain = [];
        if (xformtype == "info") {
            // กรณีที่เลือก approver ta2
            // approve_action_type, approve_status, approver_user_name, approver_user_displayname 
            $scope.data_header[0].approver_user_name = employee;
            $scope.data_header[0].approver_user_displayname = employee_display;
            $scope.data_header[0].action_change = 1;
        }
        else if (xformtype == "approver") {
            $scope.data_approver[0].user_name = employee;
            $scope.data_approver[0].user_displayname = employee_display;

            var arr_items = $filter('filter')($scope.data_approver, function (item) { return (item.seq == xseq); })[0];
            action_type_changed_non_apply(arr_items, arr_items.seq, '');

        }
        else if (xformtype == "employee" || xformtype == "worksheet") {

            var arr_items = $filter('filter')($scope.data_tasks_worksheet, function (item) { return (item.seq == xseq); })[0];

            arr_items.responder_user_id = id;
            arr_items.responder_user_name = employee;
            arr_items.responder_user_displayname = employee_display;
            arr_items.responder_user_email = employee_email;
            arr_items.responder_user_img = profile;

            action_type_changed_non_apply(arr_items, arr_items.seq);
        }

        apply();
        $('#modalEmployeeSelect').modal('hide');
    };

    $scope.removeDataEmpWorkSheet = function (form_type, id, seq) {
        var xseq = seq;
        var xformtype = $scope.selectDatFormType;

        if (xformtype == "info") {
            $scope.DataMain = [];
        } else {
            for (let i = 0; i < $scope.data_tasks_worksheet.length; i++) {
                try {
                    if ($scope.data_tasks_worksheet[i].seq == xseq) {
                        $scope.data_tasks_worksheet[i].responder_user_id = null;
                        $scope.data_tasks_worksheet[i].responder_user_name = null;
                        $scope.data_tasks_worksheet[i].responder_user_displayname = null;
                        $scope.data_tasks_worksheet[i].responder_user_email = null;
                        $scope.data_tasks_worksheet[i].responder_user_img = null;
                        break;
                    }
                } catch (e) { }
            };
        }
    };




    // <==== (Kul) WorkSheet zone function  ====> 

    //Merge member + re-check attendees
    function mergeData(user_type_of, item) {
        if (user_type_of === 'memberteam') {
            $scope.data_attendees = [...$scope.data_attendees,...$scope.data_memberteam];
        } else if (user_type_of === 'attendees' && (item.user_type_of === 'related_people' || item.user_type_of === 'member')) {
            const allUser = new Set($scope.data_attendees.map(item => item.seq));
            const itemsToAdd = item.filter(item => !allUser.has(item.seq));
            $scope.data_attendees.push(...itemsToAdd);
        }
    }
    
    //Free Text
    // set mock array 
    $scope.data_Outsider = [];

    const actionTypes = [
        { type: 'attendees', no: 'attendees_no' },
        { type: 'reviewer', no: 'reviewer_no' },
        { type: 'approver', no: 'approver_no' },
        { type: 'specialist', no: 'specialist_no' }
    ];
    
    for (const actionType of actionTypes) {
        const item = {
            outsider_name: null,
            outsider_title: null,
            action_type: actionType.type,
            user_action_type: "Free Text"
        };
    
        item[actionType.no] = 1;
    
        $scope.data_Outsider.push(item);
    }
    
    // Add new row based on action_type
    $scope.addnewFreebox = function (action_type) {
        const property = actionTypes.find(type => type.type === action_type)?.no;

        if (property) {
            // + No. when add new row of the specified action type
            const newRow = {
                outsider_name: null,
                outsider_title: null,
                action_type: action_type,
                user_action_type: "Free Text"
            };
            newRow[property] = $scope.data_Outsider
                .filter(item => item.action_type === action_type)
                .reduce((maxNo, item) => Math.max(maxNo, item[property] || 0), 0) + 1;

            $scope.data_Outsider.push(newRow);
        }
    };
    
    $scope.actionChangeFreetext = function (item,index,action_type) {

        setDataOutsider(item,index,action_type);

        //console.log($scope.data_Outsider)
    };
    
    function setDataOutsider(item,index,action_type) {

        let outsider_name = item.outsider_name;
        let outsider_title = item.outsider_title;
        let outsider_no = index

        $scope.data_Outsider = $scope.data_Outsider.map(function (item, i) {

            if (i === outsider_no && item.action_type === 'attendees' ) {
                item.outsider_name = outsider_name,
                item.outsider_title =  outsider_title,
                item.action_type =  'attendees',
                item.outsider_no = i+1

            }else if (i === outsider_no && item.action_type === 'reviewer')  {
                item.outsider_name = outsider_name,
                item.outsider_title =  outsider_title,
                action_type = 'reviewer',
                item.outsider_no = i+1

            } else if (i === outsider_no && item.action_type === 'specialist' ) {
                item.outsider_name = outsider_name,
                item.outsider_title =  outsider_title,
                action_type = 'specialist',
                item.outsider_no = i+1

            } else if (i === outsider_no && item.action_type === 'approver' ) {
                item.outsider_name = outsider_name,
                item.outsider_title =  outsider_title,
                action_type = 'approver',
                item.outsider_no = i+1

            } else {
                action_type = '';
            }
            return item;
        });
    }

    //Set Main Approver
    $scope.setUserTypeMain = function(selectedItem,action_type) {
        console.log($scope.data_attendees)
        selectedItem.isClicked = true;

        if (action_type === 'attendees') {
            selectedItem.user_type_main = 1;
            $scope.data_attendees.forEach(function (item) {
                if (item !== selectedItem) {
                    item.user_type_main = 0;
                    item.isClicked = false;                    
                }
            });
        } else if (action_type === 'reviewer') {
            selectedItem.user_type_main = 1;
            $scope.data_reviewer.forEach(function (item) {
                if (item !== selectedItem) {
                    item.user_type_main = 0;
                    item.isClicked = false;
                }
            });
        } else if (action_type === 'specialist') {
            selectedItem.user_type_main = 1;
            $scope.data_specialist.forEach(function (item) {
                if (item !== selectedItem) {
                    item.user_type_main = 0;
                    item.isClicked = false;
                }
            });
        } else if (action_type === 'approver') {
            selectedItem.user_type_main = 1;
            $scope.data_approver.forEach(function (item) {
                if (item !== selectedItem) {
                    item.user_type_main = 0;
                    item.isClicked = false;
                }
            });
        }
    
    };

    $scope.removeDataEmpRelatedPeople = function () {

        var seq = $scope.selectdata_action_seq;
        var action_type = $scope.selectdata_action_type;

        if (action_type == 'attendees') {
            $scope.data_attendees[0].user_name = null;
            $scope.data_attendees[0].user_displayname = null;
            $scope.data_attendees[0].reviewer_date = null;
        } else if (action_type == 'specialist') {
            $scope.data_specialist[0].user_name = null;
            $scope.data_specialist[0].user_displayname = null;
            $scope.data_specialist[0].reviewer_date = null;
        }else if (action_type == 'reviewer') {
            $scope.data_reviewer[0].user_name = null;
            $scope.data_reviewer[0].user_displayname = null;
            $scope.data_reviewer[0].reviewer_date = null;
        }
        apply();
    };


    $scope.zoom_div_worksheet = function (a) {

        var el = document.getElementById('WorksheetTable');
        if (a == "in") {

            el.style.zoom = 1;
            return;
        }
        if (document.fullscreenElement) {
            document.exitFullscreen();
            el.style.zoom = 0;
        } else {
            $('#WorksheetTable').get(0).requestFullscreen();

            el.style.zoom = 0.7;
            el.style.backgroundColor = "white";
        }


    };

    $scope.selectMemberTeamCalendar = false;

    $scope.ViewMemberTeamCalendar = function () {
        $scope.selectMemberTeamCalendar = !$scope.selectMemberTeamCalendar;
    };
    $scope.addText = function () {
        // var newText = {a:$scope.inputTextA,b:$scope.inputTextB,c:$scope.inputTextC}; 
        var newText1 = $scope.employee_displayname;
        var newText2 = $scope.employee_email;
        var newText3 = 'Vender';
        // var newText4 = $scope.Section;


        // ตรวจสอบค่าว่างของทั้งสอง input
        if (newText1 == '' || newText2 == '' || newText3 == '') {
            // หยุดการเพิ่มข้อมูลเนื่องจากมีค่าว่าง
            return;
        }

        var emprow = {
            employee_id: $scope.employeelist.length + 1,
            employee_displayname: newText1,
            employee_email: newText2, 
            employee_type: 'Contract', 
            employee_img: 'assets/img/team/avatar.webp', 
            selected: false, 
            seq: 0
        };

        // เพิ่มข้อความลงในแถวของตาราง
        $scope.employeelist.unshift(emprow);


    };

    $scope.Attendees = [];

    $scope.showSelectedData = function () {
        $scope.Attendees = $scope.employeelist.filter(function (item) {
            return item.selected;
        });
    };

    $scope.removeItem = function (item) {
        var index = $scope.Attendees.indexOf(item);
        if (index !== -1) {
            $scope.Attendees.splice(index, 1);
        }
    };
    $scope.Specialist = [];

    $scope.showSelectedDataSpecialist = function () {
        $scope.Specialist = $scope.employeelist.filter(function (list) {
            return list.selected;
        });
    };

    $scope.removeItemSpecialist = function (list) {
        var index = $scope.Specialist.indexOf(list);
        if (index !== -1) {
            $scope.Specialist.splice(index, 1);
        }
    };

    $scope.Reviewer = [];

    $scope.showSelectedDataReviewer = function () {
        $scope.Reviewer = $scope.employeelist.filter(function (list) {
            return list.selected;
        });
    };

    $scope.removeItemReviewer = function (list) {
        var index = $scope.Reviewer.indexOf(list);
        if (index !== -1) {
            $scope.Reviewer.splice(index, 1);
        }
    }

    $scope.selectApprover = function (item) {
        $scope.selectedDataApprover = item;
    }

    $scope.clearApprover = function (item) {
        $scope.selectedDataApprover = null;
    }

    $scope.flow_mail_to_member_show = function () {

        if ($scope.data_header[0].flow_mail_to_member == 1) {
            $scope.data_header[0].flow_mail_to_member = 0;
        } else if ($scope.data_header[0].flow_mail_to_member == 0) {
            $scope.data_header[0].flow_mail_to_member = 1
        } else {
            $scope.data_header[0].flow_mail_to_member = 1;
        }

        var inputs = document.getElementsByTagName('switchEmailToMemberChecked');
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == 'checkbox') {
                if ($scope.data_header[0].flow_mail_to_member == 1) {
                    inputs[i].checked = true;
                } else { inputs[i].checked = false; }
            }
        }
        apply();
    }

    $scope.input_type_excel_show = function () {
        $scope.selectInputTypeForm = 'option2';
        apply();
    }
    $scope.isFullscreen = false;

    $scope.toggleFullscreen = function () {
        var element = document.getElementById('fullscreenzone');

        if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }

            $scope.isFullscreen = true;

            element.style.overflow = 'auto';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }

            $scope.isFullscreen = false;

            element.style.overflow = 'hidden';
        }
    };

    document.addEventListener('keydown', $scope.handleKeydown);

    $scope.handleKeydown = function (event) {
        if (event.key == 'F11') {
            event.preventDefault();
            $scope.toggleFullscreen();
        }
    };

    $scope.$on('$destroy', function () {
        document.removeEventListener('keydown', $scope.handleKeydown);
    });


    $scope.startPage = 1;
    $scope.pdfUrl = 'http://www.thapra.lib.su.ac.th/m-talk/attachments/article/75/ebook.pdf';
    // $scope.pdfUrl = 'http://127.0.0.1:5500/public/assets/pdf/test.pdf';
    $scope.embedPdf = function (_item) {
        // find in data_drawing
        // page_start_first,page_start_second,page_end_first,page_end_second

        var arr_drawing = $filter('filter')($scope.data_drawing, function (item) {
            return ((item.id == _item.id_drawing));
        });
        if (arr_drawing.length == 0) { return; }

        var file_name = arr_drawing[0].document_file_name;
        var file_path = arr_drawing[0].document_file_path;

        var page_start_first = _item.page_start_first;
        var page_start_second = _item.page_start_second;
        var page_end_first = _item.page_end_first;
        var page_end_second = _item.page_end_second;

        $.ajax({
            url: url_ws + "Flow/copy_pdf_file",
            data: '{"file_name":"' + file_name + '","file_path":"' + file_path + '"'
                + ',"page_start_first":"' + page_start_first + '","page_start_second":"' + page_start_second + '"'
                + ',"page_end_first":"' + page_end_first + '","page_end_second":"' + page_end_second + '"'
                + '}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
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
                        //$('#modalLoadding').modal('hide'); 
                        $('#divLoading').hide();
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

    };
    $scope.formData = {};

    $scope.confirmBack = function () {

        window.open("home/portal", "_top");

        return;
        //var page = conFig.controller_action_befor();
        //conFig.pha_seq = null;
        //conFig.pha_type_doc = '';
        //window.open(page, "_top")

        var pha_type_doc = 'back';
        var pha_status = "";

        var page = conFig.controller_action_befor();
        var controller_text = "jsea";
        conFig.pha_seq = null;
        conFig.pha_type_doc = pha_type_doc;

        $.ajax({
            url: controller_text + "/next_page",
            data: '{"controller_action_befor":"' + page + '","pha_type_doc":"' + pha_type_doc + '"}',
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
        return;

    }
    $scope.confirmMailtoMemberReview = function (action) {

        if (action == 'submit') {
            //Please confirm to send the information to the member team for review. 
            $scope.Action_Msg_Header = 'Confirm send email to member review';
            $scope.Action_Msg_Detail = '';
            $('#modalMsg2').modal('show');

        }
        else if (action == 'yes') {


            var user_name = $scope.user_name;
            var token_doc = $scope.data_header[0].seq;

            $.ajax({
                url: url_ws + "Flow/set_email_member_review_stamp",
                data: '{"user_name":"' + user_name + '","token_doc":"' + token_doc + '"}',
                type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
                beforeSend: function () {
                    $("#divLoading").show();
                },
                complete: function () {
                    $("#divLoading").hide();
                },
                success: function (data) {
                    var arr = data;

                    if (arr[0].status == 'true') {
                        //ACTION_TO_REVIEW
                        var icount = $scope.data_session.length - 1;
                        $scope.data_session[icount].action_to_review = 1;

                        check_case_member_review();
                        apply();


                        $('#modalMsg2').modal('hide');
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

    }
    $scope.confirmCancle = function () {
        $scope.Action_Msg_Confirm = true;

        set_alert_confirm('Confirm canceling the PHA No.', '');
    }
    $scope.confirmSave = function (action) {

        //call function confirm ให้เลือก Ok หรือ Cancle  
        if (action == 'confirm_submit') {
            $scope.Action_Msg_Confirm = true;
            action = 'submit';
            $('#modalSendMail').modal('hide');
        } else if (action == 'confirm_submit_without') {
            $scope.Action_Msg_Confirm = true;
            action = 'submit_without';
            $('#modalSendMail').modal('hide');
            //$('#modalMsg').modal('hide');
            //return;
        } else {
            if (action == 'save') {

            } else {
                $scope.Action_Msg_Confirm = false;
                if ($scope.flow_role_type == 'admin') {
                    $('#modalSendMail').modal('show');
                    return;
                }
            }

        }

        //check required field 
        var pha_status = $scope.data_header[0].pha_status;
        //11	DF	Draft
        //12	WP	Waiting PHA Conduct
        //13	PC	PHA Conduct
        //21	WA	Waiting Approve Review
        //22	AR	Approve Reject
        //14	WF	Waiting Follow Up
        //15	WR	Waiting Review Follow Up
        //91	CL	Closed
        //81	CN	Cancle
        if (action == 'submit' || action == 'submit_without') {
            $('#modalMsg').modal('hide');
            $("#divLoading").hide();

            if ($scope.Action_Msg_Confirm == true) {
                var arr_chk = $scope.data_general;

                try {
                    if (pha_status == "11" || pha_status == "12") {
                        if (arr_chk[0].id_company == '' || arr_chk[0].id_company == null) { set_alert('Warning', 'Please select a valid Company'); return; }
                        if (arr_chk[0].id_apu == '' || arr_chk[0].id_apu == null) { set_alert('Warning', 'Please select a valid Area Process Unit'); return; }
                        if (arr_chk[0].id_toc == '' || arr_chk[0].id_toc == null) { set_alert('Warning', 'Please select a valid Thaioil Complex'); return; }
                        if ((arr_chk[0].id_unit_no == '' || arr_chk[0].id_unit_no == null) && (arr_chk[0].id_tagid == '' || arr_chk[0].id_tagid == null)) {
                            set_alert('Warning', 'Please select a valid Unit No or Tag ID');
                            return;
                        }
                        if (arr_chk[0].pha_request_name == '' || arr_chk[0].id_company == null) { set_alert('Warning', 'Please select a valid Company'); return; }

                        arr_chk = $scope.data_drawing;
                        if (arr_chk.length == 0) { set_alert('Warning', 'Please provide a valid Drawing List'); return; }

                        arr_chk = $scope.data_memberteam;
                        if (arr_chk.length == 0) { set_alert('Warning', 'Please provide a valid Session List'); return; }
                        else {
                            var irows_last = arr_chk.length - 1;
                            if (arr_chk[irows_last].user_name == null) { set_alert('Warning', 'Please provide a valid Session List'); return; }
                        }

                    }

                    if (pha_status == "12") {
                        arr_chk = $scope.data_tasks_worksheet;
                        if (arr_chk.length == 0) { set_alert('Warning', 'Please provide a valid Worksheet List'); return; }
                        for (var i = 0; i < arr_chk.length; i++) {
                            if (arr_chk[i].taskdesc == '' || arr_chk[i].taskdesc == null) { set_alert('Warning', 'Please provide a valid taskdesc'); return; }
                            if (arr_chk[i].responder_user_name == '' || arr_chk[i].responder_user_name == null) { set_alert('Warning', 'Please provide a valid Responder'); return; }
                        }
                    }

                    if ($scope.flow_role_type == 'admin') {
                        //mail noti
                        $('#modalSendMail').modal('show');
                    }

                } catch { }
            }

        } else if (action == 'save') {
            var arr_chk = $scope.data_general;
            if (pha_status == "11") {
                if (arr_chk[0].id_company == '' || arr_chk[0].id_company == null) { set_alert('Warning', 'Please select a valid Company'); return; }
                if (arr_chk[0].id_apu == '' || arr_chk[0].id_apu == null) { set_alert('Warning', 'Please select a valid Area Process Unit'); return; }
                if (arr_chk[0].id_toc == '' || arr_chk[0].id_toc == null) { set_alert('Warning', 'Please select a valid Thaioil Complex'); return; }
                if ((arr_chk[0].id_unit_no == '' || arr_chk[0].id_unit_no == null) && (arr_chk[0].id_tagid == '' || arr_chk[0].id_tagid == null)) {
                    set_alert('Warning', 'Please select a valid Unit No or Tag ID');
                    return;
                }
                if (arr_chk[0].pha_request_name == '' || arr_chk[0].id_company == null) { set_alert('Warning', 'Please select a valid Company'); return; }

            }
        }
        else { action = 'cancel' }

        save_data_create(action);

    }

    $scope.confirmSubmit = function (action) {
        $scope.Action_Msg_Confirm = false;
        if (action == 'no') {
            $('#modalMsg').modal('hide');
            return;
        }
        save_data_create("submit");
    }
    $scope.showHistory = false;

    $scope.toggleContent = function() {
      $scope.showHistory = !$scope.showHistory;
    };
    function check_data_general() {
        //แปลง date to yyyyMMdd
        //แปลง time to hh:mm
        try {
            $scope.data_general[0].target_start_date = $scope.data_general[0].target_start_date.toISOString().split('T')[0];
        } catch { }
        try {
            $scope.data_general[0].target_end_date = $scope.data_general[0].target_end_date.toISOString().split('T')[0];
        } catch { }
        try {
            $scope.data_general[0].actual_start_date = $scope.data_general[0].actual_start_date.toISOString().split('T')[0];
        } catch { }
        try {
            $scope.data_general[0].actual_end_date = $scope.data_general[0].actual_end_date.toISOString().split('T')[0];
        } catch { }
    }
    function check_data_relatedpeople() {

        //data_attendees, data_specialist, data_reviewer, data_approver 
        var pha_seq = $scope.data_header[0].seq;
        for (var i = 0; i < $scope.data_attendees.length; i++) {
            $scope.data_attendees[i].id = $scope.data_attendees[i].seq;
            $scope.data_attendees[i].id_pha = pha_seq;
            $scope.data_attendees[i].no = (i + 1);
            $scope.data_attendees[i].user_type = 'attendees';
        }
        for (var i = 0; i < $scope.data_specialist.length; i++) {
            $scope.data_specialist[i].id = $scope.data_specialist[i].seq;
            $scope.data_specialist[i].id_pha = pha_seq;
            $scope.data_specialist[i].no = (i + 1);
            $scope.data_specialist[i].user_type = 'specialist';
        }
        for (var i = 0; i < $scope.data_reviewer.length; i++) {
            $scope.data_reviewer[i].id = $scope.data_reviewer[i].seq;
            $scope.data_reviewer[i].id_pha = pha_seq;
            $scope.data_reviewer[i].no = (i + 1);
            $scope.data_reviewer[i].user_type = 'reviewer';
        }
        for (var i = 0; i < $scope.data_approver.length; i++) {
            $scope.data_approver[i].id = $scope.data_approver[i].seq;
            $scope.data_approver[i].id_pha = pha_seq;
            $scope.data_approver[i].no = (i + 1);
            $scope.data_approver[i].user_type = 'approver';
            try {
                $scope.data_approver[i].reviewer_date = $scope.data_approver[i].reviewer_date.toISOString().split('T')[0];
            } catch { $scope.data_approver[i].reviewer_date = null; }
        }

        //data_attendees, data_specialist, data_reviewer, data_approver 
        var arr_active = [];
        angular.copy($scope.data_attendees, arr_active);
        var arr_json = $filter('filter')(arr_active, function (item) {
            return ((item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert');
        });
        for (var i = 0; i < $scope.data_specialist.length; i++) {
            var item = $scope.data_specialist[i];
            if ((item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert') {
                arr_json.push($scope.data_specialist[i]);
            }
        }
        for (var i = 0; i < $scope.data_reviewer.length; i++) {
            var item = $scope.data_reviewer[i];
            if ((item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert') {
                arr_json.push($scope.data_reviewer[i]);
            }
        }
        for (var i = 0; i < $scope.data_approver.length; i++) {
            var item = $scope.data_approver[i];
            if ((item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert') {
                arr_json.push($scope.data_approver[i]);
            }
        }

        if (true) {
            //attendees
            for (var i = 0; i < $scope.data_attendees_delete.length; i++) {
                $scope.data_attendees_delete[i].action_type = 'delete';
                arr_json.push($scope.data_attendees_delete[i]);
            }
            for (var i = 0; i < arr_json.length; i++) {
                if (arr_json[i].user_name == null
                    && arr_json[i].user_type == 'attendees'
                    && arr_json[i].action_type != 'delete'
                ) {
                    arr_json[i].action_type = 'delete';
                }
            }

            //check จากข้อมูลเดิมที่เคยบันทึกไว้ถ้าไม่มีในของเดิมให้ delete ออกด้วย
            for (var i = 0; i < $scope.data_attendees_old.length; i++) {
                var arr_check = $filter('filter')($scope.data_attendees, function (item) {
                    return (item.action_type != 'delete' && item.user_type == 'attendees'
                        && item.user_type == $scope.data_attendees_old[i].user_type
                        && item.user_name == $scope.data_attendees_old[i].user_name
                    );
                });
                if (arr_check.length == 0) {
                    //arr_json[i].action_type = 'delete';
                    $scope.data_attendees_old[i].action_type = 'delete';
                    arr_json.push($scope.data_attendees_old[i]);
                }
            }
        }

        if (true) {
            //specialist
            for (var i = 0; i < $scope.data_specialist_delete.length; i++) {
                $scope.data_specialist_delete[i].action_type = 'delete';
                arr_json.push($scope.data_specialist_delete[i]);
            }
            for (var i = 0; i < arr_json.length; i++) {
                if (arr_json[i].user_name == null
                    && arr_json[i].user_type == 'specialist'
                    && arr_json[i].action_type != 'delete'
                ) {
                    arr_json[i].action_type = 'delete';
                }
            }

            //check จากข้อมูลเดิมที่เคยบันทึกไว้ถ้าไม่มีในของเดิมให้ delete ออกด้วย
            for (var i = 0; i < $scope.data_specialist_old.length; i++) {
                var arr_check = $filter('filter')($scope.data_specialist, function (item) {
                    return (item.action_type != 'delete' && item.user_type == 'specialist'
                        && item.user_type == $scope.data_specialist_old[i].user_type
                        && item.user_name == $scope.data_specialist_old[i].user_name
                    );
                });
                if (arr_check.length == 0) {
                    //arr_json[i].action_type = 'delete';
                    $scope.data_specialist_old[i].action_type = 'delete';
                    arr_json.push($scope.data_specialist_old[i]);
                }
            }

        }

        if (true) {
            //specialist
            for (var i = 0; i < $scope.data_reviewer_delete.length; i++) {
                $scope.data_reviewer_delete[i].action_type = 'delete';
                arr_json.push($scope.data_reviewer_delete[i]);
            }
            for (var i = 0; i < arr_json.length; i++) {
                if (arr_json[i].user_name == null
                    && arr_json[i].user_type == 'reviewer'
                    && arr_json[i].action_type != 'delete'
                ) {
                    arr_json[i].action_type = 'delete';
                }
            }

            //check จากข้อมูลเดิมที่เคยบันทึกไว้ถ้าไม่มีในของเดิมให้ delete ออกด้วย
            for (var i = 0; i < $scope.data_reviewer_old.length; i++) {
                var arr_check = $filter('filter')($scope.data_reviewer, function (item) {
                    return (item.action_type != 'delete' && item.user_type == 'reviewer'
                        && item.user_type == $scope.data_reviewer_old[i].user_type
                        && item.user_name == $scope.data_reviewer_old[i].user_name
                    );
                });
                if (arr_check.length == 0) {
                    //arr_json[i].action_type = 'delete';
                    $scope.data_reviewer_old[i].action_type = 'delete';
                    arr_json.push($scope.data_reviewer_old[i]);
                }
            }

        }

        $scope.tasks_relatedpeople = arr_json;

        return angular.toJson(arr_json);


    }
    function check_master_ram() {
        // return angular.toJson($scope.master_ram);
        var arr_active = [];
        angular.copy($scope.master_ram, arr_active);
        var arr_json = $filter('filter')(arr_active, function (item) {
            return ((item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert');
        });
        return angular.toJson(arr_json);
    }
    function check_data_tagid_audition() {

        var pha_seq = $scope.data_header[0].seq;
        var tagid_audition_arr = $scope.data_general[0].tagid_audition;
        var tagid_audition_text = '';
        for (var i = 0; i < tagid_audition_arr.length; i++) {

            if (tagid_audition_text != '') { tagid_audition_text += ','; }
            if (tagid_audition_arr[i] != '') {
                tagid_audition_text += tagid_audition_arr[i];
            }

        }
        $scope.data_tagid_audition[0].seq = pha_seq;
        $scope.data_tagid_audition[0].id = pha_seq;
        $scope.data_tagid_audition[0].id_pha = pha_seq;
        $scope.data_tagid_audition[0].functional_location = tagid_audition_text;


        var arr_active = [];
        angular.copy($scope.data_tagid_audition, arr_active);
        var arr_json = $filter('filter')(arr_active, function (item) {
            return (true);
        });

        return angular.toJson(arr_json);
    }
    function check_data_session() {

        var pha_seq = $scope.data_header[0].seq;
        for (var i = 0; i < $scope.data_session.length; i++) {
            $scope.data_session[i].id = $scope.data_session[i].seq;
            $scope.data_session[i].id_pha = pha_seq;
            try {
                $scope.data_session[0].meeting_date = $scope.data_session[0].meeting_date.toISOString().split('T')[0];
            } catch { }
        }

        var arr_active = [];
        angular.copy($scope.data_session, arr_active);
        var arr_json = $filter('filter')(arr_active, function (item) {
            return ((item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert');
        });
        for (var i = 0; i < $scope.data_session_delete.length; i++) {
            $scope.data_session_delete[i].action_type = 'delete';
            arr_json.push($scope.data_session_delete[i]);
        }
        return angular.toJson(arr_json);
    }
    function check_data_memberteam() {

        var pha_seq = $scope.data_header[0].seq;
        for (var i = 0; i < $scope.data_memberteam.length; i++) {
            $scope.data_memberteam[i].id = $scope.data_memberteam[i].seq;
            $scope.data_memberteam[i].id_pha = pha_seq;
            $scope.data_memberteam[i].no = (i + 1);
        }

        var arr_active = [];
        angular.copy($scope.data_memberteam, arr_active);
        var arr_json = $filter('filter')(arr_active, function (item) {
            return (((item.user_name != null) && item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert');
        });
        for (var i = 0; i < $scope.data_memberteam_delete.length; i++) {
            $scope.data_memberteam_delete[i].action_type = 'delete';
            arr_json.push($scope.data_memberteam_delete[i]);
        }

        for (var i = 0; i < arr_json.length; i++) {
            if (arr_json[i].user_name == null && arr_json[i].action_type != 'delete') {
                arr_json[i].action_type = 'delete';
            }
        }

        //check จากข้อมูลเดิมที่เคยบันทึกไว้ถ้าไม่มีในของเดิมให้ delete ออกด้วย
        for (var i = 0; i < $scope.data_memberteam_old.length; i++) {
            var arr_check = $filter('filter')($scope.data_memberteam, function (item) {
                return (item.action_type != 'delete' && item.user_name == $scope.data_memberteam_old[i].user_name);
            });
            if (arr_check.length == 0) {
                $scope.data_memberteam_old[i].action_type = 'delete';
                arr_json.push($scope.data_memberteam_old[i]);
            }
        }

        //check จากข้อมูล session ให้ delete ออกด้วย
        for (var i = 0; i < arr_json.length; i++) {
            if (arr_json[i].action_type == 'delete') { continue; }
            var arr_check = $filter('filter')($scope.data_session, function (item) {
                return (item.seq == arr_json[i].id_session || item.id == arr_json[i].id_session);
            });
            if (arr_check.length == 0) {
                arr_json[i].action_type = 'delete';
            }
        }

        return angular.toJson(arr_json);
    }
    function check_data_drawing() {

        var pha_seq = $scope.data_header[0].seq;
        for (var i = 0; i < $scope.data_drawing.length; i++) {
            $scope.data_drawing[i].id = Number($scope.data_drawing[i].seq);
            $scope.data_drawing[i].id_pha = pha_seq;
        }

        var arr_active = [];
        angular.copy($scope.data_drawing, arr_active);
        var arr_json = $filter('filter')(arr_active, function (item) {
            return ((item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert');
        });
        for (var i = 0; i < $scope.data_drawing_delete.length; i++) {
            $scope.data_drawing_delete[i].action_type = 'delete';
            arr_json.push($scope.data_drawing_delete[i]);
        }
        return angular.toJson(arr_json);
    }
    function check_data_tasks_worksheet() {

        var pha_status = $scope.data_header[0].pha_status;
        var pha_seq = $scope.data_header[0].seq;


        for (var i = 0; i < $scope.data_tasks_worksheet.length; i++) {
            $scope.data_tasks_worksheet[i].id = Number($scope.data_tasks_worksheet[i].seq);
            $scope.data_tasks_worksheet[i].id_pha = pha_seq;

            //ram_action_security, ram_action_likelihood, ram_action_risk, estimated_start_date, estimated_end_date, document_file_path, document_file_name, action_status, responder_action_type, responder_user_name, responder_user_displayname
            try {
                var date_value = $scope.data_tasks_worksheet[i].estimated_start_date.toISOString().split('T');
                if (date_value.length > 0) { $scope.data_tasks_worksheet[i].estimated_start_date = date_value[0]; }
            } catch { }
            try {
                var date_value = $scope.data_tasks_worksheet[i].estimated_end_date.toISOString().split('T');
                if (date_value.length > 0) { $scope.data_tasks_worksheet[i].estimated_end_date = date_value[0]; }
            } catch { }
        }

        var arr_active = [];
        angular.copy($scope.data_tasks_worksheet, arr_active);
        var arr_json = $filter('filter')(arr_active, function (item) {
            return ((item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert');
        });
        for (var i = 0; i < $scope.data_tasks_worksheet_delete.length; i++) {
            $scope.data_tasks_worksheet_delete[i].action_type = 'delete';
            arr_json.push($scope.data_tasks_worksheet_delete[i]);
        }

        return angular.toJson(arr_json);
    }

    function check_data_ram_level() {

        //return angular.toJson($scope.master_ram_level);
        var arr_active = [];
        angular.copy($scope.master_ram_level, arr_active);
        var arr_json = $filter('filter')(arr_active, function (item) {
            return ((item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert');
        });
        return angular.toJson(arr_json);
    }

    function set_alert(header, detail) {

        $scope.Action_Msg_Header = header;
        $scope.Action_Msg_Detail = detail;

        console.log($scope.Action_Msg_Header)
        $('#modalMsg').modal('show');
    }
    function set_alert_confirm(header, detail) {

        $scope.Action_Msg_Confirm = true;

        $scope.Action_Msg_Header = header;
        $scope.Action_Msg_Detail = detail;

        $('#modalMsg').modal('show');
    }



    //start Update Action Type null to Update 
    $scope.actionChange = function (_arr, _seq, type_text) {

        action_type_changed(_arr, _seq);

        if (type_text == "ChangeRAM") {
            console.log($scope.master_ram_level);
            set_master_ram_likelihood(_arr.id_ram);
        }

        apply();
    }
    $scope.actionChangeWorksheet = function (_arr, _seq, type_text) {

        if (_arr.recommendations == null || _arr.recommendations == '') {
            if (_arr.recommendations_no == null || _arr.recommendations_no == '') {
                //recommendations != '' ให้ running action no  
                var arr_copy_def = angular.copy($scope.data_tasks_worksheet, arr_copy_def);
                arr_copy_def.sort((a, b) => Number(b.recommendations_no) - Number(a.recommendations_no));
                var recommendations_no = Number(Number(arr_copy_def[0].recommendations_no) + 1);
                _arr.recommendations_no = recommendations_no;
            }
        }
        action_type_changed(_arr, _seq);

        var arr_submit = $filter('filter')($scope.data_tasks_worksheet, function (item) {
            return ((item.action_type !== '' || item.action_type !== null));
        });


        if (arr_submit.length > 0) { $scope.submit_type = true; } else { $scope.submit_type = false; }

        apply();

        console.log($scope.data_tasks_worksheet);
        
    }
    $scope.actionChangeRelatedPeople = function (_arr, _seq, type_text) {

        action_type_changed(_arr, _seq);

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
    function action_type_changed_non_apply(_arr, _seq) {
        if (_seq == undefined) { _seq = 1; }
        if (_arr.seq == _seq && _arr.action_type == '') {
            _arr.action_type = 'update';
            _arr.update_by = $scope.user_name;
        } else if (_arr.seq == _seq && _arr.action_type == 'update') {
            _arr.action_change = 1;
            _arr.update_by = $scope.user_name;
        }
    }
    //start functioin show history data ของแต่ละ field
    $scope.filteredArr = [{ name: '', isActive: true }];
    $scope.filteredResults = [];
    $scope.showResults = false;
    $scope.filterResultGeneral = function (fieldText, fieldName) {
        $scope.filteredResults = [];
        var arr = [];
        if (fieldName == 'pha_request_name') {
            arr = $scope.data_all.his_pha_request_name;
        }
        else if (fieldName == 'descriptions') {
            //arr = $scope.data_all.his_descriptions;
        }
        else if (fieldName == 'workstep') {
            arr = $scope.data_all.his_workstep;
        }
        else if (fieldName == 'taskdesc') {
            arr = $scope.data_all.his_taskdesc;
        }
        else if (fieldName == 'existing_safeguards') {
            arr = $scope.data_all.his_existing_safeguards;
        }
        else if (fieldName == 'recommendations') {
            arr = $scope.data_all.his_recommendations;
        }

        for (var i = 0; i < arr.length; i++) {
            var result = arr[i];
            if (result.name.toLowerCase().startsWith(fieldText.toLowerCase())) {
                $scope.filteredResults.push({ "field": fieldName, "name": result.name });
            }
        }

        $scope.showResults = $scope.filteredResults.length > 0;

        if ($scope.data_general[0].action_type == '') {
            action_type_changed($scope.data_general, $scope.data_general[0].seq);
        }
    };

    $scope.filterResultHistory = function (fieldText, fieldName, fieldID) {
        //if (fieldText.length < 3) { return; }

        $scope.filteredArr[0].fieldID = null;
        $scope.filteredResults = [];
        var arr = [];
        if (fieldName == 'pha_request_name') {
            arr = $scope.data_all.his_pha_request_name;
        }
        else if (fieldName == 'descriptions') {
            //arr = $scope.data_all.his_descriptions;
        }
        else if (fieldName == 'workstep') {
            arr = $scope.data_all.his_workstep;
        }
        else if (fieldName == 'taskdesc') {
            arr = $scope.data_all.his_taskdesc;
        }
        else if (fieldName == 'potentailhazard') {
            arr = $scope.data_all.his_potentailhazard;
        }
        else if (fieldName == 'possiblecase') {
            arr = $scope.data_all.his_possiblecase;
        }
        else if (fieldName == 'existing_safeguards') {
            arr = $scope.data_all.his_existing_safeguards;
        }
        else if (fieldName == 'recommendations') {
            arr = $scope.data_all.his_recommendations;
        }

        try {
            for (var i = 0; i < arr.length; i++) {
                var result = arr[i];
                if (result.name.toLowerCase().includes(fieldText.toLowerCase())) {
                    $scope.filteredResults.push({ "field": fieldName, "name": result.name });
                }
            }
            $scope.showResults = $scope.filteredResults.length > 0;
            $scope.filteredArr = [{ "fieldID": ($scope.showResults == true ? fieldID : '') }];
        } catch { }
    };

    $scope.selectResult = function (result, items_ref, fieldName) {
        items_ref[fieldName] = result.name;
        $scope.filteredResults = [];
        $scope.showResults = false;
    };

    $scope.searchtext = function () {
        $scope.filteredData = $scope.followData.filter(function (item) {
            return item.file.includes($scope.searchdata) || item.id.includes($scope.searchdata);
        });
    };


    $scope.fillTextbox = function (string) {
        $scope.members = string;
        $scope.hidethis = true;
    }
    //end functioin show history data ของแต่ละ field

    // <==== start Popup Employee ของ Member team==== >
    $scope.filteredData = [];
    $scope.selectedData = {};
    $scope.updateSelectedItems = function () {
        $scope.selectedData = $scope.employeelist.filter(function (item) {
            return item.selected;
        });
    };
    $scope.selectedItems = function (item) {
        $scope.selectedData = item;
    };
    // <==== end Popup Employee ของ Member team==== >

    // <==== Tracking word change ==== data_tasks_worksheet >
        $scope.updateWorksheetChanges = function(item, seq) {

            console.log("Test call funtion") // rule -> ng == item ? call updatework 
            //if data_task > 0? ยกทั้งก้อนมาเช็ค? 
            //action == save or submit
            //at seq,id,no ? at feildname ? 

            let newWords = item.workstep.split(/\s+/); //=> new data_task_worksheet
            let oldWords = $scope.originalWorkstep.split(/\s+/); //=> old data_task_worksheet?
    
            let addedWords = newWords.filter(word => !oldWords.includes(word));
            let removedWords = oldWords.filter(word => !newWords.includes(word));

    
            let changedWords = [];
    
            if (addedWords.length > 0) {
                addedWords.forEach(function(word) {
                    changedWords.push({ type: 'added', text: word });
                });
            }
    
            if (removedWords.length > 0) {
                removedWords.forEach(function(word) {
                    changedWords.push({ type: 'removed', text: word });
                });
            }
    
            item.workstepChanges = changedWords;
            $scope.originalWorkstep = item.workstep;
        };
    
        $scope.selectResult = function(result, item, field) {
            item[field] = result.name;
            $scope.updateWorkstepChanges(item, item.seq);
        };
    
        // <==== start Tracking word change==== >

    $(document).ready(function () {

    }); page_load();



});
