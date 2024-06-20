
AppMenuPage.filter('MemberteamMultiFieldFilter', function () {
    return function (items, searchText) {
        if (!searchText) {
            return items;
        }

        searchText = searchText.toLowerCase();
        if (searchText.length < 3) { return items; }
        return items.filter(function (item) {
            return (
                item.employee_id.toLowerCase().includes(searchText.toLowerCase()) ||
                item.employee_displayname.toLowerCase().includes(searchText.toLowerCase()) ||
                item.employee_email.toLowerCase().includes(searchText.toLowerCase())
            );
        }).slice(0, 10);
    };
});
AppMenuPage.filter('ResponderMultiFieldFilter', function () {
    return function (items, searchResponderText) {
        if (!searchResponderText) {
            return items;
        }

        searchResponderText = searchResponderText.toLowerCase();
        if (searchResponderText.length < 3) { return items; }

        return items.filter(function (item) {
            return (
                item.employee_id.toLowerCase().includes(searchResponderText.toLowerCase()) ||
                item.employee_displayname.toLowerCase().includes(searchResponderText.toLowerCase()) ||
                item.employee_email.toLowerCase().includes(searchResponderText.toLowerCase())
            );
        });
    };
});
AppMenuPage.filter('ApproverMultiFieldFilter', function () {
    return function (items, searchApproverText) {
        if (!searchApproverText) {
            return items;
        }

        searchApproverText = searchApproverText.toLowerCase();
        if (searchApproverText.length < 3) { return items; }

        return items.filter(function (item) {
            return (
                item.employee_id.toLowerCase().includes(searchApproverText) ||
                item.employee_displayname.toLowerCase().includes(searchApproverText) ||
                item.employee_email.toLowerCase().includes(searchApproverText)
            );
        });
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
        try {
            var dropdown = document.querySelector(`.autocomplete-dropdown-${idinput}`);
            if (dropdown) {
                dropdown.style.display = 'none';
            }
        } catch (error) {

        }
    };

});
AppMenuPage.filter('toArray', function() {
    return function(obj) {
      if (!obj) {
        return [];
      }
  
      if (Array.isArray(obj)) {
        return obj;
      } else {
        return Object.keys(obj).map(function(key) {
          return obj[key];
        });
      }
    };
  });

