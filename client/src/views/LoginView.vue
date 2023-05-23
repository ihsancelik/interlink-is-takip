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
            const device_id = localStorage.getItem("device_id");
            this.$store.dispatch("login", {
                username: this.username,
                password: this.password,
                device_id: device_id
            })
                .then(response => {
                    if (response)
                        this.$router.push({ name: 'tasks' })
                    else
                        alert("Kullanıcı adı veya şifre hatalı!")
                })
        }
    }
}
</script>