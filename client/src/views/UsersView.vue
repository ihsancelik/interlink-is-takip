<template lang="">
    <div class="container">
        <h1>Kullanıcılar</h1>
        <button @click="newUser" class="btn btn-success">Yeni Kullanıcı</button>
        <table>
            <thead>
                <tr>
                    <th>İsim Soyisim</th>
                    <th>Kullanıcı Adı</th>
                    <th>Şifre</th>
                    <th>Departman</th>
                    <th>Rol</th>
                    <th>Aksiyonlar</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in getUsers" :key="user._id">
                    <td>{{ user.full_name }}</td>
                    <td>{{ user.username }}</td>
                    <td>{{ user.password }}</td>
                    <td>{{ user.department.name }}</td>
                    <td>{{ user.role.name }}</td>
                    <td><button @click="editUser(user)" class="btn btn-primary">Düzenle</button></td>
                    <td><button @click="deleteUser(user._id)" class="btn btn-danger">Sil</button></td>
                </tr>
            </tbody>
        </table>
    </div>
    
        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Yeni Kullanıcı</h5>
              </div>
              <div class="modal-body">
                    <CreateEditUserComponent :selectedUser="selectedUser"></CreateEditUserComponent>
              </div>
            </div>
          </div>
        </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CreateEditUserComponent from '../components/users/CreateEditUser.vue'
export default {
    mounted() {
        this.$store.dispatch("users");
    },
    computed: {
        ...mapGetters(["getUsers"])
    },
    data() {
        return {
            users: [],
            selectedUser: null
        }
    },
    components: {
        CreateEditUserComponent
    },
    methods: {
        newUser() {
            $('#exampleModal').modal('show')
        },
        editUser(user) {
            this.selectedUser = user;
            $('#exampleModal').modal('show')
        },
        deleteUser(userId) {
            if (confirm("Silmek istediğinize emin misiniz?")) {
                console.log(userId);
                this.$store.dispatch("delete_user", { userId });
            }
        }
    },
}
</script>

<style></style>