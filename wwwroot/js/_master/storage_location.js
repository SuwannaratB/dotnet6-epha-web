AppMenuPage.filter("MultiFieldFilter", function () {
  return function (items, searchText) {
    if (!searchText) {
      return items;
    }

    searchText = searchText.toLowerCase();

    return items.filter(function (item) {
      return item.document_number
        .toLowerCase()
        .includes(searchText.toLowerCase());
    });
  };
});

AppMenuPage.filter("groupBy", function () {
  return function (items, key) {
    if (!items || !key) return items;

    let groupedItems = [];
    let uniqueKeys = new Set();

    items.forEach(function (item) {
      if (!uniqueKeys.has(item[key])) {
        uniqueKeys.add(item[key]);
        groupedItems.push(item);
      }
    });

    return groupedItems;
  };
});

AppMenuPage.controller(
  "ctrlAppPage",
  function ($scope, $http, $filter, conFig) {
    //  scroll  table header freezer
    $scope.handleScroll = function () {
      const tableContainer = angular.element(
        document.querySelector("#table-container")
      );
      const thead = angular.element(document.querySelector("thead"));

      if (tableContainer && thead) {
        const containerRect = tableContainer[0].getBoundingClientRect();
        const containerTop = containerRect.top;
        const containerBottom = containerRect.bottom;

        const tableRect = thead[0].getBoundingClientRect();
        const tableTop = tableRect.top;
        const tableBottom = tableRect.bottom;

        if (containerTop > tableTop || containerBottom < tableBottom) {
          thead.addClass("sticky");
        } else {
          thead.removeClass("sticky");
        }
      }
    };

    var url_ws = conFig.service_api_url();

    function apply() {
      try {
        if (
          $scope.$root.$$phase != "$apply" &&
          $scope.$root.$$phase != "$digest"
        ) {
          $scope.$apply();
        }
      } catch {}
    }
    function clone_arr_newrow(arr_items) {
      var arr_clone = [];
      var arr_clone_def = [];
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
        } else {
          arr_clone = arr_clone_def;
        }
      } catch {}
      return arr_clone;
    }

    $("#divLoading").hide();
    $scope.handleLinkClick = function (val) {
      // ทำสิ่งต่าง ๆ เมื่อคลิกลิงก์
      console.log("Link clicked!");
      // คุณสามารถเพิ่มโค้ดอื่น ๆ ที่คุณต้องการทำในฟังก์ชันนี้ได้
      $scope.tabChange = val;
    };

    //call ws get data
    if (true) {
      get_data();

      function arr_def() {
        $scope.user = JSON.parse(localStorage.getItem('user'));
        $scope.token = JSON.parse(localStorage.getItem('token'))
        $scope.user_name = $scope.user['user_name'];
        $scope.flow_role_type = $scope.user['role_type'];
        // $scope.user_name = conFig.user_name();
        // $scope.flow_role_type = conFig.role_type(); //admin,request,responder,approver
        $scope.data_all = [];
        $scope.data_company = [];
        $scope.data_sections = [];
        // $scope.functions = 'functions'
        //ไม่แน่ใจว่า list เก็บ model เป็น value หรือ text นะ
        $scope.data_filter = [{ id_key1: 0, id_key2: 0 }];

      }

      function get_data() {
        arr_def();
        call_api_load();
      }

      function call_api_load() {
        var user_name = $scope.user_name;

        $.ajax({
          url: url_ws + "masterdata/get_master_company",
          data: '{"user_name":"' + user_name + '"}',
          type: "POST",
          contentType: "application/json; charset=utf-8",
          dataType: "json",
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

            $scope.data_all = arr;

            $scope.data_company = arr.company;
            $scope.data_sections = arr.sections;

            $scope.data_functions = $filter("groupBy")(
              arr.sections,
              "functions"
            );
            $scope.data_departments = $filter("groupBy")(
              arr.sections,
              "departments"
            );
            $scope.data_section = $filter("groupBy")(arr.sections, "sections");

            $scope.selectedFunction = null;
            $scope.selectedDepartment = null;
            $scope.selectedSection = null;

            $scope.filteredResults = $scope.data_sections;

            $scope.actionChange = function () {
              $scope.filterResults();
            };

            $scope.filterResults = function () {
              $scope.filteredResults = $scope.data_sections.filter(function (
                item
              ) {
                return (
                  (!$scope.selectedFunction ||
                    item.functions === $scope.selectedFunction) &&
                  (!$scope.selectedDepartment ||
                    item.departments === $scope.selectedDepartment) &&
                  (!$scope.selectedSection ||
                    item.sections === $scope.selectedSection)
                );
              });
            };
            apply();

            console.log($scope);
          },
          error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 500) {
              alert("Internal error: " + jqXHR.responseText);
            } else {
              alert("Unexpected " + textStatus);
            }
          },
        });
      }
    }

    //call ws set data
    if (true) {
      $scope.confirmBack = function () {
        window.open("/Master/Index", "_top");
      };
      $scope.confirmSave = function () {
        var action = "";

        save_data();
      };
    }
  }
);
