<template>
    <div class="container">

        <input v-model="name" class="form-control mb-2" type="text" placeholder="Ad">

        <button @click="save" class="btn btn-success">Kaydet</button>

    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    props: {
        selectedProject: {
            type: Object,
            default: null
        }
    },
    watch: {
        selectedProject: function (val) {
            if (val != null) {
                this.name = val.name
            }
        }
    },
    data() {
        return {
            name: ""
        }
    },
    methods: {
        save() {
            if (!this.name) {
                alert("Lütfen tüm alanları doldurunuz!");
                return;
            }

            if (this.selectedProject === null) {
                this.$store.dispatch("create_project", {
                    name: this.name
                }).then(() => {
                    $('#exampleModal').modal('hide')
                }).catch((err) => {
                    alert("Proje oluşturulamadı!\n" + err);
                });
            }
            else {
                this.$store.dispatch("edit_project", {
                    projectId: this.selectedProject._id,
                    name: this.name
                }).then(() => {
                    $('#exampleModal').modal('hide')
                }).catch((err) => {
                    alert("Proje oluşturulamadı!\n" + err);
                });
            }

        }
    }
}
</script>
<style lang="">
    
</style>