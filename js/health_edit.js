const APIURL = YOKULT_URL + TOPIC;
const topics = JSON.parse(sessionStorage.getItem("topics"));
let editTopic = {};
window.onload = (e) => {
  //topicList initialization
  if (topics !== null) {
    let id = window.location.search.slice(1).split("=")[1];
    topics.forEach((t) => {
      if (t.topid == id) {
        editTopic = t;
        $("#topic_title").val(t.title);
        $("#topic_foreword").val(t.foreword);
        $("#topic_content").val(t.content);
        console.log(editTopic);
        // need add topic sort
      }
    });
  }

  $("#btn_topic_save").on("click", () => {
    // topic["topid"] = document.getElementById("mem_id").value;
    editTopic["title"] = document.getElementById("topic_title").value;
    editTopic["foreword"] = document.getElementById("topic_foreword").value;
    editTopic["content"] = document.getElementById("topic_content").value;
    editTopic["posttime"] = Date.now();
    console.log(editTopic);
    if (editTopic.topid != null && editTopic.topid != undefined) {
      console.log("Modify");
      // Modify topic
      axios.put(APIURL + "/modify", editTopic).then((response) => {
        alert(`修改成功。`);
      });
    } else {
      console.log("Update");
      // Update topic
      editTopic["views"] = 0;
      editTopic["sortid"] = 0;
      axios.post(APIURL + "/update", editTopic).then((response) => {
        alert(`新增成功。`);
      });
    }
  });
};

function getTopic(id) {
  console.log("id: ", id);
  topics.forEach((t) => {
    if (t.topid == id) {
      return t;
    }
  });
}
