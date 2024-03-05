
using OfficeOpenXml;
using System.Xml;

namespace Helpers;

public class ExportExcel
{
    HttpClient _HttpClient;
    IConfiguration _IConfiguration;
    string pathExports;
    string pathStatic;
    string BinaryLocation;
    string _PathReq;

    // public static PdfHelper Instance { get; } = new PdfHelper();
    public ExportExcel(IConfiguration IConfiguration)
    {
        HttpClientHandler clientHandler = new HttpClientHandler();

        clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };
        _HttpClient = new HttpClient(clientHandler);
        _IConfiguration = IConfiguration;
        pathExports = _IConfiguration["pathExportsExcel"];
        _PathReq = IConfiguration["BaseURL"];
        pathStatic = IConfiguration["pathStatic"];
        BinaryLocation = IConfiguration["BinaryLocation"];

    }

    public string htmlToXLSX(string strhtml, string fileNameClient)
    {
        string path = pathStatic;
        string fileName = $@"{fileNameClient}.xlsx";
        string PathReqFull = $@"{_PathReq}/static/{fileName}";
        string PathReq = $@"{_PathReq}/static/excel/";

        string xlsxFile = pathExports + fileName;
        string xlsxFileReq = $@"{_PathReq}/static/excel/" + fileName;
        Boolean Existsdir = Directory.Exists(pathExports);
        if (!Existsdir)
        {
            Directory.CreateDirectory(pathExports);
        }

        // Load the HTML file into a string
        string html = @$"{strhtml}";
        // string html = "<table><tr><td>Row 1 Column 1</td><td>Row 1 Column 2</td></tr><tr><td>Row 2 Column 1</td><td>Row 2 Column 2</td></tr></table>";
        // Create a new Excel package and add a new worksheet
        Console.WriteLine(html);
        using (var package = new ExcelPackage())
        {
            var worksheet = package.Workbook.Worksheets.Add("Sheet1");

            // Load the HTML string into an XmlDocument
            var htmlDoc = new XmlDocument();
            htmlDoc.LoadXml(string.Format("<root>{0}</root>", html));

            // Get the table node from the XmlDocument
            var tableNode = htmlDoc.SelectSingleNode("//table");

            // Get the rows of the table
            var rowNodes = tableNode.SelectNodes("tr");

            // Loop through the rows and cells of the table
            for (int rowIndex = 0; rowIndex < rowNodes.Count; rowIndex++)
            {
                var cellNodes = rowNodes[rowIndex].SelectNodes("td");

                for (int cellIndex = 0; cellIndex < cellNodes.Count; cellIndex++)
                {
                    // Get the text of the cell
                    var cellText = cellNodes[cellIndex].InnerText;

                    // Set the value of the cell in the worksheet
                    worksheet.Cells[rowIndex + 1, cellIndex + 1].Value = cellText;

                }
            }


            // Save the Excel package to a file
            File.WriteAllBytes(xlsxFile, package.GetAsByteArray());
        }

        return xlsxFileReq;
    }

}