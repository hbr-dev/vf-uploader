<!-- ==================================================================================== -->
<!-- ==================================================================================== -->
<!-- ==================================================================================== -->
<template>
  <fieldset>
    <div class="remove-all-section">
      <button class="btn" @click="removeAll_files">X</button>
    </div>
    <div class="drop-zone" 
         @dragover.prevent="onDropFile_UI()"
         @drop.prevent
    >
      <div class="preview">
        <div
          v-for="(URL, index) in files.URLs"
          :key="URL"
          :id="[[index]]"
          class="preview-item"
        >
          <div class="file">
            <img
              v-if="files.types[index] == '.image'"
              :src="[[URL]]"
              alt="Ooops!"
            />
            <img
              v-else-if="files.types[index] == '.pdf'"
              src="@/assets/icons/pdf-icon.png"
              alt="Ooops!"
            />
            <img v-else src="@/assets/icons/txt-icon.png" alt="Ooops!" />
          </div>
          <div class="info">
            <i class="name">{{ files.names[index] }}</i>
            <i class="size">{{ files.sizes[index] }} KB</i>
          </div>
          <div class="actions">
            <img
              id="okICO"
              src="@/assets/icons/ok-icon.png"
              alt="OK"
              draggable="false"
            />
            <img
              v-if="exist == true"
              id="uploadICO"
              src="@/assets/icons/upload-icon.png"
              alt="ULD"
              @click="passData(index)"
              draggable="false"
            />
            <img
              id="downloadICO"
              src="@/assets/icons/download-icon.png"
              alt="DON"
              @click="downloadFile(index)"
              draggable="false"
            />
            <img
              id="delICO"
              src="@/assets/icons/delete-icon.png"
              alt="DEL"
              @click="remove_file(index)"
              draggable="false"
            />
            <img
              id="openICO"
              src="@/assets/icons/zoom-icon.png"
              alt="ZZM"
              @click="openFile(index)"
              draggable="false"
            />
          </div>
        </div>
      </div>
      <div id="drag_drop" class="drag-drop" @drop="dropFile">
        <i id="drag">DRAG</i>
        <i id="and">AND</i>
        <i id="drop">DROP</i>
      </div>
    </div>
    <div class="upload-file-section">
      <input
        type="text"
        name="file_counter"
        id="file-counter"
        :placeholder="[[files.count]] + ' File(s) selected'"
        disabled
        readonly
      />
      <label for="file-selector" id="browse-files">Browse</label>
      <input
        type="file"
        name="file_selector"
        id="file-selector"
        @change="uploadFile"
      />
    </div>
  </fieldset>
  <!-- =========================================================== -->
  <!-- =========================================================== -->
  <div
    v-if="files.errors.length > 0 && props.notifPOS == 'left'"
    class="notification left"
  >
    <div v-for="(error, index) in files.errors" :key="error" class="error">
      <img src="@/assets/icons/cross.png" alt="Not-Found" draggable="false" />
      <h3 id="error-header">{{ files.error_indicators[index] }} :</h3>
      <div id="error-body">
        <p v-for="err in error" :key="err">
          {{ err }}
        </p>
      </div>
      <button id="error-close" @click="deleteNotif(index)">X</button>
    </div>
  </div>
  <div
    v-else-if="files.errors.length > 0 && props.notifPOS == 'right'"
    class="notification right"
  >
    <div v-for="(error, index) in files.errors" :key="error" class="error">
      <img src="@/assets/icons/cross.png" alt="Not-Found" draggable="false" />
      <h3 id="error-header">{{ files.error_indicators[index] }} :</h3>
      <div id="error-body">
        <p v-for="err in error" :key="err">
          {{ err }}
        </p>
      </div>
      <button id="error-close" @click="deleteNotif(index)">X</button>
    </div>
  </div>
  <div
    v-else-if="files.errors.length > 0 && props.notifPOS == 'center'"
    class="notification center"
  >
    <div v-for="(error, index) in files.errors" :key="error" class="error">
      <img src="@/assets/icons/cross.png" alt="Not-Found" draggable="false" />
      <h3 id="error-header">{{ files.error_indicators[index] }} :</h3>
      <div id="error-body">
        <p v-for="err in error" :key="err">
          {{ err }}
        </p>
      </div>
      <button id="error-close" @click="deleteNotif(index)">X</button>
    </div>
  </div>
  <div
    v-else-if="files.errors.length > 0 && props.notifPOS == 'default'"
    class="notification"
  >
    <div v-for="(error, index) in files.errors" :key="error" class="error">
      <img src="@/assets/icons/cross.png" alt="Not-Found" draggable="false" />
      <h3 id="error-header">{{ files.error_indicators[index] }} :</h3>
      <div id="error-body">
        <p v-for="err in error" :key="err">
          {{ err }}
        </p>
      </div>
      <button id="error-close" @click="deleteNotif(index)">X</button>
    </div>
  </div>
  <div v-else class="notification" style="display: none"></div>
  <!-- =========================================================== -->
  <!-- =========================================================== -->
</template>
<!-- ==================================================================================== -->
<!-- ==================================================================================== -->
<!-- ==================================================================================== -->
<script setup>
import { ref } from "vue";
import { onExtractdata_UI, onDelete_UI, onDropFile_UI } from "@/assets/js/events.js";


