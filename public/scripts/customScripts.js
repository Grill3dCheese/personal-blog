const alertMsg = document.querySelector(".alert-container");

if (alertMsg) {
  window.setTimeout(function () {
    alertMsg.classList.add("slide-up");
  }, 3000);
}
