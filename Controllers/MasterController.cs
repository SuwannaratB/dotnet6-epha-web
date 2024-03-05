using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using System.Security.Principal;
using ServicesAuthen;
using Newtonsoft.Json;
using Models;
using Helperselpers;


namespace dotnet6_epha_web.Controllers
{
    public class MasterController : Controller
    {
        private readonly ILogger<MasterController> _logger;
        public readonly sessionAuthen _sessionAuthen;

        public MasterController(ILogger<MasterController> logger, sessionAuthen sessionAuthen)
        {
            _sessionAuthen = sessionAuthen;

            _logger = logger;


        }

        public IActionResult Index()
        {

            ViewData["user_display"] = _sessionAuthen.user_display;
            ViewData["user_name"] = _sessionAuthen.user_name;
            ViewData["role_type"] = _sessionAuthen.role_type;
            ViewData["pha_no"] = _sessionAuthen.pha_no;
            ViewData["pha_status"] = _sessionAuthen.pha_status;

            ViewData["user_name"] = "zkuluwat";
            ViewData["role_type"] = "admin";
            ViewData["pha_no"] = "";
            ViewData["pha_status"] = "";
            ViewData["token_doc"] = "";

            return View();
        }
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