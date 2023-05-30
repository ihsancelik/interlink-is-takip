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
        selectedDepartment: {
            type: Object,
            default: null
        }
    },
    watch: {
        selectedDepartment: function (val) {
            if (val != null) {
                this.name = val.name
            }
            else {
                this.name = ""
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

            if (this.selectedDepartment === null) {
                this.$store.dispatch("create_department", {
                    name: this.name
                }).then(() => {
                    $('#exampleModal').modal('hide')
                });
            }
            else {
                this.$store.dispatch("edit_department", {
                    departmentId: this.selectedDepartment._id,
                    name: this.name
                }).then(() => {
                    $('#exampleModal').modal('hide')
                });
            }

        }
    }
}
</script>
<style lang="">
    
</style>