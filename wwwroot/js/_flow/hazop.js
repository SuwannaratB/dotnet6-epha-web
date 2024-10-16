
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
            if (a.id_guide_word === 0 && b.id_guide_word !== 0) {
                return 1; // If 'guidewords_no' of 'a' === 0 and 'guidewords_no' of 'b' !== 0, 'b' comes before 'a'
            } else if (a.id_guide_word !== 0 && b.id_guide_word === 0) {
                return -1; // If 'guidewords_no' of 'a' is not 0 and 'guidewords_no' of 'b' is 0, 'a' comes before 'b'
            } else {
                return a.id_guide_word - b.id_guide_word; // Otherwise, sort based on 'guidewords_no'
            }
        });
        return sortedArray;
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
            if (placeholderItem) {placeholderItem.classList.add('ng-hide');}

          });
  
        // Show 
        element.on('hideDropdown', function(event) {
          var placeholderItem = document.querySelector('.is-open .is-active .choices__list .is-selected'); //choices__placeholder
          if (placeholderItem) {placeholderItem.removeClass('ng-hide');}
        });

        if (!scope.item.functional_location) {
        }
      }
    };
});
  
// window.onerror = function(message, source, lineno, colno, error) {
//     console.error('Global JavaScript error:', { message, source, lineno, colno, error });
    
//     // Call set_alert function to notify the user
//     if (typeof set_alert === 'function') {
//         $('#returnModal').modal({
//             backdrop: 'static',
//             keyboard: false 
//         }).modal('show');
//     } else {
//         alert('An unexpected error occurred. Please contact support.');  
//         // Redirect to home/portal after alert is dismissed
//         window.open("home/portal", "_top");
//     }

//     return true; 
// };


