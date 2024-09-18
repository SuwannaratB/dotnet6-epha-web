namespace Helperselpers;
using System.Text;

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
}