AppMenuPage.controller("ctrlAppPage", function ($scope, $http, $filter, conFig, $document, $element,$rootScope,$window,$timeout,$interval) {

    $scope.unsavedChanges = false;
    $scope.dataLoaded = false;
    
    // Track location changes
    $rootScope.$on('$locationChangeStart', function(event, next, current) {
        console.log('Location is changing from:', current, 'to:', next);

        if (unsavedChanges) {
            var confirmLeave = $window.confirm("You have unsaved changes. Are you sure you want to leave?");
            if (!confirmLeave) {
                event.preventDefault();
            }
        }
    });

    // close tab / browser window
    $window.addEventListener('beforeunload', function(event) {
        console.log("Trigger Ec=vent",event)
        if (unsavedChanges) {
            var confirmationMessage = 'You have unsaved changes. Are you sure you want to leave?';
    
            event.preventDefault();
            event.returnValue = confirmationMessage;
            return confirmationMessage;
        }
    });

    var interval; 

    // Initialize the timer
    $scope.startTimer = function() {
        $scope.counter = 900; 
        $scope.autosave = false;

        if (angular.isDefined(interval)) {
            $interval.cancel(interval);
        }

        interval = $interval(function () {
            var minutes = Math.floor($scope.counter / 60); 
            var seconds = $scope.counter % 60;
    
            // Display remaining time in minutes and seconds
            $scope.counterText = minutes + ' min. ' + seconds + ' sec.';
            $scope.minutes = minutes;
    
            $scope.counter--;
    
            if ($scope.counter === 0) {
                // When the counter reaches 0, show a notification
                $scope.autosave = true;
                // set_alert("Warning", "Please save the information.");
                $scope.confirmSave('save');
                
                $scope.stopTimer();
                // $scope.startTimer(); // Uncomment to restart the timer automatically
            }
        }, 1000);
    };

    // Function to stop the timer
    $scope.stopTimer = function() {
        if (angular.isDefined(interval)) {
            $interval.cancel(interval);
            interval = undefined; 
        }
    };
    
    // Define a function to handle changes and update timer and unsavedChanges
    function setupWatch(watchExpression) {
        $scope.$watch(watchExpression, function(newValues, oldValues) {
            if (!$scope.dataLoaded) {
                console.log("Data not yet loaded, skipping watch callback.");
                return;
            }

            console.log("Watcher triggered change for", watchExpression);

            if($scope.data_header[0].pha_status === 11 || $scope.data_header[0].pha_status === 12){
                $scope.stopTimer();
                $scope.startTimer();
                $scope.unsavedChanges = true;
            }

        }, true);
    }

    setupWatch('data_general');
    setupWatch('data_session');
    setupWatch('data_approver');
    setupWatch('data_memberteam');
    setupWatch('data_relatedpeople');
    setupWatch('data_relatedpeople_outsider');
    //
    setupWatch('data_subareas_list');
    setupWatch('data_tasks');
    setupWatch('data_worksheet_list');

    //All
    if (true) {
        $('#divLoading').hide();

        var url_ws = conFig.service_api_url();

        $scope.formatTo24Hour = function (_time) {

            try {
                // Split the time string into hours and minutes 
                // Extract hours and minutes
                var hours = _time.getHours();
                var minutes = _time.getMinutes();

                return String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0');

            } catch (ex) {
                return ex;
            }
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

    }
    //attached file
    if (true) {
        $scope.clearFileUploadName = function (seq) {

            try {

                $scope.data_general[0].file_upload_name = null;
                $scope.data_general[0].file_upload_size = null;
                $scope.data_general[0].file_upload_path = null;
                $scope.data_general[0].action_change = 1;
                apply();
            } catch { }

        };
        $scope.clearFileName = function (seq) {

            var arr = $filter('filter')($scope.data_drawing, function (item) { return (item.seq == seq); });
            if (arr.length > 0) {
                arr[0].document_file_name = null;
                arr[0].document_file_size = null;
                arr[0].document_file_path = null;
                arr[0].action_change = 1;
                apply();
            }
        };

        /*$scope.fileSelect = function (input, file_part) {
            //drawing, responder, approver
            var file_doc = $scope.data_header[0].pha_no;

            const fileInput = input;
            const fileSeq = fileInput.id.split('-')[1];
            const fileInfoSpan = document.getElementById('filename' + fileSeq);

            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const fileName = file.name;
                const fileSize = Math.round(file.size / 1024);
                try {
                    fileInfoSpan.textContent = `${fileName} (${fileSize} KB)`;
                } catch { }
                if (file) {
                    const allowedFileTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'png', 'gif']; // รายการของประเภทของไฟล์ที่อนุญาตให้แนบ

                    const fileExtension = fileName.split('.').pop().toLowerCase(); // นำนามสกุลของไฟล์มาเปลี่ยนเป็นตัวพิมพ์เล็กทั้งหมดเพื่อให้เป็น case-insensitive

                    if (allowedFileTypes.includes(fileExtension)) {
                        // ทำการแนบไฟล์
                        //set_alert("File attached successfully.");
                    } else {
                        $('#modalMsgFileError').modal('show');
                        //set_alert('Warning', "Please select a PDF, Word or Excel, Image file.");
                    }
                } else {
                    console.log("No file selected.");
                }


                var file_path = uploadFile(file, fileSeq, fileName, fileSize, file_part, file_doc);

            } else {
                fileInfoSpan.textContent = "";
            }
        }*/

        $scope.truncateFilename = function(filename, length) {
            if (!filename) return '';
            if (filename.length <= length) return filename;
            const start = filename.slice(0, Math.floor(length / 2));
            const end = filename.slice(-Math.floor(length / 2));
            return `${start}.......${end}`;
        };

        $scope.fileSelect = function (input, file_part) {
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
                    const allowedFileTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'png', 'gif']; // รายการของประเภทของไฟล์ที่อนุญาตให้แนบ
    
                    const fileExtension = fileName.split('.').pop().toLowerCase(); // นำนามสกุลของไฟล์มาเปลี่ยนเป็นตัวพิมพ์เล็กทั้งหมดเพื่อให้เป็น case-insensitive
    
                    if (allowedFileTypes.includes(fileExtension)) {
                        // ทำการแนบไฟล์
                        //set_alert("File attached successfully.");
                    } else {
                        $('#modalMsgFileError').modal({
                            backdrop: 'static',
                            keyboard: false 
                        }).modal('show');
                        //set_alert('Warning', "Please select a PDF, Word or Excel, Image file.");
                    }
                } else {
                    console.log("No file selected.");
                }
    
    
                var file_path = uploadFile(file, fileSeq, fileName, fileSize, file_part, file_doc);
    
            } else {
                fileInfoSpan.textContent = "";
            }
        }
                  
        function uploadFile(file_obj, seq, file_name, file_size, file_part, file_doc) {

            var fd = new FormData();
            //Take the first selected file
            fd.append("file_obj", file_obj);
            fd.append("file_seq", seq);
            fd.append("file_name", file_name);
            fd.append("file_doc", file_doc);
            fd.append("file_part", file_part);//drawing, responder, approver
            fd.append("file_doc", file_doc);
            fd.append("sub_software", 'hra');

            try {
                $("#divLoading").show(); 

                const request = new XMLHttpRequest();
                request.open("POST", url_ws + 'Flow/uploadfile_data');
                //request.send(fd);

                request.onreadystatechange = function () {
                    if (request.readyState === XMLHttpRequest.DONE) {
                        if (request.status === 200) {
                            // รับค่าที่ส่งมาจาก service ที่ตอบกลับมาด้วย responseText
                            const responseFromService = request.responseText;
                            // ทำอะไรกับข้อมูลที่ได้รับเช่น แสดงผลหรือประมวลผลต่อไป
                            console.log(responseFromService);

                            const jsonArray = JSON.parse(responseFromService);

                            var file_name = jsonArray[0].ATTACHED_FILE_NAME;
                            var file_path = jsonArray[0].ATTACHED_FILE_PATH;

                            var arr = $filter('filter')($scope.data_drawing, function (item) { return (item.seq == seq); });
                            if (arr.length > 0) {
                                arr[0].document_file_name = file_name;
                                arr[0].document_file_size = file_size;
                                //'https://localhost:7098/api/' + '/AttachedFileTemp/hazop/HAZOP-2023-0000016-DRAWING-202312231716.PDF'
                                arr[0].document_file_path = (url_ws.replace('/api/', '')) + file_path;// (url_ws.replace('/api/', '/')) + 'AttachedFileTemp/Hazop/' + file_name;
                                arr[0].document_module = 'hra';
                                arr[0].action_change = 1;
                                apply();

                            }
                        } else {
                            // กรณีเกิดข้อผิดพลาดในการร้องขอไปยัง server
                            console.error('มีข้อผิดพลาด: ' + request.status);
                        }
                    }
                    $("#divLoading").hide(); 
                };

                request.send(fd);

            } catch { 
                $("#divLoading").hide();
            }

            return "";
        }

        $scope.fileSelectApprover = function (input, file_part) {
            //drawing, responder, approver
            var file_doc = $scope.data_header[0].pha_no;

            const fileInput = input;
            const fileSeq = fileInput.id.split('-')[1];
            const fileInfoSpan = document.getElementById('filename-approver-' + fileSeq);

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

                var file_path = uploadFileApprover(file, fileSeq, fileName, fileSize, file_part, file_doc);

            } else {
                fileInfoSpan.textContent = "";
            }
        }

        function uploadFileApprover(file_obj, seq, file_name, file_size, file_part, file_doc) {

            var fd = new FormData();
            //Take the first selected file
            fd.append("file_obj", file_obj);
            fd.append("file_seq", seq);
            fd.append("file_name", file_name);
            fd.append("file_doc", file_doc);
            fd.append("file_part", file_part);//drawing, responder, approver
            fd.append("file_doc", file_doc);
            fd.append("sub_software", 'hra');

            try {
                $("#divLoading").show(); 

                const request = new XMLHttpRequest();
                request.open("POST", url_ws + 'Flow/uploadfile_data');

                request.onreadystatechange = function () {
                    if (request.readyState === XMLHttpRequest.DONE) {
                        if (request.status === 200) {
                            // รับค่าที่ส่งมาจาก service ที่ตอบกลับมาด้วย responseText
                            const responseFromService = request.responseText;
                            // ทำอะไรกับข้อมูลที่ได้รับเช่น แสดงผลหรือประมวลผลต่อไป
                            console.log(responseFromService);

                            const jsonArray = JSON.parse(responseFromService);

                            var file_name = jsonArray[0].ATTACHED_FILE_NAME;
                            var file_path = jsonArray[0].ATTACHED_FILE_PATH;

                            var arr = $filter('filter')($scope.data_drawing_approver, function (item) { return (item.seq == seq); });
                            if (arr.length > 0) {
                                arr[0].document_file_name = file_name;
                                arr[0].document_file_size = file_size;
                                arr[0].document_file_path = (url_ws.replace('/api/', '')) + file_path;// (url_ws.replace('/api/', '/')) + 'AttachedFileTemp/Hazop/' + file_name;
                                arr[0].document_module = 'approver';
                                arr[0].action_change = 1;
                                apply();

                            }
                        } else {
                            // กรณีเกิดข้อผิดพลาดในการร้องขอไปยัง server
                            console.error('มีข้อผิดพลาด: ' + request.status);
                        }
                    }
                    $("#divLoading").hide(); 

                };

                request.send(fd);

            } catch {
                $("#divLoading").hide(); 
             }

            return "";
        }

        $scope.truncateFilename = function(filename, length) {
            if (!filename) return '';
            if (filename.length <= length) return filename;
            const start = filename.slice(0, Math.floor(length / 2));
            const end = filename.slice(-Math.floor(length / 2));
            return `${start}.......${end}`;
        };
    }


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

        $scope.data_header = [];
        $scope.data_general = [];
        $scope.data_session = [];
        $scope.data_memberteam = [];
        $scope.data_approver = [];
        $scope.data_drawing = [];

        $scope.data_subareas = [];
        $scope.data_hazard = [];
        $scope.data_tasks = [];
        $scope.data_workers = [];
        $scope.hazard_standard = [];

        $scope.data_worksheet = [];

        $scope.data_session_delete = [];
        $scope.data_memberteam_delete = [];
        $scope.data_relatedpeople_outsider_delete = [];
        $scope.data_approver_delete = [];
        $scope.data_drawing_delete = [];
        $scope.data_drawing_approver_delete = [];

        $scope.data_subareas_delete = [];
        $scope.data_hazard_delete = [];
        $scope.data_tasks_delete = [];
        $scope.data_descriptions_delete= [];
        $scope.data_workers_delete = [];

        $scope.data_worksheet_delete = [];


        $scope.select_history_tracking_record = false;

        $scope.employeelist = [];
        $scope.employeelist_def = [];
        $scope.employeelist_show = [];


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

        $scope.keywords = {
            text:''
        };

        $scope.searchIndicator = {
            text: ''
        }

        $scope.data_initial_risk = [
            { id: 'Low', name: 'Low' },
            { id: 'Meduim\r\n', name: 'Meduim' },
            { id: 'High\r\n', name: 'High' },
        ];

        $scope.disTypeHazard = [];

        // สร้างชั่วโมง (0-23)
        $scope.master_hours = [];
        for (var i = 0; i < 24; i++) {
            var hour = (i).toString().padStart(2, '0'); // แปลงเป็นสตริงเลข 2 หลัก
            $scope.master_hours.push({ id: hour, name: hour }); // เพิ่มรายการชั่วโมงลงในอาร์เรย์
        }

        // สร้างนาที (0-59) 
        $scope.master_minutes = [];
        for (var i = 0; i < 60; i++) {
            var hour = (i).toString().padStart(2, '0'); // แปลงเป็นสตริงเลข 2 หลัก
            $scope.master_minutes.push({ id: hour, name: hour }); // เพิ่มรายการชั่วโมงลงในอาร์เรย์
        }

        $scope.sub_software = 'HRA';
        $scope.sub_software_display = 'HRA';

        $scope.tabs = [
            { name: 'general', action_part: 1, title: 'General Information', isActive: true, isShow: false },
            { name: 'areas', action_part: 2, title: 'List of Areas to Be Assessed and Health Hazards or Risk Factors', isActive: false, isShow: false },
            { name: 'worker', action_part: 3, title: 'List of Worker Groups and Description of Tasks', isActive: false, isShow: false },
            //{ name: 'ram', action_part: 4, title: 'RAM', isActive: false, isShow: false },
            { name: 'worksheet', action_part: 5, title: $scope.sub_software + ' Worksheet', isActive: false, isShow: false },
            { name: 'manage', action_part: 6, title: 'Manage Recommendations', isActive: false, isShow: false },
            { name: 'list_name', action_part: 7, title: 'List of Name', isActive: false, isShow: false },
            //{ name: 'approver', action_part: 8, title: 'Assessment Team Leader (QMTS)', isActive: false, isShow: false },
            { name: 'report', action_part: 9, title: 'Report', isActive: false, isShow: false }
        ];

    }
    $scope.changeTab = function (selectedTab) {
        try {
            if ($scope.data_header[0].pha_status == 11) {
                if (selectedTab.name == 'worksheet') {

                    $scope.confirmSave('confirm_submit_register_without')

                    return;
                }
            }
            else if ($scope.data_header[0].pha_status == 12 || $scope.data_header[0].pha_status == 22) {
                if (selectedTab.name == 'worksheet') {

                    // genareate_worksheet();
                }
                if(selectedTab.name === 'manage'){
                    
                    console.log($scope.data_worksheet_list);

                    for (let i = 0; i < $scope.data_worksheet_list.length; i++) {
                        let worksheet = $scope.data_worksheet_list[i].worksheet; // Access the worksheet property for the current item
                        for (let j = 0; j < worksheet.length; j++) {
                            let element = worksheet[j];
                            let riskRating = element.initial_risk_rating.trim(); // Trim any extra spaces or newline characters
                            if (riskRating === 'Medium' || 
                                riskRating === 'High' || 
                                riskRating === 'Very High'
                            ) {
                                if (!element.estimated_start_date) {
                                    var today = new Date();
                                    var start_date_utc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
                                    element.estimated_start_date = start_date_utc;
                                }
                            }
                        }
                    }
                    
                    console.log($scope.data_worksheet);     
                    //after that set for worksheet 
                    for (let i = 0; i < $scope.data_worksheet.length; i++) {
                        let element = $scope.data_worksheet[i];
                        let riskRating = element.initial_risk_rating.trim()
                        if (riskRating === 'Medium' || 
                            riskRating === 'High' || 
                            riskRating === 'Very High'
                        ) {
                            if (!element.estimated_start_date) {
                                var today = new Date();
                                var start_date_utc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
                                element.estimated_start_date = start_date_utc.toISOString().split('T')[i];;
                            }
                        }
                    }

                    console.log($scope.data_worksheet);     



                }
            }




        } catch (error) { }

        angular.forEach($scope.tabs, function (tab) {
            tab.isActive = false;
        });
        selectedTab.isActive = true;

        // try {
        //     document.getElementById(selectedTab.name + "-tab").addEventListener("click", function (event) {
        //         ev = event.target
        //     });

        //     var tabElement = angular.element(ev);
        //     tabElement[0].focus();
        // } catch (error) { }
        console.log(selectedTab)
        check_tab(selectedTab.name);


        $scope.oldTab = selectedTab;
        apply();
    };

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

        $scope.MaxSeqdataApprover = 0;
        var arr_check = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'approver'); });
        var iMaxSeq = 1; if (arr_check.length > 0) { iMaxSeq = arr_check[0].values; }
        $scope.MaxSeqdataApprover = iMaxSeq;

        var arr = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'drawing'); });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqDataDrawingDoc = iMaxSeq;

        $scope.MaxSeqdata_drawing_approver = 0;
        var arr_check = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'drawing_approver'); });
        var iMaxSeq = 1; if (arr_check.length > 0) { iMaxSeq = arr_check[0].values; }
        $scope.MaxSeqdata_drawing_approver = iMaxSeq;

        var arr = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'subareas'); });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqdataSubareas = iMaxSeq;

        var arr = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'hazard'); });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqdataHazard = iMaxSeq;

        var arr = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'tasks'); });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqdataTasks = iMaxSeq;

        var arr = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'workers'); });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqdataWorkers = iMaxSeq;

        var arr = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'worksheet'); });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqdataWorksheet = iMaxSeq;

        var arr = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'descriptions'); });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqdataDescriptions = iMaxSeq;

        $scope.MaxSeqdata_relatedpeople_outsider = 0;
        var arr_check = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'relatedpeople_outsider'); });
        var iMaxSeq = 1; if (arr_check.length > 0) { iMaxSeq = arr_check[0].values; }
        $scope.MaxSeqdata_relatedpeople_outsider = iMaxSeq;

        $scope.selectdata_session = 1;
        $scope.selectdata_memberteam = 1;
        $scope.selectdata_approver = 1;
        $scope.selectdata_drawing = 1;

        $scope.selectdata_subareas = 0;
        $scope.selectdata_hazard = 0;
        $scope.selectdata_tasks = 0;
        $scope.selectdata_workers = 0;

        $scope.selectdata_worksheet = 1;


        $scope.exportfile = [{ DownloadPath: '', Name: '' }];
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
        check_data_general();
        
        var action_part = $scope.action_part;
        var user_name = $scope.user_name;
        var token_doc = $scope.token_doc + "";
        var pha_status = $scope.data_header[0].pha_status;
        var pha_version = $scope.data_header[0].pha_version;
        var pha_seq = $scope.data_header[0].seq;
        token_doc = pha_seq;

        var json_header = angular.toJson($scope.data_header);
        var json_general = angular.toJson($scope.data_general);

        var flow_action = (action == 'submit_complete' ? 'submit' : action);

        var json_session = check_data_session();
        var json_memberteam = check_data_memberteam();
        var json_approver = check_data_approver();
        var json_relatedpeople_outsider = check_data_relatedpeople_outsider();
        var json_drawing = check_data_drawing();
        // var json_subareas = check_data_subareas();
        // var json_hazard = check_data_hazard();
        var json_subareas = check_data_subareas_list();
        var json_hazard = check_data_hazardList();
        var json_tasks = check_data_tasks();
        var json_descriptions = check_data_descriptions();
        var json_workers = check_data_workers();
        var json_worksheet = check_data_worksheet_list(flow_action);
        // var json_worksheet = '[]';

  $.ajax({
            url: url_ws + "Flow/set_hra",
            data: '{"user_name":"' + user_name + '","token_doc":"' + token_doc + '","pha_status":"' + pha_status + '","pha_version":"' + pha_version + '","action_part":"' + action_part + '"'
                + ',"json_header":' + JSON.stringify(json_header)
                + ',"json_general":' + JSON.stringify(json_general)
                + ',"json_session":' + JSON.stringify(json_session)
                + ',"json_memberteam":' + JSON.stringify(json_memberteam)
                + ',"json_approver":' + JSON.stringify(json_approver)
                + ',"json_relatedpeople_outsider":' + JSON.stringify(json_relatedpeople_outsider)
                + ',"json_drawing":' + JSON.stringify(json_drawing)
                + ',"json_subareas":' + JSON.stringify(json_subareas)
                + ',"json_hazard":' + JSON.stringify(json_hazard)
                + ',"json_tasks":' + JSON.stringify(json_tasks)
                + ',"json_descriptions":' + JSON.stringify(json_descriptions)
                + ',"json_workers":' + JSON.stringify(json_workers)
                + ',"json_worksheet":' + JSON.stringify(json_worksheet)
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

                console.log("data",data)

                if (arr[0].status == 'true') {
                    $scope.pha_type_doc = 'update';
                    if (action == 'save') {

                        var controller_action_befor = conFig.controller_action_befor();
                        var pha_seq = arr[0].pha_seq;
                        var pha_no = arr[0].pha_no;
                        var pha_type_doc = "edit";

                        $scope.pha_seq = arr[0].pha_seq;

                        var controller_text = "hra";

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

                                get_data_after_save(false, (flow_action == 'submit' ? true : false), $scope.pha_seq);

                                set_alert('Success', 'Data has been successfully saved.');
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
                    else if (action == 'submit_without') {

                        var controller_action_befor = conFig.controller_action_befor();
                        var pha_seq = arr[0].pha_seq;
                        var pha_no = arr[0].pha_no;
                        var pha_type_doc = "edit";

                        $scope.pha_seq = arr[0].pha_seq;

                        var controller_text = "hra";

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

                                get_data_after_save(false, (flow_action == 'submit' ? true : false), $scope.pha_seq);

                                set_alert('Success', 'Data has been successfully saved for PHA Conduct.');
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

                    else if (flow_action == "confirm_submit_genarate" || flow_action == "confirm_submit_genarate_without") {

                        set_alert('Success', 'Data has been successfully generated for the Full Report.');
                        window.open('hazop/search', "_top");
                        return;
                    }
                    else {

                        set_alert('Success', 'Data has been successfully submitted.');
                        window.open('hazop/search', "_top");
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

    function save_data_approver(action) {

        var user_name = $scope.user_name;
        var token_doc = $scope.token_doc + "";
        var pha_seq = $scope.data_header[0].seq;
        var pha_status = $scope.data_header[0].pha_status;
        var flow_role_type = $scope.flow_role_type;

        //submit, submit_without, submit_complete
        var flow_action = (action == 'submit_complete' ? 'submit' : action);

        var id_session = '';
        var seq = '';
        var action_status = '';
        var comment = '';
        var user_approver = '';

        var arr_active = [];
        angular.copy($scope.item_approver_active, arr_active);
        var arr_json = $filter('filter')(arr_active, function (item) {
            return ((item.action_type == 'update'));
        });
        if (arr_json.length > 0) {

            id_session = arr_json[0].id_session;
            seq = arr_json[0].seq;
            action_status = arr_json[0].action_status;
            comment = arr_json[0].comment;
            user_approver = arr_json[0].user_name;

        } else { set_alert('Error', 'No Data.'); return; }
        var json_drawingapprover = check_data_drawingwapprover(id_session);

        $.ajax({
            url: url_ws + "flow/set_approve",
            data: '{"sub_software":"hra","user_name":"' + user_name + '","role_type":"' + flow_role_type + '","action":"' + flow_action + '","token_doc":"' + pha_seq + '","pha_status":"' + pha_status + '"'
                + ',"id_session":"' + id_session + '","seq":"' + seq + '","action_status":"' + action_status + '","comment":"' + comment + '","user_approver":"' + user_approver + '"'
                + ', "json_drawing_approver": ' + JSON.stringify(json_drawingapprover)
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

                        set_alert('Success', 'Data has been successfully saved.');
                        apply();
                    }
                    else {
                        set_alert('Success', 'Data has been successfully submitted.');

                        if (arr[0].pha_status == '13') {
                            //กรณีที่ TA2 approve all
                            window.open('hazop/search', "_top");
                        } else if (arr[0].pha_status == '22') {
                            //กรณีที่ TA2 approve reject
                            window.open('hazop/search', "_top");
                        } else if (arr[0].pha_status == '91') {
                            //กรณีที่ approve all
                            window.open('hazop/search', "_top");
                        } else {
                            //กรณี TA2 approve some items
                            //ให้ update action_change = 0; 
                            var arr_update = $filter('filter')($scope.data_approver, function (item) {
                                return ((item.id_session == id_session && item.seq == seq));
                            });
                            if (arr_update.length > 0) {
                                arr_update[0].action_change = 0;
                            }
                            apply();
                        }
                        return;
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

        $scope.params = get_params();

        $.ajax({
            url: url_ws + "Flow/get_hra_details",
            data: '{"sub_software":"hra","user_name":"' + user_name + '","token_doc":"' + pha_seq + '","type_doc":"' + type_doc + '"}',
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
                var action_part_befor = $scope.action_part;
                var tabs_befor = (page_load == false ? $scope.tabs : null);
                var arr = data;
                $scope.backup = angular.copy(data);
                // console.log($scope.backup.hazard)
                if (true) {
                    $scope.data_all = arr;
                    arr.company.push({ id: 9999, name: 'Other' })
                    arr.company.sort((a, b) => a.id - b.id);
                    get_max_id();
                    //master 
                    if (true) {
                        $scope.master_header= JSON.parse(replace_hashKey_arr(arr.header[0]));
                        $scope.master_company = JSON.parse(replace_hashKey_arr(arr.company));
                        $scope.master_apu = JSON.parse(replace_hashKey_arr(arr.apu));
                        $scope.master_toc = JSON.parse(replace_hashKey_arr(arr.toc));
                        $scope.master_unit_no = JSON.parse(replace_hashKey_arr(arr.unit_no)); // NAME OF AREA --> เลือกจากตาราง epha_m_business_unit
                        //defualt unit no
                        $scope.master_unit_no_list = $scope.master_unit_no;

                        $scope.master_subarea = JSON.parse(replace_hashKey_arr(arr.subarea));
                        $scope.master_subarea_location = JSON.parse(replace_hashKey_arr(arr.subarea_location));
                        $scope.master_hazard_type = JSON.parse(replace_hashKey_arr(arr.hazard_type));
                        $scope.master_hazard_type = setup_master_hazard_type($scope.master_hazard_type);
                        $scope.master_hazard_riskfactors = JSON.parse(replace_hashKey_arr(arr.hazard_riskfactors));
                        $scope.master_hazard_riskfactors_list = JSON.parse(replace_hashKey_arr(arr.hazard_standard));
                        // moc master_hazard_riskfactors
                        $scope.filter_hazard_riskfactors = setup_master_hazard_riskfactors();

                        $scope.master_worker_group = JSON.parse(replace_hashKey_arr(arr.worker_group));
                        $scope.master_worker_list = JSON.parse(replace_hashKey_arr(arr.worker_list));
                        $scope.master_activities = JSON.parse(replace_hashKey_arr(arr.activities));

                        $scope.master_frequency_level = JSON.parse(replace_hashKey_arr(arr.frequency_level));
                        $scope.master_exposure_level = JSON.parse(replace_hashKey_arr(arr.exposure_level));
                        //$scope.master_exposure_rating = JSON.parse(replace_hashKey_arr(arr.exposure_rating));

                        $scope.master_compare_exposure_rating = JSON.parse(replace_hashKey_arr(arr.compare_exposure_rating));
                        $scope.master_compare_initial_risk_rating = JSON.parse(replace_hashKey_arr(arr.compare_initial_risk_rating));

                    }
                    
                    //master search employeelist
                    if (true) {
                        $scope.employeelist_def = arr.employee;
                    }

                    //general
                    if (true) {
                        $scope.data_general = arr.general;

                        $scope.data_session = arr.session;
                        $scope.data_session_def = clone_arr_newrow(arr.session);

                        $scope.data_memberteam = arr.memberteam;
                        $scope.data_memberteam_def = clone_arr_newrow(arr.memberteam);
                        $scope.data_memberteam_old = (arr.memberteam);

                        $scope.data_approver = arr.approver;
                        $scope.data_approver_def = clone_arr_newrow(arr.approver);
                        $scope.data_approver_old = (arr.approver);

                        $scope.data_approver.sort(function(a, b) {
                            if (a.approver_type === "section_head") return -1;
                            if (b.approver_type === "section_head") return 1;
                            return 0;
                        });

                        $scope.data_relatedpeople_outsider = arr.relatedpeople_outsider;
                        $scope.data_relatedpeople_outsider_def = clone_arr_newrow(arr.relatedpeople_outsider);
                        $scope.data_relatedpeople_outsider_old = (arr.relatedpeople_outsider);

                        $scope.data_drawing = arr.drawing;
                        $scope.data_drawing_def = clone_arr_newrow(arr.drawing);

                        $scope.data_departments = arr.departments.slice(1);
                        $scope.data_sections = arr.sections.slice(1);
                    }

                    //List of Areas to Be Assessed and Health Hazards or Risk Factors
                    if (true) {
                        // add key count_riskfactors
                        $scope.hazard_standard = arr.hazard_standard;
                        
                        arr.hazard = setup_hazard(arr.hazard);

                        $scope.data_subareas = arr.subareas;
                        $scope.data_subareas_def = clone_arr_newrow(arr.subareas);
                        $scope.data_subareas_old = (arr.subareas);

                        $scope.data_hazard = arr.hazard;
                        $scope.data_hazard_def = clone_arr_newrow(arr.hazard);
                        $scope.data_hazard_old = (arr.hazard);

                        // set 
                        $scope.data_subareas_list = arr.subareas;
                        // $scope.data_subareas_list = $scope.backup.subareas;
                        $scope.data_subareas_list[0].hazard = arr.hazard;
                        // backup
                        $scope.data_subareas_default = arr.subareas;
                        $scope.data_hazard_default = arr.hazard;
                        
                        $scope.data_subareas_list = groupHazardList(arr.hazard);
                    }

                    //List of Worker Groups and Description of Tasks
                    if (true) {

                        var taskList = setup_tasks(arr);
                        $scope.data_tasks = taskList;
                        $scope.data_tasks_def = clone_arr_newrow(taskList);
                        $scope.data_tasks_old = (taskList);

                        $scope.data_workers = arr.workers;
                        $scope.data_workers_def = clone_arr_newrow(arr.workers);
                        $scope.data_workers_old = (arr.workers);

                        $scope.data_descriptions_def = clone_arr_newrow(arr.descriptions);
                        $scope.data_descriptions_def = clone_arr_newrow(arr.descriptions);
                        $scope.data_tasks = groupTaksList($scope.data_tasks);
                        console.log('data Tasks', $scope.data_tasks )
                    }

                    //HRA Worksheet
                    if (true) {
                        $scope.data_worksheet = arr.worksheet;
                        $scope.data_worksheet_def = clone_arr_newrow(arr.worksheet);
                        $scope.data_worksheet_old = (arr.worksheet);

                        $scope.data_worksheet_list = setup_worksheet($scope.data_subareas_list, $scope.data_tasks);
                    }

                    //Approver
                    if (true) {
                        $scope.data_drawing_approver = arr.drawing_approver;
                        $scope.data_drawing_approver_def = clone_arr_newrow(arr.drawing_approver);
                        $scope.data_drawing_approver_old = (arr.drawing_approver);
                    }

                    set_format_date_time();  //set format date

                    try {
                        var id_unit_no = $scope.data_general[0].id_unit_no;
                        var arrText = $filter('filter')($scope.master_unit_no, function (item) {
                            return (item.id == id_unit_no);
                        });
                        if (arrText.length > 0) {
                            $scope.selectedBusiness_Unit = arrText[0].name;
                        }
                    } catch { }
                    
                }

                //clear _delete
                if (true) {
                    $scope.data_session_delete = [];
                    $scope.data_memberteam_delete = [];
                    $scope.data_relatedpeople_outsider_delete = [];
                    $scope.data_approver_delete = [];
                    $scope.data_drawing_delete = [];
                    $scope.data_drawing_approver_delete = [];

                    $scope.data_subareas_delete = [];
                    $scope.data_hazard_delete = [];
                    $scope.data_tasks_delete = [];
                    $scope.data_descriptions_delete = [];
                    $scope.data_workers_delete = [];

                    $scope.data_worksheet_delete = [];
                }

                //default data page
                if (true) {
                    $scope.flow_role_type = conFig.role_type(); //admin,request,responder,approver
                    $scope.flow_status = 0;

                    //แสดงปุ่ม
                    $scope.flexSwitchCheckChecked = false;
                    $scope.back_type = true;
                    $scope.cancle_type = false;
                    $scope.export_type = false;
                    $scope.save_type = true;
                    $scope.submit_review = true;
                    $scope.submit_type = true;

                    $scope.selectActiveNotification = (arr.header[0].active_notification == 1 ? true : false);

                    if (page_load && arr.header[0].pha_status >= 21) {

                        $scope.tabs = [
                            { name: 'general', action_part: 1, title: 'General Information', isActive: true, isShow: false },
                            { name: 'list_areas', action_part: 2, title: 'List of Areas to Be Assessed and Health Hazards or Risk Factors', isActive: false, isShow: false },
                            { name: 'list_worker', action_part: 3, title: 'List of Worker Groups and Description of Tasks', isActive: false, isShow: false },
                            { name: 'worksheet', action_part: 5, title: $scope.sub_software + ' Worksheet', isActive: false, isShow: false },
                            { name: 'manage', action_part: 6, title: 'Manage Recommendations', isActive: false, isShow: false },
                            { name: 'approver', action_part: 8, title: 'Assessment Team Leader (QMTS)', isActive: false, isShow: false },
                            { name: 'list_name', action_part: 7, title: 'List of Name', isActive: false, isShow: false },
                            { name: 'report', action_part: 9, title: 'Report', isActive: false, isShow: false }
                        ];

                    }

                    //check stamp send maito Member --> action submit
                    if (true) {
                        var inputs = document.getElementsByTagName('switchEmailToMemberChecked');
                        for (var i = 0; i < inputs.length; i++) {
                            if (inputs[i].type == 'checkbox') {
                                if (arr.header[0].flow_mail_to_member == 1) {
                                    inputs[i].checked = true;
                                } else { inputs[i].checked = false; }
                            }
                        }
                        arr.header[0].flow_mail_to_member = (arr.header[0].flow_mail_to_member == null ? 0 : arr.header[0].flow_mail_to_member);
                    }

                    //set data_header
                    $scope.data_header = JSON.parse(replace_hashKey_arr(arr.header));



                }

                if($scope.params != 'edit_approver'){
                    $scope.action_owner_active = true;
                }  

                if($scope.params !== null){
                    console.log("$scope.params",$scope.params)

                    if($scope.params != 'edit_approver'){
                        $scope.action_owner_active = true;
                    }  
                    
    
                    if($scope.params !== 'edit') {
                        $scope.tab_general_active = false;
                        $scope.tab_node_active = false;
                        $scope.tab_worksheet_active = false;
                        $scope.tab_managerecom_active = false;
                        $scope.tab_approver_active = false;
    
                        if($scope.params === 'edit_action_owner'){
                            $scope.action_owner_active = true;
                        } 
    
                        if($scope.params === 'edit_approver'){
                            $scope.action_owner_active = false;
    
                        }  
    
                    }
    
                    if($scope.params === 'edit' && $scope.flow_role_type === 'admin') {
                        $scope.tab_general_active = true;
                        $scope.tab_node_active = true;
                        $scope.tab_worksheet_active = true;
                        $scope.tab_managerecom_active = true;
                        $scope.tab_approver_active = true;
    
                        $scope.save_type = true;
                    }
                } else if ($scope.params === null && arr.header[0].pha_status === 21) {
                    if (Array.isArray($scope.data_approver)) {
                        let mainApprover = $scope.data_approver.find(item => item.approver_type === 'approver' && item.user_name === $scope.user_name);
                
                        if (mainApprover) {
                            $scope.isMainApprover = true;
                        } else {
                            $scope.isMainApprover = false;
                        }
                    } else {
                        console.log('$scope.data_approver is not an array or is undefined.');
                        $scope.isMainApprover = false; 
                    }
                }
                


                //ตรวจสอบเพิ่มเติม workflow
                if (true) {
                    try{
                        set_form_action(action_part_befor, !action_submit, page_load);
                        if (arr.user_in_pha_no[0].pha_no == '' && $scope.flow_role_type != 'admin') {
                            if (arr.data_header[0].action_type != 'insert') {
                                $scope.tab_general_active = false;
                                $scope.tab_listarea_active = false;
                                $scope.tab_worksheet_active = false;
                                $scope.tab_managerecom_active = false;
    
                                $scope.save_type = false;
                                $scope.submit_review = false;
                                $scope.submit_type = false;
                            }
                        } else if (arr.user_in_pha_no[0].pha_no != '' && $scope.flow_role_type != 'admin') {
                            if (arr.header[0].action_type != 'insert') {
                                $scope.tab_general_active = false;
                                $scope.tab_listarea_active = false;
                                $scope.tab_worksheet_active = false;
                                $scope.tab_managerecom_active = false;
    
                                $scope.save_type = false;
                                $scope.submit_review = false;
                                $scope.submit_type = false;
                            }
                        }
                        if (!page_load && !action_submit) {
                            $scope.tabs = tabs_befor;
                        }
                    }catch{}

                }

                //add Please select in list master
                if (true) {
                    try {
                        if ($scope.data_general[0].id_company == null || $scope.data_general[0].id_company == '') {
                            var arr_company = $filter('filter')($scope.master_company, function (item) { return (item.name == 'TOP'); });
                            $scope.data_general[0].id_company = arr_company[0].id;
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
                    } catch (ex) { alert(ex); }
                }

                $scope.dataLoaded = true;
                if($scope.data_header[0].pha_status === 11 || $scope.data_header[0].pha_status === 12){
                    $scope.startTimer();  
                }


                $scope.$apply();

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

    $scope.filterInitialRiskRatingMain = function(item) {
        for (let i = 0; i < item.worksheet.length; i++) {
            let element = item.worksheet[i];
            if (element.initial_risk_rating === 'Meduim' || 
                element.initial_risk_rating === 'Meduim\r\n' || 
                element.initial_risk_rating === 'High' ||
                element.initial_risk_rating === 'High\r\n' ||
                element.initial_risk_rating === 'Very High' ||
                element.initial_risk_rating === 'Very High\r\n'
            ) {


                return true;
            }
        }
        return false;
    };
    
    

    $scope.filterInitialRiskRating = function(item) {
        return item.initial_risk_rating === 'Meduim' || 
            item.initial_risk_rating === 'Meduim\r\n' || 
            item.initial_risk_rating === 'High' ||
            item.initial_risk_rating === 'High\r\n'||
            item.initial_risk_rating === 'Very High' ||
            item.initial_risk_rating === 'Very High\r\n';
    };
    

    function setup_worksheet(subArea_list, worker_list) {
        // $scope.MaxSeqdataWorksheet = Number($scope.MaxSeqdataWorksheet) + 1;
        // var xValues = $scope.MaxSeqdataWorksheet;
        if (worker_list.length > 0) {
            const worksheet_list = [...worker_list]
            // จัดเรียงข้อมูลตามฟิลด์ no_subarea
            $scope.data_hazard.sort(function(a, b) {
                if (a.no_subareas !== b.no_subareas) {
                    return a.no_subareas - b.no_subareas;
                } else {
                    return a.no - b.no;
                }
            });

            for (let i = 0; i < worker_list.length; i++) {
                worksheet_list[i].descriptions = worker_list[i].descriptions;
                worksheet_list[i].id_frequency_level = '';
                worksheet_list[i].frequency_level = '';
                worksheet_list[i].sub_areas = subArea_list;
                worksheet_list[i].hazards = convertSubAreaToHazard();
                worksheet_list[i].worksheet = [];
                // create ws
                if ($scope.master_header.pha_status < 12) {
                    var hazard_convert = convertSubAreaToHazard();
                    for (let j = 0; j < hazard_convert.length; j++) {
                        $scope.MaxSeqdataWorksheet = Number($scope.MaxSeqdataWorksheet) + 1;
                        var xValues = $scope.MaxSeqdataWorksheet;
                        var newInput = clone_arr_newrow($scope.data_worksheet_def)[0];
                        
                        newInput.action_type = 'insert';
                        newInput.action_status = 'Open';
                        newInput.action_change = 0;
                        newInput.seq = xValues;
                        newInput.id = xValues;
                        newInput.id_pha = worksheet_list[i].id_pha;
                        newInput.tasks_no = worksheet_list[i].no;
                        newInput.id_tasks = worksheet_list[i].seq;
                        newInput.seq_tasks = worksheet_list[i].seq;
                        newInput.no = j + 1;
                        newInput.hazard_no = j + 1;
                        newInput.id_hazard = hazard_convert[j].seq;
                        newInput.seq_hazard = hazard_convert[j].seq;
                        newInput.subarea_no = hazard_convert[j].no_subareas;
                        worksheet_list[i].worksheet.push(newInput);
                    }
                // update ws
                } else {
                    for (let j = 0; j < $scope.data_worksheet.length; j++) {
                        if ($scope.data_worksheet[j].id_tasks == worksheet_list[i].seq) {
                            var hazardFilter = $filter('filter')($scope.data_hazard, function (item) {
                                return (item.seq == $scope.data_worksheet[j].seq_hazard);
                            })[0];
                            $scope.data_worksheet[j].standard_type_text = hazardFilter.standard_type_text;
                            $scope.data_worksheet[j].standard_value = hazardFilter.standard_value;
                            $scope.data_worksheet[j].standard_unit = hazardFilter.standard_unit;

                            $scope.data_worksheet[j].health_effect_rating = hazardFilter.health_effect_rating;
                            $scope.data_worksheet[j].health_hazard = hazardFilter.health_hazard;
                            $scope.data_worksheet[j].type_hazard = hazardFilter.type_hazard;
                            $scope.data_worksheet[j].sub_area = hazardFilter.sub_area;
                            worksheet_list[i].worksheet.push($scope.data_worksheet[j])
                        }
                    }
                }
            }

            // setup test
            // var ws = angular.copy($scope.data_worksheet);
            // for (let i = 0; i < ws.length; i++) {
            //     var tasks_ls = $filter('filter')($scope.data_tasks, function (item) {
            //         return (parseInt(item.seq) == parseInt(ws[i].seq_tasks));
            //     })[0];
                // add tasks
            //     if (tasks_ls) {
            //         ws[i].worker_group = tasks_ls.worker_group;
            //         ws[i].descriptions = tasks_ls.descriptions;
            //         ws[i].sub_areas = subArea_list;
            //         ws[i].hazards = convertSubAreaToHazard();
            //         ws[i].tasks = tasks_ls;
            //     }
                
            //     if (ws[i].action_type == 'new' && ws[i].hazards.length > 0) {
            //         ws[i].action_type = 'insert'
            //         ws[i].subarea_no = 1
            //     }

            //     if (ws[i].action_type = 'insert' && ws[i].seq_hazard && ws[i].seq_tasks) {
            //         ws[i].action_type = 'update'
            //     }
            // }
            // console.log('data_worksheet', ws)
            console.log('return worksheet_list', worksheet_list)
            // setup_ws(worksheet_list);
            return worksheet_list;
        }
      
    }

    function setup_tasks(data) {
        // $scope.MaxSeqdataDescriptions = Number($scope.MaxSeqdataDescriptions) + 1;
        // var xValues = $scope.MaxSeqdataDescriptions;

        data.tasks[0].descriptions = data.descriptions;
        // data.tasks[0].descriptions[0].id_tasks = null;
        // data.tasks[0].descriptions[0].id = xValues;
        // data.tasks[0].descriptions[0].seq = xValues;
        // data.tasks[0].descriptions[0].id_tasks = data.tasks[0].seq ;
        // data.tasks[0].descriptions[0].action_change = 0 ;
        // data.tasks[0].descriptions[0].action_type = 'insert';

        if ( data.tasks[0].descriptions[0].descriptions) {
            data.tasks[0].descriptions[0].action_type = 'update'
        }

        if ( data.tasks[0].descriptions[0].action_type == 'new') {
            data.tasks[0].descriptions[0].action_type = 'insert'
        }
        return data.tasks;
    }

    function setup_master_hazard_type(data) {
        var list_type = data;

        if(list_type.length < 1) return list_type;

        for (let i = 0; i < list_type.length; i++) {
            // list_type[i].disabled = false;
            list_type[i].checks = [];
            
        }

        return list_type
    }

    function setup_master_hazard_riskfactors() {

        if ($scope.master_hazard_riskfactors.length > 0) {
            // const maxId = $scope.master_hazard_riskfactors.reduce((max, item) => {
            //     return item.id > max ? item.id : max;
            // }, $scope.master_hazard_riskfactors[0].id); 

            // $scope.master_hazard_riskfactors = [...$scope.master_hazard_riskfactors, ...moc_data]
            // เรียงลำดับข้อมูลตาม id
            // $scope.master_hazard_riskfactors.sort((a, b) => a.id - b.id);

            // $scope.master_hazard_riskfactors.forEach(item => {
            //     item.name = `${item.name} (${item.id})`
            // });
            // หาข้อมูลที่ซ้ำ
            var risk_duplicates = [];
            var uniqueRiskFilter = $scope.master_hazard_riskfactors.reduce(function (accumulator, currentItem) {
                // ตรวจสอบว่า currentItem.field_check ซ้ำกับข้อมูลใดใน accumulator หรือไม่
                var isDuplicated = accumulator.some(function (existingItem) {
                    return existingItem.field_check === currentItem.field_check;
                });
                // ถ้า currentItem.field_check ไม่ซ้ำกับข้อมูลใดใน accumulator ให้เพิ่ม currentItem เข้าไป
                if (!isDuplicated) {
                    accumulator.push(currentItem);
                } else {
                    // ถ้าซ้ำกันให้เพิ่มข้อมูลที่ซ้ำไว้ในอาร์เรย์ใหม่
                    // accumulator.duplicates = accumulator.duplicates || [];
                    risk_duplicates.push(currentItem);
                }
                return accumulator;
            }, []);
            return uniqueRiskFilter;
        } else {
            return null;
        }
    }

    function setup_hazard(hazard) {
        hazard.forEach(item => {
            const std = $scope.hazard_standard.find((_item) => _item.id === item.id_health_hazard);
            if (std) {
                item.standard_unit = std.standard_unit;
                item.standard_value = std.standard_value;
                item.standard_type_text = std.standard_type_text;
            }
            item.count_riskfactors = 1;
            item.sort_health_hazard  = false;
            item.no_type_hazard ? null : item.no_type_hazard =  1;
            // add disable select type hazard
            var arrText = $filter('filter')($scope.master_hazard_type, function (ms) {
                return (ms.id == item.id_type_hazard);
            });
            addDisabledOption(arrText, item);
        });
        console.log('setup master_hazard_type', $scope.master_hazard_type)
        console.log('setup hazard', hazard)
        return hazard;
    }

    $scope.chooseRiskRating = function (hazard) {
        $scope.sub_hazard_riskfactors = $filter('filter')($scope.master_hazard_riskfactors, function (item) {
            return (item.name.toLowerCase() == hazard.health_hazard.toLowerCase());
        });
        hazard.count_riskfactors = $scope.sub_hazard_riskfactors.length
    }

    $scope.changeRiskRating = function (hazard, riskfactor) {
        var hazard_health_hazard_list_copy = angular.copy(hazard.health_hazard_list);
        // set hazard
        hazard.action_change = 1;
        hazard.id_health_hazard = riskfactor.id;
        hazard.health_hazard = riskfactor.name;
        hazard.health_effect_rating = riskfactor.hazards_rating;

        var index = hazard.health_hazard_list.findIndex(function(item) {
            return item.name.toLowerCase() === riskfactor.name.toLowerCase();
        });

        if (index !== -1) {
            var newData = riskfactor
            hazard_health_hazard_list_copy[index] = newData;
            hazard.health_hazard_list = hazard_health_hazard_list_copy;
        } 
    }

    $scope.changeHealthHazard= function (hazard) {
        var hazardFilter = $filter('filter')(hazard.health_hazard_list, function (item) {
            return (item.id == hazard.id_health_hazard);
        })[0];

        if (!hazardFilter) {
            return console.log('Hazard filter not found')
        }

        hazard.health_hazard = hazardFilter.name;
        hazard.health_effect_rating = hazardFilter.hazards_rating;
        hazard.tlv_std = hazardFilter.tlv_standard;
        hazard.action_change = 1;

        $scope.chooseRiskRating(hazard);
    }

    function get_params() {
        var queryParams = new URLSearchParams(window.location.search);
        var dataReceived = queryParams.get('data');
        return dataReceived;
    }

    function set_form_action(action_part_befor, action_save, page_load) {

        //แสดง tab ตาม flow
        $scope.tab_general_show = true;
        $scope.tab_worksheet_show = false;
        $scope.tab_approver_show = false;


        //เปิดให้แก้ไขข้อมูลในแต่ละ tab ตาม flow
        $scope.tab_general_active = true;
        $scope.tab_worksheet_active = true;
        $scope.tab_approver_active = true;

        $scope.action_part = action_part_befor;

        for (let _item of $scope.tabs) {
            _item.isShow = true;
            _item.isActive = false;
        }

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

            var tag_name = 'approver';
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
    function set_format_date_time() {

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
                var hh = $scope.data_session[i].meeting_start_time_hh; var mm = $scope.data_session[i].meeting_start_time_mm;
                var valtime = "1970-01-01T" + (hh).substring(hh.length - 2) + ":" + (mm).substring(mm.length - 2) + ":00.000Z";

                $scope.data_session[i].meeting_start_time = new Date(valtime);
            }
            if ($scope.data_session[i].meeting_end_time !== null) {
                //12/31/1969 7:55:00 PM
                var hh = $scope.data_session[i].meeting_end_time_hh; var mm = $scope.data_session[i].meeting_end_time_mm;
                var valtime = "1970-01-01T" + (hh).substring(hh.length - 2) + ":" + (mm).substring(mm.length - 2) + ":00.000Z";
                $scope.data_session[i].meeting_end_time = new Date(valtime);
            }
        }

        return;
    }

    //general information -> Session zone
    if (true) {
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

            if (newInput !== null && newInput.action_type == 'insert') {
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
        function running_index_level1_lv1(arr_items, iNo, iRow, newInput) {

            arr_items.sort((a, b) => a.index_rows - b.index_rows);
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
                    newInput.index_rows = (i + 1);
                    first_row = false;
                } else {
                    arr_items[i].no = iNoNew;
                    arr_items[i].index_rows = (i + 1);
                }
                iNoNew++;
            };
            if (newInput !== null) {
                //if (iRow > 0) { newInput.no = Number(newInput.no) + 0.1; } 
                arr_items.push(newInput);
            }
            arr_items.sort((a, b) => a.index_rows - b.index_rows);

        }
        function running_no_level1(arr_items, iNo, newInput) {

            arr_items.sort((a, b) => a.no - b.no);
            var first_row = true;
            var iNoNew = iNo;
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
            if (newInput !== null && newInput.action_type == 'insert') { arr_items.push(newInput); }
            arr_items.sort((a, b) => a.no - b.no);

        }
        function running_no_level1_lv1(arr_items, iNo, iRow, newInput) {

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

        function groupTaksList (arr_tasks) {
            for (let i = 0; i < arr_tasks.length; i++) {
                
                if (!arr_tasks[i].descriptions) {
                    $scope.MaxSeqdataDescriptions = Number($scope.MaxSeqdataDescriptions) + 1;
                    var xValues = $scope.MaxSeqdataDescriptions;
        
                    var newInput = clone_arr_newrow($scope.data_descriptions_def)[0];
                    newInput.seq = xValues;
                    newInput.id = xValues;
                    newInput.no = 1;
                    newInput.id_pha = arr_tasks[i].id_pha;
                    newInput.id_tasks = arr_tasks[i].seq;
                    newInput.action_type = 'insert';
                    newInput.action_change = 0;
                    newInput.index_rows = arr_tasks[i].index_rows;
                    arr_tasks[i].descriptions = [];
                    arr_tasks[i].descriptions.push(newInput);
                }

                var workerList = $filter('filter')($scope.master_worker_list, function (_item) {
                    return (_item.id_worker_group == arr_tasks[i].id_worker_group);
                });
                // merge worker
                var workerData = $filter('filter')($scope.data_workers, function (_item) {
                    return (_item.id_tasks == arr_tasks[i].seq);
                });
                workerList = [...workerList, ...workerData]
                // add worker list
                arr_tasks[i].worker_list = workerList;
                arr_tasks[i].numbers_of_workers = workerList.length;
            }
            return  groupDescriptions(arr_tasks);
        }

        function groupHazardList (arr_hazard) {
            var groupedData = [];
            var groupedArea = [];
            var mocData = angular.copy($scope.data_subareas_list);

            if(!arr_hazard[0].no_subareas) arr_hazard[0].no_subareas = 1;
            // ใช้ reduce เพื่อแบ่งข้อมูลเป็นกลุ่มโดยใช้ id_subareas เป็นกุญแจ
            arr_hazard.reduce(function(acc, curr) {
                if (!acc[curr.no_subareas]) {
                    acc[curr.no_subareas] = [];
                }
                acc[curr.no_subareas].push(curr);
                return acc;
            }, groupedData);

            var filteredData = groupedData.filter(function(item) {
                return Array.isArray(item);
            })

            filteredData[0][0].health_effect_rating = $scope.backup.hazard[0].health_effect_rating

            for (let i = 0; i < filteredData.length; i++) {
                groupedArea.push({ ...mocData[0], hazard: [...filteredData[i]] });
                groupedArea[i].no = i + 1;
                groupedArea[i].index_rows = i + 1;
                // groupedArea[i].id_sub_area = groupedArea[i].hazard[0].id_subareas;
                groupedArea[i].sub_area = groupedArea[i].hazard[0].sub_area;
                groupedArea[i].work_of_task = groupedArea[i].hazard[0].work_of_task;
                groupedArea[i].hazard.sort((a, b) => a.no - b.no);
            }
            console.log('groupedArea',groupedArea)
            return groupedArea;
        }

        function groupDescriptions (arr_tasks) {
            var groupedData = [];
            var groupedArea = [];
            var mocData = angular.copy($scope.data_tasks);
            // ใช้ reduce เพื่อแบ่งข้อมูลเป็นกลุ่มโดยใช้ id_subareas เป็นกุญแจ
            arr_tasks[0].descriptions.reduce(function(acc, curr) {
                if (!acc[curr.id_tasks]) {
                    acc[curr.id_tasks] = [];
                }
                acc[curr.id_tasks].push(curr);
                return acc;
            }, groupedData);

            var filteredData = groupedData.filter(function(item) {
                return Array.isArray(item);
            })

            for (let i = 0; i < filteredData.length; i++) {
                arr_tasks[i].descriptions = filteredData[i];
            }
            return arr_tasks;
        }

        $scope.changeDescription = function (dec) {
            if (dec) {
                dec.action_change = 1;
            }
        }

        $scope.triggerRemove = function(seq, index, type) {
            if (seq !== null && index !== null) {
                $scope.seqToRemove = seq;
                $scope.indexToRemove = index;
                $scope.typeToRemove = type;
                $('#removeModal').modal('show');
            } else {
                console.error('is null');
            }
        };
        
        $scope.action_remove = function(action) {
            if (action === 'yes') {
                switch($scope.typeToRemove) {
                    case 'session':
                        $scope.removeDataSession($scope.seqToRemove, $scope.indexToRemove);
                        break;
                    case 'DrawingDoc':
                        $scope.removeDrawingDoc($scope.seqToRemove, $scope.indexToRemove);
                        break;
                    default:
                        console.error('Unknown type:', $scope.typeToRemove);
                }
                $('#removeModal').modal('hide');
            } else {
                $('#removeModal').modal('hide');
            }
        };
        
        $scope.addDataSession = function (seq, index) {
            $scope.MaxSeqDataSession = Number($scope.MaxSeqDataSession) + 1;
            var xValues = $scope.MaxSeqDataSession;

            var arr = $filter('filter')($scope.data_session, function (item) { return (item.seq == seq); });
            var iNo = 1; if (arr.length > 0) { iNo = arr[0].no; }

            var newInput = clone_arr_newrow($scope.data_session_def)[0];
            newInput.seq = xValues;
            newInput.id = xValues;
            newInput.no = (iNo + 1);
            newInput.action_type = 'insert';
            newInput.action_change = 0;

            newInput.action_new_row = 0;
            console.clear();

            running_no_format_2($scope.data_session, iNo, index, newInput);

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

                //meeting_start_time_hh,meeting_start_time_mm,meeting_end_time_hh,meeting_end_time_mm
                newInput.meeting_start_time_hh = arr[i].meeting_start_time_hh;
                newInput.meeting_start_time_mm = arr[i].meeting_start_time_mm;
                newInput.meeting_end_time_hh = arr[i].meeting_end_time_hh;
                newInput.meeting_end_time_mm = arr[i].meeting_end_time_mm;


                newInput.action_new_row = 0;

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
        $scope.removeDataSession = function (seq, index) {
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


                keysToClear.forEach(function (key) {
                    $scope.data_session[0][key] = null;
                });

                $scope.data_session[0].no = 1;
            }


            running_no_format_1($scope.data_session, null, index, null);
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


                keysToClear.forEach(function (key) {
                    $scope.data_drawing[0][key] = null;
                });

                $scope.data_drawing[0].no = 1;
            }

            running_no_format_1($scope.data_drawing, null, index, null); //index??

            apply();

        };
    }

    //List of Areas to Be Assessed and Health Hazards or Risk Factors
    if (true) {
        $scope.addDataSubAreasList = function (item, index) {
            $scope.MaxSeqdataSubareas = Number($scope.MaxSeqdataSubareas) + 1;
            var xValues = $scope.MaxSeqdataSubareas;
            var newInput = clone_arr_newrow($scope.data_subareas_default)[0];
            newInput.seq = xValues;
            newInput.id = xValues;
            newInput.no = (item.no + 1);
            newInput.action_type = 'insert';
            newInput.action_change = 0;
            newInput.action_new_row = 0;
            newInput.id_pha = item.id_pha;
            newInput.index_rows = item.index_rows + 1;

            $scope.MaxSeqdataHazard = Number($scope.MaxSeqdataHazard) + 1;
            var xValues2 = $scope.MaxSeqdataHazard;
            var newHazard = clone_arr_newrow($scope.data_hazard_default);
            newInput.hazard = newHazard;
            newInput.hazard[0].seq = xValues2;
            newInput.hazard[0].id = xValues2;
            newInput.hazard[0].id_pha = item.id_pha;
            newInput.hazard[0].action_type = 'insert';
            newInput.hazard[0].no = 1;
            newInput.hazard[0].action_change = 0;
            // newInput.hazard[0].action_new_row = 0;
            newInput.hazard[0].id_subareas = newInput.seq;
            newInput.hazard[0].sub_area =  newInput.sub_area;
            newInput.hazard[0].no_subareas = (item.no + 1);
            newInput.hazard[0].no_type_hazard =  1;
            newInput.hazard[0].index_rows =  0;
            // type ? newInput.no_type_hazard = item_hazard.no_type_hazard : newInput.no_type_hazard = item_hazard.no_type_hazard + 1 ;
            // newInput.hazard[0].health_hazard_list  =  $scope.filter_hazard_riskfactors;
            var parent = angular.copy($scope.data_subareas_list);
            var index_push = parent.length;
            var index_current = index;
            var isSort = false;

            if (index_current + 1 != index_push  ) {
                index_push = index_current + 1;
                isSort = true;
            }
            // add
            parent.splice(index_push, 0, newInput);
            // sort number
            if (isSort) {
                for (let i = 0; i < parent.length; i++) {
                    parent[i].no = i + 1;

                    for (let j = 0; j < parent[i].hazard.length; j++) {
                        parent[i].hazard[j].no_subareas = i + 1;
                        parent[i].hazard[j].action_change = 1;
                    }
                }
            }

            $scope.data_subareas_list = parent;
            $scope.selectdata_subareas = xValues;
            console.log('new SubArea',newInput)
            console.log('Add SubArea', $scope.data_subareas_list)

            // worksheet
             // last item
            const lastItemWs = item.hazard[item.hazard.length - 1]
            console.log('lastItemWs click',lastItemWs)

            var count = 0;
            $scope.data_worksheet_list.forEach(element => {
                $scope.MaxSeqdataWorksheet = Number($scope.MaxSeqdataWorksheet) + 1;
                var xValues = $scope.MaxSeqdataWorksheet;
                var new_ws = clone_arr_newrow($scope.data_worksheet_def)[0];
                new_ws.id = xValues
                new_ws.seq = xValues
                new_ws.action_status = 'Open'
                $scope.master_header.pha_status > 11 ? new_ws.action_type = 'insert' : new_ws.action_type = 'new'
                new_ws.action_change = 1
                // new_ws.no = 1 
                new_ws.id_pha =  newInput.hazard[0].id_pha
                new_ws.subarea_no = newInput.no  
                new_ws.id_hazard =  newInput.hazard[0].seq
                new_ws.seq_hazard =  newInput.hazard[0].seq
                new_ws.id_tasks =  element.seq
                new_ws.seq_tasks =  element.seq
                new_ws.tasks_no =  element.no
                new_ws.hazard_no =  1

                // var selectWs = $filter('filter')(element.worksheet, function (_item,idx) {
                //     return _item.subarea_no == item.no;
                // });
                // var lastIndex = -1;
                // var selectWs = $filter('filter')(element.worksheet, function (_item, idx) {
                //     if (_item.subarea_no == item.no) {
                //         lastIndex = idx;
                //         return true;
                //     }
                //     return false;
                // });

                var lastIndexWs = findLastIndexWs(element.worksheet, 'seq_hazard', lastItemWs)
                console.log('lastIndexWs',lastIndexWs)
                var index_push = element.worksheet.length;
                var index_current =  lastIndexWs + 1;
                // var index_current =  lastIndex + 1;
                var isSort = false;

                if (index_current != index_push  ) {
                    index_push = index_current;
                    isSort = true;
                }
                // add
               if (isSort) {
                    for (let i = 0; i < element.worksheet.length; i++) {
                        if (element.worksheet[i].subarea_no == new_ws.subarea_no) {
                            element.worksheet[i].subarea_no = element.worksheet[i].subarea_no + 1;
                            element.worksheet[i].action_change = 1;
                            // element.worksheet[i].no = element.worksheet[i].no + 1;
                        }
                    }
               }
                new_ws.no = lastIndexWs + 2;
                // new_ws.no = lastIndex + 2;
                element.worksheet.splice(index_push, 0, new_ws);
                // sort number
                if (isSort) {
                    for (let i = 0; i <  element.worksheet.length; i++) {
                        element.worksheet[i].no = i + 1;
                        element.worksheet[i].action_change = 1;
                    }
                }
            });
            console.log('all worksheet list',$scope.data_worksheet_list)
            apply();
        }

        $scope.removeDataSubAreasList = function (item_area, index) {
            // remove
            var delItem = $filter('filter')($scope.data_subareas_list, function (item,idx) {
                return (idx == index);
            })[0];

            if (delItem) {
                $scope.data_subareas_delete.push(delItem);
                $scope.data_subareas_list = $filter('filter')($scope.data_subareas_list, function (item,idx) {
                    return (idx != index);
                });
                // sort number
                for (let i = 0; i < $scope.data_subareas_list.length; i++) {
                    $scope.data_subareas_list[i].no = i + 1;

                    for (let j = 0; j < $scope.data_subareas_list[i].hazard.length; j++) {
                        $scope.data_subareas_list[i].hazard[j].no_subareas = i + 1;
                        
                    }
                }

                // remove worksheet
                if (delItem.hazard) {
                    const delWorksheet = delItem.hazard;
                    for (let i = 0; i < $scope.data_worksheet_list.length; i++) {
                        var list = [];
                        for (let j = 0; j < $scope.data_worksheet_list[i].worksheet.length; j++) {
                            let found = false; // Flag เพื่อเช็คว่า item นี้จะถูกลบหรือไม่
                            for (let k = 0; k < delWorksheet.length; k++) {
                                if ($scope.data_worksheet_list[i].worksheet[j].seq_hazard == delWorksheet[k].seq) {
                                    $scope.data_worksheet_delete.push($scope.data_worksheet_list[i].worksheet[j]);
                                    found = true; // พบ match, จะลบ item นี้
                                    break; // ออกจาก loop ทันทีเมื่อเจอ match
                                }
                            }
                            if (!found) {
                                list.push($scope.data_worksheet_list[i].worksheet[j]); // ถ้าไม่พบ match, เพิ่ม item เข้า list ใหม่
                            }
                        }
                        $scope.data_worksheet_list[i].worksheet = list; // อัพเดท worksheet ด้วย list ใหม่
                    }
                    // sort 
                    for (let i = 0; i < $scope.data_worksheet_list.length; i++) {
                        for (let j = 0; j < $scope.data_worksheet_list[i].worksheet.length; j++) {
                            if ($scope.data_worksheet_list[i].worksheet[j].no != j+1) {
                                $scope.data_worksheet_list[i].worksheet[j].no = j+1;
                                $scope.data_worksheet_list[i].worksheet[j].action_change = 1;
                            }

                            if ($scope.data_worksheet_list[i].worksheet[j].subarea_no > delWorksheet[0].no_subareas) {
                                $scope.data_worksheet_list[i].worksheet[j].subarea_no = $scope.data_worksheet_list[i].worksheet[j].subarea_no - 1;
                                $scope.data_worksheet_list[i].worksheet[j].action_change = 1;
                            }
                        }
                    }
                }
                // remove worksheet
                // for (let i = 0; i < $scope.data_worksheet_list.length; i++) {
                //     var list = [];
                //     for (let j = 0; j < $scope.data_worksheet_list[i].worksheet.length; j++) {
                //         if ($scope.data_worksheet_list[i].worksheet[j].subarea_no == delItem.no) {
                //             $scope.data_worksheet_delete.push($scope.data_worksheet_list[i].worksheet[j])
                //         }else {
                //             list.push($scope.data_worksheet_list[i].worksheet[j])
                //         }
                //     }
                //     $scope.data_worksheet_list[i].worksheet = list;
                // }
                // sort number
                // for (let i = 0; i < $scope.data_worksheet_list.length; i++) {
                //     for (let j = 0; j < $scope.data_worksheet_list[i].worksheet.length; j++) {
                //         $scope.data_worksheet_list[i].worksheet[j].no = j + 1;
                //         $scope.data_worksheet_list[i].worksheet[j].action_change = 1;
                //         $scope.data_worksheet_list[i].worksheet[j].subarea_no = delItem.no;
                //     }
                // }
            }


            console.log('delItem', delItem)
            console.log('data_worksheet_delete', $scope.data_worksheet_delete)
            console.log('data_worksheet_list', $scope.data_worksheet_list)
        };

        function findLastIndex(arr, key, value) {
            for (let i = arr.length - 1; i >= 0; i--) {
                if (arr[i][key] === value) {
                    return i;
                }
            }
            return -1; 
        }

        function findLastIndexWs(arr, key, value) {
            var getIndexWs = arr.findIndex(function (item) {
                return (item[key] == value.seq);
            });
        
            return getIndexWs; 
        }

        function findLastItem(arr, key, value) {
            var last_list = $filter('filter')(arr.hazard, function (item) {
                return (item[key] == value.no_type_hazard);
            });
            
            if(last_list.length < 1) return null;
            
            return last_list[last_list.length - 1]; 
        }

        $scope.addDataHazardList = function (item_area, item_hazard, type) {
            // last item
            const lastItemHazard = findLastItem(item_area, 'no_type_hazard', item_hazard)
            console.log('item',item_area)
            $scope.MaxSeqdataHazard = Number($scope.MaxSeqdataHazard) + 1;
            var xValues = $scope.MaxSeqdataHazard;
            var newInput = clone_arr_newrow($scope.data_hazard_default)[0];
            newInput.seq = xValues;
            newInput.id = xValues;
            newInput.no = (lastItemHazard.no + 1);
            // newInput.no = (item_hazard.no + 1);
            newInput.index_rows = item_area.no;
            newInput.id_subareas = item_hazard.id_subareas;
            // newInput.id_subareas = item_area.seq;
            newInput.id_pha = $scope.data_header[0].seq;
            newInput.sub_area = item_area.sub_area;
            newInput.no_subareas = item_area.no;
            newInput.action_type = 'insert';
            newInput.action_change = 0;
            newInput.action_new_row = 0;
            newInput.work_of_task = item_area.work_of_task;
            type ? newInput.no_type_hazard = item_hazard.no_type_hazard : newInput.no_type_hazard = item_hazard.no_type_hazard + 1 ;
            type ? newInput.id_type_hazard = item_hazard.id_type_hazard : null
            type ? newInput.type_hazard = item_hazard.type_hazard : null

            // add
            var parent = angular.copy($scope.data_subareas_list[item_area.no - 1]);
            const lastIndex = findLastIndex(item_area.hazard, "no_type_hazard", item_hazard.no_type_hazard);
            var index_push = parent.hazard.length;
            var index_current =  type ? item_hazard.no - 1 : lastIndex;
            // var index_current = item_hazard.no - 1;
            var isSort = false;

            if (index_current + 1 != index_push  ) {
                index_push = index_current + 1;
                isSort = true;
            }

            if (isSort && !type) {
                var count = item_hazard.no_type_hazard + 1;
                for (let i = 0; i < parent.hazard.length; i++) {
                    if (parent.hazard[i].no_type_hazard == count) {
                        parent.hazard[i].no_type_hazard = parent.hazard[i].no_type_hazard + 1;

                    } else if (parent.hazard[i].no_type_hazard > count) {
                        parent.hazard[i].no_type_hazard = parent.hazard[i].no_type_hazard + 1;
                        count ++;
                    }
                    parent.hazard[i].action_change = 1;
                }
            } 
            // add
            parent.hazard.splice(index_push, 0, newInput);
            // sort number
            if (isSort) {
                for (let i = 0; i < parent.hazard.length; i++) {
                    parent.hazard[i].no = i + 1;
                }
            }
            $scope.data_subareas_list[item_area.no - 1] = parent;
            $scope.selectdata_hazard = xValues;
            console.log('data_subareas_list', $scope.data_subareas_list)

            // worksheet 
            addWorksheetForHazard(item_area, item_hazard, newInput, type)

            apply();
        }

        function addWorksheetForHazard(item_area, item_hazard, newInput, type) {
            // last item
            var last_list = $filter('filter')(item_area.hazard, function (item) {
                return (item.no_type_hazard == item_hazard.no_type_hazard);
            });
            const lastItemWs = last_list[last_list.length - 1];

            $scope.data_worksheet_list.forEach(element => {
                $scope.MaxSeqdataWorksheet = Number($scope.MaxSeqdataWorksheet) + 1;
                var xValues = $scope.MaxSeqdataWorksheet;
                var new_ws = clone_arr_newrow($scope.data_worksheet_def)[0];
                new_ws.id = xValues
                new_ws.seq = xValues
                new_ws.action_status = 'Open'
                $scope.master_header.pha_status > 11 ? new_ws.action_type = 'insert' : new_ws.action_type = 'new'
                new_ws.action_change = 0
                new_ws.id_pha =  newInput.id_pha
                new_ws.subarea_no = newInput.no_subareas 
                new_ws.id_hazard = newInput.seq
                new_ws.seq_hazard = newInput.seq
                new_ws.id_tasks =  element.seq
                new_ws.seq_tasks =  element.seq
                new_ws.tasks_no =  element.no
                new_ws.sub_area =  newInput.sub_area
                type ?  new_ws.hazard_no = newInput.no : new_ws.hazard_no = lastItemWs.no + 1
                type ? new_ws.type_hazard = newInput.type_hazard : null
   
                // get no worksheet
                var item_ws = $filter('filter')(element.worksheet, function (item) {
                    return (item.seq_hazard == item_hazard.seq);
                })[0];
                // item_ws.no = item_ws.no - 1;

                var lastIndexWs = findLastIndexWs(element.worksheet, 'seq_hazard', lastItemWs)
                var index_push_2 = element.worksheet.length;
                var index_current_2 = type ? item_ws.no : lastIndexWs + 1 ;
                var isSort_2 = false;

                if (index_current_2 != index_push_2  ) {
                    index_push_2 = index_current_2;
                    isSort_2 = true;
                }
                // add
                if (isSort_2) {
                    var check =  new_ws.hazard_no;
                    for (let i = 0; i < element.worksheet.length; i++) {
                        if (element.worksheet[i].hazard_no == check &&
                            element.worksheet[i].subarea_no == new_ws.subarea_no
                        ) {
                            element.worksheet[i].hazard_no = element.worksheet[i].hazard_no + 1;
                            check + 1;
                        }
                    }
               }
                new_ws.no =  lastIndexWs + 2;
                // new_ws.no =  getIndexWs + 2;
                element.worksheet.splice(index_push_2, 0, new_ws);
                // sort number
                if (isSort_2) {
                    for (let i = 0; i <  element.worksheet.length; i++) {
                        element.worksheet[i].no = i + 1;
                        element.worksheet[i].action_change = 1;
                    }
                }

            });
            console.log('all worksheet list',$scope.data_worksheet_list)
        }

        $scope.removeDataHazardList = function (item_area, item_hazard, index) {
            var delItem = $filter('filter')(item_area.hazard, function (item, idx) {
                return (item.no_type_hazard == item_hazard.no_type_hazard && item.no_subareas == item_hazard.no_subareas);
            });

            if (delItem.length > 0) {
                delItem.forEach(element => {
                    $scope.data_hazard_delete.push(element);
                    item_area.hazard = $filter('filter')(item_area.hazard, function (item, idx) {
                        return (item.seq != element.seq);
                    });
                });
                // sort number
                for (let i = 0; i < item_area.hazard.length; i++) {
                    item_area.hazard[i].no = i + 1;
                }
                var count = item_hazard.no_type_hazard + 1;

                for (let i = 0; i < item_area.hazard.length; i++) {
                    item_area.hazard[i].no = i + 1;

                    if (item_area.hazard[i].no_type_hazard == count) {
                        item_area.hazard[i].no_type_hazard = item_area.hazard[i].no_type_hazard - 1;
                    } else if (item_area.hazard[i].no_type_hazard > count) {
                        item_area.hazard[i].no_type_hazard = item_area.hazard[i].no_type_hazard - 1;
                        count ++;
                    }
                    item_area.hazard[i].action_change = 1;
                }

                // remove worksheet
                for (let i = 0; i < $scope.data_worksheet_list.length; i++) {
                    var list = [];
                    for (let j = 0; j < $scope.data_worksheet_list[i].worksheet.length; j++) {
                        let found = false; // Flag เพื่อเช็คว่า item นี้จะถูกลบหรือไม่
                        for (let k = 0; k < delItem.length; k++) {
                            if ($scope.data_worksheet_list[i].worksheet[j].seq_hazard == delItem[k].seq) {
                                $scope.data_worksheet_delete.push($scope.data_worksheet_list[i].worksheet[j]);
                                found = true; // พบ match, จะลบ item นี้
                                break; // ออกจาก loop ทันทีเมื่อเจอ match
                            }
                        }
                        if (!found) {
                            list.push($scope.data_worksheet_list[i].worksheet[j]); // ถ้าไม่พบ match, เพิ่ม item เข้า list ใหม่
                        }
                    }
                    $scope.data_worksheet_list[i].worksheet = list; // อัพเดท worksheet ด้วย list ใหม่
                }
                // sort 
                for (let i = 0; i < $scope.data_worksheet_list.length; i++) {
                    for (let j = 0; j < $scope.data_worksheet_list[i].worksheet.length; j++) {
                        for (let k = 0; k < delItem.length; k++) {
                            if($scope.data_worksheet_list[i].worksheet[j].no >= delItem[k].no){
                                $scope.data_worksheet_list[i].worksheet[j].action_change = 1;
                                $scope.data_worksheet_list[i].worksheet[j].no = $scope.data_worksheet_list[i].worksheet[j].no - 1;
                                if ($scope.data_worksheet_list[i].worksheet[j].subarea_no == delItem[k].no_subareas) {
                                    $scope.data_worksheet_list[i].worksheet[j].hazard_no = $scope.data_worksheet_list[i].worksheet[j].hazard_no - 1;   
                                }
                            }
                        }
                    }
                }
                // set default dropdown type hazard
                const id_type_hazard = delItem[0].id_type_hazard;
                setActiveOption(item_area, item_hazard, id_type_hazard)

                console.log('delItem',delItem)
                console.log('data_worksheet_list',$scope.data_worksheet_list)
                console.log('data_worksheet_delete',$scope.data_worksheet_delete)

            }
        }

        $scope.removeDataHealthHazard = function (item_area, item_hazard, index) {
            // remove
            var delItem = $filter('filter')(item_area.hazard, function (item, idx) {
                return (idx == index);
            })[0];
            if (delItem) {
                $scope.data_hazard_delete.push(delItem);
                item_area.hazard = $filter('filter')(item_area.hazard, function (item, idx) {
                    return (idx != index);
                });
                // sort number
                for (let i = 0; i < item_area.hazard.length; i++) {
                    item_area.hazard[i].no = i + 1;
                }

                // remove worksheet
                for (let i = 0; i < $scope.data_worksheet_list.length; i++) {
                    var list = [];
                    for (let j = 0; j < $scope.data_worksheet_list[i].worksheet.length; j++) {
                        if ($scope.data_worksheet_list[i].worksheet[j].hazard_no == delItem.no &&
                            $scope.data_worksheet_list[i].worksheet[j].subarea_no == delItem.no_subareas
                        ) {
                            $scope.data_worksheet_delete.push($scope.data_worksheet_list[i].worksheet[j])
                        }else {
                            list.push($scope.data_worksheet_list[i].worksheet[j])
                        }
                    }
                    $scope.data_worksheet_list[i].worksheet = list;
                }
                // sort number
                console.log('delItem', delItem)
                console.log('data_worksheet_delete', $scope.data_worksheet_delete)
                console.log('data_worksheet_list', $scope.data_worksheet_list)
                for (let i = 0; i < $scope.data_worksheet_list.length; i++) {
                    for (let j = 0; j < $scope.data_worksheet_list[i].worksheet.length; j++) {
                        $scope.data_worksheet_list[i].worksheet[j].no = j + 1;
                        $scope.data_worksheet_list[i].worksheet[j].action_change = 1;

                        if ($scope.data_worksheet_list[i].worksheet[j].hazard_no == $scope.data_worksheet_delete[0].hazard_no + 1) {
                            $scope.data_worksheet_list[i].worksheet[j].hazard_no = $scope.data_worksheet_list[i].worksheet[j].hazard_no - 1;
                        }
                    }
                }
            }
            console.log('data_subareas_list', $scope.data_subareas_list)
        };

        $scope.copyHazard = function (subArea, item) {
            if(!subArea && !item && !item.no_type_hazard) 
                return console.log('params not found!')
            console.log('subArea', subArea)
            console.log('item', item)

            // data_copy_hazard
            const no_type_hazard = item.no_type_hazard;
            var result = $filter('filter')(subArea.hazard, function (_item) { 
                return (_item.no_type_hazard == no_type_hazard); 
            });
            $scope.isCopyHazard = item.seq ;
            $scope.isPasteHazard = item.id_type_hazard;
            $scope.data_copy_hazard = angular.copy(result);
            console.log('data_copy_hazard', $scope.data_copy_hazard)
            // data_copy_worksheet
            var seqs = $scope.data_copy_hazard.map(function(hazard) {
                return hazard.seq;
            });
             var result_ws = $scope.data_worksheet_list.map(function(item) {
                return {
                    worksheet: item.worksheet.filter(function(ws) {
                        return seqs.includes(ws.seq_hazard);
                    })
                };
            });
            $scope.data_copy_worksheet = angular.copy(result_ws);
            console.log(' data_copy_worksheet', $scope.data_copy_worksheet)
        }

        $scope.pasteHazard = function (subArea, item) {
            if(!subArea && !item && !item.no_type_hazard) 
                return console.log('params not found!')
            console.log('subArea', subArea)
            console.log('item', item)
            
            // get hazard
            const no_type_hazard = item.no_type_hazard;
            var item_prev = $filter('filter')(subArea.hazard, function (_item) { 
                return (_item.no_type_hazard == no_type_hazard); 
            });

            // paste hazard
            if($scope.data_copy_hazard.length < 1)
                return console.log('data copy not found')

            var data = angular.copy($scope.data_copy_hazard)
            for (let i = 0; i < data.length; i++) {
                if (subArea.hazard[i] && subArea.hazard[i].id_type_hazard == data[i].id_type_hazard) {
                    // update
                    subArea.hazard[i].type_hazard = data[i].type_hazard
                    subArea.hazard[i].id_type_hazard = data[i].id_type_hazard
                    subArea.hazard[i].health_hazard = data[i].health_hazard
                    subArea.hazard[i].id_health_hazard = data[i].id_health_hazard
                    subArea.hazard[i].health_effect_rating = data[i].health_effect_rating
                    subArea.hazard[i].standard_type_text = data[i].standard_type_text
                    subArea.hazard[i].standard_value = data[i].standard_value
                    subArea.hazard[i].standard_unit = data[i].standard_unit
                    subArea.hazard[i].action_change = 1
                    subArea.hazard[i].action_type == 'update'
                       ? subArea.hazard[i].action_type = 'update'
                       : subArea.hazard[i].action_type = 'insert'
                }else {
                    // new
                    $scope.MaxSeqdataHazard = Number($scope.MaxSeqdataHazard) + 1;
                    var xValues = $scope.MaxSeqdataHazard;
                    data[i].id = xValues
                    data[i].seq = xValues
                    data[i].id_subareas = item.id_subareas
                    data[i].no_subareas = item.no_subareas
                    data[i].no_type_hazard = item.no_type_hazard
                    data[i].sub_area = item.sub_area
                    data[i].work_of_task = item.work_of_task
                    data[i].index_rows = subArea.hazard[i - 1] ? subArea.hazard[i - 1].index_rows + 1 : 0
                    data[i].action_type = 'insert'
                    // subArea.hazard.splice(i, 0, data[i])
                }
            }
            // subArea.hazard = data;
            console.log('All SubAreac',$scope.data_subareas_list)

            // paste worksheet
            var data_ws = angular.copy($scope.data_copy_worksheet)

            for (let i = 0; i < $scope.data_worksheet_list.length; i++) {
                // check ข้อมูล worksheet เก่าที่จะวางทับ มีข้อมูลหรือไม่
                if (item_prev.length > 0) {
                    var ws_prev = [];
                    for (let j = 0; j < item_prev.length; j++) {
                        var list = $filter('filter')($scope.data_worksheet_list[i].worksheet, function (_item) { 
                            return (_item.seq_hazard == item_prev[j].seq); 
                        });
                        ws_prev.push(...list);
                    }
                    console.log('ws_prev',ws_prev)
                    // นำข้อมูล worksheet เก่าที่จะวางทับมาอัพเดท ตามข้อมูลที่ copy มา
                    for (let k = 0; k < data_ws.length; k++) {
                        var index = -1;
                        for (let l = 0; l < data_ws[k].worksheet.length; l++) {
                            if (ws_prev[l]) {
                                // update
                                ws_prev[l].health_effect_rating = data_ws[k].worksheet[l].health_effect_rating
                                ws_prev[l].health_hazard = data_ws[k].worksheet[l].health_hazard
                                ws_prev[l].type_hazard = data_ws[k].worksheet[l].type_hazard
                                // find index in worksheet
                                index =  $scope.data_worksheet_list[i].worksheet.findIndex(function (item) {
                                    return (ws_prev[l].seq == item.seq);
                                });
                            }else {
                                // new
                                $scope.MaxSeqdataWorksheet = Number($scope.MaxSeqdataWorksheet) + 1;
                                var xValues = $scope.MaxSeqdataWorksheet;
                                data_ws[k].worksheet[l].id = xValues
                                data_ws[k].worksheet[l].seq = xValues
                                data_ws[k].worksheet[l].action_type = 'insert'
                                console.log('index ',index)
                                // $scope.data_worksheet_list[i].worksheet.push(data_ws[k].worksheet[l])
                                $scope.data_worksheet_list[i].worksheet.splice(index, 0, data_ws[k].worksheet[l])
                            }
                        }
                    }
                }   
            }

            console.log('item_prev ',item_prev)
            console.log('data_worksheet_list ',$scope.data_worksheet_list)
        }


        $scope.addDataSubAreas = function (item, index) {
            $scope.MaxSeqdataSubareas = Number($scope.MaxSeqdataSubareas) + 1;
            var xValues = $scope.MaxSeqdataSubareas;

            var seq = item.seq;
            var arr = $filter('filter')($scope.data_subareas, function (item) { return (item.seq == seq); });
            var iNo = 1; if (arr.length > 0) { iNo = arr[0].no; index_rows = arr[arr.length - 1].index_rows; }


            var newInput = clone_arr_newrow($scope.data_subareas_def)[0];
            newInput.seq = xValues;
            newInput.id = xValues;

            newInput.no = iNo + 1;

            newInput.action_type = 'insert';
            newInput.action_change = 0;
            newInput.action_new_row = 0;

            running_no_level1_lv1($scope.data_subareas, iNo, index, newInput);

            $scope.selectdata_subareas = xValues;
            apply();

        }

        $scope.removeDataSubAreas = function (seq, index) {
            var arrdelete = $filter('filter')($scope.data_subareas, function (item) {
                return (item.seq == seq && item.action_type == 'update');
            });
            if (arrdelete.length > 0) { $scope.data_subareas_delete.push(arrdelete[0]); }

            $scope.data_subareas = $filter('filter')($scope.data_subareas, function (item) {
                return !(item.seq == seq);
            });
            if ($scope.data_subareas.length == 0) {
                $scope.addDataSubAreas();
            }

            running_no_level1($scope.data_subareas, null, index, null);
            apply();
        };

        $scope.addDataHazard = function (item, index) {
            $scope.MaxSeqdataHazard = Number($scope.MaxSeqdataHazard) + 1;
            var xValues = $scope.MaxSeqdataHazard;

            var seq = item.seq;
            var arr = $filter('filter')($scope.data_hazard, function (item) { return (item.seq == seq); });
            var iNo = 1; if (arr.length > 0) { iNo = arr[0].no; }

            var newInput = clone_arr_newrow($scope.data_hazard_def)[0];
            newInput.seq = xValues;
            newInput.id = xValues;
            newInput.no = (iNo + 1);

            newInput.action_type = 'insert';
            newInput.action_change = 0;
            newInput.action_new_row = 0;

            running_no_level1_lv1($scope.data_hazard, iNo, index, newInput);

            $scope.selectdata_hazard = xValues;

            apply();

        }

        $scope.removeDataHazard = function (seq, index) {
            var arrdelete = $filter('filter')($scope.data_hazard, function (item) {
                return (item.seq == seq && item.action_type == 'update');
            });
            if (arrdelete.length > 0) { $scope.data_hazard_delete.push(arrdelete[0]); }

            $scope.data_hazard = $filter('filter')($scope.data_hazard, function (item) {
                return !(item.seq == seq);
            });
            if ($scope.data_hazard.length == 0) {
                $scope.addDataHazard(); return;
            }

            running_no_level1($scope.data_hazard, null, index, null);

            if (!arrdelete[0].id_type_hazard) {
                genareate_worksheet();
            }

            apply();
        };

    }

    //List of Worker Groups and Description of Tasks
    if (true) {

        function addWorksheet (type, subArea, hazard) {
            if (!type) {
                return console.log('type not found !')

            } else if (type == 'sub_area') {
                console.log(hazard)
                for (let i = 0; i < $scope.data_tasks.length; i++) {
                    $scope.MaxSeqdataWorksheet = Number($scope.MaxSeqdataWorksheet) + 1;
                    var xValues = $scope.MaxSeqdataWorksheet;
                    var newInput = clone_arr_newrow($scope.data_worksheet_def)[0];
                    
                    newInput.action_type = 'insert';
                    newInput.action_status = 'Open';
                    newInput.action_change = 0;
                    newInput.seq = xValues;
                    newInput.id = xValues;
                    newInput.id_pha = hazard.id_pha;
                    newInput.id_tasks = $scope.data_tasks[i].seq;
                    newInput.seq_tasks = $scope.data_tasks[i].seq;
                    newInput.no = hazard.no + 1;
                    newInput.id_hazard = hazard.seq;
                    newInput.seq_hazard = hazard.seq;
                    // newInput.hazards = [hazard];
                    // newInput.sub_areas = [subArea];
                    newInput.subarea_no = hazard.no_subareas;
                    $scope.data_worksheet_list.push(newInput);
                }

            } else if (type == 'task') {
                
            }

            // add worksheet follow task
            // if ($scope.data_worksheet_list == $scope.data_worksheet_list.length) {
                
            // }
            console.log('addWorksheet all',$scope.data_worksheet_list)
        }

        $scope.addDataTasks = function (item, index) {
            $scope.MaxSeqdataTasks = Number($scope.MaxSeqdataTasks) + 1;
            var xValues = $scope.MaxSeqdataTasks;
            var newInput = clone_arr_newrow($scope.data_tasks_def)[0];
            newInput.seq = xValues;
            newInput.id = xValues;
            newInput.id_pha = item.id_pha;
            newInput.no = Number(item.no + 1);
            newInput.action_type = 'insert';
            newInput.action_change = 0;
            newInput.action_new_row = 0;
            newInput.tasks_type_other = 0;
            newInput.index_rows = index + 1;
            newInput.descriptions = [];
            newInput.worker_list = [];
            newInput.worksheet = [];

            $scope.MaxSeqdataDescriptions = Number($scope.MaxSeqdataDescriptions) + 1;
            var xValues2 = $scope.MaxSeqdataDescriptions;
            var newInput2 = clone_arr_newrow($scope.data_descriptions_def)[0];
            newInput2.seq = xValues2;
            newInput2.id = xValues2;
            newInput2.no = 1;
            newInput2.id_pha = item.id_pha;
            newInput2.action_type = 'insert';
            newInput2.action_change = 0;
            newInput2.index_rows = item.no;
            newInput2.id_tasks = newInput.seq;

            newInput.descriptions.push(newInput2);

            var index_push = $scope.data_tasks.length;
            var index_current =  item.no;
            var isSort = false;

            if (index_current != index_push  ) {
                index_push = index_current;
                isSort = true;
            }
             // add
            $scope.data_tasks.splice(index_push, 0, newInput);
            // sort number
            if (isSort) {
                for (let i = 0; i <  $scope.data_tasks.length; i++) {
                    $scope.data_tasks[i].no = i + 1;
                    $scope.data_tasks[i].index_rows = i;

                    for (let j = 0; j < $scope.data_tasks[i].descriptions.length; j++) {
                        $scope.data_tasks[i].descriptions[j].index_rows = i
                    }
                }
            }

            // add worksheet follow task
            // var new_ws = angular.copy($scope.data_worksheet_list)
            var new_ws = newInput;
            // for (let i = 0; i < new_ws.length; i++) {
            new_ws.worksheet = angular.copy($scope.data_worksheet_list[0].worksheet)
            for (let j = 0; j < new_ws.worksheet.length; j++) {
                $scope.MaxSeqdataWorksheet = Number($scope.MaxSeqdataWorksheet) + 1;
                var xValues = $scope.MaxSeqdataWorksheet;
                new_ws.worksheet[j].action_type = 'insert';
                new_ws.worksheet[j].id = xValues;
                new_ws.worksheet[j].seq = xValues;
                new_ws.worksheet[j].index_rows = index;
                new_ws.worksheet[j].tasks_no =newInput.no;
                new_ws.worksheet[j].id_tasks = newInput.seq;
                new_ws.worksheet[j].seq_tasks = newInput.seq;
                
            }
            // }
            // $scope.data_worksheet_list.push(new_ws)
            if (index_current != index_push  ) {
                index_push = index_current;
                isSort = true;
            }
             // add
            $scope.data_worksheet_list.splice(index_push, 0, new_ws);
            // sort number
            // if (isSort) {
            //     for (let i = 0; i < $scope.data_worksheet_list.length; i++) {
            //         for (let j = 0; j < $scope.data_worksheet_list[i].worksheet.length; j++) {
            //             $scope.data_worksheet_list[i].worksheet[j].no = j + 1;
            //             $scope.data_worksheet_list[i].worksheet[j].hazard_no = j;
            //         }
            //     }
            // }

            // if ($scope.data_worksheet_list.length  != $scope.data_tasks.length * $scope.data_worksheet_list.length) {
            //     var new_ws = angular.copy($scope.data_worksheet_list)
            //     var index = new_ws.length
            //     for (let i = 0; i < new_ws.length; i++) {
            //         $scope.MaxSeqdataWorksheet = Number($scope.MaxSeqdataWorksheet) + 1;
            //         var xValues = $scope.MaxSeqdataWorksheet;
            //         new_ws[i].id = xValues;
            //         new_ws[i].seq = xValues;
            //         new_ws[i].index_rows = index;
            //         new_ws[i].id_tasks = newInput.seq;
            //         new_ws[i].seq_tasks = newInput.seq;
            //         index ++;
            //     }
            //     console.log(new_ws)
            //     $scope.data_worksheet_list = [...$scope.data_worksheet_list, ...new_ws]
            // }
            console.log('all ==> ', $scope.data_tasks)
            console.log('all worksheet ==> ', $scope.data_worksheet_list)
            
        }

        $scope.removeDataTasks = function (item, index) {
            const delTasks = $scope.data_tasks.find((tasks, idx) => idx === index);

            if (!delTasks) return console.log('item data_tasks not found');
            // remove
            $scope.data_tasks_delete.push(delTasks);
            // remove tasks
            $scope.data_tasks = $filter('filter')($scope.data_tasks, function (tasks, idx) {
                return (idx != index);
            });
            // remove descriptions
            for (let i = 0; i < item.descriptions.length; i++) {
                $scope.data_descriptions_delete.push(item.descriptions[i]);
            }
            // sort number
            for (let i = 0; i < $scope.data_tasks.length; i++) {
                $scope.data_tasks[i].no = i + 1;
                $scope.data_tasks[i].index_rows = i;

                for (let j = 0; j < $scope.data_tasks[i].descriptions.length; j++) {
                    $scope.data_tasks[i].descriptions[j].no = j + 1;
                    $scope.data_tasks[i].descriptions[j].index_rows = i;
                }
            }

            // remove worksheet
            const delTasksWs = $scope.data_worksheet_list.find((ws_ls, idx) => idx === index);
            if (!delTasksWs) return console.log('item data_tasks not found');
            // remove
            $scope.data_worksheet_list = $filter('filter')($scope.data_worksheet_list, function (ws_ls, idx) {
                return (idx != index);
            });
            for (let i = 0; i < delTasksWs.worksheet.length; i++) {
                $scope.data_worksheet_delete.push(delTasksWs.worksheet[i]);
            }
            // sort number
            // for (let i = 0; i < $scope.data_worksheet_list.length; i++) {
            //     for (let j = 0; j < $scope.data_worksheet_list[i].worksheet.length; j++) {
            //         $scope.data_worksheet_list[i].worksheet[j].no = j + 1;
            //         $scope.data_worksheet_list[i].worksheet[j].hazard_no = j;
            //     }
            // }
            console.log('data_worksheet_delete', $scope.data_worksheet_delete)
            console.log('data_worksheet_list', $scope.data_worksheet_list)
        };

        //work or tasks
        $scope.addDescriptions = function (item_t, item_d){
            $scope.MaxSeqdataDescriptions = Number($scope.MaxSeqdataDescriptions) + 1;
            var xValues = $scope.MaxSeqdataDescriptions;

            var newInput = clone_arr_newrow($scope.data_descriptions_def)[0];

            newInput.seq = xValues;
            newInput.id = xValues;
            newInput.no = Number(item_d.no + 1);
            newInput.id_pha = item_t.id_pha;
            newInput.id_tasks = item_t.seq;
            newInput.action_type = 'insert';
            newInput.action_change = 1;
            newInput.index_rows = item_t.index_rows;

            var index_push = item_t.descriptions.length;
            var index_current =  item_d.no;
            var isSort = false;

            if (index_current != index_push  ) {
                index_push = index_current;
                isSort = true;
            }
            // add
            item_t.descriptions.splice(index_push, 0, newInput);
            // sort number
            if (isSort) {
                for (let i = 0; i <  item_t.descriptions.length; i++) {
                    item_t.descriptions[i].no = i + 1;
                }
            }
            console.log('all ==> ',$scope.data_tasks)
        }

        $scope.removeDescriptions = function (item_t, index) {
            const delItem = item_t.descriptions.find((item, idx) => idx === index);

            if (!delItem) return console.log('item data_descriptions not found');
            // remove
            $scope.data_descriptions_delete.push(delItem);

            item_t.descriptions = $filter('filter')(item_t.descriptions, function (item, idx) {
                return (idx != index);
            });
            // sort number
            for (let i = 0; i < item_t.descriptions.length; i++) {
                item_t.descriptions[i].no = i + 1;
            }
        };
        
        // $scope.addDataTasks = function (item, index) {

        //     $scope.MaxSeqdataTasks = Number($scope.MaxSeqdataTasks) + 1;
        //     var xValues = $scope.MaxSeqdataTasks;

        //     var seq = item.seq;
        //     var arr = $filter('filter')($scope.data_tasks, function (item) { return (item.seq == seq); });
        //     var iNo = 1; if (arr.length > 0) { iNo = arr[0].no; }

        //     var newInput = clone_arr_newrow($scope.data_tasks_def)[0];
        //     newInput.seq = xValues;
        //     newInput.id = xValues;
        //     newInput.no = (iNo + 1);
        //     newInput.action_type = 'insert';
        //     newInput.action_change = 0;
        //     newInput.action_new_row = 0;
        //     newInput.tasks_type_other = 0;

        //     running_no_level1_lv1($scope.data_tasks, iNo, index, newInput);

        //     $scope.selectdata_tasks = xValues;
        //     set_tasks_type_other();

        //     apply();

        // }

        // $scope.removeDataTasks = function (seq, index) {
        //     var arrdelete = $filter('filter')($scope.data_tasks, function (item) {
        //         return (item.seq == seq && item.action_type == 'update');
        //     });
        //     if (arrdelete.length > 0) { $scope.data_tasks_delete.push(arrdelete[0]); }

        //     $scope.data_tasks = $filter('filter')($scope.data_tasks, function (item) {
        //         return !(item.seq == seq && item.tasks_type_other == 0);
        //     });
        //     if ($scope.data_tasks.length == 0) {
        //         $scope.addDataTasks(); return;
        //     }

        //     running_no_level1($scope.data_tasks, null, index, null);
        //     set_tasks_type_other();

        //     if (!arrdelete[0].id_worker_group) {
        //         genareate_worksheet();
        //     }

        //     apply();
        // };

        $scope.addDataWork = function (item){

            if (!item.work_or_task) {
                $scope.MaxSeqdataTasks = Number($scope.MaxSeqdataTasks);
                var xValues = $scope.MaxSeqdataTasks;

                item.work_or_task = [{...item, seq: xValues,id: xValues}];
            }

            $scope.MaxSeqdataTasks = Number($scope.MaxSeqdataTasks) + 1;
            var xValues = $scope.MaxSeqdataTasks;
            var seq = item.seq;
            var arr = $filter('filter')($scope.data_tasks, function (item) { return (item.seq == seq); });
            var iNo = item.no

            var newInput = clone_arr_newrow($scope.data_tasks_def)[0];
            newInput.seq = xValues;
            newInput.id = xValues;
            newInput.no = iNo;
            newInput.action_type = 'insert';
            newInput.action_change = 0;
            newInput.action_new_row = 0;

            newInput.tasks_type_other = 0;

            //running_no_level1_lv1($scope.data_tasks, iNo, index, newInput);

            //$scope.data_tasks.push(newInput)
            set_work(newInput)
            $scope.selectdata_tasks = xValues;

            //set tasks_type_other = 1, no = 99 
            set_tasks_type_other();

            apply();
        }
        $scope.removeDataWork = function (item_no, seq) {
            const Data_Groups = $scope.data_tasks.find(groups => groups.no === item_no);
            if (!Data_Groups) {
                console.log("No Groups found with the specified 'no' value.");
                return;
            }

            const data_work = Data_Groups['work_or_task'].findIndex(item => item.seq === seq);
            if (data_work === -1) {
                console.log("No Groups found with the specified 'seq' value.");
                return;
            }

            Data_Groups['work_or_task'].splice(data_work, 1);

            console.log(`Removed task with seq '${seq}' from data ${item_no}.`);            
        };

        //complex array  //use same no. as above 
        function set_work(item) {
            var newItem = item;
        
            var task_items = $scope.data_tasks.filter(function(task) {
                return task.no === newItem.no;
            });
            
            // Push the new item into each task_item's 'work_or_task' array
            task_items.forEach(function(task) {
                if (!task.work_or_task) {
                    task.work_or_task = []; 
                }
                task.work_or_task.push(newItem);
            });
        }
        
        function set_tasks_type_other() {
            //set tasks_type_other = 1, no = 99 
            var arrTaskTypeOther = $filter('filter')($scope.data_tasks, function (item) {
                return (item.tasks_type_other == 1);
            });
            if (arrTaskTypeOther.length > 0) { arrTaskTypeOther[0].no = 99; }
        }
    }

    //add workers to data_workers
    if (true) {
        function add_workers(id_worker_group, id_tasks, tasks_type_other, user_name, user_displayname) {

            //add new relatedpeople
            var seq = $scope.MaxSeqdataWorkers;

            var newInput = clone_arr_newrow($scope.data_workers_def)[0];
            newInput.seq = seq;
            newInput.id = seq;
            newInput.no = (0);
            newInput.id_tasks = Number(id_tasks);
            newInput.id_worker_group = Number(id_worker_group);
            newInput.action_type = 'insert';
            newInput.action_change = 1;

            newInput.tasks_type_other = tasks_type_other;
            newInput.user_name = user_name;
            newInput.user_displayname = user_displayname;
            newInput.user_title = null;
            newInput.user_img = null;

            $scope.data_workers.push(newInput);

            var iNo = $scope.data_workers.length
            running_no_level1($scope.data_workers, iNo, null);

            $scope.MaxSeqdataWorkers = Number($scope.MaxSeqdataWorkers) + 1

        }

    }


    //Worksheet
    if (true) {
        function genareate_worksheet() {

            //loop data_hazard
            //loop data_subareas
            //loop data_workers

            //loop data_worksheet


            var index_rows = 0;
            var id_business_unit = 0;
            var id_hazard = 0;
            var id_tasks = 0;
            var id_workers = 0;

            var row_type = '';
            var arr_items_def = clone_arr_newrow($scope.data_worksheet_def);

            var row_tasks_start = 0;
            var row_hazard_start = 0;

            var tasks_no = 0;

            for (var t = 0; t < $scope.data_tasks.length; t++) {

                id_tasks = $scope.data_tasks[t].id;
                row_tasks_start = index_rows;
                tasks_no = (t+1);

                for (var h = 0; h < $scope.data_hazard.length; h++) {
                    id_hazard = $scope.data_hazard[h].id;
                    row_hazard_start = index_rows;


                    for (var w = 0; w < $scope.data_workers.length; w++) {
                        id_workers = $scope.data_workers[w].id;
                        add_row_worksheet(arr_items_def, index_rows, row_type, id_hazard, id_tasks, id_workers, tasks_no );
                        arr_items_def[index_rows].row_type = 'workers';

                        index_rows += 1;
                    }
                    if (t == 0) { arr_items_def = $filter('filter')(arr_items_def, function (item) { return !(item.id == null); }); }

                    arr_items_def[row_hazard_start].row_type = 'hazard';
                    arr_items_def[row_hazard_start].row_span_hazard = ($filter('filter')(arr_items_def, function (item) {
                        return !(item.id == null) && (
                            (item.id_hazard == id_hazard)
                            && (item.id_tasks == id_tasks)
                        );
                    })).length;
                }

                arr_items_def[row_tasks_start].row_type = 'tasks';
                arr_items_def[row_tasks_start].tasks_no = tasks_no;
                arr_items_def[row_tasks_start].row_span_tasks = ($filter('filter')(arr_items_def, function (item) {
                    return !(item.id == null) && (item.id_tasks == id_tasks);
                })).length;

            }

            // console.clear();

            if (arr_items_def.length > 0) {
                $scope.data_worksheet = $filter('filter')(arr_items_def, function (item) { return !(item.id == null); });
            }

            apply();
        }

        function add_row_worksheet(arr_items_def, index_rows, row_type, id_hazard, id_tasks, id_workers, tasks_no) {

            var defMaxSeqdataWorksheet = $scope.MaxSeqdataWorksheet;

            $scope.MaxSeqdataWorksheet = Number($scope.MaxSeqdataWorksheet) + 1;
            var xValues = $scope.MaxSeqdataWorksheet;

            var arr_worksheet = $filter('filter')($scope.data_worksheet, function (item) {
                return (
                    (item.id_hazard == id_hazard)
                    && (item.id_tasks == id_tasks)
                    && (item.id_workers == id_workers)
                );
            });
            if (arr_worksheet.length == 0) {

                var iNo = (index_rows + 1);
                var newInput = clone_arr_newrow($scope.data_worksheet_def)[0];
                newInput.seq = xValues;
                newInput.id = xValues;
                newInput.no = (iNo + 1);
                newInput.action_type = 'insert';
                newInput.action_status = 'Open';
                newInput.action_change = 1;
                newInput.action_new_row = 1;

                newInput.index_rows = index_rows;
                newInput.recommendations_no = (index_rows + 1);
                newInput.tasks_no = tasks_no;

                newInput.row_type = row_type;

                //details
                newInput.id_hazard = id_hazard;
                newInput.id_tasks = id_tasks;
                newInput.id_workers = id_workers;

                var arrworkers = $filter('filter')($scope.data_workers, function (item) {
                    return (item.id == id_workers);
                });
                if (arrworkers.length > 0) {
                    newInput.responder_user_id = null;
                    newInput.responder_user_name = arrworkers[0].user_name;
                    newInput.responder_user_email = null;
                    newInput.responder_user_displayname = arrworkers[0].user_displayname;
                    newInput.responder_user_img = null;
                }

                //worker_group, activity, business_unit, health_hazard
                var arrhazard = $filter('filter')($scope.data_hazard, function (item) {
                    return (item.id == id_hazard);
                });
                if (arrhazard.length > 0) {
                    newInput.tlv_std = arrhazard.tlv_standard; 
                }
                 
                arr_items_def.push(newInput);

            } else {
                arr_worksheet[0].index_rows = (index_rows);
                arr_worksheet[0].recommendations_no = (index_rows + 1);
                arr_items_def.push(arr_worksheet[0]);
            } 

        }

        $scope.cloneFrequencyLevel = function (item) {

        }

        function calulateExposureRating(_arr) {

            var frequency_level = _arr.id_frequency_level //col 3.6
            var exposure_level = _arr.id_exposure_level//col 3.9
            var result_exposure_rating;//col 3.10 => col 3.6 x col 3.9

            var health_effect_rating = '';//col 3.5
            var result_initial_risk_rating = '';//col 3.11 => col 3.5 x col 3.10
            var arrhazard = $filter('filter')($scope.data_hazard, function (item) {
                return (item.id == _arr.id_hazard);
            });
            if (arrhazard.length > 0) {
                health_effect_rating = arrhazard[0].health_effect_rating;
            } 
           
            try {
                var arrret = $filter('filter')($scope.master_compare_exposure_rating, function (item) {
                    return (item.frequency_level == frequency_level
                        && item.exposure_level == exposure_level);
                });
                if (arrret.length > 0) {
                    result_exposure_rating = arrret[0].results;
                }
                _arr.exposure_rating = result_exposure_rating;
            } catch { _arr.exposure_rating = null; }

            try {
                var arrret = $filter('filter')($scope.master_compare_initial_risk_rating, function (item) {
                    return (item.health_effect_rating == health_effect_rating
                        && item.exposure_rating == result_exposure_rating);
                });
                if (arrret.length > 0) {
                    result_initial_risk_rating = arrret[0].results;
                }
                _arr.initial_risk_rating = result_initial_risk_rating;
            } catch { _arr.initial_risk_rating = null; }

     

        };

    }

    //action in page
    if (true) {
        $scope.isFullscreen = false;
        $scope.showHistory = false;

        $scope.toggleContent = function () {
            $scope.showHistory = !$scope.showHistory;
        };
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

        $scope.formData = {};

        $scope.confirmBack = function () {

            if(!$scope.unsavedChanges){
                window.open("home/portal", "_top");
            }else{
                $('#unsavedChangesModal').modal({
                    backdrop: 'static',
                    keyboard: false 
                }).modal('show');
            }
            
            return;
        };

        $scope.action_leavePage = function(action) {
            switch (action) {
                case 'leave':
                    $scope.unsavedChanges = true;
                    window.open("home/portal", "_top");
                    break;
        
                case 'leaveWithsave': 
                    $('#unsavedChangesModal').modal('hide');
    
                    $scope.confirmSave('save', function() {
                        window.open("home/portal", "_top");
                    });
                    break;
        
                case 'stay':
                    $('#unsavedChangesModal').modal('hide');
                    break;
            }
        };
    

        $scope.confirmMailtoMemberReview = function (action) {

            if (action == 'submit') {
                //Please confirm to send the information to the member team for review. 
                $('#modalSendMailTeam').modal('show');
            }
            else if (action == 'confirm_submit_team') {
                $('#modalSendMailTeam').modal('hide');

                var user_name = $scope.user_name;
                var token_doc = $scope.data_header[0].seq;

                $.ajax({
                    url: url_ws + "Flow/send_notification_member_review",
                    data: '{"sub_software":"hra","user_name":"' + user_name + '","pha_seq":"' + token_doc + '"}',
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


                            $('#modalSendMailTeam').modal('hide');
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
            else {
                $('#modalSendMailTeam').modal('hide');
            }
        }
        $scope.confirmExport = function (export_report_type, data_type) {

            var seq = $scope.data_header[0].seq;
            var user_name = $scope.user_name;

            var action_export_report_type = "hra_report";

            if (export_report_type == "hra_report") {
                action_export_report_type = "export_hra_report";
            } else if (export_report_type == "hra_worksheet") {
                action_export_report_type = "export_hra_worksheet";
            } else if (export_report_type == "hra_recommendation") {
                action_export_report_type = "export_hra_recommendation";
            } else if (export_report_type == "hra_template_moc") {
                action_export_report_type = "export_hra_template_moc";
            } else {
                return;
            }

           
            $.ajax({
                url: url_ws + "Flow/" + action_export_report_type,
                data: '{"sub_software":"hra","user_name":"' + user_name + '","seq":"' + seq + '","export_type":"' + data_type + '"}',
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

        $scope.confirmSubmit = function (action) {
            $scope.Action_Msg_Confirm = false;
            if (action == 'no') {
                $('#modalMsg').modal('hide');
                return;
            }
            save_data_create("submit");
        }
        $scope.confirmCancle = function () {
            $scope.Action_Msg_Confirm = true;

            set_alert_confirm('Confirm canceling the PHA No.', '');
        }
        $scope.confirmSave = function (action) {

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


            //call required field
            if (true) {
                var bCheckRequiredField = false;

                if (action == 'submit_register' || action == 'submit_conduct' || action == 'submit_genarate') {

                    var bCheckValid = false;
                    var arr_chk = $scope.data_general;
                    if (pha_status == "11" && false) {

                        if (arr_chk[0].id_company == '' || arr_chk[0].id_company == null) { set_alert('Warning', 'Please select a valid Company'); return; }
                        if (arr_chk[0].id_apu == '' || arr_chk[0].id_apu == null) { set_alert('Warning', 'Please select a valid Area Process Unit'); return; }
                        if (arr_chk[0].pha_request_name == '' || arr_chk[0].id_company == null) { set_alert('Warning', 'Please select a valid Company'); return; }

                    }
                    else if (pha_status == "12") {

                        if (false) {
                            if (arr_chk[0].id_company == '' || arr_chk[0].id_company == null) { set_alert('Warning', 'Please select a valid Company'); return; }
                            if (arr_chk[0].id_apu == '' || arr_chk[0].id_apu == null) { set_alert('Warning', 'Please select a valid Area Process Unit'); return; }
                        }

                        if (true) {
                            arr_chk = $scope.data_memberteam;
                            if (arr_chk.length == 0) { set_alert('Warning', 'Please provide a valid Session List'); return; }
                            else {
                                var irows_last = arr_chk.length - 1;
                                if (arr_chk[irows_last].user_name == null) { set_alert('Warning', 'Please provide a valid Session List'); return; }
                            }

                            if ($scope.data_header[0].request_approver > 0) {

                                arr_chk = $scope.data_approver;
                                if (arr_chk.length == 0) { set_alert('Warning', 'Please provide a valid Assessment Team Leader List'); return; }
                                else {
                                    var irows_last = arr_chk.length - 1;
                                    if (arr_chk[irows_last].user_name == null) { set_alert('Warning', 'Please provide a valid Assessment Team Leader List'); return; }
                                }

                            }
                        }

                    }

                    if (bCheckValid) { return; }

                }
            }


            //call function confirm ให้เลือก Ok หรือ Cancle
            if (true) {
                $scope.Action_Msg_Confirm = false;
                if (action == 'submit_register') {
                    $scope.Action_Msg_Confirm = true;

                    $('#modalSendMailRegister').modal('show');
                    return;
                } else if (action == 'submit_conduct') {
                    $scope.Action_Msg_Confirm = true;

                    $('#modalSendMailConduct').modal('show');
                    return;
                } else if (action == 'submit_approver') {
                    $scope.Action_Msg_Confirm = true;

                    $('#modalSendMailApprover').modal('show');
                    return;
                } else if (action == 'submit_genarate') {
                    $scope.Action_Msg_Confirm = true;

                    $('#modalSendGenarateFullReport').modal('show');
                    return;
                } else if (action == 'save') {

                }
            }

            //action after confirm 
            if (true) {
                if (action == 'confirm_submit_register') {
                    $scope.Action_Msg_Confirm = true;
                    action = 'submit';

                    $('#modalSendMailRegister').modal('hide');
                } else if (action == 'confirm_submit_register_without') {
                    $scope.Action_Msg_Confirm = true;
                    action = 'submit_without';
                    $('#modalSendMail').modal('hide');

                } else if (action == 'confirm_submit_complete') {
                    $scope.Action_Msg_Confirm = true;
                    action = 'submit_complete';
                    $('#modalSendMailConduct').modal('hide');

                } else if (action == 'confirm_submit_moc') {
                    $scope.Action_Msg_Confirm = true;
                    action = 'submit_moc';
                    $('#modalSendMailConduct').modal('hide');

                } else if (action == 'confirm_cancel_complete') {
                    $scope.Action_Msg_Confirm = false;
                    $('#modalSendMailConduct').modal('hide');

                    return;
                } else if (action == 'confirm_submit_genarate'
                    || action == 'confirm_submit_genarate_without') {

                    $scope.Action_Msg_Confirm = true;
                    $('#modalSendGenarateFullReport').modal('hide');

                } else if (action == 'confirm_submit_approver') {

                    action = 'submit_complete';
                    $scope.Action_Msg_Confirm = true;
                    $('#modalSendMailApprover').modal('hide');

                } else if (action == 'confirm_cancel_approver') {

                    $('#modalSendMailApprover').modal('hide');
                    return;
                }
            }

            //check requie Field 
            if (action == 'confirm_submit_genarate' || action == 'confirm_submit_genarate_without') {
                $('#modalPleaseRegister').modal('hide');
            } else if (action == 'confirm_submit_approver') {
                $('#modalSendMailApprover').modal('hide');
            } else if (action == 'save') {

                var arr_chk = $scope.data_general;
                if (pha_status == "11" && false) {
                    if (arr_chk[0].id_company == '' || arr_chk[0].id_company == null) { set_alert('Warning', 'Please select a valid Company'); return; }
                    if (arr_chk[0].id_apu == '' || arr_chk[0].id_apu == null) { set_alert('Warning', 'Please select a valid Area Process Unit'); return; }

                    if (arr_chk[0].pha_request_name == '' || arr_chk[0].id_company == null) { set_alert('Warning', 'Please select a valid Company'); return; }
                }

            }
            else {
                if ($scope.Action_Msg_Confirm == true) {
                    $('#modalMsg').modal('hide');
                    $("#divLoading").hide();

                    if ($scope.flow_role_type == 'admin') {
                        //mail noti
                        $('#modalSendMail').modal('show');
                    }
                }
            }

            if(action === 'save' && $scope.isMainApprover){
                return $('#modalEditConfirm').modal('show');
            }
            save_data_create(action);
            $scope.unsavedChanges  = false;

        }

        
    $scope.actionEdit = function (type) {
        if(type = 'yes'){
            var action = ''
            if ($scope.params == 'edit') {
                action = 'edit_worksheet'
            }else if($scope.params == 'edit_action_owner'){
                action = 'change_action_owner'
            }else if($scope.params == 'edit_approver'){
                action = 'change_approver'
            }else{
                $('#modalEditConfirm').modal('hide');

                action = "save_worksheet"
                setTimeout(function() {
                    save_data_editworksheet(action);
                }, 200); 

                return;
            }
            $('#modalEditConfirm').modal('hide');
            setTimeout(function() {
                save_data_create(action, 'save');
            }, 200); 
        }else{
            $('#modalEditConfirm').modal('hide');
        }

    }
    
        $scope.confirmDialogApprover = function (_item, action) {


            
            $scope.data_drawing_approver.forEach(function(item) {
                item.action_type === 'new' ? 'insert' : item.action_type;
            });
            

            var arr_chk = _item;
            $scope.item_approver_active = [];
            $scope.item_approver_active.push(_item);
            apply();

            if (true) {
                clear_valid_items('approver-comment-' + arr_chk.seq);
                clear_valid_items('approver-status-' + arr_chk.seq);
            }

            if (action == 'submit') {

                if (arr_chk.action_status == 'reject') {
                    if (arr_chk.comment == '' || arr_chk.comment == null || arr_chk.comment == undefined) {
                        //set_alert('Warning', 'Please enter your comment'); 
                        if (set_valid_items(arr_chk.comment, 'approver-comment-' + arr_chk.seq)) { return; }
                    }
                }
                if (arr_chk.action_status == null) {
                    //set_alert('Warning', 'Please enter your status');
                    if (set_valid_items(arr_chk.action_status, 'approver-status-' + arr_chk.seq)) { return; }
                    return;
                }
            }

            save_data_approver(action);
        }

        function check_case_member_review() {

            if ($scope.data_header[0].pha_status == 12 || $scope.data_header[0].pha_status == 22) {
                $scope.action_to_review_type = true;
                return;
                if ($scope.data_session.length > 0) {
                    var icount = $scope.data_session.length - 1;
                    var id_session = $scope.data_session[icount].seq;
                    var arr_team = $filter('filter')($scope.data_memberteam, function (item) {
                        return ((item.id_session == id_session));
                    });
                    if (arr_team.length > 0) { $scope.submit_review = true; }
                }

                var icount = $scope.data_session.length - 1;
                if (!($scope.data_session[icount].action_to_review_type >= 1)) {
                    $scope.action_to_review_type = true;
                }
            }
        }

        $scope.stamp_flow_mail_to_member_show = function () {

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

        function set_valid_items(_item, field) {
            try {
                var id_valid = document.getElementById('valid-' + field);

                if (_item == '' || _item == null) {
                    id_valid.className = "feedback text-danger";
                    id_valid.focus();
                    return true;
                }
                else { id_valid.className = "invalid-feedback text-danger"; return false; }

            } catch (ex) { }
        }
        function clear_valid_items(field) {
            var id_valid = document.getElementById('valid-' + field);
            id_valid.className = "invalid-feedback text-danger";
        }
    }

    //check_data
    if (true) {
        //alert(1111);
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
        function check_data_session() {

            var pha_seq = $scope.data_header[0].seq;
            for (var i = 0; i < $scope.data_session.length; i++) {
                $scope.data_session[i].id = $scope.data_session[i].seq;
                $scope.data_session[i].id_pha = pha_seq;
                try {
                    $scope.data_session[0].meeting_date = $scope.data_session[0].meeting_date.toISOString().split('T')[0];
                } catch { }
                try {
                    //12/31/1969 7:55:00 PM 
                    var hh = $scope.data_session[i].meeting_start_time_hh; var mm = $scope.data_session[i].meeting_start_time_mm;
                    var valtime = "1970-01-01T" + (hh).substring(hh.length - 2) + ":" + (mm).substring(mm.length - 2) + ":00.000Z";

                    $scope.data_session[i].meeting_start_time = new Date(valtime);
                } catch { }
                try {
                    //12/31/1969 7:55:00 PM
                    var hh = $scope.data_session[i].meeting_end_time_hh; var mm = $scope.data_session[i].meeting_end_time_mm;
                    var valtime = "1970-01-01T" + (hh).substring(hh.length - 2) + ":" + (mm).substring(mm.length - 2) + ":00.000Z";
                    $scope.data_session[i].meeting_end_time = new Date(valtime);
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
        function check_data_approver() {

            var pha_seq = $scope.data_header[0].seq;
            for (var i = 0; i < $scope.data_approver.length; i++) {
                $scope.data_approver[i].id = $scope.data_approver[i].seq;
                $scope.data_approver[i].id_pha = pha_seq;
                $scope.data_approver[i].no = (i + 1);
            }

            var arr_active = [];
            angular.copy($scope.data_approver, arr_active);
            var arr_json = $filter('filter')(arr_active, function (item) {
                return ((!(item.user_name == null) && item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert');
            });
            for (var i = 0; i < $scope.data_approver_delete.length; i++) {
                $scope.data_approver_delete[i].action_type = 'delete';
                arr_json.push($scope.data_approver_delete[i]);
            }
            for (var i = 0; i < arr_active.length; i++) {
                if (arr_active[i].user_name == null) {
                    arr_active[i].action_type = 'delete';
                    arr_json.push(arr_active[i]);
                }
            }

            //check จากข้อมูลเดิมที่เคยบันทึกไว้ถ้าไม่มีในของเดิมให้ delete ออกด้วย
            for (var i = 0; i < $scope.data_approver_old.length; i++) {
                var arr_check = $filter('filter')($scope.data_approver, function (item) {
                    return (item.user_name == $scope.data_approver_old[i].user_name
                        && item.id_session == $scope.data_approver_old[i].id_session
                        && (item.action_type == 'insert' || item.action_type == 'update'));
                });
                if (arr_check.length == 0) {
                    $scope.data_approver_old[i].action_type = 'delete';
                    arr_json.push($scope.data_approver_old[i]);
                }
            }

            //check จากข้อมูล session ให้ delete ออกด้วย
            for (var i = 0; i < $scope.data_approver.length; i++) {
                var arr_check = $filter('filter')($scope.data_session, function (item) {
                    return (item.seq == $scope.data_approver[i].id_session || item.id == $scope.data_approver[i].id_session);
                });
                if (arr_check.length == 0) {
                    for (var l = 0; l < arr_check.length; l++) {
                        arr_check[l].action_type = 'delete';
                        arr_json.push(arr_check[l]);
                    }
                }
            }
            return angular.toJson(arr_json);
        }
        function check_data_relatedpeople_outsider() {

            $scope.data_relatedpeople_outsider.forEach(function(person) {
                if (person.user_displayname !== null && person.action_change === 1) {
                    person.action_type = 'update';
                }
            });

            var pha_seq = $scope.data_header[0].seq;
            for (var i = 0; i < $scope.data_relatedpeople_outsider.length; i++) {
                $scope.data_relatedpeople_outsider[i].id = $scope.data_relatedpeople_outsider[i].seq;
                $scope.data_relatedpeople_outsider[i].id_pha = pha_seq;
                $scope.data_relatedpeople_outsider[i].no = (i + 1);
                try {
                    $scope.data_relatedpeople_outsider[i].reviewer_date = $scope.data_relatedpeople_outsider[i].reviewer_date.toISOString().split('T')[0];
                } catch { $scope.data_relatedpeople_outsider[i].reviewer_date = null; }
            }
    
            var arr_active = [];
            angular.copy($scope.data_relatedpeople_outsider, arr_active);
            var arr_json = $filter('filter')(arr_active, function (item) {
                return ((item.action_type == 'update' && item.action_change == 1) || (item.action_type == 'insert' && item.action_change == 1));
            });
    
            if (true) {
                for (var i = 0; i < $scope.data_relatedpeople_outsider_delete.length; i++) {
                    $scope.data_relatedpeople_outsider_delete[i].action_type = 'delete';
                    arr_json.push($scope.data_relatedpeople_outsider_delete[i]);
                }
                for (var i = 0; i < arr_json.length; i++) {
                    if (arr_json[i].user_displayname == null
                        && arr_json[i].action_type != 'delete'
                    ) {
                        arr_json[i].action_type = 'delete';
                    }
                }
    
                
            }

            console.log("data_relatedpeople_outsider",arr_json)
    
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
            // remove hazard[]
            for (let i = 0; i < arr_json.length; i++) {
                delete arr_json[i].hazard;
                
            }
            return angular.toJson(arr_json);
        }

        function check_data_subareas() {

            var pha_seq = $scope.data_header[0].seq;

            for (var i = 0; i < $scope.data_subareas.length; i++) {
                $scope.data_subareas[i].id = Number($scope.data_subareas[i].seq);
                $scope.data_subareas[i].id_pha = pha_seq;
            }

            var arr_active = [];
            angular.copy($scope.data_subareas, arr_active);
            var arr_json = $filter('filter')(arr_active, function (item) {
                return ((item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert');
            });
            for (var i = 0; i < $scope.data_subareas_delete.length; i++) {
                $scope.data_subareas_delete[i].action_type = 'delete';
                arr_json.push($scope.data_subareas_delete[i]);
            }
            return angular.toJson(arr_json);
        }

        function check_data_subareas_list() {

            // delete
            for (var i = 0; i < $scope.data_subareas_delete.length; i++) {
                $scope.data_subareas_delete[i].action_type = 'delete';

                for (let j = 0; j < $scope.data_subareas_delete[i].hazard.length; j++) {
                    $scope.data_hazard_delete.push($scope.data_subareas_delete[i].hazard[j]);
                }
                // arr_json.push($scope.data_subareas_delete[i]);
            }

            var arr_json = $filter('filter')($scope.data_subareas_list, function (item) {
                return ((item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert');
            });
            // remove hazard[]
            var json_data = angular.copy(arr_json);
            for (let i = 0; i < json_data.length; i++) {
                delete json_data[i].hazard;
                
            }

            console.log('arr subareas json => ',(json_data))
            return angular.toJson(json_data);
        }
        
        function check_data_hazardList() {
            var hazardList = [];
            console.log('check_data_hazardList',$scope.data_subareas_list)
            for (var i = 0; i < $scope.data_subareas_list.length; i++) {
                for (let j = 0; j < $scope.data_subareas_list[i].hazard.length; j++) {
                    // if ($scope.data_subareas_list[i].hazard[j].id_subareas &&
                    //     $scope.data_subareas_list[i].hazard[j].id_type_hazard &&
                    //     $scope.data_subareas_list[i].hazard[j].id_health_hazard 
                    // ) {
                        hazardList.push($scope.data_subareas_list[i].hazard[j])
                    // }
                }
            }
            // sort no
            // for (let i = 0; i < hazardList.length; i++) {
            //    hazardList[i].no = i+1;
            // }

            var arr_json = $filter('filter')(hazardList, function (item) {
                return ((item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert');
            });
            // delete
            for (var i = 0; i < $scope.data_hazard_delete.length; i++) {
                $scope.data_hazard_delete[i].action_type = 'delete';
                arr_json.push($scope.data_hazard_delete[i]);
            }
            console.log('arr hazard json => ',(arr_json))
            return angular.toJson(arr_json);
        }

        function check_data_hazard() {

            var pha_seq = $scope.data_header[0].seq;

            for (var i = 0; i < $scope.data_hazard.length; i++) {
                $scope.data_hazard[i].id = Number($scope.data_hazard[i].seq);
                $scope.data_hazard[i].id_pha = pha_seq;
            }

            var arr_active = [];
            angular.copy($scope.data_hazard, arr_active);
            var arr_json = $filter('filter')(arr_active, function (item) {
                return ((item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert');
            });
            for (var i = 0; i < $scope.data_hazard_delete.length; i++) {
                $scope.data_hazard_delete[i].action_type = 'delete';
                arr_json.push($scope.data_hazard_delete[i]);
            }

            return angular.toJson(arr_json);
        }

        function check_data_tasks() {
            var descriptionList = [];

            for (var i = 0; i < $scope.data_tasks.length; i++) {
                if ($scope.data_tasks[i].id_worker_group) {
                    descriptionList.push($scope.data_tasks[i])
                }
            }
            // sort
            for (var i = 0; i < descriptionList.length; i++) {
                descriptionList[i].no = i+1;
                descriptionList[i].index_rows = i;

                for (let j = 0; j < descriptionList[i].descriptions.length; j++) {
                    descriptionList[i].descriptions[j].index_rows = i;
                }
            }

            var arr_json = $filter('filter')(descriptionList, function (item) {
                return ((item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert');
            });
            // delete
            for (var i = 0; i < $scope.data_tasks_delete.length; i++) {
                $scope.data_tasks_delete[i].action_type = 'delete';
                arr_json.push($scope.data_tasks_delete[i]);
            }
            console.log('arr task json => ',(arr_json))
            return angular.toJson(arr_json);
        }

        function check_data_descriptions() {
            var taskList = [];
            var descriptionList = [];

            for (var i = 0; i < $scope.data_tasks.length; i++) {
                if ($scope.data_tasks[i].id_worker_group) {
                    taskList.push($scope.data_tasks[i])
                }
            }
            // sort
            for (var i = 0; i < taskList.length; i++) {
                taskList[i].no = i+1;
                taskList[i].index_rows = i;

                taskList[i].descriptions = $filter('filter')(taskList[i].descriptions, function (item) {
                    return (item.descriptions);
                });

                for (let j = 0; j < taskList[i].descriptions.length; j++) {
                    taskList[i].descriptions[j].index_rows = i;
                    taskList[i].descriptions[j].no = j+1;
                    descriptionList.push(taskList[i].descriptions[j]);
                }
            }

            var arr_json = $filter('filter')(descriptionList, function (item) {
                return ((item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert');
            });
            // delete
            for (var i = 0; i < $scope.data_descriptions_delete.length; i++) {
                $scope.data_descriptions_delete[i].action_type = 'delete';
                arr_json.push($scope.data_descriptions_delete[i]);
            }
            console.log('arr descriptions json all => ',(descriptionList))
            console.log('arr descriptions json => ',(arr_json))
            return angular.toJson(arr_json);
        }
        // function check_data_tasks() {

        //     var pha_seq = $scope.data_header[0].seq;

        //     for (var i = 0; i < $scope.data_tasks.length; i++) {
        //         $scope.data_tasks[i].id = Number($scope.data_tasks[i].seq);
        //         $scope.data_tasks[i].id_pha = pha_seq;
        //     }

        //     var arr_active = [];
        //     angular.copy($scope.data_tasks, arr_active);
        //     var arr_json = $filter('filter')(arr_active, function (item) {
        //         return ((item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert');
        //     });
        //     for (var i = 0; i < $scope.data_tasks_delete.length; i++) {
        //         $scope.data_tasks_delete[i].action_type = 'delete';
        //         arr_json.push($scope.data_tasks_delete[i]);
        //     }

        //     return angular.toJson(arr_json);
        // }
        function check_data_workers() {
            var workerList = [];
            console.log('workerList',$scope.data_tasks)
            for (var i = 0; i < $scope.data_tasks.length; i++) {

                for (let j = 0; j < $scope.data_tasks[i].worker_list.length; j++) {

                    if (($scope.data_tasks[i].worker_list[j].action_type == 'update' && $scope.data_tasks[i].worker_list[j].action_change == 1) 
                        || $scope.data_tasks[i].worker_list[j].action_type == 'insert'
                    ) {
                        console.log('if',)
                        workerList.push($scope.data_tasks[i].worker_list[j])
                    }
                }
            }
            console.log('arr worker json => ',(workerList))
            return angular.toJson(workerList);
        }

        // function check_data_workers() {
        //     var pha_seq = $scope.data_header[0].seq;
        //     for (var i = 0; i < $scope.data_workers.length; i++) {
        //         $scope.data_workers[i].id = Number($scope.data_workers[i].seq);
        //         $scope.data_workers[i].id_pha = pha_seq;
        //     }
        //     var arr_active = [];
        //     angular.copy($scope.data_workers, arr_active);
        //     var arr_json = $filter('filter')(arr_active, function (item) {
        //         return ((item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert');
        //     });
        //     for (var i = 0; i < $scope.data_workers_delete.length; i++) {
        //         $scope.data_workers_delete[i].action_type = 'delete';
        //         arr_json.push($scope.data_workers_delete[i]);
        //     }
        //     return angular.toJson(arr_json);
        // }

        function check_data_worksheet_list(flow_action) {
            var ws = [];      
            if ($scope.master_header.pha_status > 11 || flow_action == 'submit_without') {
                for (let i = 0; i < $scope.data_worksheet_list.length; i++) {
                    for (let j = 0; j < $scope.data_worksheet_list[i].worksheet.length; j++) {
                        ws.push( $scope.data_worksheet_list[i].worksheet[j] );
                    }
                }

                for (let i = 0; i < ws.length; i++) {
                    // delete ws[i].action_change;
                    if (ws[i].action_type == 'new') {
                        ws[i].action_type = 'insert'
                    }
                    
                }
            }

            var arr_json = $filter('filter')(ws, function (item) {
                return ((item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert');
            });

            // var arr_json = $filter('filter')(arr.hazards, function (item) {
            //     return (item.sub_area && type_hazard && health_hazard );
            // });
            // var arr_json = [];
            // for (let i = 0; i < arr.length; i++) {
            //     for (let j = 0; j < arr[i].hazards.length; j++) {
            //         if (arr[i].hazards[j].sub_area && arr[i].hazards[j].type_hazard && arr[i].hazards[j].health_hazard) {
            //             arr_json.push(arr[i])
            //         }
            //     }
            // }
            // remove key
            // for (let i = 0; i < arr_json.length; i++) {
            //     delete arr_json[i].tasks;
            //     delete arr_json[i].hazards;
            //     delete arr_json[i].descriptions;
                
            // }

            // var new_worksheet = [];
            // var counter = 0; 
            // worksheet_list = $scope.data_worksheet_list;
            
            // for (let i = 0; i < worksheet_list.length; i++) {
    
            //     for (let j = 0; j < worksheet_list[i].hazards.length; j++) {
            //         $scope.MaxSeqdataWorksheet = Number($scope.MaxSeqdataWorksheet) + 1;
            //         var xValues = $scope.MaxSeqdataWorksheet;
            //         new_worksheet.push(angular.copy($scope.data_worksheet_def[0]));
            //         new_worksheet[counter].id = xValues;
            //         new_worksheet[counter].seq = xValues;
            //         new_worksheet[counter].action_change = 1;
            //         new_worksheet[counter].action_status = 'Open';
            //         new_worksheet[counter].action_type = 'insert';
            //         new_worksheet[counter].id_tasks =  worksheet_list[i].seq == undefined ? null : worksheet_list[i].seq;
            //         new_worksheet[counter].seq_tasks = worksheet_list[i].seq == undefined ? null : worksheet_list[i].seq;
            //         new_worksheet[counter].tasks_no = worksheet_list[i].no == undefined ? null : worksheet_list[i].no;
            //         new_worksheet[counter].no = worksheet_list[i].hazards[j].no == undefined ? null : worksheet_list[i].hazards[j].no;
            //         new_worksheet[counter].subarea_no = worksheet_list[i].hazards[j].no_subareas == undefined ? null : worksheet_list[i].hazards[j].no_subareas;
            //         new_worksheet[counter].id_hazard = worksheet_list[i].hazards[j].seq == undefined ? null : worksheet_list[i].hazards[j].seq;
            //         new_worksheet[counter].seq_hazard = worksheet_list[i].hazards[j].seq == undefined ? null : worksheet_list[i].hazards[j].seq;
            //         new_worksheet[counter].id_pha = worksheet_list[i].hazards[j].id_pha == undefined ? null : worksheet_list[i].hazards[j].id_pha;
            //         new_worksheet[counter].index_rows = counter;
            //         new_worksheet[counter].effective = worksheet_list[i].hazards[j].effective == undefined ? null : worksheet_list[i].hazards[j].effective;
            //         new_worksheet[counter].exposure_band = worksheet_list[i].hazards[j].exposure_band == undefined ? null : worksheet_list[i].hazards[j].exposure_band;
            //         new_worksheet[counter].exposure_rating = worksheet_list[i].hazards[j].exposure_rating == undefined ? null : worksheet_list[i].hazards[j].exposure_rating;
            //         new_worksheet[counter].hierarchy_of_control = worksheet_list[i].hazards[j].hierarchy_of_control == undefined ? null : worksheet_list[i].hazards[j].hierarchy_of_control;
            //         new_worksheet[counter].id_exposure_level = worksheet_list[i].hazards[j].id_exposure_level == undefined ? null : worksheet_list[i].hazards[j].id_exposure_level;
            //         new_worksheet[counter].id_exposure_rating = worksheet_list[i].hazards[j].id_exposure_rating == undefined ? null : worksheet_list[i].hazards[j].id_exposure_rating;
            //         new_worksheet[counter].id_frequency_level = worksheet_list[i].hazards[j].id_frequency_level == undefined ? null : worksheet_list[i].hazards[j].id_frequency_level;
            //         new_worksheet[counter].initial_risk_rating = worksheet_list[i].hazards[j].initial_risk_rating == undefined ? null : worksheet_list[i].hazards[j].initial_risk_rating;
            //         new_worksheet[counter].residual_risk_rating = worksheet_list[i].hazards[j].residual_risk_rating == undefined ? null : worksheet_list[i].hazards[j].residual_risk_rating;
            //         new_worksheet[counter].recommendations_no = counter;
            //         new_worksheet[counter].recommendations = worksheet_list[i].hazards[j].recommendations == undefined ? null : worksheet_list[i].hazards[j].recommendations;
            //         new_worksheet[counter].standard_unit = worksheet_list[i].hazards[j].standard_unit == undefined ? null : worksheet_list[i].hazards[j].standard_unit;
            //         new_worksheet[counter].standard_value = worksheet_list[i].hazards[j].standard_value == undefined ? null : worksheet_list[i].hazards[j].standard_value;
            //         new_worksheet[counter].tlv_standard = worksheet_list[i].hazards[j].tlv_standard == undefined ? null : worksheet_list[i].hazards[j].tlv_standard;
            //         counter++;  
            //     }
                
            // }

            // if (flow_action != 'submit_without') {
            //     return angular.toJson(new_worksheet);
            // }

            console.log('--------------------------------------')
            console.log(' ws',ws)
            console.log('arr_json worksheet',arr_json)
            console.log('--------------------------------------')
            // var arr_json = $filter('filter')(new_worksheet, function (item) {
            //     return ((item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert');
            // });
            return angular.toJson(arr_json);
        }

        function check_data_worksheet() {

            var pha_status = $scope.data_header[0].pha_status;
            var pha_seq = $scope.data_header[0].seq;


            for (var i = 0; i < $scope.data_worksheet.length; i++) {
                $scope.data_worksheet[i].id = Number($scope.data_worksheet[i].seq);
                $scope.data_worksheet[i].id_pha = pha_seq;
    
                try {
                    if (!$scope.data_worksheet[i].estimated_start_date) {
                        var today = new Date();
                        var start_date_utc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
                        $scope.data_worksheet[0].estimated_start_date = start_date_utc.toISOString().split('T')[0];
                    } else {
                        var start_date = new Date($scope.data_worksheet[i].estimated_start_date);
                        if (!isNaN(start_date.getTime())) {
                            var start_date_utc = new Date(Date.UTC(start_date.getFullYear(), start_date.getMonth(), start_date.getDate()));
                            $scope.data_worksheet[i].estimated_start_date = start_date_utc.toISOString().split('T')[0];
                        }
                    }
                } catch (error) {} 
                try {
                    if ($scope.data_worksheet[i].estimated_start_date !== null) {
                        var end_date = new Date($scope.data_worksheet[i].estimated_end_date);
                        if (!isNaN(end_date.getTime())) { 
                            var end_date_utc = new Date(Date.UTC(end_date.getFullYear(), end_date.getMonth(), end_date.getDate()));
                            $scope.data_worksheet[i].estimated_end_date = end_date_utc.toISOString().split('T')[0];
                        }
                    } else {}
                } catch (error) {}     
            }

            var arr_active = [];
            angular.copy($scope.data_worksheet, arr_active);
            var arr_json = $filter('filter')(arr_active, function (item) {
                return ((item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert');
            });
            for (var i = 0; i < $scope.data_worksheet_delete.length; i++) {
                $scope.data_worksheet_delete[i].action_type = 'delete';
                arr_json.push($scope.data_worksheet_delete[i]);
            }

            return angular.toJson(arr_json);
        }
        function check_data_drawingwapprover(id_session) {

            var pha_seq = $scope.data_header[0].seq;

            for (var i = 0; i < $scope.data_drawing_approver.length; i++) {
                $scope.data_drawing_approver[i].id = Number($scope.data_drawing_approver[i].seq);
                $scope.data_drawing_approver[i].id_pha = pha_seq;
            }

            var arr_active = [];
            angular.copy($scope.data_drawing_approver, arr_active);
            var arr_json = $filter('filter')(arr_active, function (item) {
                return (
                    ((item.action_type == 'update' && item.action_change == 1)
                        || (item.action_type == 'insert' && item.action_change == 1))
                    && item.id_session == id_session
                );
            });

            //ข้อมูลที่ delete อยู่ใน data_drawing_approver ไม่ได้เก็บไว้ใน data_drawing_approver_delete
            //ต้องไปปรับ $scope.removeDataWorksheetDrawing 
            for (var i = 0; i < $scope.data_drawing_approver_delete.length; i++) {
                if ($scope.data_drawing_approver_delete[i].id_session == id_session) {
                    $scope.data_drawing_approver_delete[i].action_type = 'delete';
                    arr_json.push($scope.data_drawing_approver_delete[i]);
                }
            }

            return angular.toJson(arr_json);
        }
    }

    //set data
    if(true){
        function set_data_managerecom() {

            if (true) {
                var arr_worksheet = $scope.data_worksheet;
                for (var w = 0; w < arr_worksheet.length; w++) {
    
                    //recommendations_no
                    arr_worksheet[w].recommendations_no = (arr_worksheet[w].recommendations_no == null ? arr_worksheet[w].taskdesc_no : null);
    
                    //Estimated Date  
                    try {
                        if (arr_worksheet[w].estimated_start_date !== null) {
                            const x = (arr_worksheet[w].estimated_start_date.split('T')[0]).split("-");
                            if (x[0] > 2000) {
                                arr_worksheet[w].estimated_start_date = new Date(x[0], x[1] - 1, x[2]);
                            }
                        }
                    } catch { }
                    try {
                        if (arr_worksheet[w].estimated_end_date !== null) {
                            const x = (arr_worksheet[w].estimated_end_date.split('T')[0]).split("-");
                            if (x[0] > 2000) {
                                arr_worksheet[w].estimated_end_date = new Date(x[0], x[1] - 1, x[2]);
                            }
                        }
                    } catch { }
    
                }
            }
    
        }
    }

    //set_alert
    if (true) {
        function set_alert(header, detail) {
            $scope.Action_Msg_Header = header;
            $scope.Action_Msg_Detail = detail;
            $('#modalMsg').modal('show');
        }

        function set_alert_confirm(header, detail) {
            $scope.Action_Msg_Confirm = true;
            $scope.Action_Msg_Header = header;
            $scope.Action_Msg_Detail = detail;
            $('#modalMsg').modal('show');
        }
    }

    //Update Action Type null to Update 
    if (true) {
        $scope.actionChange = function (_arr, _seq, type_text) {

            if (type_text == "meeting_date") {
                if ($scope.data_general[0].target_start_date == null) {
                    $scope.data_general[0].target_start_date = _arr.meeting_date;
                }

                var arr_copy_def = angular.copy($scope.data_session, arr_copy_def);
                var icount = $scope.data_session.length - 1;
                var id_session = $scope.data_session[icount].seq;
                var arr_check = $filter('filter')(arr_copy_def, function (item) {
                    return (item.seq == id_session && item.action_new_row == 0);
                });
                if (arr_check.length > 0) {
                    arr_check[0].action_new_row = 1;
                    $scope.data_general[0].target_start_date = _arr.meeting_date;
                }
            }

            if (type_text == "meeting_date") { }
            if (type_text == "unit_no") {

                //update id_apu ด้วย 
                //$scope.data_general[0].id_apu = _arr;

                console.log("==> _arr",_arr)
                var arrText = $filter('filter')($scope.master_unit_no, function (item) {
                    return (item.id == _arr.id_unit_no);
                });
                if (arrText.length > 0) {
                    $scope.selectedBusiness_Unit = arrText[0].name;
                }
            }
            if(type_text == "apu"){
               //update id_apu ด้วย 
                $scope.data_general[0].id_apu = _arr.id_apu;

                $scope.master_toc_list = $scope.master_toc.filter(item => item.id_apu === _arr.id_apu);

                var master = $scope.master_unit_no.filter(item => 
                    item.id_apu === _arr.id_apu && 
                    $scope.master_toc_list.some(toc => toc.id === item.id_plant_area)
                );



                console.log("update ap",$scope.data_general)
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",)
                $scope.master_unit_no_list = angular.copy(master);

            }
            if (type_text == "sub_area") {
                var arrText = $filter('filter')($scope.master_subarea_location, function (item) {
                    return (item.id == _arr.id_sub_area);
                });
                if (arrText.length > 0) {
                    _arr.work_of_task = arrText[0].descriptions;
                    _arr.sub_area = arrText[0].name;
                    _arr.action_change = 1;
                    // set no_subareas for children hazard
                    for (let i = 0; i < _arr.hazard.length; i++) {
                        _arr.hazard[i].action_change = 1;
                        _arr.hazard[i].id_subareas = _arr.id_sub_area;
                        _arr.hazard[i].sub_area = _arr.sub_area;
                        _arr.hazard[i].work_of_task = _arr.work_of_task;
                    }
                }
                
            }
            if (type_text == "type_hazard") {
                var arrText = $filter('filter')($scope.master_hazard_type, function (item) {
                    return (item.id == _arr.id_type_hazard);
                });
                if (arrText.length > 0) {
                    _arr.type_hazard = arrText[0].name;
                    _arr.action_change = 1;
                }
            }
            if (type_text == "health_hazard") {
                var arrText = $filter('filter')($scope.master_hazard_riskfactors, function (item) {
                    return (item.id == _arr.id_health_hazard);
                });
                if (arrText.length > 0) {
                    _arr.health_hazard = arrText[0].name;
                    _arr.health_effect_rating = arrText[0].hazards_rating;
                    _arr.tlv_std = arrText[0].tlv_standard;
                    _arr.action_change = 1;
                }
                $scope.chooseRiskRating(_arr);
            } 

            if (type_text == "worker_group") {
                var arrText = $filter('filter')($scope.master_worker_group, function (item) {
                    return (item.id == _arr.id_worker_group);
                });
                if (arrText.length > 0) {
                    _arr.worker_group = arrText[0].name;
                }

                //employee in worker group --> set to workers
                if (true) {

                    //clear data_workers by id_worker_group
                    $scope.data_workers = $filter('filter')($scope.data_workers, function (item) {
                        return (!(item.id_tasks == _arr.id));
                    });
                    $scope.data_workers = $filter('filter')($scope.data_workers, function (item) {
                        return (!(item.action_type == 'new'));
                    });

                    var arrWorkerList = $filter('filter')($scope.master_worker_list, function (item) {
                        return (item.id_worker_group == _arr.id_worker_group);
                    });
                    if (arrWorkerList.length > 0) {

                        //add to data_workers
                        for (var i = 0; i < arrWorkerList.length; i++) {
                            var result = arrWorkerList[i];
                            add_workers(_arr.id_worker_group, _arr.id, 0, result.user_name, result.user_displayname);
                        }
                    }
                }

                _arr.numbers_of_workers = arrWorkerList.length;

                // custom descirption
                // _arr.descriptions.forEach(element => {
                //     element.id_tasks = _arr.seq;
                // });
                // console.log('item ',_arr)
            }
            if (type_text == "descriptions") {
               
            }
            if (type_text == "work_or_task") {
                _arr.action_change = 1;
            }

            action_type_changed(_arr, _seq);

            apply();
        }

        $scope.actionChangeWorkGroup = function (item) {
            var list = $filter('filter')($scope.master_worker_group, function (_item) {
                return (_item.id == item.id_worker_group);
            })[0];

            var workerList = $filter('filter')($scope.master_worker_list, function (_item) {
                return (_item.id_worker_group == item.id_worker_group);
            });
            // set task
            if (list) {
                item.worker_list = workerList;
                item.worker_group = list.name;
                item.action_change = 1;
            }
            // set descriptions
            item.numbers_of_workers = workerList.length;
            //will set user to data_workers  =====>>>>>> Bug มัน reset อันเดิม ที่เคยเลือก
            var arr_items = $filter('filter')($scope.data_workers, function (item) {
                return (item.id == item.seq);
            });

            arr_items.forEach(item => {
                if (item.worker_list && Array.isArray(item.worker_list)) {
                    item.worker_list.forEach(worker => {
                        let seq = $scope.MaxSeqdataWorkers;

                        // Create a new user detail object with the necessary properties
                        let newInput = clone_arr_newrow($scope.data_workers_def)[0];
                        newInput.seq = seq;
                        newInput.id = seq;
                        newInput.no = 0;
                        newInput.id_session = Number(item.seq);
                        newInput.action_type = 'insert';
                        newInput.action_change = 1;

                        // Add the user details
                        newInput.user_name = worker.user_name;
                        newInput.user_displayname = worker.user_displayname;
                        newInput.user_type = worker.user_type;

                        // Push the newInput to the data_workers array
                        $scope.data_workers.push(newInput);
                    });
                }
            });
            // console.log("Updated data_workers", $scope.data_workers);
            console.log("Updated worker group", item);
        }

        $scope.actionChangeSubArae = function (item) {
            console.log(item)
            item.hazard.forEach(element => {
                element.sub_area = item.sub_area;
                element.action_change = 1;
                element.action_type = 'update';
            });
        }

        $scope.actionChangeWorksheet = function (_arr, _seq, type_text) {

            //if (_arr.recommendations == null || _arr.recommendations == '') {
            //    if (_arr.recommendations_no == null || _arr.recommendations_no == '') {
            //        //recommendations != '' ให้ running action no  
            //        var arr_copy_def = angular.copy($scope.data_worksheet, arr_copy_def);
            //        arr_copy_def.sort((a, b) => Number(b.recommendations_no) - Number(a.recommendations_no));
            //        var recommendations_no = Number(Number(arr_copy_def[0].recommendations_no) + 1);
            //        _arr.recommendations_no = recommendations_no;
            //    }
            //}
            action_type_changed(_arr, _seq);

            if (type_text == "activity") {
                var arrText = $filter('filter')($scope.master_activities, function (item) {
                    return (item.id == _arr.id_activity);
                });
                if (arrText.length > 0) {
                    _arr.activity = arrText[0].name;
                }
            }
            if (type_text == "frequency_level") {
                var arrText = $filter('filter')($scope.master_frequency_level, function (item) {
                    return (item.id == _arr.id_frequency_level);
                });
                if (arrText.length > 0) {
                    _arr.frequency_level = arrText[0].name;
                }
                calulateExposureRating(_arr);
            }
            if (type_text == "exposure_level") {
                var arrText = $filter('filter')($scope.master_exposure_level, function (item) {
                    return (item.id == _arr.id_exposure_level);
                });
                if (arrText.length > 0) {
                    _arr.exposure_level= arrText[0].name;
                }
                calulateExposureRating(_arr); 
            }


            //check action submit
            if (true) {
                var arr_submit = $filter('filter')($scope.data_worksheet, function (item) {
                    return ((item.action_type !== '' || item.action_type !== null));
                });
                if (arr_submit.length > 0) { $scope.submit_type = true; } else { $scope.submit_type = false; }
            }

            apply();
        }

        function action_type_changed(_arr, _seq) {

            if (_seq == undefined) { _seq = 1; }
            if (_arr.seq == _seq && _arr.action_type == '') {
                _arr.action_type = 'update';
                _arr.action_change = 1;
                _arr.update_by = $scope.user_name;
            } else if (_arr.seq == _seq && _arr.action_type == 'update') {
                _arr.action_change = 1;
                _arr.update_by = $scope.user_name;
            } else {
                _arr.action_change = 1;
                _arr.update_by = $scope.user_name;
            }

            apply();
        }

        $scope.actionChangeFrequencyLevel = function (item) {
            processExposureRating(item)
        }

    }

    //functioin show history data ของแต่ละ field
    if (true) {
        $scope.filteredArr = [{ name: '', isActive: true }];
        $scope.filteredResults = [];
        $scope.showResults = false;
        $scope.filterResultGeneral = function (fieldText, fieldName) {

            console.log(fieldText,fieldName)
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
            //เพิ่มfor work or task
            else if (fieldName == 'work_or_task') {
                arr = $scope.data_all.his_work_or_task;

                console.log("arr",arr)
            }

            var count = 0;

            if (Array.isArray(arr)) { 
                arr.some(function(result) {
                    if (result.name.toLowerCase().startsWith(fieldText.toLowerCase())) {
                        $scope.filteredResults.push({ "field": fieldName, "name": result.name });
                        count++;
                    }
                    return count >= 10; 
                });
            }

            $scope.showResults = $scope.filteredResults.length > 0;

            if ($scope.data_general[0].action_type == '') {
                action_type_changed($scope.data_general, $scope.data_general[0].seq);
            }
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
    }


    $(document).ready(function () {
        page_load();
    });


    //Popup Employee List Employee
    if (true) {
        $scope.filteredData = [];
        $scope.selectedData = {};
        $scope.addnewFreebox = function (item, index, action_type) {

            var seq_session = $scope.selectdata_session;
            var xformtype = $scope.selectDatFormType;
    
            //add new employee 
            var seq = $scope.MaxSeqdata_relatedpeople_outsider;
            var iNo = $scope.data_relatedpeople_outsider.length
    
            var newInput = clone_arr_newrow($scope.data_relatedpeople_outsider_def)[0];
            newInput.seq = seq;
            newInput.id = seq;
            newInput.no = iNo + 1;
            newInput.id_session = Number(seq_session);
            newInput.action_type = 'insert';
            newInput.action_change = 0;
    
            newInput.approver_type = 'member';
            newInput.user_type = xformtype;
            newInput.user_name = null;
            newInput.user_displayname = null;
            newInput.user_title = null;
            newInput.user_img = null;
    
            $scope.data_relatedpeople_outsider.push(newInput);
    
            running_no_level1($scope.data_relatedpeople_outsider, iNo, null);

            $scope.MaxSeqdata_relatedpeople_outsider = Number($scope.MaxSeqdata_relatedpeople_outsider) + 1
        };

        $scope.updateSelectedItems = function () {
            $scope.selectedData = $scope.employeelist.filter(function (item) {
                return item.selected;
            });
        };

        $scope.selectedItems = function (item) {
            $scope.selectedData = item;
        };

        $scope.openDataEmployeeAdd = function (item, form_type) {
            $scope.selectedData = item;
            $scope.selectdata_session = item.seq;
            $scope.selectDatFormType = form_type;//member, approver, owner
            $scope.employeelist_show = [];
            $scope.searchText = '';

            if($scope.selectDatFormType == 'worker')
                $scope.data_worker_list = item.worker_list

            apply();
            console.log('selectDatFormType ',$scope.selectDatFormType)
            $('#modalEmployeeAdd').modal({
                backdrop: 'static',
                keyboard: false 
            }).modal('show');
        };

        $scope.fillterDataEmployeeAdd = function (type) {
            $scope.employeelist_show = [];
            var searchIndicator = $scope.searchIndicator.text;
            if (!searchIndicator) { return; }
        
            var items = angular.copy($scope.employeelist_def, items);
        
            if (searchIndicator.length < 3) { return items; }
            
            if (searchIndicator.length > 4 && /\W+/.test(searchIndicator)) {
                var parts = searchIndicator.split(/\W+/);
                var searchIndicator = parts.join('');
            }
           
            getEmployees(searchIndicator, function(data) {
                data.employee.forEach(function(employee) {
                    employee.isAdded = false; 
                });
        
                $scope.employeelist_page = data.employee;
                $scope.totalItems = $scope.employeelist_page.length; // Update totalItems
                $scope.employeelist_show = $scope.getPaginatedItems();
                
                // Calculate total pages
                $scope.totalPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
        
                apply();
        
                $('#modalEmployeeAdd').modal({
                    backdrop: 'static',
                    keyboard: false 
                }).modal('show');
            });
        };
    
        function getEmployees( indicator, callback){
            $.ajax({
                url: url_ws + "Flow/employees_search",
                data: '{"user_indicator":"' + indicator + '"'
                    + ',"max_rows":"50"'
                    + '}',
                type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
                beforeSend: function () {
                    $("#divLoading").show();
                },
                complete: function () {
                    $("#divLoading").hide();
                },
                success: function (data) {
                    callback(data); 
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

        $scope.currentPage = 1;
        $scope.itemsPerPage = 10; // Set the desired number of items per page
        

        $scope.getPaginatedItems = function() {
            var begin = ($scope.currentPage - 1) * $scope.itemsPerPage;
            var end = begin + $scope.itemsPerPage;
            
            $scope.loadingData = true; 
            setTimeout(function() {
                $scope.loadingData = false;
                $scope.$apply(); 
            }, 2000);
        
            var paginatedItems = $scope.employeelist_page.slice(begin, end);
            
            return paginatedItems;
        };
        

        $scope.setPage = function(page) {
            $scope.currentPage = page;
            $scope.employeelist_show = $scope.getPaginatedItems();
        };

        $scope.action_changepage = function(action) {
            switch (action) {
                case 'prevPage':
                    if ($scope.currentPage > 1) {
                        $scope.setPage($scope.currentPage - 1);
                    }
                    break;
                case 'nextPage':
                    if ($scope.currentPage < $scope.totalPages) {
                        $scope.setPage($scope.currentPage + 1);
                    }
                    break;
            }
        };    


    $scope.choosDataEmployee = function (item) {

            var id = item.id;
            var employee_name = item.employee_name;
            var employee_displayname = item.employee_displayname;
            var employee_email = item.employee_email;
            var employee_position = item.employee_position;
            var employee_img = item.employee_img;

            var seq_session = $scope.selectdata_session;
            var xformtype = $scope.selectDatFormType;

            console.log("item",item)

            if (xformtype == "member") {

                var arr_items = $filter('filter')($scope.data_memberteam, function (item) {
                    return (item.id_session == seq_session && item.user_name == employee_name);
                });

                console.log("arr_items",arr_items)
                if (arr_items.length == 0) {

                    //add new employee 
                    var seq = $scope.MaxSeqDataMemberteam;

                    var newInput = clone_arr_newrow($scope.data_memberteam_def)[0];
                    newInput.seq = seq;
                    newInput.id = seq;
                    newInput.no = (0);
                    newInput.id_session = Number(seq_session);
                    newInput.action_type = 'insert';
                    newInput.action_change = 1;

                    newInput.user_name = employee_name;
                    newInput.user_displayname = employee_displayname;
                    newInput.user_title = employee_position;
                    newInput.user_img = employee_img;

                    $scope.data_memberteam.push(newInput);
                    running_no_level1($scope.data_memberteam, null, null);

                    $scope.MaxSeqDataMemberteam = Number($scope.MaxSeqDataMemberteam) + 1

                }

            }
            else if (xformtype == "approver") {

                var arr_items_all = $filter('filter')($scope.data_approver, function (item) {
                    return (item.id_session == seq_session && item.user_displayname != null);
                });
                var arr_items = $filter('filter')($scope.data_approver, function (item) {
                    return (item.id_session == seq_session && item.user_name == employee_name);
                });

                if (arr_items.length == 0) {

                    //add new employee to approve list ได้รายการเดียว 
                    var seq = $scope.MaxSeqdataApprover;

                    var newInput = clone_arr_newrow($scope.data_approver_def)[0];
                    newInput.seq = seq;
                    newInput.id = seq;
                    newInput.no = (0);
                    newInput.id_session = Number(seq_session);
                    newInput.action_type = 'insert';
                    newInput.action_change = 1;

                    //approver or section_head
                    newInput.approver_type = (arr_items_all.length == 0 ? 'section_head' : 'approver');

                    newInput.user_name = employee_name;
                    newInput.user_displayname = employee_displayname;
                    newInput.user_title = employee_position;
                    newInput.user_img = employee_img;

                    $scope.data_approver.push(newInput);
                    running_no_level1($scope.data_approver, null, null);

                    newInput.no == 0 ? newInput.verified = true : newInput.verified = false;
                    $scope.MaxSeqdataApprover = Number($scope.MaxSeqdataApprover) + 1

                    $scope.data_approver.sort(function(a, b) {
                        if (a.approver_type === "section_head") return -1;
                        if (b.approver_type === "section_head") return 1;
                        return 0;
                    });

                    console.log('data_approver ',$scope.data_approver)

                    
                }

            }
            else if (xformtype == "worker") {
                // var arr_items = $filter('filter')($scope.data_workers, function (item) {
                //     return (item.id_session == seq_session && item.user_name == employee_name);
                // });

                // if (arr_items.length == 0) {
                //     var seq = $scope.MaxSeqdataWorkers;
                //     var newInput = clone_arr_newrow($scope.data_workers_def)[0];
                //     newInput.seq = seq;
                //     newInput.id = seq;
                //     newInput.no = (0);
                //     newInput.id_session = Number(seq_session);
                //     newInput.action_type = 'insert';
                //     newInput.action_change = 1;

                //     newInput.user_name = employee_name;
                //     newInput.user_displayname = employee_displayname;
                //     newInput.user_title = employee_position;
                //     newInput.user_img = employee_img;

                //     $scope.data_workers.push(newInput);
                //     running_no_level1($scope.data_workers, null, null);

                //     $scope.MaxSeqdataWorkers = Number($scope.MaxSeqdataWorkers + 1);
                // }

                var tasks = $filter('filter')($scope.data_tasks, function (item) {
                    return (item.seq == seq_session);
                })[0];

                if (tasks) {
                    $scope.MaxSeqdataWorkers = Number($scope.MaxSeqdataWorkers) + 1
                    var seq_worker =  $scope.MaxSeqdataWorkers;
                    var newInput = clone_arr_newrow($scope.data_workers_def)[0];
                    newInput.seq = seq_worker;
                    newInput.id = seq_worker;
                    newInput.index_rows = tasks.index_rows;
                    newInput.no = tasks.worker_list.no ? tasks.worker_list.no + 1 : tasks.worker_list.length + 1;
                    newInput.id_session = Number(tasks.seq);
                    newInput.id_tasks = Number(tasks.seq);
                    newInput.id_pha = Number(tasks.id_pha);
                    newInput.action_type = 'insert';
                    newInput.action_change = 1;
                    newInput.user_name = employee_name;
                    newInput.user_displayname = employee_displayname;
                    newInput.user_title = employee_position;
                    newInput.user_img = employee_img;

                    tasks.worker_list.push(newInput);

                    tasks.numbers_of_workers = tasks.worker_list.length;
                }
                console.log('Add Worker ', newInput)
                console.log('Add tasks ', tasks)
                console.log('Add tasks All ',  $scope.data_tasks)
            }
            else if (xformtype == "manage") {
                var data =  $scope.selectedData;

                if(!data) return;

                data.responder_user_displayname = employee_displayname
                data.responder_action_type = employee_position
                data.responder_user_email = employee_email
                data.responder_user_name = employee_name
                data.responder_user_img = employee_img
                data.responder_user_id = id
                data.action_change = 1;
                /*var arr_items = $filter('filter')($scope.data_workers, function (item) {
                    return (item.id_session == seq_session && item.user_name == employee_name);
                });*/

                // if (arr_items.length == 0) {
                //     var seq = $scope.MaxSeqdataWorkers;

                //     var newInput = clone_arr_newrow($scope.data_workers_def)[0];
                //     newInput.seq = seq;
                //     newInput.id = seq;
                //     newInput.no = (0);
                //     newInput.id_session = Number(seq_session);
                //     newInput.action_type = 'insert';
                //     newInput.action_change = 1;

                //     newInput.user_name = employee_name;
                //     newInput.user_displayname = employee_displayname;
                //     newInput.user_title = employee_position;
                //     newInput.user_img = employee_img;

                //     $scope.data_workers.push(newInput);
                //     running_no_level1($scope.data_workers, null, null);

                //     $scope.MaxSeqdataWorkers = Number($scope.MaxSeqdataWorkers + 1);

                // }

                // console.log("$scope.data_workers",$scope.data_workers)
            }
            apply();

            $('#modalEmployeeAdd').modal('show');
    };

    $scope.removeDataEmployee = function (seq, seq_session) {
            const actions = $scope.selectDatFormType;

            if (actions == 'member') {
                var arrdelete = $filter('filter')($scope.data_memberteam, function (item) {
                    return (item.seq == seq && item.action_type == 'update');
                });

                if (arrdelete.length > 0) { $scope.data_memberteam_delete.push(arrdelete[0]); }

                $scope.data_memberteam = $filter('filter')($scope.data_memberteam, function (item) {
                    return !(item.seq == seq && item.id_session == seq_session);
                });
                //if delete row 1 clear to null
                if ($scope.data_memberteam.length == 1 || $scope.data_memberteam.no == 1) {
                    var keysToClear = ['user_name', 'user_displayname'];

                    keysToClear.forEach(function (key) {
                        $scope.data_memberteam[0][key] = null;
                    });
                    $scope.data_memberteam[0].no = 1;
                }
                running_no_level1($scope.data_memberteam, null, null)
            }

            if (actions == 'approver') {
                $scope.removeDataApprover(seq, seq_session)
            }

            if (actions == 'worker') {
                
            }

            if (actions == 'manage') {
                var data =  $scope.selectedData;

                if(!data) return;

                data.responder_user_displayname = null
                data.responder_action_type = null
                data.responder_user_email = null
                data.responder_user_name = null
                data.responder_user_img = null
                data.responder_user_id = null
                data.action_change = 1;
                console.log(data)
            }

    ;
            apply();
    };

    $scope.clearFormData = function() {
        $scope.formData = [];
        $scope.searchText='';
        $scope.clickedStates = {};
        $scope.searchIndicator = {
            text: ''
        }        
            //$scope.formData_outsider = [];
        };
    
        $scope.removeDataApprover = function (seq, seq_session) {

            var arrdelete = $filter('filter')($scope.data_approver, function (item) {
                return (item.seq == seq && item.action_type == 'update');
            });
            if (arrdelete.length > 0) { $scope.data_approver_delete.push(arrdelete[0]); }

            $scope.data_approver = $filter('filter')($scope.data_approver, function (item) {
                return !(item.seq == seq && item.id_session == seq_session);
            });

            //if delete row 1 clear to null
            if ($scope.data_approver.length == 1 || $scope.data_approver.no == 1) {
                var keysToClear = ['user_name', 'user_displayname'];

                keysToClear.forEach(function (key) {
                    $scope.data_approver[0][key] = null;
                });

                $scope.data_approver[0].no = 1;
            }

            running_no_level1($scope.data_approver, null, null);
            apply();
        };

        $scope.actionChangeSafety = function(item, seq){
        }   
    
        $scope.actionChangeSafetyUnCheck = function (item, seq) {
    
            for (const value of $scope.data_approver) {
                value.approver_type = 'approver';
            }
            item.approver_type = 'section_head';
    
            $scope.data_approver.sort(function(a, b) {
                if (a.approver_type === "section_head") return -1;
                if (b.approver_type === "section_head") return 1;
                return 0;
            });

            console.log("$scope.data_approver$scope.data_approver$scope.data_approver$scope.data_approver$scope.data_approver",$scope.data_approver)

            if($scope.data_approver[0].action_type === "update"){
                $scope.data_approver.forEach(function(approver) {
                    approver.action_change = 1;
                    approver.action_type = 'update';
                });
            }

            $timeout(function() {
                apply();
            }, 100);
        }

    }

    //add Drawing workflow Approve
    if (true) {
        $scope.downloadFileReviewer = function (item) {

            $scope.exportfile[0].DownloadPath = item.document_file_path;
            $scope.exportfile[0].Name = item.document_file_name;
            apply();
            $('#modalExportFile').modal('show');
        }

        $scope.downloadFile = function (item) {

            if (item.document_file_name != '') {
                var path = item.document_file_path;
                var name = item.document_file_name;

                $scope.exportfile[0].DownloadPath = path;
                $scope.exportfile[0].Name = name;

                apply();
                $('#modalExportFile').modal('show');
            }
        }
        $scope.downloadFileOwner = function (item) {

            $scope.id_worksheet_select = item.seq;
            apply();

            $('#modalExportResponderFile').modal('show');
        }
        $scope.downloadFileReviewer = function (item) {

            $scope.id_worksheet_select = item.seq;
            apply();

            $('#modalExportReviewerFile').modal('show');
        }

        //add Drawing
        $scope.addDataApproverDrawing = function (item_draw, seq_approver, id_session) {
            //item_draw = data_drawing_approver
            var user_name = $scope.user_name;
            var flow_role_type = $scope.flow_role_type;
            var seq = item_draw.seq;
            var id_pha = item_draw.id_pha;
            var id_approver = seq_approver;

            var xseq = Number($scope.MaxSeqdata_drawing_approver) + 1;
            $scope.MaxSeqdata_drawing_approver = xseq;

            //add Item Drawing  
            //var newInput = clone_arr_newrow($scope.data_drawing_def)[0];
            var add_items = {
                create_by: user_name,
                update_by: null,
                action_change: 0,
                action_type: "new", //"insert"
                descriptions: null,
                document_file_name: null,
                document_file_path: null,
                document_file_size: null,
                document_name: null,
                document_module: 'hazop',
                document_no: null,
                id_pha: id_pha,
                id_session: id_session,
                id_approver: id_approver,
                id: xseq,
                seq: xseq,
                no: 1
            }

            $scope.data_drawing_approver.push(add_items);
            var ino = 0;
            for (const value of $scope.data_drawing_approver) {
                value.no = ino; ino++;
            }
            apply();
        }

        $scope.removeDataApproverDrawing = function (item_draw, seq_approver) {
            var user_name = $scope.user_name;
            var seq = item_draw.seq;
            var fileUpload = document.getElementById('attfile-' + seq);
            var fileNameDisplay = document.getElementById('filename-approver-' + seq);
        
            // Clear file input
            if (fileUpload) {
                fileUpload.value = '';
            }
        
            // Clear file name display
            if (fileNameDisplay) {
                fileNameDisplay.textContent = '';
            }
        
            // Find and update data in $scope.data_drawing_approver
            var index = $scope.data_drawing_approver.findIndex(function(item) {
                return item.seq === seq;
            });
        
            if (index !== -1) {
                if ($scope.data_drawing_approver[index].action_type === "new") {
                    $scope.data_drawing_approver.splice(index, 1);
                } else {
                    $scope.data_drawing_approver[index].document_file_name = null;
                    $scope.data_drawing_approver[index].document_file_size = 0;
                    $scope.data_drawing_approver[index].document_file_path = null;
                    $scope.data_drawing_approver[index].action_type = 'delete';
                    $scope.data_drawing_approver[index].action_change = 1;
                    $scope.data_drawing_approver[index].update_by = user_name;
                }
            }
        
            clear_form_valid();
        };

        function clear_form_valid() {
            $scope.id_approver_select = null;
            $scope.form_valid = { valid_document_file: false };
        }
    }

    // dev

    $scope.actionChangeTabArea = function (type, subArea, hazard) {
        if (!type) {
            return console.log('type not found !')

        } else if (type == 'sub_area') {
            var sub_ls = $filter('filter')($scope.master_subarea, function (item) {
                return (item.name == subArea.sub_area);
            })[0];
            var arrText = $filter('filter')($scope.master_subarea_location, function (item) {
                return (item.id == sub_ls.id);
            });

            if (arrText.length > 0) {
                // subarea
                subArea.work_of_task = arrText[0].descriptions;
                subArea.sub_area = arrText[0].name;
                subArea.action_change = 1;
                subArea.id_sub_area = arrText[0].id;
                // set no_subareas for children hazard
                for (let i = 0; i < subArea.hazard.length; i++) {
                    // sub area
                    subArea.hazard[i].action_change = 1;
                    subArea.hazard[i].id_subareas = subArea.seq;
                    subArea.hazard[i].sub_area = subArea.sub_area;
                    subArea.hazard[i].work_of_task = subArea.work_of_task;
                }
            }
            // worksheet
            var list = [];
            for (let i = 0; i < $scope.data_worksheet_list.length; i++) {
                for (let j = 0; j < $scope.data_worksheet_list[i].worksheet.length; j++) {
                    if ($scope.data_worksheet_list[i].worksheet[j].subarea_no == subArea.no) {
                        $scope.data_worksheet_list[i].worksheet[j].sub_area = subArea.sub_area;
                    }
                }
            }
        
        } else if (type == 'type_hazard') {
            var arrText = $filter('filter')($scope.master_hazard_type, function (item) {
                return (item.id == hazard.id_type_hazard);
            });
            // add disable type hazard
            addDisabledOption(arrText, hazard);
            // change and set default
            changeDisabledOption(subArea, hazard.id_subareas, hazard.id)

            // set value
            if (arrText.length > 0) {
                hazard.type_hazard = arrText[0].name;
                hazard.action_change = 1;
            }
            // health hazard
            subArea.hazard.forEach(element => {
                if (element.no_type_hazard == hazard.no_type_hazard) {
                    element.id_type_hazard = hazard.id_type_hazard
                    element.type_hazard = hazard.type_hazard
                }
            });
            // worksheet
            $scope.data_worksheet_list.forEach(element => {
                element.worksheet.forEach(el => {
                    if (el.seq_hazard == hazard.seq) {
                        el.type_hazard = hazard.type_hazard
                    }
                });
            });
            console.log('master_hazard_type',$scope.master_hazard_type)
            // console.log('hazard',hazard)
        
        } else if (type == 'disabled_type_hazard') {
            // disabled
            const id_subarea = hazard.id_subareas;
            const id_hazard = hazard.seq;
            const id_type_hazard = hazard.id_type_hazard;
            console.log('id_subarea',hazard.id_subareas)
            console.log('id_type_hazard',hazard.id_type_hazard)
            console.log('master_hazard_type',$scope.master_hazard_type)
            // set diabled
            setDisabledOption(id_subarea, id_hazard);
        }
        
        // console.log(' subArea', subArea)
        // console.log('all worksheet', $scope.data_worksheet_list)
    }

    function addDisabledOption(arrText, hazard) {
        if (arrText.length > 0) {
            var alreadyExists = arrText[0].checks.some(function(check) {
                return check.id_subarea === hazard.id_subareas;
            });
            if(!alreadyExists){
                const newData = {
                    id_subarea: hazard.id_subareas,
                    id_hazard: hazard.seq,
                    id_type_hazard: hazard.id_type_hazard
                }
                // for (let i = 0; i < $scope.master_hazard_type.length; i++) {
                //     var tmp = [];
                //     for (let j = 0; j < $scope.master_hazard_type[i].checks.length; j++) {
                //         if (
                //             $scope.master_hazard_type[i].checks[j].id_hazard != newData.id_hazard 
                //         ) {
                //             tmp.push($scope.master_hazard_type[i].checks[j]);
                //         }
                //     }
                //     $scope.master_hazard_type[i].checks = tmp;
                // }
                arrText[0].checks.push(newData);
            }
        }
    }

    function setDisabledOption(id_subarea, id_hazard) {
        // เช็คว่า area ที่เลือก dropdown ว่ามีช้อมูลไหม 
        var tmp_subarea = [];
        for (let i = 0; i < $scope.master_hazard_type.length; i++) {
            var result = $filter('filter')($scope.master_hazard_type[i].checks, function (item) {
                return (item.id_subarea == id_subarea);
            });
            if(result) tmp_subarea = [...tmp_subarea, ...result]
        }
        // เช็คว่า id มีอยู่ใน checks[] หรือไม่ ถ้ามีแสดงว่าเคยเลือก type hazard นี้แล้ว ทำการ diabled
        if (tmp_subarea.length > 0) {
            for (let i = 0; i < tmp_subarea.length; i++) {
                for (let j = 0; j < $scope.master_hazard_type.length; j++) {
                   if (tmp_subarea[i].id_type_hazard ==  $scope.master_hazard_type[j].id) {
                        // set disabled
                        const optionEl = document.getElementById(`option_${id_subarea}_${id_hazard}_${$scope.master_hazard_type[j].id}`);
                        optionEl.disabled = true;
                        // if (processedValue) {
                            //     for (let i = 0; i < $scope.master_hazard_type.length; i++) {
                            //         var tmp = [];
                            //         for (let j = 0; j < $scope.master_hazard_type[i].checks.length; j++) {
                            //             if (
                            //                 $scope.master_hazard_type[i].checks[j].id_type_hazard == processedValue
                            //             ) {
                            //                 console.log('prev ',$scope.master_hazard_type[i].checks[j])
                            //                 const id_subarea = $scope.master_hazard_type[i].checks[j].id_subarea
                            //                 const id_hazard = $scope.master_hazard_type[i].checks[j].id_hazard
                            //                 const id_type_hazard = $scope.master_hazard_type[i].checks[j].id_type_hazard

                            //                 var subAsreaList = $filter('filter')($scope.data_subareas_list, function (item) {
                            //                     return (item.id == id_subarea);
                            //                 })[0];
                            //                 for (let k = 0; k < subAsreaList.hazard.length; k++) {
                            //                     const optionsEl = document.getElementById(
                            //                         `option_${id_subarea}_${subAsreaList.hazard[k].id}_${id_type_hazard}`
                            //                     );
                            //                     console.log(optionsEl)
                            //                     if(optionsEl) optionsEl.disabled = false;
                            //                 }
                            //             } else {
                            //                 tmp.push($scope.master_hazard_type[i].checks[j]);
                            //             }
                            //         }
                            //         $scope.master_hazard_type[i].checks = tmp;
                            //     }
                            // }
                   }
                }
            }
        } 
    }

    function setActiveOption(item_area, item_hazard, id_type_hazard) {
        // ต้อง loop ทั้ง 4 row ต้องการ subarea
        if(!item_area) return console.log('id_subarea not found');

        const id_subarea = item_hazard.id_subareas;
        const id_hazard = item_hazard.seq;

        for (let i = 0; i < item_area.hazard.length; i++) {
            const optionsEl = document.getElementById(`option_${id_subarea}_${item_area.hazard[i].id}_${id_type_hazard}`);
            if(optionsEl) optionsEl.disabled = false;
        }
        
        for (let i = 0; i < $scope.master_hazard_type.length; i++) {
            const result = $scope.master_hazard_type[i].checks.filter(item => {
                return !(item.id_subarea === id_subarea && 
                        item.id_hazard === id_hazard && 
                        item.id_type_hazard === id_type_hazard);
            });
            $scope.master_hazard_type[i].checks = result;
        }
    }

    function changeDisabledOption(subArea, id_subarea, id_hazard) {
        
        const prev = getPrevSelect(id_subarea, id_hazard)

        if(!prev) return;

        for (let i = 0; i < subArea.hazard.length; i++) {
            const optionsEl = document.getElementById(`option_${id_subarea}_${subArea.hazard[i].id}_${prev.id_type_hazard}`);
            if(optionsEl) optionsEl.disabled = false;
        }

        for (let i = 0; i < $scope.master_hazard_type.length; i++) {
            const result = $scope.master_hazard_type[i].checks.filter(item => {
                return !(item.id_subarea === prev.id_subarea && 
                        item.id_hazard === prev.id_hazard && 
                        item.id_type_hazard === prev.id_type_hazard);
            });
            $scope.master_hazard_type[i].checks = result;
        }
    }

    function getValueSelect(id_subarea, id_hazard) {
        const selectEl = document.getElementById(`select_${id_subarea}_${id_hazard}`);
        if (selectEl) {
            const optionValue = selectEl.value;
            const processedValue = optionValue.split(':')[1];
            const value = parseInt(processedValue);
            return value;
        }

        return null
    }
    
    function getPrevSelect(id_subarea, id_hazard) {
        var tmp = [];
        for (let i = 0; i < $scope.master_hazard_type.length; i++) {
            var result = $filter('filter')($scope.master_hazard_type[i].checks, function (item) {
                return (
                        item.id_subarea == id_subarea && 
                        item.id_hazard == id_hazard 
                    );
            });
            tmp = [...tmp, ...result];
        }

        if(tmp.length < 2) return console.log('Not Found Data Prev')

        const id = getValueSelect(id_subarea, id_hazard);

        var prev = $filter('filter')(tmp, function (item) {
            return (item.id_type_hazard != id);
        })[0];

        if(!prev) return null;

        return prev
    }

    $scope.chooseRating = function (value, index) {
        $scope.chooseIndexRating = index;
        // console.log( $scope.hazard_standard_list)
        // console.log(value)
        var list = $filter('filter')($scope.hazard_standard_list, function (item,idx) { 
            return (idx== index); 
        })[0];

        $scope.data_subareas_list.forEach(element => {
            element.hazard.forEach(el => {
                if (element.id == $scope.select_area.id && el.id == $scope.select_hazard.id) {
                    el.id_health_hazard = list.id
                    el.health_hazard = list.name
                    el.health_effect_rating = list.hazards_rating
                    el.tlv_standard = list.standard_type_text
                    el.action_change = 1
                }
            })
        });
        console.log('all ==> ',$scope.data_subareas_list)
        // hazard.count_riskfactors = $scope.sub_hazard_riskfactors.length
    }

    $scope.changeRisk = function (hazard, index) {
        $scope.select_risk_index = index;
        $scope.chooseIndexRating = 0;
        var hazard_index = $scope.select_hazard_index;
        // filter hazard_standard
        var list = $filter('filter')($scope.hazard_standard, function (item) { 
            return (item.id == hazard.id_health_hazard); 
        })[0];

        if (list) {
            hazard.health_hazard = list.name;
            hazard.health_effect_rating = list.hazards_rating
            hazard.action_change = 1
            hazard.standard_type_text = list.standard_type_text
            hazard.standard_unit = list.standard_unit
            hazard.standard_value = list.standard_value
             // worksheet
             $scope.data_worksheet_list.forEach(element => {
                element.worksheet.forEach(el => {
                    if (el.seq_hazard == hazard.seq) {
                        el.health_hazard = hazard.health_hazard
                        el.health_effect_rating = hazard.health_effect_rating
                        el.standard_type_text = hazard.standard_type_text
                        el.standard_unit = hazard.standard_unit
                        el.standard_value = hazard.standard_value
                    }
                });
            });
            // if(hazard.standard_value) $scope.processExposure(hazard);
            console.log('hazard ==> ',hazard)
            console.log('all ==> ',$scope.data_worksheet_list)
        }

        // console.log('hazard',hazard)
        // let set;
        // for (let i = 0; i < $scope.data_subareas_list[0].hazard.length; i++) {
        //     if (hazard_index == i) {
        //         $scope.data_subareas_list[0].hazard[i] = hazard;
        //         set = true;
        //     }
        // }

        // if (set) {
        //     $scope.data_worksheet_list = setup_worksheet($scope.data_subareas_list, $scope.data_tasks);
        // }

        // $scope.hazard_standard_list = $filter('filter')($scope.hazard_standard, function (item) { 
        //     return (item.name == hazard.health_hazard); 
        // });
        // console.log($scope.hazard_standard_list)
        // hazard.id_health_hazard = $scope.hazard_standard_list[0].id
        // hazard.health_hazard = $scope.hazard_standard_list[0].name
        // hazard.healthng_effect_rating = $scope.hazard_standard_list[0].hazards_rating
        // hazard.action_chae = 1
    };

    $scope.openModalRisk = function (item_hazard, index) {
        $scope.select_hazard = item_hazard;
        $scope.select_hazard_index = index;
        $scope.select_hazard_type = item_hazard.id_type_hazard
        console.log("select_hazard_type",$scope.select_hazard_type)
        $('#modalRisk').modal('show');
    };

    $scope.fillterRisk = function () {
        if (!$scope.keywords.text) {
            return  $scope.master_hazard_riskfactors_list = angular.copy($scope.hazard_standard);
        }

        $scope.master_hazard_riskfactors_list = $filter('filter')($scope.hazard_standard, function (item) { 
            return item.name.toLowerCase().includes($scope.keywords.text.toLowerCase()); 
        });
    }

    $('#modalRisk').on('shown.bs.modal', function () {
        scrollToRow($scope.select_hazard)
    });

    $('#modalRisk').on('hidden.bs.modal', function () {
        $scope.keywords.text = '';
        $scope.fillterRisk();
    });

    function scrollToRow(item) {
        if (!item || !item.id_health_hazard) return console.log('Not Found');

        var list = $filter('filter')($scope.master_hazard_riskfactors_list, function (_item) { 
            return _item.id_hazard_type == item.id_type_hazard; 
        });

        var index = list.findIndex(function(_item) {
            return _item.id == item.id_health_hazard;
        });

        if(index == -1) return console.log('Index Not Found')

        $timeout(function() {
            var row = document.getElementById('row-' + index);
            if (row) {
                row.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 0);
    }

    $scope.processExposure = function (hazard){
        hazard.exposure_band = hazard.exposure_band.replace(/[^0-9.]/g, '');
        // ตรวจสอบว่ามีจุดทศนิยมมากกว่าหนึ่งจุดหรือไม่
        var parts = hazard.exposure_band.split('.');
        if (parts.length > 2) {
            // ถ้ามีจุดทศนิยมมากกว่าหนึ่งจุด ให้ใช้เฉพาะจุดแรกและส่วนที่เหลือเป็นตัวเลข
            hazard.exposure_band = parts[0] + '.' + parts.slice(1).join('');
        }

        hazard.exposure_band = parseFloat( hazard.exposure_band);

        if(!hazard.exposure_band || !hazard.standard_value){
            hazard.id_exposure_level = null;
            hazard.initial_risk_rating = null
            hazard.id_exposure_rating = null
            hazard.exposure_rating = null
            hazard.exposure_status = false;
            return
        } 

        const exposure_result = parseFloat(hazard.exposure_band);
        const exposure_level = (exposure_result/hazard.standard_value) * 100;
        var id_exposure = 0;

        if (exposure_level < 10) {
            id_exposure = 1;
        } else if (exposure_level < 50) {
            id_exposure = 2;
        } else if (exposure_level < 75) {
            id_exposure = 3;
        } else if (exposure_level < 100) {
            id_exposure = 4;
        } else {
            id_exposure = 5;
        }
        hazard.id_exposure_level = id_exposure;
        hazard.exposure_status = true;
        processExposureRating(hazard);
    }

    function processExposureRating(hazard) {
        if (!hazard.id_exposure_level || !hazard.id_frequency_level) {
            return
        }

        let id_exposure_rating;
        let exposure_rating;

        if ((hazard.id_exposure_level === 2) &&
            (hazard.id_frequency_level === 3 || hazard.id_frequency_level === 4) ||
            (hazard.id_exposure_level === 3) &&
            (hazard.id_frequency_level === 2 || hazard.id_frequency_level === 3) ||
            (hazard.id_exposure_level === 4) &&
            (hazard.id_frequency_level === 2 )
        ) {
            id_exposure_rating = 2;
            exposure_rating = "[2] = น้อย";
        } else if ( (hazard.id_exposure_level === 2) &&
                    (hazard.id_frequency_level === 5) ||
                    (hazard.id_exposure_level === 3) &&
                    (hazard.id_frequency_level === 4 || hazard.id_frequency_level === 5) ||
                    (hazard.id_exposure_level === 4) &&
                    (hazard.id_frequency_level === 3) ||
                    (hazard.id_exposure_level === 5) &&
                    (hazard.id_frequency_level === 2 || hazard.id_frequency_level === 3)
        ) {
            id_exposure_rating = 3;
            exposure_rating = "[3] = ปานกลาง";
        } else if ( (hazard.id_exposure_level === 4) &&
                    (hazard.id_frequency_level === 4 || hazard.id_frequency_level === 5) ||
                    (hazard.id_exposure_level === 5) &&
                    (hazard.id_frequency_level === 4)
        ) {
            id_exposure_rating = 4;
            exposure_rating = "[4] = สูง";
        } else if ( (hazard.id_exposure_level === 5) &&
                    (hazard.id_frequency_level === 5)
        ) {
            id_exposure_rating = 5;
            exposure_rating = "[5] = สูงมาก";
        } else {
            // ค่าเริ่มต้น (default) หากไม่มีเงื่อนไขใด ๆ ตรงตามที่กำหนด
            id_exposure_rating = 1; 
            exposure_rating = "[1] = ไม่ได้รับสัมผัส";
        }

        hazard.id_exposure_rating = id_exposure_rating;
        hazard.exposure_rating = exposure_rating;
        processidInitialRiskRating(hazard);
    }

    function processidInitialRiskRating(hazard) {

        if (!hazard.id_exposure_rating || !hazard.health_effect_rating) {
            return
        }

        hazard.health_effect_rating = parseInt(hazard.health_effect_rating);

        var compare = $filter('filter')($scope.master_compare_initial_risk_rating, function (item) { 
            return (hazard.id_exposure_rating == item.exposure_rating && hazard.health_effect_rating == item.health_effect_rating); 
        })[0];
        
        hazard.initial_risk_rating = compare.results;
        hazard.action_change = 1;
        console.log('data_worksheet_list',$scope.data_worksheet_list)
    }

    $scope.actionChangeComment = function (item) {
        item.action_change = 1;
    }

    $scope.actionChangeControl = function (item) {
        item.action_change = 1;
    }

    $scope.actionChangEffective = function (item) {
        item.action_change = 1;
    }

    function convertSubAreaToHazard() {
        var hazardList = [];
        for (var i = 0; i < $scope.data_subareas_list.length; i++) {
            for (let j = 0; j < $scope.data_subareas_list[i].hazard.length; j++) {
                // if ($scope.data_subareas_list[i].hazard[j].id_subareas &&
                //     $scope.data_subareas_list[i].hazard[j].id_type_hazard &&
                //     $scope.data_subareas_list[i].hazard[j].id_health_hazard 
                // ) {
                    hazardList.push(angular.copy($scope.data_subareas_list[i].hazard[j]))
                // }
            }
        }
        return hazardList;
    }

    $scope.copyDescription = function (item) {
        if (item) {
            $scope.dec_copy = item;
            $scope.dec_copy_status = true;
        }
    }

    $scope.pasteDescription = function (item) {
        const data_copy = $scope.dec_copy;
        if (data_copy) {
            if (item.descriptions.length != data_copy.descriptions.length) {
                const num_rows = data_copy.descriptions.length - item.descriptions.length;
                for (let i = 0; i < num_rows; i++) {
                    $scope.addDescriptions(item, item.descriptions[item.descriptions.length - 1])
                }
            }

            for (let i = 0; i < data_copy.descriptions.length; i++) {
                item.descriptions[i].action_change = 1;
                item.descriptions[i].descriptions = data_copy.descriptions[i].descriptions;
            }
        }
    }

    $scope.getCustomIndex = function(currentIndex, currentTypeHazard, hazardList) {
        let customIndex = 1;  // เริ่มต้นนับจาก 1
    
        // ตรวจสอบแต่ละรายการก่อน currentIndex เพื่อคำนวณค่า customIndex
        for (let i = 0; i < currentIndex; i++) {
            if (hazardList[i].no_type_hazard === currentTypeHazard) {
                customIndex++;
            }
        }
    
        return customIndex;
    };
    
    
    $scope.Matrix_Frequency_Rating = function () {
         
        $('#modalMatrix_Frequency_Rating').modal('show');
    };

    $scope.Matrix_Exposure_Rating = function () {
         
        $('#modalMatrix_Exposure_Rating').modal('show');
    };

    
    $scope.Access_check = function(task) {
        console.log("Checking access for task:", task);

        // If user is an admin, allow access
        if ($scope.flow_role_type === 'admin') {
            return true;
        }

        // If user is an employee and the task belongs to them, allow access
        if ($scope.flow_role_type === 'employee' && $scope.user_name === task.user_name) {
            return true;
        }

        // Default to no access
        return false;
    };
    
});
