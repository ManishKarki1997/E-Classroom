<template>
  <div class="user-card">
    <div class="user-card--left">
      <img
        :src="apiUrl + '/uploads/images/' + userInfo.avatar"
        alt="User Profile Picture"
      />
    </div>
    <div class="user-card--right">
      <div class="user-info">
        <h3>{{ userInfo.name }}</h3>
        <p>{{ userInfo.email }}</p>
        <p class="subtitle" v-if="userInfo.isKickedOut">Kicked Out</p>
      </div>
      <div class="card--buttons" v-if="actions">
        <button
          v-if="
            (actions.includes('kickout') &&
              !userInfo.isKickedOut &&
              user.userType === 'TEACHER') ||
            'ADMIN'
          "
          @click="kickoutStudent"
        >
          Kickout
        </button>
        <button v-if="actions.includes('view')" @click="viewStudentDetails">
          View
        </button>
        <button
          v-if="actions.includes('reject')"
          @click="handlePendingRequest('reject')"
        >
          Reject
        </button>
        <button
          v-if="actions.includes('accept')"
          @click="handlePendingRequest('accept')"
        >
          Accept
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: ['userInfo', 'actions'],
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['apiUrl', 'user']),
  },
  methods: {
    handlePendingRequest(decision) {
      this.$emit('handlePendingRequest', {
        decision,
        userId: this.userInfo._id,
        classId: this.$route.params.classId,
        user: this.userInfo,
      })
    },
    kickoutStudent() {
      this.$emit('kickoutStudent', this.userInfo)
    },
    viewStudentDetails() {
      this.$emit('viewStudentDetails', this.userInfo)
    },
  },
}
</script>

<style lang="scss" scoped>
.user-card {
  display: flex;
  grid-column: span 6;
  min-height: 140px;
  max-height: 300px !important;
  border-radius: 5px;
  margin-bottom: 2rem;
  background-color: var(--primary-background-color);
  transition: all 0.3s ease-in-out;
  @include normalBoxShadow;

  &:hover {
    @include hoverBoxShadow;

    .user-card--right {
      .card--buttons {
        display: block;
      }
    }
  }

  .user-card--left {
    width: 40%;
    border-radius: 5px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .user-card--right {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .user-info {
      p {
        margin-top: 8px;
      }
    }
    .card--buttons {
      display: none;
      button {
        &:first-child {
          @include tertiaryButton;
          padding: 8px 24px;
        }

        &:nth-child(2) {
          @include primaryButton(true);
          padding: 8px 24px;

          &:hover {
            background-color: var(--button-background-hover);
          }
        }
      }
    }
  }
}
</style>
