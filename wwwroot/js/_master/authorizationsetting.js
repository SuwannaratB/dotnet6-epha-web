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
AppMenuPage.controller("ctrlAppPage",function ($scope, $http, $filter, conFig) {
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

    get_data(true);

    $("#divLoading").hide();
    $scope.handleLinkClick = function (val) {
      // ทำสิ่งต่าง ๆ เมื่อคลิกลิงก์
      console.log("Link clicked!");
      // คุณสามารถเพิ่มโค้ดอื่น ๆ ที่คุณต้องการทำในฟังก์ชันนี้ได้
      $scope.tabChange = val;
    };

    //choose menu
    if (true) {
      $scope.openDataMenuList = function (item) {
        //item --> $scope.data_role_type
        $scope.selectedData = item;
        $scope.selectdata_role_type = item.seq;

        const arrcheck = $filter("filter")(
          $scope.data_role_type,
          (item) => item.seq === $scope.selectdata_role_type
        );
        $scope.selectdata_role_type_name = arrcheck.length
          ? arrcheck[0].name
          : null;

        //choos_menu --> data_menu_setting in data_menu
        $scope.data_menu.forEach((menuItem) => {
          menuItem.choos_menu = $scope.data_menu_setting.some(
            (settingItem) => settingItem.id === menuItem.id
          )
            ? 1
            : menuItem.choos_menu;
        });
        apply();
        $("#modalMenuList").modal("show");
      };

      $scope.choosDataMenu = function (arr, field) {
        console.log(arr)
        console.log($scope.selectedData)
        if (field === "choos_menu") {

            arr.choos_menu = arr.choos_menu === '1' ? '1' : '0';  
            
        } 
        apply();
        console.log('Updated item:', arr.choos_menu);
      };
    }

    //choose employee
    if (true) {
      $scope.openDataEmployeeAdd = function (item) {
        //item --> $scope.data_role_type
        $scope.selectedData = item;
        $scope.selectdata_role_type = item.seq;

        const arrcheck = $filter("filter")(
          $scope.data_role_type,
          (item) => item.seq === $scope.selectdata_role_type
        );
        $scope.selectdata_role_type_name = arrcheck.length
          ? arrcheck[0].name
          : null;

        $scope.employeelist_show = [];
        $scope.searchText = "";

        apply();
        $("#modalEmployeeAdd").modal("show");
      };
      $scope.fillterDataEmployeeAdd = function () {
        $scope.employeelist_show = [];
        var searchText = $scope.searchText;
        if (!searchText) {
          return;
        }

        var items = angular.copy($scope.employeelist_def, items);
        if (searchText.length < 3) {
          return items;
        }

        getEmployees(searchText, function (data) {
          $scope.employeelist_show = data.employee;
          apply();
          $("#modalEmployeeAdd").modal("show");
        });
      };
      function getEmployees(keywords, callback) {
        $.ajax({
          url: url_ws + "Flow/employees_search",
          data:
            '{"user_filter_text":"' + keywords + '"' + ',"max_rows":"10"' + "}",
          type: "POST",
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          beforeSend: function () {
            //$("#divLoading").show();
          },
          complete: function () {
            //$("#divLoading").hide();
          },
          success: function (data) {
            callback(data);
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

      $scope.choosDataEmployee = function (item) {
        var id = item.id;
        var employee_name = item.employee_name;
        var employee_displayname = item.employee_displayname;
        var employee_email = item.employee_email;
        var employee_img = item.employee_img;

        var seq_role_type = $scope.selectdata_role_type;

        var arr_items = $filter("filter")(
          $scope.data_role_setting,
          function (item) {
            return (
              item.id_role_group == seq_role_type &&
              item.user_name == employee_name
            );
          }
        );

        if (arr_items.length == 0) {
          //add new employee
          var seq = $scope.MaxSeqDataRoleSetting;

          var newInput = clone_arr_newrow($scope.data_role_setting_def)[0];
          newInput.seq = seq;
          newInput.id = seq;
          newInput.no = 0;
          newInput.id_role_group = Number(seq_role_type);
          newInput.action_type = "insert";
          newInput.action_change = 1;

          newInput.user_name = employee_name;
          newInput.user_displayname = employee_displayname;
          newInput.user_img = employee_img;

          $scope.data_role_setting.push(newInput);
          running_no_level1($scope.data_role_setting, null, null);

          $scope.MaxSeqDataRoleSetting =
            Number($scope.MaxSeqDataRoleSetting) + 1;
        }

        apply();

        $("#modalEmployeeAdd").modal("show");
      };

      $scope.removeDataEmployee = function (seq, seq_role_type) {
        var arrdelete = $filter("filter")(
          $scope.data_role_setting,
          function (item) {
            return item.seq == seq && item.action_type == "update";
          }
        );
        if (arrdelete.length > 0) {
          $scope.data_role_setting_delete.push(arrdelete[0]);
        }

        $scope.data_role_setting = $filter("filter")(
          $scope.data_role_setting,
          function (item) {
            return !(item.seq == seq && item.id_role_group == seq_role_type);
          }
        );

        //if delete row 1 clear to null
        if (
          $scope.data_role_setting.length == 1 ||
          $scope.data_role_setting.no == 1
        ) {
          var keysToClear = ["user_name", "user_displayname"];

          keysToClear.forEach(function (key) {
            $scope.data_role_setting[0][key] = null;
          });

          $scope.data_role_setting[0].no = 1;
        }

        running_no_level1($scope.data_role_setting, null, null);

        apply();
      };
      function running_no_level1(arr_items, iNo, newInput) {
        arr_items.sort((a, b) => a.no - b.no);
        var first_row = true;
        var iNoNew = iNo;
        if (newInput == null) {
          iNo = (iNo == null ? 1 : iNo) + 0;
          iNoNew = iNo;
        }

        for (let i = iNo; i < arr_items.length; i++) {
          if (first_row == true && newInput !== null) {
            iNoNew++;
            newInput.no = iNoNew;
            first_row = false;
          } else {
            arr_items[i].no = iNoNew;
          }
          iNoNew++;
        }
        if (newInput !== null && newInput.action_type == "insert") {
          arr_items.push(newInput);
        }
        // Set 1st alway 1
        if (arr_items.length > 0) {
          arr_items[0].no = 1;
        }
        arr_items.sort((a, b) => a.no - b.no);
      }
    }

  ///////////////////////////  API Function  ////////////////////////////
  function call_api_load(page_load) {
    var user_name = $scope.user_name;
    $.ajax({
      url: url_ws + "masterdata/get_authorizationsetting",
      data: '{"user_name":"' + user_name + '"}',
      type: "POST",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      beforeSend: function () {
        $("#divLoading").show();
      },
      complete: function () {
        $("#divLoading").hide();
      },
      success: function (data) {
        var arr = data;
        $scope.data_all = arr;
        $scope.data_menu = arr.menu;
        $scope.employeelist = arr.employee;
        $scope.employeelist_def = arr.employee;
        $scope.data_role_type = initRoleType(arr.role_type, arr.menu_setting);
        // $scope.data_role_type_filter = $scope.data_role_type;
        $scope.data_role_type_def = clone_arr_newrow(arr.role_type);
        $scope.data_menu_setting = arr.menu_setting;
        $scope.data_menu_setting_def = clone_arr_newrow(arr.menu_setting);
        $scope.data_role_setting = arr.role_setting;
        $scope.data_role_setting_def = clone_arr_newrow(arr.role_setting);
        setDataFilter()
        setPagination()
        get_max_id();
        apply();
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

  function save_data(action) {
    var user_name = $scope.user_name;
    var flow_role_type = $scope.flow_role_type;
    //save
    var flow_action = action || "save";
    var json_role_type = check_data_role_type();
    var json_menu_setting = check_data_menu_setting();
    var json_role_setting = check_data_role_setting();

    $.ajax({
      url: url_ws + "masterdata/set_authorizationsetting",
      data:
        '{"user_name":"' +
        user_name +
        '"' +
        ',"role_type":"' +
        flow_role_type +
        '"' +
        ',"json_role_type": ' +
        JSON.stringify(json_role_type) +
        ',"json_menu_setting": ' +
        JSON.stringify(json_menu_setting) +
        ',"json_role_setting": ' +
        JSON.stringify(json_role_setting) +
        "}",
      type: "POST",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
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
          alert("Internal error: " + jqXHR.responseText);
        } else {
          alert("Unexpected " + textStatus);
        }
      },
    });
  }

  ///////////////////////////  Main Functions  ///////////////////////////
  $scope.checkedMenuSetting = function(current_seq){
    if(!$scope.selectedData) return
    var item = $filter('filter')($scope.selectedData.menus, function (_item) {
      return (_item.id_menu == current_seq);
    });
    if(item.length > 0) 
      return true
    return false
  }
  
  function initRoleType(roleType, menuSetting){
    var menus = angular.copy(menuSetting)

    roleType.forEach(element => {
      element.menus = []
      menus.forEach(menu => {
        if (menu.id_role_group == element.seq) {
          element.menus.push(menu)
          
        }
        
      });
    });
    console.log(roleType)

    return roleType
  }

  $scope.confirmBack = function () {
    window.open("/Master/Index", "_top");
  };

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

  function get_max_id() {
    var arr = $filter("filter")($scope.data_all.max, function (item) {
      return item.name == "role_type";
    });
    var iMaxSeq = 1;
    if (arr.length > 0) {
      iMaxSeq = arr[0].values;
    }
    $scope.MaxSeqDataRoleType = iMaxSeq;

    var arr = $filter("filter")($scope.data_all.max, function (item) {
      return item.name == "menu_setting";
    });
    var iMaxSeq = 1;
    if (arr.length > 0) {
      iMaxSeq = arr[0].values;
    }
    $scope.MaxSeqDataMenuSetting = iMaxSeq;

    var arr = $filter("filter")($scope.data_all.max, function (item) {
      return item.name == "role_setting";
    });
    var iMaxSeq = 1;
    if (arr.length > 0) {
      iMaxSeq = arr[0].values;
    }
    $scope.MaxSeqDataRoleSetting = iMaxSeq;
  }

  function arr_def() {
    $scope.data = [];

    $scope.data_all = [];
    $scope.data_menu = [];

    $scope.data_role_type = [];
    $scope.data_menu_setting = [];
    $scope.data_role_setting = [];

    $scope.data_role_type_delete = [];
    $scope.data_menu_setting_delete = [];
    $scope.data_role_setting_delete = [];

    $scope.user_name = conFig.user_name();
    $scope.flow_role_type = conFig.role_type(); //admin,request,responder,approver

    $scope.employeelist = [];
    $scope.employeelist_def = [];
    $scope.employeelist_show = [];

    $scope.exportfile = [{ DownloadPath: "", Name: "" }];
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

  $scope.newData = function (item) {
    //add new
    var seq = $scope.MaxSeqDataRoleType;
    var newInput = clone_arr_newrow($scope.data_role_type_def)[0];
    newInput.seq = seq;
    newInput.id = seq;
    newInput.active_type = 1;
    newInput.data_role_type = '';
    newInput.default_type = 0;
    newInput.action_type = "insert";
    newInput.action_change = 1;
    $scope.data_role_type.push(newInput);
    $scope.MaxSeqDataRoleType = Number($scope.MaxSeqDataRoleType) + 1;
    setDataFilter()
    setPagination()
    $scope.setPage($scope.totalPages)
    newTag(`new-${seq}`)
    apply()
  }

  $scope.removeData = function (item) {
    showConfirm(   'Are you sure?', 
      'Do you really want to proceed?', 
      'error',        
      'Yes, Delete',             
      'No',  
      '#d33',      
      function() {
          if(!item) return showAlert('Error', 'Data remove not Found!', 'error');

          var del_item = $filter('filter')($scope.data_role_type, function (_item) {
              return (_item.seq == item.seq);
          })[0];
  
          if(!del_item) return showAlert('Error', 'Data remove not Found!', 'error');
  
          $scope.data_role_type_delete.push(del_item)

          $scope.data_role_type = $filter('filter')($scope.data_role_type, function (_item) {
              return (_item.seq != del_item.seq);
          });

          showAlert('Success', 'Data has been successfully Deleted.', 'success', function() {
              setDataFilter()
              setPagination()
              apply();
          });
      }
  );
  };

  $scope.actionChangedData = function (item, field) {
    item.action_change = 1;

    if (field === "accept_status") {
        item.active_type = 0;
    } else if (field === "inaccept_status") {
        item.active_type = 1;
    }
};

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

  function check_data_role_type() {
    var arr_active = [];
    angular.copy($scope.data_role_type, arr_active);
    var arr_json = $filter("filter")(arr_active, function (item) {
      return (
        (item.action_type == "update" && item.action_change == 1) ||
        item.action_type == "insert"
      );
    });

    for (var i = 0; i < $scope.data_role_type_delete.length; i++) {
      $scope.data_role_type_delete[i].action_type = "delete";
      arr_json.push($scope.data_role_type_delete[i]);
    }
    return angular.toJson(arr_json);
  }
  
  function check_data_menu_setting() {
    var arr_active = [];
    angular.copy($scope.data_menu_setting, arr_active);
    var arr_json = $filter("filter")(arr_active, function (item) {
      return (
        (item.action_type == "update" && item.action_change == 1) ||
        item.action_type == "insert"
      );
    });

    for (var i = 0; i < $scope.data_menu_setting_delete.length; i++) {
      $scope.data_menu_setting_delete[i].action_type = "delete";
      arr_json.push($scope.data_menu_setting_delete[i]);
    }

    return angular.toJson(arr_json);
  }

  function check_data_role_setting() {
    var arr_active = [];
    angular.copy($scope.data_role_setting, arr_active);
    var arr_json = $filter("filter")(arr_active, function (item) {
      return (
        (item.action_type == "update" && item.action_change == 1) ||
        item.action_type == "insert"
      );
    });

    for (var i = 0; i < $scope.data_role_setting_delete.length; i++) {
      $scope.data_role_setting_delete[i].action_type = "delete";
      arr_json.push($scope.data_role_setting_delete[i]);
    }

    return angular.toJson(arr_json);
  }

  ///////////////////////////  Pagination  ///////////////////////////
  function setPagination(){
    // Pagination settings
    $scope.pageSize = 8; // จำนวนข้อมูลต่อหน้า
    $scope.currentPage = 1; // หน้าปัจจุบัน
    $scope.totalPages = Math.ceil($scope.data_role_type_filter.length / $scope.pageSize); // จำนวนหน้าทั้งหมด
    // สร้างลิสต์ของตัวเลขหน้า
    $scope.pages = Array.from({ length: $scope.totalPages }, (v, k) => k + 1);
    $scope.paginate()
  }

  // ฟังก์ชันสำหรับจัดข้อมูลตามหน้า
  $scope.paginate = function() {
      const start = ($scope.currentPage - 1) * $scope.pageSize;
      const end = start + $scope.pageSize;
      $scope.paginatedData = $scope.data_role_type_filter.slice(start, end);
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
      var list = $filter('filter')($scope.data_role_type, function (_item) {
          return (!_item.name);
      });
      if(list.length > 0) return false
      return true
  }

  function setDataFilter(){
      $scope.data_role_type_filter = $scope.data_role_type
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
