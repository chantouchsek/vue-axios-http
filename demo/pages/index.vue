<template>
  <div>
    <b-jumbotron class="text-center">
      <h3>Welcome to Nuxt auth example</h3>
      This demo is using vue-api-queries-module v{{ version }}
    </b-jumbotron>

    <div>
      User status:
      <b-badge>Guest {{ $errors.errors }}</b-badge>
    </div>
  </div>
</template>

<script>
import { version } from '../../package.json'

export default {
  computed: {
    version: () => version
  }
}
</script>
