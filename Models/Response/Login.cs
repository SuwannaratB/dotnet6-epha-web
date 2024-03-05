using Newtonsoft.Json;

namespace EOSL.Models;

public class LoginModel
{
    public string USER_NAME { get; set; }


}

public class LoginResModel
{
    [JsonProperty("ROLE_TYPE")]
    public string RoleType { get; set; }

    [JsonProperty("USER_NAME")]
    public string UserName { get; set; }

    [JsonProperty("USER_DISPLAY")]
    public string UserDisplay { get; set; }

    [JsonProperty("USER_IMG")]
    public string UserImg { get; set; }

    [JsonProperty("USER_POSITION")]
    public object UserPosition { get; set; }
}


