<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav class="navbar navbar-light bg-light">
    <div class="container-fluid">

      <button v-if="loggedIn" class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText"
        aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <a class="navbar-brand" href="/tasks">
        <span style="font-size: xx-large"><b>InterLink</b> Destek</span>
      </a>
      <button v-if="loggedIn" class="btn btn-danger" @click="logout">Logout</button>
      <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item" v-for="link in links">
            <RouterLink :to="link.url" class="nav-link">{{ link.text }}</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <div class="row m-3">
    <RouterView style="width: 100%;" />
  </div>
</template>


<script>
import { mapGetters } from 'vuex'
export default {
  name: "App",
  data() {
    return {
      links: [
        { text: "Talepler", url: "/tasks" }],
      loggedIn: false
    }
  },
  computed: {
    ...mapGetters(["getUser"])
  },
  created() {
    this.initUI();
  },
  watch: {
    getUser() {
      this.initUI();
    }
  },
  methods: {
    initUI() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user)
        this.loggedIn = true;
      else
        this.loggedIn = false;

      if (user.role.name === "admin") {
        this.links = [
          { text: "Talepler", url: "/tasks" },
          { text: "Projeler", url: "/projects" },
          { text: "Departmanlar", url: "/departments" },
          { text: "Kullanıcılar", url: "/users" }
        ]
      }
      else {
        this.links = [
          { text: "Talepler", url: "/tasks" }
        ]
      }
    },
    logout() {
      localStorage.removeItem("user");
      this.$router.push({ name: 'login' })
      this.links = [];
      this.loggedIn = false;
    },
  }
}
</script>

<style></style>
