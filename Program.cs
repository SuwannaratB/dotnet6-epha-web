using Helperselpers;
using ServicesAuthen;
 
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllersWithViews();
builder.Services.AddSession(options =>
{
    // options.IdleTimeout = TimeSpan.FromMinutes(30);
});
// SESSION
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<sessionAuthen, sessionAuthen>();
builder.Services.AddScoped<WSSoaps, WSSoaps>();

builder.Services.AddCors(p => p.AddPolicy("AllowOrigin", builder =>
{
    builder.WithOrigins("*")
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials();
}));

// AZUE AD 
var initialScopes = builder.Configuration.GetValue<string>("DownstreamApi:Scopes")?.Split(' ');
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}


app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseCors("AllowOrigin");

// AZUE AD 
app.UseAuthentication();
app.UseAuthorization();
app.UseSession();
app.MapControllerRoute(
    name: "default",
//pattern: "{controller=Home}/{action=Index}");
pattern: "{controller=Login}/{action=Index}");
//pattern: "{controller=Hazop}/{action=Index}");

app.Run();

builder.Services.AddScoped<sessionAuthen>();
builder.Services.AddScoped<WSSoaps>();
