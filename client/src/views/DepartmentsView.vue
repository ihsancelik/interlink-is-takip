<template lang="">
    <div class="container">
        <h1>Departmanlar</h1>
        <button @click="newDepartment" class="btn btn-success">Yeni Departman</button>
        <table class="table table-striped" id="department-table">
            <thead>
                <tr>
                    <th>Ad</th>
                    <th>Aksiyonlar</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="department in getDepartments" :key="department._id">
                    <td>{{ department.name }}</td>
                    <td>
                        <a href="#" @click="editDepartment(department)">Düzenle</a>&nbsp;
                        <a href="#" @click="deleteDepartment(department._id)">Sil</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    
        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Yeni/Düzenle Departman</h5>
              </div>
              <div class="modal-body">
                    <CreateEditDepartmentComponent :selectedDepartment="selectedDepartment"></CreateEditDepartmentComponent>
              </div>
            </div>
          </div>
        </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CreateEditDepartmentComponent from '../components/departments/CreateEditDepartment.vue'
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
export default {
    mounted() {
        this.$store.dispatch("departments");
    },
    computed: {
        ...mapGetters(["getDepartments"])
    },
    watch: {
        getDepartments() {
            this.$nextTick(function () {
                new DataTable('#department-table');
            })
        }
    },
    data() {
        return {
            departments: [],
            selectedDepartment: null
        }
    },
    components: {
        CreateEditDepartmentComponent
    },
    methods: {
        newDepartment() {
            this.selectedDepartment = null;
            $('#exampleModal').modal('show')
        },
        editDepartment(department) {
            this.selectedDepartment = department;
            $('#exampleModal').modal('show')
        },
        deleteDepartment(departmentId) {
            if (confirm("Silmek istediğinize emin misiniz?")) {
                this.$store.dispatch("delete_department", { departmentId });
            }
        }
    },
}
</script>

<style></style>