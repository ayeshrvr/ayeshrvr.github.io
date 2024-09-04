$(document).ready(function () {
  $("#btnAddRC").click(function () {
    addRecord();
  });
});

function addRecord() {
  //naviLoading();

  getSheetData({
    // sheetID you can find in the URL of your spreadsheet after "spreadsheet/d/"
    sheetID: "1_eUwXCDKhnNw12IklJdkbZDcvF2Gg5UeH_lI09wKg8c",
    // sheetName is the name of the TAB in your spreadsheet (default is "Sheet1")
    sheetName: "tblRunningChart",
    writeData: {
        range: 'A:B', // Append data to the end of the sheet
        data: [
          ['NewUsername', 'NewPassword']
        ]
      }
  });

  alert("done");
  return false;
}
