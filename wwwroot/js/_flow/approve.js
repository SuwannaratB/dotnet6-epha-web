
AppMenuPage.controller("ctrlAppPage", function ($scope, $http, $filter, conFig) {
    var url_ws = conFig.service_api_url();
    function apply() {
        try {
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        } catch { }
    }

    $('#modalApprove').hide();
    save_data();

    function save_data() {

        if (conFig.pha_type_doc() == "") { window.open('home/portal', "_top"); return; }

        $scope.pha_type_doc = conFig.pha_type_doc();

        var user_name = conFig.user_name();
        var role_type = conFig.role_type();

        var pha_seq = conFig.pha_seq();
        var action = conFig.pha_type_doc();
        var comment = "";

        var arr_data = [{ pha_seq: pha_seq, action: action, user_name: user_name }];
        var json_header = angular.toJson(arr_data);

        $.ajax({
            url: url_ws + "Flow/set_approve",
            data: '{"user_name":"' + user_name + '","role_type":"' + role_type + '","token_doc":"' + pha_seq + '","action":"' + action + '","comment":"' + comment + '"}',
            type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
            headers: {
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val() // รับค่าจาก form เพื่อป้องกัน CSRF
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
                if (arr[0].status == 'true') {
                    $('#modalApprove').show();
                } else {
                    window.open('home/portal', "_top");
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

    $scope.confirmBack = function () {

        window.open('home/portal', "_top");
        return;

    }



});
