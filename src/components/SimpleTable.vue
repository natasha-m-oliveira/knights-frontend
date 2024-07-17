<template>
  <v-data-table :headers="headers" :items="desserts">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Guerreiros</v-toolbar-title>
        <v-spacer></v-spacer>
        <DialogCreateKnight :knights="knights" @update:knights="updateKnights" />
        <DialogDeleteKnight :id="selectedId" :open="dialogDelete" :knights="knights"
          @update:open="dialogDelete = $event" @update:knights="updateKnights" />
        <DialogEditKnight :id="selectedId" :open="dialogEdit" :knights="knights"
        @update:open="dialogEdit = $event" @update:knights="updateKnights" />
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        class="me-2 cursor-pointer text-primary"
        size="small"
        @click="editKnight(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        class="cursor-pointer text-error"
        size="small"
        @click="deleteKnight(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="listKnights">
        Recarregar
      </v-btn>
    </template>
    <template v-slot:tfoot>
      <v-checkbox label="Apenas Heróis" v-model="onlyHeroes"></v-checkbox>
    </template>
  </v-data-table>
</template>

<script>
import { attributes } from '@/config/constants'
import api from '../lib/api'
import DialogCreateKnight from './DialogCreateKnight.vue'
import DialogDeleteKnight from './DialogDeleteKnight.vue'
import DialogEditKnight from './DialogEditKnight.vue'

export default {
  components: {
    DialogCreateKnight,
    DialogDeleteKnight,
    DialogEditKnight
  },
  data: () => ({
    headers: [
      { title: 'Nome', key: 'name', align: 'start' },
      { title: 'Apelido', key: 'nickname' },
      { title: 'Idade', key: 'age' },
      { title: 'Armas', key: 'weapons' },
      { title: 'Atributo', key: 'attribute' },
      { title: 'Ataque', key: 'attack' },
      { title: 'Exp', key: 'exp' },
      { title: 'Ações', key: 'actions', sortable: false },
    ],
    desserts: [],
    knights: [],
    selectedId: '',
    dialogDelete: false,
    dialogEdit: false,
    onlyHeroes: false,
  }),
  created() {
    this.listKnights()
  },
  watch: {
    onlyHeroes: {
      handler() {
        this.listKnights();
      },
      immediate: false
    }
  },
  methods: {
    async listKnights() {
      try {
        const filter = "?filter=heroes"
        const response = await api.get('knights' + (this.onlyHeroes ? filter : ''))

        const knights = response.data

        this.formatKnights(knights)
        this.knights = [...knights]
      } catch (error) {
        this.knights = []
        this.desserts = []
      }
    },
    calculateAge(birthday) {
      const birthDate = new Date(birthday);
      const today = new Date();

      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) return age - 1

      return age
    },
    calculateAttack(knight) {
      const keyAttr = knight.attributes[knight.keyAttribute]
      const equippedWeapons = knight.weapons.filter((weapon) => weapon.equipped)
      const totalWeaponMod = equippedWeapons.reduce((acc, weapon) => acc + weapon.mod, 0);
      let mod

      if (keyAttr >= 0 && keyAttr <= 8) {
        mod = -2;
      } else if (keyAttr >= 9 && keyAttr <= 10) {
        mod = -1;
      } else if (keyAttr >= 11 && keyAttr <= 12) {
        mod = 0;
      } else if (keyAttr >= 13 && keyAttr <= 15) {
        mod = 1;
      } else if (keyAttr >= 16 && keyAttr <= 18) {
        mod = 2;
      } else if (keyAttr >= 19 && keyAttr <= 20) {
        mod = 3;
      } else {
        throw new Error('Valor de keyAttr fora do intervalo válido.');
      }

      const attack = 10 + mod + totalWeaponMod;

      return attack;
    },
    calculateExp(age) {
      return Math.floor((age - 7) * Math.pow(22, 1.45))
    },
    formatKnights(knights) {
      const desserts = knights.map((knight) => {
        const age = this.calculateAge(knight.birthday)
        const attribute = attributes.find((attribute) => attribute.value === knight.keyAttribute)?.title

        return {
          id: knight.id,
          name: knight.name,
          nickname: knight.nickname,
          age: age,
          attribute: attribute,
          weapons: knight.weapons.length,
          attack: this.calculateAttack(knight),
          exp: this.calculateExp(age)
        }
      })
      this.desserts = [...desserts]
    },
    deleteKnight(knight) {
      this.selectedId = knight.id
      this.dialogDelete = true
    },
    editKnight(knight) {
      this.selectedId = knight.id
      this.dialogEdit = true
    },
    updateKnights(newKnights) {
      this.formatKnights(newKnights)
      this.knights = [...newKnights]
    },
  },
}
</script>