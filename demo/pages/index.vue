<template>
  <div>
    <b-jumbotron class="text-center">
      <h3>Welcome to Nuxt example</h3>
      This demo is using vue-api-queries-module v{{ version }}

      <b-button to="/users" variant="primary">Go to users</b-button>
    </b-jumbotron>

    <div>
      User status:
      <b-badge>Guest: {{ !$auth.loggedIn }}</b-badge>
    </div>
  </div>
</template>

<script>
import { version } from '../../package.json'

export default {
  name: 'Index',
  computed: {
    version: () => version
  }
}
</script>
