<template>
  <v-col class="overlay-delacc d-flex justify-center align-center">
    <v-card class="popup-delacc">
      <p id="first-lign-text">😭 Vous-êtes sur de vouloir partir ? 😭</p>
      <p class="warning">Vous perdrez toutes vos publications, amis et photo</p>
      <p>si tel est votre choix ...</p>

      <p class="logo-delacc">
        <img class="logo-white-delacc" src="../static/logo/logo.png" alt="logo" />La team
        SocNet
      </p>
      <p id="del-acc-con" v-if="(deleteconfirm = false)">
        <span>Compte supprimer avec succée</span>
        <span>à bientôt peut etre ☺️</span>
      </p>
      <v-btn id="btn-deco-delacc-denied" type="text" href="./"><span>Non j'ai changer d'avis</span></v-btn>
      <v-btn v-if="!showdelcon" id="btn-deco-delacc-pre" @click="showdelcon = true" type="text"><span>Supprimer mon
          compte</span></v-btn>
      <div v-else id="block-btn-confirm-delacc">
        <span id="span-btn-confirm-delacc">Veuillez confirmer la suppression de votre compte</span>
        <v-btn id="btn-deco-delacc" @click="delAccount()" type="text"><span>Confirmer la suppression</span></v-btn>
      </div>
    </v-card>
  </v-col>
</template>

<script>
import axios from "axios";

export default {
  name: "DelAcc",
  data() {
    return {
      deleteconfirm: false,
      showdelcon: false,
      posts: [],
      follow: [],
      unfollow:[],
      deletePost:[],

    };
  },
  methods: {
    async delAccount() {
    //  await this.$axios.get("/api/post")
    //     .then((docpost) => {
    //       docpost.data.forEach((elt) => {
    //         if (elt.posterId === this.userjwtid) {
    //           this.posts.push(elt._id);          
    //         }
    //       }) 
    //     })
    //     .catch((err) => {console.log(err); })
    //     .then((Post) => {
    //       this.posts.forEach((delpost) => {
    //         let id = this.userjwtid;
    //           this.$axios.delete(`/api/post/${delpost}`, {
    //             data: { id: id },
    //           })
    //             Post.data.likers.forEach((userDeleteLike) => {
    //              this.$axios.patch(
    //             `/api/post/unlike-post/${delpost}`,
    //             { id: userDeleteLike }
    //           );
    //             });
    //           }).catch((err)=>console.log(err + 'unlike vide'))
    //       }).catch((err)=>console.log(err + 'post vide'))
    //         await this.$axios.get(`/api/user/${this.userjwtid}`)
    //          .then((docs)=>{
    //           docs.data.followers.forEach((follow)=>{
    //            this.$axios.patch(`/api/user/unfollow/${follow}`, { idToUnFollow: this.userjwtid})
    //           })
    //           docs.data.following.forEach((following) => {
    //              this.$axios.patch(`/api/user/unfollow/${this.userjwtid}`, { idToUnFollow:following })
    //           });
    //           docs.data.likes.forEach((likesuser)=>{
    //             this.$axios.patch(`/api/post/unlike-post/${likesuser}`,{ id: this.userjwtid })
    //           })
    //       }).then(()=>{
          let id = this.userjwtid;
           this.$axios.delete(`/api/user/${this.userjwtid}`,{data: { idrequest: id },})
            .then(() => {
              this.deleteconfirm = true;
              setTimeout(() => {
                this.deleteconfirm = true;
                window.location.href = "./";
              }, 2000);
            })
            // })
            .catch((err) => console.log(err + 'user non supprimer'));
    },
  },

  async mounted() {
    axios.defaults.withCredentials = true;
   await this.$axios.get(`/jwtid`)
      .then((res) => {
        this.userjwtid = res.data;
        this.show = true;
        this.log = true;
        // TODO => Insert loader \\
      })
      .catch((error) => {
        console.log(error);
      });
    await this.$axios.get(`/api/user/${this.userjwtid}`)
      .then((docs) => {
        this.userid = docs.data._id;
        this.firstname = docs.data.firstname;
        this.lastname = docs.data.lastname;
        this.userpicture = docs.data.pictureprofil;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style lang="scss">
.overlay-delacc {
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

.popup-delacc {
  padding-bottom: 1%;
  padding-top: 1%;
  background-color: $secondary;
  max-width: 500px;
  min-width: 300px;
  width: 300px;
  max-height: 300px;
  min-height: 320px;
  height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.logo-delacc {
  display: flex;
}

.warning {
  text-align: center;
  font-style: italic;
  font-weight: bold;
}

.logo-white-delacc {
  display: flex;
  flex-direction: row;
  width: 30px;
  padding-right: 2%;
}

#first-lign-text {
  margin-top: 1%;
}

#btn-deco-delacc-denied {
  background-color: green;
  margin-bottom: 2%;
  width: 100%;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: greenyellow;
    color: black;
  }
}

#span-btn-confirm-delacc {
  text-align: center;
  padding-bottom: 1%;
}

#block-btn-confirm-delacc {
  text-align: center;
}

#btn-deco-delacc {
  margin-top: 1%;
  background-color: rgb(93, 18, 27);
  width: 100%;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: $tertiary;
    color: $primary;
  }
}

#btn-deco-delacc-pre {
  background-color: $primary;
  width: 100%;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: $tertiary;
    color: $primary;
  }
}

p#del-acc-con {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-left: 2%;
}
</style>
