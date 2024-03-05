namespace ServicesAuthen;
using System.Data;
//using Azure.Core;
using Microsoft.AspNetCore.Http;
public class sessionAuthen
{
    private IHttpContextAccessor Accessor;
    public IHttpContextAccessor Accessors;
    public sessionAuthen(IHttpContextAccessor _Accessor)
    {
        Accessor = _Accessor;
        Accessors = _Accessor;
    }
    public string responder_user_name
    {
        get { return Accessor.HttpContext.Session.GetString("responder_user_name") ?? ""; }

        set { Accessor.HttpContext.Session.SetString("responder_user_name", value); }
    }
    public string vendor
    {
        get { return Accessor.HttpContext.Session.GetString("vendor") ?? ""; }

        set { Accessor.HttpContext.Session.SetString("vendor", value); }
    }
    public string service_url_link
    {
        get { return Accessor.HttpContext.Session.GetString("service_url_link") ?? ""; }

        set { Accessor.HttpContext.Session.SetString("service_url_link", value); }
    }
    public string service_api_url
    {
        get { return Accessor.HttpContext.Session.GetString("service_api_url") ?? ""; }

        set { Accessor.HttpContext.Session.SetString("service_api_url", value); }
    }
    public string controller_action_befor
    {
        get { return Accessor.HttpContext.Session.GetString("controller_action_befor") ?? ""; }

        set { Accessor.HttpContext.Session.SetString("controller_action_befor", value); }
    }
    public string pha_no
    {
        get { return Accessor.HttpContext.Session.GetString("pha_no") ?? ""; }

        set { Accessor.HttpContext.Session.SetString("pha_no", value); }
    }
    public string pha_seq
    {
        get { return Accessor.HttpContext.Session.GetString("pha_seq") ?? ""; }

        set { Accessor.HttpContext.Session.SetString("pha_seq", value); }
    }
    public string pha_type_doc
    {
        get { return Accessor.HttpContext.Session.GetString("pha_type_doc") ?? ""; }

        set { Accessor.HttpContext.Session.SetString("pha_type_doc", value); }
    }
    public string token_doc
    {
        get { return Accessor.HttpContext.Session.GetString("token_doc") ?? ""; }

        set { Accessor.HttpContext.Session.SetString("token_doc", value); }
    }
    public string pha_status
    {
        get { return Accessor.HttpContext.Session.GetString("pha_status") ?? ""; }

        set { Accessor.HttpContext.Session.SetString("pha_status", value); }
    }

    public string user_name
    {
        get { return Accessor.HttpContext.Session.GetString("user_name") ?? ""; }

        set { Accessor.HttpContext.Session.SetString("user_name", value); }
    }
    public string role_type
    {
        get { return Accessor.HttpContext.Session.GetString("role_type") ?? ""; }

        set { Accessor.HttpContext.Session.SetString("role_type", value); }
    }
    public string user_display
    {
        get { return Accessor.HttpContext.Session.GetString("user_display") ?? ""; }

        set { Accessor.HttpContext.Session.SetString("user_display", value); }
    }
    public string user_img
    {
        get { return Accessor.HttpContext.Session.GetString("user_img") ?? ""; }

        set { Accessor.HttpContext.Session.SetString("user_img", value); }
    }
    public string dtrole
    {
        get { return Accessor.HttpContext.Session.GetString("dtrole") ?? ""; }

        set { Accessor.HttpContext.Session.SetString("dtrole", value); }
    }
    public string timeoutSession
    {
        get { return Accessor.HttpContext.Session.GetString("timeoutSession") ?? ""; }

        set { Accessor.HttpContext.Session.SetString("timeoutSession", value); }
    }
    public bool isLogin
    {
        get
        {
            return string.IsNullOrEmpty(user_name);
        }
    }
    public String AccessToken
    {
        // ถ้าโดน scan เรื่อง secure อาจจะโดนให้แก้ได้เนื่องจาก เก็บ token  ไว้ใน cookie 
        // ทำให้ฝั่ง client ดึงไปใช้ได้
        // อาจจะต้องเปลียนเป็นเก็บไว้ใน table แล้วให้ api gen guid จากนั่นให้ client นำ guid นั่นไป authen อีกครั้ง
        get
        {
            var value = "";
            if (Accessor.HttpContext.Request.Cookies["jwt"] != null)
            {
                value = Accessor.HttpContext.Request.Cookies["jwt"];
            }
            return !string.IsNullOrEmpty(value) ? value : "";
        }

    }

    public String AccessControl
    {
        get { return Accessor.HttpContext.Session.GetString("AccessControl") ?? ""; }

        set { Accessor.HttpContext.Session.SetString("AccessControl", value); }

    }
    public String Email
    {
        get { return Accessor.HttpContext.Session.GetString("Email") ?? ""; }

        set { Accessor.HttpContext.Session.SetString("Email", value); }

    }


    public override bool Equals(object? obj)
    {
        return base.Equals(obj);
    }

    public override int GetHashCode()
    {
        return base.GetHashCode();
    }

    public override string? ToString()
    {
        return base.ToString();
    }
}