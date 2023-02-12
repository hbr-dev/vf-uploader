var preview = null;

const onExtractdata_UI = () => {
  let upload_icon = document.getElementById("uploadICO");
  let ok_icon = document.getElementById("okICO");
  upload_icon.style.animation = "fade-out 1s forwards";
  ok_icon.style.animation = "fade-in 1s forwards";
};

const onDelete_UI = (index) => {
  console.log("onDelete");
  preview = document.getElementById(index);
  preview.style.animation = "fade-out 1s forwards";
};

const onDropFile_UI = () => {
  let element = document.getElementById("drag_drop");
  element.classList.add("drop-animation");
  document.getElementById("drag").innerHTML = "DROP";
  document.getElementById("and").innerHTML = "IN";
  document.getElementById("drop").innerHTML = "PROGRESS...";
  setTimeout(() => {
    element.classList.remove("drop-animation");
    document.getElementById("drag").innerHTML = "DRAG";
    document.getElementById("and").innerHTML = "AND";
    document.getElementById("drop").innerHTML = "DROP";
  }, 4000);
};

export { onExtractdata_UI, onDelete_UI, onDropFile_UI };
