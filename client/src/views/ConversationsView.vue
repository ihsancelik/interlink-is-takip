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

            <select v-model="status_id" class="form-select mb-2" @change="changeTaskStatus">
                <option selected value="-1">Durum Tipi Seçiniz</option>
                <option v-for="status in getTaskStatuses" :key="status._id" :value="status._id">
                    {{ status.name }}
                </option>
            </select>

        </div>
        <div class="col-md-9">
            <h1>Talep Bilgisi</h1>
            <div class="card">
                <p v-html="task.title"></p>
                <p v-html="task.description"></p>

            </div>
            <hr />
            <h1>Talep Konuşmaları</h1>
            <div class="row" v-for="conversation in getConversations" :key="conversation._id">
                <ConversationMessageComponent :conversation="conversation" />
            </div>

            <hr />
            <QuillEditorComponent theme="snow" toolbar="minimal" v-model:content="message" content-type="html" />
            <div class="row">
                <div class="col-md-6">
                    <input type="file" ref="fileInput" multiple />
                </div>
                <div class="col-md-6">
                    <button @click="save" class="btn btn-success">Kaydet</button>
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

        }
    },
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

            taskConversations: [],
            files: [],
            message: ""
        }
    },
    components: {
        QuillEditorComponent: QuillEditor,
        ConversationMessageComponent: ConversationMessage
    }
}
</script>


<style></style>