<template>
  <div>
    <b-navbar toggleable="md" variant="light">
      <b-navbar-toggle target="nav_collapse" />
      <b-navbar-brand to="/">
        Nuxt.js
      </b-navbar-brand>

      <b-collapse id="nav_collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/" exact>
            Home
          </b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto" v-if="$auth.loggedIn">
          <b-dropdown-item>
            {{  $auth.user.name }}
          </b-dropdown-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto" v-else>
          <b-dropdown-item to="/login">
            Login
          </b-dropdown-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-container class="mt-4">
      <nuxt />
    </b-container>
  </div>
</template>

<script>
export default {
  computed: {
    picture () {
      return null
    }
  }
}
</script>
