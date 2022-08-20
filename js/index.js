window.onload = (e) => {
  // if (sessionStorage.getItem("token")) {
  //     window.location.replace("index.html");
  // }
};
function login() {
  let userid = document.getElementById("userid").value;
  let inputPassword = document.getElementById("inputPassword").value;
  const loginURL = YOKULT_URL + STAFF + "/login";
  axios
    .post(loginURL, {
      staff_id: userid,
      staff_idnumber: inputPassword,
    })
    .then((response) => {
      if (response.status === 200) {
        sessionStorage.setItem("token", response.data["msg"]);
        console.log(response.data);
        let jwt = parseJwt(sessionStorage.getItem("token"));
        console.log("nick indexjs", jwt);
        sessionStorage.setItem("staff_id", jwt["sub"]);
        alert(`登入成功，${userid}您好。`);
        if (userid === "tga000") {
          setTimeout(() => {
            window.location.replace("index_doctor_chart.html");
          }, 1500);
        } else {
          setTimeout(() => {
            window.location.replace("index_nurse.html");
          }, 1500);
        }
      } else {
        alert(`登入失敗，請重新登入。`);
      }
    })
    .catch((error) => console.log(error));
}
// Referenced:
// https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
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
