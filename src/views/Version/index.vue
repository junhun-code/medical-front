<template>
  <div class="version-manager"></div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
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

<style lang="less" scoped></style>
