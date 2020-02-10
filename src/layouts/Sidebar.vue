<template>
  <Reveal width="200">
    <div class="nav-username">{{ user.username }}</div>
    <div class="nav-username_divider" />
    <ul>
      <li v-for="route in renderNavRoute" v-bind:key="route.path">
        <router-link :to="route.path">
          <v-icon large color="primary">{{ route.icon }}</v-icon>
          <p>{{ route.name }}</p>
        </router-link>
      </li>
    </ul>
  </Reveal>
</template>
<script>
import { Reveal } from "vue-burger-menu";
import { mapGetters } from "vuex";
import { routes } from "../router/routes";

export default {
  components: {
    Reveal
  },
  computed: {
    ...mapGetters(["user"]),
    renderNavRoute: function() {
      let navRoute = routes.filter(route => route.isSideBar);
      return navRoute;
    }
  },
  data() {
    return {
      routes: routes
    };
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
  display: flex;
  justify-content: center;
  text-transform: capitalize;
  &_divider {
    width: 100%;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.2);
    padding: 0px;
  }
}

/* Position and sizing of burger button */
.bm-burger-button {
  position: fixed;
  top: 14px;
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
  margin-left: 0px;
  font-size: 20px;

  ul {
    margin: 0px;
    padding: 20px 0px !important;
    display: flex;
    justify-content: center;
    flex-direction: column;
    li {
      text-align: left !important;
      position: relative;
      display: block;
      padding: 0px;

      &:focus {
        outline: 0;
      }

      a {
        margin: 5px 0px;
        border-radius: 4px;
        padding: 8px 16px;
        transition: 0.5s;
        display: flex;
        text-decoration: none;
        &:focus {
          outline: 0;
        }

        i {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          font-size: 32px;
        }

        p {
          display: flex;
          align-items: center;
          margin: 0px 0px 0px 10px;
          font-weight: 600;
          font-size: 18px;
          color: #ffffff;
          opacity: 0.72;
          padding: 0px;
        }
      }

      &:hover > a {
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
</style>
