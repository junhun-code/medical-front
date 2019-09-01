<template>
  <div class="sketch">
    <canvas id="canvas" width="600" height="500">
      您的浏览器不支持canvas
    </canvas>
    <!-- 影像标签 -->
    <div class="tag-tool">
      <div class="file-target">
        <el-button
          v-for="(item, index) in fileTargetList"
          :key="index"
          size="small"
          :type="fileTargetIdArr.includes(item.id) ? 'primary' : ''"
          @click="selectFileTarget(item)"
          >{{ item.name }}</el-button
        >
      </div>
    </div>
    <!-- <el-dialog
      title="标签选择"
      width="200px"
      :visible.sync="sketchTargetVisible"
    >
      <el-button
        v-for="(item, index) in sketchTargetList"
        :key="index"
        :type="selectSketchTargetList.includes(item.id) ? 'primary' : ''"
        @click="selectSketchTarget(item)"
        >{{ item.name }}</el-button
      >
      <el-button
        round
        type="info"
        style="margin-top: 20px"
        @click="confirmTarget"
        >确认</el-button
      >
    </el-dialog> -->
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
    "fileTargetIdArr"
  ],
  components: {},
  data() {
    return {
      canvas: null,
      drawWidth: 2, //笔触宽度
      color: "#E34F51", //画笔颜色
      isDragging: false, // 是否正在拖动
      // sketchTargetVisible: false,
      // selectSketchTargetList: [],
      latestSketchGroups: [],

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
      handler: function(newVal, oldVal) {
        this.latestSketchGroups = newVal;
      },
      immediate: true
    },
    imageUrl: {
      handler: function(newVal, oldVal) {
        if (this.canvas) {
          this.canvas.clear();
          this.updateCanvas();
        } else {
          this.initCanvas();
        }
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
    updateCanvas() {
      this.initImage();
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
        polygon.id = groupItem.id;
        polygon.siteId = groupItem.siteId;
        polygon.targetId = groupItem.targetId;
        polygon.targetName = groupItem.targetName;
        this.canvas.add(polygon);
      });
      this.updateLatestSketchGroups(this.sketchGroups);
    },
    // 内容自动缩放并居中 http://www.hangge.com/blog/cache/detail_1861.html
    zoomToFitCanvas() {
      //先还原缩放比例与位置
      this.canvas.setZoom(1);
      this.canvas.absolutePan({ x: 0, y: 0 });

      //计算平移坐标
      let panX = (this.imageWidth - this.canvas.width) / 2;
      let panY = (this.imageHight - this.canvas.height) / 2;
      //开始平移
      this.canvas.absolutePan({ x: panX, y: panY });

      //计算缩放比例
      var zoom = Math.min(
        this.canvas.width / this.imageWidth,
        this.canvas.height / this.imageHight
      );

      //计算缩放中心
      var zoomPoint = new fabric.Point(
        this.canvas.width / 2,
        this.canvas.height / 2
      );
      //开始缩放
      this.canvas.zoomToPoint(zoomPoint, zoom);
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
        // this.sketchTargetVisible = true;
        this.currentPoints = points;
        this.sketchSave();
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
    // selectSketchTarget(target) {
    //   if (this.selectSketchTargetList.includes(target.id)) {
    //     this.selectSketchTargetList = this.selectSketchTargetList.filter(
    //       item => item !== target.id
    //     );
    //   } else {
    //     this.selectSketchTargetList.push(target.id);
    //   }
    // },
    // confirmTarget() {
    //   if (this.selectSketchTargetList.length) {
    //     this.sketchSave();
    //   } else {
    //     this.$message.error("请先选择标签");
    //   }
    // },
    // 勾画保存
    sketchSave() {
      let objects = this.canvas.getObjects();
      let lastObject = this.canvas.item(objects.length - 1);
      let formVal = {
        fileRecordId: this.fileRecordId,
        sketchList: this.currentPoints,
        targetId: ""
      };
      this.$axios.post("/msci/cmscp/datamanage/sketch/save", formVal).then(
        res => {
          this.sketchTargetVisible = false;
          if (res.data.status === 0) {
            lastObject.id = res.data.data;
            let newObject = {
              id: res.data.data,
              fileRecordId: this.fileRecordId,
              sketchList: this.canvas.freeDrawingBrush._points
            };
            this.latestSketchGroups.push(newObject);
            this.updateLatestSketchGroups(this.latestSketchGroups);
            this.$message("勾画保存成功");
          } else {
            this.$message.error("勾画保存失败");
            this.canvas.remove(lastObject);
            this.canvas.discardActiveObject(); // 清除选中框
          }
        },
        err => {
          this.$message.error("勾画保存失败");
          this.canvas.remove(lastObject);
          this.canvas.discardActiveObject(); // 清除选中框
        }
      );
    },
    // 勾画删除
    sketchDelete(eventTarget) {
      if (eventTarget.id) {
        let params = {
          sketchGroupId: eventTarget.id
        };
        this.$axios.get("/msci/cmscp/datamanage/sketch/delete", { params }).then(
          res => {
            if (res.data.status === 0) {
              this.canvas.remove(eventTarget);
              this.canvas.discardActiveObject(); // 清除选中框

              this.latestSketchGroups = this.latestSketchGroups.filter(
                item => item.id !== eventTarget.id
              );
              this.updateLatestSketchGroups(this.latestSketchGroups);
              this.$message("删除成功");
            } else {
              this.$message.error("删除失败");
            }
          },
          err => {
            this.$message.error("删除失败");
          }
        );
      } else {
        this.canvas.remove(eventTarget);
        this.canvas.discardActiveObject(); // 清除选中框
      }
    },
    selectFileTarget(item) {
      this.$emit("selectFileTarget", item.id);
    },
    updateLatestSketchGroups(list) {
      this.$emit("updateLatestSketchGroups", JSON.parse(JSON.stringify(list)));
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
    .file-target {
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
