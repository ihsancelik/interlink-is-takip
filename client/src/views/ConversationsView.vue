<template>
    <div class="row">
        <div class="col-md-3">
            <h1>Talep Detayları</h1>
            <p>İlgili Kişi:{{ this.related_person_full_name }}</p>
            <p>Yönetici:{{ this.department_manager_full_name }}</p>
            <p>Proje:Proje Bilgisi</p>
            <p>Tip:{{ this.type }}</p>
            <p>Durum:{{ this.status }}</p>
            <p>Öncelik:{{ this.priority }}</p>
            <br />

            <select v-model="status_id" class="form-select mb-2">
                <option selected value="-1">Durum Tipi Seçiniz</option>
                <option v-for="status in getTaskStatuses" :key="status._id" :value="status._id">
                    {{ status.name }}
                </option>
            </select>
        </div>
        <div class="col-md-9">

        </div>
    </div>
</template>


<script>
import { mapGetters } from 'vuex'
import { department_manager } from '../services/service'
export default {
    mounted() {
        // get taskId from parameters
        this.taskId = this.$route.params.taskId;
        this.$store.dispatch("taskStatuses");
        this.$store.dispatch("conversations", { taskId: this.taskId });
        this.task = this.$store.getters.getTasks.find(task => task._id == this.taskId);

        department_manager({ departmentId: this.task.related_department._id }).then(response => {
            this.department_manager_full_name = response.full_name;
        });

        this.related_person_full_name = this.task.related_person.full_name;

        this.type = this.task.type.name;
        this.status = this.task.status.name;
        this.status_id = this.task.status._id;
        this.priority = this.task.priority.name;
    },
    computed: {
        ...mapGetters(["getConversations", "getTasks", "getTaskStatuses"])
    },
    data() {
        return {
            taskId: -1,
            related_person_full_name: null,
            department_manager_full_name: null,
            project: null,
            type: null,
            status: null,
            priority: null,
            status_id: -1,

            taskConversations: []
        }
    }
}
</script>


<style></style>