<template>
  <div id="user-profile-page">
    <div class="user-profile-wrapper">
      <img
        :src="apiUrl + '/uploads/images/' + user.avatar"
        alt="user avatar"
        @click="openFileDialogue"
      />
      <input style="display:none;" @change="onFileChanged" type="file" id="avatar" name="avatar" />

      <div class="user-info">
        <h2>{{user.name}}</h2>
        <p>{{user.email}}</p>

        <div class="user-meta-info" v-if="userType !== 'ADMIN'">
          <div class="meta-info">
            <h2>{{userType==='TEACHER' ? user.createdClasses.length : user.joinedClasses.length}}</h2>
            <p>{{userType==='TEACHER' ? 'Classes Teaching' : 'Enrolled Classes'}}</p>
          </div>
        </div>

        <div class="update-profile-button-wrapper">
          <button
            @click="editProfileMode=!editProfileMode"
          >{{editProfileMode ? 'Cancel' : 'Update'}}</button>
        </div>
      </div>
    </div>

    <div class="update-profile--wrapper" v-if="editProfileMode">
      <h4>Update Profile</h4>
      <div class="edit-profile-wrapper">
        <form @submit.prevent="updateProfile">
          <div class="form-input">
            <label for="name">Name</label>
            <input v-model="userProfile.name" type="text" name="name" id="name" />
          </div>
          <div class="form-input">
            <label for="email">Email</label>
            <input v-model="userProfile.email" type="email" name="email" id="email" />
          </div>

          <div class="form-button">
            <button :disabled="loading" type="submit">Update</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      editProfileMode: false,
      loading: false,
      userProfile: {
        name: '',
        email: '',
      },
      userAvatarInput: null,
      newUserAvatar: null,
    }
  },
  computed: {
    ...mapGetters(['apiUrl', 'user']),
    userType() {
      return this.user.userType
    },
  },
  methods: {
    updateProfile() {
      this.$store.dispatch('updateProfile', {
        ...this.userProfile,
        originalEmail: this.user.email,
      })
      this.editProfileMode = false
    },
    openFileDialogue() {
      this.userAvatarInput.click()
    },
    onFileChanged(e) {
      this.newUserAvatar = e.target.files[0]
      this.updateUserAvatar()
    },
    async updateUserAvatar() {
      if (this.newUserAvatar) {
        let formData = new FormData()
        formData.append('image', this.newUserAvatar)

        this.$store.dispatch('updateUserAvatar', formData)
      }
    },
  },
  mounted() {
    this.userProfile = { ...this.user }
    this.userAvatarInput = document.getElementById('avatar')
  },
}
</script>

<style lang="scss" scoped>
#user-profile-page {
  display: flex;
  justify-content: space-between;
  min-height: 100vh;
  width: 100%;
  background-color: var(--secondary-background-color);

  .user-profile-wrapper {
    width: 40%;

    img {
      width: 100%;
      height: 300px;
      border-radius: 5px;
      cursor: pointer;
    }

    .user-info {
      padding: 1rem;
      border-radius: 0 5px 5px 0;
      overflow: hidden;

      .user-meta-info {
        display: flex;
        align-items: center;
        .meta-info {
          margin-top: 2rem;
        }
      }

      .update-profile-button-wrapper {
        margin-top: 2rem;
        button {
          @include primaryButton;
        }
      }
    }
  }
  .update-profile--wrapper {
    width: 50%;
    padding: 1rem;
    max-height: 60vh;

    .edit-profile-wrapper {
      .form-button {
        button {
          @include primaryButton;
        }
      }
    }
  }
}
</style>