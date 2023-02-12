<script setup>
import FileUploader from "@/components/FileUploader.vue";

const getfile_data = (file) => {
  if (file !== null) {
    console.log(file.name);
    console.log(file.size);
  }
};
</script>

<template>
  <h1>File Upload</h1>
  <FileUploader
    @extract_data="getfile_data($event)"
    :extensions="['.png', '.jpg', '.pdf']"
    :filesNBR="3"
    :maxSize="1024"
    :notifPOS="'default'"
  />
  <!-- :notifPOS="'default'/'center'/'right'/'left'" -->
</template>
