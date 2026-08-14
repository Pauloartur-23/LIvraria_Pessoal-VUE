<script setup>
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import ToastMessages from './components/ToastMessages.vue'
</script>

<template>
  <SiteHeader />
  <router-view />
  <SiteFooter />
  <ToastMessages />
</template>
