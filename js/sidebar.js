$(document).ready(function () {
  let jwt = parseJwt(sessionStorage.getItem("token"));
  let staffId = jwt["sub"];
  if ("tga000" != staffId) {
    checkPermission();
  }
});

function checkPermission() {
  $("#fa-house-chimney-medical").hide();
  $("#fa-store").hide();
  $("#fa-hand-holding-heart").hide();
  $("#fa-facebook-messenger").hide();
  $("#fa-book-open").hide();
  $("#fa-member").hide();
}

function parseJwt(token) {
  if (token == null) {
    console.log("token = null ,return");
    return;
  }
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
