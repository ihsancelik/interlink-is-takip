<template>
    <div class="row">
        <div class="col-md-3">
            <div class="card p-3">
                <h3>Talep Bilgileri</h3>
                Yönetici:
                <p>{{ this.department_manager_full_name }}</p>

                İlgili Kişi:
                <select v-model="related_person_id" class="form-select mb-2" @change="changeRelatedPerson">
                    <option selected value="-1">İlgili Kişi Seçiniz</option>
                    <option v-for="relatedPerson in getUsers" :key="relatedPerson._id" :value="relatedPerson._id">
                        {{ relatedPerson.full_name }} - {{ relatedPerson.department.name }} - {{ relatedPerson.role.name }}
                    </option>
                </select>

                Proje:
                <select v-model="project_id" class="form-select mb-2" @change="changeProject">
                    <option selected value="-1">Proje Seçiniz</option>
                    <option v-for="project in getProjects" :key="project._id" :value="project._id">
                        {{ project.name }}
                    </option>
                </select>

                Tip:
                <select v-model="type_id" class="form-select mb-2" @change="changeTaskType">
                    <option selected value="-1">Talep Tipi Seçiniz</option>
                    <option v-for="type in getTaskTypes" :key="type._id" :value="type._id">
                        {{ type.name }}
                    </option>
                </select>

                Öncelik:
                <select v-model="priority_id" class="form-select mb-2" @change="changeTaskPriority">
                    <option selected value="-1">Öncelik Tipi Seçiniz</option>
                    <option v-for="priority in getTaskPriorities" :key="priority._id" :value="priority._id">
                        {{ priority.name }}
                    </option>
                </select>

                Durum:
                <select v-model="status_id" class="form-select mb-2" @change="changeTaskStatus">
                    <option selected value="-1">Durum Tipi Seçiniz</option>
                    <option v-for="status in getTaskStatuses" :key="status._id" :value="status._id">
                        {{ status.name }}
                    </option>
                </select>
            </div>

        </div>
        <div class="col-md-9">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title" v-html="task?.title"></h5>
                    <h6 class="card-subtitle m-1 text-muted">
                        <i class="bi bi-clock mr-1"></i> <span>{{ getDate }}</span> <br />
                        <i class="bi bi-person mr-1"></i> <span>{{ this.task?.created_from?.full_name }}</span>

                    </h6>
                    <p class="card-text m-3" v-html="task?.description"></p>
                </div>
            </div>

            <div class="row" v-for="conversation in getConversations" :key="conversation._id">
                <ConversationMessageComponent :conversation="conversation" />
            </div>

            <hr />
            {{ answerAreaTitle }}
            <div v-if="showAnswerArea">
                <QuillEditorComponent theme="snow" toolbar="minimal" v-model:content="message" content-type="html"
                    style="min-height: 250px; max-height: 300px;" />
                <div class="row">
                    <div class="col-md-6">
                        <input type="file" ref="fileInput" multiple />
                    </div>
                    <div class="col-md-6">
                        <button @click="save" class="btn btn-success">Gönder</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { mapGetters } from 'vuex'
import { department_manager, add_conversation } from '../services/service'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import ConversationMessage from "../components/conversations/ConversationMessage.vue"
import { get_task, change_task_status, change_task_priority, change_task_type, change_task_project, change_task_related_person } from "../services/service"
import dayjs from "dayjs"
export default {
    methods: {
        save() {
            const files = this.$refs.fileInput.files;
            const formData = new FormData();
            formData.append('message', this.message);
            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }
            add_conversation({ taskId: this.taskId, formData: formData }).then(response => {
                this.$store.dispatch("conversations", { taskId: this.taskId });
            });
        },
        changeTaskStatus() {
            change_task_status({ taskId: this.taskId, status: this.status_id }).then(response => {
                this.$store.dispatch("tasks");
            });
        },
        changeTaskPriority() {
            change_task_priority({ taskId: this.taskId, priority: this.priority_id }).then(response => {
                this.$store.dispatch("tasks");
            });
        },
        changeTaskType() {
            change_task_type({ taskId: this.taskId, type: this.type_id }).then(response => {
                this.$store.dispatch("tasks");
            });
        },
        changeProject() {
            change_task_project({ taskId: this.taskId, project: this.project_id }).then(response => {
                this.$store.dispatch("tasks");
            });
        },
        changeRelatedPerson() {
            change_task_related_person({ taskId: this.taskId, related_person: this.related_person_id }).then(response => {
                this.$store.dispatch("tasks");
            });
        }

    },
    mounted() {
        // get taskId from parameters
        this.taskId = this.$route.params.taskId;
        this.$store.dispatch("taskStatuses");
        this.$store.dispatch("taskPriorities");
        this.$store.dispatch("taskTypes");
        this.$store.dispatch("projects");
        this.$store.dispatch("departments");
        this.$store.dispatch("users");
        this.$store.dispatch("conversations", { taskId: this.taskId });

        get_task({ taskId: this.taskId }).then(response => {
            this.task = response;

            const taskStatusName = this.task.status.name;
            this.answerAreaTitle = `*Talep ${taskStatusName}.`;
            if (taskStatusName === 'tamamlandı' || taskStatusName === 'iptal edildi') {
                this.answerAreaTitle = `*Talep ${taskStatusName}. Yeni cevap yazılamaz`;
                this.showAnswerArea = false;
            }
            else {
                this.answerAreaTitle = `*Talep ${taskStatusName}. Cevap yaz.`;
                this.showAnswerArea = true;
            }

            department_manager({ departmentId: this.task.related_department._id }).then(response => {
                this.department_manager_full_name = response.full_name;
            });

            this.related_person_full_name = this.task.related_person.full_name;
            this.status_id = this.task.status._id;
            this.priority_id = this.task.priority._id;
            this.type_id = this.task.type._id;
            this.project_id = this.task.related_project._id;
            this.department_id = this.task.related_department._id;
            this.related_person_id = this.task.related_person._id;

        })
    },
    computed: {
        ...mapGetters(["getConversations", "getTasks", "getTaskStatuses", "getTaskPriorities", "getTaskTypes", "getProjects", "getDepartments", "getUsers"]),
        getDate() {
            return dayjs(this.task?.created_at).format("DD/MM/YYYY HH:mm:ss");
        },
        getPriorityIcon() {
            // burada priority red-green tarzı renkler vereceğim.
        }
    },
    data() {
        return {
            taskId: -1,
            task: null,
            related_person_full_name: null,
            department_manager_full_name: null,
            status_id: -1,
            priority_id: -1,
            type_id: -1,
            project_id: -1,
            department_id: -1,
            related_person_id: -1,

            taskConversations: [],
            files: [],
            message: "",
            showAnswerArea: false,
            answerAreaTitle: ""
        }
    },
    components: {
        QuillEditorComponent: QuillEditor,
        ConversationMessageComponent: ConversationMessage
    }
}
</script>


<style></style>