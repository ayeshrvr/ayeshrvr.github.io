var isErrorOpen = false;
const inputs = document.querySelectorAll(".input");

alert("Forgot!!");

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

  $.ajax({
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
  });
}

function logError() {
  naviLoadingHide();
  $("#logErr").css("display", " block");
  $(".one").addClass("error");
  $(".pass").addClass("error");
}

function forgot()
{
	alert("Forgot Password?\nPlease contact IGT RMS Team and follow instructions!")
}