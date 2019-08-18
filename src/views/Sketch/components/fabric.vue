<template>
  <div class="sketch">
    <canvas id="canvas" width="600" height="500">
      你的浏览器不支持canvas
    </canvas>
    <div class="tag-tool">
      <div class="file-target">
        <el-button
          v-for="(item, index) in fileTargetList"
          :key="index"
          size="small"
          :type="targeId === item.id ? 'primary' : ''"
          @click="selectFileTarget(item)"
          >{{ item.name }}</el-button
        >
      </div>
      <div class="sketch-target">
        <el-button
          v-for="(item, index) in sketchTargetList"
          :key="index"
          size="small"
          >{{ item.name }}</el-button
        >
      </div>
    </div>
    <el-dialog
      title="标签选择"
      width="200px"
      :visible.sync="sketchTargetVisible"
    >
      <el-button
        v-for="(item, index) in sketchTargetList"
        :key="index"
        type="primary"
        @click="selectSketchTarget(item)"
        >{{ item.name }}</el-button
      >
    </el-dialog>
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
    "sketchGroups",
    "targeId"
  ],
  components: {},
  data() {
    return {
      canvas: null,
      drawWidth: 2, //笔触宽度
      color: "#E34F51", //画笔颜色
      isDragging: false, // 是否正在拖动
      sketchTargetVisible: false,

      imageWidth: 0,
      imageHight: 0
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
        this.imageWidth = oImg.width;
        this.imageHight = oImg.height;
        oImg.selectable = false; // 在单个元素上设置 selectable为false，这样设置的单个元素是无法选择和拖动了。
        this.canvas.add(oImg);
        this.initPolygon();
        this.zoomToFitCanvas();
      });
    },
    initPolygon() {
      this.sketchGroups.forEach(groupItem => {
        let polygon = new fabric.Polygon(groupItem.sketchList, {
          strokeWidth: 2,
          stroke: "red",
          objectCaching: false,
          fill: "transparent"
        });
        polygon.fileRecordId = groupItem.fileRecordId;
        polygon.sketchGroupId = groupItem.id;
        polygon.siteId = groupItem.siteId;
        polygon.targetId = groupItem.targetId;
        polygon.targetName = groupItem.targetName;
        this.canvas.add(polygon);
      });
    },
    // 内容自动缩放并居中 http://www.hangge.com/blog/cache/detail_1861.html
    zoomToFitCanvas() {
      //计算平移坐标
      let panX = (this.imageWidth - this.canvas.width) / 2;
      let panY = (this.imageHight - this.canvas.height) / 2;
      //开始平移
      this.canvas.absolutePan({ x: panX, y: panY });
    },
    // 自由绘画
    freeDrawing() {
      this.canvas.on("path:created", options => {
        console.log("[points]", this.canvas.freeDrawingBrush._points, options);
        let points = this.canvas.freeDrawingBrush._points;
        points = points.map(item => {
          return {
            positionX: parseInt(item.x),
            positionY: parseInt(item.y)
          };
        });
        this.sketchTargetVisible = true;
        this.currentPoints = points;
      });
    },
    // 选中删除
    removeSelected() {
      this.canvas.on("selection:created", e => {
        if (this.drawType !== "remove") return;
        if (e.target._element && e.target._element.className === "canvas-img")
          return;
        this.sketchDelete(e.target);
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
    selectSketchTarget(target) {
      this.sketchSave(target.id);
    },
    // 勾画保存
    sketchSave(targetId) {
      let formVal = {
        fileRecordId: this.fileRecordId,
        sketchList: this.currentPoints,
        targetId: targetId
      };
      this.$axios.post("/jspxcms/cmscp/datamanage/sketch/save", formVal).then(
        res => {
          this.sketchTargetVisible = false;
          if (res.data.status === 0) {
            let objects = this.canvas.getObjects();
            let lastObject = this.canvas.item(objects.length - 1);
            lastObject.sketchGroupId = res.data.data;
            this.$message("勾画保存成功");
          } else {
            this.$message.error("勾画保存失败");
          }
        },
        err => {
          this.$message.error("勾画保存失败");
        }
      );
    },
    // 勾画删除
    sketchDelete(eventTarget) {
      let params = {
        sketchGroupId: eventTarget.sketchGroupId
      };
      this.$axios
        .get("/jspxcms/cmscp/datamanage/sketch/delete", { params })
        .then(
          res => {
            if (res.data.status === 0) {
              this.canvas.remove(eventTarget);
              this.canvas.discardActiveObject(); // 清除选中框
              this.$message("删除成功");
            } else {
              this.$message.error("删除失败");
            }
          },
          err => {
            this.$message.error("删除失败");
          }
        );
    },
    selectFileTarget(item) {
      if (item.id === this.targeId) return;
      this.$emit("selectFileTarget", item.id);
    }
  },
  created() {},
  mounted() {}
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
    justify-content: space-between;
    .file-target,
    .sketch-target {
      display: flex;
      flex-direction: column;
      & > button {
        margin: 0 !important;
      }
    }
  }
}
/deep/.el-dialog__body {
  display: flex;
  flex-direction: column;
  & > button {
    margin: 5px 0 !important;
  }
}
</style>
