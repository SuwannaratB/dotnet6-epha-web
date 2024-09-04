
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
AppMenuPage.filter('isArray', function() {
    return function(input) {
        return Array.isArray(input);
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
  


//to hide please selected
AppMenuPage.directive('hidePlaceholderOption', function() {
    return {
      link: function(scope, element, attrs) {
  
        // Hide 
        element.on('showDropdown', function(event) {

            var placeholderItem = document.querySelector('.is-open .is-active .choices__list .is-selected'); //choices__placeholder
            if (!placeholderItem) {
                var placeholderList = document.querySelector('.is-open .is-active .choices__list[data-value="Please select"]');            
                if (placeholderList) {placeholderList.add('ng-hide')};
            }
            if (placeholderItem) {
                placeholderItem.classList.add('ng-hide');
            }

        });
  
        // Show 
        element.on('hideDropdown', function(event) {
          var placeholderItem = $('.is-open .is-active .choices__list .is-selected'); //choices__placeholder
          if (placeholderItem) {placeholderItem.remove('ng-hide');}
        });

        if (!scope.item.functional_location) {
        }
      }
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
        //console.log($scope.autoText)
        try {
            var dropdown = document.querySelector(`.autocomplete-dropdown-${idinput}`);
            if (dropdown) {
                dropdown.style.display = 'none';
            }
        } catch (error) {

        }
    };

});




AppMenuPage.controller("ctrlAppPage", function ($scope, $http, $filter, conFig, $document, $interval,$rootScope,$window,$timeout,$sce) {

    $scope.unsavedChanges  = false;
    $scope.dataLoaded = false;
    $scope.leavePage = false;


    // Track location changes
    $rootScope.$on('$locationChangeStart', function(event, next, current) {

        if (unsavedChanges) {
            var confirmLeave = $window.confirm("You have unsaved changes. Are you sure you want to leave?");
            if (!confirmLeave) {
                event.preventDefault();
            }
        }
    });

    // close tab / browser window
    $window.addEventListener('beforeunload', function(event) {
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
    

    
    function isEqual(arr1, arr2, path = '') {
        if (arr1 === arr2) return true;

        if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
            console.log(`Expected arrays, found ${typeof arr1} and ${typeof arr2}`);
            return false;
        }
    
        if (arr1.length !== arr2.length) {
            console.log(`Arrays have different lengths at ${path || 'root'}: ${arr1.length} !== ${arr2.length}`);
            return false;
        }
    
        const filterKeys = (obj, path) => {
            const ignoreKeyPaths = ['data_memberteam', 'approver'];
            return Object.keys(obj).reduce((acc, key) => {
                if (key !== '$$hashKey' && key !== 'action_change' && !(key === 'no' && ignoreKeyPaths.some(ignorePath => path.includes(ignorePath)))) {
                    acc[key] = obj[key];
                }
                return acc;
            }, {});
        };
    
        let differencesFound = false;
    
        for (let i = 0; i < arr1.length; i++) {
            const filteredObj1 = filterKeys(arr1[i], path);
            const filteredObj2 = filterKeys(arr2[i], path);
    
            if (!isObjectEqual(filteredObj1, filteredObj2, `${path}[${i}]`)) {
                differencesFound = true;
            }
        }
    
        return !differencesFound;
    }
    
    function isObjectEqual(obj1, obj2, path = '') {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
    
        const allKeys = new Set([...keys1, ...keys2]);
    
        let differencesFound = false;
    
        for (let key of allKeys) {
            if (!keys1.includes(key)) {
                differencesFound = true;
                continue;
            }
            if (!keys2.includes(key)) {
                differencesFound = true;
                continue;
            }
    
            const val1 = obj1[key];
            const val2 = obj2[key];
    
            if (key === 'action_change' && val1 !== 1 && val2 !== 1) {
                continue;
            }
    
            if (!_.isEqual(val1, val2)) {
                differencesFound = true;
            }
    
            if (typeof val1 === 'object' && val1 !== null && typeof val2 === 'object' && val2 !== null) {
                if (!isObjectEqual(val1, val2, path ? path + '.' + key : key)) {
                    differencesFound = true;
                }
            }
        }
    
        return !differencesFound;
    }
    
    function setupWatch(data) {
        $scope.$watch(data, function(newValues, oldValues) {
            if (!$scope.dataLoaded) {
                return;
            }
        
            if ($scope.data_header[0].pha_status === 11 || $scope.data_header[0].pha_status === 12) {
                $scope.stopTimer();
                $scope.startTimer();
    
                if (Array.isArray(newValues) && Array.isArray(oldValues)) {
                    if (!isEqual(newValues, oldValues, data)) {
    
                        $scope.unsavedChanges = true;
                    }
                } else if (!_.isEqual(newValues, oldValues)) {
    
                    $scope.unsavedChanges = true;
                }
            }else{
                if (Array.isArray(newValues) && Array.isArray(oldValues)) {
                    if (!isEqual(newValues, oldValues, data)) {
    
                        $scope.unsavedChanges = true;
                    }
                } else if (!_.isEqual(newValues, oldValues)) {
    
                    $scope.unsavedChanges = true;
                }                
            }
    
        }, true);
    }

    setupWatch('data_general');
    setupWatch('data_approver');
    setupWatch('data_memberteam');
    setupWatch('data_relatedpeople');
    setupWatch('data_relatedpeople_outsider');
    setupWatch('data_tasks_worksheet');


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

    $scope.clearFileUploadData = function (seq) {

        try {

            $scope.data_listworksheet = angular.copy($scope.data_listworksheet_def);
            $scope.data_listworksheet[0].index_rows = 0;
            $scope.data_listworksheet[0].no = 1;
            $scope.data_listworksheet[0].category_no = 1;
            $scope.data_listworksheet[0].possiblecase_no = 1;
            $scope.data_listworksheet[0].potentailhazard_no = 1;
            $scope.data_listworksheet[0].row_type = 'workstep';

            $scope.data_session[0].meeting_date = null;
            $scope.data_session[0].meeting_end_time = null;
            $scope.data_session[0].meeting_end_time_hh = "00";
            $scope.data_session[0].meeting_end_time_mm = "00";
            $scope.data_session[0].meeting_start_time = null;
            $scope.data_session[0].meeting_start_time_hh = "00";
            $scope.data_session[0].meeting_start_time_mm = "00";

            $scope.data_memberteam = angular.copy($scope.data_memberteam_def);
            $scope.data_memberteam[0].id_session = $scope.data_session[0].id;

            $scope.data_approver = angular.copy($scope.data_approver_def);
            $scope.data_approver[0].id_session = $scope.data_session[0].id;

            $scope.data_relatedpeople = angular.copy($scope.data_relatedpeople_def);
            $scope.data_relatedpeople[0].id_session = $scope.data_session[0].id;

            $scope.data_relatedpeople_outsider = angular.copy($scope.data_relatedpeople_outsider_def);
            $scope.data_relatedpeople_outsider[0].id_session = $scope.data_session[0].id;
            

            apply();
        } catch { }

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



    // <!======================== manage tabs ==============================!?>

    if(true){
        $scope.changeTab = function (selectedTab) {

            try {
                if ($scope.data_header[0].pha_status == 11) {
                    if (selectedTab.name == 'worksheet') {
                        //$('#modalPleaseRegister').modal('show');
                        if(!validBeforRegister()) {
                            // remove tab
                            selectedTab.isActive = false;
                            var tabPane = document.getElementById("tab-" + selectedTab.name);
                            if (tabPane) tabPane.classList.remove('show', 'active');
                            // set tab general
                            $scope.tabs[0].isActive = true;
                            var activeTabPane = document.getElementById("tab-" + $scope.tabs[0].name);
                            if (activeTabPane) {
                                setTimeout(() => {
                                    activeTabPane.classList.add('show', 'active');
                                    $scope.action_part = 1
                                    var activeTabBtn = document.getElementById($scope.tabs[0].name + "-tab");
                                    if (activeTabBtn) activeTabBtn.classList.add('active');
                                }, 1000);
                            }
                            
                            return set_alert('Warning',$scope.validMessage)
                        }
    
                        return $scope.confirmSave('confirm_submit_register_without')
                    }
                }
            } catch (error) { }
    
    
            // Set all tabs to inactive
            angular.forEach($scope.tabs, function (tab) {
                tab.isActive = false;
                var tabPane = document.getElementById("tab-" + tab.name);
                if (tabPane) {
                    tabPane.classList.remove('show', 'active');
                }
            });
    
            selectedTab.isActive = true;
            var activeTabPane = document.getElementById("tab-" + selectedTab.name);
            if (activeTabPane) {
                activeTabPane.classList.add('show', 'active');
            }
    
            check_tab(selectedTab.name);
    
    
    
            $scope.oldTab = selectedTab;
            apply();
        };
    
        $scope.goBackToTab = function (){
            var tag_name = $scope.goback_tab;
    
            var arr_tab = $filter('filter')($scope.tabs, function (item) {
                return ((item.name == tag_name));
            });
    
            $scope.changeTab_Focus(arr_tab, tag_name);
        }
    
        $scope.changeTab_Focus = function (selectedTab, nameTab) {
            angular.forEach($scope.tabs, function (tab) {
                tab.isActive = false;
            });
    
            // Set all tabs to inactive
            angular.forEach($scope.tabs, function (tab) {
                tab.isActive = false;
                var tabPane = document.getElementById("tab-" + tab.name);
                if (tabPane) {
                    tabPane.classList.remove('show', 'active');
                }
            });
    
            if(Array.isArray){
                selectedTab[0].isActive = true;
                var activeTabPane = document.getElementById("tab-" + selectedTab[0].name);
                if (activeTabPane) {
                    activeTabPane.classList.add('show', 'active');
                }
    
                console.log("show tabs",$scope.tabs)
                check_tab(selectedTab[0].name);
    
            }else{
                selectedTab.isActive = true;
                var activeTabPane = document.getElementById("tab-" + selectedTab.name);
                if (activeTabPane) {
                    activeTabPane.classList.add('show', 'active');
                }
    
                console.log("show tabs",$scope.tabs)
    
                check_tab(selectedTab.name);
            }
    
    
            apply();
        };
        $scope.editWorksheet = function (tab_worksheet_active) {
            $scope.tab_worksheet_active = !tab_worksheet_active;
        }
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
        

        $scope.truncateFilename = function(filename, length) {
            if (!filename) return '';
            if (filename.length <= length) return filename;
            const start = filename.slice(0, Math.floor(length / 2));
            const end = filename.slice(-Math.floor(length / 2));
            return `${start}.......${end}`;
        };
        
        $scope.fileUploadSelectTemplate = function (input) {
            var file_doc = $scope.data_header[0].pha_no;
            const fileInput = input;
            const fileSeq = fileInput.id.split('-')[1];
            const fileInfoSpan = document.getElementById('uploadfile-' + fileSeq);

            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const fileName = file.name;
                const fileSize = Math.round(file.size / 1024);
                //fileInfoSpan.textContent = `${fileName} (${fileSize} KB)`;

                let shortenedFileName = fileName.length > 20 ? fileName.substring(0, 20) + '...' : fileName;
                fileInfoSpan.textContent = `${shortenedFileName} (${fileSize} KB)`;


                if (fileName.toLowerCase().indexOf('.xlsx') == -1 && fileName.toLowerCase().indexOf('.xls') == -1) {
                    fileInfoSpan.textContent = "";
                    set_alert('Warning', 'Please select a Excle file.');
                    return;
                }

                var fd = new FormData();
                //Take the first selected file
                fd.append("file_obj", file);
                fd.append("file_seq", fileSeq);
                fd.append("file_name", fileName);
                fd.append("file_doc", file_doc);
                fd.append("sub_software", 'jsea');

                try {
                    $("#divLoading").show(); 
                    const request = new XMLHttpRequest();
                    request.open("POST", url_ws + 'Flow/importfile_data_jsea');
                    //request.send(fd);

                    const ALERT_MESSAGES = {
                        INVALID_RESPONSE: 'There was an issue with the response from the server. Please try again later.',
                        ERROR_STATUS: 'The operation could not be completed due to an error. Please check the details and try again.',
                        SUCCESS: 'The operation was completed successfully.',
                        GENERIC_ERROR: 'An unexpected error occurred. Please contact support if the issue persists.'
                    };

                    request.onreadystatechange = function () {
                        if (request.readyState === XMLHttpRequest.DONE) {
                            if (request.status === 200) {

                                const responseFromService = JSON.parse(request.responseText);

                                // Check if the response is valid and if the STATUS is "true"
                                if (responseFromService && responseFromService.msg && Array.isArray(responseFromService.msg) && responseFromService.msg.length > 0) {
                                    if (responseFromService.msg[0].STATUS === "true") {
                                        
                                        // ทำอะไรกับข้อมูลที่ได้รับเช่น แสดงผลหรือประมวลผลต่อไป
                                        const array = responseFromService;
            
                                        if (true) {
                                            var file_name = array.msg[0].ATTACHED_FILE_NAME;
                                            var file_path = array.msg[0].ATTACHED_FILE_PATH;
                                            
                                            $scope.data_general[0].file_upload_name = file_name;
                                            $scope.data_general[0].file_upload_size = fileSize;
                                            $scope.data_general[0].file_upload_path = service_file_url + file_path;
                                            $scope.data_general[0].action_change = 1;
                                            set_data_general()
                                        }
            
                                        if (array.max) {
                                            var arr = $filter('filter')(array.max, function (item) { return (item.name == 'memberteam'); });
                                            var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
                                            $scope.MaxSeqDataMemberteam = iMaxSeq;
            
                                            $scope.MaxSeqdata_approver = 0;
                                            var arr_check = $filter('filter')(array.max, function (item) { return (item.name == 'approver'); });
                                            var iMaxSeq = 1; if (arr_check.length > 0) { iMaxSeq = arr_check[0].values; }
                                            $scope.MaxSeqdata_approver = iMaxSeq;
            
                                            var arr = $filter('filter')(array.max, function (item) { return (item.name == 'tasks_worksheet'); });
                                            var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
                                            $scope.MaxSeqdata_listworksheet = iMaxSeq;
                                        }
            
                                        if (true) {
                                            var id_session = $scope.selectdata_session;
                                            if (array.memberteam) {
                                                $scope.data_memberteam_old = [];
                                                angular.copy($scope.data_memberteam, $scope.data_memberteam_old);
            
                                                array.memberteam.forEach(function (member) {
                                                    member.id_session = id_session; // newValue 
                                                });
            
                                                $scope.data_memberteam = [...$scope.data_memberteam, ...array.memberteam]; 
                                                //console.log("check array memberteam", array.memberteam, "check memberteam", $scope.data_memberteam);  
                                            }
                                            if (array.approver) {
                                                $scope.data_approver_old = [];
                                                angular.copy($scope.data_approver, $scope.data_approver_old);
            
                                                array.approver.forEach(function (approver) {
                                                    approver.id_session = id_session; // newValue 
                                                });
            
                                                $scope.data_approver = [...$scope.data_approver,...array.approver]; 

                                                // Remove duplicates based on id and filter out invalid entries (where user_displayname or user_name is null or empty)
                                                $scope.data_approver = $scope.data_approver.reduce((acc, current) => {
                                                    const existingItem = acc.find(item => item.id === current.id);
                                                    
                                                    // Check if user_displayname or user_name is null or empty
                                                    const isValid = current.user_displayname && current.user_displayname !== "" 
                                                                    && current.user_name && current.user_name !== "";
                                                    
                                                    if (!existingItem && isValid) {
                                                        acc.push(current);
                                                    }
                                                
                                                    return acc;
                                                }, []);
                                                
                                                console.log("After removing duplicates:", $scope.data_approver);
                                                

            
                                            }
                                            if (array.relatedpeople_outsider) {
                                                //$scope.data_approver_old = [];
                                                //angular.copy($scope.data_approver, $scope.data_approver_old);
                                                array.relatedpeople_outsider.forEach(function (approver) {
                                                    approver.id_session = id_session; // newValue คือค่าที่คุณต้องการให้ id_session อัปเดตเป็น
                                                });
            
                                                $scope.data_relatedpeople_outsider = [...$scope.data_relatedpeople_outsider,...array.relatedpeople_outsider]; 

                                                // Remove duplicates based on id and filter out invalid entries (where user_displayname or user_name is null or empty)
                                                $scope.data_relatedpeople_outsider = $scope.data_relatedpeople_outsider.reduce((acc, current) => {
                                                    const existingItem = acc.find(item => item.id === current.id);
                                                    
                                                    // Check if user_displayname or user_name is null or empty
                                                    const isValid = current.user_displayname && current.user_displayname !== "" ;
                                                    
                                                    if (!existingItem && isValid) {
                                                        acc.push(current);
                                                    }
                                                
                                                    return acc;
                                                }, []);
                                                //console.log("check array relatedpeople", array.relatedpeople_outsider, "check relatedpeoplem",  $scope.data_relatedpeople_outsider);                                                                     
                                            }
                                            if (array.tasks_worksheet) {
                                                //old data 
                                                angular.copy($scope.data_listworksheet, $scope.data_listworksheet_delete);
                                                $scope.data_listworksheet = JSON.parse(replace_hashKey_arr(array.tasks_worksheet));
                                                $scope.data_listworksheet_def = clone_arr_newrow(array.tasks_worksheet);
                                            }
                                        } 
                                        apply();
            
                                        //set_alert('Warning', "Upload Data Success.");
                                        $('#modalMsgFile').modal('show');
                                        console.log('Status is true:', responseFromService.msg[0].STATUS);
                                        set_alert('Success', ALERT_MESSAGES.SUCCESS);
                                    } else {
                                        console.error('Status is not true. Error message:', responseFromService.msg[0].IMPORT_DATA_MSG);
                                        set_alert('Warning', ALERT_MESSAGES.ERROR_STATUS);
                                    }
                                } else {
                                    console.error('Invalid response structure or no messages returned.');
                                    set_alert('Error', ALERT_MESSAGES.INVALID_RESPONSE);
                                }
                            } else {
                                // กรณีเกิดข้อผิดพลาดในการร้องขอไปยัง server
                                console.error('มีข้อผิดพลาด: ' + request.status);
                            }
                            $("#divLoading").hide(); 
                        }
                    };

                    request.send(fd);

                } catch { 
                    $("#divLoading").hide(); 
                }

                updateDataSessionAccessInfo('session')

            } else {
                fileInfoSpan.textContent = "";
            }
        }
    
        function validateFile(file, maxFileSizeKB, allowedFileTypes) {
            const fileSizeKB = Math.round(file.size / 1024);
            const fileExtension = file.name.split('.').pop().toLowerCase();
            
            if (fileSizeKB > maxFileSizeKB) {
                return { valid: false, message: `File size exceeds ${maxFileSizeKB / 1024} MB. Please select a smaller file.` };
            }
    
            if (!allowedFileTypes.includes(fileExtension)) {
                const allowedTypesFormatted = allowedFileTypes.map(type => type.toUpperCase()).join(', ');
                return { valid: false, message: `Unsupported file type. Please upload a file in one of the following formats: ${allowedTypesFormatted}.` };
            }
            
            return { valid: true, fileSizeKB, fileExtension };
        }
            
        $scope.fileSelectApprover = function (input, file_part) {
            try {
                const fileDoc = $scope.data_header[0].pha_no;
                const fileInput = input;
                const fileSeq = fileInput.id.split('-')[2];
                const fileInfoSpan = document.getElementById('filename-approver-' + fileSeq);
        
                if (fileInput.files.length > 0) {
                    const file = fileInput.files[0];
                    const validation = validateFile(file, 10240, ['pdf', 'eml', 'msg']);
        
                    if (!validation.valid) {
                        set_alert('Warning', validation.message);
                        return;
                    }
        
                    uploadFile(file, fileSeq, file.name, validation.fileSizeKB, file_part, fileDoc)
                        .then(response => {
                            // Update the scope data with the new file information
                            const arr = $filter('filter')($scope.data_drawing_approver, function (item) { return item.seq == fileSeq; });
                            if (arr.length > 0) {
                                arr[0].document_file_name = response.ATTACHED_FILE_NAME;
                                arr[0].document_file_size = validation.fileSizeKB;
                                arr[0].document_file_path = service_file_url + response.ATTACHED_FILE_PATH;
                                arr[0].document_module = 'approver';
                                arr[0].action_change = 1;
                                arr[0].action_type = arr[0].action_type === 'new' ? 'insert' : arr[0].action_type;
                                $scope.$apply(); // Ensure the scope is updated
                            }
                            set_alert('Success', 'Your file has been successfully attached.');
                        })
                        .catch(error => {
                            console.error('File upload error:', error);
                        });
                } else {
                    fileInfoSpan.textContent = "";
                    set_alert('Warning', "No file selected. Please select a file to upload.");
                }
            } catch (error) {
                console.error('Unexpected error during file selection:', error);
                set_alert('Error', 'An unexpected error occurred. Please try again or contact support.');
            }
        };
        
        $scope.fileSelect = function (input, file_part) {
            try {
                const fileDoc = $scope.data_header[0].pha_no;
                const fileInput = input;
                const fileSeq = fileInput.id.split('-')[1];
                const fileInfoSpan = document.getElementById('filename' + fileSeq);
        
                if (fileInput.files.length > 0) {
                    const file = fileInput.files[0];
                    const validation = validateFile(file, 10240, ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'png', 'gif']);
        
                    if (!validation.valid) {
                        set_alert('Warning', validation.message);
                        return;
                    }
        
        
                    uploadFile(file, fileSeq, file.name, validation.fileSizeKB, file_part, fileDoc)
                        .then(response => {
                            // Update the scope data with the new file information
                            const arr = $filter('filter')($scope.data_drawing, function (item) { return item.seq == fileSeq; });
                            if (arr.length > 0) {
                                arr[0].document_file_name = response.ATTACHED_FILE_NAME;
                                arr[0].document_file_size = validation.fileSizeKB;
                                arr[0].document_file_path = service_file_url + response.ATTACHED_FILE_PATH;
                                arr[0].document_module = 'hra';
                                arr[0].action_change = 1;
                                $scope.$apply(); // Ensure the scope is updated
                            }
                            set_alert('Success', 'Your file has been successfully attached.');
                        })
                        .catch(error => {
                            console.error('File upload error:', error);
                        });
                } else {
                    fileInfoSpan.textContent = "";
                    set_alert('Warning', "No file selected. Please select a file to upload.");
                }
            } catch (error) {
                console.error('Unexpected error during file selection:', error);
                set_alert('Error', 'An unexpected error occurred. Please try again or contact support.');
            }
        };

        function uploadFile(file, seq, fileName, fileSizeKB, filePart, fileDoc) {
            const fd = new FormData();
            fd.append("file_obj", file);
            fd.append("file_seq", seq);
            fd.append("file_name", fileName);
            fd.append("file_doc", fileDoc);
            fd.append("file_part", filePart); // drawing, responder, approver
            fd.append("sub_software", 'hra');
        
            return new Promise((resolve, reject) => {
                const request = new XMLHttpRequest();
                request.open("POST", url_ws + 'Flow/uploadfile_data');
        
                request.onreadystatechange = function () {
                    if (request.readyState === XMLHttpRequest.DONE) {
                        $("#divLoading").hide();
                        if (request.status === 200) {
                            try {
                                const parsedResponse = JSON.parse(request.responseText);
                                if (parsedResponse && parsedResponse.msg && parsedResponse.msg.length > 0 && parsedResponse.msg[0].STATUS === "true") {
                                    resolve(parsedResponse.msg[0]);
                                } else {
                                    set_alert('Warning', 'The system encountered an issue processing your file. Please try again or contact support if the problem persists.');
                                    reject('Service response indicated an issue.');
                                }
                            } catch (e) {
                                set_alert('Error', 'Unexpected issue occurred while processing your request. Please try again later.');
                                reject(e);
                            }
                        } else {
                            set_alert('Error', 'We are unable to complete your request at the moment. Please check your connection or try again later.');
                            reject('Error during server request: ' + request.status);
                        }
                    }
                };
        
                $("#divLoading").show();
                request.send(fd);
            });
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

    $scope.focusTask = function () {
        var tag_name = 'task';
        var arr_tab = $filter('filter')($scope.tabs, function (item) {
            return ((item.name == tag_name));
        });
        $scope.changeTab_Task(arr_tab, tag_name);
        document.getElementById("task_" + $scope.selectedItemListView).focus();
    }
    $scope.changeSearchApprover = function () {

    }
    $scope.showCauseText = function (responder_user_id, workstep_no) {
        $scope.data_listworksheet_show = [];
        var arr = $filter('filter')($scope.data_listworksheet, function (item) { return (item.responder_user_id == responder_user_id && item.workstep_no == workstep_no); });

        angular.copy(arr, $scope.data_listworksheet_show);

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
            
                if (arr && arr.msg && arr.msg.length > 0) { 
                    console.log("have array");
            
                    if (arr.msg[0].STATUS === "true") { 
                        console.log("it true");
                        var path = (url_ws).replace('/api/', '') + arr.msg[0].ATTACHED_FILE_PATH;
                        var name = arr.msg[0].ATTACHED_FILE_NAME;
                        $scope.exportfile[0].DownloadPath = path;
                        $scope.exportfile[0].Name = name;
            
                        $('#modalExportFile').modal('show');
                        $("#divLoading").hide(); 
            
                    } else {
                        $("#divLoading").hide();
                        set_alert('Warning', arr.msg[0].IMPORT_DATA_MSG); 
                    }
                } else {
                    set_alert('Warning', 'Unable to connect to the service. Please check your internet connection or try again later.');
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
        var ram_type = $scope.data_general[0].id_ram;

        //$scope.confirmExport('jsea_worksheet', 'excel');
        //return;

        $.ajax({
            url: url_ws + "Flow/" + action_export_report_type,
            data: '{"sub_software":"jsea","user_name":"' + user_name + '","seq":"' + seq + '","export_type":"' + data_type + '","ram_type":"' + ram_type + '"}',
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
        $scope.master_unit_no_list = [];
        $scope.master_tagid = [];
        $scope.master_tagid_list = [];
        $scope.master_tagid_audition = [];
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

        $scope.data_listworksheet = [];

        $scope.data_session_delete = [];
        $scope.data_memberteam_delete = [];
        $scope.data_drawing_delete = [];
        $scope.data_drawing_approver_delete = [];
        $scope.data_listworksheet_delete = [];

        $scope.select_history_tracking_record = false;

        $scope.selectedDataworksheetRamType = null;
        $scope.selectedDataNodeWorksheetRamType = null;

        $scope.select_rows_level = 5;
        $scope.select_columns_level = 5;
        $scope.selected_ram_img = (url_ws.replace('/api/', '/')) + 'AttachedFileTemp/rma-img-' + 5 + 'x' + 5 + '.png';

        $scope.data_listworksheet_show = [];


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

        $scope.search_keywords = {
            indicator: '',
            unit_no: '',
            tag_id: '',
            request_type: '',
        }

        $scope.editedText = '';

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

        $scope.sub_software = 'JSEA';
        $scope.sub_software_display = 'JSEA';

        $scope.tabs = [
            { name: 'general', action_part: 1, title: 'General Information', isActive: true, isShow: false },
            { name: 'ram', action_part: 2, title: 'RAM', isActive: false, isShow: false },
            { name: 'worksheet', action_part: 3, title: $scope.sub_software + ' Worksheet', isActive: false, isShow: false },
            //{ name: 'relatedpeople', action_part: 4, title: ' Review & Approver Person', isActive: false, isShow: false },
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
        $scope.MaxSeqdata_listworksheet = iMaxSeq;

        var arr = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'workstep'); });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqdata_listworksheetworkstep = iMaxSeq;

        var arr = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'taskdesc'); });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqdata_listworksheettaskdesc = iMaxSeq;

        var arr = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'potentailhazard'); });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqdata_listworksheetpotentailhazard = iMaxSeq;

        var arr = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'possiblecase'); });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqdata_listworksheetpossiblecase = iMaxSeq;

        var arr = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'category'); });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqdata_listworksheetcategory = iMaxSeq;

        $scope.MaxSeqdata_approver = 0;
        var arr_check = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'approver'); });
        var iMaxSeq = 1; if (arr_check.length > 0) { iMaxSeq = arr_check[0].values; }
        $scope.MaxSeqdata_approver = iMaxSeq;

        $scope.MaxSeqdata_drawing_approver = 0;
        var arr_check = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'drawing_approver'); });
        var iMaxSeq = 1; if (arr_check.length > 0) { iMaxSeq = arr_check[0].values; }
        $scope.MaxSeqdata_drawing_approver = iMaxSeq;


        $scope.MaxSeqdata_relatedpeople = 0;
        var arr_check = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'relatedpeople'); });
        var iMaxSeq = 1; if (arr_check.length > 0) { iMaxSeq = arr_check[0].values; }
        $scope.MaxSeqdata_relatedpeople = iMaxSeq;


        $scope.MaxSeqdata_relatedpeople_outsider = 0;
        var arr_check = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'relatedpeople_outsider'); });
        var iMaxSeq = 1; if (arr_check.length > 0) { iMaxSeq = arr_check[0].values; }
        $scope.MaxSeqdata_relatedpeople_outsider = iMaxSeq;


        $scope.selectdata_session = 1;
        $scope.selectdata_memberteam = 1;
        $scope.selectdata_drawing = 1;
        $scope.selectdata_tasklist = 0;

        $scope.selectdata_listworksheet = 1;
        $scope.selectdata_listworksheetworkstep = 1;
        $scope.selectdata_listworksheettaskdesc = 1;
        $scope.selectdata_listworksheetpotentailhazard = 1;
        $scope.selectdata_listworksheetpossiblecase = 1;
        $scope.selectdata_listworksheetcategoryegory = 1;
        $scope.selectdata_listworksheetrelated_people = 1;

        $scope.exportfile = [{ DownloadPath: '', Name: '' }];
    }
    function apply() {
        try {
            if ($scope.$root.$$phase !== '$apply' && $scope.$root.$$phase !== '$digest') {
                $scope.$apply();
            }
        } catch (e) {
            console.error("Error applying changes:", e);
            // Attempt to force digest cycle using $timeout as fallback
            $timeout(function() {
                $scope.$digest();
            });
        }
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

        check_data_general();
        check_data_tagid_audition();

        var action_part = $scope.action_part;
        var user_name = $scope.user_name;
        var token_doc = $scope.token_doc + "";
        var pha_status = $scope.data_header[0].pha_status;
        var pha_version = $scope.data_header[0].pha_version;
        var pha_seq = $scope.data_header[0].seq;
        token_doc = pha_seq;

        var json_header = angular.toJson($scope.data_header);
        var json_general =  check_data_general();
        //var json_tagid_audition = angular.toJson($scope.data_tagid_audition);
        var json_functional_audition = angular.toJson($scope.data_tagid_audition);

        var json_session = check_data_session();
        var json_memberteam = check_data_memberteam();
        var json_approver = check_data_approver();
        var json_relatedpeople = check_data_relatedpeople();
        var json_relatedpeople_outsider = check_data_relatedpeople_outsider();
        var json_drawing = check_data_drawing();

        var json_tasks_worksheet = check_data_listworksheet();

        //EPHA_M_RAM_LEVEL
        var json_ram_level = check_data_ram_level();
        var json_ram_master = check_master_ram();

        var flow_action = (action == 'submit_complete' ? 'submit' : action);

        $.ajax({
            url: url_ws + "Flow/set_jsea",
            data: '{"user_name":"' + user_name + '","token_doc":"' + token_doc + '","pha_status":"' + pha_status + '","pha_version":"' + pha_version + '","action_part":"' + action_part + '"'
                + ',"json_header":' + JSON.stringify(json_header)
                + ',"json_general":' + JSON.stringify(json_general)
                + ',"json_functional_audition":' + JSON.stringify(json_functional_audition)
                + ',"json_session":' + JSON.stringify(json_session)
                + ',"json_memberteam":' + JSON.stringify(json_memberteam)
                + ',"json_approver":' + JSON.stringify(json_approver)
                + ',"json_relatedpeople":' + JSON.stringify(json_relatedpeople)
                + ',"json_relatedpeople_outsider":' + JSON.stringify(json_relatedpeople_outsider)
                + ',"json_drawing":' + JSON.stringify(json_drawing)
                + ',"json_ram_level":' + JSON.stringify(json_ram_level)
                + ',"json_ram_master":' + JSON.stringify(json_ram_master)
                + ',"json_tasks_worksheet":' + JSON.stringify(json_tasks_worksheet)
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
                    if (action == 'save' || action == 'submit_moc'
                        || action_def == "confirm_submit_register"
                        || action_def == "confirm_submit_register_without") {

                        var controller_action_befor = conFig.controller_action_befor();
                        var pha_seq = arr[0].pha_seq;
                        var pha_no = arr[0].pha_no;
                        var pha_type_doc = "edit";

                        $scope.pha_seq = arr[0].pha_seq;


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

                                
                                if ($scope.leavePage) {
                                    window.open("home/portal", "_top");
                                    return;
                                }

                                

                                get_data_after_save(false, (flow_action == 'submit' ? true : false), $scope.pha_seq);

                                console.log("auto save will call auto save modal")
                                if ($scope.autosave === true) {
                                    $timeout(function() {
                                        $("#autosaved").modal("show");
                                        $(".modal-backdrop").remove();
                                    }, 3000);
                                    $('#autosaved').modal('hide');
                                    
                                } else {
                                    set_alert('Success', 'Data has been successfully saved.');

                                }
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
                    else if (action == 'submit_without') {

                        var controller_action_befor = conFig.controller_action_befor();
                        var pha_seq = arr[0].pha_seq;
                        var pha_no = arr[0].pha_no;
                        var pha_type_doc = "edit";

                        $scope.pha_seq = arr[0].pha_seq;

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
                     
                    else {

                        set_alert('Success', 'Data has been successfully submitted.');
                        window.open('hazop/search', "_top");
                        return;
                    }

                } else  {
                    $('#returnModal').modal({
                        backdrop: 'static',
                        keyboard: false 
                    }).modal('show');
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
        $scope.unsavedChanges  = false;

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

            //กรณีที่เป็น safety review submit ให้บังคับ action_status  เป็น approve
            if (arr_json[0].approver_type == 'safety' && flow_action == 'submit') { action_status = 'approve' }

        } else { set_alert('Error', 'No Data.'); return; }
        var json_drawing_approver = check_data_drawing_approver(id_session);
        var json_approver = check_data_approver();

        $.ajax({
            url: url_ws + "flow/set_approve",
            data: '{"sub_software":"jsea","user_name":"' + user_name + '","role_type":"' + flow_role_type + '","action":"' + flow_action + '","token_doc":"' + pha_seq + '","pha_status":"' + pha_status + '"'
                + ',"id_session":"' + id_session + '","seq":"' + seq + '","action_status":"' + action_status + '","comment":"' + comment + '","user_approver":"' + user_approver + '"'
                + ', "json_approver": ' + JSON.stringify(json_approver)
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

                if (arr[0].status == 'true') {
                    $scope.pha_type_doc = 'update';

                    if (action == 'save') {

                        set_alert('Success', 'Data has been successfully saved.');
                        apply();

                        return get_data_after_save(false, false, $scope.pha_seq);

                    }
                    else {

                        if (arr[0].pha_status == '21') {
                            //กรณีที่ TA2 approve all
                            //window.open('hazop/search', "_top");

                            var controller_action_befor = conFig.controller_action_befor();
                            var pha_seq = conFig.pha_seq();
                            var pha_no = conFig.pha_no();
                            var pha_type_doc = 'update';

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

                                    get_data_after_save(false, (flow_action == 'submit' ? true : false), $scope.pha_seq);

                                    set_alert('Success', 'Data has been successfully submitted.');
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

    function save_data_editworksheet(action) {

        var user_name = $scope.user_name;
        var token_doc = $scope.token_doc + "";
        var pha_seq = $scope.data_header[0].seq;
        var pha_status = $scope.data_header[0].pha_status;
        var flow_role_type = $scope.flow_role_type;

        //submit, submit_without, submit_complete

        var flow_action = action;
        var json_worksheet = check_data_listworksheet();

        $.ajax({
            url: url_ws + "flow/edit_worksheet",
            data: '{"sub_software":"jsea","user_name":"' + user_name + '","role_type":"' + flow_role_type + '","action":"' + flow_action + '","token_doc":"' + pha_seq + '","pha_status":"' + pha_status + '"'
                + ', "json_worksheet": ' + JSON.stringify(json_worksheet)
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
         

                $scope.pha_seq = arr[0].pha_seq;
                set_alert('Success', 'Data has been successfully saved.');

                get_data_after_save(false, false, $scope.pha_seq);

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
            url: url_ws + "Flow/get_jsea_details",
            data: '{"sub_software":"jsea","user_name":"' + user_name + '","token_doc":"' + pha_seq + '","type_doc":"' + type_doc + '"}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
            beforeSend: function () {
                //if (!page_load) { $('#modalLoadding').modal('show'); }
                $('#divLoading').show();
                $('#divPage').addClass('d-none');

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
                    $scope.master_unit_no_list = arr.unit_no;
                    $scope.master_tagid = arr.tagid;
                    $scope.master_tagid_list = arr.tagid;
                    $scope.master_tagid_audition = arr.tagid;//ใช้ใน tag id audition

                    //แก้ไขเบื้องต้น เนื่องจาก path file ผิดต้องเป็น folder jsea
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

                    $scope.employeelist_def = arr.employee;
                    arr.general[0].input_type_excel = (arr.general[0].input_type_excel == null ? 0 : arr.general[0].input_type_excel);
                    $scope.data_general = arr.general;

                    //set id to 5 
                    $scope.data_general.forEach(function (item) {
                        item.id_ram = (item.id_ram == null ? 4 : item.id_ram);
                    });

                    var formattedText_check =  $scope.data_general[0].mandatory_note
                    if (formattedText_check && /\W+/.test(formattedText_check)){
                        var formattedText =  formattedText_check.replace(/\\n\r\n/g, '<br><br>');

                        $scope.formattedText = formattedText;
                        $scope.renderHtml = function(htmlContent) {
                            return $sce.trustAsHtml(htmlContent);
                        };
    
                    }
                    
                    $scope.mandatory_note = arr.mandatory_note
       
                    $scope.data_tagid_audition = arr.tagid_audition;

                    $scope.data_session = arr.session;
                    $scope.data_session_def = clone_arr_newrow(arr.session);
                   
                    $scope.data_memberteam = arr.memberteam;
                    $scope.data_memberteam_def = clone_arr_newrow(arr.memberteam);
                    $scope.data_memberteam_old = (arr.memberteam);

                    $scope.data_approver = arr.approver;
                    $scope.data_approver_def = clone_arr_newrow(arr.approver);
                    $scope.data_approver_old = (arr.approver);

                    $scope.data_relatedpeople = arr.relatedpeople;
                    $scope.data_relatedpeople_def = clone_arr_newrow(arr.relatedpeople);
                    $scope.data_relatedpeople_old = (arr.relatedpeople);

                    $scope.data_relatedpeople_outsider = arr.relatedpeople_outsider;
                    $scope.data_relatedpeople_outsider_def = clone_arr_newrow(arr.relatedpeople_outsider);
                    $scope.data_relatedpeople_outsider_old = (arr.relatedpeople_outsider);
                    
                    $scope.data_drawing = arr.drawing;
                    $scope.data_drawing_def = clone_arr_newrow(arr.drawing);

                    //$scope.data_drawing_approver_responder = arr.drawingworksheet_responder;
                    //$scope.data_drawing_approver_reviewer = arr.drawingworksheet_reviewer;

                    $scope.data_listworksheet = JSON.parse(replace_hashKey_arr(arr.tasks_worksheet));
                    $scope.data_listworksheet_def = clone_arr_newrow(arr.tasks_worksheet);

                    $scope.data_drawing_approver = arr.drawing_approver;
                    $scope.data_drawing_approver_def = clone_arr_newrow(arr.drawing_approver);
                    $scope.data_drawing_approver_old = (arr.drawing_approver);
                
                    get_max_id();
                    set_data_general();
                    set_data_related_people();//set format date
                    set_data_listworksheet('');
                    set_master_ram_likelihood('');
                    set_data_approver();

                    try {
                        var id_session_last = arr.session[arr.session.length - 1].seq;
                        $scope.selectdata_session = id_session_last;

                    } catch { $scope.selectdata_session = $scope.MaxSeqDataSession; }


                    //get recommendations_no in tasks worksheet
                    if ($scope.data_listworksheet.length > 0) {
                        var arr_copy_def = angular.copy($scope.data_listworksheet, arr_copy_def);
                        arr_copy_def.sort((a, b) => Number(b.recommendations_no) - Number(a.recommendations_no));
                        var recommendations_no = Number(Number(arr_copy_def[0].recommendations_no) + 1);
                        for (let i = 0; i < $scope.data_listworksheet; i++) {
                            if ($scope.data_listworksheet[i].recommendations == null || $scope.data_listworksheet[i].recommendations == '') {
                                if ($scope.data_listworksheet[i].recommendations_no == null || $scope.data_listworksheet[i].recommendations_no == '') {
                                    $scope.data_listworksheet[i].recommendations_no = recommendations_no;
                                    recommendations_no += 1;
                                }
                            }
                        }
                        $scope.selectedItemListView = $scope.data_listworksheet[0].seq;

                    }


                }

                $scope.data_session_delete = [];
                $scope.data_memberteam_delete = [];
                $scope.data_approver_delete = [];
                $scope.data_relatedpeople_delete = [];
                $scope.data_relatedpeople_outsider_delete = [];
                $scope.data_drawing_delete = [];
                $scope.data_listworksheet_delete = [];
                $scope.data_request_type = arr.request_type;
                $scope.data_request_type_list = arr.request_type;
                $scope.data_departments = arr.departments;
                $scope.data_attendees= [];


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
                $scope.submit_type = true;

                $scope.selectActiveNotification = (arr.header[0].active_notification == 1 ? true : false);

                if (page_load) {
                    if (arr.header[0].pha_status >= 21) {
                        $scope.tabs = [
                            { name: 'general', action_part: 1, title: 'General Information', isActive: false, isShow: false },
                            { name: 'ram', action_part: 2, title: 'RAM', isActive: false, isShow: false },
                            { name: 'worksheet', action_part: 3, title: $scope.sub_software + ' Worksheet', isActive: true, isShow: false },
                            { name: 'approver', action_part: 4, title: 'Safety Reviewer', isActive: false, isShow: false },
                            { name: 'report', action_part: 5, title: 'Report', isActive: false, isShow: false }
                        ];
                    }
                }

                var inputs = document.getElementsByTagName('switchEmailToMemberChecked');
                for (var i = 0; i < inputs.length; i++) {
                    if (inputs[i].type == 'checkbox') {
                        if (arr.header[0].flow_mail_to_member == 1) {
                            inputs[i].checked = true;
                        } else { inputs[i].checked = false; }
                    }
                }


                arr.header[0].flow_mail_to_member = (arr.header[0].flow_mail_to_member == null ? 0 : arr.header[0].flow_mail_to_member);
                $scope.data_header = JSON.parse(replace_hashKey_arr(arr.header));
                set_form_action(action_part_befor, !action_submit, page_load);
                set_access_formaction(arr);
                
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
                            //$scope.action_part = action_part_befor;
                            $scope.tabs = tabs_befor;
                        }
                    }

                    var i = 0;
                    var id_ram = $scope.data_general[0].id_ram; //id_ram == 4

                    var arr_items = $filter('filter')($scope.master_ram_level, function (item) { return (item.id_ram == id_ram); }); //id_ram == 4?
                    if (arr_items.length > 0) {

                        $scope.select_rows_level = arr_items[0].rows_level; // return 4
                        $scope.select_columns_level = arr_items[0].columns_level; // return 4
                        $scope.selected_ram_img = (url_ws.replace('/api/', '/')) + arr_items[0].document_file_path;
                    }

                    try{
                        $scope.master_tagid = JSON.parse(replace_hashKey_arr(arr.tagid));

                        if ($scope.data_general[0].id_apu == null || $scope.data_general[0].id_apu == '') {
                            $scope.data_general[0].id_apu = null;
                            var arr_clone_def = { id: null, name: 'Please select' };
                            $scope.master_apu.splice(0, 0, arr_clone_def);
                        }

                        if ($scope.data_general[0].id_tagid == null || $scope.data_general[0].id_tagid == '') {
                            $scope.data_general[0].id_tagid = null;
                            var arr_clone_def = { id: null, name: 'Please select' };
                            $scope.master_tagid.splice(0, 0, arr_clone_def);
                        }

                    }catch{}
                    
                    /*try {
                        $scope.master_company = JSON.parse(replace_hashKey_arr(arr.company));
                        $scope.master_apu = JSON.parse(replace_hashKey_arr(arr.apu));
                        $scope.master_toc = JSON.parse(replace_hashKey_arr(arr.toc));
                        $scope.master_unit_no = JSON.parse(replace_hashKey_arr(arr.unit_no));
                        $scope.master_tagid = JSON.parse(replace_hashKey_arr(arr.tagid));
                        $scope.master_tagid_audition = JSON.parse(replace_hashKey_arr(arr.tagid));
                        $scope.master_ram = JSON.parse(replace_hashKey_arr(arr.ram));

                        console.log($scope);

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

                    } catch (ex) { alert(ex); console.clear(); }*/
                    
                    var pha_status = $scope.data_header[0].pha_status
                    set_form_action(action_part_befor, !action_submit, page_load);
                    set_form_access(pha_status,$scope.params,$scope.flow_role_type)
                    set_tab_focus(pha_status,action_part_befor)

                    if($scope.pha_status === 11){
                        addDefaultMember();

                    }


                    $timeout(function() {
                        try {
                            if (typeof page_load !== 'undefined' && page_load === true) {
                                var element = document.querySelector('.js-choice-functional_audition');
                                    if (element.tagName.toLowerCase() === 'select') {
                                        console.log('Element is a <select> element');
                                    }

                                    var element = document.querySelector('.js-choice-functional_audition');
                                    if (element.tagName.toLowerCase() === 'select' && element.multiple) {
                                        console.log('Element is a <select> element with multiple selection');
                                    }
                                    

                                initializeChoices();
                            }else{
                                initializeChoices();
                            }
                        } catch (e) {}
            
                        function initializeChoices() {
            
                            initializeChoiceElement('.js-choice-functional_audition');
                            initializeChoiceElement('.js-choice-apu');
                            initializeChoiceElement('.js-choice-functional');
                        }
            
                        function initializeChoiceElement(selector) {
                            var element = document.querySelector(selector);
                            if (element && (element.tagName.toLowerCase() === 'select' || element.type === 'text')) {
                                if (!element.classList.contains('choices__input')) {
                                    new Choices(element);
                                } else {
                                    console.warn(`Choices.js already initialized on ${selector}`);
                                }
                            } else {
                                //console.error(`Element ${selector} not found or not a valid type`);
                            }
                        }

                    }, 0);

                    $scope.$apply(); 


                    try {
                        if (page_load == true || true) {
                            //const choices0 = new Choices('.js-choice-company');
                            //const choices1 = new Choices('.js-choice-apu');
                            //const choices2 = new Choices('.js-choice-toc');
                            //const choices3 = new Choices('.js-choice-unit_no');
                            const choices4 = new Choices('.js-choice-tagid');
                            const choices5 = new Choices('.js-choice-tagid_audition');
                        }
                    } catch { }

                }
                $scope.dataLoaded = true;
                $scope.leavePage = false;
                if($scope.data_header[0].pha_status === 11 || $scope.data_header[0].pha_status === 12){
                    $scope.startTimer();  
                }

                $('#divPage').removeClass('d-none');


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

    function addDefaultMember(){
       const data = {
        seq: 1249,
        id: $scope.data_header[0].id,
        employee_id: "",
        employee_name: $scope.data_header[0].request_user_name,
        employee_displayname: $scope.data_header[0].request_user_displayname,
        employee_email: "",
        employee_position: "",
        employee_position1: "",
        employee_img: "",
        employee_type: "Employee  ",
        selected_type: 0,
        }

        //$scope.MaxSeqDataMemberteam = 2;
        //$scope.selectdata_session = 138;
        $scope.selectDatFormType = 'member';
        $scope.setDefualt = true;
        $scope.choosDataEmployee(data)
        $scope.setDefualt = false;
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
        

        for (let _item of $scope.tabs) {
            _item.isShow = true;
            _item.isActive = false;
        }

        $scope.action_part = action_part_befor;

        //option1 = form, option2 = exccel
        //alert($scope.data_general[0].input_type_excel);
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
    function set_form_access(pha_status,params,flow_role_type){
        if(pha_status === 11 || pha_status === 12){
            $scope.can_edit = true;

        }
        if(params != 'edit_approver'){
            $scope.action_owner_active = true;
        }  

        if(params !== null){

            if(params != 'edit_approver'){
                $scope.action_owner_active = true;
            }  
            

            if(params !== 'edit') {
                $scope.tab_general_active = false;
                $scope.tab_node_active = false;
                $scope.tab_worksheet_active = false;
                $scope.tab_managerecom_active = false;
                $scope.tab_approver_active = false;

                if(params === 'edit_action_owner'){
                    $scope.action_owner_active = true;

                } 

                if(params === 'edit_approver'){
                    $scope.action_owner_active = false;

                }  

                $scope.can_edit = false;


            }

            if(params === 'edit' && flow_role_type === 'admin') {
                $scope.tab_general_active = true;
                $scope.tab_node_active = true;
                $scope.tab_worksheet_active = true;
                $scope.tab_managerecom_active = true;
                $scope.tab_approver_active = true;

                $scope.save_type = true;
                $scope.can_edit = true;

            }
        }else if (params === null && pha_status === 21) {
            if (Array.isArray($scope.data_approver)) {
                let mainApprover = $scope.data_approver.find(item => item.approver_type === 'approver' && item.user_name === $scope.user_name);
        
                if (mainApprover) {
                    $scope.can_edit = true;
                } else {
                    $scope.can_edit = false;
                }
            } else {
                $scope.can_edit = false; 
            }

            if($scope.data_approver){
                $scope.data_approver.filter(item => {
                    if(item.user_name === $scope.user_name){
                        $scope.tab_approver_active = true;

                    }
                })
            }
        }
    }
    function set_tab_focus(pha_status, action_part_befor) {
        
        let arr_tab;

        if (pha_status === 11) {
            arr_tab = $filter('filter')($scope.tabs, item => item.action_part === action_part_befor);
            $scope.changeTab_Focus(arr_tab, arr_tab.name);
        } 
        else if ([12, 22].includes(pha_status)) {
            arr_tab = $filter('filter')($scope.tabs, item => item.action_part === 3);
            $scope.action_part = 3;
            $scope.changeTab_Focus(arr_tab, arr_tab.name);
        } 
        else if ([11, 81, 91].includes(pha_status) && !$scope.params) {
            arr_tab = $filter('filter')($scope.tabs, item => item.action_part === 1);
            $scope.action_part = 1;
            $scope.changeTab_Focus(arr_tab, arr_tab.name);
        } 
        else if (pha_status === 21 && !$scope.params) {
            arr_tab = $filter('filter')($scope.tabs, item => item.action_part === 4);
            $scope.action_part = 4;
            $scope.changeTab_Focus(arr_tab, arr_tab.name);
        } 
        else if ($scope.params === 'edit_approver') {
            arr_tab = $filter('filter')($scope.tabs, item => item.action_part === 4);
            $scope.action_part = 4;
            $scope.changeTab_Focus(arr_tab, arr_tab.name);
        }
        else if ($scope.params === 'edit') {
            arr_tab = $filter('filter')($scope.tabs, item => item.action_part === 3);
            $scope.action_part = 3;
            $scope.changeTab_Focus(arr_tab, arr_tab.name);
        }
    
    }
    function set_access_formaction(arr) {
        // params === admin action
    
        // pha_status
        /*
        11 D => allow active all
        12 Con => active all
        21 approver => active approver tab  && isMain can edit worksheet
        13 follow up => !active all
        14 follow up => !active all
        */
    
        if ($scope.params !== 'edit_approver') {
            $scope.action_owner_active = true;
        }
    
        if ($scope.params !== null) {

    
            if ($scope.params !== 'edit') {
                $scope.tab_general_active = false;
                $scope.tab_node_active = false;
                $scope.tab_worksheet_active = false;
                $scope.tab_managerecom_active = false;
                $scope.tab_approver_active = false;
    
            }
    
            if ($scope.params === 'edit' && $scope.flow_role_type === 'admin') {
                $scope.tab_general_active = true;
                $scope.tab_node_active = true;
                $scope.tab_worksheet_active = true;
                $scope.tab_managerecom_active = true;
                $scope.tab_approver_active = true;
                $scope.save_type = true;
            }


            if ($scope.params === 'edit_approver') {
                $scope.action_owner_active = false;
                $scope.save_type = false;
            }else if ($scope.params !== 'edit_approver') {
                $scope.action_owner_active = true;
            }



        } else if ($scope.params === null && arr.header[0].pha_status === 21) {
            if (Array.isArray($scope.data_approver)) {
                let mainApprover = $scope.data_approver.find(item => item.approver_type === 'approver' && item.user_name === $scope.user_name);
    
                $scope.isMainApprover = !!mainApprover;
    
                $scope.tab_general_active = false;
                $scope.tab_worksheet_active = false;
                $scope.tab_managerecom_active = false;
                $scope.tab_approver_active = true;
            } else {
                console.log('$scope.data_approver is not an array or is undefined.');
                $scope.isMainApprover = false;
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
            if (!($scope.data_session[icount].action_to_review_type >= 1)) {
                $scope.action_to_review_type = true;
            }
        }
    }
    function set_data_general() {

        if (($scope.data_general[0].id_ram + '') == '') {
            $scope.data_general[0].id_ram = 1;
        }

        if ($scope.data_general[0].target_start_date !== null) {
            const x = ($scope.data_general[0].target_start_date.split('T')[0]).split("-");
            $scope.data_general[0].target_start_date = new Date(x[0], x[1] - 1, x[2]);
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


        try {

            var tagid_audition = $scope.data_general[0].tagid_audition;
            if (!(tagid_audition == '' || tagid_audition == null)) {

                var xSplitFunc = (tagid_audition).replaceAll('"', '').replace('[', '').replace(']', '').split(",");
                var _functoArr = [];
                for (var i = 0; i < xSplitFunc.length; i++) {
                    _functoArr.push(xSplitFunc[i]);
                }
                $scope.data_general[0].tagid_audition = _functoArr;
            } else {
                $scope.data_general[0].tagid_audition = [];
            }
        } catch { }

        return;
    }
    function set_data_listworksheet() {

    }
    function set_data_related_people() {

        if (true) {
            try {
                //if ($scope.data_relatedpeople[0].reviewer_date !== null) {
                //    const x = ($scope.data_relatedpeople[0].reviewer_date.split('T')[0]).split("-");
                //    if (x[0] > 2000) {
                //        $scope.data_relatedpeople[0].reviewer_date = new Date(x[0], x[1], x[2]);
                //    }
                //}
                $scope.data_relatedpeople.forEach(function (item) {
                    // Example
                    if (item.reviewer_date !== null) {
                        // Split the date string by 'T'
                        const x = (item.reviewer_date.split('T')[0]).split("-");
                        // Check if the year is greater than 2000
                        if (x[0] > 2000) {
                            // Convert the date string to a Date object
                            item.reviewer_date = new Date(x[0], x[1] - 1, x[2]);
                        }
                    }
                });

            } catch { }
            try {
                $scope.data_relatedpeople_outsider.forEach(function (item) {
                    // Example
                    if (item.reviewer_date !== null) {
                        // Split the date string by 'T'
                        const x = (item.reviewer_date.split('T')[0]).split("-");
                        // Check if the year is greater than 2000
                        if (x[0] > 2000) {
                            // Convert the date string to a Date object
                            item.reviewer_date = new Date(x[0], x[1] - 1, x[2]);
                        }
                    }
                });
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
            var arr_worksheet = $scope.data_listworksheet;
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
    function set_data_approver() {
        if (true) {
            var arr_approver = $scope.data_approver;
            if (arr_approver.length > 0) {

                for (var w = 0; w < arr_approver.length; w++) {

                    //recommendations_no
                    /*arr_approver[w].recommendations_no = (arr_approver[w].recommendations_no == null ? arr_approver[w].consequences_no : arr_approver[w].recommendations_no);
                    var arr_node = $filter('filter')($scope.data_node, function (item) {
                        return (item.id == arr_worksheet[w].id_node);
                    });
                    if (arr_node.length > 0) {
                        arr_worksheet[w].node_no = arr_node[0].no;
                        arr_worksheet[w].node = arr_node[0].node;
                    }*/
                    //Estimated Date  
                    try {
                        if (arr_approver[w].date_review !== null) {
                            const x = (arr_approver[w].date_review.split('T')[0]).split("-");
                            if (x[0] > 2000) {
                                arr_approver[w].date_review = new Date(x[0], x[1] - 1, x[2]);
                            }
                        }
                    } catch { }
                    try {
                        if (arr_approver[w].date_review_show !== null) {
                            const x = (arr_approver[w].date_review_show.split('T')[0]).split("-");
                            if (x[0] > 2000) {
                                arr_approver[w].date_review_show = new Date(x[0], x[1] - 1, x[2]);
                            }
                        }
                    } catch { }

                }
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

            console.log(i)
            if (first_row == true && newInput !== null) {
                iNoNew++;
                newInput.no = (iNoNew);
                first_row = false;//1
            } else {
                arr_items[i].no = iNoNew;
            }
            iNoNew++;
        };

        
        if (newInput !== null && newInput.action_type == 'insert') {
            //if (iRow > 0) { newInput.no = Number(newInput.no) + 0.1; } 
            arr_items.push(newInput);
        }
        
        // Set 1st alway 1
        if (arr_items.length > 0) {arr_items[0].no = 1;}

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
        arr_items.sort((a, b) => a.no - b.no);

    }


    $scope.triggerRemove = function(data,seq, index, type) {
        if (seq !== null && index !== null) {
            $scope.seqToRemove = seq;
            $scope.indexToRemove = index;
            $scope.typeToRemove = type;
        
            const shouldShowModalForSession = () => {
                let shouldShowModal = false;
                const dataLists = [$scope.data_memberteam, $scope.data_approver, $scope.data_relatedpeople];
                
                for (const list of dataLists) {
                    for (const item of list) {
                        if (item.id_session === seq && item.user_displayname !== null) {
                            shouldShowModal = true;
                            break;
                        }
                    }
                    if (shouldShowModal) break;
                }
        
                return shouldShowModal || data.meeting_date !== null;
            };
        
            const actionMap = {
                'session': () => {
                    if (shouldShowModalForSession()) {
                        $('#removeModal').modal({
                            backdrop: 'static',
                            keyboard: false 
                        }).modal('show');
                    } else {
                        $scope.removeDataSession($scope.seqToRemove, $scope.indexToRemove);
                    }
                },
                'DrawingDoc': () => {
                    if (data.document_file_name !== null || data.document_file_path !== null || data.descriptions !== null || data.document_name !== null) {
                        $('#removeModal').modal({
                            backdrop: 'static',
                            keyboard: false 
                        }).modal('show');
                    } else {
                        $scope.removeDrawingDoc($scope.seqToRemove, $scope.indexToRemove);
                    }
                },
                'template': () => {
                    $('#removeModal').modal({
                        backdrop: 'static',
                        keyboard: false 
                    }).modal('show');
                },
                'uploadfile': () => {
                    $('#removeModal').modal({
                        backdrop: 'static',
                        keyboard: false 
                    }).modal('show');
                },
                'default': () => {
                    $('#removeModal').modal({
                        backdrop: 'static',
                        keyboard: false 
                    }).modal('show');
                }
            };
        
            (actionMap[$scope.typeToRemove] || actionMap['default'])();
        
        } else {
            console.error('is null');
        }
        
    };

    $scope.action_remove = function(action) {
        if (action === 'yes') {
            const actionMap = {
                'session': () => $scope.removeDataSession($scope.seqToRemove, $scope.indexToRemove),
                'DrawingDoc': () => $scope.removeDrawingDoc($scope.seqToRemove, $scope.indexToRemove),
                'template': () => {
                    $scope.clearFileUploadName();
                    $scope.clearFileUploadData();
                },
                'uploadfile': () => $scope.clearFileName($scope.seqToRemove),
                'default': () => console.error('Unknown type:', $scope.typeToRemove)
            };
    
            (actionMap[$scope.typeToRemove] || actionMap['default'])();
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

        /*var arr_copy = [];
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
        }*/
        function processData(sourceArray, seq, id_session) {
            let arr_copy = [];
            angular.copy(sourceArray, arr_copy);
            let arrmember = $filter('filter')(arr_copy, function(item) {
                return (item.id_session == seq);
            });
        
            for (let i = 0; i < arrmember.length; i++) {
                arrmember[i].id_session = Number(id_session);
                arrmember[i].action_type = 'insert';
                arrmember[i].action_change = 1;
        
                arrmember[i].seq = $scope.selectdata_memberteam;
                arrmember[i].id = $scope.selectdata_memberteam;
        
                sourceArray.push(arrmember[i]);
                $scope.selectdata_memberteam += 1;
            }
        }
        
        processData($scope.data_memberteam, seq, id_session);
        processData($scope.data_approver, seq, id_session);
        processData($scope.data_relatedpeople, seq, id_session);
        processData($scope.data_relatedpeople_outsider, seq, id_session);

        console.log("$scope.data_approver",$scope.data_approver)

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
    $scope.AddDataEmpSession = function () {

        var seq = $scope.selectdata_action_seq;
        var action_type = $scope.selectdata_action_type;
        var user_type_of = $scope.selectdata_user_type_of;

        if (action_type == 'memberteam') {
            add_user_to_data_member();
        } else if (action_type == 'attendees' || action_type == 'specialist' || action_type == 'reviewer') {
            add_user_to_data_related_people(seq, action_type, user_type_of);
        }


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
        mergeData('memberteam', $scope.data_memberteam)

        apply();

    }

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
        if (index == 0) {
            var keysToClear = ['document_name', 'document_no', 'descriptions'];


            keysToClear.forEach(function (key) {
                $scope.data_drawing[0][key] = null;
            });

            $scope.data_drawing[0].no = 1;
        }

        running_no_format_1($scope.data_drawing, null, index, null); //index??

        apply();

    };

    // <==== (Kul) WorkSheet zone function  ====>  
    $scope.DataCategory = [{ id: "P", name: "P", description: "People" },
    { id: "A", name: "A", description: "Assets" },
    { id: "E", name: "E", description: "Environment" },
    { id: "R", name: "R", description: "Reputation" },
    { id: "Q", name: "Q", description: "Product Quality" },];


    // <==== (Kul)RAM zone function  ====>     
    $scope.openModalNewRAM = function (seq) {

        $('#modalNewRAM').modal('show');
    };

    $scope.ram_name = [];

    $scope.actionChange_ram_name = function (item) {

        $scope.ram_name = item;
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
    $scope.adddata_listworksheet_lv1 = function (row_type, item, index) {
        if (row_type.indexOf('workstep') > -1) { row_type = 'workstep'; }
        else if (row_type.indexOf('taskdesc') > -1) { row_type = 'taskdesc'; }
        else if (row_type.indexOf('potentailhazard') > -1) { row_type = 'potentailhazard'; }
        else if (row_type.indexOf('possiblecase') > -1) { row_type = 'possiblecase'; }
        else if (row_type.indexOf('category') > -1) { row_type = 'category'; }

        var seq = item.seq;
        var seq_workstep = item.seq_workstep;
        var seq_taskdesc = item.seq_taskdesc;
        var seq_potentailhazard = item.seq_potentailhazard;
        var seq_possiblecase = item.seq_possiblecase;
        var seq_category = item.seq_category;

        var index_rows = Number(item.index_rows);
        var no = Number(item.no);
        var workstep_no = Number(item.workstep_no);
        var taskdesc_no = Number(item.taskdesc_no);
        var potentailhazard_no = Number(item.potentailhazard_no);
        var possiblecase_no = Number(item.possiblecase_no);
        var category_no = Number(item.category_no);


        var arr_def = [];
        angular.copy($scope.data_listworksheet, arr_def);

        //row now
        var iNo = no;
        if (row_type == "workstep") {
            var arr = $filter('filter')(arr_def, function (_item) {
                return (_item.no >= no && _item.seq_workstep == seq_workstep);
            });
            if (arr.length > 0) {
                arr.sort((a, b) => a.no - b.no);
                iNo = arr[arr.length - 1].no;
                index_rows = arr[arr.length - 1].index_rows;
            }

        } else if (row_type == "taskdesc") {
            var arr = $filter('filter')(arr_def, function (_item) {
                return (_item.no >= no && _item.seq_workstep == seq_workstep && _item.seq_taskdesc == seq_taskdesc);
            });
            if (arr.length > 0) {
                iNo = arr[arr.length - 1].no;
                index_rows = arr[arr.length - 1].index_rows;
            }
        } else if (row_type == "potentailhazard") {
            var arr = $filter('filter')(arr_def, function (_item) {
                return (_item.no >= no && _item.seq_workstep == seq_workstep && _item.seq_taskdesc == seq_taskdesc && _item.seq_potentailhazard == seq_potentailhazard);
            });
            if (arr.length > 0) {
                iNo = arr[arr.length - 1].no;
                index_rows = arr[arr.length - 1].index_rows;
            }
        } else if (row_type == "possiblecase") {
            var arr = $filter('filter')(arr_def, function (_item) {
                return (_item.no >= no && _item.seq_workstep == seq_workstep && _item.seq_possiblecase == seq_possiblecase && _item.seq_potentailhazard == seq_potentailhazard
                    && _item.seq_possiblecase == seq_possiblecase);
            });
            if (arr.length > 0) {
                iNo = arr[arr.length - 1].no;
                index_rows = arr[arr.length - 1].index_rows;
            }
        } else if (row_type == "category") {
            var arr = $filter('filter')(arr_def, function (_item) {
                return (_item.no >= no && _item.seq_workstep == seq_workstep && _item.seq_possiblecase == seq_possiblecase && _item.seq_potentailhazard == seq_potentailhazard
                    && _item.seq_possiblecase == seq_possiblecase && _item.seq_category == seq_category);
            });
            if (arr.length > 0) {
                iNo = arr[arr.length - 1].no;
                index_rows = arr[arr.length - 1].index_rows;
            }
        }


        $scope.MaxSeqdata_listworksheet = Number($scope.MaxSeqdata_listworksheet) + 1;
        var xseq = $scope.MaxSeqdata_listworksheet;

        if (row_type == "workstep") {
            $scope.MaxSeqdata_listworksheetworkstep = Number($scope.MaxSeqdata_listworksheetworkstep) + 1;
            seq_workstep = $scope.MaxSeqdata_listworksheetworkstep;

            seq_workstep = xseq;

            //กรณีที่เป็น workstep ให้ +1 
            workstep_no += 1;
            taskdesc_no = 1;
            potentailhazard_no = 1;
            possiblecase_no = 1;
            category_no = 1;
        }
        if (row_type == "taskdesc") {
            $scope.MaxSeqdata_listworksheettaskdesc = Number($scope.MaxSeqdata_listworksheettaskdesc) + 1;
            seq_taskdesc = $scope.MaxSeqdata_listworksheettaskdesc;

            seq_taskdesc = xseq;


            //กรณีที่เป็น taskdesc ให้ +1
            taskdesc_no += 1;
            potentailhazard_no = 1;
            possiblecase_no = 1;
            category_no = 1;
        }
        if (row_type == "potentailhazard") {            
            $scope.MaxSeqdata_listworksheetpotentailhazard = Number($scope.MaxSeqdata_listworksheetpotentailhazard) + 1;
            seq_potentailhazard = $scope.MaxSeqdata_listworksheetpotentailhazard;

            seq_potentailhazard = xseq;


            //กรณีที่เป็น taskdesc ให้ +1
            potentailhazard_no -= 1;
            possiblecase_no = 1;
            category_no = 1;
        }
        if (row_type == "possiblecase") {
            $scope.MaxSeqdata_listworksheetpossiblecase = Number($scope.MaxSeqdata_listworksheetpossiblecase) + 1;
            seq_possiblecase = $scope.MaxSeqdata_listworksheetpossiblecase;

            seq_possiblecase = xseq;


            //กรณีที่เป็น taskdesc ให้ +
            possiblecase_no += 1;
            category_no = 1;
        }
        if (row_type == "category") {
            $scope.MaxSeqdata_listworksheetcategory = Number($scope.MaxSeqdata_listworksheetcategory) + 1;
            seq_category = $scope.MaxSeqdata_listworksheetcategory;

            seq_category = xseq;

            //กรณีที่เป็น cat ให้ +1
            category_no += 1;
        }
        var newInput = clone_arr_newrow($scope.data_listworksheet_def)[0];
        newInput.seq = xseq;
        newInput.id = xseq;
        newInput.row_type = row_type;//workstep,taskdesc,potentailhazard,possiblecase,category

        newInput.seq_workstep = seq_workstep;
        newInput.seq_taskdesc = seq_taskdesc;
        newInput.seq_potentailhazard = seq_potentailhazard;
        newInput.seq_possiblecase = seq_possiblecase;
        newInput.seq_category = seq_category;

        newInput.index_rows = (index_rows + 0.5);
        newInput.no = (no + 0.5);

        newInput.workstep_no = workstep_no;
        newInput.taskdesc_no = taskdesc_no;
        newInput.potentailhazard_no = potentailhazard_no;
        newInput.possiblecase_no = possiblecase_no;
        newInput.category_no = category_no;

        newInput.action_type = 'insert';
        newInput.action_change = 1;
        newInput.action_status = 'Open';

        //workstep,taskdesc,potentailhazard,possiblecase,category 
        //copy detail row befor
        if (row_type == "workstep") {
        }
        if (row_type == "taskdesc") {
            newInput.workstep = item.workstep;
        }
        else if (row_type == "potentailhazard") {
            newInput.workstep = item.workstep;
            newInput.taskdesc = item.taskdesc;
        }
        else if (row_type == "possiblecase") {
            newInput.workstep = item.workstep;
            newInput.taskdesc = item.taskdesc;
            newInput.potentailhazard = item.potentailhazard;
        }
        else if (row_type == 'category') {
            newInput.workstep = item.workstep;
            newInput.taskdesc = item.taskdesc;
            newInput.potentailhazard = item.potentailhazard;
            newInput.possiblecase = item.possiblecase;
        }
        $scope.selectdata_listworksheet = xseq;

        running_index_worksheet(seq);
        index = index_rows;

        console.clear();

        running_index_level1_lv1($scope.data_listworksheet, iNo, index, newInput);

        if (!(row_type == "cat")) {
            running_no_workstep();
            running_no_taskdesc(seq_workstep);
            running_no_potentailhazard(seq_workstep, seq_taskdesc);
            running_no_possiblecase(seq_workstep, seq_taskdesc, seq_potentailhazard);
        }

        // for (let i = 0; i < $scope.data_listworksheet.length; i++) {
        //     if ($scope.data_listworksheet[i]) {
                
        //     }
        //     console.log('all => ',$scope.data_listworksheet[i])
        // }

        apply();

        console.log('all => ',$scope.data_listworksheet)
    }
    
    function running_index_worksheet(def_seq) {
        $scope.data_listworksheet.sort((a, b) => a.index_rows - b.index_rows);

        var _index = 0;
        for (var i = 0; i < $scope.data_listworksheet.length; i++) {
            $scope.data_listworksheet[i].index_rows = i;

            if (def_seq != '') {
                if ($scope.data_listworksheet[i].seq == def_seq) {
                    _index = i;//กรณีที่เป็น node > 1
                }
            }
        }

        return _index;
    }



    $scope.removeDataworksheet = function (row_type, item, index) {

        var seq = item.seq;
        var seq_workstep = item.seq_workstep;
        var seq_taskdesc = item.seq_taskdesc;
        var seq_potentailhazard = item.seq_potentailhazard;
        var seq_possiblecase = item.seq_possiblecase;
        var seq_category = item.seq_category;

        //กรณีที่เป็นรายการเดียวไม่ต้องลบ ให้ cleare field 
        var arrCheck = [];
        if (true) {
            if (row_type == "workstep") {
                var arrCheck = $filter('filter')($scope.data_listworksheet, function (_item) {
                    return (true);
                });
            } else if (row_type == "taskdesc") {
                var arrCheck = $filter('filter')($scope.data_listworksheet, function (_item) {
                    return (_item.seq_workstep == seq_workstep);
                });
            } else if (row_type == "potentailhazard") {
                var arrCheck = $filter('filter')($scope.data_listworksheet, function (_item) {
                    return (_item.seq_workstep == seq_workstep & _item.seq_taskdesc == seq_taskdesc);
                });
            } else if (row_type == "possiblecase") {
                var arrCheck = $filter('filter')($scope.data_listworksheet, function (_item) {
                    return (_item.seq_workstep == seq_workstep & _item.seq_taskdesc == seq_taskdesc & _item.seq_potentailhazard == seq_potentailhazard);
                });
            } else if (row_type == "category") {
                var arrCheck = $filter('filter')($scope.data_listworksheet, function (_item) {
                    return (_item.seq_workstep == seq_workstep
                        & _item.seq_taskdesc == seq_taskdesc
                        & _item.seq_potentailhazard == seq_potentailhazard
                        & _item.seq_possiblecase == seq_possiblecase);
                });
            }
        }

        if (arrCheck.length == 1) {
            //กรณีที่เหลือ row เดียวให้ add rows ใหม่ ??? จะไม่มีกรณีนี้แล้ว เนื่องจาก row แรกจะไม่ให้แสดงปุ่มลบ
            add_row_workstep(arrCheck);
            return;
        }

        //Delete row select and upper row
        if (true) {
            if (row_type == "workstep") {

                //เก็บค่า Delete 
                var arrdelete = $filter('filter')($scope.data_listworksheet, function (item) {
                    return ((item.seq == seq
                        || item.seq_workstep == seq_workstep) && item.action_type == 'update');
                });
                if (arrdelete.length > 0) { $scope.data_listworksheet_delete.push(arrdelete[0]); }

                //เก็บค่า กรองข้อมูลที่เหลือ 
                $scope.data_listworksheet = $filter('filter')($scope.data_listworksheet, function (item) {
                    return !((item.seq == seq
                        || item.seq_workstep == seq_workstep));
                });

            } else if (row_type == "taskdesc") {

                //เก็บค่า Delete 
                var arrdelete = $filter('filter')($scope.data_listworksheet, function (item) {
                    return ((item.seq == seq
                        || (item.seq_taskdesc == seq_taskdesc && item.seq_workstep == seq_workstep))
                        && item.action_type == 'update');
                });
                if (arrdelete.length > 0) { $scope.data_listworksheet_delete.push(arrdelete[0]); }

                //เก็บค่า กรองข้อมูลที่เหลือ 
                $scope.data_listworksheet = $filter('filter')($scope.data_listworksheet, function (item) {
                    return !((item.seq == seq
                        || (item.seq_taskdesc == seq_taskdesc && item.seq_workstep == seq_workstep))
                    );
                });

                // after reset no
                const workstep_no = item.workstep_no;
                const taskdesc_no = item.taskdesc_no;
                $scope.data_listworksheet.forEach(function(item) {
                    if ( item.workstep_no == workstep_no) {
                        if (item.taskdesc_no > taskdesc_no ) {
                            item.taskdesc_no = item.taskdesc_no - 1;
                        }
                    }
                });

            } else if (row_type == "potentailhazard") {

                //เก็บค่า Delete 
                var arrdelete = $filter('filter')($scope.data_listworksheet, function (item) {
                    return ((item.seq == seq
                        || (item.seq_potentailhazard == seq_potentailhazard && item.seq_taskdesc == seq_taskdesc && item.seq_workstep == seq_workstep))
                        && item.action_type == 'update');
                });
                if (arrdelete.length > 0) { $scope.data_listworksheet_delete.push(arrdelete[0]); }

                //เก็บค่า กรองข้อมูลที่เหลือ 
                $scope.data_listworksheet = $filter('filter')($scope.data_listworksheet, function (item) {
                    return !((item.seq == seq
                        || (item.seq_potentailhazard == seq_potentailhazard && item.seq_taskdesc == seq_taskdesc && item.seq_workstep == seq_workstep))
                    );
                });

                // after reset no
                const workstep_no = item.workstep_no;
                const taskdesc_no = item.taskdesc_no;
                const potentailhazard_no = item.potentailhazard_no;
                $scope.data_listworksheet.forEach(function(item) {
                    if ( item.workstep_no == workstep_no && item.taskdesc_no == taskdesc_no) {
                        if (item.potentailhazard_no > potentailhazard_no ) {
                            item.potentailhazard_no = item.potentailhazard_no - 1;
                        }
                    }
                });

            } else if (row_type == "possiblecase") {

                //เก็บค่า Delete 
                var arrdelete = $filter('filter')($scope.data_listworksheet, function (item) {
                    return ((item.seq == seq
                        || (item.seq_possiblecase == seq_possiblecase && item.seq_potentailhazard == seq_potentailhazard
                            && item.seq_taskdesc == seq_taskdesc && item.seq_workstep == seq_workstep))
                        && item.action_type == 'update');
                });
                if (arrdelete.length > 0) { $scope.data_listworksheet_delete.push(arrdelete[0]); }

                //เก็บค่า กรองข้อมูลที่เหลือ 
                $scope.data_listworksheet = $filter('filter')($scope.data_listworksheet, function (item) {
                    return !((item.seq == seq
                        || (item.seq_possiblecase == seq_possiblecase && item.seq_potentailhazard == seq_potentailhazard
                            && item.seq_taskdesc == seq_taskdesc && item.seq_workstep == seq_workstep))
                    );
                });

                // after reset no
                const workstep_no = item.workstep_no;
                const taskdesc_no = item.taskdesc_no;
                const potentailhazard_no = item.potentailhazard_no;
                const possiblecase_no = item.possiblecase_no;
                $scope.data_listworksheet.forEach(function(item) {
                    if ( item.workstep_no == workstep_no && item.taskdesc_no == taskdesc_no && item.potentailhazard_no == potentailhazard_no) {
                        if (item.possiblecase_no > possiblecase_no ) {
                            item.possiblecase_no = item.possiblecase_no - 1;
                        }
                    }
                });     
                
            } else if (row_type == "category") {
                //เก็บค่า Delete 
                var arrdelete = $filter('filter')($scope.data_listworksheet, function (item) {
                    return ((item.seq == seq
                        || (item.seq_category == seq_category && item.seq_possiblecase == seq_possiblecase && item.seq_potentailhazard == seq_potentailhazard && item.seq_taskdesc == seq_taskdesc && item.seq_workstep == seq_workstep))
                        && item.action_type == 'update');
                });
                if (arrdelete.length > 0) { $scope.data_listworksheet_delete.push(arrdelete[0]); }

                //เก็บค่า กรองข้อมูลที่เหลือ 
                $scope.data_listworksheet = $filter('filter')($scope.data_listworksheet, function (item) {
                    return !((item.seq == seq
                        || (item.seq_category == seq_category && item.seq_possiblecase == seq_possiblecase && item.seq_potentailhazard == seq_potentailhazard && item.seq_taskdesc == seq_taskdesc && item.seq_workstep == seq_workstep))
                    );
                });
                  
            }
        }
         
        running_no_format_2($scope.data_listworksheet, 1, 0, null);
        if (row_type == "workstep") {
            running_no_workstep();
        } else if (row_type == "taskdesc") {
            running_no_workstep();
            running_no_taskdesc(seq_workstep);
        }
    };
    function add_row_workstep(arrCheck) {
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
    }
    $scope.removedata_listworksheet = function (seq) {

        $scope.data_listworksheet = $filter('filter')($scope.data_listworksheet, function (item) {
            return !(item.seq == seq);
        });

        var arrdelete = $filter('filter')($scope.data_listworksheet, function (item) {
            return (item.seq == seq && item.action_type == 'update');
        });
        if (arrdelete.length > 0) { $scope.data_listworksheet_delete.push(arrdelete[0]); }

        $scope.data_listworksheet = $filter('filter')($scope.data_listworksheet, function (item) {
            return !(item.seq == seq);
        });
        if ($scope.data_listworksheet.length == 0) {
            $scope.adddata_listworksheet_lv1('category', item)
        }

        //workstep,taskdesc,potentailhazard,possiblecase,category
        running_no_format_2($scope.data_listworksheet, iNo, index, newInput);
        if (row_type == "workstep") {
            running_no_workstep();
        } else if (row_type == "taskdesc") {
            running_no_workstep();
            running_no_taskdesc(seq_workstep);
        }
    };
    function running_no_workstep() {
        var arr_items = $filter('filter')($scope.data_listworksheet, function (item) {
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

        arr_items = $filter('filter')($scope.data_listworksheet, function (item) {
            return (true);
        });

        var bfor = ''; var after = ''; iNoNew = 1;
        for (let i = 0; i < arr_items.length; i++) {
            arr_items[i].no = (iNoNew);
            iNoNew++;
        };
    }
    function running_no_taskdesc(seq_workstep) {
        var arr_items = $filter('filter')($scope.data_listworksheet, function (item) {
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
        var arr_items = $filter('filter')($scope.data_listworksheet, function (item) {
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
        var arr_items = $filter('filter')($scope.data_listworksheet, function (item) {
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
        var arr_items = $filter('filter')($scope.data_listworksheet, function (item) {
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
    $scope.openModalDataRAM_Worksheet = function (_item, ram_type, seq, ram_type_action) {
        $scope.selectdata_listworksheet = seq;
        $scope.selectedDataNodeWorksheetRamType = ram_type;
        $scope.selectedDataRamTypeAction = ram_type_action;

        console.log("$scope.selectdata_listworksheet",$scope.selectdata_listworksheet)
        console.log("$scope.selectedDataNodeWorksheetRamType",$scope.selectedDataNodeWorksheetRamType)
        console.log("$scope.selectedDataRamTypeAction",$scope.selectedDataRamTypeAction)

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
    
    $scope.selectDataRAM = function (ram_type, id_select) {

        var xseq = $scope.selectdata_listworksheet;
        var xbefor = $scope.selectedDataRamTypeAction;
        for (let i = 0; i < $scope.data_listworksheet.length; i++) {
            try {

                if ($scope.data_listworksheet[i].seq !== xseq) { continue; }

                if (xbefor == "befor" && ram_type == "s") { $scope.data_listworksheet[i].ram_befor_security = id_select; }
                if (xbefor == "befor" && ram_type == "l") { $scope.data_listworksheet[i].ram_befor_likelihood = id_select; }

                if (xbefor == "after" && ram_type == "s") { $scope.data_listworksheet[i].ram_after_security = id_select; }
                if (xbefor == "after" && ram_type == "l") { $scope.data_listworksheet[i].ram_after_likelihood = id_select; }

                if (xbefor == "action" && ram_type == "s") { $scope.data_listworksheet[i].ram_action_security = id_select; }
                if (xbefor == "action" && ram_type == "l") { $scope.data_listworksheet[i].ram_action_likelihood = id_select; }

                var ram_security = $scope.data_listworksheet[i].ram_befor_security + "";
                var ram_likelihood = $scope.data_listworksheet[i].ram_befor_likelihood + "";
                var ram_risk = "";
                if (xbefor == "after") {
                    ram_security = $scope.data_listworksheet[i].ram_after_security + "";
                    ram_likelihood = $scope.data_listworksheet[i].ram_after_likelihood + "";
                }
                if (xbefor == "action") {
                    ram_security = $scope.data_listworksheet[i].ram_action_security + "";
                    ram_likelihood = $scope.data_listworksheet[i].ram_action_likelihood + "";
                }
                if (ram_security == "" || ram_likelihood == "") {
                    if (xbefor == "befor") { $scope.data_listworksheet[i].ram_befor_risk = ""; }
                    else if (xbefor == "after") { $scope.data_listworksheet[i].ram_after_risk = ""; }
                    else if (xbefor == "action") { $scope.data_listworksheet[i].ram_action_risk = ""; }
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
                    $scope.data_listworksheet[i].safety_critical_equipment = safety_critical_equipment;
                }

                if (xbefor == "befor") { $scope.data_listworksheet[i].ram_befor_risk = ram_risk; }
                else if (xbefor == "after") { $scope.data_listworksheet[i].ram_after_risk = ram_risk; }
                else if (xbefor == "action") { $scope.data_listworksheet[i].ram_action_risk = ram_risk; }

                if ($scope.data_listworksheet[i].action_type == 'update') {
                    $scope.data_listworksheet[i].action_change = 1;
                }

                var ram_type_action = $scope.selectedDataRamTypeAction;
                if (ram_type_action == 'after') {
                    $scope.cal_ram_action_security = $scope.data_listworksheet[i].ram_after_security;
                    $scope.cal_ram_action_likelihood = $scope.data_listworksheet[i].ram_after_likelihood;
                    $scope.cal_ram_action_risk = $scope.data_listworksheet[i].ram_after_risk;
                } else if (ram_type_action == 'befor') {
                    $scope.cal_ram_action_security = $scope.data_listworksheet[i].ram_befor_security;
                    $scope.cal_ram_action_likelihood = $scope.data_listworksheet[i].ram_befor_likelihood;
                    $scope.cal_ram_action_risk = $scope.data_listworksheet[i].ram_befor_risk;
                } else if (ram_type_action == 'action') {
                    $scope.cal_ram_action_security = $scope.data_listworksheet[i].ram_action_security;
                    $scope.cal_ram_action_likelihood = $scope.data_listworksheet[i].ram_action_likelihood;
                    $scope.cal_ram_action_risk = $scope.data_listworksheet[i].ram_action_risk;
                }

                $scope.actionChangeWorksheet($scope.data_listworksheet[i], $scope.data_listworksheet[i].seq);

                break;

            } catch (e) { }
        }


        apply();

        $('#modalRAM').modal('show');
    }

    $scope.openModalDataEmployee = function (form_type, seq) {
        $scope.selectDatFormType = form_type;
        $scope.selectdata_listworksheet = seq;

        $scope.selectdata_action_seq = seq;
        $scope.selectdata_action_type = form_type;

        $('#modalEmployeeSelect').modal('show');
    }

    // <==== (Kul) WorkSheet zone function  ====> 

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
        
        if(!$scope.unsavedChanges){
            window.open("home/portal", "_top");
        }else{
            $('#unsavedChangesModal').modal({
                backdrop: 'static',
                keyboard: false 
            }).modal('show');
        }
        

        //window.open("home/portal", "_top");

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


    $scope.action_leavePage = function(action) {
        switch (action) {
            case 'leave':
                $scope.unsavedChanges = true;

                window.open("home/portal", "_top");
                break;
    
            case 'leaveWithsave': 
                $('#unsavedChangesModal').modal('hide');

                $scope.leavePage = true;
                $scope.confirmSave('save')
                break;
    
            case 'stay':
                $scope.dataLoaded = true;

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
                data: '{"sub_software":"jsea","user_name":"' + user_name + '","pha_seq":"' + token_doc + '"}',
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
                    if (arr_chk[0].id_toc == '' || arr_chk[0].id_toc == null) { set_alert('Warning', 'Please select a valid Thaioil Complex'); return; }
                    if ((arr_chk[0].id_unit_no == '' || arr_chk[0].id_unit_no == null) && (arr_chk[0].id_tagid == '' || arr_chk[0].id_tagid == null)) {
                        set_alert('Warning', 'Please select a valid Unit No or Tag ID');
                        return;
                    }
                    if (arr_chk[0].pha_request_name == '' || arr_chk[0].id_company == null) { set_alert('Warning', 'Please select a valid Company'); return; }

                }
                else if (pha_status == "12") {

                    if (false) {
                        if (arr_chk[0].id_company == '' || arr_chk[0].id_company == null) { set_alert('Warning', 'Please select a valid Company'); return; }
                        if (arr_chk[0].id_apu == '' || arr_chk[0].id_apu == null) { set_alert('Warning', 'Please select a valid Area Process Unit'); return; }
                        if (arr_chk[0].id_toc == '' || arr_chk[0].id_toc == null) { set_alert('Warning', 'Please select a valid Thaioil Complex'); return; }
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
                            if (arr_chk.length == 0) { set_alert('Warning', 'Please provide a valid ApproverTA2 List'); return; }
                            else {
                                var irows_last = arr_chk.length - 1;
                                if (arr_chk[irows_last].user_name == null) { set_alert('Warning', 'Please provide a valid ApproverTA2 List'); return; }
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

            // check risk 'H'
            $scope.check_ram_after_risk = false;
            for (let i = 0; i < $scope.data_listworksheet.length; i++) {
                if ($scope.data_listworksheet[i].ram_after_risk == 'H') {
                    $scope.check_ram_after_risk = true;
                }
            }


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
            if (pha_status == "11" && false) {
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

        // Check follow up edit
        if ($scope.params) {
            return $('#modalEditConfirm').modal('show');
        }

        if(action === 'save' && $scope.isMainApprover){
            return $('#modalEditConfirm').modal('show');
        }
        save_data_create(action, action_def);
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
    $scope.confirmSubmit = function (action) {
        $scope.Action_Msg_Confirm = false;
        if (action == 'no') {
            $('#modalMsg').modal('hide');
            return;
        }
        save_data_create("submit","submit");
    }
    $scope.showHistory = false;

    $scope.toggleContent = function () {
        $scope.showHistory = !$scope.showHistory;
    };
    function check_data_general() {

        //set note 
        $scope.data_general[0].mandatory_note = $scope.formattedText.replace(/(<br\s*\/?>)+/gi, "\\n\r\n");

        $scope.data_general[0].input_type_excel = ($scope.selectInputTypeForm == 'option1' ? 0 : 1);
        //alert($scope.data_general[0].input_type_excel);

        //แปลง date to yyyyMMdd
        //แปลง time to hh:mm
        var copy_data_general = angular.copy($scope.data_general);

        try {
            if (copy_data_general[0].target_start_date) {
                var target_start_date = new Date(copy_data_general[0].target_start_date);
                if (!isNaN(target_start_date.getTime())) {
                    var target_start_date_utc = new Date(Date.UTC(target_start_date.getFullYear(), target_start_date.getMonth(), target_start_date.getDate()));
                    copy_data_general[0].target_start_date = target_start_date_utc.toISOString().split('T')[0];
                }
            }
        } catch {} 

        try {
            if (copy_data_general[0].target_end_date) {
                var target_end_date = new Date(copy_data_general[0].target_end_date);
                if (!isNaN(target_end_date.getTime())) {
                    var target_end_date_utc = new Date(Date.UTC(target_end_date.getFullYear(), target_end_date.getMonth(), target_end_date.getDate()));
                    copy_data_general[0].target_end_date = target_end_date_utc.toISOString().split('T')[0];
                }
            }
        } catch {}    
        
        try {
            if (copy_data_general[0].actual_start_date) {
                var actual_start_date = new Date(copy_data_general[0].actual_start_date);
                if (!isNaN(actual_start_date.getTime())) {
                    var actual_start_date_utc = new Date(Date.UTC(actual_start_date.getFullYear(), actual_start_date.getMonth(), actual_start_date.getDate()));
                    copy_data_general[0].actual_start_date = actual_start_date_utc.toISOString().split('T')[0];
                }
            }
        } catch {} 
        
        try {
            if (copy_data_general[0].actual_end_date) {
                    var actual_end_date = new Date(copy_data_general[0].actual_end_date);
                if (!isNaN(actual_end_date.getTime())) {
                    var actual_end_date_utc = new Date(Date.UTC(actual_end_date.getFullYear(), actual_end_date.getMonth(), actual_end_date.getDate()));
                    copy_data_general[0].actual_end_date = actual_end_date_utc.toISOString().split('T')[0];
                }
            }
        } catch {} 
        
        return angular.toJson(copy_data_general);
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
        var data_session = angular.copy($scope.data_session)
        
        for (var i = 0; i < data_session.length; i++) {
            data_session[i].id = data_session[i].seq;
            data_session[i].id_pha = pha_seq;

            try {
                if(data_session[0].meeting_date ){
                    var meeting_date = new Date(data_session[0].meeting_date);
                    var meeting_date_utc = new Date(Date.UTC(meeting_date.getFullYear(), meeting_date.getMonth(), meeting_date.getDate()));
                    data_session[0].meeting_date = meeting_date_utc.toISOString().split('T')[0];
                }
            } catch {} 
            try {
                //12/31/1969 7:55:00 PM 
                var hh = data_session[i].meeting_start_time_hh; var mm = data_session[i].meeting_start_time_mm;
                var valtime = "1970-01-01T" + (hh).substring(hh.length - 2) + ":" + (mm).substring(mm.length - 2) + ":00.000Z";

                data_session[i].meeting_start_time = new Date(valtime);
            } catch { }
            try {
                //12/31/1969 7:55:00 PM
                var hh =data_session[i].meeting_end_time_hh; var mm =data_session[i].meeting_end_time_mm;
                var valtime = "1970-01-01T" + (hh).substring(hh.length - 2) + ":" + (mm).substring(mm.length - 2) + ":00.000Z";
                data_session[i].meeting_end_time = new Date(valtime);
            } catch { }
        }

        var arr_active = [];
        angular.copy(data_session, arr_active);
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

        var copy_data_approver = angular.copy(arr_json);
        
        for (var i = 0; i < copy_data_approver.length; i++) {
            try {
                if (copy_data_approver[i].target_start_date !== null) {
                    var target_start_date = new Date(copy_data_approver[i].target_start_date);
                    if (!isNaN(target_start_date.getTime())) {
                        var target_start_date_utc = new Date(Date.UTC(target_start_date.getFullYear(), target_start_date.getMonth(), target_start_date.getDate()));
                        copy_data_approver[i].target_start_date = target_start_date_utc.toISOString().split('T')[i];
                    }
                }
            } catch {} 
    
            try {
                if (copy_data_approver[i].target_end_date !== null) {
                    var target_end_date = new Date(copy_data_approver[i].target_end_date);
                    if (!isNaN(target_end_date.getTime())) {
                        var target_end_date_utc = new Date(Date.UTC(target_end_date.getFullYear(), target_end_date.getMonth(), target_end_date.getDate()));
                        copy_data_approver[i].target_end_date = target_end_date_utc.toISOString().split('T')[i];
                    }
                }
            } catch {}  

            try {
                if (copy_data_approver[i].date_review !== null) {
                    var date_review = new Date(copy_data_approver[i].date_review);
                    if (!isNaN(date_review.getTime())) {
                        var date_review_utc = new Date(Date.UTC(date_review.getFullYear(), date_review.getMonth(), date_review.getDate()));
                        copy_data_approver[i].date_review = date_review_utc.toISOString().split('T')[i];
                    }
                }
            } catch {} 
    
        }

        return angular.toJson(copy_data_approver);
    }
    function check_data_relatedpeople() {

        var pha_seq = $scope.data_header[0].seq;
        for (var i = 0; i < $scope.data_relatedpeople.length; i++) {
            $scope.data_relatedpeople[i].id = $scope.data_relatedpeople[i].seq;
            $scope.data_relatedpeople[i].id_pha = pha_seq;
            $scope.data_relatedpeople[i].no = (i + 1);
            try {
                $scope.data_relatedpeople[i].reviewer_date = $scope.data_relatedpeople[i].reviewer_date.toISOString().split('T')[0];
            } catch { $scope.data_relatedpeople[i].reviewer_date = null; }
        }

        var arr_active = [];
        angular.copy($scope.data_relatedpeople, arr_active);
        var arr_json = $filter('filter')(arr_active, function (item) {
            return ((item.action_type == 'update' && item.action_change == 1) || (item.action_type == 'insert' && item.action_change == 1));
        });

        if (true) {
            for (var i = 0; i < $scope.data_relatedpeople_delete.length; i++) {
                $scope.data_relatedpeople_delete[i].action_type = 'delete';
                arr_json.push($scope.data_relatedpeople_delete[i]);
            }
            for (var i = 0; i < arr_json.length; i++) {
                if (arr_json[i].user_name == null
                    && arr_json[i].action_type != 'delete'
                ) {
                    arr_json[i].action_type = 'delete';
                }
            }
        }

        return angular.toJson(arr_json);

    }
    function check_data_relatedpeople_outsider() {

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

    function check_data_listworksheet() {

        var pha_status = $scope.data_header[0].pha_status;
        var pha_seq = $scope.data_header[0].seq;


        /*for (var i = 0; i < $scope.data_listworksheet.length; i++) {
            $scope.data_listworksheet[i].id = Number($scope.data_listworksheet[i].seq);
            $scope.data_listworksheet[i].id_pha = pha_seq;

            //ram_action_security, ram_action_likelihood, ram_action_risk, estimated_start_date, estimated_end_date, document_file_path, document_file_name, action_status, responder_action_type, responder_user_name, responder_user_displayname
            try {
                var start_date = new Date($scope.data_nodeworksheet[i].estimated_start_date);
                if (!isNaN(start_date.getTime())) {
                    var start_date_utc = new Date(Date.UTC(start_date.getFullYear(), start_date.getMonth(), start_date.getDate()));
                    $scope.data_nodeworksheet[i].estimated_start_date = start_date_utc.toISOString().split('T')[0];
                }
            } catch (error) {}
            
            try {
                if($scope.data_nodeworksheet[i].estimated_end_date !== null){
                    var end_date = new Date($scope.data_nodeworksheet[i].estimated_end_date);
                    if (!isNaN(end_date.getTime())) { 
                        var end_date_utc = new Date(Date.UTC(end_date.getFullYear(), end_date.getMonth(), end_date.getDate()));
                        $scope.data_nodeworksheet[i].estimated_end_date = end_date_utc.toISOString().split('T')[0];
                    }                    
                }
            } catch (error) {}
        }*/

        var arr_active = [];
        angular.copy($scope.data_listworksheet, arr_active);
        var arr_json = $filter('filter')(arr_active, function (item) {
            return ((item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert');
        });
        for (var i = 0; i < $scope.data_listworksheet_delete.length; i++) {
            $scope.data_listworksheet_delete[i].action_type = 'delete';
            arr_json.push($scope.data_listworksheet_delete[i]);
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
    
    function set_alert_confirm(header, detail) {

        $scope.Action_Msg_Confirm = true;

        $scope.Action_Msg_Header = header;
        $scope.Action_Msg_Detail = detail;

        $timeout(function() {
            $('#modalMsg').modal('show');
        });   
    }



    //start Update Action Type null to Update 
    $scope.actionChange = function (_arr, _seq, type_text) {

        console.log("now we change data ")
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

        if(type_text = "action_date"){
            console.log("data aprrover" ,$scope.data_approver)
        }

        action_type_changed(_arr, _seq);
        updateDataSessionAccessInfo();


        if (type_text == "ChangeRAM") {
            set_master_ram_likelihood(_arr.id_ram);
        }

        apply();
    }
    $scope.actionChangeWorksheet = function (_arr, _seq, type_text) {
        
        if (_arr.recommendations == null || _arr.recommendations == '') {
            if (_arr.recommendations_no == null || _arr.recommendations_no == '') {
                //recommendations != '' ให้ running action no  
                var arr_copy_def = angular.copy($scope.data_listworksheet, arr_copy_def);
                arr_copy_def.sort((a, b) => Number(b.recommendations_no) - Number(a.recommendations_no));
                var recommendations_no = Number(Number(arr_copy_def[0].recommendations_no) + 1);
                _arr.recommendations_no = recommendations_no;
            }
        }
        action_type_changed(_arr, _seq);

        var arr_submit = $filter('filter')($scope.data_listworksheet, function (item) {
            return ((item.action_type !== '' || item.action_type !== null));
        });


        if (arr_submit.length > 0) { $scope.submit_type = true; } else { $scope.submit_type = false; }

        apply();

    }
    $scope.actionChangeRelatedPeople = function (_arr, _seq, type_text) {

        action_type_changed(_arr, _seq);

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
    function action_type_changed_non_apply(_arr, _seq) {
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

    // <==== Tracking word change ==== data_listworksheet >
    $scope.updateWorksheetChanges = function (item, seq) {

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
            addedWords.forEach(function (word) {
                changedWords.push({ type: 'added', text: word });
            });
        }

        if (removedWords.length > 0) {
            removedWords.forEach(function (word) {
                changedWords.push({ type: 'removed', text: word });
            });
        }

        item.workstepChanges = changedWords;
        $scope.originalWorkstep = item.workstep;
    };


    // <==== start Tracking word change==== >

    $(document).ready(function () {

    }); page_load();

    //relatedpeople start 

    $scope.actionChangeSafetyUnCheck = function (item, seq) {

        for (const value of $scope.data_approver) {
            value.approver_type = 'safety';
        }
        item.approver_type = 'approver';

        $scope.data_approver.sort(function(a, b) {
            if (a.approver_type === "approver") return -1;
            if (b.approver_type === "approver") return 1;
            return 0;
        });
        
        $timeout(function() {
            apply();
        }, 100);
    }


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
    //relatedpeople end


    $scope.openDataEmployeeAdd = function (item, form_type, index) {
        $scope.selectedData = item;
        $scope.selectdata_session = item.seq;
        $scope.selectDatFormType = form_type; // member, approver, owner
        $scope.employeelist_show = [];
        $scope.searchText = '';
        $scope.approve_index = index;


        updateClickedStates(form_type);
    
        // Get form data if needed
        $scope.formData = $scope.getFormData();

        // Open the modal
        $('#modalEmployeeAdd').modal({
            backdrop: 'static',
            keyboard: false
        }).modal('show');

        
    };

    function updateClickedStates(form_type) {
        let data = [];
    
        if (form_type === 'approver') {
            data = $scope.data_approver;
        } else if (form_type === 'member') {
            data = $scope.data_memberteam;
        }
    
        data.forEach(item => {
            if (item.user_name && item.id_session == $scope.selectedData.seq) {
                $scope.clickedStates[item.user_name] = true;
            }
        });
    }

    function add_relatedpeople_outsider(xformtype, seq_session) {

        var arr_items = $filter('filter')($scope.data_relatedpeople_outsider, function (item) {
            return (item.id_session == seq_session && item.user_type == xformtype);
        });

        if (arr_items.length == 0) {

            //add new relatedpeople
            var seq = $scope.MaxSeqdata_relatedpeople_outsider;

            var newInput = clone_arr_newrow($scope.data_relatedpeople_outsider_def)[0];
            newInput.seq = seq;
            newInput.id = seq;
            newInput.no = (0);
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

            var iNo = $scope.data_relatedpeople_outsider.length
            running_no_level1($scope.data_relatedpeople_outsider, iNo, null);

            $scope.MaxSeqdata_relatedpeople_outsider = Number($scope.MaxSeqdata_relatedpeople_outsider) + 1
        }

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
    $scope.itemsPerPage = 10;
    

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

    
    $scope.clickedStates = {};

    $scope.choosDataEmployee = function (item) {
        var id = item.id;
        var employee_name = item.employee_name;
        var employee_displayname = (item.employee_displayname !== null && item.employee_displayname !== '') ? item.employee_displayname : item.employee_name;
        var employee_email = item.employee_email;
        var employee_position = item.employee_position;
        var employee_img = item.employee_img;

        var seq_session = $scope.selectdata_session;
        var xformtype = $scope.selectDatFormType;

        if (xformtype == "member") {
            var arr_items = $filter('filter')($scope.data_memberteam, function (item) {
                return (item.id_session == seq_session && item.user_name == employee_name);
            });
        
            if (arr_items.length == 0) {

                //add new employee 
                var seq = $scope.MaxSeqDataMemberteam;
                //console.log('MaxSeqDataMemberteam ', $scope.MaxSeqDataMemberteam)
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

            console.log("$scope.data_memberteam$scope.data_memberteam$scope.data_memberteam$scope.data_memberteam",$scope.data_memberteam)

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
                var seq = $scope.MaxSeqdata_approver;

                var newInput = clone_arr_newrow($scope.data_approver_def)[0];
                newInput.seq = seq;
                newInput.id = seq;
                newInput.no = (0);
                newInput.id_session = Number(seq_session);
                newInput.action_type = 'insert';
                newInput.action_change = 1;

                newInput.approver_type = (arr_items_all.length == 0 ? 'approver' : 'safety');


                newInput.user_name = employee_name;
                newInput.user_displayname = employee_displayname;
                newInput.user_title = employee_position;
                newInput.user_img = employee_img;

                $scope.data_approver.push(newInput);
                running_no_level1($scope.data_approver, null, null);

                $scope.MaxSeqdata_approver = Number($scope.MaxSeqdata_approver) + 1

            }

            console.log("$scope.data_approver",$scope.data_approver)

        }
        else if (xformtype == 'edit_approver') {

            console.log("xformtype",xformtype)
            // ขั้นแรก เรียงข้อมูลตามฟิลด์ 'no'
            var sortedData = $filter('orderBy')($scope.data_approver, 'no');
            // จากนั้น กรองข้อมูลตามเงื่อนไขที่ต้องการ
            var result = $filter('filter')(sortedData, function (item, idx) {
                return idx == $scope.approve_index;
            })[0];

            console.log("result",result)
            if (result) {
                result.action_change = 1;
                result.user_displayname = item.employee_displayname;
                result.user_img = item.employee_img;
                result.user_name = item.employee_name;
            }
            $('#modalEmployeeAdd').modal('hide');
        }
        else if (xformtype == "reviewer") {

            var _xformtype = xformtype;
            var arr_items = $filter('filter')($scope.data_relatedpeople, function (item) {
                return (item.id_session == seq_session && item.user_type == _xformtype);
            });

            if (arr_items.length == 0) {

                //add new relatedpeople
                var seq = $scope.MaxSeqdata_relatedpeople;

                var newInput = clone_arr_newrow($scope.data_relatedpeople_def)[0];
                newInput.seq = seq;
                newInput.id = seq;
                newInput.no = (0);
                newInput.id_session = Number(seq_session);
                newInput.action_type = 'insert';
                newInput.action_change = 1;

                newInput.approver_type = 'approver';
                newInput.user_type = xformtype;
                newInput.user_name = employee_name;
                newInput.user_displayname = employee_displayname;
                newInput.user_title = employee_position;
                newInput.user_img = employee_img;

                $scope.data_relatedpeople.push(newInput);
                running_no_level1($scope.data_relatedpeople, null, null);

                $scope.MaxSeqdata_relatedpeople = Number($scope.MaxSeqdata_relatedpeople) + 1

            } else {
                arr_items[0].user_name = employee_name;
                arr_items[0].user_displayname = employee_displayname;
                arr_items[0].user_title = employee_position;
                arr_items[0].user_img = employee_img;
            }

        }
        else if (xformtype == "owner") {

            var seq_worksheet = seq_session;

            var arr_items = $filter('filter')($scope.data_listworksheet,
                function (item) { return (item.seq == seq_worksheet); })[0];

            arr_items.responder_user_id = id;
            arr_items.responder_user_name = employee_name;
            arr_items.responder_user_displayname = employee_displayname;
            arr_items.responder_user_email = employee_email;
            arr_items.user_title = employee_position;
            arr_items.responder_user_img = employee_img;

            if (arr_items.action_type == 'insert') {
                arr_items.action_type = 'edit';
            }
            arr_items.action_change = 1;

        }
        else if (xformtype == "attendees" || xformtype == "specialist") {

            var _xformtype = xformtype;
            var arr_items = $filter('filter')($scope.data_relatedpeople, function (item) {
                return (item.id_session == seq_session && item.user_name == employee_name
                    && item.user_type == _xformtype);
            });

            if (arr_items.length == 0) {

                //add new relatedpeople
                var seq = $scope.MaxSeqdata_relatedpeople;

                var newInput = clone_arr_newrow($scope.data_relatedpeople_def)[0];
                newInput.seq = seq;
                newInput.id = seq;
                newInput.no = (0);
                newInput.id_session = Number(seq_session);
                newInput.action_type = 'insert';
                newInput.action_change = 1;

                newInput.approver_type = 'member';
                newInput.user_type = xformtype;
                newInput.user_name = employee_name;
                newInput.user_displayname = employee_displayname;
                newInput.user_title = employee_position;
                newInput.user_img = employee_img;

                $scope.data_relatedpeople.push(newInput);
                running_no_level1($scope.data_relatedpeople, null, null);

                $scope.MaxSeqdata_relatedpeople = Number($scope.MaxSeqdata_relatedpeople) + 1
            }

        }

        if(xformtype == 'member' || xformtype == 'approver' || xformtype == 'specialist'){
            updateDataSessionAccessInfo('session');
        }


        $scope.formData = $scope.getFormData();
        $scope.clickedStates[item.employee_name] = true;


        if (xformtype == "owner" || xformtype == "approver_ta3" || xformtype == "edit_approver") {
            $('#modalEmployeeAdd').modal('hide');
            

            $scope.clearFormData();
        } else {
        }
        
        apply();

    };

    $scope.clearFormData = function() {
        $scope.formData = [];
        $scope.searchText='';
        $scope.clickedStates = {};
        $scope.searchIndicator = {
            text: ''
        }    
        $scope.showContractor = false;    
        //$scope.formData_outsider = [];
    };

    $scope.removeData = function(data, seq_session, selectDatFormType) {

        var seq = data.seq;

        $scope.clickedStates[data.user_name] = false;

        // Handle different cases based on selectDatFormType
        switch (selectDatFormType) {
            case 'member':
                var employeeMember = $scope.data_memberteam.find(function(employee) {
                    return employee.seq === seq && employee.id_session === seq_session;
                });
                $scope.removeDataEmployee(seq, seq_session);
                break;

            case 'specialist':
                var employeeSpecialist = $scope.data_relatedpeople.find(function(employee) {
                    return employee.seq === seq && employee.id_session === seq_session;
                });
                $scope.removeDataRelatedpeople(seq, seq_session);
                break;

            case 'approver':
                var employeeApprover = $scope.data_approver.find(function(employee) {
                    return employee.seq === seq && employee.id_session === seq_session;
                });
                $scope.removeDataApprover(seq, seq_session);
                break;

            default:
                break;
        }
        

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
        $scope.formData =  $scope.data_memberteam;
        apply();
    };

    /*$scope.getOutsourceFormData = function(){
        switch ($scope.selectDatFormType) {
            case 'member':
            case 'attendees':
                var member_outsider = $scope.data_relatedpeople_outsider.filter(item => (item.user_type === "attendees" || item.user_type === "member") && item.user_name !== null)
                return member_outsider;
            case 'specialist':
                var specialist_outsider = $scope.data_relatedpeople_outsider.filter(item => item.user_type === "specialist" && item.user_name !== null)
                return specialist_outsider;
            default:
                return [];
        }
    }; */     
     
    

    $scope.applyDataEmployeeAdd = function () {

        // alert(xformtype);
        if (xformtype == "info") {
            // กรณีที่เลือก approver ta2
            // approve_action_type, approve_status, approver_user_name, approver_user_displayname 
            $scope.data_header[0].approver_user_name = employee;
            $scope.data_header[0].approver_user_displayname = employee_display;


        } else {

            var arr_items = $filter('filter')($scope.data_listworksheet, function (item) { return (item.seq == xseq); })[0];

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
        $scope.formData =  $scope.data_approver;

        apply();
    };

    $scope.removeDataRelatedpeople = function (seq, seq_session) {

        var user_type = $scope.selectDatFormType;
        var seq_session = $scope.selectdata_session;
        var arrdelete = $filter('filter')($scope.data_relatedpeople, function (item) {
            return (item.user_type == user_type && item.seq == seq && item.action_type == 'update');
        });
        if (arrdelete.length > 0) { $scope.data_relatedpeople_delete.push(arrdelete[0]); }

        $scope.data_relatedpeople = $filter('filter')($scope.data_relatedpeople, function (item) {
            return !(item.user_type == user_type && item.seq == seq && item.id_session == seq_session);
        });

        //if delete row 1 clear to null
        //???

        running_no_level1($scope.data_relatedpeople, null, null);
        $scope.formData = $scope.data_relatedpeople;
        apply();
    };

    $scope.removeDataRelatedpeopleOutsider = function (seq) {

        var user_type = $scope.selectDatFormType;
        var seq_session = $scope.selectdata_session;
        var arrdelete = $filter('filter')($scope.data_relatedpeople_outsider, function (item) {
            return (item.user_type == user_type && item.seq == seq && item.action_type == 'update');
        });
        if (arrdelete.length > 0) { $scope.data_relatedpeople_outsider_delete.push(arrdelete[0]); }

        $scope.data_relatedpeople_outsider = $filter('filter')($scope.data_relatedpeople_outsider, function (item) {
            return !(item.user_type == user_type && item.seq == seq && item.id_session == seq_session);
        });

        //if delete row 1 clear to null
        //???

        running_no_level1($scope.data_relatedpeople_outsider, null, null);
        apply();
    };
    
    $scope.getFormData = function() {
        switch ($scope.selectDatFormType) {
            case 'member':
                $scope.data_memberteam.sort(function(a, b) {
                    if (a.user_name === $scope.user_name) return -1;
                    if (b.user_name === $scope.user_name) return 1;
                    return 0;
                });                
                return $scope.data_memberteam;
            case 'approver':
                $scope.data_approver.sort(function(a, b) {
                    if (a.approver_type === "approver") return -1;
                    if (b.approver_type === "approver") return 1;
                    return 0;
                });
                
                return $scope.data_approver;
            case 'reviewer':
                return $scope.data_relatedpeople;
            case 'specialist':
                var specialist = $scope.data_relatedpeople.filter(item => item.user_type === "specialist")
                return specialist;
            default:
                return [];
        }
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
        if (item.document_file_name && item.document_file_name !== '') {
            var path = item.document_file_path;
            var name = item.document_file_name;
        } else {
            var path = item.file_upload_path;
            var name = item.file_upload_name;
        }
        
        $scope.exportfile[0].DownloadPath = path;
        $scope.exportfile[0].Name = name;
        $('#modalExportFile').modal('show');

        apply();

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
            action_type: "new",//"insert"
            descriptions: null,
            document_file_name: null,
            document_file_path: null,
            document_file_size: null,
            document_name: null,
            document_module: 'jsea',
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
            } else if($scope.data_drawing_approver[index].action_type === "update" && $scope.data_drawing_approver.length>2) {
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
    }

    function clear_form_valid() {
        $scope.id_approver_select = null;
        $scope.form_valid = { valid_document_file: false };
    }

    $scope.toggleDescription = function() {
        $scope.isChecDescription = !$scope.isChecDescription;
        apply();
    };

    $scope.changeUnitNo = function(unit_no) {
        $scope.data_general[0].id_unit_no = unit_no.id;
        $scope.data_general[0].unit_no_name = unit_no.name;
        $scope.data_general[0].id_company = unit_no.id_company;
    };

    $scope.changeTagId = function(tagIg) {
        $scope.data_general[0].id_tagid = tagIg.id;
        // $scope.data_general[0].unit_no_name = unit_no.name;
    };

    $scope.changeRequestType = function(request_type) {
        $scope.data_general[0].id_request_type = request_type.id;
    };


    $document.on('click', function(event) {
        const targetElement = event.target;
        const id = targetElement.getAttribute('id');
        var id_dropdown = '';
        var id_list = '';

        if (id) {
            id_dropdown = id.substring(0, id.indexOf('_'));
        }
        // click button
        if (id_dropdown == 'dropdown') {
            id_list = id.substring(id.indexOf("_") + 1); 
        }
        // click input text
        if (id == 'dropdown_input') {
            return
        }
        // hidden dropdown
        document.getElementById('unit_no').classList.remove("show");
        document.getElementById('tag_id').classList.remove("show");
        document.getElementById('request_type').classList.remove("show");
        // set default list
        $scope.search_keywords = clone_arr_newrow(  $scope.search_keywords);
        $scope.master_unit_no_list =  $scope.master_unit_no;
        $scope.master_tagid_list =  $scope.master_tagid;
        $scope.data_request_type_list =  $scope.data_request_type;
        // show
        try {
            document.getElementById(id_list).classList.toggle("show");
        } catch (error) {}
    });

    $scope.filterFunction = function (type) {
        if (type == 'unit_no') {
            $scope.master_unit_no_list = $filter('filter')($scope.master_unit_no, function(item) {
                var itemName = item.name.toLowerCase();
                var searchText = $scope.search_keywords.unit_no.toLowerCase();
        
                return itemName.includes(searchText);
            });
        }

        if (type == 'tag_id') {
            $scope.master_tagid_list = $filter('filter')($scope.master_tagid, function(item) {
                var itemName = item.name.toLowerCase();
                var searchText = $scope.search_keywords.tag_id.toLowerCase();
        
                return itemName.includes(searchText);
            });
        }

        if (type == 'request_type') {
            $scope.data_request_type_list = $filter('filter')($scope.data_request_type, function(item) {
                var itemName = item.name.toLowerCase();
                var searchText = $scope.search_keywords.request_type.toLowerCase();
        
                return itemName.includes(searchText);
            });
        }

    }


    $scope.editedText = {
        text: ''
    }     
    $scope.formattedText = "";
    $scope.editing = false;

    //convert text 
    function convertText(text, editing) {
        if (editing) {
            return text.split(/<br\s*\/?>/g).join("\r\n");
        } else {
            var text_check = text.replace(/\\n/g, "\n").replace(/\\r/g, "\r")
            return text_check.split(/[\r\n]+/g).join("<br><br>");        
        }
    }

    // Action function
    $scope.action_memdatorytext = function(type) {
        
        switch (type) {
            case 'edit':
                $scope.editedText ='';
                $scope.editing = true;
                $scope.unsavedChanges  = false;

                
                var editedText = convertText($scope.formattedText, true);

                $scope.editedText = {
                    text: editedText
                } 
              
                console.log("$scope.editedText",$scope.editedText)
                break;
            case 'save':
                $scope.formattedText = "";
                $scope.formattedText = convertText($scope.editedText.text, false);
                
                $scope.editing = false;

                break;
            case 'refresh':
                $scope.formattedText = "";

                $scope.editing = false;
                $scope.unsavedChanges  = true;

                $scope.formattedText = convertText($scope.mandatory_note[0].name, false);

                break;
            default:
                break;
        }

        if (!$scope.$$phase) {
            console.log(" Digest Cycle");
            $scope.$apply();
        } else {
            console.log("Already in AngularJS Digest Cycle");
        }
};

    // Function to render HTML
    $scope.renderHtml = function(htmlContent) {
        return $sce.trustAsHtml(htmlContent);
    };

    function updateDataSessionAccessInfo(type) {
        if(type == 'session'){
            $scope.data_session.forEach((item, index) => {
                $scope.getAccessInfo(item, index,type);
            });
        }else{
            
            $scope.data_drawing.forEach((item, index) => {
                $scope.getAccessInfo(item, index,'drawing');
            });
        }

    }

    $scope.accessInfoMap = {};

    $scope.getAccessInfo = function(item, index, type) {
        let accessInfo = {
            canRemove: false,
            canCopy: false,
        };
    
        if(type == 'session'){
            let approverData = $scope.data_approver.filter(data => data.id_session === item.id);
            let memberTeamData = $scope.data_memberteam.filter(data => data.id_session === item.id);
            let relatedPeopleData = $scope.data_relatedpeople.filter(data => data.id_session === item.id);
    
            if (index === 0 && 
                (approverData.length === 0 || approverData[0].user_name == null) &&
                (memberTeamData.length === 0 || memberTeamData[0].user_name == null) &&
                (relatedPeopleData.length === 0 || relatedPeopleData[0].user_name == null)) {
                accessInfo.canRemove = false;
            } else {
                accessInfo.canRemove = true;
            }
    
            if ((approverData.length > 0 && approverData[0].user_name != null) ||
                (memberTeamData.length > 0 && memberTeamData[0].user_name != null) ||
                (relatedPeopleData.length > 0 && relatedPeopleData[0].user_name != null)) {
                accessInfo.canCopy = true;
            } else {
                accessInfo.canCopy = false;
            }
        

        } else if(type === 'drawing'){
            console.log('drawing item:', item);
    
            if(index === 0) {
                if (item.document_name !== null || item.document_no !== null || item.descriptions !== null ||
                    item.document_file_name !== null || item.document_file_path !== null) {
                    accessInfo.canRemove = true;
                } else {
                    accessInfo.canRemove = false;
                }
            } else {
                accessInfo.canRemove = true;
            }
        }
        
        $scope.accessInfoMap[item.id] = accessInfo;
    
    };

    //access each role
    $scope.Access_check = function(task) {
        let accessInfo = {
            canAccess: false,
            isTA2: false,
            isTA3: false
        };
    
        // If user is an admin, allow access
        if ($scope.flow_role_type === 'admin') {
            accessInfo.canAccess = true;
            return accessInfo;
        }
    
        // If user is an employee
        if ($scope.flow_role_type === 'employee') {
            // Check if the task belongs to the user (TA2)
            if ($scope.user_name === task.user_name) {
                accessInfo.isTA2 = true;
                accessInfo.canAccess = true; // TA2 should have access to their own tasks
                console.log("User is TA2, granting access:", accessInfo);
            } else {
                // Check if the user is a TA3 for this task
                for (let item of $scope.data_approver_ta3) {
                    if (item.id_approver === task.id && $scope.user_name == item.user_name) {
                        accessInfo.isTA3 = true;
                        accessInfo.canAccess = true;               
                    }
                }
            }
        }
    
        return accessInfo;
    };
    
    function validBeforRegister() {
        if (validGeneral() && validDrawing()) {
            return true
        }

        return false
    }
    
    function validGeneral(){
        console.log($scope.data_general[0])
        console.log($scope.data_drawing)
        if (!$scope.data_general[0].pha_request_name) {
            if(!$scope.data_general[0].pha_request_name) $scope.validMessage = 'Please select a valid Task Name'
            $scope.goback_tab = 'general';
            return false
        }
        $scope.validMessage = ''
        return true
    }

    function validDrawing(){
        for (let i = 0; i < $scope.data_drawing.length; i++) {
            if (!$scope.data_drawing[i].document_file_name) {
                if(!$scope.data_drawing[i].document_file_name) $scope.validMessage = 'Please select a valid Document File'
                $scope.goback_tab = 'general';
                return false
            }
        }
        $scope.validMessage = ''
        return true
    }

});
