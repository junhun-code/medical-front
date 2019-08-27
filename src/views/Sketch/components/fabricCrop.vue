<template>
  <div class="fabric-crop">
    <canvas :id="canvasId" width="100" height="100">
      你的浏览器不支持canvas
    </canvas>
  </div>
</template>

<script>
import { fabric } from "fabric";

export default {
  name: "fabric-crop",
  props: ["imageUrl", "index", "sketchDetail"],
  data() {
    return {
      canvas: null,
      imageWidth: 0,
      imageHight: 0
    };
  },
  computed: {
    canvasId() {
      return `canvas-crop${this.sketchDetail.id}`;
    }
  },
  watch: {},
  components: {},
  methods: {
    initCanvas() {
      //初始化画板
      this.canvas = new fabric.Canvas(this.canvasId, {
        isDrawingMode: false,
        skipTargetFind: true, // 画板元素不能被选中
        selectable: false,
        selection: false,
        preserveObjectStacking: true,
        fireRightClick: true
      });
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
      let groupItem = this.sketchDetail;
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
    },
    zoomToFitCanvas() {
      //先还原缩放比例与位置
      this.canvas.setZoom(1);
      this.canvas.absolutePan({ x: 0, y: 0 });

      //遍历所有对对象，获取最小坐标，最大坐标
      var minX = this.imageWidth;
      var minY = this.imageHight;
      var maxX = 0;
      var maxY = 0;
      this.sketchDetail.sketchList.forEach(item => {
        minX = Math.min(minX, item.x);
        minY = Math.min(minY, item.y);
        maxX = Math.max(maxX, item.x);
        maxY = Math.max(maxY, item.y);
      });

      //计算平移坐标
      var panX = (maxX - minX - this.canvas.width) / 2 + minX;
      var panY = (maxY - minY - this.canvas.height) / 2 + minY;
      //开始平移
      this.canvas.absolutePan({ x: panX, y: panY });

      //计算缩放比例
      var zoom = Math.min(
        this.canvas.width / (maxX - minX),
        this.canvas.height / (maxY - minY)
      );
      //计算缩放中心
      var zoomPoint = new fabric.Point(
        this.canvas.width / 2,
        this.canvas.height / 2
      );
      //开始缩放
      this.canvas.zoomToPoint(zoomPoint, zoom);
    }
  },
  created() {},
  mounted() {
    this.initCanvas();
  }
};
</script>

<style lang="less" scoped>
.fabric-crop {
  margin: 0 5px;
  width: 100px;
  height: 100px;
}
</style>
