<template>
    <div class="container">

        <div class="row mb-3" v-if="selectedTask === null">
            <div class="col-md-6">
                <select id="cetDepartmentSelect2" class="setdialogselect2" aria-label="Rol">
                    <option selected value="-1">Departman Seçiniz</option>
                    <option v-for="department in getDepartments" :key="department._id" :value="department._id">
                        {{ department.name }}
                    </option>
                </select>
            </div>

            <div class="col-md-6">
                <select id="cetRelatedPersonSelect2" class="setdialogselect2">
                    <option selected value="-1">Kişi Seçiniz</option>
                    <option v-for="user in getUsers" :key="user._id" :value="user._id">
                        {{ user.full_name }} - {{ user.department.name }} - {{ user.role.name }}
                    </option>
                </select>
            </div>
        </div>

        <div class="row mb-3" v-if="selectedTask === null">
            <div class="col-md-6">
                <select id="cetProjectSelect2" class="setdialogselect2">
                    <option selected value="-1">Proje Seçiniz</option>
                    <option v-for="project in getProjects" :value="project._id">
                        <span>{{ project.name }}</span>
                    </option>
                </select>
            </div>

            <div class="col-md-6">
                <select id="cetTaskTypeSelect2" class="setdialogselect2">
                    <option selected value="-1">Tip Seçiniz</option>
                    <option v-for="type in getTaskTypes" :key="type._id" :value="type._id">
                        {{ type.name }}
                    </option>
                </select>
            </div>
        </div>

        <div class="row mb-3" v-if="selectedTask === null">
            <div class="col-md-6">
                <select id="cetTaskStatusSelect2" class="setdialogselect2">
                    <option selected value="-1">Durum Seçiniz</option>
                    <option v-for="status in getTaskStatuses" :key="status._id" :value="status._id">
                        {{ status.name }}
                    </option>
                </select>
            </div>

            <div class="col-md-6">
                <select id="cetPrioritySelect2" class="setdialogselect2">
                    <option selected value="-1">Öncelik Tipi Seçiniz</option>
                    <option v-for="priority in getTaskPriorities" :key="priority._id" :value="priority._id">
                        {{ priority.name }}
                    </option>
                </select>
            </div>
        </div>


        <input v-model="title" class="form-control mb-2" type="text" placeholder="Başlık">

        <QuillEditorComponent theme="snow" toolbar="minimal" v-model:content="description" content-type="html"
            style="min-height: 250px;" placeholder="Açıklamayı detaylı bir şekilde giriniz!" />

        <div v-if="selectedTask === null" class="col-md-12">
            <input type="file" ref="fileInput" multiple />
        </div>
        <button @click="save" class="btn btn-success mt-2">Kaydet</button>

    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { add_conversation } from '../../services/service'
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
                this.type_id = val.type._id;
                this.status_id = val.status._id;
                this.priority_id = val.priority._id;
                this.related_project_id = val.related_project._id;
                this.related_person_id = val.related_person._id;
                this.related_department_id = val.related_department._id;
            }
            else {
                this.title = "";
                this.description = "";
                this.type_id = -1;
                this.status_id = -1;
                this.priority_id = -1;
                this.related_project_id = -1;
                this.related_person_id = -1;
                this.related_department_id = -1;
            }
        }
    },
    mounted() {
        $('#cetProjectSelect2').on('select2:select', (e) => {
            this.related_project_id = e.params.data.id;
        });

        $('#cetTaskTypeSelect2').on('select2:select', (e) => {
            this.type_id = e.params.data.id;
        });

        $('#cetTaskStatusSelect2').on('select2:select', (e) => {
            this.status_id = e.params.data.id;
        });

        $('#cetPrioritySelect2').on('select2:select', (e) => {
            this.priority_id = e.params.data.id;
        });

        $('#cetRelatedPersonSelect2').on('select2:select', (e) => {
            this.related_person_id = e.params.data.id;
        });

        $('#cetDepartmentSelect2').on('select2:select', (e) => {
            this.related_department_id = e.params.data.id;
        });


    },
    computed: {
        ...mapGetters([
            "getDepartments",
            "getUsers",
            "getTaskTypes",
            "getTaskStatuses",
            "getTaskPriorities",
            "getProjects"
        ]),
    },
    data() {
        return {
            title: "",
            description: "",
            project_id: -1,
            type_id: -1,
            status_id: -1,
            priority_id: -1,
            related_person_id: -1,
            related_department_id: -1,
            related_project_id: -1,
            onlyShowTitleDescription: false
        }
    },
    components: {
        QuillEditorComponent: QuillEditor
    },
    methods: {
        save() {
            if (this.selectedTask === null) {
                this.$store.dispatch("create_task", {
                    title: this.title,
                    description: this.description,
                    type: this.type_id,
                    status: this.status_id,
                    priority: this.priority_id,
                    related_project: this.related_project_id,
                    related_person: this.related_person_id,
                    related_department: this.related_department_id
                }).then(() => {
                    const files = this.$refs.fileInput.files;
                    if (files.length > 0) {
                        const createdTaskId = this.$store.state.createdTaskId;
                        const formData = new FormData();
                        formData.append('message', '');
                        for (let i = 0; i < files.length; i++) {
                            formData.append('files', files[i]);
                        }
                        add_conversation({ taskId: createdTaskId, formData: formData })
                            .then(() => {
                                this.$refs.fileInput.files = null;
                            });
                    }
                    $('#createEditTaskModal').modal('hide')
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
                    related_project: this.related_project_id,
                    related_person: this.related_person_id,
                    related_department: this.related_department_id
                }).then(() => {
                    $('#createEditTaskModal').modal('hide')
                });
            }

        }
    }
}
</script>
<style lang="">
    
</style>