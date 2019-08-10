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
      isDragging: false // 是否正在拖动
    };
  },
  watch: {
    drawType: {
      handler: function(newVal, oldVal) {
        if (newVal === "pen") {
          this.canvas.isDrawingMode = true;
          this.canvas.selection = false;
          this.canvas.skipTargetFind = true;
        } else if (newVal === "remove") {
          this.canvas.isDrawingMode = false;
          this.canvas.selection = true;
          this.canvas.skipTargetFind = false;
        } else if (newVal === "pan") {
          this.canvas.isDrawingMode = false;
          this.canvas.selection = false;
          this.canvas.skipTargetFind = true;
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
        skipTargetFind: true, // 画板元素不能被选中
        selectable: false,
        selection: false,
        preserveObjectStacking: true,
        fireRightClick: true
      });
      this.initImage();
      this.canvas.freeDrawingBrush.color = this.color;
      this.canvas.freeDrawingBrush.width = this.drawWidth;

      this.freeDrawing();
      this.removeSelected();
      this.zoomControl();
      this.panControl();
    },
    initImage() {
      fabric.Image.fromURL(this.imageUrl, oImg => {
        this.canvas.add(oImg);
        this.initPolygon();
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
        // console.log("[freeDrawing]", this.canvas.toObject());
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
    },
    // 缩放
    zoomControl() {
      this.canvas.on("mouse:wheel", opt => {
        var delta = opt.e.deltaY;
        var pointer = this.canvas.getPointer(opt.e);
        var zoom = this.canvas.getZoom();
        zoom = zoom + delta / 200;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        this.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
      });
    },
    // 平移
    panControl() {
      this.canvas.on("mouse:down", opt => {
        if (this.drawType === "pan") {
          var evt = opt.e;
          this.isDragging = true;
          this.canvas.lastPosX = evt.clientX;
          this.canvas.lastPosY = evt.clientY;
        }
      });
      this.canvas.on("mouse:move", opt => {
        if (this.drawType === "pan" && this.isDragging) {
          var e = opt.e;
          this.canvas.viewportTransform[4] += e.clientX - this.canvas.lastPosX;
          this.canvas.viewportTransform[5] += e.clientY - this.canvas.lastPosY;
          this.canvas.lastPosX = e.clientX;
          this.canvas.lastPosY = e.clientY;
          this.canvas.requestRenderAll();
        }
      });
      this.canvas.on("mouse:up", opt => {
        if (this.drawType === "pan") {
          this.isDragging = false;
        }
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
