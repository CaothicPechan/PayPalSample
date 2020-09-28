<template lang="pug">
    v-app#paypal-app
      router-view

</template>

<script>
import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',

  components: {
    HelloWorld,
  },

  data: () => ({
    //
  }),
};
</script>

<style scoped>
#paypal-app{
  display: fixed;
  background-color: #d4d4d4 !important;
}

</style>