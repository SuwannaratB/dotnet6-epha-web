angular.module('myApp', []).controller('myController', function ($scope, $filter) {


    //  data จอง  js freezer tabel her อยู่ บรรทัดที่ 333

    $scope.DataCategory = [{ id: "P", name: "P", description: "People" },
        { id: "A", name: "A", description: "Assets" },
        { id: "E", name: "E", description: "Environment" },
        { id: "R", name: "R", description: "Reputation" },
        { id: "Q", name: "Q", description: "Product Quality" },];
      

    $scope.selectViewTypeFollowup = '2';
    $scope.selectViewTypeFollowup2 = '2';

        $scope.DataWorkSheet = [{
          no: 1, row_type: 'causes', seq_node: 1, seq_guidewords: 1, seq: 1, seq_causes: 1, seq_consequences: 1, seq_consequences_sub: 1
          , guidewords: 'No Flow', deviations: 'None', consequences: '', causes: '', consequences: ''
          , ram_category: 'P'
          , ram_befor_security: '', ram_befor_likelihood: '', ram_befor_risk: ''
          , major_accident_event: '', existing_safeguards: ''
          , ram_after_security: '', ram_after_likelihood: '', ram_after_risk: ''
          , recommendations: '', responder_id: '', responder_name: '', responder_display: '', responder_email: '', responder_profile: '', action_status: ''
        },];
      
        $scope.MaxSeqDataWorkSheet = 1;
        $scope.selectDataWorkSheet = 1;
        $scope.MaxSeqDataWorkSheetCauses = 1;
        $scope.selectDataWorkSheetCauses = 1;
        $scope.MaxSeqDataWorkSheetConsequences = 1;
        $scope.selectDataWorkSheetConsequences = 1;
        $scope.MaxSeqDataWorkSheetConsequences_Sub = 1;
        $scope.selectDataWorkSheetConsequences_sub = 1;
      
        $scope.addDataWorkSheet = function (row_type, seq_node, seq_guidewords, seq, seq_causes, seq_consequences, seq_consequences_sub) {
      
          $scope.MaxSeqDataWorkSheet = ($scope.MaxSeqDataWorkSheet) + 1;
          var xseq = $scope.MaxSeqDataWorkSheet;
          if (row_type === "causes") { $scope.MaxSeqDataWorkSheetCauses = ($scope.MaxSeqDataWorkSheetCauses) + 1; }
          var xseq_causes = $scope.MaxSeqDataWorkSheetCauses;
          if (row_type === "consequences") { $scope.MaxSeqDataWorkSheetConsequences = ($scope.MaxSeqDataWorkSheetConsequences) + 1; }
          var xseq_consequences = $scope.MaxSeqDataWorkSheetConsequences;
          if (row_type === "consequences_sub") { $scope.MaxSeqDataWorkSheetConsequences_Sub = ($scope.MaxSeqDataWorkSheetConsequences_Sub) + 1; }
          var xseq_consequences_sub = $scope.MaxSeqDataWorkSheetConsequences_Sub;
      
          if (row_type === "causes") {
            var newInput = { row_type: row_type, seq_node: seq_node, seq_guidewords: seq_guidewords, seq: xseq, seq_causes: xseq_causes, seq_consequences: xseq_consequences, seq_consequences_sub: xseq_consequences_sub };
          }
          else if (row_type === "consequences") {
            var newInput = { row_type: row_type, seq_node: seq_node, seq_guidewords: seq_guidewords, seq: seq, seq_causes: seq_causes, seq_consequences: xseq_consequences, seq_consequences_sub: xseq_consequences_sub };
          }
          else if (row_type === "consequences_sub") {
            var newInput = { row_type: row_type, seq_node: seq_node, seq_guidewords: seq_guidewords, seq: seq, seq_causes: seq_causes, seq_consequences: seq_consequences, seq_consequences_sub: xseq_consequences_sub };
          }
      
          $scope.DataWorkSheet.push(newInput);
      
          $scope.selectDataWorkSheet = xseq;
      
          running_no_WorkSheet();
        }
      
      
        $scope.copyDataWorkSheet = function (seq) {
      
          $scope.MaxSeqDataWorkSheet = ($scope.MaxSeqDataWorkSheet) + 1;
          var xValues = $scope.MaxSeqDataWorkSheet;
          var newInput = { seq: xValues };
      
          var arr = $filter('filter')($scope.DataWorkSheet, function (item) {
            return (item.seq == seq);
          });
      
          for (let i = 0; i < arr.length; i++) {
            var newInput = {
              seq: xValues
              , node_text: arr[i].node_text
              , design_intent: arr[i].design_intent
              , design_conditions: arr[i].design_conditions
              , operating_conditions: arr[i].operating_conditions
              , node_boundary: arr[i].node_boundary
              , node_drawing: arr[i].node_drawing
            };
          };
          $scope.DataWorkSheet.push(newInput);
      
          running_no_WorkSheet();
      
          $scope.selectDataWorkSheet = xValues;
      
          var arr = $filter('filter')($scope.selectDataNodeDrawing, { seq_node: seq });
          for (let i = 0; i < arr.length; i++) {
            $scope.MaxSeqDataNodeDrawing = ($scope.MaxSeqDataNodeDrawing) + 1;
            var xMaxSeqDataNodeDrawing = $scope.MaxSeqDataNodeDrawing;
            var newInput = {
              seq_node: xValues
              , seq_drawing: arr[i].seq_drawing
              , seq: xMaxSeqDataNodeDrawing
            };
            $scope.selectDataNodeDrawing.push(newInput);
          }
      
        }
        $scope.removeDataWorkSheet = function (seq) {
      
          $scope.DataWorkSheet = $filter('filter')($scope.DataWorkSheet, function (item) {
            return !(item.seq == seq);
          });
      
          if ($scope.DataWorkSheet.length === 0) {
            $scope.addDataWorkSheet();
          }
          running_no_WorkSheet();
        };
        function running_no_WorkSheet() {
          for (let i = 0; i < $scope.DataWorkSheet.length; i++) {
            $scope.DataWorkSheet[i].no = (i + 1);
          };
      
        }
      
        $scope.openModalEmployeeCheck = function (seq) {
          $scope.selectDataWorkSheet = seq;
          //alert($scope.selectDataWorkSheet);
          var arr = $scope.GuideWordslist;
          for (let i = 0; i < arr.length; i++) {
      
            try {
              var ar_check = $filter('filter')($scope.selectDataGuideWords, { seq: seq, id: arr[i].id });
      
              if (ar_check.length > 0) {
                $scope.GuideWordslist[i].selected = true;
              } else {
                $scope.GuideWordslist[i].selected = false;
      
              }
            } catch (e) { return; }
          };
        };
      
        $scope.openModalDataRAM = function (ram_type, seq, ram_befor) {
          //alert( ram_type);
          $scope.selectDataWorkSheet = seq;
          $scope.selectDataWorkSheetRAM_Type = ram_type;
          $scope.selectDataWorkSheetRAM_Befor = ram_befor;
          // alert($scope.selectDataWorkSheetRAM_Type);
        }
        $scope.selectDataRAM = function (ram_type, id_select) {
      
          var xseq = $scope.selectDataWorkSheet;
          var xbefor = $scope.selectDataWorkSheetRAM_Befor;
      
          //alert(xbefor);
      
          for (let i = 0; i < $scope.DataWorkSheet.length; i++) {
            try {
              if (xbefor === "befor") {
                if (ram_type === "s") { $scope.DataWorkSheet[i].ram_befor_security = id_select; }
                if (ram_type === "l") { $scope.DataWorkSheet[i].ram_befor_likelihood = id_select; }
      
                //red,yellow,green,white
                if ($scope.DataWorkSheet[i].ram_befor_security !== "" && $scope.DataWorkSheet[i].ram_befor_likelihood !== "") {
                  if ($scope.DataWorkSheet[i].ram_befor_security == "5") {
                    if ($scope.DataWorkSheet[i].ram_befor_likelihood == "A" || $scope.DataWorkSheet[i].ram_befor_likelihood == "B") {
                      $scope.DataWorkSheet[i].ram_befor_risk = "M";
                    } else {
                      $scope.DataWorkSheet[i].ram_befor_risk = "H";
                    }
                  }
                  if ($scope.DataWorkSheet[i].ram_befor_security == "4") {
                    if ($scope.DataWorkSheet[i].ram_befor_likelihood == "A") {
                      $scope.DataWorkSheet[i].ram_befor_risk = "L";
                    } else if ($scope.DataWorkSheet[i].ram_befor_likelihood == "B" || $scope.DataWorkSheet[i].ram_befor_likelihood == "C") {
                      $scope.DataWorkSheet[i].ram_befor_risk = "M";
                    } else {
                      $scope.DataWorkSheet[i].ram_befor_risk = "H";
                    }
                  }
                  if ($scope.DataWorkSheet[i].ram_befor_security == "3") {
                    if ($scope.DataWorkSheet[i].ram_befor_likelihood == "A" || $scope.DataWorkSheet[i].ram_befor_likelihood == "B") {
                      $scope.DataWorkSheet[i].ram_befor_risk = "L";
                    } else if ($scope.DataWorkSheet[i].ram_befor_likelihood == "C" || $scope.DataWorkSheet[i].ram_befor_likelihood == "D") {
                      $scope.DataWorkSheet[i].ram_befor_risk = "M";
                    } else {
                      $scope.DataWorkSheet[i].ram_befor_risk = "H";
                    }
                  }
                  if ($scope.DataWorkSheet[i].ram_befor_security == "2") {
                    if ($scope.DataWorkSheet[i].ram_befor_likelihood == "A" || $scope.DataWorkSheet[i].ram_befor_likelihood == "B"
                      || $scope.DataWorkSheet[i].ram_befor_likelihood == "C") {
                      $scope.DataWorkSheet[i].ram_befor_risk = "L";
                    } else {
                      $scope.DataWorkSheet[i].ram_befor_risk = "M";
                    }
                  }
                  if ($scope.DataWorkSheet[i].ram_befor_security == "1") {
                    if ($scope.DataWorkSheet[i].ram_befor_likelihood == "A" || $scope.DataWorkSheet[i].ram_befor_likelihood == "B") {
                      $scope.DataWorkSheet[i].ram_befor_risk = "L";
                    } else {
                      $scope.DataWorkSheet[i].ram_befor_risk = "";
                    }
                  }
      
                }
      
              }
              else {
                if (ram_type === "s") { $scope.DataWorkSheet[i].ram_after_security = id_select; }
                if (ram_type === "l") { $scope.DataWorkSheet[i].ram_after_likelihood = id_select; }
      
                //red,yellow,green,white
                if ($scope.DataWorkSheet[i].ram_after_security !== "" && $scope.DataWorkSheet[i].ram_after_likelihood !== "") {
                  if ($scope.DataWorkSheet[i].ram_after_security == "5") {
                    if ($scope.DataWorkSheet[i].ram_after_likelihood == "A" || $scope.DataWorkSheet[i].ram_after_likelihood == "B") {
                      $scope.DataWorkSheet[i].ram_after_risk = "M";
                    } else {
                      $scope.DataWorkSheet[i].ram_after_risk = "H";
                    }
                  }
                  if ($scope.DataWorkSheet[i].ram_after_security == "4") {
                    if ($scope.DataWorkSheet[i].ram_after_likelihood == "A") {
                      $scope.DataWorkSheet[i].ram_after_risk = "L";
                    } else if ($scope.DataWorkSheet[i].ram_after_likelihood == "B" || $scope.DataWorkSheet[i].ram_after_likelihood == "C") {
                      $scope.DataWorkSheet[i].ram_after_risk = "M";
                    } else {
                      $scope.DataWorkSheet[i].ram_after_risk = "H";
                    }
                  }
                  if ($scope.DataWorkSheet[i].ram_after_security == "3") {
                    if ($scope.DataWorkSheet[i].ram_after_likelihood == "A" || $scope.DataWorkSheet[i].ram_after_likelihood == "B") {
                      $scope.DataWorkSheet[i].ram_after_risk = "L";
                    } else if ($scope.DataWorkSheet[i].ram_after_likelihood == "C" || $scope.DataWorkSheet[i].ram_after_likelihood == "D") {
                      $scope.DataWorkSheet[i].ram_after_risk = "M";
                    } else {
                      $scope.DataWorkSheet[i].ram_after_risk = "H";
                    }
                  }
                  if ($scope.DataWorkSheet[i].ram_after_security == "2") {
                    if ($scope.DataWorkSheet[i].ram_after_likelihood == "A" || $scope.DataWorkSheet[i].ram_after_likelihood == "B"
                      || $scope.DataWorkSheet[i].ram_after_likelihood == "C") {
                      $scope.DataWorkSheet[i].ram_after_risk = "L";
                    } else {
                      $scope.DataWorkSheet[i].ram_after_risk = "M";
                    }
                  }
                  if ($scope.DataWorkSheet[i].ram_after_security == "1") {
                    if ($scope.DataWorkSheet[i].ram_after_likelihood == "A" || $scope.DataWorkSheet[i].ram_after_likelihood == "B") {
                      $scope.DataWorkSheet[i].ram_after_risk = "L";
                    } else {
                      $scope.DataWorkSheet[i].ram_after_risk = "";
                    }
                  }
      
                }
      
      
              }
      
      
            } catch (e) { return; }
          };
      
        }
      
      
        $scope.openModalDataEmployee = function (form_type, seq) {
          //alert( ram_type);
          $scope.selectDataWorkSheet = seq;
          $scope.selectDatFormType = form_type;
        }
        $scope.selectDataEmployee = function (id, employee, email, profile) {
          var xseq = $scope.selectDataWorkSheet;
          var xformtype = $scope.selectDatFormType;
      
          //alert(xseq);
          
          $scope.DataMain = [];
      
         // alert(xformtype);
          if (xformtype === "info") {
      
            var newInput = {
              seq: 1
              , responder_id: id
              , responder_name: employee
              , responder_display: employee
              , responder_email: email
              , responder_profile: profile
            };
            $scope.DataMain.push(newInput);
      
      
          } else {
            for (let i = 0; i < $scope.DataWorkSheet.length; i++) {
              try {
                if ($scope.DataWorkSheet[i].seq === xseq) {
                  $scope.DataWorkSheet[i].responder_id = id;
                  $scope.DataWorkSheet[i].responder_name = employee;
                  $scope.DataWorkSheet[i].responder_display = employee;
                  $scope.DataWorkSheet[i].responder_email = email;
                  $scope.DataWorkSheet[i].responder_profile = profile;
                  break;
                }
              } catch (e) { }
            };
          }
        };
      
        $scope.removeDataEmpWorkSheet = function (form_type, id, seq) {
          var xseq = seq;
          var xformtype = $scope.selectDatFormType;
      
          if (xformtype === "info") {
            $scope.DataMain = [];
          } else {
            for (let i = 0; i < $scope.DataWorkSheet.length; i++) {
              try {
                if ($scope.DataWorkSheet[i].seq === xseq) {
                  $scope.DataWorkSheet[i].responder_id = "";
                  $scope.DataWorkSheet[i].responder_name = "";
                  $scope.DataWorkSheet[i].responder_display = "";
                  $scope.DataWorkSheet[i].responder_email = "";
                  $scope.DataWorkSheet[i].responder_profile = "";
                  break;
                }
              } catch (e) { }
            };
          }
        };



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




});





