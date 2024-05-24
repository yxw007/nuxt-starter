<template>
  <div class="root">
    <button v-hover-el="(v) => isHoverEl = v">isHoverEl: {{ isHoverEl }}</button>
    <button @click="isDialogVis = true">open dialog</button>
    <div class="dialog"
         v-if="isDialogVis">
      <div class="wrapper"
           v-click-outside="() => isDialogVis = false">
        This is a dialog
        <div class="tips">
          tips: the dialog will close if you click outside the border.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isHoverEl = ref(false);
const isDialogVis = ref(false);

</script>
<style lang="scss">
body {
  width: 100vw;
  height: 100vh;
}

button {
  display: block;
}
</style>
<style lang="scss" scoped>
.root {
  position: relative;
}

.dialog {
  background-color: rgba(0, 0, 0, .6);
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .wrapper {
    width: 600px;
    height: 400px;
    background-color: white;
    border-radius: 8px;
    color: black;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;

    .tips {
      color: red;
      font-weight: bold
    }
  }
}
</style>
