$(document).ready(function () {
  naviLoading();

  // Check session flag on page load
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) {
    logout();
  } else {
    const storedData = localStorage.getItem("userData");
    const userData = JSON.parse(storedData);
    createSideNav();
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

function createSideNav(){
var htmlText = '<div>'+
      '<li><a id="uName" class="subheader" style="color: #FF8816;"></a></li>'+
      '<li><a id="uDesig" class="subheader" style="margin-top: -25px; font-size: 11px;"></a></li>'+
  '</div>'+
  '<li><a href="/" class="waves-effect">'+
      '<i class="material-icons">home</i>Home</a>'+
  '</li>'+
  '<li><a href="/" class="waves-effect">'+
      '<i class="material-icons">date_range</i>Attendance</a>'+
  '</li>'+
  '<li><a href="/pages/runningchart.html" class="waves-effect">'+
      '<i class="material-icons">directions_car</i>Running Chart</a>'+
  '</li>'+
  '<li><a href="/pages/expenditures.html" class="waves-effect">'+
      '<i class="material-icons">monetization_on</i>Expenditures</a>'+
  '</li>'+
  '<li><a href="/" class="waves-effect">'+
      '<i class="material-icons">straighten</i>Project Progress</a>'+
  '</li>'+
  '<li>'+
      '<div class="divider"></div>'+
  '</li>'+
  '<li><a href="/" class="waves-effect">'+
          '<i class="material-icons">person_pin</i>Profile</a>'+
  '</li>'+
  '<li><a href="/" class="waves-effect">'+
      '<i class="material-icons">info</i>About</a>'+
  '</li>'+
  '<li><a id="logOut" href="#" class="waves-effect">'+
      '<i class="material-icons">lock</i>Logout</a>'+
  '</li>';
  
  $("#side-menu").html(htmlText);
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
