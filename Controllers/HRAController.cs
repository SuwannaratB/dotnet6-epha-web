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
    public class HRAController : Controller
    {
        #region config
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

        private void Check_QueryString()
        {
            //if (_sessionAuthen.role_type == null)
            //{
            //    _sessionAuthen.user_name = "zkuluwat";
            //    _sessionAuthen.role_type = "admin";
            //}

            try
            {

                using (Aes aesAlgorithm = Aes.Create())
                {
                    try
                    {
                        var location = new Uri($"{Request.Scheme}://{Request.Host}{Request.Path}{Request.QueryString}");

                        //GKPg7bYFGHHXfIZxhgUT1ch5z6LlHEvgrLW9l+pi+jc=&7fczoMgVDvnAa07siVuOtg==
                        string QueryText = (location.Query).Replace("?", "");

                        if (QueryText == "" && _sessionAuthen.role_type != null)
                        {
                            if (_sessionAuthen.service_url_link != "")
                            {
                                QueryText = _sessionAuthen.service_url_link;
                            }
                        }
                        if (QueryText != "")
                        {
                            string cipherText = "";
                            string keyBase64 = "";
                            string vectorBase64 = "";
                            string[] xSplit = QueryText.Split('&');

                            if (xSplit.Length > 0)
                            {
                                if (xSplit[0].ToString() == "create")
                                {
                                    _sessionAuthen.pha_seq = "";
                                    _sessionAuthen.pha_no = "";
                                    _sessionAuthen.pha_status = "draft";
                                    _sessionAuthen.pha_type_doc = "create";
                                    return;
                                }

                                cipherText = xSplit[0];
                                keyBase64 = xSplit[1];
                                vectorBase64 = xSplit[2];
                            }

                            string token = DecryptDataWithAes(cipherText, keyBase64, vectorBase64);
                            if (token != "")
                            {
                                try
                                {
                                    _sessionAuthen.service_url_link = QueryText;
                                    _sessionAuthen.pha_seq = (token.Split('&')[0]).Split('=')[1];
                                    _sessionAuthen.pha_no = (token.Split('&')[1]).Split('=')[1];

                                    //1=draft, 2=conduct, 3=followup, 4=approver review, 5=closed, 9=review doc
                                    string step = (token.Split('&')[2]).Split('=')[1];
                                    if (step == "1") { _sessionAuthen.pha_type_doc = "draft"; }
                                    else if (step == "2") { _sessionAuthen.pha_type_doc = "conduct"; }
                                    else if (step == "3") { _sessionAuthen.pha_type_doc = "followup"; }
                                    else if (step == "4")
                                    {
                                        string approver_type = (token.Split('&')[2]).Split('=')[1];
                                        if (approver_type == "approve") { _sessionAuthen.pha_type_doc = "approve"; }
                                        else if (approver_type == "reject") { _sessionAuthen.pha_type_doc = "reject"; }
                                        else if (approver_type == "reject_no_comment") { _sessionAuthen.pha_type_doc = "reject_no_comment"; }
                                    }
                                    else if (step == "9") { _sessionAuthen.pha_type_doc = "review_document"; }
                                    else { _sessionAuthen.pha_type_doc = ""; }
                                }
                                catch { }
                            }
                        }
                    }
                    catch { }
                }
            }
            catch (System.Exception)
            {
                throw;
            }
        }

        private readonly ILogger<HazopController> _logger;
        public readonly IConfiguration _IConfiguration;
        public readonly sessionAuthen _sessionAuthen;

        public HRAController(ILogger<HazopController> logger,
            sessionAuthen sessionAuthen,
            IConfiguration IConfiguration
        )
        {
            _sessionAuthen = sessionAuthen;
            _logger = logger;
            _IConfiguration = IConfiguration;
        }
        #endregion config
        public async Task<IActionResult> next_page([FromBody] LoadSessionDataViewModel model)
        {
              if (!ModelState.IsValid)
                {
                    return View(model);
                }

            _sessionAuthen.pha_type_doc = (model.pha_type_doc + "");
            _sessionAuthen.role_type = _sessionAuthen.role_type;

            LoginViewModel res_page = new LoginViewModel();
            if (_sessionAuthen.pha_type_doc == "back")
            {
                res_page.page = model.controller_action_befor;
            }
            else if (_sessionAuthen.pha_type_doc == "create")
            {
                _sessionAuthen.pha_seq = "";
                _sessionAuthen.pha_no = "";
                _sessionAuthen.pha_status = "11";
                _sessionAuthen.controller_action_befor = (model.pha_sub_software + "");

                res_page.page = model.pha_sub_software + "/Index";
            }
            else if (_sessionAuthen.pha_type_doc == "followupupdate")
            {
                _sessionAuthen.controller_action_befor = (model.pha_sub_software + "");
                _sessionAuthen.pha_seq = (model.pha_seq + "");
                _sessionAuthen.pha_no = (model.pha_no + "");
                _sessionAuthen.pha_status = (model.pha_status + "");
                _sessionAuthen.responder_user_name = (model.responder_user_name + "");

                res_page.page = "Hazop/FollowupUpdate";;
            }
            else if (_sessionAuthen.pha_type_doc == "edit")
            { 
                _sessionAuthen.controller_action_befor = ("hra");
                _sessionAuthen.pha_seq = (model.pha_seq + "");

                res_page.page = model.pha_sub_software + "/Index"; 
            }
            else if (_sessionAuthen.pha_type_doc == "preview")
            {
                _sessionAuthen.controller_action_befor = ("FollowupUpdate");
                _sessionAuthen.pha_seq = (model.pha_seq + "");

                res_page.page = model.pha_sub_software + "/Index";
            }

            return Ok(res_page);
        }

        public IActionResult Index()
        {
            Check_QueryString();

            if (_sessionAuthen.role_type == "" || _sessionAuthen.role_type == null)
            {
                return RedirectToAction("Index", "Login");
            }

            _sessionAuthen.service_api_url = _IConfiguration["EndPoint:service_api_url"];

            if (_sessionAuthen.controller_action_befor == "")
            {
                _sessionAuthen.controller_action_befor = "hazop/Followup";
            }
            else if (_sessionAuthen.controller_action_befor == "FollowupUpdate")
            {
                _sessionAuthen.controller_action_befor = "hazop/FollowupUpdate";
            }
            else
            {
                _sessionAuthen.controller_action_befor = "hazop/Search";
            }

            string vendor = _sessionAuthen.vendor;


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

            if ((ViewData["pha_type_doc"] + "").ToString() == "create")
            {

            }
            else if ((ViewData["pha_type_doc"] + "").ToString() == "search")
            {

            }
            else if ((ViewData["pha_type_doc"] + "").ToString() == "followup")
            {
                return View("Followup", "HRA");
            }
            else if ((ViewData["pha_type_doc"] + "").ToString() == "followupupdate")
            {
                ViewData["responder_user_name"] = _sessionAuthen.responder_user_name;

                return View("FollowupUpdate", "HRA");
            }
            else if ((ViewData["pha_type_doc"] + "").ToString() == "approve")
            { 
                return View("Approve", "HRA");
            }
            else if ((ViewData["pha_type_doc"] + "").ToString() == "reject_no_comment")
            { 
                return View("Approve", "HRA");
            }
            else if ((ViewData["pha_type_doc"] + "").ToString() == "reject")
            {
                //return View("Index", "HRA");//focus tab manage
            }
            else if ((ViewData["pha_type_doc"] + "").ToString() == "preview")
            {
                return View("Index", "HRA");//focus tab manage
            }

            return View();
        }

        public IActionResult Followup()
        {
            if (_sessionAuthen.role_type == "" || _sessionAuthen.role_type == null)
            {
                return RedirectToAction("Index", "Login");
            }

            _sessionAuthen.service_api_url = _IConfiguration["EndPoint:service_api_url"];
            _sessionAuthen.controller_action_befor = "Home/Portal";
             
            ViewData["user_display"] = _sessionAuthen.user_display;
            ViewData["user_name"] = _sessionAuthen.user_name;
            ViewData["role_type"] = _sessionAuthen.role_type;
            ViewData["controller_action_befor"] = _sessionAuthen.controller_action_befor;
            ViewData["service_api_url"] = _sessionAuthen.service_api_url;

            //กรณีที่มีเลข seq แสดงว่ามาจากหน้า search ให้ แสดง details เลย  
            ViewData["pha_seq"] = _sessionAuthen.pha_seq;

            return View();
        }

        [HttpPost]
        public async Task<IActionResult> set_session_doc([FromBody] LoadSessionDataViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }
            _sessionAuthen.service_api_url = _IConfiguration["EndPoint:service_api_url"];
            _sessionAuthen.controller_action_befor = model.controller_action_befor;// "Home/Portal"; 
            _sessionAuthen.pha_seq = model.pha_seq;
            _sessionAuthen.pha_no = model.pha_no;
            _sessionAuthen.pha_status = model.pha_status;
            _sessionAuthen.pha_type_doc = model.pha_type_doc;


            ViewData["user_display"] = _sessionAuthen.user_display;
            ViewData["user_name"] = _sessionAuthen.user_name;
            ViewData["role_type"] = _sessionAuthen.role_type;

            ViewData["pha_seq"] = _sessionAuthen.pha_seq;
            ViewData["pha_no"] = _sessionAuthen.pha_no;
            ViewData["pha_status"] = _sessionAuthen.pha_status;
            ViewData["pha_type_doc"] = _sessionAuthen.pha_type_doc;
            ViewData["controller_action_befor"] = _sessionAuthen.controller_action_befor;
            ViewData["service_api_url"] = _sessionAuthen.service_api_url;


            LoginViewModel res_page = new LoginViewModel();
            res_page.msg = "";
            return Ok(res_page);
        }

        [HttpPost]
        public async Task<IActionResult> follow_back_search(LoadSessionDataViewModel model)
        {

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            _sessionAuthen.pha_seq = "";
            _sessionAuthen.pha_type_doc = "search";
            _sessionAuthen.role_type = _sessionAuthen.role_type;

            LoginViewModel res_page = new LoginViewModel();
            res_page.seq = _sessionAuthen.pha_seq;

            return Ok(res_page);
        }

        [HttpPost] 
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
