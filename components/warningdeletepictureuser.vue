<template>
  <div class="overlay-delete">
    <v-col class=" d-flex  justify-center align-center">
      <v-card class="popup-del-com ">
        <p class="logo-disconnect-delete"><img class="logo-white" src="../static/logo/logo.png" alt="logo" />
          <span>La team SocNet</span>
        </p>
        <p id="span-del-post"> ⚠️ Vous-êtes sur le point d'effacer votre photo de profil ⚠️ </p>
        <v-btn id="btn-notdelete-comfirm" @click="$emit('close-modale-delpicuser')"><span>Retour</span></v-btn>
        <p class="comfirm-span-delete">si tel est votre choix ...</p>
        <v-btn @click="$emit('close-modale-delpicuser-confirm')" id="btn-delete-comfirm"><span>Continuer</span></v-btn>
      </v-card>
    </v-col>
  </div>
</template>
    
    
<script>

export default {


  data() {
    return {


    }
  },
  methods: {


  }
}


</script>
    
<style lang="scss">
.overlay-delete {

  width: 100%;
  top: 0px;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  visibility: visible;
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.7);
  transition: opacity 0.4s;
  z-index: 1000;
}

;

.popup-del-com {
  padding-bottom: 1%;
  padding-top: 1%;
  background-color: $secondary;
  margin-top: 250px;
  width: 320px;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.logo-disconnect-delete {
  display: flex;
  flex-direction: row;
}

.popup {
  padding-bottom: 1%;
  padding-top: 1%;
  background-color: $secondary;
  max-width: 350px;
  min-width: 350px;
  width: 350px;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#span-del-post {
  text-align: center;
}

.comfirm-span-delete {

  padding-top: 3%;
}

#btn-notdelete-comfirm {
  background-color: $secondary;
  width: 100%;
  justify-content: center;
  align-items: center;
  color: green;

  &:hover {
    background-color: green;
    color: $secondary;
  }
}

#btn-delete-comfirm {
  color: red;
  background-color: $secondary;
  width: 100%;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: $primary;
    color: $secondary;
  }
}
</style>
    