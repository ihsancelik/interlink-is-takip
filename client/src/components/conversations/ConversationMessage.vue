<template>
    <div class="container m-2 card">

        <div class="row ml-2 mt-2">


            <i class="bi bi-clock">
                <span class="">
                    {{ getDate }} {{ getTime }}
                </span>
            </i>

            <i class="bi bi-person">
                <span class="">
                    {{ this.conversation.created_from.full_name }}
                </span>
            </i>

        </div>

        <p v-html="this.conversation.message"></p>


    </div>
</template>

<script>
import dayjs from 'dayjs'
import 'dayjs/locale/tr' // Türkçe dil dosyası
export default {
    props: {
        conversation: {
            type: Object,
            default: null
        }
    },
    computed: {
        getDate() {
            return dayjs(this.conversation.created_at).locale('tr').format('DD/MM/YYYY')
        },
        getTime() {
            return dayjs(this.conversation.created_at).locale('tr').format('HH:mm:ss')
        },
    }
}
</script>

<style></style>