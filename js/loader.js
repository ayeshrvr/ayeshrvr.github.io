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