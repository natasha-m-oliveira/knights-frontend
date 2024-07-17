<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template v-slot:activator="{ props }">
      <v-btn class="mb-2" color="primary" dark v-bind="props">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Criar Guerreiro</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="6" sm="6">
              <v-text-field v-model="createdKnight.name" label="Nome" />
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-text-field v-model="createdKnight.nickname" label="Apelido" />
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-text-field type="date" v-model="createdKnight.birthday" label="Data de nascimento" />
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-select v-model="createdKnight.keyAttribute" :items="attributes" label="Atributo" />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="close">
          Cancelar
        </v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="save">
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import api from '@/lib/api';
import { attributes } from '../config/constants'

export default {
  props: {
    knights: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    dialog: false,
    createdKnight: {
      name: '',
      nickname: '',
      birthday: '',
      weapons: [],
      attributes: {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
      },
      keyAttribute: '',
    },
    defaultKnight: {
      name: '',
      nickname: '',
      birthday: '',
      weapons: [],
      attributes: {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
      },
      keyAttribute: '',
    },
    attributes: attributes
  }),
  methods: {
    clearForm() {
      this.createdKnight = this.defaultKnight
    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.createdKnight = Object.assign({}, this.defaultItem)
      })
    },
    async save() {
      try {
        const response = await api.post('knights', this.createdKnight)

        const knight = response.data

        const knights = [...this.knights, knight]

        this.$emit('update:knights', knights)
        this.clearForm()
        this.dialog = false
      } catch (error) {
        window.alert('Não foi possível cadastrar um novo guerreiro.')
      }
    },
  }
}
</script>