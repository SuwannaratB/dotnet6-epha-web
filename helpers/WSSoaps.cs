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
    public async Task<string> Post_check_user_login(string user_name, string user_pass)
    {
        string service_api_url = _IConfiguration["EndPoint:service_api_url"] + "/check_user_login";
        Console.WriteLine(service_api_url);
        _HttpClient.DefaultRequestHeaders.Accept
        .Add(new MediaTypeWithQualityHeaderValue("application/json"));
        var person = new { emp_id = "", indicator = "", user_name = user_name, user_pass = user_pass };
        var json = JsonConvert.SerializeObject(person);
        var data = new StringContent(json, Encoding.UTF8, "application/json");
        LoginResModel[] resultContents = null;
        string resultContent = "";
        var result = await _HttpClient.PostAsync(service_api_url, data);
        resultContent = await result.Content.ReadAsStringAsync();
        Console.WriteLine(resultContent);

        return resultContent.ToString().Replace("\"", "").Replace(@"\", "'"); ;

    }
    public async Task<string> Post_get_emp_data_login(string user_name)
    {
        ///Login/check_authorization
        string service_api_url = _IConfiguration["EndPoint:service_api_url"] + "/get_emp_data_login";
        var person = new { emp_id = "", user_pass = "", indicator = "", user_name = user_name };
        var json = JsonConvert.SerializeObject(person);
        var data = new StringContent(json, Encoding.UTF8, "application/json");
        // var content = new FormUrlEncodedContent(new[]
        //     {
        //         new KeyValuePair<string, string>("user_name", user_name),
        //     });
        var result = await _HttpClient.PostAsync(service_api_url, data);
        string resultContent = await result.Content.ReadAsStringAsync();
        XmlDocument doc = new XmlDocument();
        try
        {
            doc.LoadXml(resultContent);
            Console.WriteLine(doc.InnerText);
            return doc.InnerText;

        }
        catch
        {

        }
        return resultContent.ToString().Replace("\"", "").Replace(@"\", "'"); ;
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

    public async Task<string> getAccessControl(string user_name)
    {
        var value = $@" select a.seq_role ,a.user_id,b.seq_menu_sub,lower(c.name) as menu_sub_name
                            ,case when c.seq_menu = 1 then 'admin' else 'dashboard' end  page_type
                            from  eols_m_role_user a
                            inner join  eols_m_role_menu b on a.seq_role = b.seq_role
                            inner join  eols_m_menu_sub c on  b.seq_menu_sub= c.seq 
                            inner join eols_m_role r on a.seq_role = r.seq and lower(r.status_active) = 'active'
                            where lower(a.user_id)  = lower('{user_name}') ";
        string service_api_url = _IConfiguration["EndPoint:user"] + "/CallConnectionAdapter";
        //     _HttpClient.DefaultRequestHeaders.Accept
        // .Add(new MediaTypeWithQualityHeaderValue("text/plain"));
        // var sqlstr = new { xtype = "select", xstring = value };
        // var json = JsonConvert.SerializeObject(sqlstr);
        // var data = new StringContent(json, Encoding.UTF8, "application/json");
        var data = new FormUrlEncodedContent(new[]
           {
                new KeyValuePair<string, string>("evenkey", value),
            });
        string resultContent = "";
        try
        {
            var result = await _HttpClient.PostAsync(service_api_url, data);
            resultContent = await result.Content.ReadAsStringAsync();
        }
        catch (Exception err)
        {
            throw new Exception(err.Message.ToString());
        }
        return resultContent;
    }

    public async Task<string> Post_Register_Account(string user_email, string accept_status)
    {
        string service_api_url = _IConfiguration["EndPoint:service_api_url"] + "Login/update_register_account";
        var person = new { user_email = user_email, accept_status = accept_status };
        var json = JsonConvert.SerializeObject(person);
        var data = new StringContent(json, Encoding.UTF8, "application/json");

        var result = await _HttpClient.PostAsync(service_api_url, data);
        string resultContent = await result.Content.ReadAsStringAsync();
        XmlDocument doc = new XmlDocument();
        try
        {
            doc.LoadXml(resultContent);
            Console.WriteLine(doc.InnerText);
            return doc.InnerText;

        }
        catch
        {

        }
        return resultContent.ToString().Replace("\"", "").Replace(@"\", "'"); ;
    }



}