AppMenuPage.controller("ctrlAppPage", function ($scope, $http, $filter, conFig, $document, $interval,$rootScope,$window,$q,$timeout) { 

    $scope.unsavedChanges = false;
    $scope.dataLoaded = false;
    $scope.leavePage = false;

    // Track location changes
    $rootScope.$on('$locationChangeStart', function(event, next, current) {

        if ($scope.unsavedChanges) {
            var confirmLeave = $window.confirm("You have unsaved changes. Are you sure you want to leave?");
            if (!confirmLeave) {
                event.preventDefault();
            }
        }
    });

    // close tab / browser window
    $window.addEventListener('beforeunload', function(event) {
        if ($scope.unsavedChanges) {
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
                console.log(`Key ${key} not found in first object at ${path || 'root'}`);
                differencesFound = true;
                continue;
            }
            if (!keys2.includes(key)) {
                console.log(`Key ${key} not found in second object at ${path || 'root'}`);
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
                console.log("Data not yet loaded, skipping watch callback.");
                return;
            }
    
            console.log("Watcher triggered change for : ", data);
            if(data == 'data_nodeworksheet'){
                console.log('555555555555555555555555555555555555')
                $scope.$evalAsync(function() {
                    computeRowspan();  // Safely schedule this to update the UI
                });
            }            
    
            if ($scope.data_header[0].pha_status === 11 || $scope.data_header[0].pha_status === 12) {
                $scope.stopTimer();
                $scope.startTimer();
    
                if (Array.isArray(newValues) && Array.isArray(oldValues)) {
                    if (!isEqual(newValues, oldValues, data)) {
                        console.log("newValues", newValues);
                        console.log("oldValues", oldValues);
                        console.log("new !== old");
    
                        $scope.unsavedChanges = true;
                    }
                } else if (!_.isEqual(newValues, oldValues)) {
                    console.log("newValues", newValues);
                    console.log("oldValues", oldValues);
                    console.log("new !== old");
    
                    $scope.unsavedChanges = true;
                }
            }
    
        }, true);
    }

    setupWatch('tabs');

    setupWatch('data_general');
    setupWatch('data_approver');
    setupWatch('data_memberteam');
    setupWatch('data_relatedpeople');
    setupWatch('data_relatedpeople_outsider');
    setupWatch('data_nodeworksheet');


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


    //manage tabs
    if(true){
        $scope.changeTab = function (selectedTab) {
            $scope.action_part = selectedTab.action_part;
            
    
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
                                $scope.goback_tab = 'general';
                                
                                angular.forEach($scope.tabs, function (tab) {
                                    tab.isActive = false;
                                });
                                selectedTab.isActive = true;
    
                                // return set_alert('Warning', 'Please select a valid General Information');
                            }
    

                            if(!validBeforRegister()) 
                                return set_alert('Warning',$scope.validMessage,$scope.goback_tab)
    
                            apply();
                            $('#modalPleaseRegister').modal('show');
                            return;
                        } else {
    
                            $scope.tab_worksheet_active = true;
                            $scope.tab_managerecom_active = true;
                            $scope.tab_worksheet_show = true;
                            $scope.tab_managerecom_show = true;

                            $scope.confirmSave('save')
                            
                        }
                    }
                }
    
                //if selcte hazop
                if (selectedTab.action_part == 5) {
                    $scope.selectedItemNodeView.seq = $scope.data_node[0].id;
                    $scope.viewDataNodeList($scope.selectedItemNodeView.seq);
    
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
    
                check_tab(selectedTab[0].name);
    
            }else{
                selectedTab.isActive = true;
                var activeTabPane = document.getElementById("tab-" + selectedTab.name);
                if (activeTabPane) {
                    activeTabPane.classList.add('show', 'active');
                }
        
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
            
            $scope.goback_tab = 'approver';

            return { valid: true, fileSizeKB, fileExtension };
        }          

        // Common file selection and upload logic
        function handleFileSelection(input, file_part, allowedFileTypes, tabName, dataArray, documentModule) {
            try {
                const fileDoc = $scope.data_header[0].pha_no;
                const fileInput = input;
                const fileSeq = fileInput.id.split('-').pop();

                if(tabName === 'approver' ){
                    const fileInfoSpan = document.getElementById('filename-approver-' + fileSeq);
                }else{
                    const fileInfoSpan = document.getElementById('filename' + fileSeq);

                }

                if (fileInput.files.length > 0) {
                    const file = fileInput.files[0];

                     // Allowed characters regex (same logic as your backend)
                    const allowedCharsRegex = /^[()a-zA-Z0-9_.\-\u0E00-\u0E7F\s]+$/;
                    
                    // Validate file name for allowed characters
                    if (!allowedCharsRegex.test(file.name)) {
                        set_alert('Warning', 'The file name contains invalid characters. Only letters, digits, and special characters like () _ - . are allowed.',tabName);

                        return;
                    }

                    const validation = validateFile(file, 10240, allowedFileTypes);

                    if (!validation.valid) {
                        set_alert('Warning', validation.message,tabName);
                        return;
                    }

                    uploadFile(file, fileSeq, file.name, validation.fileSizeKB, file_part, fileDoc,tabName)
                        .then(response => {
                            const arr = $filter('filter')(dataArray, function (item) { return item.seq == fileSeq; });
                            if (arr.length > 0) {
                                // Replace backslashes (\) with forward slashes (/)
                                const correctedFilePath = response.ATTACHED_FILE_PATH.replace(/\\/g, '/');

                                arr[0].document_file_name = response.ATTACHED_FILE_NAME;
                                arr[0].document_file_size = validation.fileSizeKB; 
                                arr[0].document_file_path = service_file_url + correctedFilePath;
                                arr[0].document_module = documentModule;
                                arr[0].action_change = 1;
                                $scope.$apply(); // Ensure the scope is updated
                            }

                            set_alert('Success', 'Your file has been successfully attached.',tabName);
                        })
                        .catch(error => {
                            console.error('File upload error:', error);
                            set_alert('Error', 'Failed to upload the file. Please try again.',tabName);
                        });
                } else {
                    fileInfoSpan.textContent = "";
                    $scope.goback_tab = tabName;
                    set_alert('Warning', "No file selected. Please select a file to upload.",tabName);
                }
            } catch (error) {
                console.error('Unexpected error during file selection:', error);
                $scope.goback_tab = tabName;
                set_alert('Error', 'An unexpected error occurred. Please try again or contact support.',tabName);
            }
        }

        function uploadFile(file, seq, fileName, fileSizeKB, filePart, fileDoc,tabName) {
            const fd = new FormData();
            fd.append("file_obj", file);
            fd.append("file_seq", seq);
            fd.append("file_name", fileName);
            fd.append("file_doc", fileDoc);
            fd.append("file_part", filePart); // drawing, responder, approver
            fd.append("sub_software", 'hazop');

        
            return new Promise((resolve, reject) => {
                const request = new XMLHttpRequest();
                request.open("POST", url_ws + 'Flow/uploadfile_data');
                request.setRequestHeader('X-CSRF-TOKEN', $scope.token);              
                request.withCredentials = true;

                request.onreadystatechange = function () {
                    if (request.readyState === XMLHttpRequest.DONE) {
                        $("#divLoading").hide();
                        if (request.status === 200) {
                            try {
                                const parsedResponse = JSON.parse(request.responseText);
                                if (parsedResponse && parsedResponse.msg && parsedResponse.msg.length > 0 && parsedResponse.msg[0].STATUS === "true") {
                                    resolve(parsedResponse.msg[0]);
                                } else {
                                    set_alert('Warning', 'The system encountered an issue processing your file. Please try again or contact support if the problem persists.',tabName);
                                    reject('Service response indicated an issue.');
                                }
                            } catch (e) {
                                set_alert('Error', 'Unexpected issue occurred while processing your request. Please try again later.',tabName);
                                reject(e);
                            }
                        } else {
                            set_alert('Error', 'We are unable to complete your request at the moment. Please check your connection or try again later.',tabName);
                            reject('Error during server request: ' + request.status);
                        }
                    }
                };
        
                $("#divLoading").show();
                request.send(fd);
            });
        }

        // File select for approver
        $scope.fileSelectApprover = function (input, file_part) {

            handleFileSelection(input, file_part, ['pdf', 'eml', 'msg'], 'approver', $scope.data_drawing_approver, 'approver');
        };

        // File select for general
        $scope.fileSelect = function (input, file_part) {
            //handleFileSelection(input, file_part, ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'png', 'gif'], 'general', $scope.data_drawing, 'hazop');
            handleFileSelection(input, file_part, ['pdf'], 'node', $scope.data_drawing, 'hazop');
        };

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
                    set_alert('Warning', 'Please select a PDF file.','ram');
                    return;
                }
    
                var file_path = uploadFileRAM(file, fileSeq, fileName, fileSize);
    
            } else {
                fileInfoSpan.textContent = "";
            }
        }
    
        function uploadFileRAM(file_obj, seq, file_name, file_size) {
            var sub_software = 'hazop';// ram เก็บไว้ที่เดียวกกัน
            var fd = new FormData();
            //Take the first selected file
            fd.append("file_obj", file_obj);
            fd.append("file_seq", seq);
            fd.append("file_name", file_name);
            fd.append("sub_software", sub_software);
            fd.append("user_name", $scope.user_name);
    
            try {
                const request = new XMLHttpRequest();
                request.open("POST", url_ws + 'Flow/uploadfile_data');
                request.send(fd);
                request.setRequestHeader('X-CSRF-TOKEN', $scope.token);              
                request.withCredentials = true;
    
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

    $scope.focusNode = function () {

        var tag_name = 'node';
        var arr_tab = $filter('filter')($scope.tabs, function (item) {
            return ((item.name == tag_name));
        });
        $scope.changeTab_Focus(arr_tab, tag_name);

        document.getElementById("node_" + $scope.selectedItemNodeView.seq).focus();
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
        var flow_role_type = $scope.flow_role_type;

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
            data: '{"sub_software":"hazop","user_name":"' + user_name + '","row_type":"' + flow_role_type + '","seq":"' + seq + '","export_type":"' + data_type + '"}',
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
                try {
                    if (data && data.msg && data.msg.length > 0) {
                        var response = data.msg[0];
    
                        if (response.STATUS === "true") {
    
                            var path = (url_ws).replace('/api/', '') + response.ATTACHED_FILE_PATH.replace(/\\/g, '/');
                            var name = response.ATTACHED_FILE_NAME;


                            $scope.exportfile[0].DownloadPath = path;
                            $scope.exportfile[0].Name = name;
                                                        
                            setTimeout(function() {
                                $('#modalExportFile').modal('show');
                            }, 0);

                             apply()
                        } else {
                            set_alert('Warning', response.IMPORT_DATA_MSG || 'The system encountered an issue processing your file. Please try again.','report');
                        }
                    } else {
                        // If data.msg is undefined or not in the expected format
                        set_alert('Warning', 'Unexpected response from the server. Please try again or contact support.','report');
                    }
                } catch (e) {
                    // Catch any JSON parsing or unexpected errors during success handling
                    set_alert('Error', 'An unexpected error occurred while processing the response. Please try again later.');
                    console.error('Error during success handling:', e);
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
        $scope.user = JSON.parse(localStorage.getItem('user'));
        $scope.token = JSON.parse(localStorage.getItem('token'))
        $scope.user_name = $scope.user['user_name'];
        $scope.flow_role_type = $scope.user['role_type'];
        // $scope.user_name = conFig.user_name();
        $scope.pha_seq = conFig.pha_seq();
        $scope.pha_type_doc = conFig.pha_type_doc();

        $scope.currentYear = new Date().getFullYear();

        $scope.object_items_name = null;

        $scope.selectViewTypeFollowup = true;

        $scope.action_part = 1;

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
        $scope.data_approver_ta3 = [];

        $scope.data_drawing = [];
        $scope.data_node = [];
        $scope.data_nodedrawing = [];
        $scope.data_nodeguidwords = [];
        $scope.data_nodeworksheet = [];
        $scope.data_drawing_approver = [];

        $scope.data_session_delete = [];
        $scope.data_memberteam_delete = [];
        $scope.data_approver_delete = [];
        $scope.data_approver_ta3_delete = [];
        $scope.data_drawing_delete = [];
        $scope.data_node_delete = [];
        $scope.data_nodedrawing_delete = [];
        $scope.data_nodeguidwords_delete = [];
        $scope.data_nodeworksheet_delete = [];
        $scope.data_drawing_approver_delete = [];


        $scope.select_history_tracking_record = false;

        $scope.selectedItemNodeView = {seq:0};
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

        $scope.search_keywords = {
            indicator: '',
            unit_no: '',
            functional: '',
            request_type: '',
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

    }

    function check_tab(val) {

        $scope.action_part = 1;
        var arr_tab = $filter('filter')($scope.tabs, function (item) { return (item.name == val); });
        if (arr_tab.length > 0) { $scope.action_part = Number(arr_tab[0].action_part); }
        if (val == 'worksheet') { $scope.viewDataNodeList($scope.selectedItemNodeView.seq); }
        //if (val === 'approver') { }
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

        var arr = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'recommendations'); });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqdata_nodeworksheetrecommendations = iMaxSeq;


        $scope.MaxSeqdata_drawing_approver = 0;
        var arr_check = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'drawing_approver'); });
        var iMaxSeq = 1; if (arr_check.length > 0) { iMaxSeq = arr_check[0].values; }
        $scope.MaxSeqdata_drawing_approver = iMaxSeq;

        $scope.MaxSeqdata_approver_ta3 = 0;
        var arr_check = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'approver_ta3'); });
        var iMaxSeq = 1; if (arr_check.length > 0) { iMaxSeq = arr_check[0].values; }
        $scope.MaxSeqdata_approver_ta3 = iMaxSeq;


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
        get_data(true, false);
    }

    function save_data_create(action, action_def) {
        if ($scope.action_part != 4) { set_data_managerecom(); }

        check_data_functional_audition();

        var action_part = $scope.action_part;
        var user_name = $scope.user_name;
        var flow_role_type = $scope.flow_role_type;
        var token_doc = $scope.token_doc + "";
        var pha_status = $scope.data_header[0].pha_status;
        var pha_version = $scope.data_header[0].pha_version;
        var pha_seq = $scope.data_header[0].seq;
        token_doc = pha_seq;


        var json_header = angular.toJson($scope.data_header);
        var json_general =  check_data_general();
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
        }else if(action == 'change_approver'){
            flow_action = 'change_approver'
        }else if(action == 'submit'){
            flow_action = action
        }else {
            flow_action = action
        }
        
        $.ajax({
            url: url_ws + "Flow/set_hazop",
            data: '{"user_name":"' + user_name +'","row_type":"' + flow_role_type + '","token_doc":"' + token_doc + '","pha_status":"' + pha_status + '","pha_version":"' + pha_version + '","action_part":"' + action_part + '"'
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
            headers: {
                'X-CSRF-TOKEN': $scope.token
            },
            xhrFields: {
                withCredentials: true // เปิดการส่ง Cookie ไปพร้อมกับคำขอ
            },
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
    
                var user_name = $scope.user_name
                var flow_role_type = $scope.flow_role_type;
                //after save set to true and false 
                $scope.data_nodeworksheet = data.data_nodeworksheet;
                try{
                    $scope.data_nodeworksheet.forEach(function (item) { item.action_project_team = (item.action_project_team == 1 ? true : false); });  

                }catch{}

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
                            data: '{"controller_action_befor":"' + controller_action_befor + '","user_name":"' + user_name + '","row_type":"' + flow_role_type + '","pha_seq":"' + pha_seq + '"'
                                + ',"pha_no":"' + pha_no + '","pha_status":"' + pha_status + '","pha_type_doc":"' + pha_type_doc + '"}',
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


                                if ($scope.leavePage) {
                                    window.open("home/portal", "_top");
                                    return;
                                };

                                //get_data_after_save(false, (flow_action == 'submit' ? true : false), $scope.pha_seq);
                                get_data_after_save(false, false, $scope.pha_seq);
                                
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
                            data: '{"controller_action_befor":"' + controller_action_befor + '","user_name":"' + user_name + '","row_type":"' + flow_role_type + '","pha_seq":"' + pha_seq + '"'
                                + ',"pha_no":"' + pha_no + '","pha_status":"' + pha_status + '","pha_type_doc":"' + pha_type_doc + '"}',
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


                    }else if (action == 'submit'){
                        set_alert('Success', 'Data has been successfully submitted.')
                        return window.open('hazop/search', "_top");
                    }
                    else {

                        set_alert('Success', 'Data has been successfully submitted.');
                        get_data_after_save(false, false, $scope.pha_seq);
                        // window.open('hazop/search', "_top");
                        return;
                    }
                }
                else {
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
        var json_approver = check_data_approver();

        $.ajax({
            url: url_ws + "flow/set_approve",
            data: '{"sub_software":"hazop","user_name":"' + user_name + '","role_type":"' + flow_role_type + '","action":"' + flow_action + '","token_doc":"' + pha_seq + '","pha_status":"' + pha_status + '"'
                + ',"id_session":"' + id_session + '","seq":"' + seq + '","action_status":"' + action_status + '","comment":"' + comment + '","user_approver":"' + user_approver + '"'
                + ', "json_approver": ' + JSON.stringify(json_approver)
                + ', "json_drawing_approver": ' + JSON.stringify(json_drawing_approver)
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

                if (arr[0].status == 'true') {
                    $scope.pha_type_doc = 'update';

                    if (action == 'save') {

                        set_alert('Success', 'Data has been successfully saved.');
                        apply();


                        get_data_after_save(false, false, $scope.pha_seq);
                    }
                    else {
                        set_alert('Success', 'Data has been successfully submitted.');

                        if (arr[0].pha_status == '13') {
                            //กรณีที่ TA2 approve all
                            if($scope.flow_role_type == 'admin') {
                                return page_load();
                            }

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
                    if (arr[0].pha_status == '13') {
                        //กรณีที่ TA2 approve all
                        if($scope.flow_role_type == 'admin') {
                            return page_load();
                        }

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

                    apply();

                    return;                    
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
    function save_data_approver_ta3(action) {

        var user_name = $scope.user_name;
        var token_doc = $scope.token_doc + "";
        var pha_seq = $scope.data_header[0].seq;
        var pha_status = $scope.data_header[0].pha_status;
        var flow_role_type = $scope.flow_role_type;

        var flow_action = action;

        var json_header = angular.toJson($scope.data_header);
        var json_approver = check_data_approver();
        var json_approver_ta3 = check_data_approver_ta3();
        //var json_drawing_approver = check_data_drawing_approver(id_session);


        var data = {
            sub_software: "hazop",
            user_name: user_name,
            role_type: flow_role_type,
            action: flow_action,
            json_header: json_header,
            json_approver: json_approver,
            json_approver_ta3: json_approver_ta3
        };
        

        $.ajax({
            url: url_ws + "flow/set_approve_ta3",
            data: '{"sub_software":"hazop","user_name":"' + user_name + '","role_type":"' + flow_role_type + '","token_doc":"' + pha_seq + '","action":"' + flow_action 
                + '","json_header":' + JSON.stringify(json_header) 
                + ',"json_approver":' + JSON.stringify(json_approver) 
                + ',"json_approver_ta3":' + JSON.stringify(json_approver_ta3) 
                + '}',  
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $scope.token
            },
            xhrFields: {
                withCredentials: true // เปิดการส่ง Cookie ไปพร้อมกับคำขอ
            },
            beforeSend: function() {
                $("#divLoading").show();
            },
            complete: function() {
                $("#divLoading").hide();
            },
            success: function(data) {
                var arr = data;
                console.log(arr);

                if (arr[0].status == 'true') {
                    $scope.pha_type_doc = 'update';

                    if (action == 'save') {
                        //set_alert('Success', 'Data has been successfully saved.');
                        $scope.$apply();
                    } else {
                        set_alert('Success', 'Data has been successfully submitted.');
                    }
                } else {
                    set_alert('Error', arr[0].status);
                    $scope.$apply();
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                if (jqXHR.status == 500) {
                    console.error('Internal error: ' + jqXHR.responseText);
                    alert('Internal error: ' + jqXHR.responseText);
                } else if (jqXHR.status == 400) {
                    console.error('Bad Request: ' + jqXHR.responseText);
                    alert('Bad Request: ' + jqXHR.responseText);
                } else {
                    console.error('Unexpected error:', textStatus, errorThrown);
                    console.error('Response Text:', jqXHR.responseText);
                    alert('Unexpected error: ' + textStatus);
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
        var json_worksheet = check_data_nodeworksheet();

        $.ajax({
            url: url_ws + "flow/edit_worksheet",
            data: '{"sub_software":"hazop","user_name":"' + user_name + '","role_type":"' + flow_role_type + '","action":"' + flow_action + '","token_doc":"' + pha_seq + '","pha_status":"' + pha_status + '"'
                + ', "json_worksheet": ' + JSON.stringify(json_worksheet)
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

        var user_name = $scope.user_name;
        var pha_seq = conFig.pha_seq();

        if (page_load == true) {
            $scope.pha_seq = pha_seq;
            $scope.user_name = user_name;
        } else { pha_seq = $scope.pha_seq; }

        call_api_load(page_load, action_submit, user_name, pha_seq);
    }

    function get_data_after_save(page_load, action_submit, pha_seq) {
        var user_name = $scope.user_name;
        call_api_load(false, action_submit, user_name, pha_seq);
    }

    function call_api_load(page_load, action_submit, user_name, pha_seq) {

        var type_doc = $scope.pha_type_doc;//review_document
        var flow_role_type = $scope.flow_role_type;
        $scope.params = get_params();

        $.ajax({
            url: url_ws + "Flow/get_hazop_details",
            data: '{"sub_software":"hazop","user_name":"' + user_name + '","row_type":"' + flow_role_type + '","token_doc":"' + pha_seq + '","type_doc":"' + type_doc + '"}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $scope.token
            },
            xhrFields: {
                withCredentials: true // เปิดการส่ง Cookie ไปพร้อมกับคำขอ
            },
            beforeSend: function () {
                $('#divLoading').show();
                $('#divPage').addClass('d-none');

            },
            complete: function () {
                $('#divLoading').hide();
            },
            success: function (data) {
                var action_part_befor = $scope.action_part;//(page_load == false ? $scope.action_part : 0);
                var tabs_befor = (page_load == false ? $scope.tabs : null);


                var arr = data;
                // set isDisableStatus PHA STATUS > 12 (waitting follow up)
                $scope.isDisableStatus = setup_isDisabledPHAStatus(arr.header[0])
                // set isApproveReject
                $scope.isApproveReject = setup_isApproveReject(arr.header[0])
                // set isApproveReject
                $scope.isEditWorksheet = setup_isEditWorksheet($scope.params)

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

                    $scope.data_general = angular.copy(arr.general);

                    //set id to 5 
                    $scope.data_general.forEach(function (item) { item.id_ram = (item.id_ram == null ? 5 : item.id_ram); });

                    $scope.data_functional_audition = arr.functional_audition;

                    //wait pkul sent img matrix
                    $scope.data_session = arr.session;
                    $scope.data_session_def = clone_arr_newrow(arr.session);

                    $scope.data_session_last = arr.session_last;
                    $scope.data_session_last_reject = arr.session_last_reject;


                    $scope.data_memberteam = arr.memberteam;
                    $scope.data_memberteam_def = clone_arr_newrow(arr.memberteam);
                    $scope.data_memberteam_old = (arr.memberteam);

                    $scope.set_data_approver = function(approvers) {
                        let uniqueApprovers = [];
                        let idSeqMap = {};
                    
                        for (let approver of approvers) {
                            let id = approver.id;
                            let seq = approver.seq;
                    
                            if (!idSeqMap[id]) {
                                idSeqMap[id] = new Set();
                            }
                    
                            while (idSeqMap[id].has(seq)) {
                                seq += 1; // Increment seq if it's a duplicate
                            }
                    
                            idSeqMap[id].add(seq);
                            uniqueApprovers.push({ ...approver, seq: seq });
                        }
                    
                        return uniqueApprovers;
                    };
                    
                    // Now set $scope.data_approver to the unique approvers
                    $scope.data_approver = $scope.set_data_approver(arr.approver);
                    $scope.data_approver_def = clone_arr_newrow($scope.set_data_approver(arr.approver));
                    $scope.data_approver_old = $scope.set_data_approver(arr.approver);
                    
                    //check id_pha ก่อน
                    arr.approver_ta3 = arr.approver_ta3.filter((item) => {
                        return item.id_pha === $scope.data_approver[0].id_pha && item.id_pha === $scope.data_header[0].id;
                    });

                    $scope.data_approver_ta3 = arr.approver_ta3;
                    $scope.data_approver_ta3_def = clone_arr_newrow(arr.approver_ta3);
                    $scope.data_approver_ta3_old = (arr.approver_ta3);

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


                    $scope.data_nodeworksheet = arr.nodeworksheet;

                    $scope.data_nodeworksheet.forEach(function (item) { item.action_project_team = (item.action_project_team == 1 ? true : false); });    

                    // formatEstimatedDate
                    // formatEstimatedDate();
                    $scope.data_nodeworksheet_def = clone_arr_newrow(arr.nodeworksheet);

                    $scope.data_drawing_approver = arr.drawing_approver;
                    $scope.data_drawing_approver_def = clone_arr_newrow(arr.drawing_approver);
                    $scope.data_drawing_approver_old = (arr.drawing_approver);

                    get_max_id();
                    set_data_general();
                    set_data_approver()
                    set_data_nodeguidwords();
                    set_data_nodeworksheet();
                    set_master_ram_likelihood('');


                    //get recommendations_no in node worksheet
                    if ($scope.data_nodeworksheet.length > 0) {
                        var arr_copy_def = angular.copy($scope.data_nodeworksheet, arr_copy_def);
                        arr_copy_def.sort((a, b) => Number(b.recommendations_no) - Number(a.recommendations_no));

                        if($scope.pha_status == '12'){
                            console.log($scope.pha_status)
                            for (let i = 0; i < $scope.data_nodeworksheet.length; i++) {
                                if ($scope.data_nodeworksheet[i].recommendations_no == 0) {
                                    // If recommendations is '0', set it to null
                                    $scope.data_nodeworksheet[i].recommendations_no = null;
                                } 
                            }
                        }


                        //get_rowspam
                        $scope.rowspanMap = {};
                        $scope.$evalAsync(function() {
                            computeRowspan();  
                        });

                        $scope.selectedItemNodeView.seq = $scope.data_nodeworksheet[0].id_node;
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
                    $scope.flow_role_type = $scope.flow_role_type;// "admin";//admin,request,responder,approver
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

                $scope.data_header = JSON.parse(replace_hashKey_arr(arr.header));


                //ตรวจสอบเพิ่มเติม
                //เอาไใ้ทำไรนะ
                /*console.log("arr.user_in_pha_no[0].pha_no",arr.user_in_pha_no[0].pha_no)
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
                }*/

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

                    try{
                        if ($scope.data_general[0].master_apu == null || $scope.data_general[0].master_apu == '') {
                            $scope.data_general[0].master_apu = null;
                            //var arr_clone_def = { id: $scope.data_general[0].master_apu, name: 'Please select' };
                            var arr_clone_def = { id: null, name: 'Please select' };
                            $scope.master_apu.splice(0, 0, arr_clone_def);
                        }
                    }catch{}

                    if ($scope.params == 'edit_approver') {
                        $scope.save_type = false;
                    } 

                    var pha_status = $scope.data_header[0].pha_status

                    
                }

                $scope.pha_status = $scope.data_header[0].pha_status;

                //set form 
                if(!$scope.params){
                    set_form_action(action_part_befor, !action_submit, page_load);
                    set_form_access(pha_status,$scope.params,$scope.flow_role_type)   
                }else{
                    set_edit_form(pha_status,$scope.params,$scope.flow_role_type);
                }

                set_tab_focus(pha_status,action_part_befor)

                if(true){
                    //JS choice
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
                }

                $scope.dataLoaded = true;
                $scope.leavePage = false;
                
                //set time tracking
                if($scope.data_header[0].pha_status === 11 || $scope.data_header[0].pha_status === 12){
                    $scope.startTimer();  
                }

                $scope.unsavedChanges= false;
                
                $('#divPage').removeClass('d-none');

                /*$scope.data_nodeworksheet = $scope.data_nodeworksheet.filter(function (item) {
                    return (
                        item.deviations.toLowerCase().includes('test')
                    );
                });


                console.log( "=========================================",$scope.data_nodeworksheet)*/


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

    if(true){
        function initializeTabs(pha_status_def) {
            $scope.tabs = [
                { name: 'general', action_part: 1, title: 'General Information', isActive: true, isShow: false },
                { name: 'session', action_part: 2, title: 'HAZOP Session', isActive: false, isShow: false },
                { name: 'node', action_part: 3, title: 'Node', isActive: false, isShow: false },
                { name: 'ram', action_part: 4, title: 'RAM', isActive: false, isShow: false },
                { name: 'worksheet', action_part: 5, title: 'HAZOP Worksheet', isActive: false, isShow: false },
                { name: 'manage', action_part: 6, title: 'Manage Recommendations', isActive: false, isShow: false },
                { name: 'report', action_part: 8, title: 'Report', isActive: false, isShow: false }
            ];
        
            // Check pha_status and add 'approver' tab if pha_status is 21 or 22
            if (pha_status_def == 21 || pha_status_def == 22) {
                $scope.tabs.splice(6, 0, { name: 'approver', action_part: 7, title: 'Approver', isActive: false, isShow: false });
            }
        
            // Initialize visibility and activity for each tab
            $scope.tabs.forEach(tab => {
                $scope[`tab_${tab.name}_show`] = true;  
                $scope[`tab_${tab.name}_active`] = tab.isActive;  
                tab.isShow = true; 
            });
        }
    
        function setTabsActive(tabs) {
            // Deactivate all tabs first
            const allTabs = ['general', 'node', 'worksheet', 'managerecom', 'approver', 'report'];
            allTabs.forEach(tab => {
                $scope[`tab_${tab}_active`] = false;
            });
        
            // Activate only the specified tabs
            tabs.forEach(tab => {
                $scope[`tab_${tab}_active`] = true;
            });
        
            // Ensure the 'report' tab is always active
            $scope.tab_report_active = true;
        }
        

        function showTabs(tabs) {
            // Deactivate all tabs first
            const allTabs = ['general', 'node', 'worksheet', 'managerecom', 'approver'];
            allTabs.forEach(tab => {
                $scope[`tab_${tab}_active`] = false;
            });
        
            // Activate only the specified tabs
            tabs.forEach(tab => {
                $scope[`tab_${tab}_active`] = true;
            });
        }
        

        function setAllTabsInctive() {
            $scope.tab_general_active = false;
            $scope.tab_node_active = false;
            $scope.tab_worksheet_active = false;
            $scope.tab_managerecom_active = false;
            $scope.tab_approver_active = false;

            // Ensure the 'report' tab is always active
            $scope.tab_report_active = true;
        }
    
        function set_form_action(action_part_befor, action_save, page_load) {
    
    
    
            $scope.action_part = action_part_befor;
    
            var pha_status_def = Number($scope.data_header[0].pha_status);
            initializeTabs(pha_status_def);

    
            $scope.submit_review = false;
    
            if (pha_status_def == 11) {

                const subExpenseType = $scope.data_general[0].sub_expense_type;
                const set_tabs = ['general', 'node', 'worksheet', 'managerecom'];
            
                if (subExpenseType === 'Study' || subExpenseType === 'Internal Study') {
                    showTabs(set_tabs);
                    setTabsActive(set_tabs);

                    if ($scope.selectedItemNodeView.seq == 0) {
                        if ($scope.data_node.length > 0) {
                            $scope.selectedItemNodeView.seq = $scope.data_node[0].seq;
                        }
                    }
                } else {
                    showTabs(set_tabs);
                    setTabsActive(['general', 'node', 'managerecom']); 
                }
    
                if (page_load) {
    
                    var arr_submit = $filter('filter')($scope.data_node, function (item) {
                        return ((item.node !== '' && item.action_type !== null));
                    });
                    if (arr_submit.length > 0) {
                        $scope.submit_type = true;
                    } else { $scope.submit_type = false; }
    
    
                    $scope.cancle_type = true;
                }

    
            }
            else if (pha_status_def == 12) {
    
                check_case_member_review();

                const set_tabs = ['general', 'node', 'worksheet', 'managerecom'];
            
                showTabs(set_tabs);
                setTabsActive(set_tabs);

                if ($scope.data_nodeworksheet.length == 0) {
                    $scope.tab_managerecom_show = false;
                    $scope.tab_approver_show = false;
                }

    
                $scope.selectedItemNodeView.seq = $scope.data_node[0].seq;
    
                $scope.submit_type = true;
    

            }
            else if (pha_status_def == 13) {
    
                const set_tabs = ['general', 'node', 'worksheet', 'managerecom'];
            
                showTabs(set_tabs);
                setAllTabsInctive();

                $scope.selectedItemNodeView.seq = $scope.data_node[0].seq;

                //button
                $scope.save_type = false;
                $scope.submit_type = false;

                $scope.isDisableStatus = true;
            }
            else if (pha_status_def == 14) {

                const set_tabs = ['general', 'node', 'worksheet', 'managerecom'];
            
                showTabs(set_tabs);
                setAllTabsInctive();
    
                $scope.selectedItemNodeView.seq = $scope.data_node[0].seq;
    
                if ($scope.flow_role_type == "admin") {
                    $scope.save_type = true;
                    $scope.submit_type = true;
                }

                $scope.isDisableStatus = true;
    
            }
            else if (pha_status_def == 21) {
    
                const set_tabs = ['general', 'node', 'worksheet', 'managerecom','approver'];
            
                showTabs(set_tabs);
                setTabsActive(['approver']);
    
                $scope.selectedItemNodeView.seq = $scope.data_node[0].seq;
    
                $scope.save_type = true;
                $scope.submit_type = true;
    
    
                $scope.selectSendBack = ($scope.data_header[0].approve_status == 'approve' ? 'option1' : 'option2');

                $scope.active_session = $scope.data_session_last[0].id_session;
    
                check_case_member_review();
    
            }
            else if (pha_status_def == 22) {

                const set_tabs = ['general', 'node', 'worksheet', 'managerecom','approver'];
            
                showTabs(set_tabs);

                if($scope.flow_role_type === 'admin' ||($scope.data_header[0].pha_request_by.toLowerCase() === $scope.user_name.toLowerCase())){
                    setTabsActive(['general', 'areas', 'worker', 'worksheet', 'manage']);
                    $scope.isDisableStatus = false;
                }else{
                    setAllTabsInctive();

                    $scope.isDisableStatus = true;

                }

                check_case_member_review();
    
                $scope.selectedItemNodeView.seq = $scope.data_node[0].seq;

                //active session === lastest session
                const maxSeq = $scope.data_drawing.reduce((max, item) => {
                    if (item.action_type === 'update') {
                        return item.seq > max ? item.seq : max;
                    }
                    return max; // ถ้าไม่ตรงเงื่อนไขให้ส่ง max กลับมา
                }, 0);


                if($scope.data_session_last_reject){
                    $scope.active_session = $scope.data_session_last_reject[0].id_session;
                }
                $scope.active_drawing = maxSeq.seq;

                $scope.submit_type = true;

                $scope.isApproveReject =true;

            }
            else if (pha_status_def == 81) {
                const set_tabs = ['general', 'node', 'worksheet', 'managerecom'];
            
                showTabs(set_tabs);
                setAllTabsInctive();

                $scope.back_type = true;
                $scope.cancle_type = false;
                $scope.export_type = false;
                $scope.save_type = false;
                $scope.submit_type = false;
                $scope.submit_review = false;

    
            }
            else if (pha_status_def == 91) {

                const set_tabs = ['general', 'node', 'worksheet', 'managerecom','approver'];
            
                showTabs(set_tabs);
                setAllTabsInctive();
    
                $scope.save_type = false;
                $scope.submit_type = false;
                $scope.export_type = true;
    
                $scope.selectedItemNodeView.seq = $scope.data_node[0].seq;
    
    
            }
    
    
            //review doc
            if ($scope.pha_type_doc == 'review_document') {

                setAllTabsInctive();
    
                $scope.back_type = true;
                $scope.cancle_type = false;
                $scope.export_type = true;
                $scope.save_type = false;
                $scope.submit_type = false;
                $scope.submit_review = false;
            }
    
            /*for (let i = 0; i < $scope.data_approver.length; i++) {
                if ($scope.user_name === $scope.data_approver[i].user_name) {
                  $scope.tab_approver_active = true;
                  break;
                }
            }*/
    
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

        function set_form_access(pha_status,params,flow_role_type){
            if(pha_status === 11 || pha_status === 12 || pha_status === 22){
                $scope.can_edit = true;
            }

            if(params != 'edit_approver'){
                $scope.action_owner_active = true;
            }  

             if (params === null && pha_status === 21) {
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
                    $scope.data_approver_ta3.filter(item => {
                        if(item.user_name === $scope.user_name){
                            $scope.tab_approver_active = true;
    
                        }
                    })
                }
            }
        }
        
        function set_edit_form(status,params,flow_role_type){

            //edit
            //edit_action_owner
            //edit_approver
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

            if(params != 'edit_approver'){
                $scope.action_owner_active = true;
            }  
        }
        
        function set_tab_focus(pha_status, action_part_befor) {
        
            let arr_tab;
        
            if (pha_status === 11) {
                arr_tab = $filter('filter')($scope.tabs, item => item.action_part === action_part_befor);
                $scope.changeTab_Focus(arr_tab, arr_tab.name);
            } 
            else if ([12, 13, 14, 22].includes(pha_status) || 
                     (pha_status === 12 || $scope.params === 'edit_action_owner' || $scope.params === 'edit')) {
                arr_tab = $filter('filter')($scope.tabs, item => item.action_part === 5);
                $scope.action_part = 5;
                $scope.changeTab_Focus(arr_tab, arr_tab.name);
            } 
            else if ([11, 81, 91].includes(pha_status) && !$scope.params) {
                arr_tab = $filter('filter')($scope.tabs, item => item.action_part === 1);
                $scope.action_part = 1;
                $scope.changeTab_Focus(arr_tab, arr_tab.name);
            } 
            else if (pha_status === 21 && !$scope.params) {
                arr_tab = $filter('filter')($scope.tabs, item => item.action_part === 7);
                $scope.action_part = 7;
                $scope.changeTab_Focus(arr_tab, arr_tab.name);
            } 
            else if ($scope.params === 'edit_action_owner') {
                arr_tab = $filter('filter')($scope.tabs, item => item.action_part === 5);
                $scope.action_part = 5;
                $scope.changeTab_Focus(arr_tab, arr_tab.name);
            }
            else if ($scope.params === 'edit_approver') {
                arr_tab = $filter('filter')($scope.tabs, item => item.action_part === 7);
                $scope.action_part = 7;
                $scope.changeTab_Focus(arr_tab, arr_tab.name);
            }
            else if ($scope.params === 'edit') {
                arr_tab = $filter('filter')($scope.tabs, item => item.action_part === 1);
                $scope.action_part = 1;
                $scope.changeTab_Focus(arr_tab, arr_tab.name);
            }
        
        }


    }

    function check_case_approver() {
        const hasInsert = $scope.data_session.some(item => item.action_type === 'insert');
        console.log('Has insert:', hasInsert);
    
        if (hasInsert) {
            console.log('Insert found. Exiting function.');
            return; 
        }
    
        const last_session = $scope.data_session.reduce((max, item) => {
            return item.seq > max ? item.seq : max;
        }, 0);
    
        console.log('Active session:', $scope.active_session, 'Last session:', last_session);
        
    
        if ($scope.active_session == last_session) {
            console.log('Active session is equal to last session. Updating approvers...');
            $scope.data_approver.forEach(item => {
                if (item.id_session == last_session) { 
                    item.approver_action_type = null;
                    item.action_review = null;
                    item.approver_type = null;
                    item.action_status = null;
                    item.comment = null;
                    item.date_review = null;
                    item.date_review_show = null;
                    item.action_change = 1;
                    item.action_type = 'update';
                    
                    // Log ข้อมูลแต่ละ item หลังจากการอัปเดต
                    console.log('Updated approver:', item);
                }
            });

            
            let uniqueApprovers = new Set();
            let itemsToRemove = []; 
            
            $scope.data_drawing_approver.forEach(item => {
                if (item.id_session == last_session) { 
                    item.document_file_name = null;
                    item.document_file_path = null;
                    item.document_file_size = null;
                    item.action_change = 1;
                    item.action_type = 'update';
                    
                    if (uniqueApprovers.has(item.id_approver)) {
                        item.action_change = 1;
                        item.action_type = 'delete';
                        $scope.data_drawing_approver_delete.push(item);
                        
                        itemsToRemove.push(item);
                        console.log('Marked duplicate approver for removal:', item);
                    } else {
                        uniqueApprovers.add(item.id_approver);
                    }
                }
            });
            
            $scope.data_drawing_approver = $scope.data_drawing_approver.filter(item => !itemsToRemove.includes(item));
            
            console.log(" $scope.data_drawing_approver", $scope.data_drawing_approver)
            console.log(" $scope.data_approver", $scope.data_approver)

        } else {
            console.log('Active session is not equal to last session.');
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

            if ($scope.selectedItemNodeView.seq == 0) {
                if ($scope.data_node.length > 0) {
                    $scope.selectedItemNodeView.seq = $scope.data_node[0].seq;
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


    //set form
    if(true){
        function setup_isDisabledPHAStatus(header){
            if (header.pha_status > 12) {
                console.log(`PHA status: ${header.pha_status} isDisableStatus: true`)
                return true
            }
            console.log(`PHA status: ${header.pha_status} isDisableStatus: false`)
            return false
        }
    
        function setup_isApproveReject(header){
            if (header.approve_status == 'reject' && header.pha_status == 22) {
                return true
            }
            return false
        }
    
        function setup_isEditWorksheet(params){
            if (params == 'edit') {
                return true
            }
            return false
        }        
        function set_data_general() {

            if (($scope.data_general[0].id_ram + '') == '') {
                $scope.data_general[0].id_ram = 5;
            }
    
            if ($scope.data_general[0].target_start_date !== null) {
                const startDateParts = $scope.data_general[0].target_start_date.split('T')[0].split("-");
                const year = parseInt(startDateParts[0]);
                $scope.data_general[0].target_start_date = new Date(year, parseInt(startDateParts[1]) - 1, parseInt(startDateParts[2]));
            }
    
    
            if ($scope.data_general[0].target_end_date !== null) {
                const endDateParts = $scope.data_general[0].target_end_date.split('T')[0].split("-");
                const year = parseInt(endDateParts[0]);
                $scope.data_general[0].target_end_date = new Date(year, parseInt(endDateParts[1]) - 1, parseInt(endDateParts[2]));
    
            }
            
            if ($scope.data_general[0].actual_start_date !== null) {
                const startDateParts = $scope.data_general[0].actual_start_date.split('T')[0].split("-");
                const year = parseInt(startDateParts[0]);
                $scope.data_general[0].actual_start_date = new Date(year, parseInt(startDateParts[1]) - 1, parseInt(startDateParts[2]));
            }
    
            if ($scope.data_general[0].actual_end_date !== null) {
                const endDateParts = $scope.data_general[0].actual_end_date.split('T')[0].split("-");
                const year = parseInt(endDateParts[0]);
                $scope.data_general[0].actual_end_date = new Date(year, parseInt(endDateParts[1]) - 1, parseInt(endDateParts[2]));
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
            if (_functoArr.length > 0) {
                $scope.data_general[0].functional_location_audition = _functoArr;
            }
            // set unit no
            var name_unitno = $filter('filter')($scope.master_unit_no, function (item) { 
                return (item.id == $scope.data_general[0].id_unit_no); 
            })[0];
            if(name_unitno) $scope.data_general[0].unit_no_name = name_unitno.name
    
            return;
        }
        function set_data_approver() {
            if (true) {
                var arr_approver = $scope.data_approver;
                if (arr_approver.length > 0) {
    
                    for (var w = 0; w < arr_approver.length; w++) {
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
                                newInput.recommendations_no = null;
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
    
                    //running_recommendations_no();
    
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
                if (arr_worksheet.length > 0) {
    
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
    
        }

        function computeRowspan() {
            if (Array.isArray($scope.data_nodeworksheet) && $scope.data_nodeworksheet.length > 0) {
                $scope.rowspanMap = {};
                $scope.data_nodeworksheet.forEach(function(item) {
    
                  var key = 'causes' + item.id_node + '-' + item.deviations_no + '-' + item.causes_no;
                  $scope.rowspanMap[key] = $scope.data_nodeworksheet.filter(function(entry) {
                    return entry.id_node === item.id_node &&
                           entry.deviations_no === item.deviations_no &&
                           entry.causes_no === item.causes_no 
                  }).length;
    
                  var key = 'consequences' + item.id_node + '-' + item.deviations_no + '-' + item.causes_no + '-' + item.consequences_no;
                  $scope.rowspanMap[key] = $scope.data_nodeworksheet.filter(function(entry) {
                    return entry.id_node === item.id_node &&
                           entry.deviations_no === item.deviations_no &&
                           entry.causes_no === item.causes_no &&
                           entry.consequences_no === item.consequences_no
                  }).length;
    
                  var key = item.id_node + '-' + item.deviations_no + '-' + item.causes_no + '-' + item.consequences_no + '-' + item.category_no;
                  $scope.rowspanMap[key] = $scope.data_nodeworksheet.filter(function(entry) {
                    return entry.id_node === item.id_node &&
                           entry.deviations_no === item.deviations_no &&
                           entry.causes_no === item.causes_no &&
                           entry.consequences_no === item.consequences_no &&
                           entry.category_no === item.category_no
                  }).length;
    
                  var key = 'category' + item.id_node + '-' + item.deviations_no + '-' + item.causes_no + '-' + item.consequences_no + '-' + item.category_no;
                  $scope.rowspanMap[key] = $scope.data_nodeworksheet.filter(function(entry) {
                    return entry.id_node === item.id_node &&
                           entry.deviations_no === item.deviations_no &&
                           entry.causes_no === item.causes_no &&
                           entry.consequences_no === item.consequences_no &&
                           entry.category_no === item.category_no
                  }).length;
    
                  var key = 'deviations' + item.id_node + '-' + item.deviations_no ;
                  $scope.rowspanMap[key] = $scope.data_nodeworksheet.filter(function(entry) {
                    return entry.id_node === item.id_node &&
                           entry.deviations_no === item.deviations_no
                  }).length;
    
    
                });                
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

    function showRemoveModal(){
        $('#removeModal').modal({
            backdrop: 'static',
            keyboard: false
        }).modal('show');
    }

    $scope.triggerRemove = function(data,item, index, type) {

        if (seq !== null && index !== null) {
            $scope.dataToRemove = data;
            $scope.indexToRemove = index;
            $scope.typeToRemove = type;

            if(type == 'SubAreasList' || type == 'HazardList' || type == 'CommentOfWorksheet' || type == 'HealthHazard'){
                var list = item;
                $scope.dataListToRemove = list;
            }else{
                var seq = item;
                $scope.seqToRemove = seq;
            }
        
            const actionMap = {
                'session': () => {
                    let shouldShowModal = false;
                    for (let i = 0; i < $scope.data_memberteam.length; i++) {
                        const member = $scope.data_memberteam[i];
                        if (member.id_session === seq && member.user_displayname !== null) {
                            shouldShowModal = true;
                            break;
                        }
                    }
        
                    for (let i = 0; i < $scope.data_approver.length; i++) {
                        const approver = $scope.data_approver[i];
                        if (approver.id_session === seq && approver.user_displayname !== null) {
                            shouldShowModal = true;
                            break;
                        }
                    }
        
                    if (shouldShowModal) {
                        showRemoveModal();
                    } else {
                        $scope.removeDataSession($scope.seqToRemove, $scope.indexToRemove);
                    }
                },
                'DrawingDoc': () => {
                    if (data.document_file_name !== null || data.document_file_path !== null || data.descriptions !== null || data.document_name !== null) {
                        showRemoveModal();
                    } else {
                        $scope.removeDrawingDoc($scope.seqToRemove, $scope.indexToRemove);
                    }
                },
                'nodelist': () => {
                    if(data.design_conditions !== null || data.design_intent !== null || data.node !== null || data.node_boundary !== null || data.operating_conditions !== null){
                        showRemoveModal();
                    }else{
                        $scope.removeDataNodeList($scope.seqToRemove, $scope.indexToRemove);
                    }
                },
                'NodeDrawing': () => {
                    if(data.descriptions !== null || data.id_drawing !== null ){
                        showRemoveModal();
                    }else{
                        $scope.removeDataNodeDrawing($scope.seqToRemove, $scope.indexToRemove);
                    }    
                },
                'default': () => {
                    showRemoveModal();
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
                'nodelist': () => $scope.removeDataNodeList($scope.seqToRemove, $scope.indexToRemove),
                'NodeDrawing': () => $scope.removeDataNodeDrawing($scope.seqToRemove, $scope.indexToRemove),
                'uploadfile': () => $scope.clearFileName($scope.seqToRemove),
            };
        
            (actionMap[$scope.typeToRemove] || function() {
                console.error('Unknown type:', $scope.typeToRemove);
            })();
        
            $('#removeModal').modal('hide');
        } else {
            $('#removeModal').modal('hide');
        }
        
    };
    
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

        $scope.MaxSeqDataSession = xValues;
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

                arrmember[i].seq = seq;
                arrmember[i].id = $scope.selectdata_memberteam;

                $scope.data_memberteam.push(arrmember[i]);
                $scope.selectdata_memberteam += 1;
            }
        }
        if (true) {
            var arr_copy = [];
            angular.copy($scope.data_approver, arr_copy);
            var arrmember = $filter('filter')(arr_copy, function (item) { return (item.id_session == seq); });
            for (let i = 0; i < arrmember.length; i++) {
                arrmember[i].id_session = Number(id_session);
                arrmember[i].action_type = 'insert';
                arrmember[i].action_change = 1;

                arrmember[i].seq = seq;
                arrmember[i].id = $scope.selectdata_approver;

                $scope.data_approver.push(arrmember[i]);
                $scope.selectdata_approver += 1;
            }
        }


    }
    $scope.removeDataSession = function (seq, index) {
        var arrdelete = $filter('filter')($scope.data_session, function (item) {
            return (item.seq == seq);
        });

        if (arrdelete.length > 0) { $scope.data_session_delete.push(arrdelete[0]); }

        $scope.data_session = $filter('filter')($scope.data_session, function (item) {
            return (item.seq != arrdelete[0].seq);
        });
        if ($scope.data_session.length == 0) {
            $scope.addDataSession();
        }
        //if delete row 1 clear to null
        if (!$scope.data_session[0].meeting_date &&
            !$scope.data_session[0].meeting_end_time &&
            !$scope.data_session[0].meeting_start_time_hh &&
            !$scope.data_session[0].meeting_start_time_mm &&
            !$scope.data_session[0].meeting_end_time_hh &&
            !$scope.data_session[0].meeting_end_time_mm 
        ) {
            if ($scope.data_session.length == 1 || $scope.data_session.no == 1) {
                var keysToClear = ['meeting_date', 'meeting_end_time', 'meeting_start_time'];
                //meeting_start_time_hh,meeting_start_time_mm,meeting_end_time_hh,meeting_end_time_mm
                var keysToClear = ['meeting_date', 'meeting_end_time', 'meeting_end_time', 'meeting_start_time_hh', 'meeting_start_time_mm', 'meeting_end_time_hh', 'meeting_end_time_mm'];
    
                keysToClear.forEach(function (key) {
                    $scope.data_session[0][key] = null;
                });
    
                $scope.data_session[0].no = 1;
            }
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
        running_no_level1($scope.data_drawing, iNo, index);

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
        running_no_level1($scope.data_drawing, null, index);

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

        running_no_level1_lv1($scope.data_node, iNo, index, newInput);

        $scope.selectdata_node = xValues;

        //add NodeDrawing  
        $scope.addDataNodeDrawing("", $scope.selectdata_node);

    
        //add NodeDrawing  
        $scope.AddDataGuideWords(false);


        $scope.data_nodeworksheet.forEach(node => {
            console.log(node.id_node);
        });
        
        return;

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
                            newInput.recommendations_no = null;
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
        var iNo = 1; if (arr.length > 0) { iNo = arr[0].no + 1; }

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

        //add NodeDrawing  
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

    
        //copy worksheet
        if ($scope.data_nodeworksheet != null) {
            var arr_check = $filter('filter')($scope.data_nodeworksheet, function (item) {
                return (item.id_node == xValues);
            });
            if (arr_check.length > 0) { return; }
        }

        var arr_copy = [];
        angular.copy($scope.data_nodeworksheet, arr_copy);
        var arrdata = $filter('filter')(arr_copy, function (item) { return (item.id_node == seq); });
        for (let i = 0; i < arrdata.length; i++) {

            $scope.MaxSeqdata_nodeworksheet = Number($scope.MaxSeqdata_nodeworksheet) + 1;
            var xMaxSeqdata_nodeworksheet = $scope.MaxSeqdata_nodeworksheet;

            arrdata[i].id_node = Number(id_node);
            arrdata[i].seq_node = Number(id_node);
            arrdata[i].action_type = 'insert';
            arrdata[i].action_change = 1;

            arrdata[i].seq = xMaxSeqdata_nodeworksheet;
            arrdata[i].id = xMaxSeqdata_nodeworksheet;

            $scope.data_nodeworksheet.push(arrdata[i]);
        }
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
        var arrdelete = $filter('filter')($scope.data_nodedrawing, function(item) {
            return (item.seq == seq && item.action_type == 'update');
        });
        if (arrdelete.length > 0) {
            $scope.data_nodedrawing_delete.push(arrdelete[0]);
        }

        // Step 1: Find the node with the given seq to get the id_node
        var targetNode = $filter('filter')($scope.data_nodedrawing, function(item) {
            return item.seq === seq;
        })[0];
        
        
        if (targetNode) {
            var id_node = targetNode.id_node;
        
            var sameIdNodes = $filter('filter')($scope.data_nodedrawing, function(item) {
                return item.id_node === id_node;
            });
        
            if (sameIdNodes.length > 1) {

                $scope.data_nodedrawing = $filter('filter')($scope.data_nodedrawing, function(item) {
                    return item.seq !== seq;
                });

            } else if (sameIdNodes.length === 1) {

                $scope.data_nodedrawing = $filter('filter')($scope.data_nodedrawing, function(item) {
                    if (item.seq === seq) {
                        item.page_end_first = null;
                        item.page_end_second = null;
                        item.page_end_third = null;
                        item.page_start_first = null;
                        item.page_start_second = null;
                        item.page_start_third = null;
                        item.id_drawing = null;
                    }
                    return true;  
                });
            }
        
        }

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
                            newInput.deviations = arr[i].deviations_no;
                            newInput.guidewords_no = arr[i].guidewords_no;
                            newInput.recommendations_no = null;

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
        var flow_role_type = $scope.flow_role_type;

        $.ajax({
            url: url_ws + "Flow/set_master_ram",
            data: '{"user_name":"' + user_name + '","row_type":"' + flow_role_type + '"'
                + ',"json_ram_master":' + JSON.stringify(json_ram_master)
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
        $scope.selectedItemNodeView.seq = seq;
        console.log($scope);
        try {
            apply();
        } catch { }
    };

    $scope.adddata_nodeworksheet_lv1 = function (row_type, item, index) {
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
        var seq_recommendations = item.seq_recommendations;

        var index_rows = Number(item.index_rows);
        var no = Number(item.no);
        var causes_no = Number(item.causes_no);
        var consequences_no = Number(item.consequences_no);
        var category_no = Number(item.category_no);
        var recommendations_no = Number(item.recommendations_no);;

        var guidewords = item.guidewords;
        var deviations = item.deviations;
        var guidewords_no = item.guidewords_no;

        var arr_def = [];
        angular.copy($scope.data_nodeworksheet, arr_def);
        //row now //where we click at cuase number?
        var iNo = no;
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
        } else if (row_type == 'recommendations') {
            var arr = $filter('filter')(arr_def, function (_item) {
                return (_item.no >= no && _item.id_node == seq_node
                    && _item.seq_guide_word == seq_guide_word
                    && _item.seq_causes == seq_causes
                    && _item.seq_consequences == seq_consequences
                    && _item.seq_category == seq_category
                    && _item.seq_recommendations == seq_recommendations);
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
        }
        if (row_type == "consequences") {
            $scope.MaxSeqdata_nodeworksheetConsequences = Number($scope.MaxSeqdata_nodeworksheetConsequences) + 1;
            seq_consequences = $scope.MaxSeqdata_nodeworksheetConsequences;

            //กรณีที่เป็น consequences ให้ +1
            consequences_no += 1;
            category_no = 1;
        }
        if (row_type == "category") {
            $scope.MaxSeqdata_nodeworksheetCat = Number($scope.MaxSeqdata_nodeworksheetCat) + 1;
            seq_category = $scope.MaxSeqdata_nodeworksheetCat;

            //กรณีที่เป็น cat ให้ +1
            category_no += 1;
            recommendations_no = 1;
            
        }
        if (row_type == "recommendations") {
            $scope.MaxSeqdata_nodeworksheetrecommendations = Number($scope.MaxSeqdata_nodeworksheetrecommendations) + 1;
            seq_recommendations = $scope.MaxSeqdata_nodeworksheetrecommendations;

            //กรณีที่เป็น cat ให้ +1
            recommendations_no += 1;
            
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
        newInput.seq_recommendations = seq_recommendations;

        newInput.index_rows = (index_rows + 0.5);
        newInput.no = (no + 0.5);
        newInput.no1 = null;
        newInput.causes_no = causes_no;
        newInput.consequences_no = consequences_no;
        newInput.category_no = category_no;
        newInput.recommendations_no = null;

        newInput.action_type = 'insert';
        newInput.action_change = 1;
        newInput.action_status = 'Open';

        
        console.log(newInput)
        //copy detail row befor
        if (row_type == "causes") {
            newInput.deviations_no = item.deviations_no;
            newInput.deviations = item.deviations;
        
            newInput.id_guide_word = item.id_guide_word;
            newInput.guidewords_no = item.guidewords_no;
            newInput.guidewords = item.guidewords;     
        
        }
        else if (row_type == "consequences") {
            var data = $scope.data_nodeworksheet.filter(function(item) {
                return item.causes_no == causes_no 
            });
        
            newInput.deviations_no = item.deviations_no;
            newInput.deviations = item.deviations;
        
            newInput.id_guide_word = item.id_guide_word;
            newInput.guidewords_no = item.guidewords_no;
            newInput.guidewords = item.guidewords;     
        
        
            newInput.causes_no = item.causes_no;
        
            newInput.causes = item.causes;
        
        }
        else if (row_type == 'category') {
            var data = $scope.data_nodeworksheet.filter(function(item) {
                return item.causes_no == causes_no && item.consequences_no == consequences_no ;
            });
        
            newInput.deviations_no = item.deviations_no;
            newInput.deviations = item.deviations;
        
            newInput.id_guide_word = item.id_guide_word;
            newInput.guidewords_no = item.guidewords_no;
            newInput.guidewords = item.guidewords;     
        
            newInput.causes_no = item.causes_no;
        
            newInput.causes = item.causes;
            newInput.consequences = item.consequences;
        }
        else if(row_type == 'recommendations'){
        
            newInput.deviations_no = item.deviations_no;
            newInput.deviations = item.deviations;
        
            newInput.id_guide_word = item.id_guide_word;
            newInput.guidewords_no = item.guidewords_no;
            newInput.guidewords = item.guidewords;     
        
            newInput.causes_no = item.causes_no;
            newInput.consequences_no = item.consequences_no;
            newInput.category_no = item.category_no;
        
            newInput.causes = item.causes;
            newInput.consequences = item.consequences;
            newInput.category = item.category;
        
        }


        console.log("newInput",)


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

        //running_recommendations_no();

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


        //updaterow span
        $scope.$evalAsync(function() {
            computeRowspan();  // Safely schedule this to update the UI
        });
        
        

        apply();
    }
    $scope.adddata_nodeworksheet = function (row_type, item, index) {

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
        var seq_recommendations = item.seq_recommendations;

        var index_rows = Number(item.index_rows);
        var no = Number(item.no);
        var causes_no = Number(item.causes_no);
        var consequences_no = Number(item.consequences_no);
        var category_no = Number(item.category_no);
        var recommendations_no = Number(item.recommendations_no);

        var guidewords = item.guidewords;
        var deviations = item.deviations;
        var guidewords_no = item.guidewords_no;

        var arr_def = [];
        angular.copy($scope.data_nodeworksheet, arr_def);
        //row now //where we click at cuase number?
        var iNo = no;
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
        } else if (row_type == 'recommendations') {
            var arr = $filter('filter')(arr_def, function (_item) {
                return (_item.no >= no && _item.id_node == seq_node
                    && _item.seq_guide_word == seq_guide_word
                    && _item.seq_causes == seq_causes
                    && _item.seq_consequences == seq_consequences
                    && _item.seq_category == seq_category
                    && _item.seq_recommendations == seq_recommendations);
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
        }
        if (row_type == "consequences") {
            $scope.MaxSeqdata_nodeworksheetConsequences = Number($scope.MaxSeqdata_nodeworksheetConsequences) + 1;
            seq_consequences = $scope.MaxSeqdata_nodeworksheetConsequences;

            //กรณีที่เป็น consequences ให้ +1
            consequences_no += 1;
            category_no = 1;
        }
        if (row_type == "category") {
            $scope.MaxSeqdata_nodeworksheetCat = Number($scope.MaxSeqdata_nodeworksheetCat) + 1;
            seq_category = $scope.MaxSeqdata_nodeworksheetCat;

            //กรณีที่เป็น cat ให้ +1
            category_no += 1;
            //recommendations_no = 1;
            
        }
        if (row_type == "recommendations") {
            $scope.MaxSeqdata_nodeworksheetrecommendations = Number($scope.MaxSeqdata_nodeworksheetrecommendations) + 1;
            seq_recommendations = $scope.MaxSeqdata_nodeworksheetrecommendations;

            //กรณีที่เป็น cat ให้ +1
            recommendations_no += 1;
            
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

        newInput.index_rows = index_rows;
        newInput.no = (no + 0.5);
        newInput.no1 = null;
        newInput.causes_no = causes_no;
        newInput.consequences_no = consequences_no;
        newInput.category_no = category_no;
        newInput.recommendations_no = recommendations_no;

        newInput.action_type = 'insert';
        newInput.action_change = 1;
        newInput.action_status = 'Open';

        
        //copy detail row befor
        if (row_type == "causes") {
            newInput.deviations_no = item.deviations_no;
            newInput.deviations = item.deviations;
        
            newInput.id_guide_word = item.id_guide_word;
            newInput.guidewords_no = item.guidewords_no;
            newInput.guidewords = item.guidewords;     
        
        }
        else if (row_type == "consequences") {
            var data = $scope.data_nodeworksheet.filter(function(item) {
                return item.causes_no == causes_no 
            });
        
            newInput.deviations_no = item.deviations_no;
            newInput.deviations = item.deviations;
        
            newInput.id_guide_word = item.id_guide_word;
            newInput.guidewords_no = item.guidewords_no;
            newInput.guidewords = item.guidewords;     
        
        
            newInput.causes_no = item.causes_no;
        
            newInput.causes = item.causes;
        
        }
        else if (row_type == 'category') {
            var data = $scope.data_nodeworksheet.filter(function(item) {
                return item.causes_no == causes_no && item.consequences_no == consequences_no ;
            });
        
            newInput.deviations_no = item.deviations_no;
            newInput.deviations = item.deviations;
        
            newInput.id_guide_word = item.id_guide_word;
            newInput.guidewords_no = item.guidewords_no;
            newInput.guidewords = item.guidewords;     
        
            newInput.causes_no = item.causes_no;
        
            newInput.causes = item.causes;
            newInput.consequences = item.consequences;
        }
        else if(row_type == 'recommendations'){
        
            newInput.deviations_no = item.deviations_no;
            newInput.deviations = item.deviations;
        
            newInput.id_guide_word = item.id_guide_word;
            newInput.guidewords_no = item.guidewords_no;
            newInput.guidewords = item.guidewords;     
        
            newInput.causes_no = item.causes_no;
            newInput.consequences_no = item.consequences_no;
            newInput.category_no = item.category_no;
        
            newInput.causes = item.causes;
            newInput.consequences = item.consequences;
            newInput.category = item.category;
        
        }


        insertNewData(newInput,index);
        $scope.data_nodeworksheet.forEach(function(item, index) {
            item.index_rows = index;
            item.action_change = 1;
        });


        //updaterow span
        $scope.$evalAsync(function() {
            computeRowspan();  // Safely schedule this to update the UI
        });
        
        

        apply();
    }    

    function ensureUnique(dataList,targetIdList,type) {
    
        if(type === 'recom'){
            let count = 1;
    
            dataList.forEach((item, index) => {
    
                if (item.recommendations !== null && item.recommendations !== '') {
                    item.recommendations_action_no = count; 
                    count++; 
                }
            });
        }else{
            let previous = {};
            dataList.forEach((item, index) => {
                
                if(item.id_node === targetIdList) {

                    if(previous.guidewords_no === item.guidewords_no){
                        if (previous.causes_no === item.causes_no && type !== 'recom') {
            
                            if (previous.causes_no >= item.causes_no && item.row_type === 'causes') {
                                item.causes_no = previous.causes_no + 1;
                            }
                
                            if (previous.consequences_no >= item.consequences_no && item.row_type === 'consequences') {
                                item.consequences_no = previous.consequences_no + 1;
                            }
                
                            if (previous.consequences_no === item.consequences_no && previous.category_no >= item.category_no && 
                                (item.row_type === 'category' || item.row_type === 'consequences')) {
                
                                if (previous.seq_category === item.seq_category) {
                                    item.category_no = previous.category_no;
                                } else {
                                    item.category_no = previous.category_no + 1;
                                }
                            }
                
                            if (previous.consequences_no === item.consequences_no && previous.category_no === item.category_no && 
                                previous.recommendations_no >= item.recommendations_no && 
                                (item.row_type === 'consequences' || item.row_type === 'category' || item.row_type === 'recommendations')) {
                                item.recommendations_no = previous.recommendations_no + 1;                          
                            }

                        }
                    }
                                
                    previous = { ...item };
            
                } else {
                    previous = {};
                }
            });
            
        }
    }
    
    function insertNewData(newData,data_index) {    
    
        let index = -1;
    
        for (let i = 0; i < $scope.data_nodeworksheet.length; i++) {
            const item = $scope.data_nodeworksheet[i];
            
            
            if (item.id_node !== newData.id_node) {
                continue;
            }

            if (item.guidewords_no !== newData.guidewords_no) {
                continue;
            }
            
            // General condition to update the index for different row types
            if ( newData.row_type !== 'recommendations' &&
                ((item.causes_no > newData.causes_no) ||
                (newData.row_type === 'consequences' && item.causes_no === newData.causes_no && item.consequences_no >= newData.consequences_no) ||
                (item.causes_no === newData.causes_no && item.consequences_no === newData.consequences_no && item.category_no === newData.category_no 
                && item.recommendations_no === newData.recommendations_no && item.category_no === newData.category_no))) {
                index = i;

                break;
            }
            
            // Specific conditions for 'category' row type
            /*if (newData.row_type === 'consequences' && item.guidewords_no === newData.guidewords_no 
                && item.causes_no === newData.causes_no) {
                //index = item.category_no >= newData.category_no ? i : i + 1;
                //break;

                console.log("item.causes_no ", item.causes_no, "newData.causes_no", newData.causes_no);
                console.log("item.consequences_no ", item.consequences_no, "newData.consequences_no", newData.consequences_no);
                console.log("item.category_no ", item.category_no, "newData.category_no", newData.category_no);


                const set_category = $scope.data_nodeworksheet.filter(data => 
                    data.guidewords_no === item.guidewords_no && 
                    data.causes_no === item.causes_no && 
                    data.consequences_no === item.consequences_no 
                );
    
                console.log("set_category",set_category)
                for (let j = 0; j < set_category.length; j++) {
                    if (set_category[j].recommendation_no) {
                        index = i + j + 1;
                        break;
                    }
                }
                
                if (index === -1) {
                    index = i + set_category.length + 1;
                }
                
                console.log(index)
                break;                       
            }*/
        

            // Specific conditions for 'category' row type
            if (newData.row_type === 'category' && item.guidewords_no === newData.guidewords_no 
                && item.causes_no === newData.causes_no 
                && item.consequences_no === newData.consequences_no) {
                //index = item.category_no >= newData.category_no ? i : i + 1;
                //break;


                
                console.log("item.causes_no ", item.causes_no, "newData.causes_no", newData.causes_no);
                console.log("item.consequences_no ", item.consequences_no, "newData.consequences_no", newData.consequences_no);
                console.log("item.category_no ", item.category_no, "newData.category_no", newData.category_no);

                const set_category = $scope.data_nodeworksheet.filter(data => 
                    data.guidewords_no === item.guidewords_no  &&
                    data.causes_no === item.causes_no && 
                    data.consequences_no === item.consequences_no && 
                    data.category_no === item.category_no 
                );

                console.log("set_category",set_category)
    
                for (let j = 0; j < set_category.length; j++) {
                    if (set_category[j].recommendation_no) {
                        index = i + j + 1;
                    }
                }
                console.log(set_category.length)
                
                if (index === -1) {
                    index = i + set_category.length;
                }
                
                console.log(index)
                break;                       
            }
            
            // Specific conditions for 'recommendations' row type
            if (newData.row_type === 'recommendations' && item.guidewords_no === newData.guidewords_no  
                && item.causes_no === newData.causes_no 
                && item.consequences_no === newData.consequences_no 
                && item.category_no === newData.category_no ) {

    
                const set_recommendations = $scope.data_nodeworksheet.filter(data => 
                    data.guidewords_no === item.guidewords_no  &&
                    data.causes_no === item.causes_no && 
                    data.consequences_no === item.consequences_no && 
                    data.category_no === item.category_no && 
                    data.recommendations_no === item.recommendations_no
                );
    
                for (let j = 0; j < set_recommendations.length; j++) {
                    if (set_recommendations[j].recommendation_no) {
                        index = i + j + 1;
                    }
                }
                
                if (index === -1) {
                    index = i + set_recommendations.length;
                }
                
                console.log("indexindexindexindexindexindexindexindex",index)
                break;                
            }
            
            // Specific conditions for 'category' row type
            /*if ((newData.row_type === 'category') && item.causes_no === newData.causes_no 
                && item.consequences_no === newData.consequences_no 
                && item.category_no === newData.category_no 
                && item.recommendations_no === newData.recommendations_no) {
    
                const set_category = $scope.data_nodeworksheet.filter(data => 
                    data.causes_no === item.causes_no && 
                    data.consequences_no === item.consequences_no && 
                    data.category_no === item.category_no && 
                    data.recommendations_no === item.recommendations_no && 
                    data.category_no === item.category_no
                );
                for (let j = 0; j < set_category.length; j++) {
                    if (set_category[j].recommendation_no) {
                        index = i + j + 1;
                        break;
                    }
                }
                
                if (index === -1) {
                    index = i + set_category.length;
                }
                
                console.log(index)
                break;
            }
            
            // Specific condition for 'recommendations' row type
            if (newData.row_type === 'recommendations' && item.causes_no === newData.causes_no 
                && item.consequences_no === newData.consequences_no && item.category_no === newData.category_no 
                && item.recommendations_no === newData.recommendations_no && item.category_no === newData.category_no) {
                    
                index = data_index + 1;
    
                break;
            }*/
    
        }

            
        if (index === -1) {
            index = $scope.data_nodeworksheet.length;
        }

        console.log(index)

            
        $scope.data_nodeworksheet.splice(index, 0, newData);
            
        ensureUnique($scope.data_nodeworksheet,newData.id_node);
            
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
    $scope.updateFieldItems = function(item, type) {
        //set copy data
        // for type causes same cuase no must same value 
        // for type consequences same cuase_no,consequences_no must same value 
        // for type category same cuase_no,consequences_no,category_no no must same value         
        var causes_no = Number(item.causes_no);
        var consequences_no = Number(item.consequences_no);
        var category_no = Number(item.category_no);
        
        var id_node = Number(item.id_node);
        var id_guide_word = Number(item.id_guide_word);
    
        var newValue = {};
    
        switch (type) {
            case 'causes':
                newValue.causes = item.causes;
                break;
            case 'consequences':
                newValue.causes = item.causes;
                newValue.consequences = item.consequences;
                break;
            case 'category':
                newValue.causes = item.causes;
                newValue.consequences = item.consequences;
                newValue.category = item.category;
                break;
            case 'recommendations':
                newValue.causes = item.causes;
                newValue.consequences = item.consequences;
                newValue.ram_befor_likelihood = item.ram_befor_likelihood;
                newValue.ram_befor_risk = item.ram_befor_risk;
                newValue.ram_befor_security = item.ram_befor_security;
                newValue.ram_after_likelihood = item.ram_after_likelihood;
                newValue.ram_after_risk = item.ram_after_risk;
                newValue.ram_after_risk_action = item.ram_after_risk_action;
                newValue.existing_safeguards = item.existing_safeguards;
                newValue.major_accident_event = item.major_accident_event;
                
                //newValue.recommendations = item.recommendations;
                break;
            default:
                console.error('Unknown update type:', type);
                return;
        }
    
        angular.forEach($scope.data_nodeworksheet, function(currentItem) {
            var isMatching = false;
    
            if(currentItem.id_node === id_node && currentItem.id_guide_word === id_guide_word){
                if (type === 'causes') {
                    isMatching = (Number(currentItem.causes_no) === causes_no);
                } else if (type === 'consequences') {
                    isMatching = (Number(currentItem.causes_no) === causes_no && Number(currentItem.consequences_no) === consequences_no);
                } else if (type === 'category') {
                    isMatching = (Number(currentItem.causes_no) === causes_no && Number(currentItem.consequences_no) === consequences_no && Number(currentItem.category_no) === category_no);
                } else if (type === 'recommendations') {
                    isMatching = (Number(currentItem.causes_no) === causes_no && Number(currentItem.consequences_no) === consequences_no && Number(currentItem.category_no) === category_no);
                }
        
                if (isMatching) {
                    if (newValue.causes !== undefined) currentItem.causes = newValue.causes;
                    if (newValue.consequences !== undefined) currentItem.consequences = newValue.consequences;
                    if (newValue.category !== undefined) currentItem.category = newValue.category;
                }
            }

        });

    };

    $scope.removeDataNodeWorksheet = function (row_type, item, index) {

        var seq = item.seq;
        var seq_node = item.seq_node;
        var id_node = item.id_node;
        var seq_guide_word = item.seq_guide_word;
        var seq_causes = item.seq_causes;
        var seq_consequences = item.seq_consequences;
        var seq_category = item.seq_category;
        var seq_recommendations = item.seq_recommendations;
        var recommendations_no = item.recommendations_no;

        var data_causes_no = item.causes_no;
        var data_consequences_no = item.consequences_no;
        var data_category_no = item.category_no;


        //กรณีที่เป็นรายการเดียวไม่ต้องลบ ให้ cleare field 
        const deletionCondition = item => {
            return (row_type === "consequences" && item.seq_node === seq_node && item.seq_guide_word === seq_guide_word && item.seq_consequences === seq_consequences && item.seq_causes === seq_causes) ||
                (row_type === "category" && item.seq_node === seq_node && item.seq_guide_word === seq_guide_word && item.seq_category === seq_category && item.seq_consequences === seq_consequences && item.seq_causes === seq_causes) ||
                (row_type === "recommendations" && item.seq_node === seq_node && item.seq_guide_word === seq_guide_word && item.recommendations_no === recommendations_no && item.seq_category === seq_category && item.seq_consequences === seq_consequences && item.seq_causes === seq_causes) ;
        };

        $scope.data_del = [];
        //Delete row select and upper row
        if (item.row_type !== 'causes' ) {

            //normal case ที่ row type === item.row_type
            if(item.row_type === row_type){
                markItemsForDeletion(deletionCondition);
                deleteItems(deletionCondition);
            }else{
                //will clear data after this row type
                console.log("will clear data after this row type?")
            }


        }else if (item.row_type === 'causes' ){
            if(row_type == "causes"){

                let firstItemToKeep = null;  // เก็บรายการแรกเพื่อใช้สำหรับการอัปเดต
                for (let i = $scope.data_nodeworksheet.length - 1; i >= 0; i--) {
                    let item = $scope.data_nodeworksheet[i];
            
                    if (item.seq_node == seq_node &&
                        item.seq_guide_word == seq_guide_word &&
                        item.seq_causes == seq_causes
                    ) {
                        // ตรวจสอบว่ามีลูกข้อมูลหรือไม่
                        let hasNextSubSystem = false;
            
                        for (let j = i + 1; j < $scope.data_nodeworksheet.length; j++) {
                            let nextItem = $scope.data_nodeworksheet[j];
            
                            // ตรวจสอบว่า nextItem เป็นลูกของ item หรือไม่ โดยตรวจสอบ seq_causes + 1
                            if (nextItem.seq_node == seq_node &&
                                nextItem.seq_guide_word == seq_guide_word &&
                                nextItem.causes_no == (item.causes_no + 1)) {
                                hasNextSubSystem = true;
                                break;
                            }
                        }
            
                        // ถ้ามีลูกข้อมูล ให้เก็บข้อมูลทั้งหมดใน data_nodeworksheet_delete และ data_del
                        if (hasNextSubSystem) {
                            $scope.data_nodeworksheet_delete.push(item);
                            $scope.data_del.push(item);
                        } else {
                            // ถ้าไม่มีลูกข้อมูล
                            if (!firstItemToKeep && data_causes_no == 1) {
                                // เก็บรายการแรกไว้สำหรับการอัปเดต
                                firstItemToKeep = item;
                                console.log("Keeping first item for update:", item);
                            } else {
                                // ถ้าพบรายการอื่นๆ ให้ลบข้อมูล (push ลง data_nodeworksheet_delete)
                                $scope.data_nodeworksheet_delete.push(item);
                                $scope.data_del.push(item);

                            }
                        }
                    }
                }
            
                if (firstItemToKeep) {
                    set_data_worksheet(firstItemToKeep);
                }
            
                // ลบข้อมูลจาก data_nodeworksheet ที่เก็บไว้ใน data_nodeworksheet_delete
                deleteMarkedItems()



                // อัปเดตข้อมูลที่เหลือ โดยเปลี่ยน row_type ของ seq_consequences ที่มากกว่า 1 แต่แค่ชั้นถัดไป (เช่น seq_consequences == 2)
                for (let i = 0; i < $scope.data_nodeworksheet.length; i++) {
                    let item = $scope.data_nodeworksheet[i];

                        // ถ้า seq_consequences == 2 ต้องเปลี่ยน row_type จาก consequences เป็น causes
                    if (item.seq_node == seq_node &&
                        item.seq_guide_word == seq_guide_word &&
                        item.seq_causes == seq_causes && 
                        item.causes_no == (data_causes_no + 1)) {
                        if (item.row_type === 'consequences') {
                            item.row_type = 'causes';
                        }
                    }
                }   
                
            }
            else if (row_type == "consequences") {

                for (let i = $scope.data_nodeworksheet.length - 1; i >= 0; i--) {
                    let item = $scope.data_nodeworksheet[i];
            
                    // ลบข้อมูลที่ seq_consequences = 1
                    if ( item.seq_node == seq_node && item.seq_guide_word == seq_guide_word &&item.seq_causes == seq_causes && item.seq_consequences == seq_consequences) {
            
                        // ตรวจสอบว่ามีลูกข้อมูล (next item) หรือไม่
                        let hasNextSubSystem = false;
            
                        for (let j = i + 1; j < $scope.data_nodeworksheet.length; j++) {
                            let nextItem = $scope.data_nodeworksheet[j];
                            
                            // ตรวจสอบว่า nextItem เป็นลูกของ item หรือไม่
                            if (nextItem.seq_node == seq_node &&
                                nextItem.seq_guide_word == seq_guide_word &&
                                nextItem.seq_causes == seq_causes && 
                                nextItem.consequences_no == (item.consequences_no + 1)) {
                                hasNextSubSystem = true;
                                break;
                            }
                        }
            
                        // ถ้ามี next item.consequences_no => push into data_nodeworksheet_delete
                        if (hasNextSubSystem) {
                            $scope.data_nodeworksheet_delete.push(item); 
                            $scope.data_del.push(item); 
                        } else {
                            // ถ้าไม่มีลูกข้อมูล และ item.row_type ไม่ใช่ 'causes' => push into data_nodeworksheet_delete
                            if (item.row_type !== 'causes') {
                                $scope.data_nodeworksheet_delete.push(item); 
                                $scope.data_del.push(item); 

                            } else {
                                console.log("Cannot remove item because it's a causes:", item);
                            }
                        }
                    }
                }
            
                // ลบข้อมูลจาก data_nodeworksheet ที่เก็บไว้ใน data_nodeworksheet_delete
                deleteMarkedItems()



                // อัปเดตข้อมูลที่เหลือ โดยเปลี่ยน row_type ของ seq_consequences ที่มากกว่า 1 แต่แค่ชั้นถัดไป (เช่น seq_consequences == 2)
                for (let i = 0; i < $scope.data_nodeworksheet.length; i++) {
                    let item = $scope.data_nodeworksheet[i];

                        // ถ้า seq_consequences == 2 ต้องเปลี่ยน row_type จาก consequences เป็น causes
                    if (item.id_node == id_node &&
                        item.seq_guide_word == seq_guide_word &&
                        item.seq_causes == seq_causes && 
                        item.consequences_no == (data_consequences_no + 1)) {
                        if (item.row_type === 'consequences') {
                            item.row_type = 'causes';
                            console.log("Updating row_type to 'causes' for item:", item);
                        }
                    }
                }


                // after reset no
                const causes_no = item.causes_no;
                const consequences_no = item.consequences_no;

                resetNumbers('consequences_no', causes_no, consequences_no);
            } 
            else if (row_type == "category") {
                
                for (let i = $scope.data_nodeworksheet.length - 1; i >= 0; i--) {
                    let item = $scope.data_nodeworksheet[i];
            
                    // ลบข้อมูลที่ seq_consequences = 1
                    if (item.seq_node == seq_node &&
                        item.seq_guide_word == seq_guide_word &&
                        item.seq_causes == seq_causes && 
                        item.seq_consequences == seq_consequences &&
                        item.seq_category == seq_category) {
                        console.log("Marking item for deletion:", item);
            
                        // ตรวจสอบว่ามีลูกข้อมูล (next item) หรือไม่
                        let hasNextSubSystem = false;
            
                        for (let j = i + 1; j < $scope.data_nodeworksheet.length; j++) {
                            let nextItem = $scope.data_nodeworksheet[j];
                            
                            // ตรวจสอบว่า nextItem เป็นลูกของ item หรือไม่
                            if (nextItem.id_node == id_node &&
                                nextItem.seq_guide_word == seq_guide_word &&
                                nextItem.seq_causes == seq_causes && 
                                nextItem.seq_consequences == seq_consequences &&
                                nextItem.category_no == (item.category_no + 1) ) {
                                hasNextSubSystem = true;
                                break;
                            }
                        }
            
                        // ถ้ามี next item.consequences_no => push into data_nodeworksheet_delete
                        if (hasNextSubSystem) {
                            $scope.data_nodeworksheet_delete.push(item); 
                            $scope.data_del.push(item); 
                        } else {
                            // ถ้าไม่มีลูกข้อมูล และ item.row_type ไม่ใช่ 'causes' => push into data_nodeworksheet_delete
                            if (item.row_type !== 'causes') {
                                $scope.data_nodeworksheet_delete.push(item); 
                                $scope.data_del.push(item); 

                            } else {
                                console.log("Cannot remove item because it's a causes:", item);
                            }
                        }
                    }
                }

            
                // ลบข้อมูลจาก data_nodeworksheet ที่เก็บไว้ใน data_nodeworksheet_delete
                deleteMarkedItems()

                // อัปเดตข้อมูลที่เหลือ โดยเปลี่ยน row_type ของ seq_consequences ที่มากกว่า 1 แต่แค่ชั้นถัดไป (เช่น seq_consequences == 2)
                for (let i = 0; i < $scope.data_nodeworksheet.length; i++) {
                    let item = $scope.data_nodeworksheet[i];

                    // ถ้า seq_consequences == 2 ต้องเปลี่ยน row_type จาก consequences เป็น causes
                    if (item.id_node == id_node &&
                        item.seq_guide_word == seq_guide_word &&
                        item.seq_causes == seq_causes && 
                        item.seq_consequences == seq_consequences && 
                        item.category_no == (data_category_no + 1)) {
                        if (item.row_type === 'category') {
                            item.row_type = 'causes';
                            console.log("Updating row_type to 'causes' for item:", item);
                        }
                    }
                }

            }
            else if(row_type == "recommendations"){
                for (let i = $scope.data_nodeworksheet.length - 1; i >= 0; i--) {
                    let item = $scope.data_nodeworksheet[i];
            
                    // ลบข้อมูลที่ seq_consequences = 1
                    if (item.id_node == id_node &&
                        item.seq_guide_word == seq_guide_word &&
                        item.seq_causes == seq_causes && 
                        item.seq_consequences == seq_consequences &&
                        item.seq_category == seq_category &&
                        item.seq_recommendations == seq_recommendations) {
                        console.log("Marking item for deletion:", item);
            
                        // ตรวจสอบว่ามีลูกข้อมูล (next item) หรือไม่
                        let hasNextSubSystem = false;
            
                        for (let j = i + 1; j < $scope.data_nodeworksheet.length; j++) {
                            let nextItem = $scope.data_nodeworksheet[j];
                            
                            // ตรวจสอบว่า nextItem เป็นลูกของ item หรือไม่
                            if (nextItem.id_node == id_node &&
                                nextItem.seq_guide_word == seq_guide_word &&
                                nextItem.seq_causes == seq_causes && 
                                nextItem.seq_consequences == seq_consequences &&
                                nextItem.seq_category == seq_category &&
                                nextItem.recommendations_no == (item.recommendations_no + 1) ) {
                                hasNextSubSystem = true;
                                break;
                            }
                        }
            
                        // ถ้ามี next item.consequences_no => push into data_nodeworksheet_delete
                        if (hasNextSubSystem) {
                            $scope.data_nodeworksheet_delete.push(item); 
                            $scope.data_del.push(item); 
                        } else {
                            // ถ้าไม่มีลูกข้อมูล และ item.row_type ไม่ใช่ 'causes' => push into data_nodeworksheet_delete
                            if (item.row_type !== 'causes') {
                                $scope.data_nodeworksheet_delete.push(item); 
                                $scope.data_del.push(item); 

                            } else {
                                console.log("Cannot remove item because it's a causes:", item);
                            }
                        }
                    }
                }

            
                // ลบข้อมูลจาก data_nodeworksheet ที่เก็บไว้ใน data_nodeworksheet_delete
                deleteMarkedItems()

                // อัปเดตข้อมูลที่เหลือ โดยเปลี่ยน row_type ของ seq_consequences ที่มากกว่า 1 แต่แค่ชั้นถัดไป (เช่น seq_consequences == 2)
                for (let i = 0; i < $scope.data_nodeworksheet.length; i++) {
                    let item = $scope.data_nodeworksheet[i];

                    // ถ้า seq_consequences == 2 ต้องเปลี่ยน row_type จาก consequences เป็น causes
                    if (item.id_node == id_node &&
                        item.seq_guide_word == seq_guide_word &&
                        item.seq_causes == seq_causes && 
                        item.seq_consequences == seq_consequences && 
                        nextItem.seq_category == seq_category &&
                        nextItem.recommendations_no == (item.data_recommendations_no + 1) ) {
                        if (item.row_type === 'recommendations') {
                            item.row_type = 'causes';
                            console.log("Updating row_type to 'causes' for item:", item);
                        }
                    }
                }

            }
        }

        // Update numbers for all rows after deletion
        const resetType = {
                "causes": "causes_no",
                "consequences": "consequences_no",
                "category": "category_no",
        }[row_type];
                
        if (resetType) {
            resetNumbers(resetType, data_causes_no, data_consequences_no, data_category_no);
        }

        ensureUnique($scope.data_nodeworksheet,id_node);

        //updaterow span
        $scope.$evalAsync(function() {
            computeRowspan();  // Safely schedule this to update the UI
        });

    }

    function resetNumbers(field, causes_no, consequences_no, category_no) {
        $scope.data_nodeworksheet.forEach(item => {
            if ((field === 'causes_no' ? item.causes_no > causes_no : true) && 
                (field === 'consequences_no' ? item.consequences_no > consequences_no : true) &&
                (field === 'category_no' ? item.category_no > category_no : true) ) {
                item[field]--;
            }
        });

        
    }
    
    function set_data_worksheet(item) {
        //กรณีที่เหลือ row เดียว  
        item.action_type = 'update';
        item.action_change = 1;
        item.action_status = 'Open';

        item.index_rows = 0;
        item.no = 1;

        item.list = null;
        item.listsub = null;
        item.category = null;

        item.causes_no = 1;
        item.consequences_no = 1;
        item.category_no = 1;

        item.ram_befor_security = null;
        item.ram_befor_likelihood = null;
        item.ram_befor_risk = null;
        item.major_accident_event = null;
        item.safety_critical_equipment = null;
        item.safeguard_mitigation = null;
        item.ram_after_security = null;
        item.ram_after_likelihood = null;
        item.ram_after_risk = null;
        item.recommendations = null;

        item.responder_user_id = null;
        item.responder_user_name = null;
        item.responder_user_email = null;
        item.responder_user_displayname = null;
        item.responder_user_img = null;

        item.row_type = "causes";

    }

    function markItemsForDeletion(callback) {
        var arrdelete = $filter('filter')($scope.data_nodeworksheet, callback);

        if (arrdelete.length > 0) {
            $scope.data_nodeworksheet_delete.push(...arrdelete);  // เก็บรายการที่จะลบทั้งหมด
        }
    }

    function deleteItems(callback) {
        for (let index = $scope.data_nodeworksheet.length - 1; index >= 0; index--) {
            let item = $scope.data_nodeworksheet[index];

            if (callback(item)) {
                $scope.data_nodeworksheet.splice(index, 1);  // ลบข้อมูลจาก array
                console.log("Removed item:", item);
            }
        }
    }

    function deleteMarkedItems() {
        $scope.data_del.forEach(function(itemToDelete) {
            let index = $scope.data_nodeworksheet.indexOf(itemToDelete);
            if (index !== -1) {
                $scope.data_nodeworksheet.splice(index, 1);  // ลบข้อมูลออกจาก array หลัก
                console.log("Removed from data_nodeworksheet:", itemToDelete);
            }
        });
    }
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
        var user_name = $scope.user_name
        var flow_role_type = $scope.flow_role_type;

        $.ajax({
            url: url_ws + "Flow/copy_pdf_file",
            data: '{"sub_software":"hazop","file_name":"' + file_name + '","file_path":"' + file_path + '"'
                + ',"page_start_first":"' + page_start_first + '","page_start_second":"' + page_start_second + '"'
                + ',"page_end_first":"' + page_end_first + '","page_end_second":"' + page_end_second + '","user_name":"' + user_name + '","row_type":"' + flow_role_type + '"'
                + '}',
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
                if(arr && arr[0].status == 'true'){
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
                }else{
                    set_alert('Warning', 'Unexpected issue occurred while processing your request. Please try again later.','node');
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
            var user_name = $scope.user_name
            var flow_role_type = $scope.flow_role_type;
            //conFig.pha_seq = null;
            conFig.pha_type_doc = pha_type_doc;

            $.ajax({
                url: controller_text + "/next_page",
                data: '{"controller_action_befor":"' + page + '","pha_type_doc":"' + pha_type_doc + '","user_name":"' + user_name + '","row_type":"' + flow_role_type + '"}',
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
        } else {

            if(!$scope.unsavedChanges){
                window.open("home/portal", "_top");
            }else{
                $('#unsavedChangesModal').modal({
                    backdrop: 'static',
                    keyboard: false 
                }).modal('show');
            }
            
        }


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
            var flow_role_type = $scope.flow_role_type;
            var token_doc = $scope.data_header[0].seq;

            $.ajax({
                //url: url_ws + "Flow/set_email_member_review_stamp",
                url: url_ws + "Flow/send_notification_member_review",
                data: '{"sub_software":"hazop","user_name":"' + user_name + '","row_type":"' + flow_role_type + '","pha_seq":"' + token_doc + '"}',
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

                if(!validBeforRegister()) 
                    return set_alert('Warning',$scope.validMessage,$scope.goback_tab)

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

                            $scope.goback_tab = 'general';
                            
                            $scope.tabs = $scope.tabs.map(tab => {
                                tab.isActive = (tab.name === 'general');
                                return tab;
                            });

                            set_alert('Warning', 'Please select a valid General Information','general');
                            validateSelect(item.field, item.errorId);
                            invalidFieldFound = true; 
                        }
                    });

                    if(invalidFieldFound) return;
                    
                }
                else if(pha_status == '12'){

                    if (arr_chk[0].expense_type == '' || arr_chk[0].expense_type == null) { set_alert('Warning', 'Please select a valid Expense Type'); return; }
                    if (arr_chk[0].sub_expense_type == '' || arr_chk[0].sub_expense_type == null) { set_alert('Warning', 'Please select a valid Sub-Expense Type'); return; }
                    if (arr_chk[0].id_apu == '' || arr_chk[0].id_apu == null) { set_alert('Warning', 'Please select a valid Area Process Unit'); return; }

                    if (!validConduct()) {
                        return set_alert('Warning', $scope.validMessage, $scope.goback_tab);
                    }
                }

                if (bCheckValid) return;

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

                $('#modalSendMailRegister').modal('hide');

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
                var fieldValidations = [
                    { field: 'expense_type', message: 'Please select a valid Expense Type' },
                    { field: 'sub_expense_type', message: 'Please select a valid Sub-Expense Type' },
                    { field: 'id_apu', message: 'Please select a valid Area Process Unit' }
                ];
            
                fieldValidations.forEach(function (validation) {
                    if (!arr_chk[0][validation.field]) {
                        set_alert('Warning', validation.message,'general');
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
        
        
        // Check follow up edit
        if ($scope.params) {
            return $('#modalEditConfirm').modal('show');
        }
                
        // Check if action is 'save' and user is main approver
        if (action === 'save' && $scope.isMainApprover) {
            return $('#modalEditConfirm').modal('show');
        }

        if($scope.pha_status == '22' ){
            check_case_approver();
        }

        save_data_create(action, action_def);
        

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

    
    function validateFields(item, mainField, requiredFields) {

        let valid = true;
        let allFieldsPresent = true; 
        let isViewDataNodeListSet = false; //

        if (item[mainField] !== null && item[mainField] !== '') {
    
            // Check each required field
            requiredFields.forEach(field => {
                if (!item[field]) {
                    allFieldsPresent = true;
                    valid = false;
                    console.log(`Missing required field '${field}' in item:`, item);
                }else{
                    if(valid){
                        allFieldsPresent = false;
                    }

                }

            });

            if (allFieldsPresent) {
                requiredFields.forEach(field => {
                    if (!isViewDataNodeListSet) {
                        $timeout(function() {
                            $scope.selectedItemNodeView.seq = item.id_node;

                            $scope.viewDataNodeList($scope.selectedItemNodeView.seq);
                        }, 0); 
                        isViewDataNodeListSet = true;
                    }
                    $timeout(function() {
                        set_valid_items(item[field], 'nodeworksheet-' + field + '-' + item.seq);
                    }, 0); 
                });
            }
            
        } else {

            valid = false;
        }
    
        return valid;
    }    
    

    function validateSelect(field, errorId) {
        var elementSelector = '.form-label .' + field + ' .choices';
        var selectElement = document.querySelector(elementSelector);
        var errorDiv = document.getElementById(errorId);

    
        if (selectElement) {
            selectElement.classList.add('is-invalid', 'mb-0');
            var fieldName = (field === 'id_apu') ? 'Area Process Unit' : field;
    
            if (errorDiv) {
                errorDiv.innerText = 'Please select a valid ' + fieldName + '.';
                errorDiv.style.display = 'block';
            }
        } else if (errorDiv) {
            errorDiv.style.display = 'none';
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
    
            if (_item === '' || _item === null) {
                id_valid.className = "feedback text-danger";
                id_valid.style.display = "block"; 
                return true;
            } else {
                id_valid.className = "invalid-feedback text-danger";
                id_valid.style.display = "none"; 
                return false;
            }
        } catch (ex) {
            console.error(`Error validating field: ${field}`, ex);
        }
        return false
    }
    $scope.clearAllValidationMessages = function (seq, type) {

        function clearValidationMessage(elementId) {
            var id_valid = document.getElementById(elementId);
    
            if (id_valid) {
                if (id_valid.classList.contains('d-block')) {
                    id_valid.classList.remove('d-block'); 
                }
                if (id_valid.classList.contains('feedback')) {
                    id_valid.classList.remove('feedback'); 
                }
                id_valid.style.display = 'none';  
            }
        }
    
        if (type === 'recom') {
            $scope.data_nodeworksheet.forEach(item => {
                clearValidationMessage(`valid-worksheet-recommendations-${item.seq}`);
            });
        } else {
            let typeMap = {
                'causes': 'valid-nodeworksheet-causes-',
                'consequences': 'valid-nodeworksheet-consequences-',
                'category': 'valid-nodeworksheet-category_type-'
            };
            
            if (typeMap[type]) {
                clearValidationMessage(typeMap[type] + seq);
            }


        }
    };


    
    
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

        $scope.unsavedChanges = false;
        save_data_create("submit", "submit");
    }


    function check_data_general() {
        //แปลง date to yyyyMMdd
        //แปลง time to hh:mm
        //set timezone offset
        var copy_data_general = angular.copy($scope.data_general);

        try {
            if (copy_data_general[0].target_start_date !== null) {
                var target_start_date = new Date(copy_data_general[0].target_start_date);
                if (!isNaN(target_start_date.getTime())) {
                    var target_start_date_utc = new Date(Date.UTC(target_start_date.getFullYear(), target_start_date.getMonth(), target_start_date.getDate()));
                    copy_data_general[0].target_start_date = target_start_date_utc.toISOString().split('T')[0];
                }
            }
        } catch {} 

        try {
            if (copy_data_general[0].target_end_date !== null) {
                var target_end_date = new Date(copy_data_general[0].target_end_date);
                if (!isNaN(target_end_date.getTime())) {
                    var target_end_date_utc = new Date(Date.UTC(target_end_date.getFullYear(), target_end_date.getMonth(), target_end_date.getDate()));
                    copy_data_general[0].target_end_date = target_end_date_utc.toISOString().split('T')[0];
                }
            }
        } catch {}    
        
        /*try {
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
        } catch {} */


        console.log("copy_data_general",copy_data_general)
        
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
        var copy_data_session = angular.copy($scope.data_session);

        for (var i = 0; i < copy_data_session.length; i++) {
            copy_data_session[i].id = copy_data_session[i].seq;
            copy_data_session[i].id_pha = pha_seq;
            try {
                copy_data_session[0].meeting_date = copy_data_session[0].meeting_date.toISOString().split('T')[0];
            } catch { }
            try {
                //12/31/1969 7:55:00 PM 
                var hh = copy_data_session[i].meeting_start_time_hh; var mm = copy_data_session[i].meeting_start_time_mm;
                var valtime = "1970-01-01T" + (hh).substring(hh.length - 2) + ":" + (mm).substring(mm.length - 2) + ":00.000Z";

                copy_data_session[i].meeting_start_time = new Date(valtime);
            } catch { }
            try {
                //12/31/1969 7:55:00 PM
                var hh = copy_data_session[i].meeting_end_time_hh; var mm = copy_data_session[i].meeting_end_time_mm;
                var valtime = "1970-01-01T" + (hh).substring(hh.length - 2) + ":" + (mm).substring(mm.length - 2) + ":00.000Z";
                copy_data_session[i].meeting_end_time = new Date(valtime);
            } catch { }
        }

        var arr_active = [];
        angular.copy(copy_data_session, arr_active);

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

        console.log("arr_json",arr_json)


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

        // in case approver rej
        if($scope.pha_status === 22){
            var hasInsert = false;

                // First loop to check if any action_type is 'insert' //เพิ่ม? ไม่เพิ่ม? 
            for (var i = 0; i < copy_data_approver.length; i++) {
                if (copy_data_approver[i].action_type === 'insert') {
                    hasInsert = true;
                    break;
                }
            }
                
            // If any 'insert' is found, set action_review to null for all objects
            if (!hasInsert) {
                for (var j = 0; j < copy_data_approver.length; j++) {
                    if(copy_data_approver[j].action_status === 'reject' && copy_data_approver[j].action_review === 2){
                        copy_data_approver[j].action_review = null;
                        copy_data_approver[j].action_change = 1;

                    }
                }                
            }
                
        }
        
        return angular.toJson(copy_data_approver);
    }

    function check_data_approver_ta3() {

        var pha_seq = $scope.data_header[0].seq;
        for (var i = 0; i < $scope.data_approver_ta3.length; i++) {
            $scope.data_approver_ta3[i].id = $scope.data_approver_ta3[i].seq;
            $scope.data_approver_ta3[i].id_pha = pha_seq;
            $scope.data_approver_ta3[i].no = (i + 1);
        }

        var arr_active = [];
        angular.copy($scope.data_approver_ta3, arr_active);
        var arr_json = $filter('filter')(arr_active, function (item) {
            return ((item.user_name !== null && item.action_type === 'update' && item.action_change === 1) || item.action_type === 'insert' || item.action_type === 'delete');
        });
    
        for (var i = 0; i < $scope.data_approver_ta3_delete.length; i++) {
            $scope.data_approver_ta3_delete[i].action_type = 'delete';
            arr_json.push($scope.data_approver_ta3_delete[i]);
        }
        for (var i = 0; i < arr_active.length; i++) {
            if (arr_active[i].user_name == null) {
                arr_active[i].action_type = 'delete';
                arr_json.push(arr_active[i]);
            }
        }



        //check จากข้อมูลเดิมที่เคยบันทึกไว้ถ้าไม่มีในของเดิมให้ delete ออกด้วย
        for (var i = 0; i < $scope.data_approver_ta3_old.length; i++) {
            var arr_check = $filter('filter')($scope.data_approver_ta3, function (item) {
                return (item.user_name == $scope.data_approver_ta3_old[i].user_name
                    && item.id_session == $scope.data_approver_ta3_old[i].id_session
                    && (item.action_type == 'insert' || item.action_type == 'update'));
            });
            if (arr_check.length == 0) {
                $scope.data_approver_ta3_old[i].action_type = 'delete';
                arr_json.push($scope.data_approver_ta3_old[i]);
            }
        }
        

        //check จากข้อมูล session ให้ delete ออกด้วย
        for (var i = 0; i < $scope.data_approver_ta3.length; i++) {
            var arr_check = $filter('filter')($scope.data_session, function (item) {
                return (item.seq == $scope.data_approver_ta3[i].id_session || item.id == $scope.data_approver_ta3[i].id_session);
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

        var copy_data_nodeworksheet = angular.copy($scope.data_nodeworksheet);

        for (var i = 0; i < copy_data_nodeworksheet.length; i++) {
            copy_data_nodeworksheet[i].id = Number(copy_data_nodeworksheet[i].seq);
            copy_data_nodeworksheet[i].id_pha = pha_seq;

            // action_project_team
            if (copy_data_nodeworksheet[i].action_project_team !== undefined) {
                copy_data_nodeworksheet[i].action_project_team = copy_data_nodeworksheet[i].action_project_team ? 1 : 0;
            }
            
            try {
                if (copy_data_nodeworksheet[i].estimated_start_date) {
                    var today = new Date(copy_data_nodeworksheet[i].estimated_start_date);
                    var start_date_utc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
                    copy_data_nodeworksheet[i].estimated_start_date = start_date_utc.toISOString().split('T')[0];
                } 
            } catch (error) {} 
            try {
                if (copy_data_nodeworksheet[i].estimated_start_date !== null) {
                    var end_date = new Date(copy_data_nodeworksheet[i].estimated_end_date);
                    if (!isNaN(end_date.getTime())) { 
                        var end_date_utc = new Date(Date.UTC(end_date.getFullYear(), end_date.getMonth(), end_date.getDate()));
                        copy_data_nodeworksheet[i].estimated_end_date = end_date_utc.toISOString().split('T')[0];
                    }
                } else {}
            } catch (error) {}                                    
            

            if (pha_status == "11" || pha_status == "12" || pha_status == "22") {
                try {
                    if (copy_data_nodeworksheet[i].reviewer_action_date !== null) {
                        var reviewer_date = new Date(copy_data_nodeworksheet[i].reviewer_action_date);
                        if (!isNaN(reviewer_date.getTime())) {
                            var reviewer_date_utc = new Date(Date.UTC(reviewer_date.getFullYear(), reviewer_date.getMonth(), reviewer_date.getDate()));
                            copy_data_nodeworksheet[i].reviewer_action_date = reviewer_date_utc.toISOString().split('T')[0];
                        }
                    }                 

                } catch (error) {}
                
                try {
                    if (copy_data_nodeworksheet[i].responder_action_date !== null) {
                        var responder_date = new Date(copy_data_nodeworksheet[i].responder_action_date);
                        if (!isNaN(responder_date.getTime())) { 
                            var responder_date_utc = new Date(Date.UTC(responder_date.getFullYear(), responder_date.getMonth(), responder_date.getDate()));
                            copy_data_nodeworksheet[i].responder_action_date = responder_date_utc.toISOString().split('T')[0];
                        }
                    }                      

                } catch (error) {}
            }

        }
        var arr_active = [];
        angular.copy(copy_data_nodeworksheet, arr_active);
        var arr_json = $filter('filter')(arr_active, function (item) {
            return ((item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert');
        });
        for (var i = 0; i < $scope.data_nodeworksheet_delete.length; i++) {
            $scope.data_nodeworksheet_delete[i].action_type = 'delete';
            arr_json.push($scope.data_nodeworksheet_delete[i]);
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

    function set_alert(header, detail, tab) {
        $scope.Action_Msg_Header = header;
        $scope.Action_Msg_Detail = detail;
    
        // Set the tab based on where the error occurred (if provided)
        if (tab) {
            $scope.goback_tab = tab;
        } else {
            $scope.goback_tab = 'general';
        }
    
    
        $timeout(function() {
            $('#modalMsg').modal({
                backdrop: 'static',
                keyboard: false 
            }).modal('show');
    
            // Hide the modal after 2 seconds if it's a success message
            if (header === 'Success') {
                $timeout(function() {
                    $('#modalMsg').modal('hide');
                }, 2000);
            }
        });
    }

    $scope.reloadPage = function(){
        window.location.reload();
    }
    function set_alert_warning(header, detail) {
        $scope.$apply(function () {
            $scope.Action_Msg_Header = header;
            $scope.Action_Msg_Detail = detail;
        });

        $timeout(function() {
            $('#modalMsg').modal({
                backdrop: 'static',
                keyboard: false 
            }).modal('show');
        });

    }

    function set_alert_confirm(header, detail) {

        $scope.Action_Msg_Confirm = true;

        $scope.Action_Msg_Header = header;
        $scope.Action_Msg_Detail = detail;

        $('#modalMsg').modal({
            backdrop: 'static',
            keyboard: false 
        }).modal('show');
    }

    //start Update Action Type null to Update 
    $scope.actionChange = function (_arr, _seq, type_text) {
        action_type_changed(_arr, _seq);

        var arr_submit = $filter('filter')($scope.data_node, function (item) {
            return ((item.action_type !== '' || item.action_type !== null));
        });
        if (arr_submit.length > 0) { $scope.submit_type = true; } else { $scope.submit_type = false; }

        if (type_text == "expense_type") {
            $scope.data_header[0].request_approver = (_arr.expense_type == 'OPEX' ? 0 : 1);
        }
        if (type_text == "ChangeRAM") {
            set_master_ram_likelihood(_arr.id_ram);
        }

        if (type_text == "node") {
            $scope.selectedItemNodeView.seq = _seq;
        }

        if(type_text === 'area'){
            $scope.data_general[0].id_unit_no = null;
            $scope.data_general[0].unit_no_name = null;
            $scope.data_general[0].id_area = null;
            $scope.data_general[0].id_company = null;
            $scope.data_general[0].action_change = 1;
        }


        if(type_text == 'meeting_date' || type_text == 'meeting_time'){
            updateDataSessionAccessInfo('session');

        }else{
            updateDataSessionAccessInfo();
        }

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

    }

    $scope.actionChangeWorksheet = function (_arr, _seq, type_text) {


        if(type_text == 'recom' && (_arr.recommendations !== null || _arr.recommendations !== '')){
            if($scope.data_header[0].pha_status === 12) {
                console.log('will uniq')
                ensureUnique($scope.data_nodeworksheet,'',type_text);
            }else{
                
                let maxRecommendationsNo = Math.max(...$scope.data_nodeworksheet.map(item => Number(item.recommendations_no) || 0));

                _arr.no = maxRecommendationsNo;
                /*let maxNo = 0;

                $scope.data_nodeworksheet.forEach(item => {
                    if (item.no > maxNo) {
                        maxNo = item.no;
                    }
                });
        
                maxNo += 1;

                _arr.no = maxNo;*/
            }
        }
 
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
        var data = item.responder_user_name || item.project_team_text;
        if (!item.recommendations) {
            data = 'true';
        }
        set_valid_items(data, 'nodeworksheet-responder-' + item.seq)
    }

    $scope.recommentAction_valid = function(item) {
        $scope.recomment_clear_valid = 'valid-worksheet-recommendations-' + item.seq;
        //clear_valid_items('valid-worksheet-recommendations-' + item.seq)
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

    $scope.openDataEmployeeAdd = function (item, form_type, index) {

        $scope.selectedData = item;
        $scope.selectdata_session = item.seq;
        $scope.selectDatFormType = form_type;//member, approver, owner
        $scope.employeelist_show = [];
        $scope.searchText = '';
        $scope.owner_status = '';
        $scope.approve_index = index;

        if (form_type === 'owner') {
            $scope.owner_status = 'employee'; //1 for em || 2 for teams to sent to p'kul
        }

        updateClickedStates(form_type);

        apply();
        //alert($scope.selectDatFormType);
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

    $scope.selectTab = function(tab) {
        $scope.owner_status = tab;
    }

    $scope.fillterDataEmployeeAdd = function () {
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
        var user_name = $scope.user_name
        var flow_role_type = $scope.flow_role_type;

        $.ajax({
            url: url_ws + "Flow/employees_search",
            data: '{"user_indicator":"' + indicator + '","user_name":"' + user_name + '","row_type":"' + flow_role_type + '"'
                + ',"max_rows":"50"'
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
    $scope.showModal = function() {
        var deferred = $q.defer();
        
        $('#modalConfirm').modal('show');
        
        $scope.confirm = function() {
            
            $('#modalConfirm').modal('hide');
            // Save and send
            setTimeout(function() {
                save_data_approver_ta3("submit");
            }, 200);
            deferred.resolve(true);
        };
        
        $scope.cancel = function() {
            $('#modalConfirm').modal('hide');
            deferred.resolve(false);
        };
        
        $('#modalConfirm').on('hidden.bs.modal', function() {
            deferred.resolve(false);
            $('#modalConfirm').off('hidden.bs.modal'); 
        });
        
        return deferred.promise;
    };
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

        $scope.selected_TA3 = [];

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
                newInput.user_title = employee_position;

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

                //add new employee 
                var seq = $scope.MaxSeqDataMemberteam;

                var newInput = clone_arr_newrow($scope.data_approver_def)[0];
                newInput.seq = seq;
                newInput.id = seq;
                newInput.no = (0);
                newInput.id_session = Number(seq_session);
                newInput.action_type = 'insert';
                newInput.action_change = 1;

                newInput.user_name = employee_name;
                newInput.user_displayname = employee_displayname;
                newInput.user_img = employee_img;
                newInput.user_title = employee_position;

                //approver or safety
                newInput.approver_type = (arr_items_all.length == 0 ? 'approver' : 'safety');


                $scope.data_approver.push(newInput);
                running_no_level1($scope.data_approver, null, null);

                $scope.MaxSeqDataMemberteam = Number($scope.MaxSeqDataMemberteam) + 1;

                $scope.data_approver.sort(function(a, b) {
                    if (a.approver_type === "approver") return -1;
                    if (b.approver_type === "approver") return 1;
                    return 0;
                });

            }

        }
        else if (xformtype == 'edit_approver') {
            // ขั้นแรก เรียงข้อมูลตามฟิลด์ 'no'
            var sortedData = $filter('orderBy')($scope.data_approver, 'no');
            // จากนั้น กรองข้อมูลตามเงื่อนไขที่ต้องการ
            var result = $filter('filter')(sortedData, function (item, idx) {
                return idx == $scope.approve_index;
            })[0];

            if (result) {
                result.action_change = 1;
                result.user_displayname = item.employee_displayname;
                result.user_img = item.employee_img;
                result.user_name = item.employee_name;
            }
            $('#modalEmployeeAdd').modal('hide');
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
                arr_items.action_status = 'Open'


                if ($scope.owner_status === 'teams') {
                    arr_items.project_team_text =  $scope.owner_teams;
                    arr_items.action_project_team = true;
                    
                } else {
                    arr_items.responder_user_displayname = employee_position + '-' + employee_displayname.split(" ")[0];
                    arr_items.action_project_team = false;
                }

            arr_items.action_change = 1;
            $('#modalEmployeeAdd').modal('hide');

        }
        else if (xformtype == "approver_ta3"){

            $scope.selected_TA3 = item;

            //set this aprrover to update 
            var arr_approver_TA2 = $scope.data_approver.filter(item => item.id === seq_session);
            $scope.data_approver.forEach(item => {
                if (arr_approver_TA2.includes(item)) {
                    item.action_type = 'update';
                    item.action_change = 1;
                }
            });

            //set other to del if same id_apprver
            var arr_approver_TA3 = $scope.data_approver_ta3.filter(item => {
                return  item.id_approver === arr_approver_TA2[0].id;
            });
            //item.id_session === arr_approver_TA2[0].id_session &&
            $scope.data_approver_ta3.forEach(item => {
                if (arr_approver_TA3.includes(item)) {
                    item.action_type = 'delete';
                    item.action_change = 1;
                }
            });

            

            var arr_data = $filter('filter')($scope.data_approver_ta3, function (item) {
                return (item.id_session == seq_session && item.user_name == employee_name);
            });
            
            if (arr_data.length === 0) {
                $('#modalEmployeeAdd').modal('hide');
                $scope.showModal().then(function(confirmed) {

                    if(confirmed === true){
                       //add new employee 
                       var seq = $scope.MaxSeqdata_approver_ta3;
    
                       var newInput = clone_arr_newrow($scope.data_approver_ta3_def)[0];
                       newInput.seq = seq;
                       newInput.id = seq;
                       newInput.no = (0);
                       newInput.id_session = Number(arr_approver_TA2[0].id_session);
                       newInput.action_type = 'insert';
                       newInput.action_change = 1;
   
                       newInput.id_pha = arr_approver_TA2[0].id_pha
                       newInput.id_approver = seq_session;
                       newInput.approver_type = arr_approver_TA2[0].approver_type;
   
                       newInput.user_name = employee_name;
                       newInput.user_displayname = employee_displayname;
                       newInput.user_img = employee_img;
   
                       $scope.data_approver_ta3.push(newInput);
   
                       running_no_level1($scope.data_approver_ta3, null, null);
   
                       $scope.MaxSeqdata_approver_ta3 = Number($scope.MaxSeqdata_approver_ta3) + 1
                       
                    }


                });
            }
            
        }


        if(xformtype == 'member' || xformtype == 'approver' || xformtype == 'specialist'){
            updateDataSessionAccessInfo('session');
        }


        //clear_valid_items($scope.recomment_clear_valid);
        $scope.recomment_clear_valid = '';

        //show fade item if selected
        $scope.clickedStates[item.employee_name] = true;

        if (xformtype == "owner" || xformtype == "approver_ta3" || xformtype == "edit_approver") {
            $('#modalEmployeeAdd').modal('hide');

            $scope.clearFormData();
        } else {
            $('#modalEmployeeAdd').modal('show');
        }
        
        apply();

    };

    $scope.clearFormData = function() {
        $scope.formData = [];
        $scope.employeelist_show = [];
        $scope.clickedStates = {};
        //$scope.searchText='';
        $scope.searchIndicator = {
            text: ''
        }        
        //$scope.formData_outsider = [];
    };

    $scope.removeDataEmployee = function (data, seq_session,type) {


        var seq = data.seq;

        $scope.clickedStates[data.user_name] = false;

        if(type === 'member'){
            var arrdelete = $filter('filter')($scope.data_memberteam, function (item) {
                return (item.seq == seq && item.action_type == 'update');
            });
            if (arrdelete.length > 0) { $scope.data_memberteam_delete.push(arrdelete[0]); }

            console.log("arrdelete",arrdelete)
    
            $scope.data_memberteam = $filter('filter')($scope.data_memberteam, function (item) {
                if (item.seq == seq && item.id_session == seq_session) {
                    if (item.user_name !== undefined && item.user_name !== null) {
                        $scope.clickedStates[item.user_name] = false;
                    } 
                }
            
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
        }else{
            var arrdelete = $filter('filter')($scope.data_approver, function (item) {
                return (item.seq == seq && item.action_type == 'update');
            });
            if (arrdelete.length > 0) { $scope.data_approver_delete.push(arrdelete[0]); }
    
            $scope.data_approver = $filter('filter')($scope.data_approver, function (item) {
                if (item.seq == seq && item.id_session == seq_session) {
                    if (item.user_name !== undefined && item.user_name !== null) {
                        $scope.clickedStates[item.user_name] = false;
                    } 
                }
            
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
        }

        

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
    
    $scope.changeUnitNo = function(unit_no) {
        $scope.data_general[0].id_unit_no = unit_no.id;
        $scope.data_general[0].unit_no_name = unit_no.name;
        $scope.data_general[0].id_area = unit_no.id_area;
        $scope.data_general[0].id_company = unit_no.id_company;
        $scope.data_general[0].action_change = 1;
    };

    $scope.changeTFunctional = function(item) {
        $scope.data_general[0].functional_location = item.functional_location;
        $scope.data_general[0].action_change = 1;
        // $scope.data_general[0].unit_no_name = unit_no.name;
    };

    $scope.changeRequestType = function(request_type) {
        $scope.data_general[0].id_request_type = request_type.id;
        $scope.data_general[0].action_change = 1;

    };


    $document.on('click', function(event) {
        const targetElement = event.target;
        const id = targetElement.getAttribute('id');
        var id_dropdown = '';
        var id_node = '';

        if (id) {
            id_dropdown = id.substring(0, id.indexOf('_'));
        }
        // click button
        if (id_dropdown == 'dropdown') {
            id_node = id.substring(id.indexOf("_") + 1); 
        }
        // click input text
        if (id == 'dropdown_input') {
            return
        }
        // hidden dropdown
        document.getElementById('unit_no').classList.remove("show");
        document.getElementById('functional').classList.remove("show");
        // set default list
        $scope.search_keywords = clone_arr_newrow(  $scope.search_keywords);
        $scope.master_unit_no_list =  $scope.master_unit_no;
        $scope.master_functional_list =  $scope.master_functional;
        //$scope.data_request_type_list =  $scope.data_request_type;
        // show
        try {
            document.getElementById(id_node).classList.toggle("show");
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

        if (type == 'functional') {
            $scope.master_functional_list = $filter('filter')($scope.master_functional, function(item) {
                var itemName = item.name.toLowerCase();
                var searchText = $scope.search_keywords.functional.toLowerCase();
        
                return itemName.includes(searchText);
            });
        }


    }

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

    $scope.sessionAccessInfoMap = {};
    $scope.drawingAccessInfoMap = {};

    $scope.getAccessInfo = function(item, index, type) {
        let accessInfo = {
            canRemove: false,
            canCopy: false,
            canAdd: false,
        };
    
        if(type == 'session'){
            let approverData = $scope.data_approver.filter(data => data.id_session === item.id);
            let memberTeamData = $scope.data_memberteam.filter(data => data.id_session === item.id);
            
            
            if(!$scope.isApproveReject){
                //normal flow 
                if (index === 0 && 
                    (approverData.length === 0 || approverData[0].user_name == null) &&
                    (memberTeamData.length === 0 || memberTeamData[0].user_name == null)) {
                    accessInfo.canRemove = false;
                } else {
                    accessInfo.canRemove = true;
                }
        
                if ((approverData.length > 0 && approverData[0].user_name != null) ||
                    (memberTeamData.length > 0 && memberTeamData[0].user_name != null)) {
                    accessInfo.canCopy = true;
                    accessInfo.canAdd = true;

                } else {
                    accessInfo.canCopy = false;
                }
    
                let meeting_data = $scope.data_session.filter(data => data.id === item.id);
    
                if (
                    meeting_data[0].meeting_date != null || 
                    meeting_data[0].meeting_start_time != null || 
                    meeting_data[0].meeting_start_time_hh != null || 
                    meeting_data[0].meeting_start_time_mm != null || 
                    meeting_data[0].meeting_end_time != null || 
                    meeting_data[0].meeting_end_time_hh != null || 
                    meeting_data[0].meeting_end_time_mm != null
                ) {
                    accessInfo.canCopy = true;
                    accessInfo.canAdd = true;
                    accessInfo.canRemove = true;
                } 
            }else{
                //ถ้าไม่ใช่ admin || originator ทำไม่ได้
                //approver rej flow    
                console.log("$scope.active_session",$scope.active_session)           
                console.log("$scope.item.id",item.id)           
                if($scope.flow_role_type === 'admin' || $scope.data_header[0].pha_request_by === $scope.user_name){
                    if($scope.active_session === item.id && item.action_type === 'update'){
                        accessInfo.canCopy = true;
                        accessInfo.canAdd = true;
                        accessInfo.canRemove = false;
                    }else if(item.action_type === 'insert'){
                        accessInfo.canCopy = true;
                        accessInfo.canRemove = true;
                        accessInfo.canAdd = true;
                    }else{
                        accessInfo.canCopy = true;
                        accessInfo.canAdd = true;
                        accessInfo.canRemove = true;                
                    }
                }

            }


            $scope.sessionAccessInfoMap[item.id] = accessInfo;
            
            
        } else if(type === 'drawing'){
    
            if(!$scope.isApproveReject){
                //normal flow 
                if(index === 0) {

                    console.log("item",item)
                    if (item.document_name !== null || item.document_no !== null || item.descriptions !== null ||
                        item.document_file_name !== null || item.document_file_path !== null) {
                        accessInfo.canRemove = true;
                    } else {
                        accessInfo.canRemove = false;
                    }
                } else {
                    accessInfo.canRemove = true;
                }

                accessInfo.canAdd = true;

    
            }else{
                if($scope.flow_role_type === 'admin' || $scope.data_header[0].pha_request_by === $scope.user_name){
                    if($scope.active_session === item.id && item.action_type === 'update'){
                        accessInfo.canCopy = true;
                        accessInfo.canRemove = false;
                    }else if(item.action_type === 'insert'){
                        accessInfo.canCopy = true;
                        accessInfo.canRemove = true;
                    }
                }
            }
            $scope.drawingAccessInfoMap[item.id] = accessInfo;
        }
        
        
    };    

    $scope.Access_check = function(task) {

        console.log(task)
        console.log(task)
        let accessInfo = {
            canAccess: false, // General access flag (for both viewing and uploading)
            isTA2: false,     // Role: Task owner (TA2)
            isTA3: false,     // Role: Approver (TA3)
            canViewOnly: false // Regular employee can view if exists
        };
    
        // Admin has full access
        if ($scope.flow_role_type === 'admin') {
            accessInfo.canAccess = true;
            return accessInfo;
        }
    
        console.log("$scope.flow_role_type",$scope.flow_role_type)
        // Employee (could be TA2 or TA3 or regular employee)
        if ($scope.flow_role_type === 'employee') {

            console.log($scope.user_name)
            console.log(task.user_name)
            // Check if user is TA2 (task owner)
            if ($scope.user_name === task.user_name) {
                accessInfo.isTA2 = true;
                accessInfo.canAccess = task.status !== 21; // TA2 can upload until status is 21 (submitted)
            } else {
                // Check if user is TA3 (approver)
                if ($scope.data_approver_ta3) {
                    for (let item of $scope.data_approver_ta3) {
                        if (item.id_approver === task.id && $scope.user_name === item.user_name) {
                            accessInfo.isTA3 = true;
                            accessInfo.canAccess = true; // TA3 has access to view/download
                        }
                    }
                }

                // Check if a document is uploaded for the matching id_approver
                if ($scope.data_drawing_approver) {
                    for (let drawing of $scope.data_drawing_approver) {
                        if (drawing.id_approver === task.id) {
                            if (drawing.document_file_size) {
                                console.log("task matches id_approver, document_file_size exists", drawing);
                                accessInfo.canViewOnly = true; // Regular employees can only view the document if uploaded
                            }
                        }
                    }
                }
            }
        }
    
        return accessInfo;
    };
    
    


    function validBeforRegister() {
        if (!validGeneral()) {
            return false;
        }

        if (!validSessions()) {
            return false;
        }

        if (!validDrawing()) {
            return false;
        }

        if (!validNode()) {
            return false;
        }

        return true;
    }

    function validConduct() {
        // Early return if general validation fails
        if (!validGeneral()) {
            return false;
        }
    
        // Early return if session validation fails
        if (!validSessions()) {
            return false;
        }
    
        // Early return if node validation fails
        if (!validNode()) {
            return false;
        }
    
        // Worksheet validation
        if (!checkWorksheet()) {  
            $scope.validMessage = 'Please provide valid data in the worksheet';
            $scope.goback_tab = 'worksheet';                          
            return false;  // Stop here if worksheet validation fails
        }
    
        // Check if there's at least one valid recommendation
        const hasValidRecommendations = $scope.data_nodeworksheet.some(item => 
            item.recommendations && typeof item.recommendations === 'string' && item.recommendations.trim()
        );
    
        if (!hasValidRecommendations) {
            $scope.validMessage = 'Please provide at least one valid recommendation.';
            $scope.goback_tab = 'worksheet';  
    
            // Loop through all items and set validation for missing recommendations
            for (let i = 0; i < $scope.data_nodeworksheet.length; i++) {
                const item = $scope.data_nodeworksheet[i];
                
                // Ensure recommendations exist and are valid
                if (!item.recommendations || !item.recommendations.trim()) {
                    set_valid_items(item.recommendations, 'worksheet-recommendations-' + item.seq);
                }
            }
    
            return false;  // Stop here if no valid recommendation
        }
    
        // If there are valid recommendations, continue with manage recommendation check
        for (let i = 0; i < $scope.data_nodeworksheet.length; i++) {
            const item = $scope.data_nodeworksheet[i];
    
            // Ensure recommendations exist and are valid
            if (item.recommendations && typeof item.recommendations === 'string' && item.recommendations.trim()) {
                if (!checkManage(item.seq)) {
                    $scope.validMessage = 'Please provide valid data in the Manage Recommendations.';
                    $scope.goback_tab = 'manage';
                    return false;  // Stop here if manage recommendation validation fails
                }
            }
        }
    
        return true;  // Return true if all validations pass
    }
      

    function validGeneral(){
        if (!$scope.data_general[0].sub_expense_type ||
            !$scope.data_general[0].expense_type ||
            !$scope.data_general[0].id_apu
        ) {
            if(!$scope.data_general[0].sub_expense_type) $scope.validMessage = 'Please select a valid  Sub Project Type'
            if(!$scope.data_general[0].expense_type) $scope.validMessage = 'Please select a valid Project Type'
            if(!$scope.data_general[0].id_apu) $scope.validMessage = 'Please select a valid  Area Process Unit'

            $scope.goback_tab = 'general';

            return false
        }
        $scope.validMessage = ''
        return true
    }

    function validSessions(){
        let isValid = true;
        for (let i = 0; i < $scope.data_session.length; i++) {
            // MEMBER
            if($scope.data_memberteam.length < 1 || !$scope.data_memberteam[0].user_displayname) {
                $scope.goback_tab = 'session'
                $scope.validMessage = 'Please select a valid Member Team/Adttendees'
                return ;
            }
            // ASSESMENT  
            if ($scope.data_general[0].expense_type == '5YEAR') {
                if ($scope.data_approver.length < 1 || !$scope.data_approver[0].user_displayname) {
                    $scope.goback_tab = 'session'
                    $scope.validMessage = 'Please select a valid Assesment Team Leader'
                    return ;
                }
            }
        }
        // SESSION DATE TIME
        $scope.data_session.forEach(function(session) {
          session.validated = true;
    
          if (!session.meeting_date) {
            $scope.validMessage = 'Please select a valid Meeting Date';
            isValid = false;
          } else if (!session.meeting_start_time_hh) {
            $scope.validMessage = 'Please select a valid Meeting Start Time HH';
            isValid = false;
          } else if (!session.meeting_start_time_mm) {
            $scope.validMessage = 'Please select a valid Meeting Start Time MM';
            isValid = false;
          } else if (!session.meeting_end_time_hh) {
            $scope.validMessage = 'Please select a valid Meeting End Time HH';
            isValid = false;
          } else if (!session.meeting_end_time_mm) {
            $scope.validMessage = 'Please select a valid Meeting End Time MM';
            isValid = false;
          }
    
          if (!isValid) {
            $scope.goback_tab = 'session';
            return false;
          }
        });
    
        if (isValid) {
          $scope.validMessage = '';
          return true;
        }
    }
    
    function validDrawing(){
        for (let i = 0; i < $scope.data_drawing.length; i++) {
            if (!$scope.data_drawing[i].document_no ||
                !$scope.data_drawing[i].document_file_name
            ) {
                if(!$scope.data_drawing[i].document_file_name) $scope.validMessage = 'Please select a valid Document File'
                if(!$scope.data_drawing[i].document_no) $scope.validMessage = 'Please select a valid Drawing No'
    
                $scope.goback_tab = 'node';

                return false
            }
        }
        $scope.validMessage = ''
        return true
    }

    function validNode(){
        for (let i = 0; i < $scope.data_node.length; i++) {
            if (!$scope.data_node[i].node) {
                $scope.validMessage = 'Please select a valid Node';
                $scope.goback_tab = 'node';
                return false;
            } else {
                for (let i = 0; i < $scope.data_node.length; i++) {
                    let currentNode = $scope.data_node[i].id; 

                    const node_drawing = $scope.data_nodedrawing.filter(d => d.id_node === currentNode);

                    console.log("node_drawing",node_drawing)
                    if (node_drawing.length === 0) {
                        $scope.validMessage = 'Please select a valid Drawing';
                        $scope.goback_tab = 'node';
                        return false;
                    }

                    if (node_drawing[0].id_drawing == null) {
                        $scope.validMessage = 'Please select a valid Drawing';
                        $scope.goback_tab = 'node';
                        return false;
                    }
                }

            }
        }
        
        

        $scope.validMessage = ''
        return true
    }
        //Check worksheet valid at conduct
        function checkWorksheet() {
            var bCheckValid_Worksheet = false;
            
            // First Block of Validations
            var node = $scope.data_node;
        
            for (var i = 0; i < node.length; i++) {
        
                var arr_chk = $scope.data_nodeworksheet.filter(item => item.id_node === node[i].id);


                for (var j = 0; j < arr_chk.length; j++) {
                    let item = arr_chk[j];
                    var valid = false;

                
                    // Check the required fields
                    if (item['recommendations'] &&
                        ((item['causes'] !== undefined && item['causes'] !== null && item['causes'] !== '') ||
                        (item['consequences'] !== undefined && item['consequences'] !== null && item['consequences'] !== '') ||
                        (item['category_type'] !== undefined && item['category_type'] !== null && item['category_type'] !== ''))) {

                        // Validate based on the first present field among 'causes', 'consequences', 'category_type'
                        if (item['causes'] !== undefined && item['causes'] !== null && item['causes'] !== '') {
                            valid = validateFields(item, 'causes', ['consequences', 'category_type'/*, 'major_accident_event', 'existing_safeguards'*/]);
                        } else if (item['consequences'] !== undefined && item['consequences'] !== null && item['consequences'] !== '') {
                            valid = validateFields(item, 'consequences', ['causes', 'category_type'/*, 'major_accident_event', 'existing_safeguards'*/]);
                        } else if (item['category_type'] !== undefined && item['category_type'] !== null && item['category_type'] !== '') {
                            valid = validateFields(item, 'category_type', ['causes', 'consequences', /*'major_accident_event', 'existing_safeguards'*/]);
                        }
        
                        // Log whether validation passed or failed for this item
                        if (valid) {
                            console.log("Validation passed for item:", item);
                        } else {
                            console.log("Validation failed for item:", item);
                            bCheckValid_Worksheet = true;
                        }
                    } else {
                        console.log("No required fields filled for item:", item);
                    }
                }
        
                // If any worksheet validation failed, stop and return false
                if (bCheckValid_Worksheet) {
                    console.log("Validation failed for task:", node[i]);
                    return false;  // Stop further validation
                }
            }
        
            console.log("All tasks validated successfully.");
            return true;
        }
        

        function checkManage(seq) {
            var bCheckValid_Manage = false;
            var arr_chk = $scope.data_nodeworksheet;
        
            for (var i = 0; i < arr_chk.length; i++) {

                if(arr_chk[i].seq === seq){
                    if (!arr_chk[i].estimated_start_date) {
                        if (set_valid_items(arr_chk[i].estimated_start_date, 'nodeworksheet-estimated-start-' + arr_chk[i].seq)) {
                            bCheckValid_Manage = true;
                        }
                    }
            
                    if (!arr_chk[i].estimated_end_date) {
                        if (set_valid_items(arr_chk[i].estimated_end_date, 'nodeworksheet-estimated-end-' + arr_chk[i].seq)) {
                            bCheckValid_Manage = true;
                        }
                    }


                    //check ต้องมี ram after risk ที่เป็น medium high
                    if (!arr_chk[i].ram_after_risk) {
                        if (set_valid_items(arr_chk[i].estimated_end_date, 'nodeworksheet-ram-after-risk-' + arr_chk[i].seq)) {
                            bCheckValid_Manage = true;
                        }
                    }
                }
            }
        
            if (bCheckValid_Manage) {
                console.log("Some items were missing start or end dates and were validated.");
                return false;
            }
        
            console.log("All items have both start and end dates.");
            return true;
        }
        

});
