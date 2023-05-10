<template>
    <div class="container">
        <div class="card">
            <div class="form-group">
                <div class="text-center">
                    <span style="font-size: xx-large"><b>InterLink</b> Destek</span>
                </div>
                <div class="m-5">
                    <input class="form-control mb-2" v-model="username" type="text" placeholder="Kullanıcı Adı">
                    <input class="form-control mb-2" v-model="password" type="password" placeholder="Şifre">
                    <button class="btn btn-primary" @click="login">Giriş Yap</button>
                </div>
            </div>
        </div>
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