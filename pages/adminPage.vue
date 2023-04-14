<template>
  <div class="main-admin-page">
    <v-card id="form-admin" v-if="!loggedIn">
      <div class="form-admin-div">
        <form @submit.prevent class="form-admin-container">
          <label for="email">
            <h2>Mail admin</h2>
          </label>
          <v-spacer />
          <input v-model="email" class="form-admin-input" type="text" placeholder="Votre Email" name="email" required />
          <label for="badge">
            <h2>Numéro de badge</h2>
          </label>
          <v-spacer />
          <input v-model="badge" class="form-admin-input" type="text" placeholder="numéro de badge" name="badge"
            required />
          <v-spacer />
          <label for="psw">
            <h2>Mot de passe </h2>
          </label>
          <v-spacer />
          <input v-model="psw" class="form-admin-input" type="password" placeholder="Votre mot de passe" name="psw"
            required />
          <v-spacer />
          <div class="errormsg">{{ infomsg }}</div>
          <div v-if="successreg" class="successmsg">{{ successreg }}</div>
          <button class="btn-valid-login-admin" @click="loginAdmin" type="submit">
            <h2 class="h2-form-admin">Se connecter</h2>
          </button>
        </form>
      </div>
    </v-card>

    <div v-else class="center-main">
      <v-card id="center-main-admin" v-for="(user, index) in users" :index="index">
        <nuxt-link class="link-admin" :to="{
          name: 'profilUserAdmin-id',
          params: { id: `?id=${user._id}` },
        }" title="lien vers le profil de l'utilisateur">
          <p class="link-admin-p">{{ user.firstname }} {{ user.lastname }}</p>
        </nuxt-link>
       
          <!-- <span>banni </span><span>{{ user.ban }}</span> -->
          <button v-if="user.ban === false" id="btn-ban-user" @click="
            (showBan = !showBan),
            banUserId(user._id)
          " title="bannir l'utilisateur">
            <!-- <v-icon class="ban-icon-main" size="20px">mdi-delete-circle</v-icon> -->
            Bannir
          </button>
          <button v-else id="btn-ban-user" @click="(showBan = !showBan), banUserId(user._id)"
            title="debannir l'utilisateur">
            <!-- <v-icon class="ban-icon-main" size="20px">mdi-delete-circle</v-icon> -->
            Débannir
          </button>
     
        <div class="admin-signal-profil">
          <span>Signalement de profil reçu {{ user.profilSignalBy.length }}</span>
          <div v-for="(signalProfil) in  user.profilSignalBy">
            <span>Profil signalé par :</span><span>{{ signalProfil.signalByFullname }}</span>
            <span>{{ signalProfil.date }}</span>
          </div>
        </div>
        <div class="admin-signal-post">
        <span class="admin-signal-post-span">Signalement de publication reçu {{user.postSignalBy.length}}</span>
        </div>
        <div v-for="(signal) in  user.postSignalBy">
          <!-- <div><span>ID de la publication</span><span>{{ signal.signalPostId }}</span></div>
          <div><span>signalé par l'utilisateur :</span><span>{{ signal.signalUserId }}</span></div> -->
          <!-- <div>{{ signal.date }}</div> -->
          <div>

            <v-card id="profil-post-admin" v-if="signal.signalPostId === p._id" v-for="(p, index) in posts">
            <span>Publication signalée {{ p.signalBy.length }} fois</span>
              <p class="card-profil-post-p-admin">{{ p.date }}</p>
              <div v-if="p.signalBy.length != 0" class="like-profilmain-user">
                <!-- <v-icon class="img-like-profilmain">mdi-thumb-down-outline</v-icon> -->                
              </div>
              <div class="btn-post-profil-user">
                <button class="btn-post-modify-profil" type="submit"
                  @click="showmodify = !showmodify, postIdDel(p._id)">Modifier </button>
                <button class="btn-post-delete-profil" @click="showdel = !showdel, postIdDel(p._id)">supprimer</button>
              </div>
              <div v-if='p.picture != ""' class="image-card-profil"><img class="card-img-profil" :src="p.picture"
                  alt="photo" /></div>
              <div v-if="p.message != ''" class="message-profil-user"> {{ p.message }}</div>
            </v-card>

          </div>
        </div>
      </v-card>
    </div>

    <WarningBanUser v-if="showBan" v-show="showBan" @close-modale-ban-delete="(showBan = false), getRefresh()"
      @close-modale-ban-confirm="(showBan = false), getRefresh()" />
  <deletepost v-if="showdel" v-show="showdel" @close-modale-delete="showdel = false, getRefresh()" />
  </div>
</template>

<script type="text/javascript">
import Load from "../components/Waitload.vue";
import axios from 'axios';
axios.defaults.withCredentials = true;

