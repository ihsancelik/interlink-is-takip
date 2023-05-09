<template>
    <div class="container">

        <div class="row">
            <div class="col-md-6">
                <select v-model="related_person_id" class="form-select mb-2">
                    <option selected value="-1">İlgili Kişi Seçiniz</option>
                    <option v-for="user in getUsers" :key="user._id" :value="user._id">
                        {{ user.full_name }}
                    </option>
                </select>
            </div>

            <div class="col-md-6">
                <select v-model="related_department_id" class="form-select mb-2" aria-label="Rol">
                    <option selected value="-1">Departman Seçiniz</option>
                    <option v-for="department in getDepartments" :key="department._id" :value="department._id">
                        {{ department.name }}
                    </option>
                </select>
            </div>
        </div>

        <div class="col-md-6">
            <select v-model="type_id" class="form-select mb-2">
                <option selected value="-1">Talep Tipi Seçiniz</option>
                <option v-for="type in getTaskTypes" :key="type._id" :value="type._id">
                    {{ type.name }}
                </option>
            </select>
        </div>

        <div class="col-md-6">
            <select v-model="status_id" class="form-select mb-2">
                <option selected value="-1">Durum Tipi Seçiniz</option>
                <option v-for="status in getTaskStatuses" :key="status._id" :value="status._id">
                    {{ status.name }}
                </option>
            </select>
        </div>

        <div class="col-md-6">
            <select v-model="priority_id" class="form-select mb-2">
                <option selected value="-1">Öncelik Tipi Seçiniz</option>
                <option v-for="priority in getTaskPriorities" :key="priority._id" :value="priority._id">
                    {{ priority.name }}
                </option>
            </select>
        </div>

        <input v-model="title" class="form-control mb-2" type="text" placeholder="Başlık">

        <textarea v-model="description" class="form-control mb-2" type="text" placeholder="Açıklama">
        </textarea>

        <button @click="save" class="btn btn-success">Kaydet</button>

    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    props: {
        selectedTask: {
            type: Object,
            default: null
        }
    },
    watch: {
        selectedTask: function (val) {
            if (val != null) {
                this.title = val.title;
                this.description = val.description;
                this.type_id = val.type_id;
                this.status_id = val.status_id;
                this.priority_id = val.priority_id;
                this.related_person_id = val.related_person_id;
                this.related_department_id = val.related_department_id;
            }
        }
    },
    mounted() {
        this.$store.dispatch("departments");
        this.$store.dispatch("users");
        this.$store.dispatch("taskTypes");
        this.$store.dispatch("taskStatuses");
        this.$store.dispatch("taskPriorities");
    },
    computed: {
        ...mapGetters(["getDepartments", "getUsers", "getTaskTypes", "getTaskStatuses", "getTaskPriorities"]),
    },
    data() {
        return {
            title: "",
            description: "",
            type_id: -1,
            status_id: -1,
            priority_id: -1,
            related_person_id: -1,
            related_department_id: -1
        }
    },
    methods: {
        save() {
            if (this.title === "" || this.description === "" || this.type_id === -1 || this.status_id === -1 ||
                this.priority_id === -1 || this.related_person_id === -1 || this.related_department_id === -1) {
                alert("Lütfen tüm alanları doldurunuz!");
                return;
            }

            if (this.selectedTask === null) {
                this.$store.dispatch("create_task", {
                    title: this.title,
                    description: this.description,
                    type: this.type_id,
                    status: this.status_id,
                    priority: this.priority_id,
                    related_person: this.related_person_id,
                    related_department: this.related_department_id
                }).then(() => {
                    $('#exampleModal').modal('hide')
                }).catch((err) => {
                    alert("Talep oluşturulamadı!\n" + err);
                });
            }
            else {
                this.$store.dispatch("edit_task", {
                    taskId: this.selectedTask._id,
                    title: this.title,
                    description: this.description,
                    type: this.type_id,
                    status: this.status_id,
                    priority: this.priority_id,
                    related_person: this.related_person_id,
                    related_department: this.related_department_id
                }).then(() => {
                    $('#exampleModal').modal('hide')
                }).catch((err) => {
                    alert("Talep oluşturulamadı!\n" + err);
                });
            }

        }
    }
}
</script>
<style lang="">
    
</style>