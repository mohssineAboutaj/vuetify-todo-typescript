<template>
  <v-app>
    <navbar-component :title="title"></navbar-component>

    <v-main class="bg">
      <v-container fill-height>
        <v-card class="mx-auto elevation-10" style="max-width: 500px">
          <v-card-text>
            <v-textarea
              rows="1"
              auto-grow
              v-model="newTask"
              placeholder="What are you working on?"
              filled
              append-icon="mdi-plus-circle"
              @click:append="createTask()"
              @keypress.enter="createTask()"
            ></v-textarea>
          </v-card-text>

          <v-card-title>
            <v-row class="my-1" justify="space-around">
              <span
                v-for="(item, inf) in infoList"
                :key="inf"
                class="mx-4 primary--text text--darken-2 text-capitalize"
              >
                {{ item.label }}: <strong>{{ item.value }}</strong>
              </span>
            </v-row>

            <v-divider class="mb-4"></v-divider>

            <v-progress-linear
              height="20"
              :value="progress"
              :class="tasks.length === 0 ? 'd-none' : ''"
            ></v-progress-linear>
          </v-card-title>

          <v-card-text v-if="tasks.length > 0">
            <v-list dense>
              <v-list-item class="text-capitalize">
                <v-list-item-avatar class="mx-0">
                  <v-checkbox v-model="checkAll"></v-checkbox>
                </v-list-item-avatar>
                <v-list-item-title>make all completed</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-card-text v-if="tasks.length > 0">
            <v-list>
              <v-slide-y-transition class="py-0" group tag="v-list">
                <v-list-item v-for="task in tasks" :key="task.id">
                  <v-list-item-avatar class="mx-0">
                    <v-checkbox
                      v-model="task.done"
                      :color="(task.done && 'grey') || 'primary'"
                    ></v-checkbox>
                  </v-list-item-avatar>
                  <v-list-item-content
                    :class="task.done ? 'text-decoration-line-through' : ''"
                  >
                    {{ task.text }}
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-row>
                      <v-col>
                        <v-scroll-x-transition>
                          <v-icon v-if="task.done" color="success">
                            mdi-check
                          </v-icon>
                        </v-scroll-x-transition>
                      </v-col>
                      <v-col>
                        <v-btn
                          fab
                          x-small
                          color="warning"
                          @click="editTask(task)"
                        >
                          <v-icon x-small>mdi-pencil</v-icon>
                        </v-btn>
                      </v-col>
                      <v-col>
                        <v-btn
                          fab
                          x-small
                          color="error"
                          @click="deleteTask(task)"
                        >
                          <v-icon x-small>mdi-delete</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-list-item-action>
                </v-list-item>
              </v-slide-y-transition>
            </v-list>
          </v-card-text>
        </v-card>
      </v-container>

      <!-- edit dialog -->
      <v-dialog v-model="editDialog" persistent max-width="290">
        <v-card class="text-capitalize">
          <v-card-title class="headline primary">
            <span>edit task</span>
            <v-spacer></v-spacer>
            <v-icon @click="closeDialog()">mdi-close</v-icon>
          </v-card-title>
          <v-card-text>
            <v-text-field
              class="mt-10"
              v-model="taskToEdit.text"
              :error-messages="taskToEdit.text ? '' : 'required'"
              filled
            ></v-text-field>
          </v-card-text>
          <v-card-actions class="justify-space-between">
            <v-btn
              v-for="(btn, b) in dialogActions"
              :key="b"
              :color="btn.color"
              @click="btn.cb()"
              rounded
              :disabled="!taskToEdit.text"
            >
              {{ btn.label }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- delete dialog -->
      <v-dialog v-model="deleteDialog" persistent max-width="290">
        <v-card class="text-capitalize">
          <v-card-title class="headline">delete task</v-card-title>
          <v-card-text>are you sure you want to delete the task?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" outlined @click="deleteDialog = false" rounded>
              cancel
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="confirmDeleteTask()" rounded>
              delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator"
import { DialogActions, Info, Task } from "./types"
import NavbarComponent from "./components/navbar.component.vue"

@Component({
  components: { NavbarComponent },
})
export default class App extends Vue {
  // data
  title = "Vuetify Todo Typescript"
  tasks: Task[] = [
    {
      id: "da9cc5b4-3646-4ee1-a2a9-f88ff9c9e877",
      done: false,
      text: "Foobar",
    },
    {
      id: "ee7d532d-0b76-405b-ac5b-13c4fa756e1f",
      done: false,
      text: "Fizzbuzz",
    },
  ]
  taskToEdit: Task = {}
  taskToDelete: Task = {}
  newTask = ""
  checkAll = false
  editDialog = false
  deleteDialog = false

  // computed
  get infoList(): Info[] {
    return [
      { label: "total", value: this.tasks.length },
      { label: "remaining", value: this.remainingTasks },
      { label: "completed", value: this.completedTasks },
    ]
  }
  get completedTasks(): number {
    return this.tasks.filter((task) => task.done).length
  }
  get progress(): number {
    return (this.completedTasks / this.tasks.length) * 100
  }
  get remainingTasks(): number {
    return this.tasks.length - this.completedTasks
  }
  get dialogActions(): DialogActions[] {
    return [
      {
        label: "cancel",
        color: "error",
        cb: () => {
          this.closeDialog()
        },
        disabled: false,
      },
      {
        label: "update",
        color: "success",
        cb: () => {
          this.updateTask()
        },
        disabled: this.taskToEdit.text === "",
      },
    ]
  }

  // methods
  /// helpers
  uuidv4(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }
  /// tasks CRUD
  createTask(): void {
    if (this.newTask) {
      this.tasks.push({
        id: this.uuidv4(),
        done: false,
        text: this.newTask,
      })

      this.newTask = ""
    }
  }
  editTask(task: Task): void {
    this.editDialog = true
    this.taskToEdit = task
  }
  updateTask(): void {
    if (this.taskToEdit.text) {
      this.tasks.forEach((t: Task): void => {
        if (t.id === this.taskToEdit.id) {
          t.text = this.taskToEdit.text
        }
      })
      this.closeDialog()
    }
  }
  deleteTask(task: Task): void {
    this.deleteDialog = true
    this.taskToDelete = task
  }
  confirmDeleteTask(): void {
    this.deleteDialog = false
    this.tasks = this.tasks.filter((t) => t.id !== this.taskToDelete.id)
  }
  /// dialog/modal
  closeDialog(): void {
    this.editDialog = false
    this.taskToEdit = {}
  }

  // watch
  @Watch("checkAll") toggleTasks(v: boolean): void {
    this.tasks.forEach((t) => (t.done = v))
  }
}
</script>
