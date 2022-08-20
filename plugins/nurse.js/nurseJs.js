$(function () {
  let jwt = parseJwt(sessionStorage.getItem("token"));
  var staffId = jwt["sub"];
  console.log(staffId);
  if ("tga000" != staffId) {
    checkPermission();
  }

  var getId = { staff_id: staffId };
  $.ajax({
    url: YOKULT_URL + "/getStaffAllData",
    type: "POST", // GET | POST | PUT | DELETE
    data: JSON.stringify(getId),
    contentType: "application/json",
    success: function (rsp) {
      let allNurseHtml = "";
      rsp.forEach((staff) => {
        // console.log(staff)
        staff.staff_birthday = moment(staff.staff_birthday).format(
          "YYYY-MM-DD"
        );
        allNurseHtml += addList(staff, staffId);
      });
      $("#staffList").html(allNurseHtml);
    },
    error: function (xhr) {
      console.log("wrong");
    },
  });
});

function addList(staff, staffId) {
  let nurseHtml;
  if ("tga000" == staffId) {
    nurseHtml = `<div class="content" id=${staff["staff_id"]}>
                        <div div class="container-fluid" >
                            <div class="row">
                              <div class="col-md-12">
                                <div class="card card-primary">
                                  <div class="card-header">
                                    <div class="card-tools">
                                      <button type="button" class="btn btn-tool" data-card-widget="collapse">
                                        <i class="fas fa-minus"></i>
                                      </button>
                                    </div>
                                  </div>
                                  <div class="card-main">
                                    <div class="card-body-my">
                                      <img class="img-img" src="data:image/png;base64,${staff["staff_picture"]}" alt="照片"/>
                                    </div>
                                    <div class="card-text-my">
                                      <h3>姓名:<span id="${staff["staff_id"]}_name">${staff["staff_name"]}</span></h3>
                                      <br />
                                      <h5>信箱: <span id="${staff["staff_id"]}_email">${staff["staff_email"]}</span></h5>
                                      <h5>身分證字號: <span id="${staff["staff_id"]}_idnumber">${staff["staff_idnumber"]}</span></h5>
                                      <h5>生日:<span id="${staff["staff_id"]}_birthday">${staff["staff_birthday"]}</span></h5>
                                      <h5>手機: <span id="${staff["staff_id"]}_phone">${staff["staff_phone"]}</span></h5>
                                      <div id="jsonTip"></div>
                                    </div>
                                    <div class="card-button">
                                      <div class="button-btn">
                                        <button type="button" class="btn btn-block btn-outline-primary" data-toggle="modal"
                                          data-target="#myModal" id="updatebutton" onclick="updateFun('${staff["staff_id"]}')"> 編輯</button>
                                        <button type="button" class="btn btn-block btn-outline-primary" id="deletebutton" onclick="deleteFun('${staff["staff_id"]}')">
                                          刪除</button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div >
                        </div > `;
  } else {
    nurseHtml = `<div class="content" id=${staff["staff_id"]}>
                        <div div class="container-fluid" >
                            <div class="row">
                              <div class="col-md-12">
                                <div class="card card-primary">
                                  <div class="card-header">
                                    <div class="card-tools">
                                      <button type="button" class="btn btn-tool" data-card-widget="collapse">
                                        <i class="fas fa-minus"></i>
                                      </button>
                                    </div>
                                  </div>
                                  <div class="card-main">
                                    <div class="card-body-my">
                                      <img class="img-img" src="data:image/png;base64,${staff["staff_picture"]}" alt="照片"/>
                                    </div>
                                    <div class="card-text-my">
                                      <h3>姓名:<span id="${staff["staff_id"]}_name">${staff["staff_name"]}</span></h3>
                                      <br />
                                      <h5>信箱: <span id="${staff["staff_id"]}_email">${staff["staff_email"]}</span></h5>
                                      <h5>身分證字號: <span id="${staff["staff_id"]}_idnumber">${staff["staff_idnumber"]}</span></h5>
                                      <h5>生日:<span id="${staff["staff_id"]}_birthday">${staff["staff_birthday"]}</span></h5>
                                      <h5>手機: <span id="${staff["staff_id"]}_phone">${staff["staff_phone"]}</span></h5>
                                      <div id="jsonTip"></div>
                                    </div>
                                    <div class="card-button">
                                      <div class="button-btn">
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div >
                        </div > `;
  }

  return nurseHtml;
}

