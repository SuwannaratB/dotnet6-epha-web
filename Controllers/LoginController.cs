using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using System.Security.Principal;
using ServicesAuthen;
using Newtonsoft.Json;
using Models;
using Helperselpers;
using System.Security.Cryptography;
using System.Data;
using Microsoft.AspNetCore.Http;

namespace dotnet6_epha_web.Controllers;

// [EnableCors("AllowOrigin")]
public class LoginController : Controller
{
    private readonly ILogger<LoginController> _logger;
    public readonly IConfiguration _IConfiguration;
    public readonly sessionAuthen _sessionAuthen;

    public string token_doc
    {
        get { return _sessionAuthen.token_doc; }
        set { _sessionAuthen.token_doc = value; }
    }
    public string user_name
    {
        get { return _sessionAuthen.user_name; }
        set { _sessionAuthen.user_name = value; }
    }
    public bool isLogin
    {
        get { return string.IsNullOrEmpty(user_name); }
    }

    private void destroySession()
    {
        if (isLogin == false)
        {
            HttpContext.Session.Clear();
        }
    }

    private string service_url_link;
    private string service_api_url;
    private string apiLog;
    private string autoLogin;
    private string pathimg;
    private string BaseURL
    {
        get { return _IConfiguration["BaseURL"] ?? ""; }
    }
    private string SignoutURL
    {
        get { return _IConfiguration["SignoutURL"] ?? ""; }
    }
    private string AuthURL
    {
        get
        {
            return !string.IsNullOrEmpty(_IConfiguration["AuthURL"])
                ? _IConfiguration["AuthURL"].ToString().Replace("{redirect_uri}", BaseURL + "login")
                : "";
        }
    }
    private string loginAzure
    {
        //get { return _IConfiguration["Auth_AD:loginAzure"] ?? ""; }
        get { return "false"; }
    }
    private static string DecryptDataWithAes(
        string cipherText,
        string keyBase64,
        string vectorBase64
    )
    {
        using (Aes aesAlgorithm = Aes.Create())
        {
            aesAlgorithm.Key = Convert.FromBase64String(keyBase64);
            aesAlgorithm.IV = Convert.FromBase64String(vectorBase64);

            Console.WriteLine($"Aes Cipher Mode : {aesAlgorithm.Mode}");
            Console.WriteLine($"Aes Padding Mode: {aesAlgorithm.Padding}");
            Console.WriteLine($"Aes Key Size : {aesAlgorithm.KeySize}");
            Console.WriteLine($"Aes Block Size : {aesAlgorithm.BlockSize}");

            // Create decryptor object
            ICryptoTransform decryptor = aesAlgorithm.CreateDecryptor();

            byte[] cipher = Convert.FromBase64String(cipherText);

            //Decryption will be done in a memory stream through a CryptoStream object
            using (MemoryStream ms = new MemoryStream(cipher))
            {
                using (CryptoStream cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read))
                {
                    using (StreamReader sr = new StreamReader(cs))
                    {
                        return sr.ReadToEnd();
                    }
                }
            }
        }
    }
    public DataTable ConvertJSONresult(String jsper)
    {
        DataTable _dtJson = (DataTable)JsonConvert.DeserializeObject(jsper, typeof(DataTable));
        try
        {
            if (_dtJson != null)
            {
                if (_dtJson.Rows.Count > 0) { if (_dtJson.Rows[0]["json_check_null"].ToString() == "true") { _dtJson.Rows[0].Delete(); _dtJson.AcceptChanges(); } }
                _dtJson.Columns.Remove("json_check_null"); _dtJson.AcceptChanges();
            }
        }
        catch { }

        return _dtJson;
    }



    private WSSoaps _WSSoaps;

    public LoginController(
        ILogger<LoginController> logger,
        IConfiguration IConfiguration,
        sessionAuthen sessionAuthen,
        WSSoaps WSSoaps
    )
    {
        _logger = logger;
        _IConfiguration = IConfiguration;
        _IConfiguration = IConfiguration;

        service_url_link = _IConfiguration["EndPoint:service_url_link"];
        service_api_url = _IConfiguration["EndPoint:service_api_url"];
        apiLog = _IConfiguration["EndPoint:api-log"];

        _sessionAuthen = sessionAuthen;
        _WSSoaps = WSSoaps;
        autoLogin = _IConfiguration["autoLogin"];
        pathimg = _IConfiguration["pathimg"];
    }

    public void defineStart()
    {
        ViewBag.perfex = "@";
        ViewBag.email = "";
        ViewBag.pathname = "login";
        ViewBag.loginAzure = loginAzure;
        ViewBag.autoLogin = autoLogin;

        ViewBag.endpoint = service_api_url;
        ViewBag.service_url_link = service_url_link;
    }

    public async Task<IActionResult> Index(string keyToken = "")
    {
        defineStart();

        return View();

        //try
        //{
        //    ViewBag.endpoint = service_api_url;
        //    ViewBag.apiLog = apiLog;
        //    LoginFromBodyModel LoginFromBodyModels = null;
        //    if (loginAzure == "true")
        //    {
        //        if (_sessionAuthen.AccessToken.Equals(""))
        //        {
        //            if (keyToken != "")
        //            {
        //                ViewBag.email = await _WSSoaps.decode(keyToken);
        //                _sessionAuthen.Email = ViewBag.email;
        //            }
        //            else
        //            {
        //                return Redirect($"{AuthURL}");
        //            }
        //        }
        //        if (_sessionAuthen.AccessToken != "")
        //        {
        //            TempData["jwt"] = _sessionAuthen.AccessToken;
        //            if (keyToken != "")
        //            {
        //                ViewBag.email = await _WSSoaps.decode(keyToken);
        //                _sessionAuthen.Email = ViewBag.email;
        //                LoginFromBodyModels = new LoginFromBodyModel()
        //                {
        //                    user_name = _sessionAuthen.Email.Split("@")[0],
        //                    pass_word = "admin1"
        //                };
        //                var result = (IActionResult?)null;
        //                try
        //                {
        //                    var resulT = Authentication(LoginFromBodyModels).Result;
        //                    result = resulT;

        //                    if (result != null)
        //                    {
        //                        var xresult = (OkObjectResult)resulT;
        //                        var xXresult = (LoginViewModel)xresult.Value;
        //                        return Redirect($"{BaseURL}{xXresult.page}");
        //                    }
        //                }
        //                catch (Exception err)
        //                {
        //                    var xresult = (result as BadRequestObjectResult).Value as LoginError;
        //                    if (xresult != null && xresult.Code == 400)
        //                    {
        //                        string path = "Home/Portal";
        //                        return Redirect($"{BaseURL}{path}");
        //                    }
        //                    Console.WriteLine(err.Message.ToString());
        //                }
        //            }
        //            if (keyToken == "")
        //            {
        //                return Redirect($"{AuthURL}");
        //            }
        //        }
        //    }
        //}
        //catch { }

        //if (true)
        //{
        //    List<String> zAdmin = new List<string>();
        //    zAdmin.Add("znitinaip");
        //    zAdmin.Add("zkuluwat");

        //    LoginFromBodyModel model = new LoginFromBodyModel()
        //    {
        //        user_name = _sessionAuthen.Email.Split("@")[0],
        //        pass_word = "admin1"
        //    };
        //    string userName = model.user_name.Trim().ToLower();
        //    string passWord = model.pass_word.Trim().ToLower();
        //    bool userCenter = zAdmin.Contains(userName) && passWord.Equals("admin1");
        //    if (userName == "admin" && passWord == "admin1" || userCenter)
        //    {
        //        _sessionAuthen.user_name = "admin";
        //        _sessionAuthen.role_type = "admin";
        //        _sessionAuthen.user_display = userCenter ? userName : "PHA Admin";
        //        _sessionAuthen.user_img = Url.Content("~/") + "assets/images/avatar.png";
        //    }
        //}

        //if (!isLogin)
        //{
        //    return RedirectToAction("Portal", "Web");
        //}
        //return View();
    }

    public IActionResult Dummy()
    {
        defineStart();
        destroySession();

        ViewBag.endpoint = service_api_url;
        ViewBag.apiLog = apiLog;
        return View();
    }

    public IActionResult Signout()
    {
        destroySession();
        //return Redirect(SignoutURL);
        //return RedirectToAction("Signout", "Login");
        return View();
    }

    public IActionResult Signup()
    {
        destroySession();
        defineStart();
        return View();
    }

    public IActionResult RegisterAccount()
    {
        destroySession();

        LoginError res = new LoginError();

        string msg = "";
        string user_email = "";
        string accept_status = "";
        try
        {
            using (Aes aesAlgorithm = Aes.Create())
            {
                var location = new Uri(
                    $"{Request.Scheme}://{Request.Host}{Request.Path}{Request.QueryString}"
                );
                string QueryText = (location.Query).Replace("?", "");
                //GKPg7bYFGHHXfIZxhgUT1ch5z6LlHEvgrLW9l+pi+jc=&7fczoMgVDvnAa07siVuOtg==
                if (QueryText != "")
                {
                    string cipherText = "";
                    string keyBase64 = "";
                    string vectorBase64 = "";
                    string[] xSplit = QueryText.Split('&');

                    if (xSplit.Length > 0)
                    {
                        cipherText = xSplit[0];
                        keyBase64 = xSplit[1];
                        vectorBase64 = xSplit[2];
                    }

                    string token = DecryptDataWithAes(cipherText, keyBase64, vectorBase64);
                    if (token != "")
                    {
                        // "user_email=" + _user_email + "&accept_status=0";
                        user_email = (token.Split('&')[0]).Split('=')[1];
                        accept_status = (token.Split('&')[1]).Split('=')[1];
                    }
                }
            }
        }
        catch (System.Exception)
        {
            throw;
        }

        if (user_email != "" & accept_status != "")
        {
            try
            {
                Post_RegisterAccount(user_email, accept_status);
                res.Message = "true";
            }
            catch (Exception ex) { res.Message = ex.Message.ToString(); }
        }

        return Ok(res);
    }
    [HttpPost]
    public async Task<IActionResult> Post_RegisterAccount(string user_email, string accept_status)
    {
        string ret = await _WSSoaps.Post_Register_Account(user_email.ToString(), accept_status.ToString());
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> Authentication([FromBody] LoginFromBodyModel model)
    {
        string msg = "";

        string user_name = model.user_name.Trim();
        string pass_word = model.pass_word.Trim();
        string email = model.user_name.Trim();
        string role_type = "";
        string user_display = "";
        string user_img = "";
        string page_name = "Home/Portal";



        if (true)
        {
            if (pass_word == "admin")
            {
                role_type = pass_word;
            }
            else if (pass_word == "pha_admin")
            {
                role_type = pass_word;
            }
            else if (pass_word == "approver")
            {
                role_type = pass_word;
            }
            else if (pass_word == "vendor")
            {
                role_type = pass_word;
            }
            else
            {
                role_type = "employee";
            }


            if (user_display == "") { user_display = email + "(" + role_type + ")"; }
        }

        string jsper = await _WSSoaps.post_check_authorization(model.user_name.Trim().ToLower(), model.pass_word.Trim().ToLower());

        DataTable dt = new DataTable();
        dt = ConvertJSONresult(jsper);
        if (dt.Rows.Count == 0)
        {
            role_type = "";
            goto Next_Line_Data;
        }

        for (int i = 0; i < dt.Rows.Count; i++)
        {
            role_type = (dt.Rows[i]["role_type"] + "");

            user_name = (dt.Rows[i]["user_name"] + "");
            user_display = (dt.Rows[i]["user_displayname"] + "");
            user_img = (dt.Rows[i]["user_img"] + "");

            if ((dt.Rows[i]["role_type"] + "") == "admin") { break; }
        }


        _sessionAuthen.role_type = role_type;
        _sessionAuthen.user_name = user_name;
        _sessionAuthen.user_display = user_display;
        _sessionAuthen.user_img = (user_img == "" ? Url.Content("~/") + "assets/images/avatar.png" : user_img);

        ViewBag.user_name = _sessionAuthen.user_name;
        ViewData["user_display"] = _sessionAuthen.user_display;
        ViewData["user_name"] = user_name;

        if (_sessionAuthen.timeoutSession == "")
        {
            string now = DateTime.Now.AddMinutes(30).ToString();
            _sessionAuthen.timeoutSession = now.ToString();
        }

    Next_Line_Data:;
        LoginViewModel res = new LoginViewModel() { user_name = user_name, role_type = role_type, page = page_name, msg = msg };
        return Ok(res);
    }

    public async Task<string> CheckLogin(string retjson)
    {
        string first_page = "Home/Portal";
        try
        {
            DataTable dt = (DataTable)JsonConvert.DeserializeObject(retjson, (typeof(DataTable)));
            if (dt.Rows.Count > 0)
            {
                first_page = "Home/Portal";

                _sessionAuthen.user_name = (dt.Rows[0]["USER_NAME"] + "").ToString();
                _sessionAuthen.user_display = (dt.Rows[0]["USER_DISPLAY"] + "").ToString();
                _sessionAuthen.user_img = (dt.Rows[0]["USER_IMG"] + "").ToString();
                _sessionAuthen.role_type = (dt.Rows[0]["ROLE_TYPE"] + "").ToString().ToLower();

                if (_sessionAuthen.user_img.ToString() == "")
                {
                    _sessionAuthen.user_img = "/assets/images/avatar.png";
                }
                else
                {
                    var empId = (dt.Rows[0]["EMP_ID"] + "").ToString().ToLower();
                    _sessionAuthen.user_img = _sessionAuthen.user_img
                        .ToString()
                        .Replace("//srieng02/", "//srieng02.thaioil.localnet/");
                    _sessionAuthen.user_img = $"{pathimg}{empId}.jpg";
                }

                if (dt.Rows.Count == 1)
                {
                    if ((dt.Rows[0]["ROLE_TYPE"] + "").ToString().ToLower() == "admin")
                    {
                        string dt_role = await _WSSoaps.Post_get_emp_data_login(user_name.ToString());
                        if (dt_role != "")
                        {
                            first_page = "Home/labPerformance";
                        }
                    }
                    else if ((dt.Rows[0]["ROLE_TYPE"] + "").ToString().ToLower() != "")
                    {
                        string dt_role = await _WSSoaps.Post_get_emp_data_login(
                            user_name.ToString()
                        );
                        if (dt_role != "")
                        {
                            first_page = "Home/labPerformance";
                        }
                    }
                    else
                    {
                        // Response.Write("<script>alert('No authority login in system.');</script>");
                        throw new Exception("No authority login in system.");
                    }
                }
                else if (dt.Rows.Count > 1)
                {
                    // ให้เลือกว่าจะเข้าหน้า admin หรือ dashboard
                    if ((dt.Rows[0]["ROLE_TYPE"] + "").ToString().ToLower() == "admin")
                    {
                        _sessionAuthen.user_name = "admin";
                        _sessionAuthen.role_type = "admin";

                        string dt_role = await _WSSoaps.Post_get_emp_data_login(
                            user_name.ToString()
                        );
                        if (dt_role != "")
                        {
                            first_page = "web/labPerformance";
                        }
                        //Response.Write("<script>window.open('../form_admin/portal.aspx','_top');</script>");
                        //ScriptManager.RegisterStartupScript(this.Page, Page.GetType(), "text", "checkHistory('" + _name + "','../form_admin/portal.aspx')", true);
                        // ScriptManager.RegisterStartupScript(this.Page, Page.GetType(), "text", "checkHistory('" + _name + "','" + first_page + "')", true);
                    }
                    else if ((dt.Rows[0]["ROLE_TYPE"] + "").ToString().ToLower() != "")
                    {
                        string dt_role = await _WSSoaps.Post_get_emp_data_login(
                            user_name.ToString()
                        );
                        Console.WriteLine(
                            "_WSSoaps.Post_get_emp_data_login => {0} usr => {1}",
                            dt_role,
                            user_name
                        );
                        if (dt_role != "")
                        {
                            first_page = "Home/labPerformance";
                        }
                    }
                }
            }
            else
            {
                throw new Exception("Login wrong username and password.");
            }
        }
        catch (Exception err)
        {
            Console.WriteLine(err.Message.ToString());

            throw new Exception("Login wrong username and password.");
        }
        if (string.IsNullOrEmpty(first_page))
            throw new Exception("Login wrong username and password.");

        return first_page;
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(
            new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier }
        );
    }
}
