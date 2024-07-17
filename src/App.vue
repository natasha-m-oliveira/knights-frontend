<template>
  <v-responsive>
    <v-app :theme="theme">
      <v-app-bar class="px-3">
        <v-spacer></v-spacer>

        <v-btn
          :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          @click="onClick"
        >
        <v-icon :icon="theme === 'light' ? 'mdi-brightness-6' : 'mdi-brightness-4'"></v-icon>
      </v-btn>
      </v-app-bar>

      <v-main>
        <v-container>
          <SimpleTable />
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>

<script setup>
  import { ref } from 'vue'
  import SimpleTable from "./components/SimpleTable.vue";

  const theme = ref('light')

  function onClick () {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

</script>

<style scoped>
</style>
