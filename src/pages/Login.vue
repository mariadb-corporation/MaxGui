<template>
    <v-container v-resize="onResize" class="container--fluid login-wrapper fill-height">
        <v-row>
            <v-col cols="12" align="center" justify="center">
                <div class="logo">
                    <img src="@/assets/logo.svg" alt="MariaDB Logo" />
                    <span class="ml-2 white--text">
                        <b>MaxScale</b>
                    </span>
                </div>
                <v-card
                    class="v-card-custom"
                    style="max-width: 463px; z-index: 2;border-radius: 10px;"
                >
                    <v-card-text style="padding:60px 80px 0px" align-center>
                        <div class="">
                            <h1 align="left" class="pb-4" style="color: #003545;">
                                Welcome
                            </h1>
                            <v-form
                                ref="form"
                                v-model="isValid"
                                class="pt-4"
                                @keyup.native.enter="isValid && handleSubmit()"
                            >
                                <v-text-field
                                    id="username"
                                    v-model="credential.username"
                                    :rules="rules.username"
                                    :error-messages="errorMessage"
                                    class="std mt-4"
                                    height="36"
                                    name="username"
                                    autocomplete="username"
                                    autofocus
                                    dense
                                    single-line
                                    outlined
                                    required
                                    placeholder="Login"
                                    @input="errorMessage = ''"
                                />
                                <v-text-field
                                    id="password"
                                    v-model="credential.password"
                                    :append-icon="isPwdVisible ? 'visibility_off' : 'visibility'"
                                    :rules="rules.password"
                                    :error-messages="!displayOneError ? errorMessage : ''"
                                    :type="isPwdVisible ? 'text' : 'password'"
                                    class="std mt-4"
                                    height="36"
                                    name="password"
                                    autocomplete
                                    single-line
                                    dense
                                    outlined
                                    required
                                    placeholder="Password"
                                    @input="errorMessage = ''"
                                    @click:append="isPwdVisible = !isPwdVisible"
                                />

                                <v-checkbox
                                    v-model="rememberMe"
                                    class="small mt-2 mb-4"
                                    label="Remember Me"
                                    color="primary"
                                    hide-details
                                />
                            </v-form>
                        </div>
                    </v-card-text>
                    <v-card-actions style="padding-bottom:60px" class="pt-0 ">
                        <div class="mx-auto text-center" style="width: 50%;">
                            <v-progress-circular
                                v-if="isLoading"
                                :size="40"
                                :width="5"
                                color="primary"
                                indeterminate
                            />
                            <v-btn
                                v-else
                                :disabled="!isValid"
                                class="mx-auto login-btn mb-3"
                                block
                                depressed
                                color="primary"
                                small
                                height="36px"
                                @click="handleSubmit"
                            >
                                <span class="font-weight-bold text-capitalize">Sign In</span>
                            </v-btn>
                            <a
                                href
                                style="font-size:0.75rem;text-decoration: none;"
                                class="d-block mx-auto "
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
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
    name: 'login',
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
        }
    },
    computed: {
        ...mapGetters(['darkTheme']),
    },
    mounted() {
        window.onfocus = () => {
            this.hasFocus = true
        }

        window.onblur = () => {
            this.hasFocus = false
        }

        if (window.requestAnimationFrame && this.$refs.canvas) {
            this.ctx = this.$refs.canvas.getContext('2d')

            this.createCircle() // Same UX with monitoring application, copy and paste :D

            window.requestAnimationFrame(this.draw)
        }
    },

    methods: {
        ...mapMutations(['setUser']),
        ...mapActions(['login']),
        async handleSubmit() {
            if (!this.$refs.form.validate()) {
                return
            }
            this.isLoading = true
            try {
                let res = await this.axios.get(`/v1/auth`, { auth: this.credential })
                // temporary user's name, it is using username for name
                let userObj = { username: this.credential.username, token: res.data.token }
                await this.setUser(userObj)
                await sessionStorage.setItem('user', JSON.stringify(userObj))
                this.axios.defaults.headers.common['Authorization'] = `Bearer ${userObj.token}`
                this.$router.push('dashboard')
            } catch (error) {
                this.displayOneError = true
                if (error.response) {
                    this.errorMessage =
                        error.response.status === 401
                            ? 'Incorrect password or username'
                            : this.$help.getErrorsArr(error)
                }
            }
            this.isLoading = false
        },
        onResize() {
            this.scratch.width = this.$refs.canvas.width = window.innerWidth
            this.scratch.height = this.$refs.canvas.height = window.innerHeight
        },
        drawCircle(circle) {
            this.ctx.strokeStyle = circle.color
            this.ctx.lineWidth = 3
            this.ctx.globalAlpha = Math.max(0, circle.opacity)

            this.ctx.beginPath()
            this.ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI, true)
            this.ctx.stroke()
        },
        draw() {
            if (!this.$refs.canvas) return

            this.ctx.clearRect(0, 0, this.scratch.width, this.scratch.height)
            this.ctx.save()

            for (let i = this.circles.length - 1; i >= 0; --i) {
                this.drawCircle(this.circles[i])

                this.circles[i].radius += 3
                this.circles[i].opacity -= 0.0025
                if (this.circles[i].radius > this.$refs.canvas.width) this.circles.splice(i, 1)
            }

            this.ctx.restore()

            window.requestAnimationFrame(this.draw)
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
                    })
                }

                this.createCircle()
            }, this.$help.range(2.5, 5) * 1000)
        },
    },
}
</script>

<style lang="scss" scoped>
.login-wrapper {
    width: 100%;
    height: 100%;
    background: radial-gradient(1100px at 100% 89%, $accent 0%, $deep-ocean 100%);
}
.logo {
    margin-bottom: 5px;

    & img {
        width: 265px;
        vertical-align: middle;
    }

    & span {
        display: inline-block;
        margin-top: 2px;
        font-size: 31px;
        vertical-align: middle;

        :after,
        :before {
            box-sizing: initial;
        }
    }
}

.login-btn {
    max-width: 50%;
    height: 36px;
    border-radius: 17px;
}
canvas {
    position: absolute;
    top: 0;
    left: 0;
}
</style>
