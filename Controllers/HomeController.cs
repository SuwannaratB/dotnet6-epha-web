using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ServicesAuthen;
using Models;

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

        public async Task<IActionResult> Index()
        {
            _sessionAuthen.pha_seq = "";
            _sessionAuthen.pha_no = "";
            _sessionAuthen.pha_status = "";
            _sessionAuthen.pha_type_doc = "";
            _sessionAuthen.controller_action_befor = "";
            return View();
        }

        public async Task<IActionResult> Portal()
        {
            _sessionAuthen.pha_seq = "";
            _sessionAuthen.pha_no = "";
            _sessionAuthen.pha_status = "";
            _sessionAuthen.pha_type_doc = "";
            _sessionAuthen.controller_action_befor = "";
            ViewData["pha_no"] = _sessionAuthen.pha_no;
            ViewData["pha_status"] = _sessionAuthen.pha_status;
            ViewData["controller_action_befor"] = "home/portal";
            ViewData["service_api_url"] = _sessionAuthen.service_api_url;
            return View();
        }

        public async Task<IActionResult> HomeTasks()
        {
            ViewData["pha_seq"] = null;
            ViewData["pha_no"] = null;
            ViewData["pha_status"] = null;
            ViewData["pha_type_doc"] = null;
            ViewData["controller_action_befor"] = "home/portal";
            ViewData["service_api_url"] = _sessionAuthen.service_api_url;
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> next_page([FromBody] LoadSessionDataViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }
            _sessionAuthen.pha_type_doc = (model.pha_type_doc + "");
            LoginViewModel res_page = new LoginViewModel();
            if (_sessionAuthen.pha_type_doc == "back")
            {
                res_page.page = model.controller_action_befor;
            }
            else if (_sessionAuthen.pha_type_doc == "followup" || _sessionAuthen.pha_type_doc == "review_followup")
            {
                _sessionAuthen.controller_action_befor = (model.pha_sub_software + "");
                _sessionAuthen.controller_action_befor = (model.controller_action_befor + "");
                _sessionAuthen.pha_seq = (model.pha_seq + "");
                _sessionAuthen.pha_no = model.pha_no;
                _sessionAuthen.responder_user_name = (model.responder_user_name + "");
                res_page.page = (model.pha_sub_software == "jsea" ? model.pha_sub_software : "hazop") + @"/followupUpdate";
                _sessionAuthen.pha_sub_software = (model.pha_sub_software + "");
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
