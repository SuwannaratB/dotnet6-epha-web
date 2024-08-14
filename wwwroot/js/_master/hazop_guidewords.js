
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

    $scope.actionChange = function (_arr, field) {
        //var _seq = _arr.seq;

        //$scope.data_filter[0].id = _seq;
        //apply();

        //action_type_changed(_arr, _seq);
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

    $("#divLoading").hide();
    $scope.handleLinkClick = function (val) {
        // ทำสิ่งต่าง ๆ เมื่อคลิกลิงก์
        console.log('Link clicked!');
        // คุณสามารถเพิ่มโค้ดอื่น ๆ ที่คุณต้องการทำในฟังก์ชันนี้ได้ 
        $scope.tabChange = val;
    }

    //call ws get data
    if (true) {
        get_data(true);

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
        }
    
        $scope.clearFileName = function (inputId) {
            var fileUpload = document.getElementById('file-upload-' + inputId);
            var fileNameDisplay = document.getElementById('fileNameDisplay-' + inputId);
            var del = document.getElementById('del' + inputId);
            fileUpload.value = ''; // ล้างค่าใน input file
            fileNameDisplay.textContent = ''; // ล้างข้อความที่แสดงชื่อไฟล์
            del.style.display = "none";
        }

        function truncateFilename(filename, length) {
            if (!filename) return '';
            if (filename.length <= length) return filename;
            const start = filename.slice(0, Math.floor(length / 2));
            const end = filename.slice(-Math.floor(length / 2));
            return `${start}.......${end}`;
          }

          $scope.fileSelect = function (input) {
            //drawing
    
            const fileInput = input;
            const fileSeq = fileInput.id.split('-')[1];
            const fileInfoSpan = document.getElementById('filename' + fileSeq);
    
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const fileName = file.name;
                const fileSize = Math.round(file.size / 1024);
                //fileInfoSpan.textContent = `${fileName} (${fileSize} KB)`;
    
                let shortenedFileName = fileName.length > 20 ? fileName.substring(0, 20) + '...' : fileName;
                fileInfoSpan.textContent = `${shortenedFileName} (${fileSize} KB)`;
    
    
                // if (fileName.toLowerCase().indexOf('.pdf') == -1) {
                //     fileInfoSpan.textContent = "";
                //     set_alert_warning('Warning', 'Please select a PDF file.');
                //     $scope.status_upload = false;
    
                //     if ($scope.previousFile) {
                //         input = $scope.previousFile;
                //         document.getElementById('filename' + fileSeq).textContent = $scope.prevIileInfoSpan;
                //         $scope.status_upload = true;
                //     }
                //     return;
                // }
                var file_path = uploadFile(file, fileSeq, fileName, fileSize);
    
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
        }
        
        function uploadFile(file_obj, seq, file_name, file_size, json_drawing) {
    
            var fd = new FormData();
            //Take the first selected file
            // fd.append("file_obj", file_obj);
            // fd.append("file_seq", seq);
            // fd.append("file_name", file_name);
            // fd.append("file_size", file_size);
            // fd.append("module", 'guide_words');
            fd.append("json_drawing", JSON.stringify(json_drawing));
    
            try {
                const request = new XMLHttpRequest();
                request.open("POST", url_ws + 'masterdata/set_master_guidewords');
                //request.send(fd);
                // ,"json_drawing": ' + JSON.stringify(json_drawing)
    
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
                                arr[0].document_file_path = (url_ws.replace('/api/', '')) + file_path;// (url_ws.replace('/api/', '/')) + 'AttachedFileTemp/Hazop/' + file_name;
                                arr[0].document_file_size = file_size;
                                arr[0].document_module = "guide_words";
                                arr[0].module = "guide_words";
                                arr[0].seq = seq;
                                $scope.$apply();
    
                            }

                            console.log('file path' +file_path);
                        } else {
                            console.error('มีข้อผิดพลาด: ' + request.status);
                        }
                    }
                };
    
                request.send(fd);
    
            } catch { }
    
            return "";
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
    
        }

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
            url: url_ws + "masterdata/set_master_guidewords",
            data: '{"user_name":"' + user_name + '"'
                + ',"role_type":"' + flow_role_type + '"'
                + ',"json_data": ' + JSON.stringify(json_data)
                + ',"json_drawing": ' + JSON.stringify(json_drawing)
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
            url: url_ws + "masterdata/get_master_guidewords",
            data: '{"user_name":"' + user_name + '"}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
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
                $scope.master_parameter = arr.parameter;
                $scope.master_area_application = arr.area_application;
                $scope.data_filter = arr?.parameter?.length ? [{
                    id_parameter: arr.parameter[0].id,
                    id_area_application: 0
                }] : [{ id_parameter: 0, id_area_application: 0 }];
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

    ///////////////////////////  Main Functions  ///////////////////////////
    $scope.confirmBack = function () {
        window.open("/Master/Index", "_top");
    }

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

    $scope.newData = function (item) {
        //add new  
        var seq = Number($scope.MaxSeqDataSeq);
        var param = $scope.master_parameter.find(function(item) {
            return item.id === $scope.data_filter[0].id_parameter;
        });
        
        var area_application = $scope.master_area_application.find(function(item){
            return item.id === $scope.data_filter[0].id_area_application;
        })

        var newInput = clone_arr_newrow($scope.data_def)[0];
        newInput.seq = seq;
        newInput.id = seq;
        newInput.active_type = 1;
        newInput.guide_words = '';
        newInput.deviations = '';
        newInput.process_deviation = '';
        newInput.no_deviations = seq;
        newInput.no_guide_words = seq;
        newInput.def_selected = 0;
        newInput.id_parameter = null;
        newInput.id_area_application = null;
        newInput.parameter = null;
        newInput.area_application = null;
        newInput.action_type = 'insert';
        newInput.action_change = 1;
        $scope.data.push(newInput);
        $scope.MaxSeqDataSeq = Number($scope.MaxSeqDataSeq) + 1
        console.log(newInput)
        setDataFilter()
        setPagination()
        $scope.setPage($scope.totalPages)
        newTag(`new-${seq}`)
        apply();
    }

    $scope.removeData = function(seq, index) {
        // Show the confirmation dialog
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                // Perform the deletion if confirmed
                var arrdelete = $filter('filter')($scope.data, function(item) {
                    return item.seq == seq;
                });

                if (arrdelete.length > 0) {
                    $scope.data_delete.push(arrdelete[0]);
                }

                $scope.data = $filter('filter')($scope.data, function(item) {
                    return item.seq != arrdelete[0].seq;
                });

                if ($scope.data.length == 0) {
                    $scope.addData();
                    return;
                }
                
                $scope.$apply(); 
                
                // Show success message
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success",
                    timer: 1000,
                    showConfirmButton: false
                });
            }
        });
    }

    $scope.actionChangedData = function (arr, field) {
        arr.action_change = 1;
        if (field === "active_type") {

            arr.active_type = arr.active_type === '1' ? '1' : '0';  // Checkbox state determines the value
        } else if (field === "def_selected") {
            arr.def_selected = arr.def_selected === '1' ? '1' : '0';
        }
        apply();
        console.log('Updated item:', arr);
    }

    $scope.actionfilter = function(section, data){

        if((!$scope.selected['application'] && parseNumber($scope.selected['application']) != 0)&&
            (!$scope.selected['parameter'] && parseNumber($scope.selected['parameter']) != 0)
        ) {
            $scope.data_filter = $scope.data
            return setPagination()
        }

        $scope.data_filter = $filter('filter')($scope.data, function (_item) {
            return ($scope.selected['application'] || parseNumber($scope.selected['application']) == 0 ? _item.id_area_application == $scope.selected['application'] : true ) && 
                    ($scope.selected['parameter'] || parseNumber($scope.selected['parameter']) == 0 ? _item.id_parameter == $scope.selected['parameter']: true);
        });
        console.log($scope.data_filter )
        return setPagination()
    }

    function get_max_id() {
        var arr = $filter('filter')($scope.data_all.max, function (item) { return (item.name == 'seq'); });
        var iMaxSeq = 1; if (arr.length > 0) { iMaxSeq = arr[0].values; }
        $scope.MaxSeqDataSeq = iMaxSeq;
    }

    function arr_def() {
        $scope.data_all = [];
        $scope.data = [];
        //ไม่แน่ใจว่า list เก็บ model เป็น value หรือ text นะ 
        $scope.data_filter = [{ id_parameter: 0, id_area_application: 0 }];
        $scope.data_delete = [];
        $scope.data_drawing = [];
        $scope.data_drawing_delete = [];
        $scope.selected = {
            application: '',
            parameter: ''
        }
        $scope.user_name = conFig.user_name();
        $scope.flow_role_type = conFig.role_type();//admin,request,responder,approver
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
        return ""
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
            return (!_item.deviations || 
                    !_item.guide_words || 
                    !_item.process_deviation 
                    // || 
                    // (!_item.id_parameter && _item.id_parameter != 0) || 
                    // (!_item.id_area_application && _item.id_area_application != 0 )
            );
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

    function parseNumber(value) {
        if (value === '') {
            return null; 
        }
        return Number(value);
    }

    $scope.truncateFilename = function(filename, length) {
        if (!filename) return '';
        if (filename.length <= length) return filename;
        const start = filename.slice(0, Math.floor(length / 2));
        const end = filename.slice(-Math.floor(length / 2));
        return `${start}...${end}`;
    };

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
