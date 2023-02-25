<template>
  <div class="pages">
    <div class="detail-card card">
      <h2>{{ dairy.title }}</h2>
      <p class="name">{{ dairy.name }}</p>
      <p class="time">{{ dairy.time }}</p>
      <p class="detail">{{ dairy.detail }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dairy: {},
    }
  },
  mounted() {
    this.dairy = JSON.parse(sessionStorage.getItem('dairy') || '{}')
  },
}
</script>

<style>
.detail-card {
  padding: 30px;
  text-align: center;
}
.detail-card h2 {
  text-align: center;
}
.detail-card .time {
  color: #aaa;
  font-size: 12px;
  margin-bottom: 30px;
}
.detail-card .detail {
  text-align: center;
}
</style>
