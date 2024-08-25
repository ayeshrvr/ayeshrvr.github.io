var isErrorOpen = false;
const inputs = document.querySelectorAll(".input");

function addcl() {
  let parent = this.parentNode.parentNode;
  parent.classList.add("focus");
}

function remcl() {
  let parent = this.parentNode.parentNode;
  if (this.value == "") {
    parent.classList.remove("focus");
  }
}

inputs.forEach((input) => {
  input.addEventListener("focus", addcl);
  input.addEventListener("blur", remcl);
});

function validateInput() {
  $(".one, .pass").removeClass("error");
  $("#logErr").css("display", " none");

  var status = true;
  var userName = $.trim($("#txtUser").val());
  var password = $.trim($("#txtPw").val());

  if (userName == "") {
    $(".one").addClass("error");
    status = false;
  }

  if (password == "") {
    $(".pass").addClass("error");
    status = false;
  }
  
  return status;
}

function userLogin() {
  //naviLoading();
  var userName = $.trim($("#txtUser").val());
  var password = $.sha1($.trim($("#txtPw").val()));

  const sheetDataHandler = (sheetData) => {
    if(sheetData.length > 0)
      alert("User Found!");
    else
    logError();
    //ADD YOUR CODE TO WORK WITH sheetData ARRAY OF OBJECTS HERE
  };

  getSheetData({
    // sheetID you can find in the URL of your spreadsheet after "spreadsheet/d/"
    sheetID: "1_eUwXCDKhnNw12IklJdkbZDcvF2Gg5UeH_lI09wKg8c",
    // sheetName is the name of the TAB in your spreadsheet (default is "Sheet1")
    sheetName: "tblUsers",
    query: 'SELECT * WHERE B = "' + userName.toLowerCase() + '" AND C = "'+ password +'"',
    callback: sheetDataHandler
  });

  return false;

  /* $.ajax({
    url: api_core + "users/userLogin",
    type: "POST",
    data: {
      key: "login.host",
      username: userName,
      password: password,
    },
    success: function (data) {
      if (data == 1)
        window.location.href = api_core;
      else if(data == 0)
      window.location.href = api_core + "Users/firstTimeLogin";
      else
        logError();
    },
    error: function (xhr, desc, err) {
      console.log(xhr);
      console.log("Details: " + desc + "\nError:" + err);
    },
  }); */
}

function logError() {
  //naviLoadingHide();
  $("#logErr").css("display", " block");
  $(".one").addClass("error");
  $(".pass").addClass("error");
}

function forgot()
{
	alert("Forgot Password?\nPlease contact IGT RMS Team and follow instructions!")
}