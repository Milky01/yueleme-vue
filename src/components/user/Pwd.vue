<template>
    <div class="maindiv">
        <el-card class="box-card" v-if="pass">
            <div slot="header" class="clearfix">
                <span>设置密码</span>
            </div>
            <div class="input-div">
                <span style="float: left">请输入密码</span>
                <el-form :model="data" :rules="rules" ref="ruleForm">
                    <el-form-item prop="pwd">
                        <el-input v-model.trim="data.pwd" type="password" placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item prop="secpwd">
                        <el-input type="password" v-model.trim="secpwd" placeholder="请确认密码"></el-input>
                    </el-form-item>
                    <el-button type="primary" @click="submit">确认</el-button>
                </el-form>
            </div>
        </el-card>
        <el-card class="box-card" v-else>
            <div slot="header" class="clearfix">
                <span>找回密码</span>
            </div>
            <div class="input-div">
                <span style="float: left">请输入邮箱</span>
                <el-form :model="data" :rules="rules" ref="ruleForm">
                    <el-form-item prop="email">
                        <el-input v-model.trim="data.email" placeholder="请输入邮箱" :disabled="checked"></el-input>
                    </el-form-item>
                    <el-form-item prop="code" v-if="checked">
                        <el-input v-model.trim="data.code" style="width: 72%" placeholder="请输入验证码" maxlength="6"></el-input>
                        <el-button type="primary" style="float: right" @click="getCode" :disabled="codeDisabled">{{codeMsg}}</el-button>
                    </el-form-item>
                    <el-button type="primary" @click="check">下一步</el-button>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
import qs from 'qs'
export default {
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (this.secpwd !== this.data.pwd) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
        return {
            // 是否禁用按钮
            codeDisabled: false,
            // 倒计时秒数
            countdown: 120,
            // 按钮上的文字
            codeMsg: '发送',
            // 定时器
            timer: null,
            pass: false,
            checked: false,
            data: {
                email: '',
                code: '',
                pwd: ''
            },
            secpwd: '',
            rules: {
                email: [
                    { required: true, type: 'email', message: '请输入正确邮箱', trigger: 'blur' }
                ],
                code: [
                    { required: true, max: 6, min: 6, message: '请输入验证码', trigger: 'blur' }
                ],
                pwd: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 8, max: 15, message: '长度在8到15位', trigger: 'blur' },
                    { pattern: /(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{8,15}$/, message: '密码8~15位，至少包含字母与数字' }
                ],
                secpwd: [
                    { validator: validatePass, trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        async getCode() {
                const { data: res } = await this.$http.get('login/getCode', {
                    params: {
                        email: this.data.email
                    }
                })
                if (res.code === 200) {
                    this.checked = true
                } else if (res.code === 400) {
                    this.$message.error('邮箱不存在')
                } else {
                    this.$message.error('错误，稍后重试')
                }
                if (!this.timer) {
                    this.codeDisabled = true
                    this.timer = setInterval(() => {
                        if (this.countdown > 0 && this.countdown <= 120) {
                        this.countdown--
                        if (this.countdown !== 0) {
                            this.codeMsg = this.countdown + 's'
                        } else {
                            clearInterval(this.timer)
                            this.codeMsg = '发送'
                            this.countdown = 120
                            this.timer = null
                            this.codeDisabled = false
                        }
                    }
                }, 1000)
            }
        },
        async check() {
            this.$refs['ruleForm'].validate(async valid => {
                if (valid) {
                    if (!this.checked) {
                        this.getCode()
                        } else {
                            const { data: res } = await this.$http.get('login/verifyCode', {
                                params: {
                                    email: this.data.email,
                                    code: this.data.code
                                }
                            })
                            if (res.code === 200) {
                                this.pass = true
                                this.checked = false
                                return
                            }
                            if (res.code === 400) this.$message.error('验证码错误')
                            if (res.code === 401) this.$message.error('验证码不存在或服务器错误，请重试')
                    }
                }
            })
        },
        submit () {
            this.$refs['ruleForm'].validate(async valid => {
                if (valid) {
                    const { data: res } = await this.$http.post('user/pwd', qs.stringify(this.data))
                    console.log(res)
                    if (res.code === 200) {
                        this.$message.success('成功，跳转至主页')
                        this.$router.push('/')
                    } else {
                        this.$message.error('错误，请重试')
                    }
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>

  .maindiv{
      width: 100%;
      height: 500px;

  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    max-width: 480px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 200px;
  }

  .mail-input{
      max-width: 285px;
      margin: 5px 0;
  }

    .code-input{
      max-width: 210px;
      padding-right: 5px;
      padding-bottom: 10px;
  }

  .input-div{
      max-width: 300px;
      align-items: center;
      margin-left: auto;
      margin-right: auto;
  }

  .pwd-input{
      max-width: 285px;
      margin: 5px 0;
  }
</style>
