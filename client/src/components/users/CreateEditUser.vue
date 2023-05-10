<template>
    <div class="container">

        <div class="row">
            <div class="col-md-6">
                <select v-model="departmentid" class="form-select mb-2">
                    <option selected value="-1">Departman Seçiniz</option>
                    <option v-for="department in getDepartments" :key="department._id" :value="department._id">
                        {{ department.name }}
                    </option>
                </select>
            </div>
            <div class="col-md-6">
                <select v-model="roleid" class="form-select mb-2" aria-label="Rol">
                    <option selected value="-1">Role Seçiniz</option>
                    <option v-for="role in getRoles" :key="role._id" :value="role._id">
                        {{ role.name }}
                    </option>
                </select>
            </div>
        </div>

        <input v-model="full_name" class="form-control mb-2" type="text" placeholder="İsim Soyisim">


        <div class="row">
            <div class="col-md-6">
                <input v-model="email" class="form-control mb-2" type="text" placeholder="E-Posta">
            </div>
            <div class="col-md-6">
                <input v-model="gsm" class="form-control mb-2" type="text" placeholder="GSM">
            </div>
        </div>


        <div class="row">
            <div class="col-md-6">
                <input v-model="username" class="form-control mb-2" type="text" placeholder="Kullanıcı Adı">
            </div>
            <div class="col-md-6">
                <input v-model="password" class="form-control mb-2" type="password" placeholder="Şifre">
            </div>
        </div>

        <button @click="save" class="btn btn-success">Kaydet</button>

    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    props: {
        selectedUser: {
            type: Object,
            default: null
        }
    },
    watch: {
        selectedUser: function (val) {
            if (val != null) {
                this.full_name = val.full_name;
                this.email = val.email;
                this.gsm = val.gsm;
                this.username = val.username;
                this.password = val.password;
                this.departmentid = val.department._id;
                this.roleid = val.role._id;
            }
        }
    },
    mounted() {
        this.$store.dispatch("departments");
        this.$store.dispatch("roles");
    },
    computed: {
        ...mapGetters(["getDepartments", "getRoles"]),
    },
    data() {
        return {
            full_name: "",
            email: "",
            gsm: "",
            username: "",
            password: "",
            departmentid: -1,
            roleid: -1
        }
    },
    methods: {
        save() {
            if (!this.full_name || !this.username || !this.password || this.departmentid == -1 || this.roleid == -1
                || !this.email || !this.gsm) {
                alert("Lütfen tüm alanları doldurunuz!");
                return;
            }

            if (this.selectedUser === null) {
                this.$store.dispatch("create_user", {
                    full_name: this.full_name,
                    email: this.email,
                    gsm: this.gsm,
                    username: this.username,
                    password: this.password,
                    departmentid: this.departmentid,
                    roleid: this.roleid
                }).then(() => {
                    $('#exampleModal').modal('hide')
                }).catch((err) => {
                    alert("Kullanıcı oluşturulamadı!\n" + err);
                });
            }
            else {
                this.$store.dispatch("edit_user", {
                    userId: this.selectedUser._id,
                    full_name: this.full_name,
                    email: this.email,
                    gsm: this.gsm,
                    username: this.username,
                    password: this.password,
                    departmentid: this.departmentid,
                    roleid: this.roleid
                }).then(() => {
                    $('#exampleModal').modal('hide')
                }).catch((err) => {
                    alert("Kullanıcı oluşturulamadı!\n" + err);
                });
            }

        }
    }
}
</script>
<style lang="">
    
</style>