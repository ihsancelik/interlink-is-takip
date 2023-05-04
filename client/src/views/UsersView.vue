<template lang="">
    <div class="container">
        <h1>Kullanıcılar</h1>
        <button @click="newUser" class="btn btn-success">Yeni Kullanıcı</button>
        <DataTable :columns="columns" :data="getUsers">
            <template #Duzenle="slotProps">
                <button class="btn btn-primary">Düzenle</button>
            </template>
        </DataTable>
    </div>
    
        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Yeni Kullanıcı</h5>
              </div>
              <div class="modal-body">
                    <CreateEditUserComponent></CreateEditUserComponent>
              </div>
            </div>
          </div>
        </div>
</template>

<script>
import DataTable from 'datatables.net-vue3';
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
            columns: [
                { data: "full_name", title: "İsim Soyisim" },
                { data: "username", title: "Kullanıcı Adı" },
                { data: "password", title: "Şifre" },
                { data: "department.name", title: "Departman" },
                { data: "role.name", title: "Rol" },
                { title: "Duzenle", render: function () { return "" } }],
            users: [],
        }
    },
    components: {
        DataTable,
        CreateEditUserComponent
    },
    methods: {
        newUser() {
            $('#exampleModal').modal('show')
        },
    },
}
</script>

<style>
@import 'datatables.net-dt';
</style>