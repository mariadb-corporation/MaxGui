<template>
    <v-container class="container--fluid  login-wrapper fill-height" v-resize="onResize">
        <v-row>
            <v-col cols="12" align="center" justify="center">
                <div class="logo">
                    <img src="@/assets/logo.svg" alt="MariaDB Logo" />
                    <span class="ml-2 white--text"><b>Maria</b>DB <b>MaxScale</b></span>
                </div>
                <v-card style="max-width: 436px; z-index: 2;border-radius: 10px;">
                    <v-card-text class="pt-12 pb-0" align-center>
                        <div class="px-12">
                            <h1 align="left" class="display-2 pb-4" style="color: #003545;">Welcome</h1>
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
                                    :append-icon="isPwdVisible ? 'fa-eye' : 'fa-eye-slash'"
                                    :rules="rules.password"
                                    :error-messages="!displayOneError ? errorMessage : ''"
                                    @input="errorMessage = ''"
                                    :type="isPwdVisible ? 'text' : 'password'"
                                    @click:append="isPwdVisible = !isPwdVisible"
                                />

                                <v-checkbox
                                    class="small mt-2"
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
                            <a href="" style="font-size:0.865rem;text-decoration: none;" class="d-block mx-auto mt-2"
                                >Forgot password</a
                            >
                        </div>
                    </v-card-actions>
                </v-card>
            </v-col>
            <canvas ref="canvas"></canvas>
        </v-row>
    </v-container>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
// import axios from 'axios';

export default {
    name: 'Login',
    data() {
        return {
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
            circles: [],
            scratch: document.createElement('canvas'),
            ctx: null,
            hasFocus: true,
        };
    },
    computed: {
        ...mapGetters(['darkTheme']),
    },
    mounted() {
        window.onfocus = () => {
            this.hasFocus = true;
        };

        window.onblur = () => {
            this.hasFocus = false;
        };

        if (window.requestAnimationFrame && this.$refs.canvas) {
            this.ctx = this.$refs.canvas.getContext('2d');

            this.createCircle(); // Same UX with monitoring application, copy and paste :D

            window.requestAnimationFrame(this.draw);
        }
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
                let res = await this.axios.get(`/v1/auth`, { auth: this.credential });
                // temporary user's name, it is using username for name
                let userObj = { username: this.credential.username, token: res.data.token };
                await this.setUser(userObj);
                await sessionStorage.setItem('user', JSON.stringify(userObj));
                this.axios.defaults.headers.common['Authorization'] = `Bearer ${userObj.token}`;
                this.$router.push('dashboard');
            } catch (error) {
                this.displayOneError = true;
                this.errorMessage =
                    error.response.status === 401 ? 'Incorrect password or username' : this.$help.getErrorsArr(error);
            }
            this.isLoading = false;
        },
        onResize() {
            this.scratch.width = this.$refs.canvas.width = window.innerWidth;
            this.scratch.height = this.$refs.canvas.height = window.innerHeight;
        },
        drawCircle(circle) {
            this.ctx.strokeStyle = circle.color;
            this.ctx.lineWidth = 3;
            this.ctx.globalAlpha = Math.max(0, circle.opacity);

            this.ctx.beginPath();
            this.ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI, true);
            this.ctx.stroke();
        },
        draw() {
            if (!this.$refs.canvas) return;

            this.ctx.clearRect(0, 0, this.scratch.width, this.scratch.height);
            this.ctx.save();

            for (let i = this.circles.length - 1; i >= 0; --i) {
                this.drawCircle(this.circles[i]);

                this.circles[i].radius += 3;
                this.circles[i].opacity -= 0.0025;
                if (this.circles[i].radius > this.$refs.canvas.width) this.circles.splice(i, 1);
            }

            this.ctx.restore();

            window.requestAnimationFrame(this.draw);
        },
        createCircle() {
            setTimeout(() => {
                if (this.hasFocus) {
                    this.circles.unshift({
                        x: window.innerWidth - 50,
                        y: window.innerHeight - 80,
                        radius: 1,
                        opacity: 0.9,
                        color: 'white',
                    });
                }

                this.createCircle();
            }, this.$help.range(2.5, 5) * 1000);
        },
    },
};
</script>

<style lang="scss" scoped>
.login-wrapper {
    width: 100%;
    height: 100%;
    background: radial-gradient(1100px at 100% 89%, $accent 0%, $background1 100%);
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
canvas {
    position: absolute;
    top: 0;
    left: 0;
}
</style>
