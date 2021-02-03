<template>
  <div id="admin-users-page">
    <div class="users-header-wrapper">
      <h3>Users</h3>
      <div class="form-input">
        <input
          placeholder="Search users"
          type="text"
          name="searchUser"
          id="searchUser"
          v-model="userSearchQuery"
        />
      </div>
    </div>
    <div class="users-filters-wrapper">
      <div class="users-filter-buttons-wrapper">
        <button
          @click="activeTab = 'allUsers'"
          :class="{ activeTab: activeTab === 'allUsers' }"
        >
          All
        </button>
        <button
          @click="activeTab = 'kickedOut'"
          :class="{ activeTab: activeTab === 'kickedOut' }"
        >
          Kicked Out
        </button>
      </div>
      <div class="users-view-icons">
        <div class="icon-wrapper">
          <GridIcon
            @click="active = 'grid'"
            :class="{ active: active === 'grid' }"
          />
        </div>
        <div class="icon-wrapper">
          <TableIcon
            @click="active = 'table'"
            :class="{ active: active === 'table' }"
          />
        </div>
      </div>
    </div>
    <div v-if="allUsers && allUsers.length == 0">
      <p>No users</p>
    </div>
    <div v-if="active === 'grid'">
      <transition-group class="users" tag="div" name="slide-fade">
        <UserCard
          v-for="user in filteredUsers"
          :key="user._id"
          :userInfo="user"
          :actions="['kickout']"
          @kickoutStudent="handleKickoutUser(user)"
        />
      </transition-group>
    </div>

    <div v-else-if="active === 'table'" class="user-table-view-wrapper">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Joined On</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr
            :class="{ disabled: user.isKickedOut == true }"
            v-for="user in filteredUsers"
            :key="user._id"
          >
            <td class="table-user-name">
              <img :src="apiUrl + '/uploads/images/' + user.avatar" />
              {{ user.name }}
            </td>
            <td>{{ user.email }}</td>
            <td>{{ user.createdAt | formatDate }}</td>
            <td class="delete-user-icon">
              <XCircleIcon
                v-if="!user.isKickedOut"
                @click="handleKickoutUser(user)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal
      v-if="showKickoutReasonModal"
      @closeModal="showKickoutReasonModal = false"
    >
      <template slot="header">Kickout User</template>
      <template slot="body">
        <form @submit.prevent="kickoutUser">
          <div class="form-input">
            <label for="kickoutReason">Kickout Reason</label>
            <input
              type="text"
              name="kickoutReason"
              id="kickoutReason"
              v-model="kickoutReason"
            />
          </div>
        </form>
      </template>

      <template slot="footer">
        <button type="submit" @click="kickoutUser">Kickout</button>
        <button @click="showKickoutReasonModal = false">Cancel</button>
      </template>
    </Modal>

    <v-dialog />
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
import Modal from '~/components/Modal'

import UserCard from '~/components/UserCard'
import GridIcon from '~/static/Icons/grid.svg?inline'
import TableIcon from '~/static/Icons/align-justify.svg?inline'
import XCircleIcon from '~/static/Icons/x-circle.svg?inline'