//自動填入
$("#fastInput").click(function () {
  $("#recipient-name").val("楊莉莉");
  $("#recipient-mail").val("monkey@gmail.com");
  $("#recipient-id_number").val("A123456789");
  $("#recipient-birthday").val("2000-01-01");
  $("#recipient-phone").val("0912345678");
});

//新增
$("#newnurse").click(function () {
  var checkPattern = $("#nurseData")[0].checkValidity();
  console.log(checkPattern);
  if (checkPattern) {
    var formData = {
      staff_id: $("#recipient-id").val(),
      staff_name: $("#recipient-name").val(),
      staff_email: $("#recipient-mail").val(),
      staff_idnumber: $("#recipient-id_number").val(),
      staff_birthday: $("#recipient-birthday").val(),
      staff_phone: $("#recipient-phone").val(),
      staff_picture: $("#base64").val(),
    };

    $.ajax({
      url: YOKULT_URL + "/addOrModify",
      type: "POST", // GET | POST | PUT | DELETE
      data: JSON.stringify(formData),
      contentType: "application/json",
      success: function (response) {
        console.log(response);
        if (response.type == "insert") {
          if (response.msg == "success") {
            alert("新增成功");
          } else {
            alert("新增失敗");
          }
        } else {
          if (response.msg == "success") {
            alert("更新成功");
          } else {
            alert("更新失敗");
          }
        }
      },
      error: function (xhr) {
        alert("發生錯誤: " + xhr.status + " " + xhr.statusText);
      },
    });
  }
});

//刪除
function deleteFun(staffId) {
  var checkDelete = confirm("確認移除?");
  if (checkDelete) {
    var formdelete = { staff_id: staffId };
    $.ajax({
      url: YOKULT_URL + "/deleteStaff",
      type: "POST", // GET | POST | PUT | DELETE
      data: JSON.stringify(formdelete),
      contentType: "application/json",
      success: function (response) {
        if (response == "success") {
          $("#" + staffId).remove();
          alert("刪除成功");
          location.reload();
        } else {
          alert("刪除失敗");
        }
      },
      error: function (xhr) {
        alert("發生錯誤: " + xhr.status + " " + xhr.statusText);
      },
    });
  }
}

//修改
function updateFun(staffId) {
  $("#myModalLabel").text("修改人員資料");
  $("#recipient-id").val(staffId);
  $("#recipient-name").val($("#" + staffId + "_name").text());
  $("#recipient-mail").val($("#" + staffId + "_email").text());
  $("#recipient-id_number").val($("#" + staffId + "_idnumber").text());
  $("#recipient-birthday").val($("#" + staffId + "_birthday").text());
  $("#recipient-phone").val($("#" + staffId + "_phone").text());
}

$("#cancelForm").click(function () {
  $("#nurseData")[0].reset();
});

$("#closeButton").click(function () {
  $("#nurseData")[0].reset();
});

$("#add").click(function () {
  $("#myModalLabel").text("新增人員資料");
});

//照片預覽
window.addEventListener("load", function () {
  var the_file_element = document.getElementById("the_file");
  the_file_element.addEventListener("change", function (e) {
    var picture_list = document.getElementsByClassName("picture_list")[0];
    picture_list.innerHTML = ""; // 清空
    for (let i = 0; i < this.files.length; i++) {
      let reader = new FileReader(); // 用來讀取檔案
      reader.readAsDataURL(this.files[i]); // 讀取檔案
      reader.addEventListener("load", function () {
        // console.log(reader.result);
        let li_html = `
                <li><img src="${reader.result}" class="preview"></li>
              `;
        picture_list.insertAdjacentHTML("beforeend", li_html); // 加進節點
      });
    }
  });
});

//組圖片base64
$("#the_file").change(function (e) {
  const file = e.target.files[0];
  console.log(file);
  const reader = new FileReader();
  reader.onloadend = () => {
    const base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
    $("#base64").val(base64String);
  };
  reader.readAsDataURL(file);
});

function checkPermission() {
  $("#add").hide();
}
