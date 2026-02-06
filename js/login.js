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
  naviLoading();
  var userName = $.trim($("#txtUser").val());
  var password = $.sha1($.trim($("#txtPw").val()));

  const sheetDataHandler = (sheetData) => {
    if(sheetData.length > 0){
      const serializedData = JSON.stringify(sheetData[0]);
      localStorage.setItem('userData', serializedData);
      localStorage.setItem('isLoggedIn', true);
      window.location.href = '/index.html';
    }
    else{
      logError();
    }
  };

  return false;
}

function logError() {
  naviLoadingHide();
  $("#logErr").css("display", " block");
  $(".one").addClass("error");
  $(".pass").addClass("error");
}

function forgot()
{
	alert("Forgot Password?\nPlease contact Admin and follow instructions!")
}