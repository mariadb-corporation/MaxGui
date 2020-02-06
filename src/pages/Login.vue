<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <v-col :md="8" :sm="4" class="d-none d-sm-flex">
        <v-img
          :src="
            ' https://mariadb.com/wp-content/uploads/2018/08/home-hero-background.jpg'
          "
          height="100vh"
        ></v-img>
      </v-col>
      <v-col :md="4" :sm="8" :xs="12">
        <div class="pt-12 d-flex flex-column align-center justify-center">
          <v-avatar class="ma-2" color="primary" size="48">
            <i class="material-icons">lock</i>
          </v-avatar>
          <h3 class="title">MariaDB MaxScale</h3>
        </div>

        <v-form
          ref="form"
          v-model="isValid"
          @keyup.native.enter="isValid && handleSubmit()"
          class="py-12 px-8"
        >
          <v-label>Username</v-label>
          <v-text-field
            id="username"
            v-model="login.username"
            :rules="rules.username"
            :error-messages="errorMessage"
            @input="errorMessage = ''"
            autocomplete="username"
            name="username"
            autofocus
            height="36"
            single-line
            outlined
            rounded
            required
          ></v-text-field>

          <v-label>Password</v-label>
          <v-text-field
            id="password"
            v-model="login.password"
            :append-icon="isPwdVisible ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="rules.password"
            :error-messages="errorMessage"
            @input="errorMessage = ''"
            :type="isPwdVisible ? 'text' : 'password'"
            @click:append="isPwdVisible = !isPwdVisible"
            name="password"
            height="36"
            single-line
            outlined
            rounded
            required
          ></v-text-field>
          <v-checkbox
            v-model="rememberMe"
            label="Remember Me"
            color="primary"
          ></v-checkbox>
          <v-btn
            @click="handleSubmit()"
            :disabled="!isValid"
            block
            color="primary"
            depressed
            >Login</v-btn
          >
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      isValid: true,
      isPwdVisible: false,
      rememberMe: false,
      login: {
        username: "",
        password: ""
      },
      errorMessage: "",
      rules: {
        username: [val => !!val || "Username is required"],
        password: [val => !!val || "Password is required"]
      }
    };
  },
  methods: {
    async handleSubmit() {
      if (!this.$refs.form.validate()) {
        return;
      }
      try {
        // console.log("process.env.VUE_APP_API", process.env.VUE_APP_API);
        // await this.axios.get(`http://127.0.0.1:8989/v1/servers`, {
        //   auth: this.login
        // });
        let headers = new Headers();
        headers.append(
          "Authorization",
          "Basic" + btoa(`${this.login.username}:${this.login.password}`)
        );
        await fetch("http://127.0.0.1:8989/v1/servers", {
          method: "GET",
          headers: headers
        });
      } catch (e) {
        console.log("e", e);
      }
    }
  }
};
</script>
