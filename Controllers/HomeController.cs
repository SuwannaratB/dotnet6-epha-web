using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using System.Security.Principal;
using ServicesAuthen;
using Newtonsoft.Json;
using Models;
using Helperselpers;
using System.Security.Cryptography;


namespace dotnet6_epha_web.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        public readonly IConfiguration _IConfiguration;
        public readonly sessionAuthen _sessionAuthen;


        public HomeController(ILogger<HomeController> logger,
            sessionAuthen sessionAuthen,
            IConfiguration IConfiguration
        )
        {
            _sessionAuthen = sessionAuthen;
            _logger = logger;
            _IConfiguration = IConfiguration;
            _sessionAuthen.service_api_url = _IConfiguration["EndPoint:service_api_url"];

        }

        public async Task<IActionResult> Index(string keyToken = "")
        {
            if (_sessionAuthen.role_type == "" || _sessionAuthen.role_type == null)
            {
                return RedirectToAction("Index", "Login");
            }

            _sessionAuthen.pha_seq = "";
            _sessionAuthen.pha_no = "";
            _sessionAuthen.pha_status = "";
            _sessionAuthen.pha_type_doc = "";
            _sessionAuthen.controller_action_befor = "";

            ViewData["user_display"] = _sessionAuthen.user_display;
            ViewData["user_name"] = _sessionAuthen.user_name;
            ViewData["role_type"] = _sessionAuthen.role_type;

            return View();
        }

        public async Task<IActionResult> Portal()
        {
            _sessionAuthen.pha_seq = "";
            _sessionAuthen.pha_no = "";
            _sessionAuthen.pha_status = "";
            _sessionAuthen.pha_type_doc = "";
            _sessionAuthen.controller_action_befor = "";


            if (_sessionAuthen.role_type == "" || _sessionAuthen.role_type == null)
            {
                return RedirectToAction("Index", "Login");
            }

            ViewData["user_display"] = _sessionAuthen.user_display;
            ViewData["user_name"] = _sessionAuthen.user_name;
            ViewData["role_type"] = _sessionAuthen.role_type;
            ViewData["pha_no"] = _sessionAuthen.pha_no;
            ViewData["pha_status"] = _sessionAuthen.pha_status;
            ViewData["controller_action_befor"] = "home/portal";
            ViewData["service_api_url"] = _sessionAuthen.service_api_url;
            ViewData["pha_sub_software"] = _sessionAuthen.pha_sub_software;

            return View();
        }

        public async Task<IActionResult> HomeTasks()
        {
            if (_sessionAuthen.role_type == "" || _sessionAuthen.role_type == null)
            {
                return RedirectToAction("Index", "Login");
            }
            ViewData["user_display"] = _sessionAuthen.user_display;
            ViewData["user_name"] = _sessionAuthen.user_name;
            ViewData["role_type"] = _sessionAuthen.role_type;

            ViewData["pha_seq"] = null;
            ViewData["pha_no"] = null;
            ViewData["pha_status"] = null;
            ViewData["pha_type_doc"] = null;
            ViewData["pha_sub_software"] = _sessionAuthen.pha_sub_software;
            ViewData["controller_action_befor"] = "home/portal";
            ViewData["service_api_url"] = _sessionAuthen.service_api_url;


            return View();
        }

        [HttpPost]
        public async Task<IActionResult> next_page([FromBody] LoadSessionDataViewModel model)
        {
            _sessionAuthen.pha_type_doc = (model.pha_type_doc + "");
            _sessionAuthen.role_type = _sessionAuthen.role_type;

            LoginViewModel res_page = new LoginViewModel();
            if (_sessionAuthen.pha_type_doc == "back")
            {
                res_page.page = model.controller_action_befor;
            }
            else if (_sessionAuthen.pha_type_doc == "followup"
                || _sessionAuthen.pha_type_doc == "review_followup")
            {
                _sessionAuthen.controller_action_befor = (model.pha_sub_software + "");
                _sessionAuthen.controller_action_befor = (model.controller_action_befor + "");
                _sessionAuthen.pha_seq = (model.pha_seq + "");

                _sessionAuthen.responder_user_name = (model.responder_user_name + "");

                res_page.page = (model.pha_sub_software == "jsea" ? model.pha_sub_software : "hazop") + @"/followupUpdate";
                _sessionAuthen.pha_sub_software = (model.pha_sub_software + "");
            }
            else if (_sessionAuthen.pha_type_doc == "followup_from_portal")
            {
                _sessionAuthen.pha_sub_software = (model.pha_sub_software + "");
                _sessionAuthen.controller_action_befor = (model.pha_sub_software + "");
                //_sessionAuthen.controller_action_befor = (model.controller_action_befor + "");
                _sessionAuthen.pha_seq = (model.pha_seq + "");

                _sessionAuthen.responder_user_name = (model.responder_user_name + "");
                res_page.page = @"hazop/followup";

            }
            else
            {
                _sessionAuthen.controller_action_befor = (model.pha_sub_software + "");
                _sessionAuthen.pha_seq = (model.pha_seq + "");

                res_page.page = model.pha_sub_software + "/index";
            }

            return Ok(res_page);
        }




        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(
                new ErrorViewModel
                {
                    RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier
                }
            );
        }
    }
}
