<template>
  <h1>页面不存在</h1>
</template>

<script>
export default {
    mounted() {
        this.$message.error('页面不存在，跳转至主页')
        this.$router.push('/activities')
    }
}
</script>

<style>

</style>
