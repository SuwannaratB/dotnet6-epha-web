 

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
    function arr_def() {
        //AutoComplete
        $scope.autoText = {};
        $scope.filteredItems = {};

        $scope.selectViewTypeFollowup = true;
        $scope.action_part = 1;
        $scope.user_name = conFig.user_name();

        $scope.data_all = [];

        $scope.master_apu = [];
        $scope.master_bussiness_unit = [];
        $scope.master_unit_no = [];
        $scope.master_functional = [];


        $scope.data_results = [];
        $scope.data_conditions = [];

        $scope.flow_role_type = conFig.role_type();//admin,request,responder,approver
        $scope.flow_status = 0;

        $scope.exportfile = [{ DownloadPath: '', Name: '' }];
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
        $scope.searchBySeq = false;
        arr_def();
        get_data(true, false);
    }
    function get_data(page_load, type_clear) {
        var user_name = $scope.user_name;
        var token_doc = '';

        var sub_software = 'HAZOP';
        var type_doc = 'create';
        try {
            if (page_load == false) {
                sub_software = $scope.data_conditions[0].pha_sub_software;
            }
        } catch { }

        $.ajax({
            url: url_ws + "Flow/load_page_search_details",
            data: '{"sub_software":"' + (sub_software == 'WHAT\'S IF' ? 'WHATIF' : sub_software) + '","user_name":"' + user_name + '","token_doc":"' + token_doc + '","type_doc":"' + type_doc + '"}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
            beforeSend: function () {
                if (page_load == false) {
                    //$('#divLoading').hide(); 
                }
                $('#divLoading').show();
            },
            complete: function () {
                if (page_load == false) {
                    //$('#divLoading').hide(); 
                }
                $('#divLoading').hide();
            },
            success: function (data) {
                var arr = data;
                console.log(arr);

                setTimeout(function () { var v = 0; }, 10000);

                $scope.master_business_unit = null;
                $scope.master_unit_no = null;

                $scope.data_all = arr;
                //apu, business_unit, unit_no, functional, approver, company, toc, tagid
                $scope.master_apu = JSON.parse(replace_hashKey_arr(arr.apu));
                $scope.master_unit_no = JSON.parse(replace_hashKey_arr(arr.unit_no));
                if (arr.business_unit != null) {
                    $scope.master_business_unit = JSON.parse(replace_hashKey_arr(arr.business_unit));
                    $scope.master_functional = JSON.parse(replace_hashKey_arr(arr.functional));
                }
                //$scope.master_approver = JSON.parse(replace_hashKey_arr(arr.approver));

                if (sub_software == "JSEA") {
                    try {
                        $scope.master_company = JSON.parse(replace_hashKey_arr(arr.company));
                        $scope.master_toc = JSON.parse(replace_hashKey_arr(arr.toc));
                        $scope.master_tagid = JSON.parse(replace_hashKey_arr(arr.tagid));

                    } catch { }
                }

                var iNoNew = 1;
                for (let i = 0; i < arr.results.length; i++) {
                    arr.results[i].no = (iNoNew);
                    iNoNew++;
                };

                $scope.data_results_def = arr.results;
                $scope.data_results = arr.results;

                $scope.data_conditions = arr.conditions;
                if ($scope.data_conditions[0].pha_sub_software == null) {
                    $scope.data_conditions[0].pha_sub_software = sub_software.toUpperCase();
                    $scope.data_conditions[0].expense_type = 'OPEX';
                    $scope.data_conditions[0].id_apu = null;
                    $scope.data_conditions[0].approver_user_name = null;
                }
                angular.copy($scope.data_conditions, $scope.data_conditions_def);

                //แสดงปุ่ม 
                $scope.cancle_type = true;
                $scope.export_type = false;
                $scope.submit_type = true;
                $scope.search_type = true;
                $scope.clear_type = true;


                $scope.master_unit_no_show = $filter('filter')($scope.master_unit_no, function (item) { return (item.id_apu == $scope.master_apu[0].id); });

                if ($scope.data_conditions[0].master_apu == null || $scope.data_conditions[0].master_apu == '') {
                    $scope.data_conditions[0].master_apu = null;
                    var arr_clone_def = { id: $scope.data_conditions[0].master_apu, name: 'Please select' };
                    $scope.master_apu.splice(0, 0, arr_clone_def);
                }
                if ($scope.data_conditions[0].master_unit_no == null || $scope.data_conditions[0].master_unit_no == '') {
                    $scope.data_conditions[0].master_unit_no = null;
                    var arr_clone_def = { id: $scope.data_conditions[0].master_unit_no, name: 'Please select' };
                    $scope.master_unit_no.splice(0, 0, arr_clone_def);
                }

                if (sub_software == "JSEA") {

                } else if (sub_software == "HRA") {

                } else {
                    if ($scope.data_conditions[0].master_functional == null || $scope.data_conditions[0].master_functional == '') {
                        $scope.data_conditions[0].master_functional = null;
                        var arr_clone_def = { id: $scope.data_conditions[0].master_functional, name: 'Please select' };
                        $scope.master_functional.splice(0, 0, arr_clone_def);
                    }
                    if ($scope.data_conditions[0].id_business_unit == null) {
                        $scope.data_conditions[0].id_business_unit = null;
                        var arr_clone_def = { id: $scope.data_conditions[0].id_business_unit, name: 'Please select' };
                        $scope.master_business_unit.splice(0, 0, arr_clone_def);
                    }
                }

                apply();
                console.log($scope);
                try {
                    const choicesapu = new Choices('.js-choice-apu');
                    const choicesfunc = new Choices('.js-choice-functional');
                    const choicesbu = new Choices('.js-choice-business_unit');
                    const choicesunit = new Choices('.js-choice-unit_no');
                    const choicesapprover = new Choices('.js-choice-approver');

                    const choices0 = new Choices('.js-choice-company');
                    const choices1 = new Choices('.js-choice-apu-jsea');
                    const choices2 = new Choices('.js-choice-toc');
                    const choices3 = new Choices('.js-choice-unit_no-jsea');
                    const choices4 = new Choices('.js-choice-tagid');
                    //const choices5 = new Choices('.js-choice-tagid_audition');
                } catch { }
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
    $scope.SubSoftwateChange = function () {
        //alert($scope.data_conditions[0].pha_sub_software);

        $scope.data_conditions[0].pha_sub_software =
            ($scope.data_conditions[0].pha_sub_software == "WHAT'S IF" ? 'WHATIF' : $scope.data_conditions[0].pha_sub_software);

        get_data(false, false);

    }

    $scope.selectDoc = function (item) {

        var controller_text = item.pha_sub_software;

        conFig.pha_seq = item.seq;
        conFig.pha_type_doc = 'edit';
        conFig.pha_status = item.pha_status;
        conFig.pha_sub_software = item.pha_sub_software;

        next_page(controller_text, conFig.pha_status);
    }

    $scope.editDoc = function (item) {

        var controller_text = item.pha_sub_software;

        conFig.pha_seq = item.seq;
        conFig.pha_type_doc = 'edit';
        conFig.pha_status = item.pha_status;
        conFig.pha_sub_software = item.pha_sub_software;

        next_page(controller_text, conFig.pha_status, conFig.pha_type_doc);
    }
    $scope.actionChange = function (item) {

        try {
            var arr_search =
                $filter('filter')($scope.data_results_def, function (_item) {
                    return (
                        (item.pha_sub_software == null ? 'x' : _item.pha_sub_software).toLowerCase()
                        == (item.pha_sub_software == null ? 'x' : item.pha_sub_software).toLowerCase()

                        && (item.expense_type == null ? 'x' : _item.expense_type).toLowerCase()
                        == (item.expense_type == null ? 'x' : item.expense_type).toLowerCase()

                        && (item.sub_expense_type == null ? 'x' : _item.sub_expense_type ? _item.sub_expense_type.toLowerCase() : _item.sub_expense_type)
                        == (item.sub_expense_type == null ? 'x' : item.sub_expense_type ? item.sub_expense_type.toLowerCase() : item.sub_expense_type)

                        && (_item.reference_moc == null || item.reference_moc == '' ? 'x' : _item.reference_moc.toLowerCase())
                            .includes((item.reference_moc == null || item.reference_moc == '' ? 'x' : item.reference_moc.toLowerCase()))

                        && (_item.pha_request_name == null || item.pha_request_name == '' ? 'x' : _item.pha_request_name.toLowerCase())
                            .includes((item.pha_request_name == null || item.pha_request_name == '' ? 'x' : item.pha_request_name.toLowerCase()))

                        && (item.project_no == null ? 'x' : _item.pha_no.toLowerCase())
                            .includes((item.project_no == null ? 'x' : item.project_no.toLowerCase()))

                        && (item.create_date == null ? true : formatDate(item.create_date, _item.create_date))

                        && (item.id_apu == null ? true : _item.id_apu == item.id_apu)
                        && (item.functional_location == null ? true : _item.functional_location == item.functional_location)
                        && (item.id_business_unit == null ? true : _item.id_business_unit == item.id_business_unit)
                        && (item.id_unit_no == null ? true : _item.id_unit_no == item.id_unit_no)

                        && (item.id_toc == null ? true : parseInt(_item.id_toc) == parseInt(item.id_toc))
                        && (item.id_tagid == null ? true : parseInt(_item.id_tagid) == parseInt(item.id_tagid))
                        && (item.id_company == null ? true : parseInt(_item.id_company) == parseInt(item.id_company))

                        && (item.expense_type == 'CAPEX' && item.sub_expense_type == 'Normal' ?
                            (item.approver_user_name == null ? 'x' : _item.approver_user_name)
                            == (item.approver_user_name == null ? 'x' : item.approver_user_name) : true)

                        //&& (item.emp_active_search == null ? true : 

                        //    (item.emp_active_search == null ? 'x' : _item.emp_active_search.toLowerCase())
                        //        .includes((item.emp_active_search == null ? 'x' : item.emp_active_search.toLowerCase()))
                        
                        //) 
                    );
                });

            arr_search =
                $filter('filter')(arr_search, function (_item) {
                    return (
                        (item.emp_active_search == null ? 'x' : _item.emp_active_search.toLowerCase())
                            .includes((item.emp_active_search == null ? 'x' : item.emp_active_search.toLowerCase()))
                    );
                });
            $scope.data_results = arr_search ;
            apply();
        } catch {

        }
    }

    $scope.confirmCancle = function () {
        var page = 'home/Portal';
        window.open(page, "_top")
    }
    $scope.confirmClear = function () {
        get_data(false, true);
    }
    $scope.confirmSearch = function () {

        get_data(true, false);
    }
    function next_page(controller_text, pha_status, editPage) {
        controller_text = controller_text.toLowerCase();

        $.ajax({
            url: controller_text + "/next_page",
            data: '{"pha_seq":"' + conFig.pha_seq + '","pha_seq":"' + conFig.pha_seq + '","pha_type_doc":"' + conFig.pha_type_doc + '"'
                + ',"pha_sub_software":"' + controller_text + '","pha_status":"' + pha_status + '"}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
            beforeSend: function () {
                //$('#divLoading').show(); 
                $('#divLoading').show();
            },
            complete: function () {
                //$('#divLoading').hide(); 

                $('#divLoading').hide();
            },
            success: function (data) {
                // var arr = data;
                // window.open(data.page, "_top");
                window.open(`${data.page}?data=` + encodeURIComponent(editPage), '_top');
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

    function formatDate(create_date, datepicker) {
        const createDate = new Date(create_date);
        const datePickerDate = new Date(datepicker);
        // กำหนด Time Zone ของ datepickerDate ให้เท่ากับ createDate
        datePickerDate.setHours(createDate.getHours());
        datePickerDate.setMinutes(createDate.getMinutes());
        datePickerDate.setSeconds(createDate.getSeconds());
        datePickerDate.setMilliseconds(createDate.getMilliseconds());

        if (datePickerDate.getTime() !== createDate.getTime()) {
            return false;
        }

        return true;
    }

    //search list function
    $scope.autoComplete = function (DataFilter, idinput) {

        if ($scope.autoText[idinput] && $scope.autoText[idinput].length > 0) {
            $scope.filteredItems[idinput] = DataFilter.filter(function (item) {
                return item.name.toLowerCase().includes($scope.autoText[idinput].toLowerCase());
            });

            var dropdown = document.querySelector(`.autocomplete-dropdown-${idinput}`);
            if (dropdown) {
                dropdown.style.display = 'block';
            }
        } else {
            $scope.filteredItems[idinput] = DataFilter;
            var dropdown = document.querySelector(`.autocomplete-dropdown-${idinput}`);
        }
    };

    $scope.selectItem = function (item, idinput) {
        $scope.autoText[idinput] = item.name;
        $scope.filteredItems[idinput] = [];
        console.log($scope.autoText)

        var dropdown = document.querySelector(`.autocomplete-dropdown-${idinput}`);
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    };
    $scope.confirmExport = function (_item, data_type) {

        var user_name = ($scope.user_name + '');
        var seq = _item.seq;
        var sub_software = _item.pha_sub_software;

        $.ajax({
            url: url_ws + "Flow/export_" + sub_software + "_report",
            data: '{"sub_software":"' + sub_software + '","user_name":"' + user_name + '","seq":"' + seq + '","export_type":"' + data_type + '"}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
            beforeSend: function () {
                //$('#divLoading').show();

                $('#modalExportFile').modal('hide');
                $('#divLoading').show();
            },
            complete: function () {
                //$('#divLoading').hide();
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
                        //$('#divLoading').hide();
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

    $scope.selectManageDocument = function (item, action_type) {

        $scope.user_name_select = $scope.user_name;
        $scope.sub_software_select = item.pha_sub_software;
        $scope.pha_no_select = item.pha_no;
        $scope.pha_seq_select = item.seq;
        $scope.manage_document_type = action_type;


        $('#modalManageDocumentConfirm').modal('show');
        $('#divLoading').hide();
    }
    $scope.confirmManageDocument = function () {

        $('#modalManageDocumentConfirm').modal('hide');
         
        var action_type = $scope.manage_document_type;
        var user_name = $scope.user_name_select;
        var sub_software = $scope.sub_software_select;
        var pha_no = $scope.pha_no_select;
        var pha_seq = $scope.pha_seq_select;

        sub_software = (sub_software == 'WHAT\'S IF' ? 'WHATIF' : sub_software).toLowerCase();

        if (action_type == 'copy') {
            //copy and open doc

            $.ajax({
                url: url_ws + "Flow/manage_document_copy",
                data: '{"user_name":"' + user_name + '","sub_software":"' + sub_software + '"' +
                    ',"pha_no":"' + pha_no + '","pha_seq":"' + pha_seq + '"}',
                type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
                beforeSend: function () {
                    $('#divLoading').show();
                },
                complete: function () {
                    $('#divLoading').hide();
                },
                success: function (data) {
                    var arr = data;
                    console.log(arr);
                    if (arr[0].status == 'true') {

                        var controller_text = 'HAZOP'; //เนื่องจากไม่ได้แยกตาม module ให้ชี้ไป hazop ที่เดียว
                        conFig.pha_type_doc = 'edit';
                        conFig.pha_sub_software = sub_software;
                        conFig.pha_seq = arr[0].seq_new;
                        conFig.pha_status = arr[0].pha_status;

                        next_page(controller_text, conFig.pha_status);

                    } else {
                        alert(arr[0].status + ',msg error: ' + arr[0].remark);
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
        else if (action_type == 'cancel') {
            //copy and open doc

            $.ajax({
                url: url_ws + "Flow/manage_document_cancel",
                data: '{"user_name":"' + user_name + '","sub_software":"' + sub_software + '"' +
                    ',"pha_no":"' + pha_no + '","pha_seq":"' + pha_seq + '"}',
                type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
                beforeSend: function () {
                    $('#divLoading').show();
                },
                complete: function () {
                    $('#divLoading').hide();
                },
                success: function (data) {
                    var arr = data;
                    console.log(arr);
                    if (arr[0].status == 'true') {
                        $scope.SubSoftwateChange();
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

    $(document).ready(function () {
        page_load();
    });
});
