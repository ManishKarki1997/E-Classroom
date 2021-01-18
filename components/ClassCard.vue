<template>
  <div class="class-card">
    <div class="class-meta-info-icon-wrapper">
      <CheckIcon
        v-tooltip.top-start="{
          content: 'You\'re enrolled in the class',
          classes: ['info'],
        }"
        class="tick-icon"
        v-if="courseclass.users.indexOf(this.$store.state.user._id) > -1"
      />
      <EyeOffIcon
        v-tooltip.top-start="{
          content: 'Private Class',
          classes: ['info'],
        }"
        class="eye-off-icon"
        v-if="courseclass.private"
      />
    </div>
    <div
      class="card--left"
      :style="{
        backgroundImage: `url('${apiUrl}/uploads/images/${courseclass.backgroundImage}')`,
        objectFit: 'cover',
      }"
    >
      <div class="class-info-wrapper">
        <h3>{{ courseclass.name }}</h3>
      </div>
    </div>
    <div class="class-card--right">
      <div class="class-card-info">
        <div class="class-creator-details">
          <img
            :src="`${apiUrl}/uploads/images/${courseclass.createdBy.avatar}`"
            alt="User Avatar"
          />
          <div class="user-info">
            <h4>{{ courseclass.createdBy.name }}</h4>
            <p>{{ courseclass.createdBy.email }}</p>
          </div>
        </div>
        <p>{{ courseclass.shortInfo }}</p>
      </div>
      <div class="card--footer" v-if="showViewButton">
        <button @click="classroomClicked">View</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CheckIcon from '~/static/Icons/check.svg?inline'
import EyeOffIcon from '~/static/Icons/eye-off.svg?inline'

export default {
  props: {
    courseclass: Object,
    showViewButton: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    CheckIcon,
    EyeOffIcon,
  },
  computed: {
    ...mapGetters(['apiUrl']),
  },
  data() {
    return {}
  },
  methods: {
    classroomClicked() {
      this.$emit('classroomClicked', this.courseclass)
    },
  },
}
</script>

<style lang="scss" scoped>
.class-card {
  grid-column: span 6;
  display: flex;
  align-items: center;
  border-radius: 5px;
  height: 200px;
  max-height: 220px;
  width: 600px;
  max-width: 600px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease-in-out;
  //   box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  &:hover {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;

    .card--footer {
      button {
        opacity: 1 !important;
      }
    }
  }
  .class-meta-info-icon-wrapper {
    position: absolute;
    right: 8px;
    top: 8px;
    display: flex;
    align-items: center;

    svg {
      height: 18px;
      width: 18px;
      margin-left: 8px;
      stroke: var(--secondary-font-color) !important;
    }
  }

  .card--left {
    width: 40%;
    height: 100%;
    background-size: cover;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    &:hover {
      transform: scale(1.01);
    }
    .class-info-wrapper {
      width: 100%;
      height: 100%;
      position: absolute;
      background-color: rgba(0, 0, 0, 0.5);

      z-index: 20;
      top: 0;
      left: 0;
      padding: 1.5rem 1rem;
      h3 {
        color: white;
        letter-spacing: 2;
        line-height: 28px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }

  .class-card--right {
    background-color: rgba(0, 0, 0, 0.02);
    background-color: var(--primary-background-color);
    width: 65%;
    height: 100%;

    .class-card-info {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      color: var(--primary-font-color);
      height: 70%;
      padding: 12px;
      // height: 100%;

      .class-creator-details {
        display: flex;
        margin-bottom: 8px;
        position: relative;
        img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-right: 8px;
        }

        .user-info {
          h4 {
            margin-bottom: -10px;
          }
          // p {
          //   margin-top: -18px;
          // }
        }
      }
      p {
        margin-top: 8px;
      }
    }
    .card--footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-right: 1rem;
      button {
        @include primaryButton(true);
        opacity: 0;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
          0 4px 6px -2px rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease-in-out;
        border: none;
        // @include button(
        //   var(--button-background-color),
        //   var(--opposite-font-color)
        // );

        &:hover {
          background-color: var(--button-background-hover);
        }
      }
    }
  }
}
</style>
