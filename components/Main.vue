<template>
  <div id="main">
    <header>
      <h1>E-Class</h1>
      <p>An Interactive Online Classroom</p>
    </header>

    <section id="showcase">
      <div class="showcase-text">
        <h2>A new online learning experience.</h2>
        <p>
          Learn by enrolling in varieties of classrooms and engaging in a video
          conference with the help of interactive drawing board and Code Editor
          and discuss with the classroom in a group chat and get access to all
          the classroom resource materials, all in one place.
        </p>
        <nuxt-link to="/get-started/register">Get Started</nuxt-link>
        <!-- <h2>A fun learning experience.</h2>
        <p>
          Learn by enrolling in varieties of classrooms. Each classroom taught
          by the teacher in a video conference, with the help of interactive
          drawing board and Code Editor and ability to engage with the students
          in a group chat and share resources and learning materials. Teachers
          can record the live video conference and save it for later use or
          upload the video to Youtube and share it to the classroom.
        </p> -->
      </div>
    </section>

    <section id="features">
      <h2>Features</h2>
      <div class="features">
        <div class="feature">
          <h3>Whiteboard and Code Editor</h3>
          <p>
            Easily communicate with the students using a whiteboard that is
            realtime and in sync with the students and online code editor for
            many programming languages.
          </p>
        </div>

        <div class="feature">
          <h3>Live classroom and group chats</h3>
          <p>
            Chat with other members in the classroom during a live classroom
            session or just in general. Help and get help from other students or
            teacher.
          </p>
        </div>

        <div class="feature">
          <h3>All learning resources at one place</h3>
          <p>
            Resource materials and videos shared by the classroom teacher easily
            accessible in the classroom. Can also bookmark resources and videos.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
#main {
  width: 100%;
  padding: 2rem 4rem;
}

header {
  p {
    font-size: 14px;
  }
}

#showcase {
  display: flex;
  margin-top: 10rem;

  .showcase-text {
    width: 60%;

    h2 {
      font-size: 28px;
    }

    p {
      margin-top: 8px;
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    a {
      color: var(--primary-font-color);
      background-color: #1e253f;
      padding: 8px 12px;
      transition: background-color 0.2s linear;

      &:hover {
        background-color: #14192c;
      }
    }
  }
}
#features {
  margin-top: 6rem;

  h2 {
    text-align: center;
  }
  .features {
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .feature {
    padding: 1rem;
    flex: 1;

    p {
      font-size: 14px;
      margin-top: 8px;
    }
  }
}
</style>
