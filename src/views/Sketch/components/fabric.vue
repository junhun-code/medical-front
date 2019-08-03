<template>
  <div class="sketch">
    <canvas id="canvas" width="400" height="300">
      你的浏览器不支持canvas
    </canvas>
    <div class="tag-tool">
      <el-button
        v-for="(item, index) in targetListSketch"
        :key="index"
        size="small"
        >{{ item.name }}</el-button
      >
    </div>
  </div>
</template>

<script>
import { fabric } from "fabric";
export default {
  name: "fabric",
  props: [
    "imageUrl",
    "drawType",
    "fileRecordId",
    "targetListSketch",
    "sketchGroups"
  ],
  components: {},
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
    },
    sketchGroups: {
      handler: function(newVal, oldVal) {}
    }
  },
  methods: {
    initCanvas() {
      //初始化画板
      this.canvas = new fabric.Canvas("canvas", {
        isDrawingMode: true,
        skipTargetFind: true,
        selectable: false,
        selection: false,
        preserveObjectStacking: true,
        fireRightClick: true
      });
      this.initImage();
      this.initPolygon();
      this.canvas.freeDrawingBrush.color = this.color;
      this.canvas.freeDrawingBrush.width = this.drawWidth;

      this.freeDrawing();
      this.removeSelected();
    },
    initImage() {
      fabric.Image.fromURL(this.imageUrl, oImg => {
        this.canvas.add(oImg);
      });
    },
    initPolygon() {
      let polygon = new fabric.Polygon(
        [
          { x: 1, y: 1 },
          { x: 2, y: 1 },
          { x: 3, y: 1 },
          { x: 4, y: 1 },
          { x: 5, y: 1 }
        ],
        {
          left: 50,
          top: 50,
          strokeWidth: 2,
          stroke: "red",
          objectCaching: false
        }
      );
      this.canvas.add(polygon);
    },
    // 自由绘画
    freeDrawing() {
      this.canvas.on("path:created", options => {
        console.log("[points]", this.canvas.freeDrawingBrush._points);
        console.log("[freeDrawing]", this.canvas.toObject());
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
  display: flex;
  #canvas {
    border: 1px solid black;
    box-sizing: border-box;
  }
  .tag-tool {
    display: flex;
    flex-direction: column;
    & > button {
      margin: 0 !important;
    }
  }
}
</style>
