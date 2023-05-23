<template lang="">
    <div class="container">
        <h1>Projeler</h1>
        <button @click="newProject" class="btn btn-success">Yeni Proje</button>
        <table class="table table-striped" id="project-table">
            <thead>
                <tr>
                    <th>Ad</th>
                    <th>Aksiyonlar</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="project in getProjects" :key="project._id">
                    <td>{{ project.name }}</td>
                    <td>
                        <a href="#" @click="editProject(project)">Düzenle</a>&nbsp;
                        <a href="#" @click="deleteProject(project._id)">Sil</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    
        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Yeni/Düzenle Proje</h5>
              </div>
              <div class="modal-body">
                    <CreateEditProjectComponent :selectedProject="selectedProject"></CreateEditProjectComponent>
              </div>
            </div>
          </div>
        </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CreateEditProjectComponent from '../components/projects/CreateEditProject.vue'
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
export default {
    mounted() {
        this.$store.dispatch("projects");
    },
    computed: {
        ...mapGetters(["getProjects"])
    },
    watch: {
        getProjects() {
            this.$nextTick(function () {
                new DataTable('#project-table');
            })
        }
    },
    data() {
        return {
            projects: [],
            selectedProject: null
        }
    },
    components: {
        CreateEditProjectComponent
    },
    methods: {
        newProject() {
            this.selectedProject = null;
            $('#exampleModal').modal('show')
        },
        editProject(project) {
            this.selectedProject = project;
            $('#exampleModal').modal('show')
        },
        deleteProject(projectId) {
            if (confirm("Silmek istediğinize emin misiniz?")) {
                this.$store.dispatch("delete_project", { projectId });
            }
        }
    },
}
</script>

<style></style>