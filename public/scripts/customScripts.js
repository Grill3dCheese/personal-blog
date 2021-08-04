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

const paragraph = () => {
  textArea.value += "<p></p>";
  textArea.focus();
};

const emphasized = () => {
  textArea.value += "<em></em>";
  textArea.focus();
};

const strong = () => {
  textArea.value += "<strong></strong>";
  textArea.focus();
};

const superText = () => {
  textArea.value += "<sup></sup>";
  textArea.focus();
};

const horizontalRule = () => {
  textArea.value += "<hr>";
  textArea.focus();
};
