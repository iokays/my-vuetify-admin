<template>
  <v-container fluid>
    <v-responsive
      class="align-centerfill-height mx-auto"
      max-width="900"
    >
      <v-img
        class="mb-4"
        height="150"
        src="@/assets/logo.png"
      />

      <div class="text-center">
        <h2 class="text-h2 font-weight-bold" >
          <a @click="$router.push('/')">404 - Page Not Found </a>
        </h2>
      </div>

    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
//
</script>

