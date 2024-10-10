using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ServicesAuthen;
using Models;

namespace dotnet6_epha_web.Controllers
{
    public class MasterController : Controller
    {
        private readonly ILogger<MasterController> _logger;
        public readonly IConfiguration _IConfiguration;
        public readonly sessionAuthen _sessionAuthen;

        public MasterController(
            ILogger<MasterController> logger,
            sessionAuthen sessionAuthen,
            IConfiguration IConfiguration
        )
        {
            _sessionAuthen = sessionAuthen;
            _logger = logger;
            _IConfiguration = IConfiguration;
        }
        private void _PageDef()
        {
            _sessionAuthen.service_api_url = _IConfiguration["EndPoint:service_api_url"];
            _sessionAuthen.controller_action_befor = "Master/Index";
            ViewData["user_display"] = _sessionAuthen.user_display;
            ViewData["user_name"] = _sessionAuthen.user_name;
            ViewData["role_type"] = _sessionAuthen.role_type;
            ViewData["pha_seq"] = _sessionAuthen.pha_seq;
            ViewData["pha_no"] = _sessionAuthen.pha_no;
            ViewData["pha_status"] = _sessionAuthen.pha_status;
            ViewData["pha_type_doc"] = _sessionAuthen.pha_type_doc;
            ViewData["controller_action_befor"] = _sessionAuthen.controller_action_befor;
            ViewData["service_api_url"] = _sessionAuthen.service_api_url;
            ViewData["service_url_link"] = "";
            _sessionAuthen.service_url_link = "";
        }
        public IActionResult Index()
        {
            _PageDef();
            return View();
        }

        public IActionResult AuthorizationSetting()
        {
            _PageDef();
            return View();
        }
        public IActionResult ManageUser()
        {
            _PageDef();
            return View();
        }
        public IActionResult Systemwide()
        {
            _PageDef();
            return View();
        }
        public IActionResult StorageLocation()
        {
            _PageDef();
            return View();
        }
        public IActionResult Area()
        {
            _PageDef();
            return View();
        }
        public IActionResult Toc()
        {
            _PageDef();
            return View();
        }
        public IActionResult BusinessUnit()
        {
            _PageDef();
            return View();
        }
        public IActionResult FunctionalLocation()
        {
            _PageDef();
            return View();
        }
        public IActionResult GuideWords()
        {
            _PageDef();
            return View();
        }
        public IActionResult Whatif()
        {
            _PageDef();
            return View();
        }
        public IActionResult Jsea()
        {
            _PageDef();
            return View();
        }
        #region HRA
        public IActionResult SubArea()
        {
            _PageDef();
            return View();
        }
        public IActionResult HazardType()
        {
            _PageDef();
            return View();
        }
        public IActionResult HazardRiskFactors()
        {
            _PageDef();
            return View();
        }
        public IActionResult HealthEffectRating()
        {
            _PageDef();
            return View();
        }
        public IActionResult WorkGroup()
        {
            _PageDef();
            return View();
        }
        public IActionResult WorkerGroup()
        {
            _PageDef();
            return View();
        }
        public IActionResult FrequencyLevel()
        {
            _PageDef();
            return View();
        }
        public IActionResult CompareExposureRating()
        {
            _PageDef();
            return View();
        }
        public IActionResult CompareInitialRiskRating()
        {
            _PageDef();
            return View();
        }
        public IActionResult SubAreaEquipment()
        {
            _PageDef();
            return View();
        }
        public IActionResult Sections()
        {
            _PageDef();
            return View();
        }
        #endregion HRA

        #region JSEA
        public IActionResult Mandatorynote()
        {
            _PageDef();
            return View();
        }
        public IActionResult TaskType()
        {
            _PageDef();
            return View();
        }
        public IActionResult TagID()
        {
            _PageDef();
            return View();
        }

        #endregion JSEA

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}