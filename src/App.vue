<template>
  <div id="app">
    <top-bar></top-bar>
    <router-view/>
  </div>
</template>

<script>
import TopBar from '@/components/TopBar.vue'
export default {
  components: { TopBar }
}
</script>

<style>
@import url('~@/assets/styles/index.css');
</style>
