$(document).ready(function () {
  //naviLoading();

  // Check session flag on page load
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) {
    logout();
  } else {
    const storedData = localStorage.getItem("userData");
    const userData = JSON.parse(storedData);
    $("#uName").text(userData.Name);
  }

  $("#logOut").click(function () {
    logout();
  });

  //naviLoadingHide();
});

function logout() {
  //naviLoading();
  localStorage.removeItem("userData");
  localStorage.removeItem("isLoggedIn");
  window.location.href = "/login.html";
}

function naviLoading() {
  $("body").animate({ scrollTop: 0 }, 0);
  $("body").after('<div id="DarkWorld"></div>');
  $("body").before(
    '<div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>'
  );
  $(".spinner").center();
}

function naviLoadingHide() {
  $("#DarkWorld").remove();
  $(".spinner").remove();
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

jQuery.fn.center = function () {
  this.css("position", "fixed");
  this.css(
    "top",
    Math.max(
      0,
      ($(window).height() - $(this).outerHeight()) / 2 + $(window).scrollTop()
    ) + "px"
  );
  this.css(
    "left",
    Math.max(
      0,
      ($(window).width() - $(this).outerWidth()) / 2 + $(window).scrollLeft()
    ) + "px"
  );
  return this;
};
