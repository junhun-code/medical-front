<template>
  <div class="sketch">
    <canvas id="canvas" width="400" height="300">
      你的浏览器不支持canvas
    </canvas>
    <div class="tag-tool">
      <el-button
        v-for="(item, index) in fileTargetList"
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
    "fileTargetList",
    "sketchTargetList",
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
        } else if (newVal === "pan") {
          this.canvas.isDrawingMode = false;
          this.canvas.selection = false;
          this.canvas.skipTargetFind = true;
        } else if (newVal === "remove") {
          this.canvas.isDrawingMode = false;
          this.canvas.selection = false;
          this.canvas.skipTargetFind = false;
          this.canvas.selectable = true;
        }
      }
    },
    sketchGroups: {
      handler: function(newVal, oldVal) {}
    },
    imageUrl: {
      handler: function(newVal, oldVal) {
        this.initCanvas();
      }
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
        // oImg.lockMovementX = true;
        // oImg.lockMovementY = true;
        this.canvas.add(oImg);
        this.initPolygon();
      });
    },
    initPolygon() {
      this.sketchGroups.forEach(groupItem => {
        console.log(groupItem);
        let polygon = new fabric.Polygon(groupItem.sketchList, {
          strokeWidth: 2,
          stroke: "red",
          objectCaching: false
        });
        this.canvas.add(polygon);
      });
    },
    // 自由绘画
    freeDrawing() {
      this.canvas.on("path:created", options => {
        console.log("[points]", this.canvas.freeDrawingBrush._points);
        let points = this.canvas.freeDrawingBrush._points;
        points = points.map(item => {
          return {
            positionX: parseInt(item.x),
            positionY: parseInt(item.y)
          };
        });
        this.sketchSave(points);
      });
    },
    // 选中删除
    removeSelected() {
      this.canvas.on("selection:created", e => {
        if (this.drawType !== "remove") return;
        if (e.target._element && e.target._element.className === "canvas-img")
          return;
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
        if (zoom > 10) zoom = 10;
        if (zoom < 0.1) zoom = 0.1;
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
        }
      });
      this.canvas.on("mouse:move", opt => {
        if (this.drawType === "pan" && this.isDragging) {
          var e = opt.e;
          var delta = new fabric.Point(e.movementX, e.movementY);
          this.canvas.relativePan(delta);
        }
      });
      this.canvas.on("mouse:up", opt => {
        if (this.drawType === "pan") {
          this.isDragging = false;
        }
      });
    },
    // 勾画保存
    sketchSave(points) {
      let formVal = {
        fileRecordId: this.fileRecordId,
        sketchList: points,
        targetId: ""
      };
      this.$axios.post("/jspxcms/sketch/save", formVal).then(
        res => {
          if (res.data.status !== 0) {
            this.$message.error("保存失败");
          }
        },
        err => {
          this.$message.error("保存失败");
        }
      );
    },
    // 勾画删除
    sketchDelete() {
      let formVal = {
        sketchGroupId: this.fileRecordId
      };
      this.$axios.post("/jspxcms/sketch/delete", formVal).then(
        res => {
          if (res.data.status !== 0) {
            this.$message.error("删除失败");
          }
        },
        err => {
          this.$message.error("删除失败");
        }
      );
    }
  },
  created() {},
  mounted() {
    // this.initCanvas();
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
