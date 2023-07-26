<template>
    <div class="overlay-delete">
        <v-col v-if="!reportconfirm2" class="d-flex justify-center align-center">
            <v-card class="popup-report-com">
                <p class="logo-disconnect-delete">
                    <img class="logo-white" src="../static/logo/logo.png" alt="logo" />
                    <span>La team SocNet</span>
                </p>
                <p id="span-report-post-titre">
                    <v-icon class="img-flag">mdi-flag</v-icon>
                     supprimer data
                    <v-icon class="img-flag">mdi-flag</v-icon>
                </p>
                <p v-if="!reportconfirm2" id="span-report-post">
                    <v-icon class="img-flag">mdi-flag</v-icon>
                    supprimer {{ fullname }}
                    <v-icon class="img-flag">mdi-flag</v-icon>
                </p>
                <v-btn v-if="!reportconfirm2" @click="(reportconfirm2 = !reportconfirm2), banSend()" id="btn-ban-confirm">
                    <span>supprimer</span>
                </v-btn>
                <v-btn v-if="!reportconfirm2" id="btn-ban-delete" @click="$emit('close-modale-deleteAll')">
                    <span>Retour</span>
                </v-btn>
            </v-card>
        </v-col>
        <v-col v-if="reportconfirm2" class="d-flex justify-center align-center unban-user">
            <v-card class="popup-report-com-unban">
                <p class="logo-disconnect-delete">
                    <img class="logo-white" src="../static/logo/logo.png" alt="logo" />
                    <span>La team SocNet</span>
                </p>
                <p id="span-report-post-titre">
                    <v-icon class="img-flag">mdi-flag</v-icon>
                    suppression
                    <v-icon class="img-flag">mdi-flag</v-icon>
                </p>
                <p v-if="reportconfirm2" id="span-report-post-2">
                    <v-icon class="img-flag">mdi-flag</v-icon>
                    {{ fullname }} est supprimé(e)
                    <v-icon class="img-flag">mdi-flag</v-icon>
                </p>
                <v-btn v-if="reportconfirm2" id="btn-unban-delete" @click="$emit('close-modale-deleteAll')">
                    <span>Retour</span>
                </v-btn>
            </v-card>
        </v-col>
    </div>
</template>
  
<script>
import axios from "axios";

export default {
    async mounted() {
        const info = JSON.parse(localStorage.getItem("info-ban-user", JSON.stringify(info)));
        this.iduserban = info.idban
        this.idpostban = info.postidban
        this.$axios.get(`/api/user/${this.iduserban}`)
            .then((doc) => {
                console.log(doc);
                localStorage.removeItem('info-ban-user')
                this.firstname = doc.data.firstname
                this.lastname = doc.data.lastname
            })
    },

    data() {
        return {
            iduserban: '',
            idpostban: "",
            reportconfirm2: false,
            firstname: '',
            lastname: '',
            banandpublication: false,
            profilban: false,
        }
    },
    methods: {
        banSend() {
            this.$axios.post(`api/user/deletepostbanadmin/${this.iduserban}`)
                .then((doc) => {
                    this.reportconfirm2 = true,
                        console.log('utilisateur banni');
                })
            setTimeout(() => {
                this.$emit('close-modale-deleteAll')
            }, 2500)
        },
    },
    computed: {
        fullname: {
            get() {
                return this.firstname + " " + this.lastname;
            },
            set(newValue) {
                [this.firstname, this.lastname] = newValue.split(" ");
            },
        },
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

.popup-report-com {
    padding-bottom: 1%;
    padding-top: 1%;
    background-color: $secondary;
    margin-top: 250px;
    width: 320px;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.popup-report-com-unban {
    padding-bottom: 1%;
    padding-top: 1%;
    background-color: $secondary;
    margin-top: 250px;
    width: 320px;
    height: 250px;
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

.img-flag {
    display: flex;
    align-items: center;
    justify-content: center;
    width: auto;
    padding-right: 5%;
    padding-left: 5%;

    &:before {
        color: $primary;
    }

    &:hover {
        color: $secondary;
    }
}

#span-report-post {
    width: 100%;
    text-align: center;
}

#span-report-post-titre {
    width: 100%;
    text-align: center;
    color: rgb(37, 177, 46);
}

#span-ban-post-user {
    display: flex;
    flex-direction: column;
    width: 100%;
    color: green
}

#span-report-post-2 {
    width: 100%;
    text-align: center;
    padding: 1%;
    font-style: italic;
}

#spanban1 {
    width: 100%;
    text-align: center;
    padding: 1%;
    font-style: italic;
}

#span-report-post-signal {
    width: 100%;
    text-align: center;
    padding: 1%;
    font-style: italic;
    margin-bottom: 0;
}

#span-report {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding-left: 1%;
    padding-right: 1%;
    font-style: italic;
    padding-bottom: 1%;
}

.comfirm-span-delete {
    padding-top: 3%;
}

#btn-ban-confirm {
    font-weight: bold;
    background-color: $secondary;
    justify-content: center;
    align-items: center;
    color: green;
    width: 50%;
    margin-bottom: 1%;

    &:hover {
        background-color: green;
        color: $secondary;
    }
}

#btn-ban-and-del {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    background-color: $secondary;
    color: green;
    width: 50%;
    height: auto;
    margin-bottom: 1%;

    &:hover {
        background-color: green;
        color: $secondary;
    }
}

#pbandelpost {
    display: flex;
    flex-direction: column;
    width: 160px;
    margin-top: 5%;
    margin-bottom: 5%;
}

#btn-ban-delete {
    font-weight: bold;
    color: red;
    background-color: $secondary;
    justify-content: center;
    align-items: center;
    width: 50%;

    &:hover {
        background-color: $primary;
        color: $secondary;
    }
}

#btn-unban-delete {
    color: red;
    background-color: $secondary;
    justify-content: center;
    align-items: center;
    width: 50%;

    &:hover {
        background-color: $primary;
        color: $secondary;
    }
}

#btn-unban {
    color: green;
    background-color: $secondary;
    font-weight: bold;
    justify-content: center;
    align-items: center;
    width: 50%;

    &:hover {
        background-color: green;
        color: $secondary;
    }
}
</style>
  