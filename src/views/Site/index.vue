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
    this.$router.replace({
      path: "/login",
      query: {
        siteId
      }
    });
  },
  mounted() {}
};
</script>

<style lang="less" scoped></style>
