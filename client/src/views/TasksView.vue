<template>
    <div class="container">
        <h1>Talepler</h1>
        <button @click="createTask" class="btn btn-success">Yeni Talep</button>
        <table class="table table-striped" id="task-table">
            <thead>
                <tr>
                    <th>Başlık</th>
                    <th>Proje</th>
                    <th>Tip</th>
                    <th>Öncelik</th>
                    <th>Durum</th>
                    <th>İlgili Kişi</th>
                    <th>İlgili Departman</th>
                    <th>Oluşturan</th>
                    <th>Oluşturulma Tarihi</th>
                    <th>Aksiyonlar</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="task in getTasks" :key="task._id">
                    <td v-html="task.title"></td>
                    <td>{{ task.related_project.name }}</td>
                    <td>{{ task.type.name }}</td>
                    <td>{{ task.priority.name }}</td>
                    <td>{{ task.status.name }}</td>
                    <td>{{ task.related_person.full_name }}</td>
                    <td>{{ task.related_department.name }}</td>
                    <td>{{ task.created_from.full_name }}</td>
                    <td>{{ task.created_at }}</td>

                    <td><a @click="openConversations(task._id)">Detaylar</a>&nbsp;
                        <a @click="editTask(task)">Düzenle</a>&nbsp;
                        <a @click="deleteTask(task._id)">Sil</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="modal fade" id="createEditTaskModal" tabindex="-1" role="dialog" aria-labelledby="createEditTaskModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="createEditTaskModalLabel">Yeni Talep</h5>
                </div>
                <div class="modal-body">
                    <CreateEditTaskComponent :selectedTask="selectedTask"></CreateEditTaskComponent>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import CreateEditTaskComponent from '../components/tasks/CreateEditTask.vue'
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
export default {
    mounted() {
        this.$store.dispatch("tasks");
    },
    computed: {
        ...mapGetters(["getTasks"])
    },
    watch: {
        getUsers() {
            this.$nextTick(function () {
                new DataTable('#user-table');
            })
        }
    },
    data() {
        return {
            tasks: [],
            selectedTask: null
        }
    },
    components: {
        CreateEditTaskComponent
    },
    methods: {
        createTask() {
            this.selectedTask = null;
            $('#createEditTaskModal').modal('show')
        },
        editTask(task) {
            this.selectedTask = task;
            $('#createEditTaskModal').modal('show')
        },
        deleteTask(taskId) {
            if (confirm("Silmek istediğinize emin misiniz?")) {
                console.log(taskId);
                this.$store.dispatch("delete_task", { taskId });
            }
        },
        openConversations(taskId) {
            this.$router.push({ name: 'conversations', params: { taskId } })
        }
    }
}
</script>
<style></style>