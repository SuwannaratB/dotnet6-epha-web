
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

    function replace_hashKey_arr(_arr) {
        var json = JSON.stringify(_arr, function (key, value) {
            if (key === "$$hashKey") {
                return undefined;
            }
            return value;
        });
        return json;
    }
    page_load();
    $scope.handleLinkClick = function (val) {
        // ทำสิ่งต่าง ๆ เมื่อคลิกลิงก์
        console.log('Link clicked!');
        // คุณสามารถเพิ่มโค้ดอื่น ๆ ที่คุณต้องการทำในฟังก์ชันนี้ได้
         
    }

    function arr_def() {
    
        $scope.flow_role_type = conFig.role_type();//admin,request,responder,approver
        $scope.user_name = conFig.user_name();

        $scope.data_all = []; 
        $scope.data_resulte = [];  
    }
    function page_load() {
        arr_def();
        get_data(true);
    }
    function get_data(page_load) {
        var user_name = $scope.user_name;
        var token_doc = '';

        var sub_software = '';
        var type_doc = 'search';

        $.ajax({
            url: url_ws + "Flow/load_notification",
            data: '{"sub_software":"' + sub_software +'","user_name":"' + user_name + '","token_doc":"' + token_doc + '","type_doc":"' + type_doc + '"}',
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
                $scope.data_all = arr;
 
                $scope.data_resulte = JSON.parse(replace_hashKey_arr(arr.resulte));
      
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
  
    $scope.selectDaily = function (arr) {

        $scope.tabUpdateFollowUp = true;

        var controller_text = 'hazop'; 
        var pha_seq = arr.pha_seq; 
        var pha_no = arr.pha_no; 
        var pha_sub_software = arr.pha_sub_software; 
 

        $.ajax({
            url: url_ws + "Flow/send_notification_daily",
            data: '{"pha_seq":"' + pha_seq + '","pha_no":"' + pha_no + '"'
                + ',"sub_software":"' + pha_sub_software + '"}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
            beforeSend: function () {
                $("#divLoading").show();
            },
            complete: function () {
                $("#divLoading").hide();
            },
            success: function (data) {
                console.log(data); 
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

   
    $scope.selectMemberReview = function (arr) {

        $scope.tabUpdateFollowUp = true;

        var controller_text = 'hazop'; 
        var pha_seq = arr.pha_seq; 
        var pha_no = arr.pha_no; 
        var pha_sub_software = arr.pha_sub_software; 
 

        $.ajax({
            url: url_ws + "Flow/send_notification_member_review",
            data: '{"pha_seq":"' + pha_seq + '","pha_no":"' + pha_no + '"'
                + ',"sub_software":"' + pha_sub_software + '"}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
            beforeSend: function () {
                $("#divLoading").show();
            },
            complete: function () {
                $("#divLoading").hide();
            },
            success: function (data) {
                console.log(data);
                alert(data);
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

});
