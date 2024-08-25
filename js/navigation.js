$(document).ready(function () {
  naviLoading();

  // Check session flag on page load
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) {
    logout();
  } else {
    const storedData = localStorage.getItem("userData");
    const userData = JSON.parse(storedData);
    $("#uName").text(userData.Name);
    $("#uDesig").text(userData.Designation);
  }

  $("#logOut").click(function () {
    logout();
  });

  naviLoadingHide();
});

function logout() {
  naviLoading();
  localStorage.removeItem("userData");
  localStorage.removeItem("isLoggedIn");
  window.location.href = "/login.html";
}

/* function sessionExpired()
{
  naviLoadingHide();
  $.confirm({
    icon: 'fas fa-exclamation-circle',
    title: '&nbsp;Session Expired!',
    content: 'You were idle for a long time and session has expired. Please Login again!',
    type: 'red',
    typeAnimated: true,
    buttons: {
        tryAgain: {
            text: 'OK',
            btnClass: 'btn-red',
            action: function(){
              naviLoading();
              window.location.href = api_core + "SessionHandler/logOut";
            }
        }
    }
  });
} */
