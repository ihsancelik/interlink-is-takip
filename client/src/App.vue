<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="container">
    <div class="row mb-2">
      <div class="col-md-4">
        <RouterLink to="/login">Login</RouterLink>
      </div>
      <div class="col-md-4">
        <RouterLink to="/users">Users</RouterLink>
      </div>
      <div class="col-md-4">
        <RouterLink to="/tasks">Tasks</RouterLink>
      </div>
    </div>
    <div class="row">
      <RouterView style="width: 100%;" />
    </div>
  </div>
</template>

<style>
</style>
