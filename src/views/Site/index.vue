<template>
  <div class="site-id"></div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {},
  components: {},
  methods: {},
  created() {
    let siteId = this.$route.params.siteId;
    this.$tools.setSessionStorage("siteId", siteId);
    this.$router.replace({
      path: "/list"
    });
  },
  mounted() {}
};
</script>

<style lang="less" scoped></style>
