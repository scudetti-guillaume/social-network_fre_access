<template>
    <!-- <form v-if="!loggedIn">
      <label>Mot de passe:</label>
      <input type="password" v-model="password">
      <br>
      <label>Token admin:</label>
      <input type="text" v-model="adminToken">
      <br>
      <button @click.prevent="login()">Se connecter</button>
    </form> -->
    <div class="main-admin-page">
     <v-card id="form-admin" v-if="!loggedIn">
                <div class="form-admin-div">
                  <form @submit.prevent class="form-admin-container">
                    <label for="email">
                      <h2>Mail admin</h2>
                    </label>
                    <v-spacer />
                    <input
                      v-model="email"
                      class="form-admin-input"
                      type="text"
                      placeholder="Votre Email"
                      name="email"
                      required
                    />
                    <label for="badge">
                      <h2>Numéro de badge</h2>
                    </label>
                    <v-spacer />
                    <input
                      v-model="badge"
                      class="form-admin-input"
                      type="text"
                      placeholder="numéro de badge"
                      name="badge"
                      required
                    />
                    <v-spacer />
                    <label for="psw">
                      <h2>Mot de passe </h2>
                    </label>
                    <v-spacer />
                    <input
                      v-model="psw"
                      class="form-admin-input"
                      type="password"
                      placeholder="Votre mot de passe"
                      name="psw"
                      required
                    />
                    <v-spacer />
                    <div class="errormsg">{{ infomsg }}</div>
                    <div v-if="successreg" class="successmsg">{{ successreg }}</div>
                    <button
                      class="btn-valid-login-admin"
                      @click="loginAdmin"
                      type="submit"
                    >
                      <h2 class="h2-form-admin">Se connecter</h2>
                    </button>
                  </form>
                </div>
              </v-card>

 <v-card v-else>
 test
 
 </v-card>

    </div>
</template>

<script>
import Load from "../components/Waitload.vue";
import axios from 'axios';
axios.defaults.withCredentials = true;

export default {
name: 'admin',
    components: {
        Load,
    },

data(){
return{
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
                    // console.log(res.data);
                
                    
                    if(user.status = 200) {
                    this.loggedIn = true;
                    }
              
                    // setTimeout(() => {
                    //     this.$emit("close-modale", true);
                    //     window.location.reload()
                    // }, 1500);
                    this.userid = userId;
                })
                .catch((error) => {
                      alert('Mot de passe ou jeton incorrect')
                    this.infomsg = error.response.data.errors;
                    setTimeout(() => {
                        this.infomsg = "";
                    }, 3000);
                });

        
        }

},


async mounted(){
        axios.defaults.withCredentials = true;
        setTimeout(() => {
            this.showloader = false;
        }, 2500);

        await axios
            .get(`http://localhost:5000/jwtid`)
            .then((res) => {
                this.userjwtid = res.data;
                this.show = true;
            })
            .catch((error) => {
                console.log(error);
            });





},


};

</script>


<style lang="scss">

.main-admin-page{
display: flex;
align-items: center;
justify-content: center;
// width: 100vw;
// height: 100vh;

}

#form-admin{
display: flex;
align-items: center;
justify-content: center;
text-align: center;
width: 30vw;
height: 100%;
border-radius: 20px;
background-color: rgb(7, 66, 66);
}


.form-admin-div{
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

.btn-valid-login-admin{
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

.h2-form-admin{
  padding: 5px;
//   background-color: rgb(120, 35, 123);
}

</style>