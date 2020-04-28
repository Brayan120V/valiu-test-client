<template>
  <div class="container">
    <label>Etiquetas</label>
    <hr />
    <input
      v-if="edit===false"
      @keyup.13="create"
      type="text"
      placeholder="Añadir etiqueta"
      v-model="tag.name"
      data-tag-new
    />
    <input
      v-else-if="edit===true"
      @keyup.13="update"
      type="text"
      placeholder="Añadir etiqueta"
      v-model="tag.name"
      data-tag-update
    />
    <div class="list-group my-4">
      <li v-for="t in tags" :key="t._id" class="row listItem list-group-item-action">
        <div class="col">
          <i class="material-icons md-10" :style="setColor(t.color)">lens</i>
          <span>{{t.name}}</span>
        </div>
        <div class="row col-lg-2">
          <button @click="updateState(t)" class="update btn btn-link right clearfix ml-1">Editar</button>
          <button @click="remove(t._id)" class="delete btn btn-link right clearfix">Borrar</button>
        </div>
      </li>
    </div>
    <hr />
  </div>
</template>

<script>
import io from "socket.io-client";
import TagService from "../services/TagService";

class Tag {
  constructor(name, color, _id) {
    this.name = name;
    this.color = color;
    this._id = _id;
  }
}

export default {
  name: "Tag",

  data() {
    return {
      tag: new Tag(),
      tags: [],
      socket: io("localhost:8080", {
        transports: ["websocket", "polling"]
      }),
      edit: false
    };
  },

   mounted() {
    this.loadTags();

    this.socket.on("SEND_MESSAGE", data => {
      let out = this.tags.findIndex(e => e._id === data._id);
      out != -1 ? (this.tags[out].name = data.name) : this.tags.insert(0, data);
    });

    this.socket.on("REMOVE_MESSAGE",  data => {
      this.tags =  this.tags.filter(e => e._id != data._id);
    }); 

    Array.prototype.insert = function(i, ...rest) {
      this.splice(i, 0, ...rest);
      return this;
    };
  },

  methods: {
    async loadTags(){
      this.tags = (await TagService.list()).data;
    },
    async create() {
      if (this.tag.name.length < 1) return;

      let response = await TagService.create(this.tag);

      if (response.data) {
        this.tags.insert(0, response.data);
        this.tag = new Tag();
        this.socket.emit("SEND_MESSAGE", response.data);
      }
    },

    async remove(_id) {
      let response = await TagService.delete(_id);

      this.tag = new Tag();
      this.edit = false;

      if (response.data._id) {
        this.tags = await this.tags.filter(e => e._id != response.data._id);
        this.socket.emit("REMOVE_MESSAGE", response.data);
      }
    },

    updateState(tag) {
      this.edit = true;
      this.tag = tag;
    },

    async update() {
      if (this.tag.name.length < 1) return;

      let response = await TagService.update(this.tag);

      if (response.data) {
        this.edit = false;
        this.tag = new Tag();

        this.tags[this.tags.findIndex(e => e._id === response.data._id)].name =
          response.data.name;

        this.socket.emit("SEND_MESSAGE", response.data);
      }
    },

    setColor(color) {
      return {
        color: color
      };
    }
  }
};
</script>

<style scoped>
hr {
  margin-top: 1rem;
  margin-bottom: 1rem;
  border: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

input,
textarea:focus,
input:focus,
input[type]:focus {
  border: 0;
  font-size: 20px;
  border-color: #fff;
  box-shadow: 0 1px 1px #fff inset, 0 0 8px #fff;
  outline: 0 none;
  width: 100%;
}

.listItem {
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: row;
}

.btn-link {
  color: #364655;
  text-decoration: none;
  font-size: 14px;
}
.btn-link:hover {
  font-weight: 600;
}

.material-icons.md-10 {
  font-size: 10px;
  margin-right: 1.5%;
  color: var();
}
</style>
