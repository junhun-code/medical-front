<template>
  <div class="sketch">
    <canvas id="canvas" width="400" height="300">
      你的浏览器不支持canvas
    </canvas>
  </div>
</template>

<script>
import { fabric } from "fabric";
export default {
  name: "fabric",
  data() {
    return {
      canvas: null
    };
  },
  components: {},
  methods: {
    initImage() {
      fabric.Image.fromURL("/public/favicon.ico", function(oImg) {
        // 将其缩小，然后将其翻转，然后再将其添加到画布上
        oImg.scale(0.2);
        this.canvas.add(oImg);
      });
    }
  },
  created() {},
  mounted() {
    this.canvas = new fabric.Canvas("main");
  }
};
</script>

<style lang="less" scoped></style>
