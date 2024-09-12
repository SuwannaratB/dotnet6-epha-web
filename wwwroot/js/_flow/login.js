
app.controller("ctrlApp", function ($scope, conFig) {
  var url_ws = conFig.service_api_url();
  //alert(url_ws);

  $('#divLoading').hide();

  $scope.form = {
      user_name: "zkuluwat@thaioilgroup.com",
      pass_word: "1",
  }
  $scope.handleSubmit = function (ev) {
      const { user_name, pass_word } = $scope.form
      if (!user_name || !pass_word) return console.log('username or password not found!')

      $.ajax({
          url: url_ws + "Login/GetAntiForgeryToken",
          data: '{"userId":"' + user_name + '","userPassword":"' + pass_word + '"}',
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
              const token = data.token
              if (!token) return console.log('token not found!')

              $.ajax({
                  url: url_ws + "Login/check_authorization",
                  data: '{"emp_id":"' + '' + '","user_name":"' + user_name + '","pass_word":"' + pass_word + '"}',
                  type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
                  headers: {
                      'Authorization': token
                  },
                  beforeSend: function () {
                      $("#divLoading").show();
                  },
                  complete: function () {
                      $("#divLoading").hide();
                  },
                  success: function (data) {
                      var arr = data;
                      if (arr) {
                          localStorage.setItem('user', JSON.stringify(arr[0]))
                          localStorage.setItem('token', JSON.stringify(token))
                          window.location.href = "Home/Portal";
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
