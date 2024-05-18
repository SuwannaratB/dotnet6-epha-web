
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

        return items.filter(function (item) {
            return (
                item.employee_id.toLowerCase().includes(searchApproverText) ||
                item.employee_displayname.toLowerCase().includes(searchApproverText) ||
                item.employee_email.toLowerCase().includes(searchApproverText)
            );
        });
    };
});

AppMenuPage.filter('SearchGuideWordsFieldFilter', function () {

    // GuideWordsfilterCriteria-->searchDeviationsText, searchGuideWordsText, searchProcessDeviationsText, searchAreaofAppText

    return function (items, GuideWordsfilterCriteria) {

        if (!GuideWordsfilterCriteria.DeviationsText
            && !GuideWordsfilterCriteria.GuideWordsText
            && !GuideWordsfilterCriteria.ProcessDeviationsText
            && !GuideWordsfilterCriteria.AreaofAppText
            && !GuideWordsfilterCriteria.ActionText
        ) { return items; }

        var searchDeviationsText = GuideWordsfilterCriteria.DeviationsText.toLowerCase();
        var searchGuideWordsText = GuideWordsfilterCriteria.GuideWordsText.toLowerCase();
        var searchProcessDeviationsText = GuideWordsfilterCriteria.ProcessDeviationsText.toLowerCase();
        var searchAreaofAppText = GuideWordsfilterCriteria.AreaofAppText.toLowerCase();

        var searchActionText = false;
        if (GuideWordsfilterCriteria.ActionText.toLowerCase() == 'active') { searchActionText = true; }

        return items.filter(function (item) {
            if (GuideWordsfilterCriteria.ActionText.toLowerCase() == 'all') {
                return (
                    (searchDeviationsText == '' ? 'x' : item.deviations).toLowerCase().includes((searchDeviationsText == '' ? 'x' : searchDeviationsText).toLowerCase()) &&
                    (searchGuideWordsText == '' ? 'x' : item.guide_words).toLowerCase().includes((searchGuideWordsText == '' ? 'x' : searchGuideWordsText).toLowerCase()) &&
                    (searchProcessDeviationsText == '' ? 'x' : item.process_deviation).toLowerCase().includes((searchProcessDeviationsText == '' ? 'x' : searchProcessDeviationsText).toLowerCase()) &&
                    (searchAreaofAppText == '' ? 'x' : item.area_application).toLowerCase().includes((searchAreaofAppText == '' ? 'x' : searchAreaofAppText).toLowerCase())
                );
            } else {
                return (
                    (searchDeviationsText == '' ? 'x' : item.deviations).toLowerCase().includes((searchDeviationsText == '' ? 'x' : searchDeviationsText).toLowerCase()) &&
                    (searchGuideWordsText == '' ? 'x' : item.guide_words).toLowerCase().includes((searchGuideWordsText == '' ? 'x' : searchGuideWordsText).toLowerCase()) &&
                    (searchProcessDeviationsText == '' ? 'x' : item.process_deviation).toLowerCase().includes((searchProcessDeviationsText == '' ? 'x' : searchProcessDeviationsText).toLowerCase()) &&
                    (searchAreaofAppText == '' ? 'x' : item.area_application).toLowerCase().includes((searchAreaofAppText == '' ? 'x' : searchAreaofAppText).toLowerCase()) &&
                    (item.selected == searchActionText)
                );
            }
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
        console.log($scope.autoText)
        try {
            var dropdown = document.querySelector(`.autocomplete-dropdown-${idinput}`);
            if (dropdown) {
                dropdown.style.display = 'none';
            }
        } catch (error) {

        }
    };


    $scope.selectGuideWordsActionText = function (val) {
        $scope.GuideWordsfilterCriteria.ActionText = val;
    };
});

//sort 0 last
AppMenuPage.filter('sortNodeworksheet', function() {
    return function(input) {
        var sortedArray = input.slice(0); 
        sortedArray.sort(function(a, b) {
            if (a.guidewords_no === 0 && b.guidewords_no !== 0) {
                return 1; // If 'guidewords_no' of 'a' === 0 and 'guidewords_no' of 'b' !== 0, 'b' comes before 'a'
            } else if (a.guidewords_no !== 0 && b.guidewords_no === 0) {
                return -1; // If 'guidewords_no' of 'a' is not 0 and 'guidewords_no' of 'b' is 0, 'a' comes before 'b'
            } else {
                return a.guidewords_no - b.guidewords_no; // Otherwise, sort based on 'guidewords_no'
            }
        });
        return sortedArray;
    };
});
//to hide please selected
AppMenuPage.directive('hidePlaceholderOption', function() {
    return {
      link: function(scope, element, attrs) {
  
        // Hide 
        element.on('showDropdown', function(event) {
            var placeholderItem = document.querySelector('.is-open .is-active .choices__list .is-selected'); //choices__placeholder
            if (placeholderItem) {placeholderItem.classList.add('ng-hide');}

          });
  
        // Show 
        element.on('hideDropdown', function(event) {
          console.log("Dropdown closed");
          var placeholderItem = document.querySelector('.is-open .is-active .choices__list .is-selected'); //choices__placeholder
          if (placeholderItem) {placeholderItem.removeClass('ng-hide');}
        });

        if (!scope.item.functional_location) {
          console.log("No selection, hiding placeholder");
        }
      }
    };
});
  
  

AppMenuPage.controller("ctrlAppPage", function ($scope, $http, $filter, conFig, $document, $interval,$rootScope,$window) { 

    var unsavedChanges = false;

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


    $scope.data_tooltip = [
        { id: 1, title_th: '', title_en: ''},
        { id: 2, title_th: '', title_en: ''},
        { id: 3, title_th: '', title_en: ''},
        { id: 4, title_th: '', title_en: ''},
        { id: 5, title_th: '', title_en: ''},
        { id: 6, title_th: '', title_en: 'Risk after implementing this MOC without Protection/Mitigation (Barriers)'},
        { id: 7, title_th: '', title_en: ''},
        { id: 8, title_th: '', title_en: ''},
        { id: 9, title_th: 'มาตรการควบคุมหรือป้องกัน(Barriers)ที่มีอยู่ในปัจจุบัน และ มาตรการเพิ่มเติมจากที่ได้ออกแบบไว้แล้วใน Detail design', title_en: ''},
        { id: 10, title_th: '', title_en: 'Risk after implementing this MOC with implemented  Protection/Mitigation (Barriers)'},
        { id: 11, title_th: '', title_en: ''},
        { id: 12, title_th: '', title_en: ''},
        { id: 13, title_th: '', title_en: ''},
        { id: 14, title_th: '', title_en: ''},
        { id: 15, title_th: '', title_en: ''},
    ];

    function startTimer() {
        $scope.counter = 1800; // 1800 วินาทีเท่ากับ 30 นาที
        var interval = $interval(function () {
            var minutes = Math.floor($scope.counter / 60); // หานาทีที่เหลืออยู่
            var seconds = $scope.counter % 60; // หาวินาทีที่เหลืออยู่
    
            // แสดงเวลาที่เหลืออยู่ในรูปแบบนาทีและวินาที
            $scope.counterText = minutes + ' min. ' + seconds + ' sec.';
            $scope.minutes = minutes
    
            // ลดเวลาลงทีละหนึ่งวินาที
            $scope.counter--;
    
            if ($scope.counter == 0) {
                // เมื่อเวลาครบ 0 ให้แสดงแจ้งเตือน
                set_alert("Warning", "Please save the information.")
                $scope.stopTimer();
                startTimer(); // เริ่มนับใหม่
            }
        }, 1000);
    
        $scope.stopTimer = function () {
            $interval.cancel(interval);
        };
    }
    
    $scope.startTimer = startTimer;

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
    $scope.clearFileName = function (seq) {

        //var fileUpload = document.getElementById('attfile-' + inputId);
        //var fileNameDisplay = document.getElementById('filename' + inputId);
        //var del = document.getElementById('del-' + inputId);
        //fileUpload.value = ''; // ล้างค่าใน input file
        //fileNameDisplay.textContent = ''; // ล้างข้อความที่แสดงชื่อไฟล์
        //del.style.display = "none"; 

        var fileInput = document.getElementById('attfile-' + seq);
        if (fileInput) {
            fileInput.value = '';
        }

        const fileInfoSpan = document.getElementById('filename' + seq);
        fileInfoSpan.textContent = "";
        $scope.status_upload = false;

        var arr = $filter('filter')($scope.data_drawing,
            function (item) { return (item.seq == seq); }
        );
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

    $scope.closePleaseRegister = function () {
        $('#modalPleaseRegister').modal('hide');
    }

    $scope.changeTab = function (selectedTab) {
        try {

            if ($scope.data_header[0].pha_status == 11) {
                if (selectedTab.name == 'worksheet'
                    || selectedTab.name == 'manage'
                    || selectedTab.name == 'report'
                ) {

                    if ($scope.data_general[0].sub_expense_type == 'Normal') {
                        
                        if (!$scope.data_general[0].expense_type ||
                            !$scope.data_general[0].sub_expense_type ||
                            !$scope.data_general[0].id_apu
                        ) {
                            $scope.tab_worksheet_show = true;
                            $scope.tab_managerecom_show = true;
                            return set_alert('Warning', 'Please select a valid General Information');
                        }

                        if (!$scope.data_drawing[0].document_no ||
                            !$scope.status_upload) {
                            $scope.tab_worksheet_show = true;
                            $scope.tab_managerecom_show = true;
                            return set_alert('Warning', 'Please select a valid Drawing');
                        }
                        if (!$scope.data_node[0].node ||
                            !$scope.data_nodedrawing[0].id_drawing
                        ) {
                            $scope.tab_worksheet_show = true;
                            $scope.tab_managerecom_show = true;
                            return set_alert('Warning', 'Please select a valid Node');
                        }
                        
                        apply();
                        $('#modalPleaseRegister').modal('show');
                        return;
                    } else {

                        $scope.tab_worksheet_active = true;
                        $scope.tab_managerecom_active = true;
                        $scope.tab_worksheet_show = true;
                        $scope.tab_managerecom_show = true;
                    }
                }
            }

            // default start date recommendations

            if (selectedTab.action_part == 6) {
                $scope.data_nodeworksheet.forEach(_item => {
                    if (_item.recommendations && (_item.responder_user_displayname || _item.project_team_text) && !_item.estimated_start_date) {
                        _item.estimated_start_date = new Date();
                        $scope.actionChangeWorksheet(_item, _item.seq, '');
                    }
                });
            }
        } catch (error) { }

        angular.forEach($scope.tabs, function (tab) {
            tab.isActive = false;
        });
        selectedTab.isActive = true;

        check_tab(selectedTab.name);


        $scope.oldTab = selectedTab;
        apply();
    };

    $scope.editWorksheet = function (tab_worksheet_active) {
        $scope.tab_worksheet_active = !tab_worksheet_active;
    }

    $scope.changeTab_Focus = function (selectedTab, nameTab) {
        angular.forEach($scope.tabs, function (tab) {
            tab.isActive = false;
        });
        selectedTab[0].isActive = true;

        // Set focus to the clicked tab element
        try {
            document.getElementById(selectedTab[0].name + "-tab").addEventListener("click", function (event) {
                ev = event.target
            });

            var tabElement = angular.element(ev);
            tabElement[0].focus();
        } catch (error) { }

        check_tab(selectedTab[0].name);

        apply();
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
            //fileInfoSpan.textContent = `${fileName} (${fileSize} KB)`;

            //fileInfoSpan.textContent = `${fileName} (${fileSize} KB)`;
            let shortenedFileName = fileName.length > 20 ? fileName.substring(0, 20) + '...' : fileName;
            fileInfoSpan.textContent = `${shortenedFileName} (${fileSize} KB)`;



            if (fileName.toLowerCase().indexOf('.pdf') == -1) {
                fileInfoSpan.textContent = "";
                set_alert_warning('Warning', 'Please select a PDF file.');
                $scope.status_upload = false;

                if ($scope.previousFile) {
                    input = $scope.previousFile;
                    document.getElementById('filename' + fileSeq).textContent = $scope.prevIileInfoSpan;
                    $scope.status_upload = true;
                }
                return;
            }
            var file_path = uploadFile(file, fileSeq, fileName, fileSize, file_part, file_doc);

            $scope.previousFile = fileInput;
            $scope.prevIileInfoSpan = fileInfoSpan.textContent;
            $scope.status_upload = true;

        } else {
            fileInfoSpan.textContent = "";
            if ($scope.previousFile) {
                input = $scope.previousFile;
                document.getElementById('filename' + fileSeq).textContent = $scope.prevIileInfoSpan;
                $scope.status_upload = true;
            }
        }
    }*/
    $scope.fileSelect = function (input, file_part) {
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
                //fileInfoSpan.textContent = `${fileName} (${fileSize} KB)`;
                let shortenedFileName = fileName.length > 20 ? fileName.substring(0, 20) + '...' : fileName;
                fileInfoSpan.textContent = `${shortenedFileName} (${fileSize} KB)`;

            } catch {

             }

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
        // $("#divLoading").hide(); 
    }    
    $scope.fileSelectRAM = function (input) {


        const fileInput = input;
        const fileSeq = fileInput.id.split('-')[1];
        const fileInfoSpan = document.getElementById('filename_ram_' + fileSeq);

        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const fileName = file.name;
            const fileSize = Math.round(file.size / 1024);
            //fileInfoSpan.textContent = `${fileName} (${fileSize} KB)`;

            let shortenedFileName = fileName.length > 20 ? fileName.substring(0, 20) + '...' : fileName;
            fileInfoSpan.textContent = `${shortenedFileName} (${fileSize} KB)`;


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
            //fileInfoSpan.textContent = `${fileName} (${fileSize} KB)`;

            let shortenedFileName = fileName.length > 20 ? fileName.substring(0, 20) + '...' : fileName;
            fileInfoSpan.textContent = `${shortenedFileName} (${fileSize} KB)`;


            if (fileName.toLowerCase().indexOf('.pdf') == -1) {
                fileInfoSpan.textContent = "";
                set_alert('Warning', 'Please select a PDF file.');
                return;
            }

            var file_path = uploadFileApprover(file, fileSeq, fileName, fileSize, file_part, file_doc);
            console.log("File path:", file_path);
    
            console.log("Next step after file upload");

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
        fd.append("sub_software", 'hazop');

        try {
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
                            arr[0].document_module = 'hazop';
                            arr[0].action_change = 1;
                            apply();

                        }
                    } else {
                        // กรณีเกิดข้อผิดพลาดในการร้องขอไปยัง server
                        console.error('มีข้อผิดพลาด: ' + request.status);
                    }
                }
            };

            request.send(fd);

        } catch { }

        return "";
    }

    function uploadFileRAM(file_obj, seq, file_name, file_size) {

        var fd = new FormData();
        //Take the first selected file
        fd.append("file_obj", file_obj);
        fd.append("file_seq", seq);
        fd.append("file_name", file_name);

        try {
            const request = new XMLHttpRequest();
            request.open("POST", url_ws + 'Flow/uploadfile_data');
            request.send(fd);

            var arr = $filter('filter')($scope.master_ram, function (item) { return (item.seq == seq); });
            if (arr.length > 0) {
                arr[0].document_file_name = file_name;
                arr[0].document_file_size = file_size;
                arr[0].document_file_path = (url_ws.replace('/api/', '/')) + 'AttachedFileTemp/Hazop/' + file_name;
                arr[0].action_change = 1;
                apply();
            }
        } catch { }

        return "";
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
        fd.append("sub_software", 'hazop');

        try {
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
            };

            request.send(fd);

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

    $scope.focusNode = function () {

        var tag_name = 'node';
        var arr_tab = $filter('filter')($scope.tabs, function (item) {
            return ((item.name == tag_name));
        });
        $scope.changeTab_Focus(arr_tab, tag_name);

        document.getElementById("node_" + $scope.selectedItemNodeView).focus();
    }
    $scope.changeSearchApprover = function () {

    }
    $scope.showCauseText = function (responder_user_id, causes_no) {
        $scope.data_nodeworksheet_show = [];
        var arr = $filter('filter')($scope.data_nodeworksheet, function (item) { return (item.responder_user_id == responder_user_id && item.causes_no == causes_no); });

        angular.copy(arr, $scope.data_nodeworksheet_show);

        $('#modalCauseText').modal('show');
    };

    $scope.clickExportReport = function () {
        $('#modalExportImport').modal('show');
    }

    $scope.confirmExport = function (export_report_type, data_type) {

        var seq = $scope.data_header[0].seq;
        var user_name = $scope.user_name;

        var action_export_report_type = "hazop_report";

        if (export_report_type == "hazop_report") {
            action_export_report_type = "export_hazop_report";
        } else if (export_report_type == "hazop_worksheet") {
            action_export_report_type = "export_hazop_worksheet";
        } else if (export_report_type == "hazop_recommendation") {
            action_export_report_type = "export_hazop_recommendation";
        } else if (export_report_type == "hazop_ram") {
            action_export_report_type = "export_hazop_ram";
        } else if (export_report_type == "hazop_guidewords") {
            action_export_report_type = "export_hazop_guidewords";
        } else {
            return;
        }

        $.ajax({
            url: url_ws + "Flow/" + action_export_report_type,
            data: '{"sub_software":"hazop","user_name":"' + user_name + '","seq":"' + seq + '","export_type":"' + data_type + '"}',
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

        $scope.master_apu = [];
        $scope.master_bussiness_unit = [];
        $scope.master_unit_no = [];
        $scope.master_functional = [];
        $scope.master_ram = [];
        $scope.master_ram_level = [];
        $scope.master_security_level = [];
        $scope.master_likelihood_level = [];
        $scope.master_guidwords = [];


        $scope.data_header = [];
        $scope.data_general = [];
        $scope.data_functional_audition = [];
        $scope.data_session = [];
        $scope.data_memberteam = [];
        $scope.data_approver = [];

        $scope.data_drawing = [];
        $scope.data_node = [];
        $scope.data_nodedrawing = [];
        $scope.data_nodeguidwords = [];
        $scope.data_nodeworksheet = [];
        $scope.data_drawing_approver = [];

        $scope.data_session_delete = [];
        $scope.data_memberteam_delete = [];
        $scope.data_approver_delete = [];
        $scope.data_drawing_delete = [];
        $scope.data_node_delete = [];
        $scope.data_nodedrawing_delete = [];
        $scope.data_nodeguidwords_delete = [];
        $scope.data_nodeworksheet_delete = [];
        $scope.data_drawing_approver_delete = [];


        $scope.select_history_tracking_record = false;

        $scope.selectedItemNodeView = 0;
        $scope.selectedDataNodeWorksheetRamType = null;

        $scope.select_rows_level = 5;
        $scope.select_columns_level = 5;
        $scope.selected_ram_img = (url_ws.replace('/api/', '/')) + 'AttachedFileTemp/rma-img-' + $scope.select_rows_level + 'x' + $scope.select_columns_level + '.png';

        $scope.data_nodeworksheet_show = [];


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
        $scope.searchIndicator = {
            text: ''
        }

        $scope.searchDeviationsText = '';
        $scope.searchGuideWordsText = '';
        $scope.searchProcessDeviationsText = '';
        $scope.searchAreaofAppText = '';

        $scope.GuideWordsfilterCriteria = { DeviationsText: '', GuideWordsText: '', ProcessDeviationsText: '', AreaofAppText: '', ActionText: 'All' };

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

        $scope.sub_software = 'HAZOP';

        $scope.tabs = [
            { name: 'general', action_part: 1, title: 'General Information', isActive: true, isShow: false },
            { name: 'session', action_part: 2, title: 'HAZOP Session', isActive: false, isShow: false },
            { name: 'node', action_part: 3, title: 'Node', isActive: false, isShow: false },
            { name: 'ram', action_part: 4, title: 'RAM', isActive: false, isShow: false },
            { name: 'worksheet', action_part: 5, title: 'HAZOP Worksheet', isActive: false, isShow: false },
            { name: 'manage', action_part: 6, title: 'Manage Recommendations', isActive: false, isShow: false },
            //{ name: 'approver', action_part: 7, title: 'Approver', isActive: false, isShow: false },
            { name: 'report', action_part: 8, title: 'Report', isActive: false, isShow: false }
        ];


        //file:///D:/04KUL_PROJECT_2023/e-PHA/phoenix-v1.12.0/public/apps/email/compose.html
        console.log($scope.tabs);
    }

    function check_tab(val) {

        $scope.action_part = 1;
        var arr_tab = $filter('filter')($scope.tabs, function (item) { return (item.name == val); });
        if (arr_tab.length > 0) { $scope.action_part = Number(arr_tab[0].action_part); }
        if (val == 'worksheet') { $scope.viewDataNodeList($scope.selectedItemNodeView); }
        if (val === 'approver') { $scope.canAccess($scope.data_approver)}
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

        var arr = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'node'); });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqDataNodeList = iMaxSeq;

        var arr = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'nodedrawing'); });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqDataNodeDrawing = iMaxSeq;

        var arr = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'nodeguidwords'); });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqDataNodeGuidWords = iMaxSeq;
        //whorksheet
        var arr = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'nodeworksheet'); });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqdata_nodeworksheet = iMaxSeq;

        var arr = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'causes'); });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqdata_nodeworksheetCauses = iMaxSeq;

        var arr = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'consequences'); });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqdata_nodeworksheetConsequences = iMaxSeq;

        var arr = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'category'); });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqdata_nodeworksheetCat = iMaxSeq;


        $scope.MaxSeqdata_drawing_approver = 0;
        var arr_check = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'drawing_approver'); });
        var iMaxSeq = 1; if (arr_check.length > 0) { iMaxSeq = arr_check[0].values; }
        $scope.MaxSeqdata_drawing_approver = iMaxSeq;


        $scope.selectdata_session = 1;
        $scope.selectdata_memberteam = 1;
        $scope.selectdata_drawing = 1;
        $scope.selectdata_node = 1;
        $scope.selectdata_nodeguidwords = 1;
        $scope.selectdata_nodeworksheet = 1;
        $scope.selectdata_nodeworksheetCauses = 1;
        $scope.selectdata_nodeworksheetConsequences = 1;
        $scope.selectdata_nodeworksheetCat = 1;

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

    function save_data_create(action, action_def) {
        console.log('save ==> ',$scope.data_nodeworksheet)
        if ($scope.action_part != 4) { set_data_managerecom(); }

        check_data_general();
        check_data_functional_audition();

        var action_part = $scope.action_part;
        var user_name = $scope.user_name;
        var token_doc = $scope.token_doc + "";
        var pha_status = $scope.data_header[0].pha_status;
        var pha_version = $scope.data_header[0].pha_version;
        var pha_seq = $scope.data_header[0].seq;
        token_doc = pha_seq;


        var json_header = angular.toJson($scope.data_header);
        var json_general = angular.toJson($scope.data_general);
        var json_functional_audition = angular.toJson($scope.data_functional_audition);

        var json_session = check_data_session();
        var json_memberteam = check_data_memberteam();
        var json_approver = check_data_approver();
        var json_drawing = check_data_drawing();
        var json_node = check_data_node();

        var json_nodedrawing = check_data_nodedrawing();
        var json_nodeguidwords = check_data_nodeguidwords();
        var json_nodeworksheet = check_data_nodeworksheet();
        var json_managerecom = "";

        //EPHA_M_RAM_LEVEL
        var json_ram_level = check_data_ram_level();
        var json_ram_master = check_master_ram();

        //submit, submit_without, submit_complete
        // var flow_action = (action == 'submit_complete' ? 'submit' : action);
        var flow_action = '';

        if(action == 'submit_complete'){
            flow_action = 'submit'
        }else if(action == 'change_action_owner'){
            flow_action = 'change_action_owner'
        }else if(action == 'submit'){
            flow_action = action
        }else {
            flow_action = action
        }

        $.ajax({
            url: url_ws + "Flow/set_hazop",
            data: '{"user_name":"' + user_name + '","token_doc":"' + token_doc + '","pha_status":"' + pha_status + '","pha_version":"' + pha_version + '","action_part":"' + action_part + '"'
                + ',"json_header":' + JSON.stringify(json_header)
                + ',"json_general":' + JSON.stringify(json_general)
                + ',"json_functional_audition":' + JSON.stringify(json_functional_audition)
                + ',"json_session":' + JSON.stringify(json_session)
                + ',"json_memberteam":' + JSON.stringify(json_memberteam)
                + ',"json_approver":' + JSON.stringify(json_approver)
                + ',"json_drawing":' + JSON.stringify(json_drawing)
                + ',"json_node":' + JSON.stringify(json_node)
                + ',"json_nodedrawing":' + JSON.stringify(json_nodedrawing)
                + ',"json_nodeguidwords":' + JSON.stringify(json_nodeguidwords)
                + ',"json_nodeworksheet":' + JSON.stringify(json_nodeworksheet)
                + ',"json_managerecom":' + JSON.stringify(json_managerecom)
                + ',"json_ram_level":' + JSON.stringify(json_ram_level)
                + ',"json_ram_master":' + JSON.stringify(json_ram_master)
                + ',"flow_action":' + JSON.stringify(flow_action)
                + '}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
            beforeSend: function () {
                //$('#modalLoadding').modal('show');
                //$('#modalMsg').modal('hide');
                $("#divLoading").show();

            },
            complete: function () {
                //$('#modalLoadding').modal('hide');
                $("#divLoading").hide();
                $('#modalPleaseRegister').hide();
            },
            success: function (data) {

                var arr = data;
                console.log("arr",arr)
                if (arr[0].status == 'true') {
                    $scope.pha_type_doc = 'update';
                    if (action == 'save' || action == 'submit_moc'
                        || action_def == "confirm_submit_register"
                        || action_def == "confirm_submit_register_without") {

                        var controller_action_befor = conFig.controller_action_befor();
                        var pha_seq = arr[0].pha_seq;
                        var pha_no = arr[0].pha_no;
                        var pha_type_doc = "edit";

                        $scope.pha_seq = arr[0].pha_seq;

                        var controller_text = "hazop";

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

                                //get_data_after_save(false, (flow_action == 'submit' ? true : false), $scope.pha_seq);
                                get_data_after_save(false, false, $scope.pha_seq);

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

                        var controller_text = "hazop";

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

                                $scope.stopTimer();
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

                        set_alert('Success', 'Data has been successfully submitted.');
                        // window.open('hazop/search', "_top");
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
        var json_drawing_approver = check_data_drawing_approver(id_session);

        $.ajax({
            url: url_ws + "flow/set_approve",
            data: '{"sub_software":"hazop","user_name":"' + user_name + '","role_type":"' + flow_role_type + '","action":"' + flow_action + '","token_doc":"' + pha_seq + '","pha_status":"' + pha_status + '"'
                + ',"id_session":"' + id_session + '","seq":"' + seq + '","action_status":"' + action_status + '","comment":"' + comment + '","user_approver":"' + user_approver + '"'
                + ', "json_drawing_approver": ' + JSON.stringify(json_drawing_approver)
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
            url: url_ws + "Flow/get_hazop_details",
            data: '{"sub_software":"hazop","user_name":"' + user_name + '","token_doc":"' + pha_seq + '","type_doc":"' + type_doc + '"}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
            beforeSend: function () {
                $('#divLoading').show();
            },
            complete: function () {
                $('#divLoading').hide();
            },
            success: function (data) {
                console.log('=> ',data);

                var action_part_befor = $scope.action_part;//(page_load == false ? $scope.action_part : 0);
                var tabs_befor = (page_load == false ? $scope.tabs : null);

                var arr = data;
                if (true) {
                    $scope.data_all = arr;
                    $scope.master_apu = arr.apu;
                    $scope.master_business_unit_def = arr.business_unit;
                    $scope.master_business_unit = arr.business_unit;
                    $scope.master_unit_no = arr.unit_no;
                    $scope.master_functional = arr.functional;
                    $scope.master_functional_audition = arr.functional;//ใช้ใน functional audition

                    //แก้ไขเบื้องต้น เนื่องจาก path file ผิดต้องเป็น folder hazop
                    for (let i = 0; i < arr.ram.length; i++) {
                        arr.ram[i].document_file_path = (url_ws.replace('/api/', '/')) + arr.ram[i].document_file_path;
                        arr.ram[i].document_definition_file_path = (url_ws.replace('/api/', '/')) + arr.ram[i].document_definition_file_path;
                    }

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

                    $scope.master_apu = JSON.parse(replace_hashKey_arr(arr.apu));

                    $scope.master_guidwords = arr.guidwords;
                    $scope.employeelist_def = arr.employee;

                    if (true) {
                        arr.header[0].safety_critical_equipment_show = (arr.header[0].safety_critical_equipment_show == null ? 0 : arr.header[0].safety_critical_equipment_show);
                        $scope.data_header = arr.header;

                        var inputs = document.getElementsByTagName('sceSwitchCheckChecked');
                        for (var i = 0; i < inputs.length; i++) {
                            if (inputs[i].type == 'checkbox') {
                                if ($scope.data_header[0].safety_critical_equipment_show == 1) {
                                    inputs[i].checked = true;
                                } else { inputs[i].checked = false; }
                            }
                        }
                    }

                    $scope.data_general = arr.general;
                    console.log($scope.data_general)                 

                    //set id to 5 
                    $scope.data_general.forEach(function (item) { item.id_ram = (item.id_ram == null ? 5 : item.id_ram); });

                    $scope.data_functional_audition = arr.functional_audition;

                    //wait pkul sent img matrix
                    $scope.data_session = arr.session;
                    $scope.data_session_def = clone_arr_newrow(arr.session);

                    $scope.data_memberteam = arr.memberteam;
                    $scope.data_memberteam_def = clone_arr_newrow(arr.memberteam);
                    $scope.data_memberteam_old = (arr.memberteam);

                    $scope.data_approver = arr.approver;
                    $scope.data_approver_def = clone_arr_newrow(arr.approver);
                    $scope.data_approver_old = (arr.approver);

                    $scope.data_drawing = arr.drawing;
                    $scope.data_drawing_def = clone_arr_newrow(arr.drawing);

                    $scope.data_drawing_approver_responder = arr.drawingworksheet_responder;
                    $scope.data_drawing_approver_reviewer = arr.drawingworksheet_reviewer;

                    $scope.data_node = arr.node;
                    $scope.data_node_def = clone_arr_newrow(arr.node);

                    //แก้ไขเบื้องต้น เนื่องจาก path file ผิดต้องเป็น folder hazop 
                    for (let i = 0; i < arr.nodedrawing; i++) {

                        if (arr.nodedrawing[i].document_file_path.indexOf('/FollowUp/') > -1) {
                            arr.nodedrawing[i].document_file_path = arr.nodedrawing[i].document_file_path.replace('/FollowUp/', '/hazop/');
                        }
                    }
                    $scope.data_nodedrawing = arr.nodedrawing;
                    $scope.data_nodedrawing_def = clone_arr_newrow(arr.nodedrawing);



                    if (true) {
                        $scope.data_nodeguidwords = arr.nodeguidwords;
                        $scope.data_nodeguidwords_def = clone_arr_newrow(arr.nodeguidwords);
                    }

                    //set action_project_team will set to 0 if that data null? 
                    for (let i = 0; i < arr.nodeworksheet.length; i++) {
                        if (arr.nodeworksheet[i].action_project_team !== null) {
                            arr.nodeworksheet[i].action_project_team = arr.nodeworksheet[i].action_project_team === 1 ;                           
                        }
                    }

                    $scope.data_nodeworksheet = arr.nodeworksheet;
                    // formatEstimatedDate
                    // formatEstimatedDate();
                    $scope.data_nodeworksheet_def = clone_arr_newrow(arr.nodeworksheet);

                    $scope.data_drawing_approver = arr.drawing_approver;
                    $scope.data_drawing_approver_def = clone_arr_newrow(arr.drawing_approver);
                    $scope.data_drawing_approver_old = (arr.drawing_approver);

                    get_max_id();
                    set_data_general();
                    set_data_nodeguidwords();
                    set_data_nodeworksheet();
                    set_master_ram_likelihood('');
                    //get recommendations_no in node worksheet
                    if ($scope.data_nodeworksheet.length > 0) {
                        var arr_copy_def = angular.copy($scope.data_nodeworksheet, arr_copy_def);
                        arr_copy_def.sort((a, b) => Number(b.recommendations_no) - Number(a.recommendations_no));
                        var recommendations_no = Number(Number(arr_copy_def[0].recommendations_no) + 1);
                        for (let i = 0; i < $scope.data_nodeworksheet; i++) {
                            if ($scope.data_nodeworksheet[i].recommendations == null || $scope.data_nodeworksheet[i].recommendations == '') {
                                if ($scope.data_nodeworksheet[i].recommendations_no == null || $scope.data_nodeworksheet[i].recommendations_no == '') {
                                    $scope.data_nodeworksheet[i].recommendations_no = recommendations_no;
                                    recommendations_no += 1;
                                }
                            }
                        }

                        $scope.selectedItemNodeView = $scope.data_nodeworksheet[0].id_node;
                    }

                }

                $scope.data_session_delete = [];
                $scope.data_memberteam_delete = [];
                $scope.data_drawing_delete = [];
                $scope.data_node_delete = [];
                $scope.data_nodedrawing_delete = [];
                $scope.data_nodeguidwords_delete = [];
                $scope.data_nodeworksheet_delete = [];
                try {
                    $scope.flow_role_type = conFig.role_type();// "admin";//admin,request,responder,approver
                    if (arr.header[0].pha_request_by.toLowerCase() == $scope.user_name.toLowerCase()) {
                        $scope.flow_role_type = 'admin';
                        conFig.role_type = 'admin';
                    }
                } catch { }
                $scope.flow_status = 0;

                //แสดงปุ่ม
                $scope.flexSwitchCheckChecked = false;
                $scope.back_type = true;
                $scope.cancle_type = false;
                $scope.export_type = false;
                $scope.save_type = true;
                $scope.submit_review = true;
                $scope.action_to_review_type = false;
                $scope.submit_type = true;

                $scope.selectActiveNotification = ($scope.data_header[0].active_notification == 1 ? true : false);

                if (page_load) {
                    if (arr.header[0].pha_status == 21 || arr.header[0].pha_status == 22) {
                        $scope.tabs = [
                            { name: 'general', action_part: 1, title: 'General Information', isActive: true, isShow: false },
                            { name: 'session', action_part: 2, title: 'HAZOP Session', isActive: false, isShow: false },
                            { name: 'node', action_part: 3, title: 'Node', isActive: false, isShow: false },
                            { name: 'ram', action_part: 4, title: 'RAM', isActive: false, isShow: false },
                            { name: 'worksheet', action_part: 5, title: 'HAZOP Worksheet', isActive: false, isShow: false },
                            { name: 'manage', action_part: 6, title: 'Manage Recommendations', isActive: false, isShow: false },
                            { name: 'approver', action_part: 7, title: 'Approver', isActive: false, isShow: false },
                            { name: 'report', action_part: 8, title: 'Report', isActive: false, isShow: false }
                        ];
                    }
                }

                $scope.data_header = JSON.parse(replace_hashKey_arr(arr.header));
                set_form_action(action_part_befor, !action_submit, page_load);

                if($scope.params != 'edit_approver')  $scope.action_owner_active = true;
                // $scope.action_owner_active = true;

                //ตรวจสอบเพิ่มเติม
                if (arr.user_in_pha_no[0].pha_no == '' && $scope.flow_role_type != 'admin') {
                    if (arr.header[0].action_type != 'insert') {
                        $scope.tab_general_active = false;
                        $scope.tab_node_active = false;
                        $scope.tab_worksheet_active = false;
                        $scope.tab_managerecom_active = false;

                        $scope.save_type = false;
                        $scope.submit_review = false;
                        $scope.submit_type = false;
                    }
                } else if (arr.user_in_pha_no[0].pha_no != '' && $scope.flow_role_type != 'admin') {
                    if (arr.header[0].action_type != 'insert') {
                        $scope.tab_general_active = false;
                        $scope.tab_node_active = false;
                        $scope.tab_worksheet_active = false;
                        $scope.tab_managerecom_active = false;

                        $scope.save_type = false;
                        $scope.submit_review = false;
                        $scope.submit_type = false;
                    }
                }

                if (true) {

                    if (!page_load) {
                        if (!action_submit) {
                            $scope.action_part = action_part_befor;
                            $scope.tabs = tabs_befor;
                        }
                    }

                    var i = 0;
                    var id_ram = $scope.data_general[0].id_ram;
                    var arr_items = $filter('filter')($scope.master_ram_level, function (item) { return (item.id_ram == id_ram); });
                    if (arr_items.length > 0) {

                        $scope.select_rows_level = arr_items[0].rows_level;
                        $scope.select_columns_level = arr_items[0].columns_level;
                        $scope.selected_ram_img = (url_ws.replace('/api/', '/')) + arr_items[0].document_file_path;
                    }

                    try {
                        $scope.master_apu = JSON.parse(replace_hashKey_arr(arr.apu));
                        $scope.master_functional = JSON.parse(replace_hashKey_arr(arr.functional));
                        $scope.master_business_unit = JSON.parse(replace_hashKey_arr(arr.business_unit));
                        $scope.master_business_unit_def = JSON.parse(replace_hashKey_arr(arr.business_unit));
                        $scope.master_unit_no = JSON.parse(replace_hashKey_arr(arr.unit_no));

                        if ($scope.data_general[0].master_apu == null || $scope.data_general[0].master_apu == '') {
                            $scope.data_general[0].master_apu = null;
                            //var arr_clone_def = { id: $scope.data_general[0].master_apu, name: 'Please select' };
                            var arr_clone_def = { id: null, name: 'Please select' };
                            $scope.master_apu.splice(0, 0, arr_clone_def);
                        }
                        if ($scope.data_general[0].master_functional == null || $scope.data_general[0].master_functional == '') {
                            $scope.data_general[0].master_functional = null;
                            //var arr_clone_def = { id: $scope.data_general[0].master_functional, name: 'Please select' };
                            // var arr_clone_def = { id: null, name: 'Please select' };
                            // $scope.master_functional.splice(0, 0, arr_clone_def);
                        }
                        //if ($scope.data_general[0].id_business_unit == null) {
                        //    $scope.data_general[0].id_business_unit = null;
                        //    //var arr_clone_def = { id: $scope.data_general[0].id_business_unit, name: 'Please select' };
                        //    var arr_clone_def = { id: null, name: 'Please select' };
                        //    $scope.master_business_unit.splice(0, 0, arr_clone_def);
                        //}
                        if ($scope.data_general[0].master_unit_no == null || $scope.data_general[0].master_unit_no == '') {
                            $scope.data_general[0].master_unit_no = null;
                            //var arr_clone_def = { id: $scope.data_general[0].master_unit_no, name: 'Please select' };
                            var arr_clone_def = { id: null, name: 'Please select' };
                            $scope.master_unit_no.splice(0, 0, arr_clone_def);
                        }
                    } catch (ex) { alert(ex); console.clear(); }

                    $scope.$apply();
                    startTimer();
                    try {
                        if (page_load == true || true) {
                            const choices1 = new Choices('.js-choice-apu');
                            const choices2 = new Choices('.js-choice-functional');
                            const choices5 = new Choices('.js-choice-functional_audition');

                            //const choices3 = new Choices('.js-choice-business_unit');
                            //const choices4 = new Choices('.js-choice-unit_no');
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

    function get_params() {
        var queryParams = new URLSearchParams(window.location.search);
        var dataReceived = queryParams.get('data');
        return dataReceived;
    }

    function set_form_action(action_part_befor, action_save, page_load) {

        //แสดง tab ตาม flow
        $scope.tab_general_show = true;
        $scope.tab_node_show = true;
        $scope.tab_worksheet_show = false;
        $scope.tab_managerecom_show = false;
        $scope.tab_approver_show = false;

        //เปิดให้แก้ไขข้อมูลในแต่ละ tab ตาม flow
        $scope.tab_general_active = true;
        $scope.tab_node_active = true;
        $scope.tab_worksheet_active = true;
        $scope.tab_managerecom_active = true;
        $scope.tab_approver_active = true;

        for (let _item of $scope.tabs) {
            _item.isShow = true;
            _item.isActive = false;
        }

        $scope.action_part = action_part_befor;

        var pha_status_def = Number($scope.data_header[0].pha_status);

        $scope.submit_review = false;
        if (Number(pha_status_def) == 81) {
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

        if (pha_status_def == 11) {

            if (page_load) {

                var tag_name = 'general';
                var arr_tab = $filter('filter')($scope.tabs, function (item) {
                    return ((item.action_part == $scope.action_part));
                });
                if (arr_tab.length > 0) {
                    $scope.changeTab(arr_tab[0], tag_name);
                    if (action_save == true) { $scope.action_part = arr_tab[0].action_part; }
                }

                var arr_submit = $filter('filter')($scope.data_node, function (item) {
                    return ((item.node !== '' && item.action_type !== null));
                });
                if (arr_submit.length > 0) {
                    $scope.submit_type = true;
                } else { $scope.submit_type = false; }


                $scope.cancle_type = true;
            }
            if ($scope.data_general[0].sub_expense_type == 'Study' ||
                $scope.data_general[0].sub_expense_type == 'Internal Study') {
                check_case_sub_expense_type();
            } else { $scope.tab_worksheet_active = false; }

        }
        else if (pha_status_def == 12) {
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
            $scope.tab_managerecom_show = true;
            $scope.tab_approver_show = true;
            if ($scope.data_nodeworksheet.length == 0) {
                $scope.tab_managerecom_show = false;
                $scope.tab_approver_show = false;
            }

            $scope.tab_worksheet_active = true;

            $scope.selectedItemNodeView = $scope.data_node[0].seq;

            $scope.submit_type = true;

            $scope.tab_general_active = true;
            $scope.tab_node_active = true;
            $scope.tab_worksheet_active = true;
            $scope.tab_managerecom_active = true;
            $scope.tab_approver_active = true;
        }
        else if (pha_status_def == 13) {
            $scope.tab_worksheet_show = true;
            $scope.tab_managerecom_show = true;
            if ($scope.data_nodeworksheet.length == 0) {
                $scope.tab_managerecom_show = false;
                $scope.tab_approver_show = false;
            }

            $scope.tab_worksheet_active = true;
            $scope.selectedItemNodeView = $scope.data_node[0].seq;

            var tag_name = 'manage';

            if($scope.params == 'edit') {
                tag_name = 'worksheet';
            } 

            var arr_tab = $filter('filter')($scope.tabs, function (item) {
                return ((item.name == tag_name));
            });
            if (arr_tab.length > 0) {
                $scope.changeTab(arr_tab[0], tag_name);
                if (action_save == true) { $scope.action_part = arr_tab[0].action_part; }
            }

            $scope.tab_general_active = false;
            $scope.tab_node_active = false;
            $scope.tab_worksheet_active = false;
            $scope.tab_managerecom_active = false;
            $scope.tab_approver_active = false;

            $scope.save_type = false;
            $scope.submit_type = false;
        }
        else if (pha_status_def == 21) {

            $scope.tab_general_show = true;
            $scope.tab_node_show = true;
            $scope.tab_worksheet_show = true;
            $scope.tab_managerecom_show = true;
            $scope.tab_approver_show = true;
            $scope.tab_worksheet_active = true;

            $scope.selectedItemNodeView = $scope.data_node[0].seq;

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
            $scope.tab_node_active = false;
            $scope.tab_worksheet_active = false;
            $scope.tab_managerecom_active = false;
            $scope.tab_approver_active = $scope.tab_managerecom_show;

            check_case_member_review();

        }
        else if (pha_status_def == 22) {
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
            $scope.tab_managerecom_show = true;
            $scope.tab_approver_show = true;
            if ($scope.data_nodeworksheet.length == 0) {
                $scope.tab_managerecom_show = false;
                $scope.tab_approver_show = false;
            }

            $scope.tab_worksheet_active = true;

            $scope.selectedItemNodeView = $scope.data_node[0].seq;

            $scope.submit_type = true;

            $scope.tab_general_active = true;
            $scope.tab_node_active = true;
            $scope.tab_worksheet_active = true;
            $scope.tab_managerecom_active = true;
            $scope.tab_approver_active = true;
        }
        else if (pha_status_def == 14) {
            $scope.tab_general_show = true;
            $scope.tab_node_show = true;
            $scope.tab_worksheet_show = true;
            $scope.tab_managerecom_show = true;
            $scope.tab_approver_show = true;
            $scope.tab_worksheet_active = true;

            $scope.selectedItemNodeView = $scope.data_node[0].seq;

            if ($scope.flow_role_type == "admin") {
                $scope.save_type = true;
                $scope.submit_type = true;
            }
            var tag_name = 'manage';
            var arr_tab = $filter('filter')($scope.tabs, function (item) {
                return ((item.name == tag_name));
            });
            if (arr_tab.length > 0) {
                $scope.changeTab(arr_tab[0], tag_name);
                if (action_save == true) { $scope.action_part = arr_tab[0].action_part; }
            }

            $scope.tab_general_active = false;
            $scope.tab_node_active = false;
            $scope.tab_worksheet_active = false;
            $scope.tab_managerecom_active = false;
            $scope.tab_approver_active = $scope.tab_approver_show;
        }
        else if (pha_status_def == 91) {
            $scope.tab_general_show = true;
            $scope.tab_node_show = true;
            $scope.tab_worksheet_show = true;
            $scope.tab_managerecom_show = true;
            $scope.tab_approver_show = true;

            $scope.tab_general_active = false;
            $scope.tab_node_active = false;
            $scope.tab_worksheet_active = false;
            $scope.tab_managerecom_active = false;
            $scope.tab_approver_active = false;

            $scope.save_type = false;
            $scope.submit_type = false;
            $scope.export_type = true;

            $scope.selectedItemNodeView = $scope.data_node[0].seq;

            var tag_name = 'manage';
            var arr_tab = $filter('filter')($scope.tabs, function (item) {
                return ((item.name == tag_name));
            });
            if (arr_tab.length > 0) {
                $scope.changeTab(arr_tab[0], tag_name);
                if (action_save == true) { $scope.action_part = arr_tab[0].action_part; }
            }

        }

        if (pha_status_def == 91 || pha_status_def == 81) {


        } else {

            $scope.tab_general_active = true;
            $scope.tab_node_active = true;
        }

        if ($scope.pha_type_doc == 'review_document') {
            $scope.tab_general_active = false;
            $scope.tab_node_active = false;
            $scope.tab_worksheet_active = false;
            $scope.tab_managerecom_active = false;
            $scope.tab_approver_active = false;

            $scope.back_type = true;
            $scope.cancle_type = false;
            $scope.export_type = true;
            $scope.save_type = false;
            $scope.submit_type = false;
            $scope.submit_review = false;
        }


        $scope.date_to_approve_moc_text = '';
        $scope.date_approve_moc_text = '';
        if ($scope.data_session != null) {
            var icount = $scope.data_session.length - 1;
            if (icount > 0) {
                if ($scope.data_session[icount].action_to_approve_moc > 0) {
                    $scope.date_to_approve_moc_text = $scope.data_session[icount].date_to_approve_moc_text;
                    $scope.date_approve_moc_text = $scope.data_session[icount].date_approve_moc_text;
                }
            }
        }
    }
    function check_case_member_review() {

        if ($scope.data_header[0].pha_status == 12
            || $scope.data_header[0].pha_status == 22) {
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
            if (!($scope.data_session[icount].action_to_review >= 1)) {
                $scope.action_to_review_type = true;
            }
        }
    }
    function check_case_sub_expense_type() {

        if ($scope.data_general[0].sub_expense_type == 'Study' ||
            $scope.data_general[0].sub_expense_type == 'Internal Study') {
            //แสดง tab ตาม flow กรณีที่เป้น study ให้แสดงทุกรายการ
            $scope.tab_general_show = true;
            $scope.tab_node_show = true;
            $scope.tab_worksheet_show = true;
            $scope.tab_managerecom_show = true;
            $scope.tab_approver_show = true;


            $scope.tab_general_active = true;
            $scope.tab_node_active = true;
            $scope.tab_worksheet_active = true;
            $scope.tab_managerecom_active = true;
            $scope.tab_approver_active = true;

            if ($scope.selectedItemNodeView == 0) {
                if ($scope.data_node.length > 0) {
                    $scope.selectedItemNodeView = $scope.data_node[0].seq;
                }
            }
        }

    }

    $scope.getGuidWordById = function (id_guide_word) {
        var _item = $scope.master_guidwords.find(function (guidWord) {
            return guidWord.seq == id_guide_word;
        });
        // Assuming guidWord has a 'name' property
        return _item ? _item.no : '';
    }
    function set_data_general() {

        if (($scope.data_general[0].id_ram + '') == '') {
            $scope.data_general[0].id_ram = 5;
        }


        if ($scope.data_general[0].target_start_date !== null) {
            const x = $scope.data_general[0].target_start_date.split('T')[0].split("-");
            $scope.data_general[0].target_start_date = new Date(x[0], x[1] - 1, x[2]);
        }
        if ($scope.data_general[0].target_end_date !== null) {
            const x = $scope.data_general[0].target_end_date.split('T')[0].split("-");
            $scope.data_general[0].target_end_date = new Date(x[0], x[1] - 1, x[2]);
        }
              
        if ($scope.data_general[0].actual_start_date !== null) {
            const x = ($scope.data_general[0].actual_start_date.split('T')[0]).split("-");
            $scope.data_general[0].actual_start_date = new Date(x[0], x[1] - 1, x[2]);
        }
        if ($scope.data_general[0].actual_end_date !== null) {
            const x = ($scope.data_general[0].actual_end_date.split('T')[0]).split("-");
            $scope.data_general[0].actual_end_date = new Date(x[0], x[1] - 1, x[2]);
        }

        for (let i = 0; i < $scope.data_session.length; i++) {
            $scope.data_session[i].no = (i + 1);

            if ($scope.data_session[i].meeting_date !== null) {
                const x = ($scope.data_session[i].meeting_date.split('T')[0]).split("-");
                $scope.data_session[i].meeting_date = new Date(x[0], x[1] - 1, x[2]);
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

        for (let i = 0; i < $scope.master_guidwords.length; i++) {

            var seq_guide_word = Number($scope.master_guidwords[i].seq);
            var arr = $filter('filter')($scope.data_nodeguidwords, function (item) { return (item.id_guide_word == seq_guide_word); });
            if (arr.length > 0) {
                if (arr[0].selected_type == 1) {
                    //$scope.master_guidwords[i].def_selected = true;
                    //arr[0].def_selected = true; 

                    $scope.master_guidwords[i].selected = true;
                    arr[0].selected = true;
                } else {
                    //$scope.master_guidwords[i].def_selected = false;
                    //arr[0].def_selected = false;
                    $scope.master_guidwords[i].selected = false;
                    arr[0].selected = false;
                }
            } else {
                //if ($scope.master_guidwords[i].def_selected == 1 || $scope.master_guidwords[i].def_selected == true) {
                //    $scope.master_guidwords[i].def_selected = true;
                //} else {
                //    $scope.master_guidwords[i].def_selected = false;
                //}

                if ($scope.master_guidwords[i].selected == 1 || $scope.master_guidwords[i].selected == true) {
                    $scope.master_guidwords[i].selected = true;
                } else {
                    $scope.master_guidwords[i].selected = false;
                }


            }
        }


        var functional_location_audition = $scope.data_general[0].functional_location_audition;
        var xSplitFunc = (functional_location_audition).replaceAll('"', '').replace('[', '').replace(']', '').split(",");
        var _functoArr = [];
        for (var i = 0; i < xSplitFunc.length; i++) {
            _functoArr.push(xSplitFunc[i]);
        }
        console.log('_functoArr');
        if (_functoArr.length > 0) {
            $scope.data_general[0].functional_location_audition = _functoArr;
            console.log($scope.data_general[0].functional_location_audition);
        }
        return;
    }
    function set_data_nodeguidwords() {

        if ($scope.data_nodeworksheet.length > 0) {
            if (!($scope.data_nodeworksheet[0].action_type == 'new')) {
                //กรณีที่เคยมีข้อมุล ให้เอาตามที่เคยเลือกไป 
                var arr = $filter('filter')($scope.master_guidwords, { def_selected: 1 });



                return;
            }
        }

        var iNo = 1;
        for (let n = 0; n < $scope.data_node.length; n++) {
            var seq_node = Number($scope.data_node[n].seq);
            var arr = $filter('filter')($scope.master_guidwords, { def_selected: 1 });

            var arr_def = [];
            for (let i = 0; i < arr.length; i++) {

                var ar_check = $filter('filter')($scope.data_nodeguidwords,
                    { id_node: seq_node, id_guide_word: arr[i].seq });

                if (ar_check.length > 0) {
                    for (let iold = 0; iold < ar_check.length; iold++) {
                        ar_check[iold].no = iNo;
                        arr_def.push(ar_check[iold]);
                        iNo++;
                    }
                    continue;
                }

                //add new employee
                var seq = Number($scope.MaxSeqDataNodeGuidWords);

                var newInput = clone_arr_newrow($scope.data_nodeguidwords_def)[0];
                newInput.seq = seq;
                newInput.id = seq;
                newInput.no = iNo;
                newInput.id_node = Number(seq_node);
                newInput.seq_node = Number(seq_node);
                newInput.action_type = 'insert';
                newInput.action_change = 1;

                newInput.id_guide_word = arr[i].seq;
                newInput.guidewords = arr[i].guidewords;
                newInput.deviations = arr[i].deviations;
                newInput.guidewords_no = arr[i].guidewords_no;

                newInput.action_change = 1;
                newInput.action_type = 'insert'
                arr_def.push(newInput);
                iNo++;
            }

            var arr_copy_def = angular.copy($scope.data_nodeguidwords, arr_copy_def);
            $scope.data_nodeguidwords = [];
            $scope.data_nodeguidwords = $filter('filter')(arr_copy_def, function (item) {
                return (item.id_node !== seq_node);
            });
            for (let i = 0; i < arr_def.length; i++) {
                $scope.data_nodeguidwords.push(arr_def[i]);
            }
        }

    }
    function set_data_nodeworksheet() {

        var bCheckNewRows = false;
        if ($scope.data_nodeworksheet) {
            var arr = $filter('filter')($scope.data_nodeworksheet, function (item) {
                return (item.action_type == 'new');
            });
            if (arr.length > 0) {
                var newInput = clone_arr_newrow($scope.data_nodeworksheet_def)[0];
                $scope.data_nodeworksheet = [];
                $scope.data_nodeworksheet.push(newInput);
                bCheckNewRows = true;
            }
        }
        if (true) {
            if ($scope.data_nodeguidwords) {

                var xseq_causes = Number($scope.MaxSeqdata_nodeworksheetCauses);
                if (row_type == "consequences") { $scope.MaxSeqdata_nodeworksheetConsequences = Number($scope.MaxSeqdata_nodeworksheetConsequences) + 1; }
                var xseq_consequences = Number($scope.MaxSeqdata_nodeworksheetConsequences);
                if (row_type == "category") { $scope.MaxSeqdata_nodeworksheetCat = Number($scope.MaxSeqdata_nodeworksheetCat) + 1; }
                var xseq_category = Number($scope.MaxSeqdata_nodeworksheetCat);

                var row_type = "causes";
                var arr_def = []
                var arr_delete_def = []


                var iNo = 1;

                for (let n = 0; n < $scope.data_node.length; n++) {

                    var iGuidewordsNo = 1;

                    var id_node_def = Number($scope.data_node[n].seq);
                    var node_no = Number($scope.data_node[n].no);

                    //var arr_nodeguidwords = $scope.data_nodeguidwords; 
                    var arr_nodeguidwords = $filter('filter')($scope.data_nodeguidwords, function (item) { return (item.id_node == id_node_def); });
                    arr_nodeguidwords.sort((a, b) => a.no - b.no);

                    for (let i = 0; i < arr_nodeguidwords.length; i++) {

                        if (id_node_def !== arr_nodeguidwords[i].id_node) { continue; }

                        var id_guide_word_def = arr_nodeguidwords[i].id_guide_word;

                        var guidewords = arr_nodeguidwords[i].guidewords;
                        var deviations = arr_nodeguidwords[i].deviations;
                        var guidewords_no = arr_nodeguidwords[i].guidewords_no;
                        //Kuluwat 202403227 guidewords_no ให้ใช้เป็น running ตาม node แทน
                        guidewords_no = iGuidewordsNo; iGuidewordsNo += 1;

                        var arr = $filter('filter')($scope.data_nodeworksheet, function (item) {
                            return (item.id_node == id_node_def && item.id_guide_word == id_guide_word_def);
                        });

                        if (arr.length > 0) {
                            for (let iold = 0; iold < arr.length; iold++) {
                                arr[iold].no = iNo;
                                arr_def.push(arr[iold]);
                                iNo++;
                            }
                        } else {
                            $scope.MaxSeqdata_nodeworksheet = Number($scope.MaxSeqdata_nodeworksheet) + 1;
                            var xseq = Number($scope.MaxSeqdata_nodeworksheet);
                            if (row_type == "causes") { $scope.MaxSeqdata_nodeworksheetCauses = Number($scope.MaxSeqdata_nodeworksheetCauses) + 1; }


                            var newInput = []; angular.copy($scope.data_nodeworksheet, newInput)[0];
                            newInput = newInput[0];

                            newInput.seq = xseq;
                            newInput.id = xseq;
                            newInput.id_node = id_node_def;
                            newInput.seq_node = id_node_def;

                            newInput.row_type = row_type;//guideword,causes,consequences,cat
                            newInput.id_guide_word = id_guide_word_def;
                            newInput.seq_guide_word = id_guide_word_def;
                            newInput.guidewords = guidewords;
                            newInput.deviations = deviations;
                            newInput.guidewords_no = guidewords_no;

                            newInput.seq_causes = xseq_causes;
                            newInput.seq_consequences = xseq_consequences;
                            newInput.seq_category = xseq_category;

                            newInput.node_no = node_no;

                            newInput.no = iNo;
                            newInput.causes_no = 1;
                            newInput.consequences_no = 1;
                            //newInput.recommendations_no = 1;
                            newInput.category_no = 1;

                            newInput.action_type = 'insert';
                            newInput.action_change = 1;
                            newInput.action_status = 'Open';

                            arr_def.push(newInput);
                        }
                        iNo++;
                    }
                }

                //delete 
                for (let i = 0; i < $scope.data_nodeworksheet.length; i++) {
                    var item_def = $scope.data_nodeworksheet[i];
                    var arr = $filter('filter')(arr_def, function (item) {
                        return (item.id_node == item_def.id_node && item.id_guide_word == item_def.id_guide_word
                            && item.seq == item_def.seq);
                    });
                    if (arr.length > 0) {
                        arr_delete_def.push(arr[0]);
                    }
                }

                angular.copy(arr_def, $scope.data_nodeworksheet);

                for (let i = 0; i < $scope.data_nodeworksheet.length; i++) {
                    $scope.data_nodeworksheet[i].index_rows = i;
                }

                running_recommendations_no();

                set_data_managerecom();

                for (let i = 0; i < $scope.data_nodeguidwords.length; i++) {
                    var seq_node = $scope.data_nodeguidwords[i].seq_node;
                    var seq_guide_word = $scope.data_nodeguidwords[i].id_guide_word;
                    running_no_causes(seq_node, seq_guide_word);
                }
            }
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
            var arr_worksheet = $scope.data_nodeworksheet;
            for (var w = 0; w < arr_worksheet.length; w++) {

                //recommendations_no
                arr_worksheet[w].recommendations_no = (arr_worksheet[w].recommendations_no == null ? arr_worksheet[w].consequences_no : arr_worksheet[w].recommendations_no);
                var arr_node = $filter('filter')($scope.data_node, function (item) {
                    return (item.id == arr_worksheet[w].id_node);
                });
                if (arr_node.length > 0) {
                    arr_worksheet[w].node_no = arr_node[0].no;
                    arr_worksheet[w].node = arr_node[0].node;
                }
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

    // <==== (Kul)Session zone function  ====>    
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
        // Set 1st alway 1
        if (arr_items.length > 0) {arr_items[0].no = 1;}
        arr_items.sort((a, b) => a.no - b.no);

    }
    $scope.addDataSession = function (seq, index) {

        $scope.MaxSeqDataSession = Number($scope.MaxSeqDataSession) + 1;
        var xValues = $scope.MaxSeqDataSession;

        var arr = $filter('filter')($scope.data_session, function (item) { return (item.seq == seq); });
        var iNo = 1; if (arr.length > 0) { iNo = arr[0].no; }//บอกได้ว่ากดจาก index ไหน

        var newInput = clone_arr_newrow($scope.data_session_def)[0];
        newInput.seq = xValues;
        newInput.id = xValues;
        newInput.no = (iNo + 1);
        newInput.action_type = 'insert';
        newInput.action_change = 1;

        running_no_level1_lv1($scope.data_session, iNo, index, newInput);

        $scope.selectdata_session = xValues;
        apply();
    }
    $scope.copyDataSession = function (seq, index) {

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

        };

        running_no_level1_lv1($scope.data_session, iNo, index, newInput);

        $scope.selectdata_session = xValues;

        if (true) {
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
        if (true) {
            var arr_copy = [];
            angular.copy($scope.data_approve, arr_copy);
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
            var keysToClear = ['meeting_date', 'meeting_end_time', 'meeting_start_time'];
            //meeting_start_time_hh,meeting_start_time_mm,meeting_end_time_hh,meeting_end_time_mm
            var keysToClear = ['meeting_date', 'meeting_end_time', 'meeting_start_time', 'meeting_start_time_hh', 'meeting_start_time_mm', 'meeting_end_time_hh', 'meeting_end_time_mm'];

            keysToClear.forEach(function (key) {
                $scope.data_session[0][key] = null;
            });

            $scope.data_session[0].no = 1;
        }
        running_no_level1_lv1($scope.data_session, null, index, null);

        //delete employee lower session

        if (true) {
            var arr_copy = [];
            angular.copy($scope.data_memberteam, arr_copy);
            var arrmember = $filter('filter')(arr_copy, function (item) { return (item.id_session == seq); });
            for (let i = 0; i < arrmember.length; i++) {
                arrmember[i].action_type = 'delete';
                arrmember[i].action_change = 1;
            }
        }
        if (true) {
            var arr_copy = [];
            angular.copy($scope.data_approve, arr_copy);
            var arrmember = $filter('filter')(arr_copy, function (item) { return (item.id_session == seq); });
            for (let i = 0; i < arrmember.length; i++) {
                arrmember[i].action_type = 'delete';
                arrmember[i].action_change = 1;
            }
        }

        apply();
    };
    $scope.openModalEmployeeCheck = function (seq) {
        $scope.selectdata_session = seq;

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
    $scope.AddDataEmpSession = function () {

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
            //var seq = $scope.selectdata_memberteam;
            var seq = $scope.MaxSeqDataMemberteam;

            var newInput = clone_arr_newrow($scope.data_memberteam_def)[0];
            newInput.seq = seq;
            newInput.id = seq;
            newInput.no = (0);
            newInput.id_session = Number(seq_session);
            newInput.action_type = 'insert';
            newInput.action_change = 1;

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

        running_no_level1($scope.data_memberteam, null, null);

        apply();
    };
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
            var keysToClear = ['user_name', 'user_displayname'];


            keysToClear.forEach(function (key) {
                $scope.data_memberteam[0][key] = null;
            });

            $scope.data_memberteam[0].no = 1;
        }

        running_no_level1($scope.data_memberteam, null, null);
        apply();
    };

    $scope.openModalMatrix = function(){
        console.log("will pop up")
        //$('#modalMatrix').modal('show');
        $('#modalMatrix').modal({
            backdrop: 'static',
            keyboard: false 
        }).modal('show');
    }


    // <==== (Kul)Drawing & Reference zone function  ====>     
    $scope.addDrawingDoc = function (seq, index) {

        $scope.MaxSeqDataDrawingDoc = ($scope.MaxSeqDataDrawingDoc) + 1;
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
        console.log(newInput);

        running_no_level1_lv1($scope.data_drawing, iNo, index, newInput);

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
        running_no_level1($scope.data_drawing, iNo, index, newInput);

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
        running_no_level1($scope.data_drawing, null, index, null);

        apply();
    };

    // <==== (Kul) Node List zone function  ====>   
    $scope.addDataNodeList = function (seq, index) {
        
        $scope.MaxSeqDataNodeList = Number($scope.MaxSeqDataNodeList) + 1;
        var xValues = Number($scope.MaxSeqDataNodeList);

        var arr = $filter('filter')($scope.data_node, function (item) { return (item.seq == seq); });
        var iNo = 1; if (arr.length > 0) {
            iNo = arr[0].no;
        }

        var newInput = clone_arr_newrow($scope.data_node_def)[0];
        newInput.seq = xValues;
        newInput.id = xValues;
        newInput.no = (iNo);
        newInput.action_type = 'insert';
        newInput.action_change = 1;
        console.clear();
        console.log(newInput);

        running_no_level1_lv1($scope.data_node, iNo, index, newInput);

        $scope.selectdata_node = xValues;

        //add NodeDrawing  
        $scope.addDataNodeDrawing("", $scope.selectdata_node);

        //add NodeDrawing  
        $scope.AddDataGuideWords(false);

        add_data_nodeworksheet_new_node(xValues);

        resetDataNodeList();
    }

    function add_data_nodeworksheet_new_node(seq_node_select) {

        if ($scope.data_nodeguidwords) {

            var xseq_causes = Number($scope.MaxSeqdata_nodeworksheetCauses);
            if (row_type == "consequences") { $scope.MaxSeqdata_nodeworksheetConsequences = Number($scope.MaxSeqdata_nodeworksheetConsequences) + 1; }
            var xseq_consequences = Number($scope.MaxSeqdata_nodeworksheetConsequences);
            if (row_type == "category") { $scope.MaxSeqdata_nodeworksheetCat = Number($scope.MaxSeqdata_nodeworksheetCat) + 1; }
            var xseq_category = Number($scope.MaxSeqdata_nodeworksheetCat);
            var row_type = "causes";

            var index_rows = 0;
            var iNo = 1;
            var arr_node = $filter('filter')($scope.data_node, function (item) { return (item.id == seq_node_select); });
            for (let n = 0; n < arr_node.length; n++) {

                var id_node_def = Number(arr_node[n].seq);

                if (id_node_def == seq_node_select) {
                    var arr_nodeguidwords = $filter('filter')($scope.data_nodeguidwords, function (item) {
                        return (item.id_node == id_node_def);
                    });
                    arr_nodeguidwords.sort((a, b) => a.no - b.no);

                    for (let i = 0; i < arr_nodeguidwords.length; i++) {

                        if (id_node_def !== arr_nodeguidwords[i].id_node) { continue; }

                        var id_guide_word_def = arr_nodeguidwords[i].id_guide_word;

                        var guidewords = arr_nodeguidwords[i].guidewords;
                        var deviations = arr_nodeguidwords[i].deviations;
                        var guidewords_no = arr_nodeguidwords[i].guidewords_no;

                        if (true) {
                            $scope.MaxSeqdata_nodeworksheet = Number($scope.MaxSeqdata_nodeworksheet) + 1;
                            var xseq = Number($scope.MaxSeqdata_nodeworksheet);
                            if (row_type == "causes") { $scope.MaxSeqdata_nodeworksheetCauses = Number($scope.MaxSeqdata_nodeworksheetCauses) + 1; }

                            var newInput = clone_arr_newrow($scope.data_nodeworksheet_def)[0];

                            newInput.seq = xseq;
                            newInput.id = xseq;
                            newInput.id_node = id_node_def;
                            newInput.seq_node = id_node_def;

                            newInput.row_type = row_type;//guideword,causes,consequences,cat
                            newInput.id_guide_word = id_guide_word_def;
                            newInput.seq_guide_word = id_guide_word_def;
                            newInput.guidewords = guidewords;
                            newInput.deviations = deviations;
                            newInput.guidewords_no = guidewords_no;

                            newInput.seq_causes = xseq_causes;
                            newInput.seq_consequences = xseq_consequences;
                            newInput.seq_category = xseq_category;

                            //newInput.index_rows = index_rows;
                            newInput.no = iNo;
                            newInput.causes_no = 1;
                            newInput.consequences_no = 1;
                            //newInput.recommendations_no = iNo;
                            newInput.category_no = 1;

                            newInput.action_type = 'insert';
                            newInput.action_change = 1;
                            newInput.action_status = 'Open';

                            $scope.data_nodeworksheet.push(newInput);

                            $scope.selectdata_nodeworksheet = xseq;
                            iNo++;
                            index_rows++;
                        }
                    }
                }
            }

            //running_index_nodeworksheet('');
            for (let i = 0; i < $scope.data_nodeworksheet.length; i++) {
                $scope.data_nodeworksheet[i].index_rows = i;
            }

            var arr_nodeguidwords = $filter('filter')($scope.data_nodeguidwords, function (item) { return (item.seq_node == seq_node_select); });
            for (let i = 0; i < arr_nodeguidwords.length; i++) {
                var seq_node = arr_nodeguidwords[i].seq_node;
                var seq_guide_word = arr_nodeguidwords[i].id_guide_word;
                running_no_causes(seq_node, seq_guide_word);
            }

        }
    }

    $scope.copyDataNodeList = function (seq, index) {

        $scope.MaxSeqDataNodeList = Number($scope.MaxSeqDataNodeList) + 1;
        var xValues = Number($scope.MaxSeqDataNodeList);
        var id_node = xValues;

        var arr = $filter('filter')($scope.data_node, function (item) {
            return (item.seq == seq);
        });
        var iNo = 1; if (arr.length > 0) { iNo = arr[0].no; }

        for (let i = 0; i < arr.length; i++) {

            var newInput = clone_arr_newrow($scope.data_node_def)[0];
            newInput.seq = Number(xValues);
            newInput.id = Number(xValues);
            newInput.no = (iNo);
            newInput.action_type = 'insert';
            newInput.action_change = 1;

            newInput.node = arr[i].node;
            newInput.design_intent = arr[i].design_intent;
            newInput.design_conditions = arr[i].design_conditions;
            newInput.operating_conditions = arr[i].operating_conditions;
            newInput.node_boundary = arr[i].node_boundary;
            newInput.node_drawing = arr[i].node_drawing;
        };
        for (let i = (iNo - 1); i < $scope.data_node.length; i++) {
            $scope.data_node[i].no = ($scope.data_node[i].no + 1);
        }

        running_no_level1_lv1($scope.data_node, iNo, index, newInput);

        $scope.selectdata_node = xValues;

        console.clear();
        console.log(newInput);

        if ($scope.data_nodedrawing != null) {
            var arr_check = $filter('filter')($scope.data_nodedrawing, function (item) {
                return (item.id_node == xValues);
            });
            if (arr_check.length > 0) { return; }
        }
        var arr_copy = [];
        angular.copy($scope.data_nodedrawing, arr_copy);
        var arrmember = $filter('filter')(arr_copy, function (item) { return (item.id_node == seq); });
        for (let i = 0; i < arrmember.length; i++) {

            $scope.MaxSeqDataNodeDrawing = Number($scope.MaxSeqDataNodeDrawing) + 1;
            var xMaxSeqDataNodeDrawing = $scope.MaxSeqDataNodeDrawing;

            arrmember[i].id_node = Number(id_node);
            arrmember[i].action_type = 'insert';
            arrmember[i].action_change = 1;

            arrmember[i].seq = xMaxSeqDataNodeDrawing;
            arrmember[i].id = xMaxSeqDataNodeDrawing;

            $scope.data_nodedrawing.push(arrmember[i]);
        }

        set_data_nodeworksheet();
    }

    $scope.removeDataNodeList = function (seq, index) {

        var arrdelete = $filter('filter')($scope.data_node, function (item) {
            return (item.seq == seq && item.action_type == 'update');
        });
        if (arrdelete.length > 0) { $scope.data_node_delete.push(arrdelete[0]); }

        $scope.data_node = $filter('filter')($scope.data_node, function (item) {
            return !(item.seq == seq);
        });

        if ($scope.data_node.length == 0) {
            $scope.addDataNodeList();
        }

        running_no_level1_lv1($scope.data_node, 1, 0, null);


        //delete NodeDrawing
        var arrdelete = $filter('filter')($scope.data_nodedrawing, function (item) {
            return (item.id_node == seq && item.action_type == 'update');
        });
        if (arrdelete.length > 0) { $scope.data_nodedrawing_delete.push(arrdelete[0]); }

        $scope.data_nodedrawing = $filter('filter')($scope.data_nodedrawing, function (item) {
            return !(item.id_node == seq);
        });
        if ($scope.data_nodedrawing.length == 0) {
            $scope.MaxSeqDataNodeDrawing = Number($scope.MaxSeqDataNodeDrawing) + 1;
            $scope.addDataNodeDrawing($scope.MaxSeqDataNodeDrawing, seq);
        }

    };

    function resetDataNodeList() {
        for (var i = 24; i < $scope.data_nodeworksheet.length; i++) {
            $scope.data_nodeworksheet[i].causes = null;
            $scope.data_nodeworksheet[i].consequences = null;
            $scope.data_nodeworksheet[i].category_type = null;
            $scope.data_nodeworksheet[i].ram_befor_risk = null;
            $scope.data_nodeworksheet[i].ram_befor_security = null;
            $scope.data_nodeworksheet[i].ram_befor_likelihood = null;
            $scope.data_nodeworksheet[i].major_accident_event = null;
            $scope.data_nodeworksheet[i].existing_safeguards = null;
            $scope.data_nodeworksheet[i].ram_after_risk = null;
            $scope.data_nodeworksheet[i].ram_after_security = null;
            $scope.data_nodeworksheet[i].ram_after_likelihood = null;
            $scope.data_nodeworksheet[i].recommendations = null;
            $scope.data_nodeworksheet[i].safety_critical_equipment_tag = null;
            $scope.data_nodeworksheet[i].responder_user_id = null;
            $scope.data_nodeworksheet[i].responder_user_name = null;
            $scope.data_nodeworksheet[i].responder_user_displayname = null;
            $scope.data_nodeworksheet[i].responder_user_email = null;
            $scope.data_nodeworksheet[i].responder_user_img = null;
        }
        console.log('reset => ',$scope.data_nodeworksheet)
    }


    // <==== (Kul) NodeDrawing zone function  ====>
    $scope.addDataNodeDrawing = function (seq, seq_node) {

        $scope.MaxSeqDataNodeDrawing = Number($scope.MaxSeqDataNodeDrawing) + 1;
        var xValues = $scope.MaxSeqDataNodeDrawing;

        var arr = $filter('filter')($scope.data_nodedrawing, function (item) {
            return (item.seq == seq && item.id_node == seq_node);
        });
        var iNo = 1; if (arr.length > 0) { iNo = arr[0].no; }

        var newInput = clone_arr_newrow($scope.data_nodedrawing_def)[0];
        newInput.seq = xValues;
        newInput.id = xValues;
        newInput.no = (iNo + 1);
        newInput.id_node = Number(seq_node);
        newInput.seq_node = Number(seq_node);

        newInput.action_type = 'insert';
        newInput.action_change = 1;

        console.log(newInput);

        $scope.data_nodedrawing.push(newInput);

    };
    $scope.removeDataNodeDrawing = function (seq, seq_node) {

        var arrdelete = $filter('filter')($scope.data_nodedrawing, function (item) {
            return (item.seq == seq && item.action_type == 'update');
        });
        if (arrdelete.length > 0) { $scope.data_nodedrawing_delete.push(arrdelete[0]); }

        $scope.data_nodedrawing = $filter('filter')($scope.data_nodedrawing, function (item) {
            return !(item.seq == seq);
        });

        if ($scope.data_nodedrawing.length == 0) {
            $scope.MaxSeqDataNodeList = Number($scope.MaxSeqDataNodeList) + 1;
            $scope.addDataNodeDrawing($scope.MaxSeqDataNodeDrawing, seq_node);
        }
    };
    $scope.updateDataNodeDrawing = function (seq, seq_node, seq_drawing) {

        var arr_def = $filter('filter')($scope.data_nodedrawing, function (item) {
            return (item.seq == seq && item.id_node == seq_node);
        });
        if (arr_def.length > 0) {
            arr_def[0].id_drawing = Number(seq_drawing);
            apply();
        }

    };

    // <==== (Kul) GuideWords zone function  ====>
    $scope.openModalGuideWords = function (seq) {
        $scope.selectdata_node = seq;

        $scope.GuideWordsfilterCriteria.DeviationsText = '';
        $scope.GuideWordsfilterCriteria.GuideWordsText = '';
        $scope.GuideWordsfilterCriteria.ProcessDeviationsText = '';
        $scope.GuideWordsfilterCriteria.AreaofAppText = '';
        $scope.GuideWordsfilterCriteria.ActionText = 'ALL';

        var bCheckNewDataByNode = true;
        var ar_check_by_node = $filter('filter')($scope.data_nodeguidwords, { id_node: seq });
        if (ar_check_by_node.length == 0) { bCheckNewDataByNode = false; }
        var ar_check_by_node = $filter('filter')($scope.data_nodeguidwords, { id_node: seq, id_guide_word: null });
        if (ar_check_by_node.length > 0) { bCheckNewDataByNode = false; }


        var arr = $scope.master_guidwords;
        for (let i = 0; i < arr.length; i++) {

            try {
                var ar_check = $filter('filter')($scope.data_nodeguidwords, { id_node: seq, id_guide_word: arr[i].seq });
                if (ar_check.length > 0) {
                    $scope.master_guidwords[i].selected = true;
                    //$scope.master_guidwords[i].def_selected = true;
                } else {
                    $scope.master_guidwords[i].selected = (arr[i].def_selected == 1 ? true : false);
                }
            } catch (e) { }
        };

        if (bCheckNewDataByNode == false) {
            for (let i = 0; i < arr.length; i++) {
                $scope.master_guidwords[i].selected = true;
            };
        }

        apply();

        $('#modalGuideWords').modal('show');

    };
    $scope.AddDataGuideWords = function (change_guideword) {

        //if (true) { 
        //    for (let i = 0; i < $scope.master_guidwords.length; i++) {  ;
        //        $scope.master_guidwords[i].def_selected = ($scope.master_guidwords[i].selected ? 1 : 0);
        //    }
        //}

        //var seq_node = $scope.selectdata_node;
        var arr_def = [];
        if ($scope.data_node.length > 0) {

            //loop add guide by node
            if (true) {
                for (let iNode = 0; iNode < $scope.data_node.length; iNode++) {

                    var seq_node = $scope.data_node[iNode].seq;
                    var arr = $filter('filter')($scope.master_guidwords, { def_selected: 1 });
                    arr = $filter('filter')($scope.master_guidwords, { selected: true });
                    //if (change_guideword) { arr = $filter('filter')($scope.master_guidwords, { def_selected: 1, selected: true }); }
                    //else {
                    //    //กรณีที่เป็นการเพิ่ม Node และไม่ใช่ Node ใหม่ที่เพิ่ม ไม่ต้อง newrow
                    //    if (!(seq_node == $scope.selectdata_node)) { break; }
                    //} 
                    for (let i = 0; i < arr.length; i++) {

                        var ar_check = $filter('filter')($scope.data_nodeguidwords, { id_node: seq_node, id_guide_word: arr[i].seq });
                        if (ar_check.length > 0) {
                            //ข้อมูลเดิม
                            arr_def.push(ar_check[0]);
                            continue;
                        } else {

                            //add new Guidwords in node
                            var seq = Number($scope.MaxSeqDataNodeGuidWords);

                            var newInput = clone_arr_newrow($scope.data_nodeguidwords_def)[0];
                            newInput.seq = seq;
                            newInput.id = seq;
                            newInput.no = (0);
                            newInput.id_node = Number(seq_node);
                            newInput.seq_node = Number(seq_node);
                            newInput.action_type = 'insert';
                            newInput.action_change = 1;

                            newInput.id_guide_word = arr[i].seq;
                            newInput.guidewords = arr[i].guidewords;
                            newInput.deviations = arr[i].deviations;
                            newInput.guidewords_no = arr[i].guidewords_no;

                            arr_def.push(newInput);
                        }

                        $scope.MaxSeqDataNodeGuidWords = Number($scope.MaxSeqDataNodeGuidWords) + 1;
                    }

                }


                var arr_copy_def = angular.copy($scope.data_nodeguidwords, arr_copy_def);

                //update ข้อมูลทั้งหมดใส่ใน data_nodeguidwords  
                $scope.data_nodeguidwords = [];
                //for (let i = 0; i < arr_def.length; i++) {
                //    $scope.data_nodeguidwords.push(arr_def[i]);
                //}
                for (let iNode = 0; iNode < $scope.data_node.length; iNode++) {
                    var seq_node = $scope.data_node[iNode].seq;
                    var arrNode_def = $filter('filter')(arr_def, function (item) {
                        return (item.seq_node == seq_node);
                    });
                    var arr_nodeguidwords = arrNode_def.sort((a, b) => {
                        return parseFloat(a.guidewords_no) - parseFloat(b.guidewords_no);
                    });

                    for (let i = 0; i < arr_nodeguidwords.length; i++) {
                        $scope.data_nodeguidwords.push(arr_nodeguidwords[i]);
                    }
                }



                //delete ข้อมูล guidwords เดิมที่ไม่ได้เลือกในของใหม่ เทียบจาก seq guidwords
                for (let i = 0; i < arr_copy_def.length; i++) {
                    var id_guide_word_check = arr_copy_def[i].id_guide_word;
                    var arrdelete = $filter('filter')($scope.data_nodeguidwords, function (item) {
                        return (item.id_guide_word == id_guide_word_check);
                    });
                    if (arrdelete.length == 0) {
                        if (arr_copy_def[i].action_type == 'update') {
                            $scope.data_nodeguidwords_delete.push(arr_copy_def[i]);
                            continue;
                        }
                    }

                    ////add ข้อมูลเดิมเก่า
                    //$scope.data_nodeguidwords.push(arr_copy_def[i]);
                }
                running_no_level1($scope.data_nodeguidwords, null, null);

            }


            //add worksheet
            if ($scope.data_node.length > 0) { set_data_nodeworksheet(); }
            apply();

        }

        console.log("AddDataGuideWords seq:" + $scope.selectdata_node);
        console.log($scope.data_nodeguidwords);

        $('#modalGuideWords').modal('hide');
    };
    $scope.actionChangeGuidwords = function (_arr, _selected) {
        return;
        _arr.selected = !(_selected);

        apply();
    }

    // <==== (Kul) RAM  ====>
    $scope.openModalNewRAM = function (seq) {

        $('#modalNewRAM').modal('show');
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

            newInput.action_change = 1;
            newInput.action_type = 'insert'
            $scope.master_ram.push(newInput);
        }
        var json_ram_master = angular.toJson($scope.master_ram);;

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
                console.log(arr);
                if (arr.msg[0].status == 'true') {

                    //แก้ไขเบื้องต้น เนื่องจาก path file ผิดต้องเป็น folder hazop
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
    $scope.DataCategory = [{ id: "P", name: "P", description: "People" },
    { id: "A", name: "A", description: "Assets" },
    { id: "E", name: "E", description: "Environment" },
    { id: "R", name: "R", description: "Reputation" },
    { id: "Q", name: "Q", description: "Product Quality" },];


    $scope.viewDataNodeList = function (seq) {
        $scope.selectedItemNodeView = seq;
        console.log($scope);
        try {
            apply();
        } catch { }
    };

    $scope.adddata_nodeworksheet_lv1 = function (row_type, item, index) {
        console.log("u click to add new data for",row_type,"at cuase row index",index)
        if (true) {
            if (row_type.indexOf('causes') > -1) { row_type = 'causes'; }
            else if (row_type.indexOf('consequences') > -1) { row_type = 'consequences'; }
            else if (row_type.indexOf('category') > -1) { row_type = 'category'; }

            if (item.seq_causes == null) {
                $scope.MaxSeqdata_nodeworksheetCauses = Number($scope.MaxSeqdata_nodeworksheetCauses) + 1;
                item.seq_causes = $scope.MaxSeqdata_nodeworksheetCauses;
            }
            if (item.seq_consequences == null) {
                $scope.MaxSeqdata_nodeworksheetConsequences = Number($scope.MaxSeqdata_nodeworksheetConsequences) + 1;
                item.seq_consequences = $scope.MaxSeqdata_nodeworksheetConsequences;
            }
            if (item.seq_category == null) {
                $scope.MaxSeqdata_nodeworksheetCat = Number($scope.MaxSeqdata_nodeworksheetCat) + 1;
                item.seq_category = $scope.MaxSeqdata_nodeworksheetCat;
            }
            item.seq_guide_word = (item.seq_guide_word == null ? item.id_guide_word : item.seq_guide_word);

        }

        var seq_node = item.seq_node;
        var seq_guide_word = (item.seq_guide_word == null ? item.id_guide_word : item.seq_guide_word);
        var seq = item.seq;
        var seq_causes = item.seq_causes;
        var seq_consequences = item.seq_consequences;
        var seq_category = item.seq_category;

        var index_rows = Number(item.index_rows);
        var no = Number(item.no);
        var causes_no = Number(item.causes_no);
        var consequences_no = Number(item.consequences_no);
        var category_no = Number(item.category_no);

        var guidewords = item.guidewords;
        var deviations = item.deviations;
        var guidewords_no = item.guidewords_no;

        var arr_def = [];
        angular.copy($scope.data_nodeworksheet, arr_def);
        //row now //where we click at cuase number?
        var iNo = no;
        console.log("u click to add new data for",row_type,"at cuase row iNo",iNo)
        if (row_type == "causes") {
            var arr = $filter('filter')(arr_def, function (_item) {
                return (_item.no >= no && _item.id_node == seq_node && _item.seq_guide_word == seq_guide_word
                    && _item.seq_causes == seq_causes);
            });
            if (arr.length > 0) {
                arr.sort((a, b) => a.no - b.no);
                iNo = arr[arr.length - 1].no;
                index_rows = arr[arr.length - 1].index_rows;
            }

        } else if (row_type == "consequences") {
            var arr = $filter('filter')(arr_def, function (_item) {
                return (_item.no >= no && _item.id_node == seq_node && _item.seq_guide_word == seq_guide_word
                    && _item.seq_causes == seq_causes && _item.seq_consequences == seq_consequences);
            });
            if (arr.length > 0) {
                iNo = arr[arr.length - 1].no;
                index_rows = arr[arr.length - 1].index_rows;
            }
        } else if (row_type == "category") {
            var arr = $filter('filter')(arr_def, function (_item) {
                return (_item.no >= no && _item.id_node == seq_node && _item.seq_guide_word == seq_guide_word
                    && _item.seq_causes == seq_causes && _item.seq_consequences == seq_consequences && _item.seq_category == seq_category);
            });
            if (arr.length > 0) {
                iNo = arr[arr.length - 1].no;
                index_rows = arr[arr.length - 1].index_rows;
            }
        }

        $scope.MaxSeqdata_nodeworksheet = Number($scope.MaxSeqdata_nodeworksheet) + 1;
        var xseq = $scope.MaxSeqdata_nodeworksheet;

        if (row_type == "causes") {
            $scope.MaxSeqdata_nodeworksheetCauses = Number($scope.MaxSeqdata_nodeworksheetCauses) + 1;
            seq_causes = $scope.MaxSeqdata_nodeworksheetCauses;

            //กรณีที่เป็น causes ให้ +1 
            causes_no += 1;
            consequences_no = 1;
            category_no = 1;

            console.log("Now it will give new no for",row_type,"it's",causes_no)

        }
        if (row_type == "consequences") {
            $scope.MaxSeqdata_nodeworksheetConsequences = Number($scope.MaxSeqdata_nodeworksheetConsequences) + 1;
            seq_consequences = $scope.MaxSeqdata_nodeworksheetConsequences;

            //กรณีที่เป็น consequences ให้ +1
            consequences_no += 1;
            category_no = 1;

            console.log("Now it will give new no for",row_type,"it's",consequences_no)

        }
        if (row_type == "category") {
            $scope.MaxSeqdata_nodeworksheetCat = Number($scope.MaxSeqdata_nodeworksheetCat) + 1;
            seq_category = $scope.MaxSeqdata_nodeworksheetCat;

            //กรณีที่เป็น cat ให้ +1
            category_no += 1;

            console.log("Now it will give new no for",row_type,"it's",category_no)
            
        }
       

        var newInput = clone_arr_newrow($scope.data_nodeworksheet_def)[0];
        newInput.seq = xseq;
        newInput.id = xseq;
        newInput.id_node = seq_node;
        newInput.seq_node = seq_node;

        newInput.row_type = row_type;//guideword,causes,consequences,cat

        newInput.id_guide_word = seq_guide_word;
        newInput.seq_guide_word = seq_guide_word;
        newInput.guidewords = guidewords;
        newInput.deviations = deviations;
        newInput.guidewords_no = guidewords_no;

        newInput.seq_causes = seq_causes;
        newInput.seq_consequences = seq_consequences;
        newInput.seq_category = seq_category;

        newInput.index_rows = (index_rows + 0.5);
        newInput.no = (no + 0.5);
        newInput.causes_no = causes_no;
        newInput.consequences_no = consequences_no;
        newInput.category_no = category_no;

        newInput.action_type = 'insert';
        newInput.action_change = 1;
        newInput.action_status = 'Open';

        //copy detail row befor
        if (row_type == "causes") {}
        else if (row_type == "consequences") {
            newInput.causes = item.causes;

        } else if (row_type == "category") {
            newInput.causes = item.causes;
            newInput.consequences = item.consequences;
        }


        $scope.selectdata_nodeworksheet = xseq;
        running_index_worksheet(seq);
        index = index_rows;

        // console.clear();
        running_index_level1_lv1($scope.data_nodeworksheet, iNo, index, newInput);

        if (row_type == "causes" || row_type == "consequences") {
            running_no_causes(seq_node, seq_guide_word);
            running_no_consequences(seq_node, seq_guide_word, seq_causes);
        } else if (row_type == "category") {
            running_no_category(seq_node, seq_guide_word, seq_causes,seq_consequences);
        }

        running_recommendations_no();

        //re-sort all again
        $scope.data_nodeworksheet.sort((a, b) => {
            if (a.guidewords_no !== b.guidewords_no) {
              return a.guidewords_no - b.guidewords_no;
            } else if (a.causes_no !== b.causes_no) {
              return a.causes_no - b.causes_no;
            }else if (a.consequences_no !== b.consequences_no) {
                return a.consequences_no - b.consequences_no;
            }  else {
              return a.category_no - b.category_no;
            }
        });
        apply();
    }

    $scope.copyNodeList = function (level, seq) {
        if (level && seq) {
            $scope.data_copy = $scope.data_nodeworksheet.filter(function(item) {
                return item.seq === seq;
            });
        }
    }

    $scope.pasteNodeList = function (level, seq) {
        if ($scope.data_copy && level && seq) {
            $scope.data_nodeworksheet.forEach(element => {
                if (element.seq === seq) {
                   element.action_change = 1
                   element.causes = $scope.data_copy[0].causes;
                   element.consequences = $scope.data_copy[0].consequences;
                   element.category_type = $scope.data_copy[0].category_type;
                   element.ram_befor_risk = $scope.data_copy[0].ram_befor_risk;
                   element.ram_befor_security = $scope.data_copy[0].ram_befor_security;
                   element.ram_befor_likelihood = $scope.data_copy[0].ram_befor_likelihood;
                   element.major_accident_event = $scope.data_copy[0].major_accident_event;
                   element.existing_safeguards = $scope.data_copy[0].existing_safeguards;
                    //element.recommendations_no = $scope.data_copy[0].recommendations_no;
                   element.ram_after_risk = $scope.data_copy[0].ram_after_risk;
                   element.ram_after_security = $scope.data_copy[0].ram_after_security;
                   element.ram_after_likelihood = $scope.data_copy[0].ram_after_likelihood;
                   element.recommendations = $scope.data_copy[0].recommendations;
                   element.safety_critical_equipment_tag = $scope.data_copy[0].safety_critical_equipment_tag;
                   element.responder_user_id = $scope.data_copy[0].responder_user_id;
                   element.responder_user_name = $scope.data_copy[0].responder_user_name;
                   element.responder_user_displayname = $scope.data_copy[0].responder_user_displayname;
                   element.responder_user_email = $scope.data_copy[0].responder_user_email;
                   element.responder_user_img = $scope.data_copy[0].responder_user_img;
                }
            });
            apply();
        }
    }

    function running_recommendations_no() {
        if (true) {
            //recommendations != '' ให้ running action no  
            var arr_copy_def = angular.copy($scope.data_nodeworksheet, arr_copy_def);
            arr_copy_def.sort((a, b) => Number(b.recommendations_no) - Number(a.recommendations_no));
            var recommendations_no = Number(Number(arr_copy_def[0].recommendations_no) + 1);

            for (var i = 0; i < $scope.data_nodeworksheet.length; i++) {
                if ($scope.data_nodeworksheet[i].recommendations_no == null ||
                    $scope.data_nodeworksheet[i].recommendations_no == '') {
                    $scope.data_nodeworksheet[i].recommendations_no = recommendations_no;
                    recommendations_no += 1;
                }
            }
        }
    }

    $scope.removeDataNodeWorksheet = function (row_type, item, index) {
        var seq_node = item.seq_node;
        var seq_guide_word = (item.seq_guide_word == null ? item.id_guide_word : item.seq_guide_word);
        var seq = item.seq;
        var seq_causes = item.seq_causes;
        var seq_consequences = item.seq_consequences;
        var seq_category = item.seq_category;

        //กรณีที่เป็นรายการเดียวไม่ต้องลบ ให้ cleare field 
        var arrCheck = [];
        if (true) {
            if (row_type == "causes") {
                var arrCheck = $filter('filter')($scope.data_nodeworksheet, function (_item) {
                    return (_item.id_node == seq_node && _item.seq_guide_word == seq_guide_word);
                });
            } else if (row_type == "consequences") {
                var arrCheck = $filter('filter')($scope.data_nodeworksheet, function (_item) {
                    return (_item.id_node == seq_node && _item.seq_guide_word == seq_guide_word
                        && _item.seq_causes == seq_causes);
                });
            } else if (row_type == "category") {
                var arrCheck = $filter('filter')($scope.data_nodeworksheet, function (_item) {
                    return (_item.id_node == seq_node
                        && _item.seq_guide_word == seq_guide_word
                        && _item.seq_causes == seq_causes
                        && _item.seq_consequences == seq_consequences);
                });
            }
        }
        if (arrCheck.length == 1) {
            //กรณีที่เหลือ row เดียว  
            arrCheck[0].action_type = 'update';
            arrCheck[0].action_change = 1;
            arrCheck[0].action_status = 'Open';

            arrCheck[0].index_rows = 0;
            arrCheck[0].no = 1;

            arrCheck[0].seq_causes = 1;
            arrCheck[0].seq_causes = 1;
            arrCheck[0].seq_consequences = 1;
            arrCheck[0].seq_category = 1;

            arrCheck[0].causes = null;
            arrCheck[0].consequences = null;
            arrCheck[0].category = null;
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
  
            apply();
            return;
        }

        //Delete row select and upper row
        if (true) {
            if (row_type == "causes") {

                //เก็บค่า Delete 
                var arrdelete = $filter('filter')($scope.data_nodeworksheet, function (item) {
                    return ((item.seq == seq
                        || item.seq_causes == seq_causes) && item.action_type == 'update');
                });
                if (arrdelete.length > 0) { $scope.data_nodeworksheet_delete.push(arrdelete[0]); }

                //เก็บค่า กรองข้อมูลที่เหลือ 
                $scope.data_nodeworksheet = $filter('filter')($scope.data_nodeworksheet, function (item) {
                    return !((item.seq == seq
                        || item.seq_causes == seq_causes));
                });

            } else if (row_type == "consequences") {

                //เก็บค่า Delete 
                var arrdelete = $filter('filter')($scope.data_nodeworksheet, function (item) {
                    return ((item.seq == seq
                        || (item.seq_consequences == seq_consequences && item.seq_causes == seq_causes))
                        && item.action_type == 'update');
                });
                if (arrdelete.length > 0) { $scope.data_nodeworksheet_delete.push(arrdelete[0]); }

                //เก็บค่า กรองข้อมูลที่เหลือ 
                $scope.data_nodeworksheet = $filter('filter')($scope.data_nodeworksheet, function (item) {
                    return !(
                        (item.seq == seq
                            || (item.seq_consequences == seq_consequences && item.seq_causes == seq_causes))
                    );
                });

                // after reset no
                const guidewords_no = item.guidewords_no;
                const causes_no = item.causes_no;
                const consequences_no = item.consequences_no;
                $scope.data_nodeworksheet.forEach(function(item) {
                    if ( item.guidewords_no == guidewords_no && item.causes_no == causes_no ) {
                        if (item.consequences_no > consequences_no ) {
                            item.consequences_no = item.consequences_no - 1;
                        }
                    }
                });

                console.log("show after del node at consequences",$scope.data_nodeworksheet)

            } else if (row_type == "category") {
                //เก็บค่า Delete 
                var arrdelete = $filter('filter')($scope.data_nodeworksheet, function (item) {
                    return ((item.seq == seq
                        || (item.seq_category == seq_category && item.seq_consequences == seq_consequences && item.seq_causes == seq_causes))
                        && item.action_type == 'update');
                });
                if (arrdelete.length > 0) { $scope.data_nodeworksheet_delete.push(arrdelete[0]); }

                //เก็บค่า กรองข้อมูลที่เหลือ 
                $scope.data_nodeworksheet = $filter('filter')($scope.data_nodeworksheet, function (item) {
                    return !((item.seq == seq
                        || (item.seq_category == seq_category && item.seq_consequences == seq_consequences && item.seq_causes == seq_causes))
                    );
                });

                // after reset no
                const guidewords_no = item.guidewords_no;
                const causes_no = item.causes_no;
                const consequences_no = item.consequences_no;
                const category_no = item.category_no;
                $scope.data_nodeworksheet.forEach(function(item) {
                    if ( item.guidewords_no == guidewords_no && item.causes_no == causes_no && item.consequences_no == consequences_no) {
                        if (item.category_no > category_no ) {
                            item.category_no = item.category_no - 1;
                        }
                    }
                });



            }
        }

        running_index_worksheet('');
        running_index_level1_lv1($scope.data_nodeworksheet, 1, 0, null);
        if (row_type == "causes") {
            running_no_causes(seq_node, seq_guide_word);
        } else if (row_type == "consequences") {
            running_no_causes(seq_node, seq_guide_word);
            running_no_consequences(seq_node, seq_guide_word, seq_causes);
        }

        //re-sort all again
        $scope.data_nodeworksheet.sort((a, b) => {
            if (a.guidewords_no !== b.guidewords_no) {
              return a.guidewords_no - b.guidewords_no;
            } else if (a.causes_no !== b.causes_no) {
              return a.causes_no - b.causes_no;
            }else if (a.consequences_no !== b.consequences_no) {
                return a.consequences_no - b.consequences_no;
            }  else {
              return a.category_no - b.category_no;
            }
        });


    };

    function running_index_worksheet(def_seq) {
        $scope.data_nodeworksheet.sort((a, b) => a.index_rows - b.index_rows);

        var _index = 0;
        for (var i = 0; i < $scope.data_nodeworksheet.length; i++) {
            $scope.data_nodeworksheet[i].index_rows = i;

            if (def_seq != '') {
                if ($scope.data_nodeworksheet[i].seq == def_seq) {
                    _index = i;//กรณีที่เป็น node > 1
                }
            }
        }

        return _index;
    }

    function running_no_causes(seq_node, seq_guide_word) {
        //row_type;//guideword,causes,consequences,cat
        var arr_items = $filter('filter')($scope.data_nodeworksheet, function (item) {
            return (item.id_guide_word == seq_guide_word && item.id_node == seq_node
                && (item.row_type == 'causes'));
        });
        arr_items.sort((a, b) => a.no - b.no);
        var first_row = true;
        var iNoNew = 1;

        for (let i = 0; i < arr_items.length; i++) {
            arr_items[i].causes_no = (iNoNew);
            iNoNew++;
            if (i == 0) { arr_items[i].row_type == 'causes'; }
            else { arr_items[i].row_type == ''; }
        };

        arr_items.sort((a, b) => a.causes_no - b.causes_no);

        arr_items = $filter('filter')($scope.data_nodeworksheet, function (item) {
            return (item.id_node == seq_node);
        });

        var bfor = ''; var after = ''; var no_guide_word = 1; iNoNew = 1;
        for (let i = 0; i < arr_items.length; i++) {
            bfor = arr_items[i].seq_guide_word;
            if (bfor !== after) {
                //iNoNew = 1; 
                after = arr_items[i].seq_guide_word;
                arr_items[i].no_guide_word = no_guide_word;
                no_guide_word++;
            }
            arr_items[i].no = (iNoNew);
            iNoNew++;
        };
    }

    function running_no_consequences(seq_node, seq_guide_word, seq_causes) {

        //row_type;//guideword,causes,consequences,cat
        var arr_items = $filter('filter')($scope.data_nodeworksheet, function (item) {
            return (item.seq_guide_word == seq_guide_word && item.id_node == seq_node && item.seq_causes == seq_causes
                && (item.row_type == 'causes' || item.row_type == 'consequences'));
        });
        arr_items.sort((a, b) => a.no - b.no);
        var first_row = true;
        var iNoNewsafety_critical_equipment_show = 1;
        var iNoNew = 1;

        for (let i = 0; i < arr_items.length; i++) {
            arr_items[i].consequences_no = (iNoNew);
            iNoNew++;
        };

        arr_items.sort((a, b) => a.consequences_no - b.consequences_no);

    }
    function running_no_category (seq_node, seq_guide_word, seq_causes,seq_consequences) {
        //row_type;//guideword,causes,consequences,cat
        var arr_items = $filter('filter')($scope.data_nodeworksheet, function (item) {
            return (item.seq_guide_word == seq_guide_word && item.id_node == seq_node && item.seq_causes == seq_causes && item.seq_consequences == seq_consequences
                && (item.row_type == 'causes' || item.row_type == 'consequences' || item.row_type == 'category'));
        });
        arr_items.sort((a, b) => a.no - b.no);
        var first_row = true;
        var iNoNewsafety_critical_equipment_show = 1;
        var iNoNew = 1;

        for (let i = 0; i < arr_items.length; i++) {
            arr_items[i].category_no = (iNoNew);
            iNoNew++;
        };

        arr_items.sort((a, b) => a.category_no - b.category_no);        
    } 

    $scope.openModalDataRAM_Worksheet = function (_item, ram_type, seq, ram_type_action) {
        $scope.selectdata_nodeworksheet = seq;
        $scope.selectedDataNodeWorksheetRamType = ram_type;
        $scope.selectedDataRamTypeAction = ram_type_action;

        if (ram_type_action == 'after') {
            $scope.cal_ram_action_security = _item.ram_after_security;
            $scope.cal_ram_action_likelihood = _item.ram_after_likelihood;
            $scope.cal_ram_action_risk = _item.ram_after_risk;
        } else if (ram_type_action == 'befor') {
            $scope.cal_ram_action_security = _item.ram_befor_security;
            $scope.cal_ram_action_likelihood = _item.ram_befor_likelihood;
            $scope.cal_ram_action_risk = _item.ram_befor_risk;
        } else if (ram_type_action == 'action') {
            $scope.cal_ram_action_security = _item.ram_action_security;
            $scope.cal_ram_action_likelihood = _item.ram_action_likelihood;
            $scope.cal_ram_action_risk = _item.ram_action_risk;
        }

        $scope.previewRam = (ram_type == 'r' ? true : false);

        $scope.cal_ram_action_security = ($scope.cal_ram_action_security == null ? 'N/A' : $scope.cal_ram_action_security);
        $scope.cal_ram_action_likelihood = ($scope.cal_ram_action_likelihood == null ? 'N/A' : $scope.cal_ram_action_likelihood);
        $scope.cal_ram_action_risk = ($scope.cal_ram_action_risk == null ? 'N/A' : $scope.cal_ram_action_risk);

        $('#modalRAM').modal({
            backdrop: 'static',
            keyboard: false 
        }).modal('show');
        
    }

    $scope.closeModalDataRAM_Worksheet = function() {
        $scope.cal_ram_action_security = null;
        $scope.cal_ram_action_likelihood = null;
        $scope.cal_ram_action_risk = null; 
    };
    
    // Listen for the modal's hidden.bs.modal event and call closeModalDataRAM_Worksheet
    $('#modalRAM').on('hidden.bs.modal', function () {
        $scope.$apply(function() {
            $scope.closeModalDataRAM_Worksheet();
        });
    });

    $scope.openModalDataRAM = function (_item, ram_type, seq, ram_type_action) {

        $scope.selectdata_nodeworksheet = seq;
        $scope.selectedDataNodeWorksheetRamType = ram_type;
        $scope.selectedDataRamTypeAction = ram_type_action;


        $('#modalRAM').modal('show');
    }

    $scope.openModalDataNotification = function (item) {
        //modalNotification

        //item.id_apu 
        $('#modalNotification').modal('show');
    }

    $scope.selectDataRAM = function (ram_type, id_select) {
        var xseq = $scope.selectdata_nodeworksheet;
        var xbefor = $scope.selectedDataRamTypeAction;
        console.log(xseq)
        console.log(xbefor)
        for (let i = 0; i < $scope.data_nodeworksheet.length; i++) {
            try {

                if ($scope.data_nodeworksheet[i].seq !== xseq) { continue; }

                if (xbefor == "befor" && ram_type == "s") { $scope.data_nodeworksheet[i].ram_befor_security = id_select; }
                if (xbefor == "befor" && ram_type == "l") { $scope.data_nodeworksheet[i].ram_befor_likelihood = id_select; }

                if (xbefor == "after" && ram_type == "s") { $scope.data_nodeworksheet[i].ram_after_security = id_select; }
                if (xbefor == "after" && ram_type == "l") { $scope.data_nodeworksheet[i].ram_after_likelihood = id_select; }

                if (xbefor == "action" && ram_type == "s") { $scope.data_nodeworksheet[i].ram_action_security = id_select; }
                if (xbefor == "action" && ram_type == "l") { $scope.data_nodeworksheet[i].ram_action_likelihood = id_select; }

                var ram_security = $scope.data_nodeworksheet[i].ram_befor_security + "";
                var ram_likelihood = $scope.data_nodeworksheet[i].ram_befor_likelihood + "";
                var ram_risk = "";
                if (xbefor == "after") {
                    ram_security = $scope.data_nodeworksheet[i].ram_after_security + "";
                    ram_likelihood = $scope.data_nodeworksheet[i].ram_after_likelihood + "";
                }
                if (xbefor == "action") {
                    ram_security = $scope.data_nodeworksheet[i].ram_action_security + "";
                    ram_likelihood = $scope.data_nodeworksheet[i].ram_action_likelihood + "";
                }
                if (ram_security == "" || ram_likelihood == "") {
                    if (xbefor == "befor") { $scope.data_nodeworksheet[i].ram_befor_risk = ""; }
                    else if (xbefor == "after") { $scope.data_nodeworksheet[i].ram_after_risk = ""; }
                    else if (xbefor == "action") { $scope.data_nodeworksheet[i].ram_action_risk = ""; }
                    break;
                }


                var safety_critical_equipment = 'N';
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

                if (xbefor == "befor" && (ram_type == "s" || ram_type == "l")) {
                    $scope.data_nodeworksheet[i].safety_critical_equipment = safety_critical_equipment;
                }

                if (xbefor == "befor") { $scope.data_nodeworksheet[i].ram_befor_risk = ram_risk; }
                else if (xbefor == "after") { $scope.data_nodeworksheet[i].ram_after_risk = ram_risk; }
                else if (xbefor == "action") { $scope.data_nodeworksheet[i].ram_action_risk = ram_risk; }

                if ($scope.data_nodeworksheet[i].action_type == 'update') {
                    $scope.data_nodeworksheet[i].action_change = 1;
                }

                var ram_type_action = $scope.selectedDataRamTypeAction;
                if (ram_type_action == 'after') {
                    $scope.cal_ram_action_security = $scope.data_nodeworksheet[i].ram_after_security;
                    $scope.cal_ram_action_likelihood = $scope.data_nodeworksheet[i].ram_after_likelihood;
                    $scope.cal_ram_action_risk = $scope.data_nodeworksheet[i].ram_after_risk;
                } else if (ram_type_action == 'befor') {
                    $scope.cal_ram_action_security = $scope.data_nodeworksheet[i].ram_befor_security;
                    $scope.cal_ram_action_likelihood = $scope.data_nodeworksheet[i].ram_befor_likelihood;
                    $scope.cal_ram_action_risk = $scope.data_nodeworksheet[i].ram_befor_risk;
                } else if (ram_type_action == 'action') {
                    $scope.cal_ram_action_security = $scope.data_nodeworksheet[i].ram_action_security;
                    $scope.cal_ram_action_likelihood = $scope.data_nodeworksheet[i].ram_action_likelihood;
                    $scope.cal_ram_action_risk = $scope.data_nodeworksheet[i].ram_action_risk;
                }
                $scope.actionChangeWorksheet($scope.data_nodeworksheet[i], $scope.data_nodeworksheet[i].seq);

                // set
                if ($scope.data_nodeworksheet[i].ram_befor_security && $scope.data_nodeworksheet[i].ram_befor_likelihood ) {
                    if ($scope.data_nodeworksheet[i].ram_befor_risk == "H") {
                        $scope.data_nodeworksheet[i].major_accident_event = "Y";
                    } else {
                        $scope.data_nodeworksheet[i].major_accident_event = "N";
                    }
                }

                break;

            } catch (e) { }
        }


        apply();

        $('#modalRAM').modal('show');
    }

    $scope.openModalDataEmployee = function (form_type, seq) {
        //openModalDataEmployee('info', item.seq)
        $scope.selectDatFormType = form_type;
        $scope.selectdata_nodeworksheet = seq;

        $('#modalEmployeeSelect').modal('show');
    }

    $scope.selectDataEmployee = function (item) {

        var id = item.id;
        var employee = item.employee_name;
        var employee_display = item.employee_displayname;
        var employee_email = item.employee_email;
        var profile = item.employee_img;

        var xseq = $scope.selectdata_nodeworksheet;
        var xformtype = $scope.selectDatFormType;

        $scope.DataMain = [];

        // alert(xformtype);
        if (xformtype == "info") {
            // กรณีที่เลือก approver ta2
            // approve_action_type, approve_status, approver_user_name, approver_user_displayname 
            $scope.data_header[0].approver_user_name = employee;
            $scope.data_header[0].approver_user_displayname = employee_display;


        } else {

            var arr_items = $filter('filter')($scope.data_nodeworksheet, function (item) { return (item.seq == xseq); })[0];

            arr_items.responder_user_id = id;
            arr_items.responder_user_name = employee;
            arr_items.responder_user_displayname = employee_display;
            arr_items.responder_user_email = employee_email;
            arr_items.responder_user_img = profile;


            $scope.actionChangeWorksheet(arr_items, arr_items.seq);
        }

        unsavedChanges = true;
        apply();
        $('#modalEmployeeSelect').modal('hide');
    };

    $scope.removeDataEmpApprover = function () {
        $scope.data_header[0].approver_user_name = null;
        $scope.data_header[0].approver_user_displayname = null;
        apply();
    };

    $scope.removeDataEmpWorkSheet = function (form_type, id, seq) {
        var xseq = seq;
        var xformtype = $scope.selectDatFormType;

        if (xformtype == "info") {
            $scope.DataMain = [];
        } else {
            for (let i = 0; i < $scope.data_nodeworksheet.length; i++) {
                try {
                    if ($scope.data_nodeworksheet[i].seq == xseq) {
                        $scope.data_nodeworksheet[i].responder_user_id = null;
                        $scope.data_nodeworksheet[i].responder_user_name = null;
                        $scope.data_nodeworksheet[i].responder_user_displayname = null;
                        $scope.data_nodeworksheet[i].responder_user_email = null;
                        $scope.data_nodeworksheet[i].responder_user_img = null;
                        break;
                    }
                } catch (e) { }
            };
        }
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
            employee_email: newText2
            , employee_type: 'Contract'
            , employee_img: 'assets/img/team/avatar.webp'
            , selected: false
            , seq: 0
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

    $scope.selectReviewer = function (item) {
        $scope.selectedDataReviewer = item;
    }

    $scope.clearReviewer = function (item) {
        $scope.selectedDataReviewer = null;
    }


    $scope.selectApprover = function (item) {
        $scope.selectedDataApprover = item;
    }

    $scope.clearApprover = function (item) {
        $scope.selectedDataApprover = null;
    }
    $scope.safety_critical_equipment_show = function () {

        if ($scope.data_header[0].safety_critical_equipment_show == 1) {
            $scope.data_header[0].safety_critical_equipment_show = 0;
        } else if ($scope.data_header[0].safety_critical_equipment_show == 0) {
            $scope.data_header[0].safety_critical_equipment_show = 1
        } else {
            $scope.data_header[0].safety_critical_equipment_show = 1;
        }
        $scope.data_header[0].action_change = 1;


        var inputs = document.getElementsByTagName('sceSwitchCheckChecked');
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == 'checkbox') {
                if ($scope.data_header[0].safety_critical_equipment_show == 1) {
                    inputs[i].checked = true;
                } else { inputs[i].checked = false; }
            }
        }

        if ($scope.data_header[0].safety_critical_equipment_show == 1) {

            for (var i = 0; i < $scope.data_nodeworksheet.length; i++) {

                var safety_critical_equipment = $scope.data_nodeworksheet[i].safety_critical_equipment;
                if (safety_critical_equipment == null) { safety_critical_equipment = ''; }
                if (safety_critical_equipment == '') {

                    var id_ram = $scope.data_general[0].id_ram;
                    var ram_security = $scope.data_nodeworksheet[i].ram_befor_security;
                    var ram_likelihood = $scope.data_nodeworksheet[i].ram_befor_likelihood;
                    var arr_items = $filter('filter')($scope.master_ram_level, function (item) {
                        return (item.id_ram == id_ram && item.security_level == ram_security);
                    });
                    if (arr_items.length > 0) {
                        //check ram_likelihood ว่าตก columns ไหน เพื่อหา ram1_priority
                        if (ram_likelihood == arr_items[0].likelihood1_level) { safety_critical_equipment = arr_items[0].likelihood1_criterion; }
                        else if (ram_likelihood == arr_items[0].likelihood2_level) { safety_critical_equipment = arr_items[0].likelihood2_criterion; }
                        else if (ram_likelihood == arr_items[0].likelihood3_level) { safety_critical_equipment = arr_items[0].likelihood3_criterion; }
                        else if (ram_likelihood == arr_items[0].likelihood4_level) { safety_critical_equipment = arr_items[0].likelihood4_criterion; }
                        else if (ram_likelihood == arr_items[0].likelihood5_level) { safety_critical_equipment = arr_items[0].likelihood5_criterion; }
                        else if (ram_likelihood == arr_items[0].likelihood6_level) { safety_critical_equipment = arr_items[0].likelihood6_criterion; }
                        else if (ram_likelihood == arr_items[0].likelihood7_level) { safety_critical_equipment = arr_items[0].likelihood7_criterion; }
                        else if (ram_likelihood == arr_items[0].likelihood8_level) { safety_critical_equipment = arr_items[0].likelihood8_criterion; }
                        else if (ram_likelihood == arr_items[0].likelihood9_level) { safety_critical_equipment = arr_items[0].likelihood9_criterion; }
                        else if (ram_likelihood == arr_items[0].likelihood10_level) { safety_critical_equipment = arr_items[0].likelihood10_criterion; }
                    }
                    $scope.data_nodeworksheet[i].safety_critical_equipment = safety_critical_equipment;
                }
            }
        }
        apply();
    }
    $scope.node_note_show = function () {

        var inputs = document.getElementById('sceSwitchNoteChecked');
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == 'checkbox') {

                var div_node_note = document.getElementById('div_node_note');
                if (inputs[i].checked == true) {
                    div_node_note.className = 'form-floating hide';
                } else {
                    div_node_note.className = 'form-floating show';
                }
            }
        }

        var div_node_note = document.getElementById('div_node_note');
        if (inputs.checked) {
            div_node_note.className = 'form-floating';
            //alert('1' + inputs.checked);
        } else {
            div_node_note.className = 'form-floating d-none';
            //alert('2' + inputs.checked);
        }

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

        //alert($scope.isFullscreen);
    };
    $scope.toggleFullscreen_ram = function () {
        var element = document.getElementById('fullscreenzone_ram');

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

            $scope.isFullscreenRam = true;

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

            $scope.isFullscreenRam = false;

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
                console.log(arr);
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
        if (conFig.pha_type_doc == 'preview') {

            var pha_type_doc = 'back';
            var pha_status = "";

            var page = conFig.controller_action_befor();
            var controller_text = "hazop";
            //conFig.pha_seq = null;
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
        } else { window.open("home/portal", "_top"); }


    }

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
                //url: url_ws + "Flow/set_email_member_review_stamp",
                url: url_ws + "Flow/send_notification_member_review",
                data: '{"sub_software":"hazop","user_name":"' + user_name + '","pha_seq":"' + token_doc + '"}',
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

    $scope.confirmCancle = function () {
        $scope.Action_Msg_Confirm = true;

        set_alert_confirm('Confirm canceling the PHA No.', '');
    }


    $scope.confirmSave = function (action) {

        //check required field 
        var pha_status = $scope.data_header[0].pha_status;
        $scope.confirmSave_status = true;
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
                if (pha_status == "11") {

                    var requiredFields = [
                        { field: 'expense_type', errorId: 'expense_type_error' },
                        { field: 'sub_expense_type', errorId: 'sub_expense_type_error' },
                        { field: 'id_apu', errorId: 'id_apu_error' }
                    ];
                
                    var invalidFieldFound = false;
                    requiredFields.forEach(function (item) {
                        if (!arr_chk[0][item.field]) {
                            set_alert('Warning', 'Please select a valid General Information');
                            validateSelect(item.field, item.errorId);
                            invalidFieldFound = true; 
                        }
                    });
                    
                }
                else if (pha_status == "12") {

                    var bCheckValid_Session = false;
                    var bCheckValid_Node = false;
                    var bCheckValid_Worksheet = false;
                    var bCheckValid_Manage = false;

                    if (arr_chk[0].expense_type == '' || arr_chk[0].expense_type == null) { set_alert('Warning', 'Please select a valid Expense Type'); return; }
                    if (arr_chk[0].sub_expense_type == '' || arr_chk[0].sub_expense_type == null) { set_alert('Warning', 'Please select a valid Sub-Expense Type'); return; }
                    if (arr_chk[0].id_apu == '' || arr_chk[0].id_apu == null) { set_alert('Warning', 'Please select a valid Area Process Unit'); return; }

                    if (true) {
                        arr_chk = $scope.data_memberteam;
                        if (arr_chk.length == 0) { set_alert('Warning', 'Please provide a valid Session List'); return; }
                        else {
                            var irows_last = arr_chk.length - 1;
                            if (arr_chk[irows_last].user_name == null) { set_alert('Warning', 'Please provide a valid Session List'); return; }
                        }

                        if ($scope.data_header[0].request_approver > 0) {

                            arr_chk = $scope.data_approver;
                            if (arr_chk.length == 0) { set_alert('Warning', 'Please provide a valid ApproverTA2 List'); return; }
                            else {
                                var irows_last = arr_chk.length - 1;
                                if (arr_chk[irows_last].user_name == null) { set_alert('Warning', 'Please provide a valid ApproverTA2 List'); return; }
                            }

                        }
                    }

                    if (true) {

                        arr_chk = $scope.data_drawing;
                        if (arr_chk.length == 0) { set_alert('Warning', 'Please provide a valid Drawing List'); return; }
                        for (var i = 0; i < arr_chk.length; i++) {
                            if (set_valid_items(arr_chk[i].node, 'drawing-document-file-' + arr_chk[i].seq)) { bCheckValid_Node = true; }
                        }

                        arr_chk = $scope.data_node;
                        if (arr_chk.length == 0) { set_alert('Warning', 'Please provide a valid Node List'); return; }
                        for (var i = 0; i < arr_chk.length; i++) {
                            if (set_valid_items(arr_chk[i].node, 'node-node-' + arr_chk[i].seq)) { bCheckValid_Node = true; }
                        }
                    }

                    if (true) {
                        arr_chk = $scope.data_nodeworksheet;
                        console.log(arr_chk)
                        for (var i = 0; i < arr_chk.length; i++) {

                            if (set_valid_items(arr_chk[i].causes, 'nodeworksheet-causes-' + arr_chk[i].seq)) { bCheckValid_Worksheet = true; }
                            if (set_valid_items(arr_chk[i].consequences, 'nodeworksheet-consequences-' + arr_chk[i].seq)) { bCheckValid_Worksheet = true; }
                            // if (set_valid_items(arr_chk[i].responder_user_name, 'nodeworksheet-responder-' + arr_chk[i].seq)) { bCheckValid_Worksheet = true; }
                            if (set_valid_items(arr_chk[i].estimated_start_date, 'nodeworksheet-estimated-start-' + arr_chk[i].seq)) { bCheckValid_Manage = true; }
                            if (set_valid_items(arr_chk[i].estimated_end_date, 'nodeworksheet-estimated-end-' + arr_chk[i].seq)) { bCheckValid_Manage = true; }
                            
                            if (set_valid_items(arr_chk[i].category_type, 'nodeworksheet-category_type-' + arr_chk[i].seq)) { bCheckValid_Worksheet = true; }
                            if (set_valid_items(arr_chk[i].major_accident_event, 'nodeworksheet-major_accident_event-' + arr_chk[i].seq)) { bCheckValid_Worksheet = true; }
                            if (set_valid_items(arr_chk[i].existing_safeguards, 'nodeworksheet-existing_safeguards-' + arr_chk[i].seq)) { bCheckValid_Worksheet = true; }
                            // if (set_valid_items(arr_chk[i].recommendations, 'nodeworksheet-recommendations-' + arr_chk[i].seq)) { bCheckValid_Worksheet = true; }
                        }
                    }

                    var tag_name = '';
                    if (bCheckValid_Node) { bCheckValid = true; tag_name = 'node'; }
                    else if (bCheckValid_Worksheet) { bCheckValid = true; tag_name = 'worksheet'; }
                    else if (bCheckValid_Manage) { bCheckValid = true; tag_name = 'manage'; }

                    if (bCheckValid) {
                        var arr_tab = $filter('filter')($scope.tabs, function (item) { return ((item.name == tag_name)); });
                        $scope.changeTab_Focus(arr_tab, tag_name);
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
        var action_def = action;
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
        if (action == 'confirm_submit_genarate'
            || action == 'confirm_submit_genarate_without'
            || action == 'submit'
            || action == 'submit_without') {
            $('#modalPleaseRegister').modal('hide');
        } else if (action == 'confirm_submit_approver') {
            $('#modalSendMailApprover').modal('hide');
        } else if (action == 'save') {

            var arr_chk = $scope.data_general;

            if (pha_status == "11") {
                console.log("wil call to open modal alert")
                var fieldValidations = [
                    { field: 'expense_type', message: 'Please select a valid Expense Type' },
                    { field: 'sub_expense_type', message: 'Please select a valid Sub-Expense Type' },
                    { field: 'id_apu', message: 'Please select a valid Area Process Unit' }
                ];
            
                fieldValidations.forEach(function (validation) {
                    if (!arr_chk[0][validation.field]) {
                        set_alert('Warning', validation.message);
                        validateSelect(validation.field, validation.field + '_error');
                    }
                });
            
                if (fieldValidations.some(function (validation) { return !arr_chk[0][validation.field]; })) {
                    return;
                }
            }  
        }
        else {
            if ($scope.Action_Msg_Confirm == true) {
                $('#modalMsg').modal('hide');
                $("#divLoading").hide();

                if ($scope.flow_role_type == 'admin') {
                    $('#modalSendMail').modal('show');
                }
            }
        }

        // check follow up edit
        if ($scope.params == 'edit') {
            return $('#modalEditConfirm').modal('show');
        }

        unsavedChanges = false;
        save_data_create(action, action_def);

    }

    function validateSelect(field, errorId) {
        var element = '.form-label .' + field + ' .choices'
        var selectElement = document.querySelector('element');
        var selectElement2 = document.querySelector('.form-label .id_apu .choices');
        var errorDiv = document.getElementById(errorId);
        console.log('.form-label .' + field + ' .choices')
        console.log(selectElement)
        console.log(selectElement2)
    
        if (selectElement) {
            selectElement.classList.add('is-invalid mb-0');
            var fieldName = (field === 'id_apu') ? 'Area Process Unit' : field;

            errorDiv.innerText = 'Please select a valid ' + fieldName + '.';
            errorDiv.style.display = 'block';

        } else if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }
    
    

    $scope.confirmEdit = function () {
        $('#modalEditConfirm').modal('hide');
        setTimeout(function() {
            save_data_create('change_action_owner', 'save');
        }, 200); 
    }

    $scope.cancelEdit = function () {
        return $('#modalEditConfirm').modal('hide');
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
        //valid-nodeworksheet-responder-{{item.seq}}  --> -nodeworksheet-responder-{{item.seq}} 
        var id_valid = document.getElementById('valid-' + field);
        id_valid.className = "invalid-feedback text-danger";
    }

    $scope.confirmSubmit = function (action) {
        $scope.Action_Msg_Confirm = false;
        if (action == 'no') {
            $('#modalMsg').modal('hide');
            return;
        }

        unsavedChanges = false;
        save_data_create("submit", "submit");
    }


    function check_data_general() {
        //แปลง date to yyyyMMdd
        //แปลง time to hh:mm
        //set timezone offset
        try {
            if ($scope.data_general[0].target_start_date) {
                var target_start_date = new Date($scope.data_general[0].target_start_date);
                var target_start_date_utc = new Date(Date.UTC(target_start_date.getFullYear(), target_start_date.getMonth(), target_start_date.getDate()));
                $scope.data_general[0].target_start_date = target_start_date_utc.toISOString().split('T')[0];
            } else {}
        } catch (error) {}
        
        try {
            if ($scope.data_general[0].target_start_date) {
                var target_start_date = new Date($scope.data_general[0].target_start_date);
                var target_start_date_utc = new Date(Date.UTC(target_start_date.getFullYear(), target_start_date.getMonth(), target_start_date.getDate()));
                $scope.data_general[0].target_start_date = target_start_date_utc.toISOString().split('T')[0];
            }
        } catch (error) {}
        
        try {
            var actual_start_date = new Date($scope.data_general[0].actual_start_date);
            var actual_start_date_utc = new Date(Date.UTC(actual_start_date.getFullYear(), actual_start_date.getMonth(), actual_start_date.getDate()));
            $scope.data_general[0].actual_start_date = actual_start_date_utc.toISOString().split('T')[0];
        } catch (error) {}
        
        try {
            var actual_end_date = new Date($scope.data_general[0].actual_end_date);
            var actual_end_date_utc = new Date(Date.UTC(actual_end_date.getFullYear(), actual_end_date.getMonth(), actual_end_date.getDate()));
            $scope.data_general[0].actual_end_date = actual_end_date_utc.toISOString().split('T')[0];
        } catch (error) {}
        
          
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

    function check_data_functional_audition() {
        //functional_location_audition
        var pha_seq = $scope.data_header[0].seq;
        var functional_audition_arr = $scope.data_general[0].functional_location_audition;
        var functional_audition_text = '';
        for (var i = 0; i < functional_audition_arr.length; i++) {

            if (functional_audition_text != '') { functional_audition_text += ','; }
            if (functional_audition_arr[i] != '') {
                functional_audition_text += functional_audition_arr[i];
            }

        }

        $scope.data_functional_audition[0].seq = pha_seq;
        $scope.data_functional_audition[0].id = pha_seq;
        $scope.data_functional_audition[0].id_pha = pha_seq;
        $scope.data_functional_audition[0].functional_location = functional_audition_text;

        var arr_active = [];
        angular.copy($scope.data_functional_audition, arr_active);
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
                var meeting_date = new Date($scope.data_session[0].meeting_date);
                var meeting_date_utc = new Date(Date.UTC(meeting_date.getFullYear(), meeting_date.getMonth(), meeting_date.getDate()));
                $scope.data_session[0].meeting_date = meeting_date_utc.toISOString().split('T')[0];
            } catch {} 
     
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
            return ((!(item.user_name == null) && item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert');
        });
        for (var i = 0; i < $scope.data_memberteam_delete.length; i++) {
            $scope.data_memberteam_delete[i].action_type = 'delete';
            arr_json.push($scope.data_memberteam_delete[i]);
        }
        for (var i = 0; i < arr_active.length; i++) {
            if (arr_active[i].user_name == null) {
                arr_active[i].action_type = 'delete';
                arr_json.push(arr_active[i]);
            }
        }

        //check จากข้อมูลเดิมที่เคยบันทึกไว้ถ้าไม่มีในของเดิมให้ delete ออกด้วย
        for (var i = 0; i < $scope.data_memberteam_old.length; i++) {

            var arr_check = $filter('filter')($scope.data_memberteam, function (item) {
                return (item.user_name == $scope.data_memberteam_old[i].user_name
                    && item.id_session == $scope.data_memberteam_old[i].id_session
                    && (item.action_type == 'insert' || item.action_type == 'update'));
            });
            if (arr_check.length == 0) {
                $scope.data_memberteam_old[i].action_type = 'delete';
                arr_json.push($scope.data_memberteam_old[i]);
            }
        }

        //check จากข้อมูล session ให้ delete ออกด้วย
        for (var i = 0; i < $scope.data_memberteam.length; i++) {
            var arr_check = $filter('filter')($scope.data_session, function (item) {
                return (item.seq == $scope.data_memberteam[i].id_session || item.id == $scope.data_memberteam[i].id_session);
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

    function check_data_node() {

        var pha_seq = $scope.data_header[0].seq;
        for (var i = 0; i < $scope.data_node.length; i++) {
            $scope.data_node[i].id = Number($scope.data_node[i].seq);
            $scope.data_node[i].id_pha = pha_seq;
        }

        var arr_active = [];
        angular.copy($scope.data_node, arr_active);
        var arr_json = $filter('filter')(arr_active, function (item) {
            return ((item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert');
        });
        for (var i = 0; i < $scope.data_node_delete.length; i++) {
            $scope.data_node_delete[i].action_type = 'delete';
            arr_json.push($scope.data_node_delete[i]);
        }
        return angular.toJson(arr_json);
    }

    function check_data_nodedrawing() {

        var pha_seq = $scope.data_header[0].seq;
        for (var i = 0; i < $scope.data_nodedrawing.length; i++) {
            $scope.data_nodedrawing[i].id = Number($scope.data_nodedrawing[i].seq);
            $scope.data_nodedrawing[i].id_pha = pha_seq;
        }

        var arr_active = [];
        angular.copy($scope.data_nodedrawing, arr_active);
        var arr_json = $filter('filter')(arr_active, function (item) {
            return ((item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert');
        });
        for (var i = 0; i < $scope.data_nodedrawing_delete.length; i++) {
            $scope.data_nodedrawing_delete[i].action_type = 'delete';
            arr_json.push($scope.data_nodedrawing_delete[i]);
        }
        return angular.toJson(arr_json);
    }

    function check_data_nodeguidwords() {

        var pha_seq = $scope.data_header[0].seq;
        for (var i = 0; i < $scope.data_nodeguidwords.length; i++) {
            $scope.data_nodeguidwords[i].id = Number($scope.data_nodeguidwords[i].seq);
            $scope.data_nodeguidwords[i].id_pha = pha_seq;
        }

        var arr_active = [];
        angular.copy($scope.data_nodeguidwords, arr_active);
        var arr_json = $filter('filter')(arr_active, function (item) {
            return ((item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert');
        });
        for (var i = 0; i < $scope.data_nodeguidwords_delete.length; i++) {
            $scope.data_nodeguidwords_delete[i].action_type = 'delete';
            arr_json.push($scope.data_nodeguidwords_delete[i]);
        }
        return angular.toJson(arr_json);
    }

    function check_data_nodeworksheet() {

        var pha_status = $scope.data_header[0].pha_status;
        var pha_seq = $scope.data_header[0].seq;

        //if (pha_status == 11 && $scope.data_general[0].sub_expense_type == 'Normal') {
        //    //check กรณีที่เปลี่ยนจาก Study เป็น Normal
        //    if ($scope.data_nodeworksheet.length > 0) {
        //        //ต้องลบออกเนื่องจาก ยังไม่ถึงขั้นตอน
        //    }
        //}

        console.log("check_data_nodeworksheet",$scope.data_nodeworksheet)
        for (var i = 0; i < $scope.data_nodeworksheet.length; i++) {
            $scope.data_nodeworksheet[i].id = Number($scope.data_nodeworksheet[i].seq);
            $scope.data_nodeworksheet[i].id_pha = pha_seq;

            // action_project_team
            if ($scope.data_nodeworksheet[i].action_project_team !== undefined) {
                $scope.data_nodeworksheet[i].action_project_team = $scope.data_nodeworksheet[i].action_project_team ? 1 : 0;
            }
            

            //ram_action_security, ram_action_likelihood, ram_action_risk, estimated_start_date, estimated_end_date, document_file_path, document_file_name, action_status, responder_action_type, responder_user_name, responder_user_displayname

            try {
                if (!$scope.data_nodeworksheet[i].estimated_start_date) {
                    var today = new Date();
                    var start_date_utc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
                    $scope.data_nodeworksheet[0].estimated_start_date = start_date_utc.toISOString().split('T')[0];
                } else {
                    var start_date = new Date($scope.data_nodeworksheet[i].estimated_start_date);
                    if (!isNaN(start_date.getTime())) {
                        var start_date_utc = new Date(Date.UTC(start_date.getFullYear(), start_date.getMonth(), start_date.getDate()));
                        $scope.data_nodeworksheet[i].estimated_start_date = start_date_utc.toISOString().split('T')[0];
                    }
                }
            } catch (error) {} 
            try {
                if ($scope.data_nodeworksheet[i].estimated_start_date !== null) {
                    var end_date = new Date($scope.data_nodeworksheet[i].estimated_end_date);
                    if (!isNaN(end_date.getTime())) { 
                        var end_date_utc = new Date(Date.UTC(end_date.getFullYear(), end_date.getMonth(), end_date.getDate()));
                        $scope.data_nodeworksheet[i].estimated_end_date = end_date_utc.toISOString().split('T')[0];
                    }
                } else {}
            } catch (error) {}                                    
            

            if (pha_status == "11" || pha_status == "12" || pha_status == "22") {
                try {
                    if ($scope.data_nodeworksheet[i].reviewer_action_date !== null) {
                        var reviewer_date = new Date($scope.data_nodeworksheet[i].reviewer_action_date);
                        if (!isNaN(reviewer_date.getTime())) {
                            var reviewer_date_utc = new Date(Date.UTC(reviewer_date.getFullYear(), reviewer_date.getMonth(), reviewer_date.getDate()));
                            $scope.data_nodeworksheet[i].reviewer_action_date = reviewer_date_utc.toISOString().split('T')[0];
                        }
                    }                 

                } catch (error) {}
                
                try {
                    if ($scope.data_nodeworksheet[i].responder_action_date !== null) {
                        var responder_date = new Date($scope.data_nodeworksheet[i].responder_action_date);
                        if (!isNaN(responder_date.getTime())) { 
                            var responder_date_utc = new Date(Date.UTC(responder_date.getFullYear(), responder_date.getMonth(), responder_date.getDate()));
                            $scope.data_nodeworksheet[i].responder_action_date = responder_date_utc.toISOString().split('T')[0];
                        }
                    }                      

                } catch (error) {}
            }

        }
        console.log("check_data_nodeworksheet",$scope.data_nodeworksheet)

        var arr_active = [];
        angular.copy($scope.data_nodeworksheet, arr_active);
        var arr_json = $filter('filter')(arr_active, function (item) {
            return ((item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert');
        });
        for (var i = 0; i < $scope.data_nodeworksheet_delete.length; i++) {
            $scope.data_nodeworksheet_delete[i].action_type = 'delete';
            arr_json.push($scope.data_nodeworksheet_delete[i]);
        }
        

        console.log('return ',arr_json)

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

    function check_data_drawing_approver(id_session) {

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

    function set_alert(header, detail) {
        $scope.Action_Msg_Header = header;
        $scope.Action_Msg_Detail = detail;
        $('#modalMsg').modal('show');
    }

    function set_alert_warning(header, detail) {
        $scope.$apply(function () {
            $scope.Action_Msg_Header = header;
            $scope.Action_Msg_Detail = detail;
        });
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
        console.log(_arr, _seq, type_text)
        action_type_changed(_arr, _seq);

        // Adjust to local timezone before sending to backend
        /*if (_arr.target_start_date) {
            var startDate = new Date(_arr.target_start_date);
            var startOffset = startDate.getTimezoneOffset() * 60000; 
            var adjustedStartDate = new Date(startDate.getTime() - startOffset);
            _arr.target_start_date = adjustedStartDate.toISOString().substring(0, 10);
        }
        if (_arr.target_end_date) {
            var endDate = new Date(_arr.target_end_date);
            var endOffset = endDate.getTimezoneOffset() * 60000;
            var adjustedEndDate = new Date(endDate.getTime() - endOffset);
            _arr.target_end_date = adjustedEndDate.toISOString().substring(0, 10);
        }*/

        //console.log( "start",_arr.target_start_date,"end",_arr.target_end_date)


        var arr_submit = $filter('filter')($scope.data_node, function (item) {
            return ((item.action_type !== '' || item.action_type !== null));
        });
        if (arr_submit.length > 0) { $scope.submit_type = true; } else { $scope.submit_type = false; }

        if (type_text == "expense_type") {
            $scope.data_header[0].request_approver = (_arr.expense_type == 'OPEX' ? 0 : 1);
        }
        if (type_text == "ChangeRAM") {
            console.log($scope.master_ram_level);
            set_master_ram_likelihood(_arr.id_ram);
        }

        if (type_text == "node") {
            $scope.selectedItemNodeView = _seq;
        }


        unsavedChanges = true;
        apply();
    }

    $scope.actionChangeNodeDrawing = function (_arr, _seq) {
        action_type_changed(_arr, _seq);

        var arr_submit = $filter('filter')($scope.data_node, function (item) {
            return ((item.action_type !== '' || item.action_type !== null));
        });
        if (arr_submit.length > 0) { $scope.submit_type = true; } else { $scope.submit_type = false; }

        if ($scope.data_nodedrawing) {
            var arr_drawing = $filter('filter')($scope.data_nodedrawing, function (item) {
                return ((item.id_node == _seq));
            });
            if (!arr_drawing) { return; }
            var _arr_drawing = arr_drawing[0];
            if (_arr_drawing.action_type == '') {
                _arr_drawing.action_type = 'update';
                _arr_drawing.action_change = 1;
                _arr_drawing.update_by = $scope.user_name;
                apply();
            } else if (_arr_drawing.action_type == 'update') {
                _arr_drawing.action_change = 1;
                _arr_drawing.update_by = $scope.user_name;
                apply();
            }
        }

        unsavedChanges = true;
    }

    $scope.actionChangeWorksheet = function (_arr, _seq, type_text) {
 
        action_type_changed(_arr, _seq);

        var _implement = false;
        if (type_text == "implement_uncheck") {
            _arr.implement = 0; 
            _implement = true;
        } else if (type_text == "implement_check") {
            _arr.implement = 1; 
            _implement = true;
        }
        if (_implement) {
            //set Data
            //1. Risk Assessment Matrix -> After to Action
            //  --> ram_after_security, ram_after_likelihood, ram_after_risk
            //  --> ram_action_security, ram_action_likelihood, ram_action_risk
            //2. Action Status -> action_status = Closed
            //3. Reviewer Date
            //  --> reviewer_action_type = 2, reviewer_action_date = sysdate()
            //  --> responder_action_type = 2, responder_action_date = sysdate()

            var dateNow = new Date(Date.now());

            // ดึงข้อมูลวันที่, เดือน, และปี
            var day = dateNow.getDate();
            var month = dateNow.toLocaleString('default', { month: 'short' });
            var year = dateNow.getFullYear();

            // สร้างสตริง "DD MMM YYYY"
            var formattedDate = day + ' ' + month + ' ' + year;

            if (_arr.implement == 0) {

                _arr.ram_action_security = _arr.ram_after_security;
                _arr.ram_action_likelihood = _arr.ram_after_likelihood;
                _arr.ram_action_risk = _arr.ram_after_risk;

                _arr.action_status = 'Closed';

                _arr.reviewer_action_type = 2;
                _arr.reviewer_action_date = dateNow;

                _arr.responder_action_type = 2;
                _arr.responder_action_date = dateNow;

                _arr.estimated_start_date = dateNow;
                _arr.estimated_end_date = dateNow;
                //dd MMM yyyy
                _arr.reviewer_date = formattedDate;

            } else {
                _arr.ram_action_security = null;
                _arr.ram_action_likelihood = null;
                _arr.ram_action_risk = null;

                _arr.action_status = 'Open'

                _arr.reviewer_action_type = null;
                _arr.reviewer_action_date = null;

                _arr.responder_action_type = null;
                _arr.reviewer_action_date = null;

                _arr.estimated_start_date = null;
                _arr.estimated_end_date = null;

                //dd MMM yyyy
                _arr.reviewer_date = null;
            }
            

        }
        //เปิดปุ่ม submit
        var arr_submit = $filter('filter')($scope.data_nodeworksheet, function (item) {
            return ((item.action_type !== '' || item.action_type !== null));
        });
        if (arr_submit.length > 0) { $scope.submit_type = true; } else { $scope.submit_type = false; }
        unsavedChanges = true;
        console.log('confirm ==> ',$scope.data_nodeworksheet)
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
        else if (fieldName == 'node') {
            arr = $scope.data_all.his_node;
        }
        else if (fieldName == 'design_intent') {
            arr = $scope.data_all.his_design_intent;
        }
        else if (fieldName == 'design_conditions') {
            arr = $scope.data_all.his_design_conditions;
        }
        else if (fieldName == 'operating_conditions') {
            arr = $scope.data_all.his_operating_conditions;
        }
        else if (fieldName == 'node_boundary') {
            arr = $scope.data_all.his_node_boundary;
        }
        else if (fieldName == 'causes') {
            arr = $scope.data_all.his_causes;
        }
        else if (fieldName == 'consequences') {
            arr = $scope.data_all.his_consequences;
        }
        else if (fieldName == 'existing_safeguards') {
            arr = $scope.data_all.his_existing_safeguards;
        }
        else if (fieldName == 'recommendations') {
            arr = $scope.data_all.his_recommendations;
        }

        var count = 0; 
        for (var i = 0; i < arr.length; i++) {
            var result = arr[i];
            if (result.name.toLowerCase().startsWith(fieldText.toLowerCase())) {
                $scope.filteredResults.push({ "field": fieldName, "name": result.name });
                count++;
            }

            if (count >= 10) {
                break; 
            }
        }

        $scope.showResults = $scope.filteredResults.length > 0;

        if ($scope.data_general[0].action_type == '') {
            action_type_changed($scope.data_general, $scope.data_general[0].seq);
        }
    };

    $scope.recommentAction = function(index) {
        var item = $scope.data_nodeworksheet[index];
        var data = item.responder_user_name;
        if (!item.recommendations) {
            data = 'true';
        }
        set_valid_items(data, 'nodeworksheet-responder-' + item.seq)
    }

    $scope.recommentAction_valid = function(item) {
        $scope.recomment_clear_valid = 'nodeworksheet-responder-' + item.seq;
        // clear_valid_items('nodeworksheet-responder-' + item.seq)
    }

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
        else if (fieldName == 'node') {
            arr = $scope.data_all.his_node;
        }
        else if (fieldName == 'design_intent') {
            arr = $scope.data_all.his_design_intent;
        }
        else if (fieldName == 'design_conditions') {
            arr = $scope.data_all.his_design_conditions;
        }
        else if (fieldName == 'operating_conditions') {
            arr = $scope.data_all.his_operating_conditions;
        }
        else if (fieldName == 'node_boundary') {
            arr = $scope.data_all.his_node_boundary;
        }
        else if (fieldName == 'causes') {
            arr = $scope.data_all.his_causes;
        }
        else if (fieldName == 'consequences') {
            arr = $scope.data_all.his_consequences;
        }
        else if (fieldName == 'existing_safeguards') {
            arr = $scope.data_all.his_existing_safeguards;
        }
        else if (fieldName == 'safety_critical_equipment_tag') {
            arr = $scope.data_all.his_safety_critical_equipment_tag;
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

        $scope.isShow = fieldID;
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

    $scope.toggleResultsVisibility = function () {
        $scope.showResults = false;
        $scope.isShow = '';
    };

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


    $(document).ready(function () {

    });

    page_load();

    $scope.openDataEmployeeAdd = function (item, form_type) {
        $scope.selectedData = item;
        $scope.selectdata_session = item.seq;
        $scope.selectDatFormType = form_type;//member, approver, owner
        $scope.employeelist_show = [];
        $scope.searchText = '';
        $scope.owner_status = '';

        if (form_type === 'owner') {
            $scope.owner_status = 'employee'; //1 for em || 2 for teams to sent to p'kul
        }

        apply();
        //alert($scope.selectDatFormType);
        $('#modalEmployeeAdd').modal({
            backdrop: 'static',
            keyboard: false 
        }).modal('show');
    };

    $scope.selectTab = function(tab) {
        $scope.owner_status = tab;
    }

    $scope.fillterDataEmployeeAdd = function () {
        $scope.employeelist_show = [];
        //var searchText = $scope.searchText;
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

            $scope.employeelist_show = data.employee
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
                + ',"max_rows":"10"'
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


    $scope.choosDataEmployee = function (item) {

        if(item) {
            var id = item.id;
            var employee_name = item.employee_name;
            var employee_displayname = item.employee_displayname;
            var employee_email = item.employee_email;
            var employee_img = item.employee_img;
            var employee_position = item.employee_position
        }

        var seq_session = $scope.selectdata_session;
        var xformtype = $scope.selectDatFormType;

        if (xformtype == "member") {

            var arr_items = $filter('filter')($scope.data_memberteam, function (item) {
                return (item.id_session == seq_session && item.user_name == employee_name);
            });

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
                newInput.user_img = employee_img;

                $scope.data_memberteam.push(newInput);
                running_no_level1($scope.data_memberteam, null, null);

                $scope.MaxSeqDataMemberteam = Number($scope.MaxSeqDataMemberteam) + 1
            }

        }
        else if (xformtype == "approver") {

            var arr_items = $filter('filter')($scope.data_approver, function (item) {
                return (item.id_session == seq_session && item.user_name == employee_name);
            });

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
                newInput.user_img = employee_img;

                $scope.data_approver.push(newInput);
                running_no_level1($scope.data_approver, null, null);

                $scope.MaxSeqDataMemberteam = Number($scope.MaxSeqDataMemberteam) + 1

            }

        }
        else if (xformtype == "owner") {
            var seq_worksheet = seq_session;

            var arr_items = $filter('filter')($scope.data_nodeworksheet,
                function (item) { return (item.seq == seq_worksheet); })[0];

                arr_items.responder_user_id = id;
                arr_items.responder_user_name = employee_name;
                arr_items.responder_user_displayname = employee_displayname;
                arr_items.responder_user_email = employee_email;
                arr_items.responder_user_img = employee_img;
    

            /*if (arr_items.action_type == 'insert') {
                arr_items.action_type = 'edit';
            }*/

            //set sent 1 for if choose employees
            //set 0 for if choose teams
            if ($scope.owner_status === 'teams') {
                arr_items.project_team_text =  $scope.owner_teams;
                arr_items.action_project_team = true;
                arr_items.action_status = 'N/A'
                
            } else {
                arr_items.responder_user_displayname = employee_position + '-' + employee_displayname.split(" ")[0];
                arr_items.action_project_team = false;
                arr_items.action_status = 'Open'
            }

            arr_items.action_change = 1;

        }

        clear_valid_items($scope.recomment_clear_valid);
        $scope.recomment_clear_valid = '';

        apply();

        if (xformtype == "owner") {
            $('#modalEmployeeAdd').modal('hide');
        }
        else {
            $('#modalEmployeeAdd').modal('show');
        }
    };

    $scope.clearFormData = function() {
        $scope.formData = [];
        //$scope.searchText='';
        $scope.searchIndicator = {
            text: ''
        }        
        //$scope.formData_outsider = [];
    };

    $scope.removeDataEmployee = function (seq, seq_session) {

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

        running_no_level1($scope.data_memberteam, null, null);
        apply();
    };

    $scope.applyDataEmployeeAdd = function () {

        // alert(xformtype);
        if (xformtype == "info") {
            // กรณีที่เลือก approver ta2
            // approve_action_type, approve_status, approver_user_name, approver_user_displayname 
            $scope.data_header[0].approver_user_name = employee;
            $scope.data_header[0].approver_user_displayname = employee_display;


        } else {

            var arr_items = $filter('filter')($scope.data_nodeworksheet, function (item) { return (item.seq == xseq); })[0];

            arr_items.responder_user_id = id;
            arr_items.responder_user_name = employee;
            arr_items.responder_user_displayname = employee_display;
            arr_items.responder_user_email = employee_email;
            arr_items.responder_user_img = profile;


            $scope.actionChangeWorksheet(arr_items, arr_items.seq);
        }
        apply();
        $('#modalEmployeeAdd').modal('hide');
    };

    $scope.downloadFileReviewer = function (item) {

        $scope.exportfile[0].DownloadPath = item.document_file_path;
        $scope.exportfile[0].Name = item.document_file_name;


        $('#modalExportFile').modal('show');
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
        //  alert(1);
        $scope.id_worksheet_select = item.seq;

        $('#modalExportResponderFile').modal('show');
    }

    $scope.downloadFileReviewer = function (item) {
        // alert(2);
        $scope.id_worksheet_select = item.seq;

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
    


    //access each role
    $scope.canAccess = function(task) {
        // If user is an admin, allow access
        if ($scope.flow_role_type === 'admin') {
            return true;
        }
        
        // If user is an employee and the task belongs to them, allow access
        if ($scope.flow_role_type === 'employee' && $scope.user_name === task.user_name) {
            return true;
        }
        
        //originator cant edit?
        return false;
    };
    


});
