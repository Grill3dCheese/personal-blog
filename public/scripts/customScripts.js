const alertMsg = document.querySelector(".alert-container");
const textArea = document.querySelector("textarea");

if (alertMsg) {
  window.setTimeout(function () {
    alertMsg.classList.add("slide-up");
  }, 3000);
}

// New Blog CMS Toolbar v.1.0.0

const breakingSpace = () => {
  textArea.value += "\n<br>";
  textArea.focus();
};
