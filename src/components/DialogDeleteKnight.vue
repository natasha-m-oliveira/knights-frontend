<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">Deletar Guerreiro</v-card-title>
      <v-card-subtitle>Tem certeza de que deseja excluir este guerreiro?</v-card-subtitle>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="close">Cancelar</v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="deleteConfirm">OK</v-btn>
        <v-spacer></v-spacer>
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
    dialog: false
  }),
  watch: {
    open(newValue) {
      this.dialog = newValue;
    }
  },
  methods: {
    close() {
      this.$emit('update:open', false)
    },
    async deleteConfirm() {
      try {
        await api.delete(`knights/${this.id}`)

        const knights = this.knights.filter((knight) => knight.id != this.id)

        this.$emit('update:knights', knights)
        this.$emit('update:open', false)
      } catch (error) {
        window.alert('Não foi possível exluir o guerreiro.')
      }
    },
  }
}
</script>