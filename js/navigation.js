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
    $("#uName").text(userData.name);
    $("#uDesig").text(userData.designation);
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
  '<li><a href="/" class="waves-effect" style="height: 40px !important; line-height: 40px !important;">'+
      '<i class="material-icons"  style="height: 40px !important; line-height: 40px !important;">home</i>Home</a>'+
  '</li>'+
  '<li><a href="/pages/grid-status.html" class="waves-effect" style="height: 40px !important; line-height: 40px !important;">'+
      '<i class="material-icons"  style="height: 40px !important; line-height: 40px !important;">grid_on</i>Grid Overview</a>'+
  '</li>'+
  '<li><a href="/pages/trade-history.html" class="waves-effect" style="height: 40px !important; line-height: 40px !important;">'+
      '<i class="material-icons"  style="height: 40px !important; line-height: 40px !important;">history</i>Trade History</a>'+
  '</li>'+
  '<li><a href="/pages/market-scanner.html" class="waves-effect" style="height: 40px !important; line-height: 40px !important;">'+
      '<i class="material-icons"  style="height: 40px !important; line-height: 40px !important; ">monetization_on</i>Market Scanner</a>'+
  '</li>'+
  '<li><a href="/pages/analytics.html" class="waves-effect" style="height: 40px !important; line-height: 40px !important;">'+
      '<i class="material-icons" style="height: 40px !important; line-height: 40px !important;">blur_on</i>Analytics</a>'+
  '</li>'+
     '<li><a href="/pages/notifications.html" class="waves-effect" style="height: 40px !important; line-height: 40px !important;">'+
      '<i class="material-icons"  style="height: 40px !important; line-height: 40px !important;">notifications_none</i>Notifications</a>'+
  '</li>'+
  '<li><a href="/pages/logs.html" class="waves-effect" style="height: 40px !important; line-height: 40px !important;">'+
      '<i class="material-icons" style="height: 40px !important; line-height: 40px !important;">format_align_center</i>Logs</a>'+
  '</li>'+
  '<li><a href="/pages/configurations.html" class="waves-effect" style="height: 40px !important; line-height: 40px !important;">'+
      '<i class="material-icons" style="height: 40px !important; line-height: 40px !important;  ">settings</i>Configurations</a>'+
  '</li>'+
  '<li>'+
      '<div class="divider"></div>'+
  '</li>'+
  '<li><a href="/pages/profile.html" class="waves-effect" style="height: 40px !important; line-height: 40px !important;">'+
          '<i class="material-icons" style="height: 40px !important; line-height: 40px !important;">person_pin</i>Profile</a>'+
  '</li>'+
  '<li><a href="/pages/about.html" class="waves-effect" style="height: 40px !important; line-height: 40px !important;">'+
      '<i class="material-icons" style="height: 40px !important; line-height: 40px !important;">info</i>About</a>'+
  '</li>'+
  '<li><a id="logOut" href="#" class="waves-effect" style="height: 40px !important; line-height: 40px !important;">'+
      '<i class="material-icons" style="height: 40px !important; line-height: 40px !important;">lock</i>Logout</a>'+
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
