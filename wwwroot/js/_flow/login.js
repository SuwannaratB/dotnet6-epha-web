
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
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
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
            const token = data.csrfToken
            if (!token) return console.log('token not found!')

            $.ajax({
                url: url_ws + "Login/check_authorization",
                data: '{"user_name":"' + user_name + '","pass_word":"' + pass_word + '"}',
                type: "POST", contentType: "application/json; charset=utf-8", 
                headers: {
                    'X-CSRF-TOKEN': token
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
                    try {
                        if (typeof data === "string") {
                            // Step 1: Decode the HTML-encoded response
                            const decodedData = htmlDecode(data);
            
                            // Step 2: Try to parse the decoded data as JSON
                            const jsonData = JSON.parse(decodedData);
            
                            console.log("Decoded and Parsed Data:", jsonData);

                            var arr = jsonData;
                            if (arr) {
                                localStorage.setItem('user', JSON.stringify(arr[0]))
                                localStorage.setItem('token', JSON.stringify(token))
                                window.location.href = "Home/Portal";
                            }

                        } else {
                            // If it's already an object, log it
                            console.log("Parsed Data:", data);
                        }
                    } catch (err) {
                        console.error('Failed to parse JSON:', err);
                        console.error('Received data:', data);
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

  function htmlDecode(input) {
    const doc = new DOMParser().parseFromString(input, 'text/html');
    return doc.documentElement.textContent;
}

});
