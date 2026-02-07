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

  $.ajax({
      // We filter the query directly in the URL: ?username=eq.VALUE&password=eq.VALUE
      url: `${SB_URL}/rest/v1/users?username=eq.${userName}&password=eq.${password}&select=*`,
      method: "GET",
      headers: {
          "apikey": SB_KEY,
          "Authorization": `Bearer ${SB_KEY}`,
          "Content-Type": "application/json"
      },
      success: function(data) {
          // 2. Check if a matching user was found
          if (data.length > 0) {
              // Success: Save user info to LocalStorage so they stay logged in
              localStorage.setItem('userData', JSON.stringify(data[0]));
              localStorage.setItem('isLoggedIn', true);
              window.location.href = '/index.html';

          } else {
              // Failure
              alert('Invalid username or password.');
              logError();
          }
      },
      error: function(err) {
           logError();
      }
  });
  
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