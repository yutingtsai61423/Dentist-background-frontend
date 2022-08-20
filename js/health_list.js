window.onload = (e) => {
  axios
    .get(YOKULT_URL + TOPIC)
    .then((response) => {
      let topics = response.data;
      sessionStorage.setItem("topics", JSON.stringify(topics));
      topics.forEach((topic) => {
        addList(topic);
        console.log(topic);
      });
    })
    .catch((error) => console.log(error));
};

function addList(topic) {
  let list = `<tr data-id="${topic["topid"]}">
        <td>${topic["topid"]}</td>
        <td>${topic["title"] ?? ""}</td>
        <td>${topic["sortid"] ?? ""}</td>
        <td>${topic["views"] ?? ""}</td>
        <td>${topic["posttime"] ?? ""}</td>
        <td>
            <a class="btn-xs btn-light" href="./index_health_edit.html?id=${
              topic["topid"]
            }">編輯文章</a>
            <button class="btn-xs btn-light" id="btn_delete_topic">刪除文章</button>
        </td>
    </tr>`;
  $("#topicList").append(list);
}
