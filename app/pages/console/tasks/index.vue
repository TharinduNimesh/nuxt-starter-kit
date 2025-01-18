<script setup lang="ts">
const alert = (msg: string) => {
  window.alert(msg);
};

const { startUpload } = useUploadThing("imageUploader", {
  onClientUploadComplete(res) {
    console.log(`onClientUploadComplete`, res);
    alert("Upload Completed");
  },
});
</script>
<template>
  <div>
    <NuxtLayout name="console">
      <label>
        <input
          type="file"
          @change="
            async (e) => {
              console.log(`e`, e);
              const file = (e.target as HTMLInputElement).files?.[0];
              if (!file) return;

              // Do something with files

              // Then start the upload
              await startUpload([file]);
            }
          "
        />
      </label>
    </NuxtLayout>
  </div>
</template>