const props = defineProps({
  filesNBR: {
    type: Number,
    default: 1,
  },
  maxSize: {
    type: Number,
    default: 1024,
  },
  extensions: {
    type: Array,
    default: [".png", ".jpg"],
  },
  notifPOS: {
    type: String,
    default: "default",
  },
});

const emit = defineEmits(["extract_data"]);
const exist = ref(true);
const files = ref({
  selectedFiles: [],
  count: 0,
  names: [],
  sizes: [],
  URLs: [],
  types: [],
  errors: [],
  error_indicators: [],
});

const uploadFile = (event) => {
  let selectedFile = event.target.files[0];
  uploaderController(selectedFile);
};

const dropFile = (event) => {
  let selectedFile = event.dataTransfer.files[0];
  uploaderController(selectedFile);
} 

const uploaderController = (selectedFile) => { 
  let pdfExtension = /(\.pdf)$/i;
  let txtExtension = /(\.txt|\.text)$/i;
  let extension = "";
  let size = 0;
  let err = [];
  if (selectedFile) {
    size = (selectedFile.size / 1024).toFixed(3);
    extension = selectedFile.name.substring(
      selectedFile.name.indexOf("."),
      selectedFile.name.length
    );
    if (files.value.names.indexOf(selectedFile.name) === -1) {
      if (props.extensions.indexOf(extension) === -1) {
        err.push("Bad file type : " + props.extensions + " are allowed.");
      }
      if (size > props.maxSize) {
        err.push("File Size is too large : Max-size= " + props.maxSize + " KB");
      }
      if (files.value.selectedFiles.length >= props.filesNBR) {
        err.push(
          "Extra file: files number must be between 1 & " + props.filesNBR
        );
      }
      if (err.length === 0) {
        files.value.selectedFiles.push(selectedFile);
        files.value.names.push(selectedFile.name);
        files.value.sizes.push(size);
        files.value.URLs.push(URL.createObjectURL(selectedFile));
        if (
          !pdfExtension.exec(selectedFile.name) &&
          !txtExtension.exec(selectedFile.name)
        ) {
          files.value.types.push(".image");
        } else {
          if (pdfExtension.exec(selectedFile.name)) {
            files.value.types.push(".pdf");
          }
          if (txtExtension.exec(selectedFile.name)) {
            files.value.types.push(".txt");
          }
        }
        files.value.count++;
      } else {
        files.value.errors.push(err);
        files.value.error_indicators.push(selectedFile.name);
      }
    } else {
      files.value.errors.push(["File exsist, rename and try again"]);
      files.value.error_indicators.push(selectedFile.name);
    }
  } else {
    console.log("You must select a file");
  }
}

const passData = (index) => {
  onExtractdata_UI();
  exist.value = false;
  emit("extract_data", files.value.selectedFiles[index]);
};

const downloadFile = (index) => {
  openFile(index);
};

const remove_file = (index) => {
  onDelete_UI(index);
  setTimeout(() => {
    files.value.selectedFiles.splice(index, 1);
    files.value.names.splice(index, 1);
    files.value.sizes.splice(index, 1);
    files.value.URLs.splice(index, 1);
    files.value.types.splice(index, 1);
    files.value.count--;
  }, 1000);
};

const removeAll_files = () => {
  for (let index = 0; index < files.value.count; index++) {
    onDelete_UI(index);
  }
  setTimeout(() => {
    files.value.selectedFiles = [];
    files.value.count = 0;
    files.value.names = [];
    files.value.sizes = [];
    files.value.URLs = [];
    files.value.types = [];
  }, 1000);
};

const openFile = (index) => {
  let url = files.value.URLs[index];
  let fileName = files.value.names[index];
  let imgExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
  let pdfExtension = /(\.pdf)$/i;
  let txtExtension = /(\.txt|\.text)$/i;
  // ------------------------------------------------ //
  if (imgExtensions.exec(fileName)) {
    window.open(
      url,
      "Image",
      "width=largeImage.stylewidth,height=largeImage.style.height,resizable=1"
    );
  }
  if (pdfExtension.exec(fileName)) {
    window.open(
      url,
      "PDF",
      "width=largeImage.stylewidth,height=largeImage.style.height,resizable=1"
    );
  }
  if (txtExtension.exec(fileName)) {
    let fileReader = new FileReader();
    let wRef = null;
    // ------------------------------------- //
    fileReader.readAsText(files.value.selectedFiles[index]);
    fileReader.onload = function () {
      wRef = window.open(
        "",
        "_blank",
        "location=yes,height=570,width=520,scrollbars=yes,status=yes"
      );
      // wRef.document.innerHTML = fileReader.result;
      wRef.document.write(
        "<!doctype html>" +
          "<html><head>" +
          "<meta charset='appropriate charset here'>" +
          "<title>Title here</title>" +
          "</head><body>" +
          "<div>" +
          fileReader.result +
          "</div>" +
          "</body></html>"
      );
    };
  }
};

const deleteNotif = (index) => {
  files.value.errors.splice(index, 1);
  files.value.error_indicators.splice(index, 1);
};
</script>
<!-- ==================================================================================== -->
<!-- ==================================================================================== -->
<!-- ==================================================================================== -->
<style scoped>
@import "@/assets/css/fileUploader.css";
@import "@/assets/css/preview.css";
@import "@/assets/css/notification.css";
</style>
