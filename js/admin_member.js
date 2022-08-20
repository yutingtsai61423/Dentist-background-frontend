let memberTable;
window.onload = (e) => {
  // memberList initialization
  axios
    .get(YOKULT_URL + MEMBER)
    .then((response) => {
      let members = response.data;
      console.log(members);
      members.forEach((member) => {
        addList(member);
      });
      memberTable = $("#memberTable").DataTable({
        paging: true,
        lengthChange: false,
        searching: false,
        ordering: true,
        info: true,
        autoWidth: false,
        responsive: true,
      });
    })
    .catch((error) => console.log(error));

  // Remove member
  $("#memberList").on("click", "#btn_delete_member", (e) => {
    if (confirm("確定清除嗎?")) {
      let member_id = $(e.target).closest("tr").data("id");
      console.log(member_id);
      let removeMember = {};
      removeMember["memID"] = member_id;
      console.log(removeMember);
      axios
        .delete("http://localhost:8080/yokult/api/0.02/member/remove", {
          data: removeMember,
        })
        .then((response) => {
          let msg = response.data["msg"];
          if (msg === "success") {
            $(e.target)
              .closest("tr")
              .fadeOut(1000, () => {
                $(e.target).closest("tr").remove();
              });
          } else {
            console.log(response.data["msg"]);
          }
        })
        .catch((error) => console.log(error));
    }
  });

  $("#resetTable").on("click", (e) => {
    removeAllMembers();
    memberTable.clear();
    axios
      .get(YOKULT_URL + MEMBER)
      .then((response) => {
        let members = response.data;
        console.log(members);
        members.forEach((member) => {
          addList(member);
        });
        memberTable = $("#memberTable").DataTable({
          paging: true,
          lengthChange: false,
          searching: false,
          ordering: true,
          info: true,
          autoWidth: false,
          responsive: true,
        });
      })
      .catch((error) => console.log(error));
  });
};

function removeAllMembers() {
  $("#memberTable>tbody>tr").remove();
}

function search() {
  let searchID = $("#searchID").val();
  let searchValue = $("#searchValue").val();
  console.log(searchID);
  console.log(searchValue);
  removeAllMembers();
  memberTable.clear();
  let params = {};
  switch (searchID) {
    case "memID":
      params["memID"] = searchValue;
      break;
    case "memName":
      params["memName"] = searchValue;
      break;
    case "memEmail":
      params["memEmail"] = searchValue;
  }
  axios
    .get(YOKULT_URL + MEMBER + "/query", {
      params,
    })
    .then((response) => {
      console.log(response);
      let members = response.data;
      console.log(members);
      members.forEach((member) => {
        addList(member);
      });
    })
    .catch((error) => console.log(error));
}

function addList(member) {
  let list = `<tr data-id="${member["memID"]}">
        <td>${member["memID"]}</td>
        <td>${member["memEmail"] ?? ""}</td>
        <td>${member["memName"] ?? ""}</td>
        <td>${member["memBirth"] ?? ""}</td>
        <td>${member["memCellPhone"] ?? ""}</td>
        <td>${member["memAddress"] ?? ""}</td>
        <td><button class="btn-xs btn-light" id="btn_reset_password">重設密碼</button>
            <button class="btn-xs btn-light" id="btn_delete_member">刪除會員</button>
        </td>
    </tr>`;
  $("#memberList").append(list);
}
