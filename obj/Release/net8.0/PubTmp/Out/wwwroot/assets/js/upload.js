
angular.module('myApp', []).controller('myController', function ($scope, $filter) {
    // เอาไปวางได้เลย

    $scope.showFileName = function(inputId) {
      var fileUpload = document.getElementById('file-upload-'+inputId);
      var fileNameDisplay = document.getElementById('fileNameDisplay-'+inputId);       
      var del = document.getElementById('del'+inputId);

      if (fileUpload !== null) { // check ว่าตัวแปรเป็นค่าว่างไม 
        fileUpload.onchange = function() {
          const selectedFile = fileUpload.files[0].name; // get ชื่อไฟล์ 
          // console.log(selectedFile); // แสดงชื่อไฟล์ผ่าน console 
          fileNameDisplay.textContent = ' File is '+selectedFile+'';
        };
        del.style.display = "block"; 
      } else {
        console.error("fileUpload null.");
      }
    };

    $scope.clearFileName = function(inputId) {
      var fileUpload = document.getElementById('file-upload-'+inputId);
      var fileNameDisplay = document.getElementById('fileNameDisplay-'+inputId);
      var del = document.getElementById('del'+inputId);
      fileUpload.value = ''; // ล้างค่าใน input file
      fileNameDisplay.textContent = ''; // ล้างข้อความที่แสดงชื่อไฟล์
      del.style.display = "none";
    };

});