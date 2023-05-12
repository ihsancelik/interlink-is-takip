<template>
    <div class="row">
        <div class="col-md-3">
            <div class="card p-3">
                <h3>Talep Bilgileri</h3>
                <p>İlgili Kişi: {{ this.task?.related_person.full_name }}</p>
                <p>Yönetici: {{ this.department_manager_full_name }}</p>
                <p>Proje: {{ this.task?.related_project.name }} </p>
                <p>Tip: {{ this.task?.type.name }}</p>
                <p>Öncelik: {{ this.task?.priority.name }}</p>

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
import { ref } from 'vue'
import { department_manager, add_conversation } from '../services/service'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import ConversationMessage from "../components/conversations/ConversationMessage.vue"
import { get_task, change_task_status } from "../services/service"
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
        }
    },
    mounted() {
        // get taskId from parameters
        this.taskId = this.$route.params.taskId;
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

        })

        this.$store.dispatch("taskStatuses");
        this.$store.dispatch("conversations", { taskId: this.taskId });
    },
    computed: {
        ...mapGetters(["getConversations", "getTasks", "getTaskStatuses"]),
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