export default {
  name: 'admin',
  components: {
    Load,
    WarningBanUser: () =>
      import(/* webpackChunkName:"WWarningBanUser"*/ "../components/warningbanuser.vue"),
      deletepost: () => import(  /* webpackChunkName:"deletepost"*/"./index/deletetest.vue"),
  },

  data() {
    return {
      password: '',
      adminToken: '',
      loggedIn: false,
      showloader: true,
      email: "",
      psw: "",
      badge: "",
      successreg: "",
      infomsg: "",
      formfull: "",
      userid: "",
      userjwtid: '',
      users: '',
      posts: '',
      showBan: false,
      showdel: false,

    }
  },

  methods: {
    async loginAdmin() {
      await axios
        .post("http://localhost:5000/api/user/loginadmin", {
          email: this.email,
          password: this.psw,
          badge: this.badge,
        })
        .then((user) => {
          const userId = user.data.user;
          this.successreg = "Connexion reussit, Bienvenue";
          if (user.status = 200) {
            this.loggedIn = true;
            window.location.reload();
          }
          this.userid = userId;
        })
        .catch((error) => {
          alert('Mot de passe ou jeton incorrect')
          this.infomsg = error.response.data.errors;
          setTimeout(() => {
            this.infomsg = "";
          }, 3000);
        });
    },

    banUserId(id) {
      const info = {
        idban: id,
      };
      localStorage.setItem("info-ban-user", JSON.stringify(info));
    },

    getRefresh(){
     axios.get(`http://localhost:5000/api/post/postsignaladmin/${this.userjwtid}`)
        .then((res) => {
          this.posts = res.data
          console.log(res);
        });

      axios.get(`http://localhost:5000/api/user/`)
        .then((res) => {
          this.users = res.data
          console.log(res);
        });
    },
    
    postIdDel(post) {
      const parse = JSON.stringify(post);
      localStorage.setItem('categories', parse);
    },

  },


  async mounted() {
    axios.defaults.withCredentials = true;
    setTimeout(() => {
      this.showloader = false;
    }, 2500);

    await axios
      .get(`http://localhost:5000/jwtidadmin`)
      .then((res) => {
        if (res.status === 201) {
          loggedIn = false
        } else {
          this.userjwtid = res.data;
          this.loggedIn = true;

          axios.get(`http://localhost:5000/api/post/postsignaladmin/${this.userjwtid}`)
            .then((res) => {
              this.posts = res.data
            });

          axios.get(`http://localhost:5000/api/user/`)
            .then((res) => {
              this.users = res.data
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });


  },
};

</script>


<style lang="scss">
.main-admin-page {
  display: flex;
  align-items: center;
  justify-content: center;
  // width: 100vw;
  // height: 100vh;

}

#form-admin {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 30vw;
  height: 100%;
  border-radius: 20px;
  background-color: rgb(7, 66, 66);
}


.form-admin-div {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2%;
}

.form-admin-input {
  border: solid 2px $secondary;
  font-size: 1.5em;
  color: $secondary;
  width: 20vw;
  border-radius: 15px;
  padding-left: 2%;
  background-color: rgb(33, 24, 78);
}

.btn-valid-login-admin {
  height: 50px;
  padding-right: 1rem;
  padding-left: 1rem;
  border-radius: 10px;
  margin-top: 20px;
  border: solid 2px $secondary;
  background-color: rgb(120, 35, 123);

  &:hover {
    background-color: $secondary;
    color: $tertiary;
  }
}

.h2-form-admin {
  padding: 5px;
  //   background-color: rgb(120, 35, 123);
}

.center-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // width: auto;
}

#center-main-admin {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 70vw;
  margin-bottom: 1%;
  margin-top: 1%;
  border-radius: 15px;
  border: 2px solid $primary;
  padding: 2%;
}

.admin-signal-profil{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2%;
}

.admin-signal-post{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 2%;
}


#btn-ban-user {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  width: 105px;
  border: solid 2px $secondary;
  margin-top: 1%;
  margin-right: 1%;
  border-radius: 15px;
  padding-left: 2px;
  padding-right: 5px;
  // padding-bottom: 5px;
  color: $secondary;

  &:hover {
    border-radius: 10px;
    background-color: $secondary;
    color: $tertiary;

    &#btn-ban-user>.ban-icon-main {
      color: $tertiary;
    }
  }
}

#profil-post-admin{
  display: flex;
  max-width: 480px;
  max-height: 500px;
  flex-direction: column;
  margin-bottom: 2%;
  border: solid 2px;
  border-radius: 3px;
  justify-content: center;
  align-items: center;
  border: 2px solid rgb(151, 153, 160);
  border-radius: 15px;
  
}

.link-admin {
  text-decoration: none;
  color: rgb(54, 61, 67);
  margin-right: 1%;
}

.link-admin-p {
  color: aqua;
  font-size: large;
}

p.card-profil-post-p-admin {
  display: flex;
  flex-direction: row;
  margin: 0;
  padding-left: 1%;
  padding-bottom: 1%;
  // border: 2px solid $primary;
  cursor: default;
}







</style>