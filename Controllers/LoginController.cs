using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ServicesAuthen;
using Models;
using Helperselpers;

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
                    }
                    if (keyToken == "")
                    {
                        return Redirect($"{AuthURL}");
                    }
                }
            }
        }
        catch { }

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

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(
            new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier }
        );
    }
}
