<template>
    <div class="container">
        <h1>Talepler</h1>
        <button @click="newTask" class="btn btn-success">Yeni Talep</button>
        <table>
            <thead>
                <tr>
                    <th>Başlık</th>
                    <th>Açıklama</th>
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
                    <td>{{ task.title }}</td>
                    <td>{{ task.description }}</td>
                    <td>{{ task.type }}</td>
                    <td>{{ task.priority }}</td>
                    <td>{{ task.status }}</td>
                    <td>{{ task.related_person.full_name }}</td>
                    <td>{{ task.related_department.name }}</td>
                    <td>{{ task.created_from.full_name }}</td>
                    <td>{{ task.created_at }}</td>

                    <td><button @click="editTask(task)" class="btn btn-primary">Düzenle</button></td>
                    <td><button @click="deleteTask(task._id)" class="btn btn-danger">Sil</button></td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Yeni Kullanıcı</h5>
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
export default {
    mounted() {
        this.$store.dispatch("tasks");
    },
    computed: {
        ...mapGetters(["getTasks"])
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
            $('#exampleModal').modal('show')
        },
        editTask(task) {
            this.task = task;
            $('#exampleModal').modal('show')
        },
        deleteTask(taskId) {
            if (confirm("Silmek istediğinize emin misiniz?")) {
                console.log(taskId);
                this.$store.dispatch("delete_task", { taskId });
            }
        }
    }
}
</script>
<style></style>