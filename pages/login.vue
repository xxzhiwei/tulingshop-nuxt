<template>
    <div class="login">
        <div class="container">
            <a href="/#/index"><img src="/imgs/login-logo.png" alt=""></a>
        </div>
        <div class="wrapper">
            <div class="container">
                <div class="login-form" v-if="type === 1">
                    <h3>
                        <span class="checked">帐号登录</span>
                    </h3>
                    <div class="input">
                        <input type="text" placeholder="请输入帐号" v-model="loginForm.username">
                    </div>
                    <div class="input">
                        <input type="password" placeholder="请输入密码" v-model="loginForm.password">
                    </div>
                    <div class="btn-box">
                        <a href="javascript:;" class="btn" @click="login">登录</a>
                    </div>
                    <div class="tips">
                        <div class="sms">手机短信登录/注册</div>
                        <div class="reg" @click="switchType">立即注册<span>|</span>忘记密码？</div>
                    </div>
                </div>
                <div class="register-form" v-else>
                    <h3>
                        <span class="checked">注册账号</span>
                    </h3>
                    <template v-if="registerStep === 1">
                        <div class="input">
                            <input type="text" placeholder="请输入帐号" v-model="registerForm.username">
                        </div>
                        <div class="input">
                            <input type="password" placeholder="请输入密码" v-model="registerForm.password">
                        </div>
                        <div class="input">
                            <input type="password" placeholder="请再次输入密码" v-model="registerForm.password2">
                        </div>
                        <div style="margin-bottom: 20px;">
                            <!-- <input type="text" placeholder="请输入生日" v-model="registerForm.username"> -->
                            <el-date-picker
                                style="width: 100%;"
                                v-model="registerForm.birthday"
                                type="date"
                                placeholder="请选择出生日期" format="yyyy-MM-dd">
                            </el-date-picker>
                        </div>

                        <div style="margin-bottom: 20px;">
                            <div style="font-size: 14px; margin-right: 15px; color: #606266; display: inline-block;">性别</div>
                            <el-radio v-model="registerForm.gender" :label="1">男</el-radio>
                            <el-radio v-model="registerForm.gender" :label="2">女</el-radio>
                        </div>

                        <div class="btn-box">
                            <a href="javascript:;" class="btn" @click="next">下一步</a>
                        </div>
                    </template>
                    <template v-else-if="registerStep === 2">
                        <div class="input">
                            <input type="text" placeholder="请输入手机号" v-model="registerForm.phone">
                        </div>
                        <div class="btn-box" style="display: flex;">
                            <a href="javascript:;" class="btn" style="margin-right: 15px;" @click="previous">上一步</a>
                            <a href="javascript:;" class="btn" @click="register">注册</a>
                        </div>
                    </template>
                    <div class="tips">
                        <div class="sms">手机短信登录/注册</div>
                        <div class="reg" @click="switchType">立即登录</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="footer-link">
                <a href="http://www.tulingxueyuan.cn/" target="_blank">图灵学院</a><span>|</span>
                <a href="https://ke.qq.com/course/231516?tuin=a6505b53" target="_blank">腾讯课堂java架构师培训</a><span>|</span>
                <a href="https://ke.qq.com/course/429988" target="_blank">数据结构与算法</a><span>|</span>
                <a href="https://tuling.ke.qq.com/" target="_blank">腾讯课堂图灵学院</a>
            </div>
            <p class="copyright">Copyright ©2019 图灵学院 All Rights Reserved.</p>
        </div>
    </div>
</template>
<script>
import { login, register } from "@/api/user";

export default {
    name: "login",
    layout: "layout-1",
    data() {
        return {
            loginForm: {
                username: "",
                password: "",
            },
            registerForm: {
                username: "",
                password: "",
                password2: "",
                // nickname: "",
                phone: "",
                gender: 1,
                birthday: ""
            },
            registerStep: 1,
            type: 1 // 1=登录，2=注册
        };
    },
    methods: {
        async login() {
            const { username, password } = this.loginForm;
            if (!username || !password) {
                return this.$message.error("用户名或密码不能为空");
            }

            const resp = await login(this.loginForm)
                .catch(err => {
                    console.log(err);
                });
            if (!resp || resp.code !== 0) {
                return;
            }
            this.$message.warning("登录成功");
            this.$router.push({ path: this.redirect || '/' });
            const { accessToken, refreshToken, payload: user } = resp.data;
            this.$store.dispatch('user/saveLoginInfo', { accessToken, refreshToken, user });
            
        },
        async register() {
            const { username, password, password2, phone } = this.registerForm;

            if (!username || !password) {
                return this.$message.error("用户名或密码不能为空");
            }

            if (password !== password2) {
                return this.$message.error("输入的密码不一致");
            }

            if (!phone) {
                return this.$message.error("手机号不能为空");
            }

            if (!/^1[3-9]\d{9}$/.test(phone)) {
                return this.$message.error("手机号格式不正确");
            }
            const resp = await register(this.registerForm).catch(error => {
                console.log(error);
            });
            if (!resp || !resp.code == 0) {
                return;
            }
            this.$message.success("注册成功");
        },
        next() {
            if (this.registerStep < 1) {
                return;
            }
            this.registerStep++;
        },
        previous() {
            if (this.registerStep > 1) {
                this.registerStep--;
            }
        },
        switchType() {
            this.type = this.type === 1 ? 2 : 1;
        }
    },
};
</script>
<style lang="scss">
.login {
    & > .container {
        height: 80px;
        img {
            width: auto;
            height: 100%;
        }
    }
    .wrapper {
        background: url("/imgs/login-bg.jpg") no-repeat center;
        .container {
            height: 600px;
            .login-form, .register-form {
                box-sizing: border-box;
                padding: 30px;
                width: 410px;
                // height: 510px;
                background-color: #ffffff;
                position: absolute;
                top: 50%;
                right: 0;
                transform: translateY(-50%);
                h3 {
                    line-height: 23px;
                    font-size: 24px;
                    text-align: center;
                    margin: 0 auto 30px;
                    .checked {
                        color: #ff6600;
                    }
                    .sep-line {
                        margin: 0 32px;
                    }
                }
                .input {
                    display: inline-block;
                    width: 348px;
                    height: 40px;
                    border: 1px solid #e5e5e5;
                    margin-bottom: 20px;
                    line-height: 40px;
                    input {
                        width: 100%;
                        height: 100%;
                        border: none;
                        padding: 0 15px;
                    }
                }
                .btn {
                    width: 100%;
                    line-height: 50px;
                    margin-top: 10px;
                    font-size: 16px;
                }
                .tips {
                    margin-top: 14px;
                    display: flex;
                    justify-content: space-between;
                    font-size: 14px;
                    cursor: pointer;
                    .sms {
                        // color: #ff6600;
                        color: #fff;
                    }
                    .reg {
                        color: #999999;
                        span {
                            margin: 0 7px;
                        }
                    }
                }
            }
        }
    }
    .footer {
        height: 100px;
        padding-top: 60px;
        color: #999999;
        font-size: 16px;
        text-align: center;
        .footer-link {
            a {
                color: #999999;
                display: inline-block;
            }
            span {
                margin: 0 10px;
            }
        }
        .copyright {
            margin-top: 13px;
        }
    }
}
</style>