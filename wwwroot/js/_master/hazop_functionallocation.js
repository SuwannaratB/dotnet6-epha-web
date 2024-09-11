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

    var url_ws = conFig.service_api_url();

    get_data(true);

    //call ws get data
    if (true) {

        function truncateFilename(filename, length) {
            if (!filename) return '';
            if (filename.length <= length) return filename;
            const start = filename.slice(0, Math.floor(length / 2));
            const end = filename.slice(-Math.floor(length / 2));
            return `${start}.......${end}`;
          }
          
          $scope.selectFile = function(file) {
            console.log('selectFile function called');
            
            if (file) {
              const fileName = file.name;
              const fileSize = Math.round(file.size / 1024);
              const fileSeq = file.$ngfDataUrl.split('-')[1]; 
              const fileInfoSpan = document.getElementById('filename' + fileSeq);
      
              try {
                const truncatedFileName = truncateFilename(fileName, 20);
                if (fileInfoSpan) {
                  fileInfoSpan.textContent = `${truncatedFileName} (${fileSize} KB)`;
                }
              } catch (error) {
                console.error('Error updating file info:', error);
              }
      
              const allowedFileTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'png', 'gif'];
              const fileExtension = fileName.split('.').pop().toLowerCase();
      
              if (allowedFileTypes.includes(fileExtension)) {
              
                console.log('File attached successfully.');
              } else {
                $('#modalMsgFileError').modal({
                  backdrop: 'static',
                  keyboard: false 
                }).modal('show');
                console.warn('Please select a PDF, Word, Excel, or Image file.');
              }
              
              // Example upload function call
              var file_path = uploadFile(file, fileSeq, fileName, fileSize);
            } else {
              const fileInfoSpan = document.getElementById('filename' + fileSeq);
              if (fileInfoSpan) {
                fileInfoSpan.textContent = "";
              }
            }
          };
        
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

    ///////////////////////////  API Function  ///////////////////////////
    function save_data(action) {
        var user_name = $scope.user_name;
        var flow_role_type = $scope.flow_role_type;
        //save 
        var flow_action = action || 'save';
        var json_data = check_data();
        var json_drawing = check_data_drawing();
        $.ajax({
            url: url_ws + "masterdata/set_master_functionallocation",
            data: '{"user_name":"' + user_name + '"'
                + ',"role_type":"' + flow_role_type + '"'
                + ',"json_data": ' + JSON.stringify(json_data)
                + ',"json_drawing": ' + JSON.stringify(json_drawing)
                + '}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
            headers: {
                'Authorization': $scope.token 
            },
            beforeSend: function () {
                $("#divLoading").show();
            },
            complete: function () {
                $("#divLoading").hide();
            },
            success: function (data) {
                var arr = data;
                if(arr[0].status == 'false') {
                    showAlert('Error', arr[0].status, 'error', function() {
                        apply()
                    });
                    return
                }
                $scope.pha_type_doc = 'update';
                showAlert('Success', 'Data has been successfully saved.', 'success', function() {
                    get_data_after_save(false);
                    apply();
                });
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

    function call_api_load(page_load) {
        var user_name = $scope.user_name;

        $.ajax({
            url: url_ws + "masterdata/get_master_functionallocation",
            data: '{"user_name":"' + user_name + '"}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
            headers: {
                'Authorization': $scope.token 
            },
            beforeSend: function () {
                $("#divLoading").show();
            },
            complete: function () {
                $("#divLoading").hide();
            },
            success: function (data) {
                var arr = data;
                $scope.data_all = arr;
                $scope.data = arr.data;
                $scope.data_drawing = arr.drawing;
                $scope.data_def = clone_arr_newrow(arr.data);
                setDataFilter()
                setPagination()
                get_max_id();
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

    function uploadFile(file_obj, seq, file_name, file_size) {
        var fd = new FormData();
        //Take the first selected file
        fd.append("file_obj", file_obj);
        fd.append("file_seq", seq);
        fd.append("file_name", file_name);
        fd.append("module", 'functional_location');

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
                            arr[0].action_change = 0;
                            arr[0].document_file_name = file_name;
                            arr[0].document_file_path = service_file_url + file_path;// (url_ws.replace('/api/', '/')) + 'AttachedFileTemp/Hazop/' + file_name;
                            arr[0].document_file_size = file_size;
                            arr[0].document_module = "functional_location";
                            arr[0].module = "functional_location"
                            $scope.$apply();

                        }
                    } else {
                        // 
                        console.error('มีข้อผิดพลาด: ' + request.status);
                    }
                }
            };

            request.send(fd);

        } catch { }

        return "";
    }


    ///////////////////////////  Main Functions  ///////////////////////////
    $scope.confirmSave = function () {
        if(!validation()) {
            return showAlert(`Invalid Data`,`The data you entered is invalid. Please check and try again.`, `error`);
        } 

        showConfirm(   'Are you sure?',    
            'Do you really want to proceed?', 
            'info',              
            'Yes, Save',            
            'No',  
            '#3874ff',      
            function() {
                save_data();
            }
        );
    }

    $scope.confirmBack = function () {
        window.open("/Master/Index", "_top");
    }

    $scope.newData = function () {
        var seq = Number($scope.MaxSeqData);
        var newInput = clone_arr_newrow($scope.data_def)[0];
        newInput.seq = seq;
        newInput.id = seq;
        newInput.active_type = 1;
        newInput.functional_location = '';
        newInput.action_type = 'insert';
        newInput.action_change = 1;
        $scope.data.push(newInput);
        $scope.MaxSeqData = Number($scope.MaxSeqData) + 1
        setDataFilter()
        setPagination()
        $scope.setPage($scope.totalPages)
        newTag(`new-${seq}`)
        apply()
    }

    $scope.removeData = function(item){
        showConfirm(   'Are you sure?',             // Title
            'Do you really want to proceed?', // Text
            'error',                   // Icon (e.g., 'success', 'error', 'warning')
            'Yes, Delete',              // Custom text for the confirm button
            'No',  
            '#d33',      
            function() {
                if(!item) return showAlert('Error', 'Data remove not Found!', 'error');

                var del_item = $filter('filter')($scope.data, function (_item) {
                    return (_item.seq == item.seq);
                })[0];
        
                if(!del_item) return showAlert('Error', 'Data remove not Found!', 'error');
        
                $scope.data_delete.push(del_item)

                $scope.data = $filter('filter')($scope.data, function (_item) {
                    return (_item.seq != del_item.seq);
                });

                showAlert('Success', 'Data has been successfully Deleted.', 'success', function() {
                    setDataFilter()
                    setPagination()
                    apply();
                });
            }
        );
    }

    $scope.actionChangedData = function (arr, field) {
        arr.action_change = 1;

        if (field == "accept_status") {
            arr.active_type = 0
        } else if (field == "inaccept_status") {
            arr.active_type = 1
        }
        apply();
    }

    function check_data() {
        var arr_active = [];
        angular.copy($scope.data, arr_active);
        var arr_json = $filter('filter')(arr_active, function (item) {
            return ((item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert');
        });

        for (var i = 0; i < $scope.data_delete.length; i++) {
            $scope.data_delete[i].action_type = 'delete';
            arr_json.push($scope.data_delete[i]);
        }
        console.log(arr_json)
        return angular.toJson(arr_json);
    }

    function check_data_drawing() {    
        // var arr_active = [];
        // angular.copy($scope.data_drawing, arr_active);
        // var arr_json = $filter('filter')(arr_active, function (item) {
        //     return ((item.action_type == 'update' && item.action_change == 1) || item.action_type == 'insert');
        // });

        // for (var i = 0; i < $scope.data_drawing_delete.length; i++) {
        //     $scope.data_drawing_delete[i].action_type = 'delete';
        //     arr_json.push($scope.data_drawing_delete[i]);
        // }
    
        return angular.toJson([]);
    }

    function apply() {
        try {
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        } catch { }
    };
    
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

    function get_max_id() {
        var arr = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'seq'); });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqData = iMaxSeq;
    }

    function arr_def() {
        $scope.user = JSON.parse(localStorage.getItem('user'));
        $scope.token = JSON.parse(localStorage.getItem('token'))
        $scope.user_name = $scope.user['user_name'];
        $scope.flow_role_type = $scope.user['role_type'];
        // $scope.user_name = conFig.user_name();
        // $scope.flow_role_type = conFig.role_type();//admin,request,responder,approver
        $scope.data_all = [];
        $scope.data = [];
        //ไม่แน่ใจว่า list เก็บ model เป็น value หรือ text นะ 
        $scope.data_filter = [{ id_key1: 0, id_key2: 0 }];
        $scope.data_delete = [];
    }

    function get_data(page_load) {
        arr_def();
        var user_name = conFig.user_name();
        call_api_load(page_load, user_name);
    }

    function get_data_after_save(page_load) {
        var user_name = conFig.user_name();
        call_api_load(false, user_name);
    }

    ///////////////////////////  Pagination  ///////////////////////////
    function setPagination(){
        // Pagination settings
        $scope.pageSize = 8; // จำนวนข้อมูลต่อหน้า
        $scope.currentPage = 1; // หน้าปัจจุบัน
        $scope.totalPages = Math.ceil($scope.data_filter.length / $scope.pageSize); // จำนวนหน้าทั้งหมด
        // สร้างลิสต์ของตัวเลขหน้า
        $scope.pages = Array.from({ length: $scope.totalPages }, (v, k) => k + 1);
        $scope.paginate()
    }

    // ฟังก์ชันสำหรับจัดข้อมูลตามหน้า
    $scope.paginate = function() {
        const start = ($scope.currentPage - 1) * $scope.pageSize;
        const end = start + $scope.pageSize;
        $scope.paginatedData = $scope.data_filter.slice(start, end);
    };

    // ฟังก์ชันสำหรับเปลี่ยนหน้า
    $scope.setPage = function(page) {
        $scope.currentPage = page;
        $scope.paginate();
    };

    // ฟังก์ชันสำหรับไปหน้าก่อนหน้า
    $scope.prevPage = function() {
        if ($scope.currentPage > 1) {
        $scope.currentPage--;
        $scope.paginate();
        }
    };

    // ฟังก์ชันสำหรับไปหน้าถัดไป
    $scope.nextPage = function() {
        if ($scope.currentPage < $scope.totalPages) {
        $scope.currentPage++;
        $scope.paginate();
        }
    };

    //////////////////////////  Future ///////////////////////////
    function validation(){
        var list = $filter('filter')($scope.data, function (_item) {
            return (!_item.functional_location);
        });
        if(list.length > 0) return false
        return true
    }

    function setDataFilter(){
        // $scope.data.sort((a, b) => b.seq - a.seq);
        $scope.data_filter = $scope.data
    }

    function newTag(id_elemet){
        setTimeout(() => {
            var element = document.getElementById(id_elemet);
            element.classList.remove("hidden");
        }, 10);
    }

    function validationNumber(data, field) {
        const cleanedValue = data[field].replace(/[^0-9]/g, '');
        if (cleanedValue === '') {
            data[field] = null;
        } else {
            data[field] = cleanedValue;
        }
    }

    $scope.truncateFilename = function(filename, length) {
        if (!filename) return '';
        if (filename.length <= length) return filename;
        const start = filename.slice(0, Math.floor(length / 2));
        const end = filename.slice(-Math.floor(length / 2));
        return `${start}...${end}`;
    };

    //////////////////////////  Upload File ///////////////////////////
    $scope.triggerFileUpload = function () {
        // Trigger the click event on the hidden file input
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.click();
        }
    };
    
    $scope.handleFileSelect = function (input) {
        // Check if a file is selected
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            const fileName = file.name;
            const fileSize = Math.round(file.size / 1024); // File size in KB
    
            // Update the scope variable with the selected file name
            $scope.$apply(function () {
                $scope.fileName = `${fileName} ${fileSize} (KB)`; // Update the fileName to display on the button
            });
    
            console.log('File selected:', file);
    
            // Check file size (should be <= 10 MB)
            if (fileSize > 10240) { // 10 MB in KB
                set_alert('Warning', 'File size is too large. Please select a file smaller than 10 MB.');
                $scope.fileName = '';
                input.value = ''; // Clear the input to allow re-selection
                apply()
                return;
            }
    
            // Determine file type and handle accordingly
            if (fileName.toLowerCase().endsWith('.pdf')) {
                // Handle PDF file
                uploadFile(file, '', fileName, fileSize)
                // processPDFFile(file);
            } else if (fileName.toLowerCase().endsWith('.xls') || fileName.toLowerCase().endsWith('.xlsx')) {
                // Handle Excel file
                // processExcelFile(file);
            } else {
                set_alert('Warning', 'Please select a PDF or Excel file.');
                $scope.$apply(function () {
                    $scope.fileName = ''; // Reset file name if the type is incorrect
                });
                input.value = ''; // Clear the input to allow re-selection
            }
        } else {
            console.log('No file selected');
        }
    };
    
    function processPDFFile(file) {
        // Logic to process the PDF file
        console.log('Processing PDF file...');
        
        // Example: Reading PDF file with FileReader
        const reader = new FileReader();
        reader.onload = function (e) {
            const contents = e.target.result;
            console.log('PDF contents:', contents);
    
            // Further PDF processing (e.g., displaying the file)
        };
        reader.readAsArrayBuffer(file);
    }
    
    function processExcelFile(file) {
        // Logic to process the Excel file
        console.log('Processing Excel file...');
        
        // Use SheetJS to parse the Excel file
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = e.target.result;
            
            const workbook = XLSX.read(data, { type: 'binary' });
            
            // Get the first sheet's name
            const firstSheetName = workbook.SheetNames[0];
            
            // Get the first sheet's data
            const worksheet = workbook.Sheets[firstSheetName];
            
            // Convert the sheet data to JSON (or another format as needed)
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            console.log('Excel data:', jsonData);
    
            // Perform further processing on the Excel data
        };
        reader.readAsBinaryString(file);
    }
    

    //////////////////////////  Alert ///////////////////////////
    function showAlert(title, text, icon, callback) {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            showConfirmButton: false, // ซ่อนปุ่มยืนยัน
            timer: 3000, // ตั้งเวลาให้ปิดเองหลังจาก 3 วินาที
            timerProgressBar: true, // แสดง progress bar
        }).then((result) => {
            if (typeof callback === 'function') {
                callback();
            }
        });
    }
    
    function showConfirm(title, text, icon, 
        confirmButtonText = 'OK', 
        cancelButtonText = 'Cancel', 
        confirmButtonColor, 
        callback) {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            showConfirmButton: true, // Show the confirm button
            showCancelButton: true, // Show the cancel button
            confirmButtonText: confirmButtonText, // Custom text for the confirm button
            cancelButtonText: cancelButtonText, // Custom text for the cancel button
            timer: null, // Do not auto-close
            timerProgressBar: false, // Disable progress bar
            confirmButtonColor: confirmButtonColor,
        }).then((result) => {
            // Check if the user clicked the confirm button
            if (result.isConfirmed && typeof callback === 'function') {
                callback();
            }
        });
    }
});

