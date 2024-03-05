namespace Models;

public class AzureAdLogin
{
    public string client_id { get; set; }
    public string redirect_uri { get; set; }
    public string response_mode { get; } = "form_post ";
    public string scope { get; set; } = "openid+profile+email"; 
}
public class AuthDetails
{
    public string UserName { get; set; }
    public string AccessToken { get; set; }
}
// client_id=6731de76-14a6-49ae-97bc-6eba6914391e        // Your app registration's Application (client) ID
// &response_type=id_token%20token                       // Requests both an ID token and access token
// &redirect_uri=http%3A%2F%2Flocalhost%2Fmyapp%2F       // Your application's redirect URI (URL-encoded)
// &response_mode=form_post                              // 'form_post' or 'fragment'
// &scope=openid+profile+email 

