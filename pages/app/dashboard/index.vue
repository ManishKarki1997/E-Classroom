<template>
  <div id="dashboard">
    <form class="search-classes">
      <input type="text" name="search" id="search" />
      <input type="submit" value="Search" />
    </form>
    <ClassCard />
  </div>
</template>

<script>
import ClassCard from '~/components/ClassCard'

export default {
  components: {
    ClassCard
  }
}
</script>
