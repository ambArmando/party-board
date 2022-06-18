<template>
      <button :class="`${color} ${size} ${type}`">
          <slot></slot>   
      </button>
</template>

<script>
export default {
  name: 'Button',
  props: { 
      color: String,
      size: String,
      type: String
   }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    /*$primary-color: #7161EF;
    $error: #e74951;

    div {
        margin-bottom: 10px;
        button {
            cursor: pointer;
            display: inline-block;
            width: 100%;
            padding: 10px;
            font-size: 24px;
            color: black;
            border: 0;
            border-radius: 3px;
            font-weight: 700;

            &.medium {
                font-size: 16px;
                padding: 7px;
            }

            &.primary, &.red {
                color: white;
                font-weight: 500;
            }

            &.primary {
                background-color: $primary-color;

                &:hover {
                    background-color: lighten($primary-color, 5%);
                }
            }

            &.transparent {
                background-color: transparent;

                 &:hover {
                   color: lighten(black, 25%);
                }
            }

             &.red {
                background-color: $error;

                &:hover {
                    background-color: lighten($error, 5%);
                }
            }
        }
    }*/
</style>
