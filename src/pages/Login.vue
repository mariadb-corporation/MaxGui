<template>
    <v-container class="container--fluid  login-wrapper fill-height">
        <v-row>
            <v-col cols="12" align="center" justify="center">
                <div class="logo">
                    <img src="@/assets/logo.svg" alt="MariaDB Logo" />
                    <span class="ml-2 white--text"><b>Maria</b>DB <b>MaxScale</b></span>
                </div>
                <v-card style="max-width: 460px; z-index: 2;border-radius: 10px;">
                    <v-card-text class="pt-12 pb-0" align-center>
                        <div class="px-12">
                            <h1 class="display-2 pb-4" style="color: #003545;">Welcome</h1>
                            <v-form
                                class="pt-4"
                                ref="form"
                                v-model="isValid"
                                @keyup.native.enter="isValid && handleSubmit()"
                            >
                                <v-text-field
                                    class="std mt-4"
                                    height="36"
                                    name="username"
                                    id="username"
                                    autocomplete="username"
                                    autofocus
                                    dense
                                    single-line
                                    outlined
                                    required
                                    placeholder="Login"
                                    v-model="credential.username"
                                    :rules="rules.username"
                                    :error-messages="errorMessage"
                                    @input="errorMessage = ''"
                                />
                                <v-text-field
                                    class="std mt-6"
                                    height="36"
                                    name="password"
                                    autocomplete
                                    single-line
                                    dense
                                    outlined
                                    required
                                    id="password"
                                    placeholder="Password"
                                    v-model="credential.password"
                                    :append-icon="isPwdVisible ? mdiEye : mdiEyeOff"
                                    :rules="rules.password"
                                    :error-messages="!displayOneError ? errorMessage : ''"
                                    @input="errorMessage = ''"
                                    :type="isPwdVisible ? 'text' : 'password'"
                                    @click:append="isPwdVisible = !isPwdVisible"
                                />
                                <v-checkbox
                                    dense
                                    class="mt-2"
                                    v-model="rememberMe"
                                    label="Remember Me"
                                    color="primary"
                                />
                            </v-form>
                        </div>
                    </v-card-text>
                    <v-card-actions class="pt-0 pb-12">
                        <div class="mx-auto text-center" style="width: 50%;">
                            <v-progress-circular v-if="isLoading" :size="40" :width="5" color="primary" indeterminate />
                            <v-btn
                                class="mx-auto login"
                                v-else
                                @click="handleSubmit"
                                :disabled="!isValid"
                                block
                                depressed
                                color="primary"
                            >
                                <span class="font-weight-regular text-capitalize">Sign In</span>
                            </v-btn>
                        </div>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mdiEye, mdiEyeOff } from '@mdi/js';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import axios from 'axios';

export default {
    name: 'Login',
    data() {
        return {
            mdiEye: mdiEye,
            mdiEyeOff: mdiEyeOff,
            isValid: false,
            isLoading: false,
            isPwdVisible: false,
            rememberMe: false,
            credential: {
                username: '',
                password: '',
            },
            errorMessage: '',
            displayOneError: false, // errors receives from api
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
        ...mapActions(['login']),
        async handleSubmit() {
            if (!this.$refs.form.validate()) {
                return;
            }
            this.isLoading = true;
            try {
                let res = await axios.get(`/v1/auth`, { auth: this.credential });
                // temporary user's name, it is using username for name
                let userObj = { username: this.credential.username, token: res.data.token };
                await this.setUser(userObj);
                await sessionStorage.setItem('user', JSON.stringify(userObj));
                axios.defaults.headers.common['Authorization'] = `Bearer ${userObj.token}`;
                this.$router.push('server');
            } catch (error) {
                this.displayOneError = true;
                this.errorMessage =
                    error.response.status === 401 ? 'Incorrect password or username' : this.$help.getErrorsArr(error);
            }
            this.isLoading = false;
        },
    },
};
</script>

<style lang="scss" scoped>
.login-wrapper {
    width: 100%;
    height: 100%;
    background: radial-gradient(1100px at 100% 89%, $accent 0%, #003545 100%);
}
.logo {
    margin-bottom: 5px;

    & img {
        height: 48px;
        vertical-align: middle;
    }

    & span {
        display: inline-block;
        margin-top: 2px;
        font-size: 23px;
        vertical-align: middle;

        :after,
        :before {
            box-sizing: initial;
        }
    }
}

.login {
    max-width: 50%;
    height: 40px;
    border-radius: 20px;
}
</style>
