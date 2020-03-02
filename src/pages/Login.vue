<template>
    <v-container :style="`background-color: ${darkTheme ? '#1E1E1E' : '#fff'}`" fluid class="pa-0">
        <v-row no-gutters>
            <v-col :md="8" :sm="4" class="d-none d-sm-flex">
                <v-img src="../assets/img/home-hero-background.jpg" height="100vh"></v-img>
            </v-col>
            <v-col :md="4" :sm="8" :xs="12">
                <div class="pt-12 d-flex flex-column align-center justify-center">
                    <v-avatar class="ma-2" color="primary" size="48">
                        <v-icon size="24" color="white">{{ mdiLock }}</v-icon>
                    </v-avatar>
                    <h3 :style="`color: ${darkTheme ? '#fff' : '#1E1E1E'}`" class="title">MariaDB MaxScale</h3>
                </div>

                <v-form ref="form" v-model="isValid" @keyup.native.enter="isValid && handleSubmit()" class="py-12 px-8">
                    <v-label :dark="darkTheme">Username</v-label>
                    <v-text-field
                        :dark="darkTheme"
                        id="username"
                        v-model="login.username"
                        :rules="rules.username"
                        :error-messages="errorMessage"
                        @input="errorMessage = ''"
                        autocomplete="username"
                        name="username"
                        autofocus
                        dense
                        single-line
                        outlined
                        rounded
                        required
                    ></v-text-field>

                    <v-label :dark="darkTheme">Password</v-label>
                    <v-text-field
                        :dark="darkTheme"
                        id="password"
                        v-model="login.password"
                        :append-icon="isPwdVisible ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="rules.password"
                        :error-messages="errorMessage"
                        @input="errorMessage = ''"
                        :type="isPwdVisible ? 'text' : 'password'"
                        @click:append="isPwdVisible = !isPwdVisible"
                        name="password"
                        autocomplete
                        single-line
                        dense
                        outlined
                        rounded
                        required
                    ></v-text-field>
                    <v-checkbox :dark="darkTheme" v-model="rememberMe" label="Remember Me" color="primary"></v-checkbox>
                    <v-card-actions class="pt-0 pb-12">
                        <div class="mx-auto text-center" style="width: 50%;">
                            <v-progress-circular
                                :dark="darkTheme"
                                v-if="isLoading"
                                :size="40"
                                :width="5"
                                color="primary"
                                indeterminate
                            ></v-progress-circular>
                            <v-btn
                                :dark="darkTheme"
                                v-else
                                @click="handleSubmit"
                                :disabled="!isValid"
                                block
                                color="primary"
                                depressed
                            >
                                Login
                            </v-btn>
                        </div>
                    </v-card-actions>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mdiLock } from '@mdi/js';
import { mapGetters, mapMutations } from 'vuex';

export default {
    name: 'Login',
    data() {
        return {
            mdiLock: mdiLock,
            isValid: false,
            isLoading: false,
            isPwdVisible: false,
            rememberMe: false,
            login: {
                username: '',
                password: '',
            },
            errorMessage: '',
            rules: {
                username: [val => !!val || 'Username is required'],
                password: [val => !!val || 'Password is required'],
            },
        };
    },
    computed: {
        ...mapGetters(['darkTheme']),
    },
    methods: {
        ...mapMutations(['setUser']),
        async handleSubmit() {
            if (!this.$refs.form.validate()) {
                return;
            }
            this.isLoading = true;
            try {
                let res = await this.axios.get(`/auth`, {
                    auth: this.login,
                });
                // temporary user's name, it is using username for name
                this.setUser({ username: this.login.username, token: res.data.token });
                this.isLoading = false;
                this.$router.push('server');
            } catch (e) {
                this.errorMessage = e.toString();
                this.isLoading = false;
            }
        },
    },
};
</script>
