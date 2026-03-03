<template>
  <header>
    <h1>
      <router-link to="/agents">Property Agent Manager</router-link>
    </h1>
  </header>
  <main>
    <router-view />
  </main>
</template>

<style scoped>
header {
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #4a90d9;
}

header h1 a {
  color: #2c3e50;
  text-decoration: none;
}
</style>
<script setup lang="ts">
</script>