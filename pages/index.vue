<template>
  <!-- <div>
    <Sidebar />
    <nuxt-child />
  </div>-->
  <div id="landing-page">
    <header>
      <h1>
        Virtual
        <span>Classroom</span>
      </h1>
      <ul>
        <li>
          <nuxt-link to="/login">Login</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/register">Register</nuxt-link>
        </li>
        <li @click="toggleTheme">
          <SunIcon v-if="preferredColorScheme==='dark'" />
          <MoonIcon v-if="preferredColorScheme==='light'" />
        </li>
      </ul>
    </header>

    <section id="landing-section">
      <h2>Online Virtual Classroom</h2>
      <p>An easier way of online learning with online video communication and classroom management facilities.</p>
      <nuxt-link to="/login">Get Started</nuxt-link>
    </section>

    <div class="app-dashboard-image-wrapper">
      <img src="/Images/virtual classroom demo.PNG" alt="App Demo Image" />
    </div>

    <div id="features">
      <div class="feature">
        <div class="feature--content">
          <h2>Classrooms</h2>
          <p>
            Public and Private classrooms for students to join and engage.
            Each classroom has a varieties of features like public chatroom, assignments, announcments, live online class etc, with more to come in the future.
          </p>
        </div>
        <div class="feature-image-wrapper">
          <img src="/Images/class card dark.PNG" alt="Class card" />
        </div>
      </div>

      <div class="feature">
        <div class="feature-image-wrapper">
          <img src="/Images/assignment.PNG" alt="Assignment card" />
        </div>
        <div class="feature--content">
          <h2>Assignments</h2>
          <p>Teachers can assign assignments and students can submit the assignments within the due date.</p>
        </div>
      </div>

      <div class="feature">
        <div class="feature--content">
          <h2>Resources Sharing</h2>
          <p>
            Teachers can upload resource files for their classroom, organize them in a folder, make them public or private.
            Students can bookmark resources into thier personal folder collection, or copy the collection as a whole.
          </p>
        </div>
        <div class="feature-image-wrapper">
          <img src="/Images/resource.png" alt="Resource card" />
        </div>
      </div>

      <div class="feature">
        <div class="feature-image-wrapper">
          <img src="/Images/announcements.PNG" alt="Announcment card" />
        </div>
        <div class="feature--content">
          <h2>Announcements</h2>
          <p>Make announcements in your classroom for something important and the students will get a announcment notification.</p>
        </div>
      </div>

      <div class="feature">
        <div class="feature--content">
          <h2>Classroom Tools</h2>
          <p>Different classroom tools like, Whiteboard, Code Editor, Chat with realtime synchronization between all online teacher and students and Live Streaming.</p>
        </div>
        <div class="feature-image-wrapper">
          <img src="/Images/class tools.PNG" alt="Class tools" />
        </div>
      </div>

      <div class="feature">
        <div class="feature-image-wrapper">
          <img src="/Images/dark mode.PNG" alt="Dark mode" />
        </div>
        <div class="feature--content">
          <h2>Dark Mode</h2>
          <p>Switch to dark mode for a better experience, especially in low light..</p>
        </div>
      </div>
    </div>

    <footer>
      <h4>Virtual Classroom</h4>
      <p>
        Made by
        <a href="https://github.com/ManishKarki1997" target="_blank">Manish Karki</a> and
        <a href="https://github.com/naix5526" target="_blank">Nishan Paudel</a>
      </p>
    </footer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SunIcon from '~/static/Icons/sun.svg?inline'
import MoonIcon from '~/static/Icons/moon.svg?inline'

export default {
  components: {
    SunIcon,
    MoonIcon,
  },
  computed: {
    ...mapState(['preferredColorScheme']),
  },
  methods: {
    toggleTheme() {
      this.$store.commit(
        'setPreferredColorScheme',
        this.preferredColorScheme === 'light' ? 'dark' : 'light'
      )
    },
  },
}
</script>

<style lang="scss" scoped>
#landing-page {
  width: 100vw;
  min-height: 100vh;
  background-color: var(--secondary-background-color);

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 4rem;

    h1 {
      font-weight: bold;
      font-size: 1.5rem;
      span {
        color: var(--accent-background-color);
      }
    }

    ul {
      display: flex;
      align-items: center;

      li {
        margin-left: 1rem;
        cursor: pointer;

        &:nth-child(2) {
          background-color: var(--accent-background-color);
          padding: 8px 16px;
          border-radius: 5px;
          transition: all 0.3s ease-in-out;

          &:hover {
            background-color: #1b69b3;
          }
          a {
            color: var(--opposite-font-color);
          }
        }
      }
    }
  }

  #landing-section {
    width: 50%;
    margin: 4rem auto 6rem auto;
    padding: 2rem;
    text-align: center;

    h2 {
      font-size: 2rem;
    }

    p {
      font-size: 1.5rem;
      color: var(--accent-background-color);
      margin: 1rem 0 2rem 0;
    }

    a {
      background-color: #3182ce;
      color: var(--opposite-font-color);
      padding: 10px 16px;
      border-radius: 5px;
      text-decoration: none;
      text-transform: uppercase;
      font-weight: bold;
      letter-spacing: 1px;
      transition: all 0.3s ease-in-out;

      &:hover {
        background-color: #1b69b3;
      }
    }
  }

  .app-dashboard-image-wrapper {
    width: 50%;
    margin: 0 auto;
    @include normalBoxShadow;
    transition: all 0.3s ease-in-out;
    border-radius: 5px;
    overflow: hidden;

    &:hover {
      @include hoverBoxShadow;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }

  #features {
    margin-top: 6rem;
    padding: 2rem 18rem;
    .feature {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6rem;

      .feature--content {
        width: 45%;

        h2 {
          font-size: 1.5rem;
        }

        p {
          font-size: 1.1rem;
          margin-top: 1rem;
          color: var(--secondary-font-color);
        }
      }

      .feature-image-wrapper {
        width: 45%;
        border-radius: 5px;
        overflow: hidden;

        @include normalBoxShadow;
        transition: all 0.3s ease-in-out;

        &:hover {
          @include hoverBoxShadow;
        }

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 4rem;
    background-color: var(--accent-background-color);
    color: var(--opposite-font-color);

    p {
      a {
        font-weight: bold;
        color: var(--opposite-font-color);
      }
    }
  }
}
</style>
