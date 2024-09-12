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
        get { return _IConfiguration["Auth_AD:loginAzure"] ?? ""; }
        //get { return "false"; }
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

        try
        {
            ViewData["service_api_url"] = service_api_url;
            ViewBag.endpoint = service_api_url;
            ViewBag.apiLog = apiLog;
            //LoginFromBodyModel LoginFromBodyModels = null;
            if (loginAzure == "true")
            {
                //1. กรณีที่ไม่มีข้อมูล Session Access Token
                if (_sessionAuthen.AccessToken.Equals(""))
                {
                    //2. กรณีที่ไม่มีข้อมูล Session Access Token แต่มีค่า keyToken แล้ว แสดงว่ามีการเข้าระบบไว้ก่อนนี้แล้ว
                    if (keyToken != "")
                    {
                        ViewBag.email = await _WSSoaps.decode(keyToken);
                        _sessionAuthen.Email = ViewBag.email;
                    }
                    else
                    {
                        //3. ให้ Call wservice Project AzureAD -> code call ms azure ad -> ถ้า success จะ call page now
                        return Redirect($"{AuthURL}");
                    }
                }

                //4. step 2 or step 3 success
                if (_sessionAuthen.AccessToken != "")
                {
                    TempData["jwt"] = _sessionAuthen.AccessToken;
                    if (keyToken != "")
                    {
                        ViewBag.email = await _WSSoaps.decode(keyToken);
                        _sessionAuthen.Email = ViewBag.email;
                        // LoginFromBodyModel LoginFromBodyModels = new LoginFromBodyModel()
                        // {
                        //     user_name = _sessionAuthen.Email.Split("@")[0],
                        //     pass_word = "pass"
                        // };

                        // //check email @thaioilgroup.com --> ViewBag.email
                        // string _email = (ViewBag.email ?? "");
                        // if (!_email.ToLower().Contains("@thaioilgroup.com")) { return View(); }

                        // var result = (IActionResult?)null;
                        // try
                        // {
                        //     var resulT = Authentication(LoginFromBodyModels).Result;
                        //     result = resulT;

                        //     if (result != null)
                        //     {
                        //         string path = "Home/Portal";
                        //         return Redirect($"{BaseURL}{path}");
                        //     }
                        // }
                        // catch
                        // {
                        //     string path = "Login/Index";
                        //     return Redirect($"{BaseURL}{path}");
                        // }
                    }
                    if (keyToken == "")
                    {
                        return Redirect($"{AuthURL}");
                    }
                }
            }
        }
        catch { }

        // if (!isLogin)
        // {
        //     return RedirectToAction("Portal", "Web");
        // }
        return View();
    }

    public IActionResult RegisterAccount()
    {
        destroySession();
        return View();
    }

    public IActionResult Signout()
    {
        destroySession();
        return View();
    }

    public IActionResult Signup()
    {
        destroySession();
        defineStart();
        return View();
    }

    // [HttpPost]
    // public async Task<IActionResult> Authentication([FromBody] LoginFromBodyModel model)
    // {
    //     string msg = "";

    //     string user_name = model.user_name?.Trim() ?? "";
    //     string pass_word = model.pass_word?.Trim() ?? "";
    //     string role_type = "";
    //     string user_display = "";
    //     string user_img = "";
    //     string page_name = "Home/Portal";

    //     var _user_name = model.user_name?.Trim().ToLower() ?? "";
    //     var _pass_word = model.pass_word?.Trim().ToLower() ?? "";
    //     string jsper = await _WSSoaps.post_check_authorization(_user_name, pass_word);

    //     DataTable dt = new DataTable();
    //     dt = ConvertJSONresult(jsper);
    //     if (dt?.Rows.Count == 0)
    //     {
    //         role_type = "";
    //         msg = "ไม่มีสิทธิ์ใช้งานระบบ ให้ Register Account.";
    //         goto Next_Line_Data;
    //     }
    //     else
    //     {
    //         for (int i = 0; i < dt?.Rows.Count; i++)
    //         {
    //             role_type = (dt.Rows[i]["role_type"]?.ToString() ?? "");

    //             user_name = (dt.Rows[i]["user_name"]?.ToString() ?? "");
    //             user_display = (dt.Rows[i]["user_displayname"]?.ToString() ?? "");
    //             user_img = (dt.Rows[i]["user_img"]?.ToString() ?? "");

    //             if (role_type == "admin") { break; }
    //         }
    //     }

    //     _sessionAuthen.role_type = role_type;
    //     _sessionAuthen.user_name = user_name;
    //     _sessionAuthen.user_display = user_display;
    //     _sessionAuthen.user_img = (user_img == "" ? Url.Content("~/") + "assets/images/avatar.png" : user_img);

    //     ViewBag.user_name = _sessionAuthen.user_name;
    //     ViewData["user_display"] = _sessionAuthen.user_display;
    //     ViewData["user_name"] = user_name;

    //     if (_sessionAuthen.timeoutSession == "")
    //     {
    //         string now = DateTime.Now.AddMinutes(30).ToString();
    //         _sessionAuthen.timeoutSession = now.ToString();
    //     }

    // Next_Line_Data:;
    //     LoginViewModel res = new LoginViewModel() { user_name = user_name, role_type = role_type, page = page_name, msg = msg };
    //     return Ok(res);
    // }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(
            new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier }
        );
    }
}
