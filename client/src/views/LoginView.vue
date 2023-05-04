<template>
    <div>
        <input v-model="username" type="text" placeholder="Kullanıcı Adı">
        <input v-model="password" type="password" placeholder="Şifre">
        <button @click="login">Giriş Yap</button>
    </div>
</template>
<script>
export default {
    name: "LoginView",
    data() {
        return {
            username: "",
            password: ""
        }
    },
    methods: {
        login() {
            this.$store.dispatch("login", {
                username: this.username,
                password: this.password
            }).then(() => {
                this.$router.push("/dashboard");
            }).catch(() => {
                alert("Kullanıcı adı veya şifre hatalı!");
            });
        }
    },
    computed: {
        isAuthenticated() {
            return this.$store.getters.isAuthenticated;
        }
    }
}
</script>