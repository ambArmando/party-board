<template>
  <div class="l-dialog">
      <div class="l-dialog-inner">
          <slot/>
      </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>

.l-dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.2);

    display: flex;
    align-items: center;
    justify-content: center;

    .l-dialog-inner {
        background-color: #FFF;
        width: auto;
        height: auto;
        padding: 20px 20px;
        border-radius: 10px;
    }
}

</style>