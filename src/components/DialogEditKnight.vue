<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Editar Guerreiro</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="editedKnight.nickname" label="Apelido" />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="close">
          Cancelar
        </v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="edit">
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import api from '@/lib/api';

export default {
  props: {
    knights: {
      type: Array,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    open: {
      type: Boolean,
      required: true,
    }
  },
  data: () => ({
    dialog: false,
    editedKnight: {
      nickname: '',
    },
  }),
  watch: {
    open(newValue) {
      this.dialog = newValue;
    },
  },
  methods: {
    close() {
      this.$emit('update:open', false)
    },
    async edit() {
      try {
        const index = this.knights.findIndex((knight) => knight.id == this.id)
        
        const response = await api.patch(`knights/${this.id}/nickname`, this.editedKnight)

        const knight = response.data

        const knights = [...this.knights]
        knights[index] = knight

        this.$emit('update:knights', knights)
        this.$emit('update:open', false)
      } catch (error) {
        window.alert('Não foi possível editar o guerreiro.')
      }
    },
  }
}
</script>