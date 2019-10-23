<template>
  <div class="fabric-show" ref="canvas-wrapper">
    <canvas ref="canvas" id="canvas-show">
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
      imageHight: 0,
      isDragging: false // 是否正在拖动
    };
  },
  computed: {},
  watch: {
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
  components: {},
  methods: {
    updateCanvas() {
      this.initImage();
    },
    initCanvas() {
      const CANCAS_WIDTH = this.$refs["canvas-wrapper"].offsetWidth;
      const CANCAS_HEIGHT = this.$refs["canvas-wrapper"].offsetHeight;
      this.$refs.canvas.width = CANCAS_WIDTH;
      this.$refs.canvas.height = CANCAS_HEIGHT;

      this.canvas = new fabric.Canvas("canvas-show", {
        isDrawingMode: false,
        skipTargetFind: true, // 画板元素不能被选中
        selectable: false,
        selection: false,
        preserveObjectStacking: true,
        fireRightClick: true
      });

      this.initImage();
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
    },
    // 缩放
    zoomControl() {
      this.canvas.on("mouse:wheel", opt => {
        var delta = opt.e.deltaY;
        var pointer = this.canvas.getPointer(opt.e);
        var zoom = this.canvas.getZoom();
        zoom = zoom + delta / 500;
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
        var evt = opt.e;
        this.isDragging = true;
      });
      this.canvas.on("mouse:move", opt => {
        if (this.isDragging) {
          var e = opt.e;
          var delta = new fabric.Point(e.movementX, e.movementY);
          this.canvas.relativePan(delta);
        }
      });
      this.canvas.on("mouse:up", opt => {
        this.isDragging = false;
      });
    }
  },
  created() {},
  mounted() {
    setTimeout(this.initCanvas, 500);
  }
};
</script>

<style lang="less" scoped>
.fabric-show {
  height: 100%;
}
</style>
