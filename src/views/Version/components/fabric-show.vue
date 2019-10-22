<template>
  <div class="fabric-show">
    <canvas :id="canvasId" width="500" height="400">
      你的浏览器不支持canvas
    </canvas>
  </div>
</template>

<script>
import { fabric } from "fabric";

export default {
  name: "fabric-show",
  props: ["imageUrl", "report"],
  data() {
    return {
      canvas: null,
      imageWidth: 0,
      imageHight: 0
    };
  },
  computed: {
    canvasId() {
      return `canvas-show`;
    }
  },
  watch: {
    imageUrl: {
      handler(newVal, oldVal) {
        this.updateCanvas();
      }
    }
  },
  components: {},
  methods: {
    updateCanvas() {
      this.initImage();
    },
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
      this.report.forEach(groupItem => {
        let polygon = new fabric.Polygon(groupItem.mask, {
          strokeWidth: 2,
          stroke: "red",
          objectCaching: false,
          fill: "transparent"
        });
        this.canvas.add(polygon);
      });
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
  height: 130px;
  display: flex;
}
</style>
