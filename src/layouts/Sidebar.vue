<template>
  <PushRotate width="200">
    <div class="nav-username">{{ user.name }}</div>
    <div class="nav-username_divider" />
    <ul>
      <li
        v-if="route.isSideBar"
        v-for="route in routes"
        v-bind:key="route.path"
      >
        <router-link to="/dashboard">
          <span v-html="route.icon"></span>
          <p>{{ route.name }}</p>
        </router-link>
      </li>
    </ul>
  </PushRotate>
</template>
<script>
import { PushRotate } from "vue-burger-menu";
import { mapGetters } from "vuex";
import { routes } from "../router/routes";

export default {
  components: {
    PushRotate
  },
  computed: {
    ...mapGetters(["user"])
  },
  data() {
    return {
      routes: routes
    };
  },
  methods: {
    handleOpenMenu() {
      this.isOpen = !isOpen;
    },
    handleCloseMenu() {
      this.isOpen = !isOpen;
    }
  }
};
</script>

<style lang="scss">
/* styling nav-username */
.nav-username {
  color: #ffffff;
  font-size: 1.167em;
  text-align: center;
  padding: 15px 0px;

  &_divider {
    width: 100%;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.2);
  }
}

/* Position and sizing of burger button */
.bm-burger-button {
  position: fixed;
  top: 21px;
  left: 16px;
  width: 20px;
  height: 20px;
  z-index: 1;
  .bm-burger-bars {
    background-color: rgba(0, 0, 0, 0.8);
    margin: auto;
  }
  &:hover {
    .bm-burger-bars {
      opacity: 1 !important;
      background-color: rgba(0, 0, 0, 1);
    }
  }
}
.line-style {
  position: absolute;
  height: 20%;
  left: 0;
  right: 0;
}
.cross-style {
  position: absolute;
  top: 12px;
  right: 2px;
  cursor: pointer;
}
.bm-cross {
  background: #bdc3c7;
}
.bm-cross-button {
  height: 24px;
  width: 24px;
}
.bm-menu {
  height: 100%; /* 100% Full-height */
  position: fixed; /* Stay in place */
  z-index: 1000; /* Stay on top */
  top: 0;
  left: 0;
  padding-top: 0px;
  background-color: #00255b;
  overflow-x: hidden; /* Disable horizontal scroll */
  transition: 0.5s; /*0.5 second transition effect to slide in the sidenav*/
}

.bm-overlay {
  background: rgba(0, 0, 0, 0.3);
}
.bm-item-list {
  color: #b8b7ad;
  margin-left: 10%;
  font-size: 20px;
  .bm-item {
    margin-top: 0px;
    padding: 0px;
    height: 100%;

    ul {
      margin: 0px;
      padding: 20px 0px;

      &:focus {
        outline: 0;
      }

      li {
        text-align: left !important;
        position: relative;
        display: block;
        padding: 0px;

        &:focus {
          outline: 0;
        }

        a {
          margin: 5px 15px;
          border-radius: 4px;
          padding: 0px 16px;
          transition: 0.5s;
          display: flex;

          &:focus {
            outline: 0;
          }

          svg {
            display: flex;
            justify-content: flex-start;
            align-items: center;
          }

          p {
            display: flex;
            align-items: center;
            margin: 0px 0px 0px 10px;
            font-weight: 600;
            font-size: 12px;
            color: #ffffff;
            opacity: 0.72;
            padding: 0px;
          }
        }

        &:hover > a {
          margin: 5px 15px;
          border-radius: 4px;
          background-color: rgba(255, 255, 255, 0.13);

          p {
            opacity: 1;
          }

          .nav-icon {
            opacity: 1;
          }
        }

        &.active > a {
          background-color: rgba(255, 255, 255, 0.23);

          p {
            opacity: 1;
          }

          .nav-icon {
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
