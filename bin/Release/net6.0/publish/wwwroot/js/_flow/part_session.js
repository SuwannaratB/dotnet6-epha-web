
AppMenuPage.controller("ctrlAppPage", function ($scope, $http, $filter, conFig) {

   // var url_ws = "https://localhost:7098/api/";
    var url_ws = conFig.service_api_url();
    //https://localhost:7098/api/Login/check_authorization
  
  // <===== (Kul)Session zone function  ======>   
    //$scope.selectDataEmpSession = [];
    $scope.MaxSeqDataSession = 1;
    $scope.selectDataSession = 1;

    $scope.addDataSession = function (seq) {
        $scope.MaxSeqDataSession = ($scope.MaxSeqDataSession) + 1;
        var xValues = $scope.MaxSeqDataSession;
        var newInput = { seq: xValues, meeting_date: '', meeting_start_time: '', meeting_end_time: '' };

        $scope.data_session.push(newInput);

        $scope.selectDataSession = xValues;

        running_no_session();
    }
    $scope.copyDataSession = function (seq) {

        $scope.MaxSeqDataSession = ($scope.MaxSeqDataSession) + 1;
        var xValues = $scope.MaxSeqDataSession;
        var newInput = { seq: xValues };

        var arr = $filter('filter')($scope.data_session, function (item) {
            return (item.seq == seq);
        });

        for (let i = 0; i < arr.length; i++) {
            var newInput = {
                seq: xValues
                , meeting_date: arr[i].meeting_date
                , meeting_start_time: arr[i].meeting_start_time
                , meeting_end_time: arr[i].meeting_end_time
            };
        };
        $scope.data_session.push(newInput);

        var arr = $filter('filter')($scope.selectDataEmpSession, { seq: seq });
        for (let i = 0; i < arr.length; i++) {
            var newInput = {
                employee_id: arr[i].employee_id
                , employee_name: arr[i].employee_name
                , employee_displayname: arr[i].employee_displayname
                , employee_email: arr[i].employee_email
                , employee_type: arr[i].employee_type
                , employee_img: arr[i].profile
                , selected: false
                , seq: xValues
            };

            $scope.selectDataEmpSession.push(newInput);

        }
        running_no_session();

        $scope.selectDataSession = xValues;

    }
    $scope.removeDataSession = function (seq) {

        $scope.data_session = $filter('filter')($scope.data_session, function (item) {
            return !(item.seq == seq);
        });

        if ($scope.data_session.length === 0) {
            $scope.addDataSession();
        }
        running_no_session();
    };
    function running_no_session() {
        for (let i = 0; i < $scope.data_session.length; i++) {
            $scope.data_session[i].no = (i + 1);
        };

    }
    $scope.openModalEmployeeCheck = function (seq) {
        $scope.selectDataSession = seq;
        //alert($scope.selectDataSession);
        var arr = $scope.employeelist;
        for (let i = 0; i < arr.length; i++) {

            try {

                var ar_check = $filter('filter')($scope.selectDataEmpSession, { seq: seq, id: arr[i].id });

                if (ar_check.length > 0) {
                    $scope.employeelist[i].selected = true;
                } else {
                    $scope.employeelist[i].selected = false;
                }
            } catch (e) { return; }

        };
    };

    $scope.filteredDataEmpSession = function () {
        //alert($scope.selectDataSession);

        var arr = $filter('filter')($scope.employeelist, { selected: true });
        try {
            if ($scope.selectDataEmpSession.length === 0) {
                $scope.selectDataEmpSession = [];
            }
        } catch (e) {
            $scope.selectDataEmpSession = [];
        }

        var seq = $scope.selectDataSession;
        for (let i = 0; i < arr.length; i++) {

            var ar_check = $filter('filter')($scope.selectDataEmpSession, { seq: seq, id: arr[i].id });
            if (ar_check.length > 0) { continue; }

            var newInput = {
                employee_id: arr[i].employee_id
                , employee_name: arr[i].employee_name
                , employee_displayname: arr[i].employee_displayname
                , employee_email: arr[i].employee_email
                , employee_type: arr[i].employee_type
                , employee_img: arr[i].employee_img
                , selected: false
                , seq: $scope.selectDataSession
            };

            $scope.selectDataEmpSession.push(newInput);

        }

        $apply();

    };
    $scope.removeDataEmpSession = function (id, seq_session) {
        $scope.selectDataEmpSession = $filter('filter')($scope.selectDataEmpSession, function (item) {
            return !(item.id == id && item.seq == seq_session);
        });
    };




});
