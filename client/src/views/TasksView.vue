<template>
  <div class="container">

    <div class="row">
      <div class="col-md-11">
        <h1>TALEPLER</h1>
      </div>
      <div class="col-md-1">
        <button @click="createTask" class="btn btn-success mb-5">Talep Aç</button>
      </div>
    </div>


    <div class="row mb-3">

      <div class="col-md-3">
        <label>Proje</label><br />
        <select id="projectSelect2" class="form-control mb-2 setselect2">
          <option value="0">
            <span>Tümü</span>
          </option>
          <option v-for="project in getProjects" :value="project._id">
            <span>{{ project.name }}</span>
          </option>
        </select>
      </div>

      <div class="col-md-3">
        <label>Tip</label> <br />
        <select id="typeSelect2" class="form-control mb-2 setselect2">
          <option value="0">Tümü</option>
          <option v-for="type in getTaskTypes" :key="type._id" :value="type._id">
            {{ type.name }}
          </option>
        </select>
      </div>

      <div class="col-md-3">
        <label>Öncelik</label><br />
        <select id="prioritySelect2" class="form-control mb-2 setselect2">
          <option value="0">Tümü</option>
          <option v-for="priority in getTaskPriorities" :key="priority._id" :value="priority._id">
            {{ priority.name }}
          </option>
        </select>
      </div>

      <div class="col-md-3">
        <label>Durum</label><br />
        <select id="statusSelect2" class="form-control mb-2 setselect2">
          <option value="0">Tümü</option>
          <option v-for="status in getTaskStatuses" :key="status._id" :value="status._id">
            {{ status.name }}
          </option>
        </select>
      </div>

    </div>

    <table class="table table-striped" id="task-table">
      <thead>
        <tr style="color:black; font-weight: bolder; font-size: large;">
          <th>Talep No</th>
          <th>Başlık</th>
          <th>Proje</th>
          <th>Tip</th>
          <th>Öncelik</th>
          <th>İlgili Kişi</th>
          <th>İlgili Departman</th>
          <th>Oluşturan</th>
          <th>Oluşturulma Tarihi</th>
          <th>Durum</th>
          <th>Aksiyonlar</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in getTasks" :key="task._id">
          <td>{{ getFullDate(task.created_at).replace(/:|\//g, '').replace(' ', '-') }}</td>
          <td v-html="task.title"></td>
          <td>{{ task.related_project.name }}</td>
          <td>{{ task.type.name.toLocaleUpperCase('tr-TR') }}</td>
          <td :style="getPriorityRowStyle(task)">{{ task.priority.name.toLocaleUpperCase('tr-TR') }}</td>
          <td>{{ task.related_person.full_name }}</td>
          <td>{{ task.related_department.name }}</td>
          <td>{{ task.created_from.full_name }}</td>
          <td>{{ getDate(task.created_at) }} {{ getTime(task.created_at) }}</td>
          <td :style="getStatusRowStyle(task)">{{ task.status.name.toLocaleUpperCase('tr-TR') }}</td>

          <td style='background-color: white'>
            <a href="javascript:void(0);" @click="openConversations(task._id)">Detaylar</a>&nbsp;
            <a v-if="userid === task.created_from._id" href="javascript:void(0);"
              @click="editTask(task)">Düzenle</a>&nbsp;
            <a v-if="userid === task.created_from._id" href="javascript:void(0);"
              @click="deleteTask(task._id)">Sil</a>&nbsp;
            <a v-if="userid !== task.related_person._id" href="javascript:void(0);"
              @click="sentReminder(task._id)">Hatırlatma Gönder</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="modal fade" id="createEditTaskModal" tabindex="-1" role="dialog" aria-labelledby="createEditTaskModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="createEditTaskModalLabel">Yeni Talep</h5>
        </div>
        <div class="modal-body">
          <CreateEditTaskComponent :selectedTask="selectedTask"></CreateEditTaskComponent>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import CreateEditTaskComponent from "../components/tasks/CreateEditTask.vue";
import DataTable from "datatables.net-dt";
import "datatables.net-responsive-dt";
import { sent_reminder } from "../services/service";
import dayjs from "dayjs";
import "dayjs/locale/tr"; // Türkçe dil dosyası
export default {
  mounted() {

    // write to console after the 5 seconds delay
    setTimeout(() => {
      this.$store.dispatch("tasks", "0");
      this.$store.dispatch("departments");
      this.$store.dispatch("users");
      this.$store.dispatch("taskTypes");
      this.$store.dispatch("taskStatuses");
      this.$store.dispatch("taskPriorities");
      this.$store.dispatch("projects");
    }, 100);


    $(".setselect2").each(function () {
      $(this).select2({
        selectOnClose: true,
      });

      $(this).on("select2:open", function (e) {
        $(".select2-search__field").attr("placeholder", "Ara...");
      });

    });

    $("#projectSelect2").on("select2:select", (e) => {
      this.projectFilter = e.params.data.id;
      this.filter();
    });

    $("#statusSelect2").on("select2:select", (e) => {
      this.statusFilter = e.params.data.id;
      this.filter();
    });

    $("#prioritySelect2").on("select2:select", (e) => {
      this.priorityFilter = e.params.data.id;
      this.filter();
    });

    $("#typeSelect2").on("select2:select", (e) => {
      this.typeFilter = e.params.data.id;
      this.filter();
    });
  },
  computed: {
    ...mapGetters([
      "getTasks",
      "getTaskStatuses",
      "getTaskPriorities",
      "getTaskTypes",
      "getProjects",
      "getDepartments",
      "getUsers",
    ]),
  },
  watch: {
    getTasks() {
      this.$nextTick(function () {
        //clear the dataTable
        if ($.fn.DataTable.isDataTable('#task-table')) {
          $('#task-table').DataTable().clear().destroy();
        }

        setTimeout(() => {

          new DataTable('#task-table', {
            responsive: true,
            language: {
              url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Turkish.json",
            },
            autoWidth: true,
            destroy: true,
            retrieve: true,
            order: [[0, "desc"]],
          })

        }, 3000);


      });
    },
  },
  data() {
    return {
      test: false,
      userid: JSON.parse(this.$store.state.user)._id,
      tasks: [],
      selectedTask: null,
      statusFilter: "0",
      projectFilter: "0",
      priorityFilter: "0",
      typeFilter: "0",
    };
  },
  components: {
    CreateEditTaskComponent,
  },
  methods: {
    filter() {
      let filter = "";
      filter += `status=${this.statusFilter}&`;
      filter += `related_project=${this.projectFilter}&`;
      filter += `priority=${this.priorityFilter}&`;
      filter += `type=${this.typeFilter}`;

      this.$store.dispatch("tasks", filter);
    },
    sentReminder(taskId) {
      if (confirm("Hatırlatma göndermek istediğinize emin misiniz?")) {
        sent_reminder({ taskId: taskId });
      }
    },
    createTask() {
      this.selectedTask = null;
      $("#createEditTaskModal").modal("show");
    },
    editTask(task) {
      this.selectedTask = task;
      $("#createEditTaskModal").modal("show");
    },
    deleteTask(taskId) {
      if (confirm("Silmek istediğinize emin misiniz?")) {
        this.$store.dispatch("delete_task", { taskId });
      }
    },
    openConversations(taskId) {
      this.$router.push({ name: "conversations", params: { taskId } });
    },
    getDate(date) {
      return dayjs(date).locale("tr").format("DD/MM/YYYY");
    },
    getTime(date) {
      return dayjs(date).locale("tr").format("HH:mm:ss");
    },
    getFullDate(date) {
      return dayjs(date).locale("tr").format("DD/MM/YYYY HH:mm:ss");
    },
    getStatusRowStyle(task) {
      if (task.status.name === "tamamlandı") {
        return "background-color: #74ff6b";
      } else if (task.status.name === "beklemede") {
        return "background-color: #feff6b";
      } else if (task.status.name === "devam ediyor") {
        return "background-color: #6bb8ff;";
      } else if (task.status.name === "iptal edildi") {
        return "background-color: #000000; color: white";
      } else {
        return "";
      }
    },
    getPriorityRowStyle(task) {
      if (task.priority.name === "normal") {
        return "background-color: #acacac";
      } else if (task.priority.name === "yüksek") {
        return "background-color: #ffba18";
      } else if (task.priority.name === "kritik") {
        return "background-color: #e91414;";
      } else {
        return "";
      }
    },
  },
};
</script>
<style></style>
