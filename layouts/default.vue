<template>
  <v-app dark>
    <div>
      <Waitload v-show="showloader" @close-modale-loader="showloader = false" @open-modale-loader="true" />
      <SignIn id="modal-signin" v-show="show" @close-modale="show = false" />
    </div>


    <v-app-bar :clipped-left="clipped" fixed app>


      <router-link id="btn-post-router" to="/" title="page des publications">

        <v-icon>mdi-newspaper-variant-multiple-outline</v-icon>

      </router-link>

      <router-link class="btn-post-router-plus" to="/postpage" title="page du chat">

        <v-icon>mdi-chat </v-icon>

      </router-link>

      <router-link v-if="this.role != undefined" id="btn-post-router" to="/adminPage" title="page admin">

        <v-icon>mdi-shield-crown</v-icon>

      </router-link>

      <v-spacer />
      <router-link id="router-main" to="/" title="page des publications">
        <img class="logo-white" src="../static/logo/logo.png" to="/" alt="logo" />
        <v-toolbar-title v-text="title" id="temp-title" alt="logo" />
      </router-link>
      <v-spacer />
      <v-btn @click.stop="rightDrawer = !rightDrawer" id="temp-user" title="Votre profil">
        <img v-if="urlpic !== '' && urlpic !== undefined" class="avatar" :src="urlpic" alt="photo de l'utilisateur" />
        <div v-else id="avatar-empty">{{ avatarpicempty }}</div>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt :key="componentKey" />
      </v-container>
    </v-main>

    <v-navigation-drawer class="drawer-right" v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item v-for="(item, v) in itemsuser" :key="v" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon> {{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer :absolute="!fixed" app>
      <span>&copy; socialNetwork res dev by scud </span>
    </v-footer>
  </v-app>
</template>

<script>
import axios from "axios";
import SignIn from "../components/sign-inwithoutbadge.vue";
import Waitload from "../components/Waitload.vue";


export default {
  components: {
    SignIn,
    Waitload,
  },
  name: "DefaultLayout",

  methods: {

    getcolor() {
      // console.log("get" + this.avatarpicempty);
      this.avatarpicempty = this.firstname.split("")[0].toLocaleUpperCase();
    },
  },

  computed: {},

  data() {
    return {
      showloader: true,
      show: false,
      urlbtn: "",
      postbtn: false,
      componentKey: 0,
      firstname: "",
      avatarpicempty: "",
      userjwtid: "",
      urlpic: "",
      id: "",
      role: "",
      right: true,
      drawer: false,
      miniVariant: false,
      rightDrawer: false,
      clipped: false,
      fixed: false,
      log: false,
      showbtn: true,
      hoverbtn: false,
      itemsuser: [
        {
          icon: "mdi-account",
          title: "Mon profil",
          to: "/profiluser",
        },
        {
          icon: "mdi-chart-bubble",
          title: "Mes publications",
          to: "/profiluser",
        },
        {
          icon: " mdi-account-group  ",
          title: "Mes amis",
          to: "/profiluser",
        },
        {
          icon: " mdi-logout ",
          title: "Déconnexion",
          to: "/disconnect",
        },
        {
          icon: "mdi-delete-circle",
          title: "Supprimer mon compte",
          to: "/deleteaccount",
        },
      ],
      items: [
      ],

      title: "Soc-Net",
    };
  },

  async mounted() {
    await this.$axios
      .get(`/jwtid`)
      // await axios
      //   .get(`https://lesiteduscudo.com/soc/backend/jwtid`)
      .then((res) => {
        if (res.data == "notoken") {
          console.log(res);
          this.showloader = true;
          this.show = true;
        } else {
          this.userjwtid = res.data;
          setTimeout(() => {
            this.showloader = false;
          }, 1500);

          this.$axios
            .get(`/api/user/${this.userjwtid}`)
            // axios
            //   .get(`https://lesiteduscudo.com/soc/backend/api/user/${this.userjwtid}`)
            .then((data) => {
              this.firstname = data.data.firstname;
              this.urlpic = data.data.photo;
              this.id = data.data.id;
              this.role = data.data.role;
              this.getcolor();
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>
<style lang="scss">
html {
  font-family: "Lato";
}


.v-toolbar__content {
  background-color: $primary;
}

.avatar {
  display: flex;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  border: solid 2px $secondary;
  border-radius: 50%;
  background-color: $tertiary;
  padding-left: 1%;
}

#avatar-empty {
  display: flex;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  border: solid 2px $secondary;
  border-radius: 50%;
  font-size: 1.7rem;
  padding-left: 1%;
  padding-bottom: 2%;
  color: bisque;
  background-color: rgb(89, 165, 35);
}

.username {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0;
  padding-left: 2%;
}

#temp-user {
  display: flex;
  background-color: $tertiary;
  height: 50px;
  width: auto;
  border: solid $secondary;
  color: $secondary;
  border-radius: 15px;

  &:hover {
    background-color: $secondary;
    border: solid $tertiary;
    color: black;
    border-radius: 20%;
  }
}

#temp-menu {
  background-color: $tertiary;
  height: 35px;
  width: auto;
  border: solid $secondary;
  color: $secondary;
  border-radius: 30%;

  &:hover {
    background-color: $secondary;
    border: solid $tertiary;
    color: black;
    border-radius: 20%;
  }
}

a#btn-post-router {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  margin-left: 1%;
  background-color: $tertiary;
  width: 50px;
  height: 45px;
  border: solid $secondary;
  color: $secondary;
  border-radius: 30%;

  &:hover {
    background-color: $secondary;
    border: solid $tertiary;
    color: $tertiary;
    border-radius: 20%;

    &#btn-post-router>i {
      color: $tertiary;
    }
  }
}

a#btn-post-router.nuxt-link-exact-active {
  background-color: $secondary;
  border: solid $tertiary;
  color: $tertiary;
  border-radius: 30%;

  &#btn-post-router>i {
    color: $tertiary;
  }

  &:hover {
    border-radius: 20%;
  }
}

a.btn-post-router-plus.nuxt-link-exact-active {
  background-color: $secondary;
  border: solid $tertiary;
  color: $tertiary;
  border-radius: 30%;

  &.btn-post-router-plus>i {
    color: $tertiary;
  }
}

a.btn-post-router-plus {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  margin-left: 1%;
  background-color: $tertiary;
  height: 45px;
  width: 50px;
  border: solid $secondary;
  color: $secondary;
  border-radius: 30%;

  &:hover {
    background-color: $secondary;
    border: solid $tertiary;
    color: $tertiary;
    border-radius: 20%;

    &.btn-post-router-plus>i {
      color: $tertiary;
    }
  }
}

#temp-title {
  font-family: Lato, sans-serif;
  font-size: 35px;
  letter-spacing: 2px;
  animation: textAnimated 30s linear infinite reverse;

  @keyframes textAnimated {
    0% {
      background: linear-gradient(70deg,
          darken($primary, 10%),
          $tertiary,
          $secondary );
      background-position: -16em 0;
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
    }

    50% {
      background: linear-gradient(85deg,
          darken($primary, 10%),
          $tertiary,
          $secondary );
      background-position: 0 0;
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
    }

    100% {
      background: linear-gradient(70deg,
          darken($primary, 10%),
          $tertiary,
          $secondary );
      background-position: -15em;
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
    }
  }
}

@media (max-width: 500px) {
  #temp-title {
    display: none;
  }

  a#router-main {
    display: flex;
    width: 50px;
    height: 50px;
    align-items: center;
    justify-content: center;
    text-decoration: none;
  }

}

#router-main {
  display: flex;
  width: 300px;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.logo-white {
  display: flex;
  margin-left: 10px;
  margin-right: 10px;
  height: 30px;
  width: 30px;
}

.btn-disco {
  display: flex;
  justify-content: left;
  width: 100%;
  height: 48px;
}

.logo-disco {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 1%;
  padding-top: 2%;
}

.text-disco {
  display: flex;
  align-items: center;
  margin-top: 16px;
  margin-left: 30px;
}

.v-navigation-drawer__content {
  background-color: $tertiary;
}

.v-list-item__title {
  color: $secondary;
}

.v-list-item__action {
  color: $secondary;
}
</style>
