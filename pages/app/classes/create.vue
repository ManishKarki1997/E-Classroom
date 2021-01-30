<template>
  <div id="create-class">
    <!-- <div class="create-class-left-wrapper">
      <h2>Virtual Classroom</h2>
      <DreamerIcon />
    </div> -->
    <div class="create-class-right-wrapper">
      <h3>Create a Class</h3>

      <div class="form-wrapper">
        <form @submit.prevent="createClass">
          <div class="form-input">
            <label for="className">Name</label>
            <input
              v-model="newClass.name"
              type="text"
              name="className"
              id="className"
            />
          </div>
          <div class="form-input">
            <label for="classBackgroundImage">Image</label>
            <input
              @change="onFileChanged"
              type="file"
              accept="image/*"
              name="classBackgroundImage"
              id="classBackgroundImage"
            />
          </div>
          <div class="form-input">
            <label for="classShortInfo">Short Info</label>
            <input
              v-model="newClass.shortInfo"
              type="text"
              name="shortInfo"
              id="shortInfo"
            />
          </div>
          <div class="form-input">
            <label for="classroomDescription">Description</label>
            <textarea
              rows="6"
              v-model="newClass.description"
              type="text"
              name="classroomDescription"
              id="classroomDescription"
            ></textarea>
          </div>
          <div class="classroom-timeschedule">
            <label for="classTimeSchedule">Class Schedule</label>
            <div class="time-wrappers">
              <input
                type="time"
                name="startTime"
                id="startTime"
                v-model="newClass.startTime"
              />
              <input
                type="time"
                name="endTime"
                id="endTime"
                v-model="newClass.endTime"
              />
            </div>
            <!-- <vue-timepicker v-model="newClass.startTime" format="hh:mm A"></vue-timepicker>
            <vue-timepicker v-model="newClass.endTime" format="hh:mm A"></vue-timepicker>-->
          </div>

          <div class="buttons-wrapper">
            <button type="submit" :disabled="formSubmitting">Create</button>
            <button :disabled="formSubmitting" @click="cancelCreateClass">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import DreamerIcon from '~/static/Images/dreamer.svg?inline'

export default {
  components: {
    DreamerIcon,
  },
  data() {
    return {
      newClass: {
        name: '',
        description: '',
        createdBy: '',
        shortInfo: '',
        startTime: '',
        endTime: '',
      },
      formSubmitting: false,
      classBackgroundImage: null,
    }
  },
  methods: {
    onFileChanged(e) {
      this.classBackgroundImage = e.target.files[0]
    },
    cancelCreateClass() {
      this.$router.go(-1)
    },
    async createClass() {
      this.formSubmitting = true
      if (
        this.newClass.name === '' ||
        this.newClass.description === '' ||
        this.newClass.shortInfo === ''
      ) {
        this.$toast.open({
          type: 'error',
          message: 'Please fill all the fields first.',
          position: 'top-right',
          duration: 1500,
        })
        return false
      } else if (
        this.newClass.startTime === '' ||
        this.newClass.endTime === ''
      ) {
        return this.$toast.open({
          type: 'error',
          message: 'Please specify start and end time of the class.',
          position: 'top-right',
          duration: false,
        })
      }

      this.newClass.createdBy = this.$store.state.user.email

      let formData = new FormData()
      formData.append('name', this.newClass.name)
      formData.append('shortInfo', this.newClass.shortInfo)
      formData.append('createdBy', this.$store.state.user._id)
      formData.append('description', this.newClass.description)
      formData.append('image', this.classBackgroundImage)
      formData.append('startTime', this.newClass.startTime)
      formData.append('endTime', this.newClass.endTime)

      this.$store.dispatch('createNewClass', formData)
      //   this.$router.go(-1)
      this.formSubmitting = false
    },
  },
}
</script>

<style lang="scss" scoped>
#create-class {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  background-color: var(--secondary-background-color);

  .create-class-left-wrapper {
    width: 50%;
    padding: 2rem;

    h2 {
      text-align: center;
      margin-bottom: 2rem;
    }
    svg {
      width: 100%;
      height: auto;
    }
  }

  .create-class-right-wrapper {
    width: 60%;
    margin: 0 auto;
    background-color: var(--primary-background-color);
    height: 100%;
    padding: 3rem 4rem;
    /* border-left: 1px solid var(--primary-border-color); */
    @include normalBoxShadow;

    &:hover {
      @include hoverBoxShadow;
    }

    .form-wrapper {
      //   padding: 3rem;
      border-radius: 5px;
      width: 100%;
      height: 100%;
      //   box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px,
      //     rgba(9, 30, 66, 0.31) 0px 0px 1px;

      form {
        width: 100%;

        #classroomDescription {
          padding: 8px;
          font-size: 1.1rem;
          background-color: var(--primary-background-color);
          color: var(--primary-font-color);
        }

        .classroom-timeschedule {
          display: flex;
          flex-direction: column;
          margin-left: 8px;

          .time-wrappers {
            margin-top: 8px;
            margin-bottom: 8px;

            input[type='time'] {
              margin-right: 8px;
              padding: 8px;
            }
          }
        }

        .buttons-wrapper {
          margin-left: 8px;
          margin-top: 8px;

          button {
            &:first-child {
              @include primaryButton;
            }

            &:nth-child(2) {
              @include secondaryButton;
            }
          }
        }
      }
    }
  }
}
</style>
