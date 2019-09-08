<template>
  <div class="version-manager">
    <div class="version-list"></div>
    <div class="version-detail">
      <div class="input-picture"></div>
      <div class="output-picture"></div>
      <div class="version-retport">
        <div class="version-info"></div>
        <div class="ai-info"></div>
        <div class="report-info"></div>
        <div class="button-wrap"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      versionList: []
    };
  },
  computed: {
    ...mapState(["sketchPerms"]),
    sketchSettingRight() {
      return this.sketchPerms.children.some(
        item => item.perm === "fileRecord:sketchSetting"
      );
    },
    auditRight() {
      return this.sketchPerms.children.some(
        item => item.perm === "fileRecord:audit"
      );
    },
    rejectRight() {
      return this.sketchPerms.children.some(
        item => item.perm === "fileRecord:reject"
      );
    }
  },
  components: {},
  methods: {},
  mounted() {}
};
</script>

<style lang="less" scoped>
.version-manager {
  .version-list {
  }
  .version-detail {
    .input-picture {
    }
    .output-picture {
    }
    .version-retport {
      .version-info {
      }
      .ai-info {
      }
      .result-info {
      }
      .button-wrap {
      }
    }
  }
}
</style>
