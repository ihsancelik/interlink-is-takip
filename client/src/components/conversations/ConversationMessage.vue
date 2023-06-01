<template>
    <div class="m-2 card">

        <div class="row mt-2">

            <div>
                <i class="bi bi-clock"></i>
                <span style="margin-left:5px"> {{ getDate }} {{ getTime }} </span>
            </div>

            <div>
                <i class="bi bi-person"></i>
                <span style="margin-left:5px"> {{ this.conversation.created_from.full_name }} </span>
            </div>

        </div>

        <p v-html="this.conversation.message"></p>

        <div class="d-flex flex-row" v-if="this.conversation?.files">
            <div class="card m-2" v-for="file in this.conversation.files" :key="file._id">
                <img class="img-fluid m-2" :src="getFileUrlShow(file)" style="width: 100px; height:100px" />
                <a class="btn btn-success m-2" @click="downloadFile(file)">{{ getFileName(file) }}</a>
            </div>
        </div>


    </div>
</template>

<script>
import dayjs from 'dayjs'
import 'dayjs/locale/tr' // Türkçe dil dosyası
import { download_file } from "../../services/service"
import { api_url } from '../../helpers/constants'
export default {
    props: {
        conversation: {
            type: Object,
            default: null
        }
    },
    methods: {
        downloadFile(file) {
            download_file({ virtualFileName: file.virtual_file_name, fileName: file.file_name });
        },
        getFileName(file) {
            // eğer file adı 20 karakterden büyükse kısalt ama extension'ı görünsün
            const charLen = 50;
            if (file.file_name.length > charLen) {
                const fileExtension = file.file_name.split('.').pop().toLowerCase();
                return file.file_name.substring(0, charLen) + `...${fileExtension}`;
            }
            else
                return file.file_name;

        },
        getFileUrlShow(file) {
            const fileExtension = file.file_name.split('.').pop().toLowerCase();
            // image extension list
            const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
            const isImage = imageExtensions.includes(fileExtension);
            if (isImage)
                return api_url + "/" + file.virtual_file_name;
            else
                return `/images/file.png`;
        },
        getDownloadFileName(file) {
            return file.file_name;
        }
    },
    computed: {
        getDate() {
            return dayjs(this.conversation.created_at).locale('tr').format('DD/MM/YYYY')
        },
        getTime() {
            return dayjs(this.conversation.created_at).locale('tr').format('HH:mm:ss')
        }
    }
}
</script>

<style></style>