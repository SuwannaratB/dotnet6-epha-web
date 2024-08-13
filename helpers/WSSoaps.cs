namespace Helperselpers;
using System.Net.Http.Headers;
using System.Xml;
using Newtonsoft.Json;
using System.Text;
using EOSL.Models;
public class WSSoaps
{
    HttpClient _HttpClient;
    IConfiguration _IConfiguration;
    public WSSoaps(IConfiguration IConfiguration)
    {
        HttpClientHandler clientHandler = new HttpClientHandler();

        clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };
        _HttpClient = new HttpClient(clientHandler);
        _IConfiguration = IConfiguration;
    }
    public async Task<string> decode(string value)
    {
        string service_api_url = _IConfiguration["DecodeURL"];
        var person = new { val = value };
        var json = $@"""{value}""";

        var data = new StringContent(json, Encoding.UTF8, "application/json");
        var result = await _HttpClient.PostAsync(service_api_url, data);
        string resultContent = await result.Content.ReadAsStringAsync();

        return resultContent;
    }
    public async Task<string> post_check_authorization(string user_name, string user_pass)
    {
        string service_api_url = _IConfiguration["EndPoint:service_api_url"] + "login/check_authorization";
        var person = new { user_name = user_name, user_pass = user_pass };
        var json = JsonConvert.SerializeObject(person);
        var data = new StringContent(json, Encoding.UTF8, "application/json");
        var result = await _HttpClient.PostAsync(service_api_url, data);
        string resultContent = await result.Content.ReadAsStringAsync();

        return resultContent.ToString();
    }  
    public string Post_Register_Account(string user_email, string accept_status)
    {
        try
        {
            string serviceApiUrl = _IConfiguration["EndPoint:service_api_url"] + "Login/update_register_account";
            var person = new { user_email = user_email, accept_status = accept_status };
            var json = JsonConvert.SerializeObject(person);
            var data = new StringContent(json, Encoding.UTF8, "application/json");

            var result = _HttpClient.PostAsync(serviceApiUrl, data).Result; // ใช้ .Result เพื่อรอให้ Task เสร็จสิ้นและได้ผลลัพธ์กลับมา
            result.EnsureSuccessStatusCode(); // Throws an exception if the HTTP response is an error code.
            string resultContent = result.Content.ReadAsStringAsync().Result; // ใช้ .Result เพื่อรอให้ Task เสร็จสิ้นและได้ผลลัพธ์กลับมา

            return resultContent;
        }
        catch (HttpRequestException httpEx)
        {
            // Log the exception details here (e.g., log to a file or a monitoring system)
            Console.WriteLine($"Request error: {httpEx.Message}");
            return $"Error: {httpEx.Message}";
        }
        catch (Exception ex)
        {
            // Log the exception details here (e.g., log to a file or a monitoring system)
            Console.WriteLine($"An error occurred: {ex.Message}");
            return $"Error: {ex.Message}";
        }
    } 

}