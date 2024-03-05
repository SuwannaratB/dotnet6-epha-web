namespace Models;

public class LoginViewModel
{
    public string? user_name { get; set; }
    public string? role_type { get; set; }
    public string? page { get; set; }
    public string? seq { get; set; }
    public string? msg { get; set; }

}
public class LoginFromBodyModel
{
    public string user_name { get; set; } = "";
    public string pass_word { get; set; } = "";

}

public class LoginError
{
    public string Message { get; set; } = "";
    public int Code { get; set; }

}

public class LoadSessionDataViewModel
{
    public string? user_name { get; set; }
    public string? role_type { get; set; }
    public string? pha_no { get; set; } 
    public string? pha_seq { get; set; } 
    public string? pha_type_doc { get; set; } 
    public string? pha_sub_software { get; set; } 
    public string? pha_status { get; set; } 
    public string? controller_action_befor { get; set; }
    public string? responder_user_name { get; set; }

}