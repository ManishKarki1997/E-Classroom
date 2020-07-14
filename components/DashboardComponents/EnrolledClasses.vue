<template>
  <div id="enrolled-classes-wrapper">
    <h4 class="section-title">Enrolled Classes</h4>
    <ul v-if="!isLoading" class="enrolled-classes">
      <li class="enrolled-class" v-for="enrolledClass in enrolledClasses" :key="enrolledClass._id">
        <img
          :src="
            apiStaticUrl + '/uploads/images/' + enrolledClass.backgroundImage
          "
          alt="Class Image"
        />
        <div class="class-info">
          <h5>{{ enrolledClass.name }}</h5>
          <p>{{ enrolledClass.createdBy.name }}</p>
        </div>
      </li>
    </ul>
    <div class="spinner-wrapper" v-else>
      <Spinner />
    </div>
    <p
      v-if="enrolledClasses.length == 0"
      style="font-size:14px; margin-top:-12px;"
    >Currently not enrolled in any class.</p>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner'

export default {
  components: {
    Spinner
  },
  data() {
    return {
      enrolledClasses: [],
      apiStaticUrl: '',
      isLoading: true
    }
  },
  methods: {
    async fetchEnrolledClasses() {
      const res = await this.$store.dispatch('fetchUserClasses')
      if (res.data.error) {
        this.$toast.open({
          type: 'error',
          message: res.data.message,
          position: 'top-right',
          duration: 1500
        })
        return false
      } else {
        this.enrolledClasses = res.data.payload.joinedClasses
      }
      this.isLoading = false
    }
  },
  mounted() {
    this.fetchEnrolledClasses()
    this.apiStaticUrl = process.env.baseUrl
  }
}
</script>

<style lang="scss" scoped>
.spinner-wrapper {
  width: 100%;
  height: 100%;

  .spinner {
    margin-left: 4rem;
    margin-top: 4rem;
  }
}
#enrolled-classes-wrapper {
  background-color: var(--secondary-background-color);
}
.enrolled-classes {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
}
.enrolled-class {
  display: flex;
  margin-bottom: 20px;
  cursor: pointer;
  overflow-y: auto;

  img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    margin-right: 12px;
  }

  .class-info {
    &:hover h5 {
      filter: opacity(0.8);
    }
    h5 {
      font-weight: 500;
      transition: all 0.3s ease-in-out;
    }
    p {
      font-size: 13px;
      margin-top: -4px;
      color: rgb(173, 172, 172);
    }
  }
}
</style>
