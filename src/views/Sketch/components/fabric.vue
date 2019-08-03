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
  props: ["imageUrl", "drawType"],
  data() {
    return {
      canvas: null,
      drawWidth: 2, //笔触宽度
      color: "#E34F51", //画笔颜色
      doDrawing: true // 绘制状态
    };
  },
  watch: {
    drawType: {
      handler: function(newVal, oldVal) {
        this.canvas.isDrawingMode = false;
        this.doDrawing = false;
        if (newVal === "pen") {
          this.canvas.isDrawingMode = true;
          this.doDrawing = true;
        } else if (newVal === "remove") {
          this.canvas.selection = true;
          this.canvas.skipTargetFind = false;
          this.canvas.selectable = true;
        } else {
          this.canvas.skipTargetFind = true; //画板元素不能被选中
          this.canvas.selection = false; //画板不显示选中
        }
      }
    }
  },
  components: {},
  methods: {
    initCanvas() {
      //初始化画板
      this.canvas = new fabric.Canvas("canvas", {
        isDrawingMode: true,
        skipTargetFind: true,
        selectable: false,
        selection: false
      });
      this.initImage();
      this.canvas.freeDrawingBrush.color = this.color;
      this.canvas.freeDrawingBrush.width = this.drawWidth;
      window.canvas = this.canvas;
      window.zoom = window.zoom ? window.zoom : 1;

      this.freeDrawing();
      this.removeSelected();
    },
    initImage() {
      fabric.Image.fromURL(this.imageUrl, oImg => {
        this.canvas.add(oImg);
      });
    },
    // 自由绘画
    freeDrawing() {
      this.canvas.on("mouse:up", options => {
        if (this.drawType !== "pen") return;
        console.log("[freeDrawing]", this.canvas.freeDrawingBrush._points);
      });
    },
    // 选中删除
    removeSelected() {
      this.canvas.on("selection:created", e => {
        if (this.drawType !== "remove") return;
        console.log("[removeSelected]", e);
        this.canvas.remove(e.target);
        this.canvas.discardActiveObject(); //清楚选中框
      });
    }
  },
  created() {},
  mounted() {
    this.initCanvas();
  }
};
</script>

<style lang="less" scoped>
.sketch {
  #canvas {
    border: 1px solid black;
    box-sizing: border-box;
  }
}
</style>