export default {
  components: {
    UserCard,
    Modal,
    GridIcon,
    TableIcon,
    XCircleIcon,
  },
  data() {
    return {
      allUsers: null,
      userSearchQuery: '',
      active: 'grid',
      activeTab: 'allUsers',
      showKickoutReasonModal: false,
      kickoutReason: '',
      toBeKickedOutUserDetail: null,
    }
  },
  computed: {
    ...mapGetters(['apiUrl']),
    filteredUsers() {
      // if (!this.userSearchQuery) return this.allUsers

      if (!this.userSearchQuery && this.activeTab === 'allUsers') {
        return this.allUsers
      } else if (!this.userSearchQuery && this.activeTab === 'kickedOut') {
        const users = this.allUsers
          .filter((userInfo) => userInfo.isKickedOut)
          .filter(
            (user) =>
              user.name
                .toLowerCase()
                .includes(this.userSearchQuery.toLowerCase()) ||
              user.email
                .toLowerCase()
                .includes(this.userSearchQuery.toLowerCase())
          )
        return this.allUsers
          .filter((userInfo) => userInfo.isKickedOut)
          .filter(
            (user) =>
              user.name
                .toLowerCase()
                .includes(this.userSearchQuery.toLowerCase()) ||
              user.email
                .toLowerCase()
                .includes(this.userSearchQuery.toLowerCase())
          )
      } else {
        return this.allUsers.filter(
          (user) =>
            user.name
              .toLowerCase()
              .includes(this.userSearchQuery.toLowerCase()) ||
            user.email
              .toLowerCase()
              .includes(this.userSearchQuery.toLowerCase())
        )
      }
    },
  },
  methods: {
    async kickoutUser() {
      this.$store.dispatch('kickoutUser', {
        kickoutReason: this.kickoutReason,
        userId: this.toBeKickedOutUserDetail._id,
      })
      this.showKickoutReasonModal = false
      this.toBeKickedOutUserDetail = null
    },
    handleKickoutUser(userDetails) {
      this.toBeKickedOutUserDetail = userDetails
      this.$modal.show('dialog', {
        title: 'Kickout User?',
        text: 'Are you sure you want to kickout the user?',
        buttons: [
          {
            title: 'Cancel',
            handler: () => {
              this.$modal.hide('dialog')
              this.toBeKickedOutUserDetail = null
            },
          },

          {
            title: 'Yes',
            handler: () => {
              this.showKickoutReasonModal = true
              this.$modal.hide('dialog')
            },
          },
        ],
      })
    },
    async getAllUsersForAdmin() {
      const res = await this.$store.dispatch('getAllUsersForAdmin')
      this.allUsers = res.data.payload.users
    },
  },
  mounted() {
    this.getAllUsersForAdmin()
  },
  filters: {
    formatDate(value) {
      return dayjs(value).format('MMMM DD, YYYY')
    },
  },
}
</script>

<style lang="scss" scoped>
#admin-users-page {
  .users-header-wrapper {
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .form-input {
      max-width: 60%;

      input {
        width: 100%;
        background-color: var(--primary-background-color);
      }
    }
  }

  .users-filters-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .users-filter-buttons-wrapper {
      display: flex;

      button {
        @include tertiaryButton;
        margin-left: 1rem;

        &.activeTab {
          color: var(--accent-background-color);
        }
      }
    }

    .users-view-icons {
      margin-left: 4rem;
      margin-right: 8px;
      display: flex;
      align-items: center;

      .icon-wrapper {
        margin-left: 1rem;

        svg {
          cursor: pointer;
          &.active {
            stroke: var(--accent-background-color);
          }
        }
      }
    }
  }

  .users {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-auto-rows: 40px;
    grid-gap: 2rem;
    margin-top: 3rem;

    .user-card {
      grid-column: span 4;
      grid-row: span 3;
    }
  }

  .user-table-view-wrapper {
    table {
      width: 100%;
      border-spacing: 0 1em;

      tr {
        text-align: left;
      }
      td,
      th {
        padding: 8px;
        padding: 16px;
      }

      tr {
        background-color: var(--secondary-background-color);
        border-radius: 5px;
        transition: all 0.3s ease-in-out;
        margin-bottom: 1rem;
        &:hover {
          background-color: var(--primary-background-color);
          @include normalBoxShadow;
        }
      }

      thead {
        tr {
          &:hover {
            background-color: transparent;
            box-shadow: none;
          }
        }
      }

      tbody {
        tr {
          &.disabled {
            color: var(--secondary-font-color);
          }
          &:hover {
            td.delete-user-icon {
              svg {
                display: block;
              }
            }
          }
        }
        td {
          &.table-user-name {
            display: flex;
            align-items: center;
            img {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              margin-right: 8px;
            }
          }

          &.delete-user-icon {
            svg {
              display: none;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>
