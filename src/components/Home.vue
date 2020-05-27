<template>
    <el-container class="home_container">
        <!-- 头部区域 -->
        <el-header>
            <div class="logo">
                <router-link to="/">
                    <img src="../assets/logo.png" width="50px" height="50px">
                </router-link>
            </div>
            <template v-if="login">
                <div>
                    <div id="loginName"><span>{{user.uname}}</span></div>
                    <div id="avatar"><router-link :to="'/user/' + user.uid"><img :src="BASE_URL + user.avatar" id="touxiang"></router-link></div>
                    <div><el-button type="info" @click="logout" id="logoutButton">退出</el-button></div>
                </div>
            </template>
            <template v-else>
                <div>
                    <!-- 登陆弹出框 -->
                    <el-popover
                    placement="top"
                    width="300"
                    v-model="visible"
                    class="loginDialog"
                    >
                    <p>登陆</p>
                    <el-form :model="loginForm" status-icon ref="loginForm">
                    <el-form-item label="用户名">
                        <el-input v-model="loginForm.uname" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input type="password" v-model="loginForm.pwd" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitLoginForm()">登陆</el-button>
                        <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                    </el-form-item>
                    </el-form>
                    <router-link to="/user/findPassword"><el-link type="primary">忘记密码？</el-link></router-link>
                    <el-button type="primary" slot="reference" id="loginButton">登陆</el-button>
                    </el-popover>
                    <el-button type="info" @click="dialogVisible = true">注册</el-button>
                </div>
            </template>
            <!-- 注册卡片 -->
            <el-dialog
                title="个人资料"
                :visible.sync="dialogVisible"
                style="max-width: 1200px; margin: 0 auto; min-width:500px"
                width="85%">
                    <el-form :model="regForm" :rules="rules" ref="regForm" label-width="80px" style="max-width: 1000px; margin: 0 auto">
                        <el-form-item label="头像" prop="file">
                            <el-upload
                                ref="upload"
                                class="avatar-uploader"
                                :action="AVATAR_BASE_URL"
                                :show-file-list="false"
                                :on-success="handleSuccess"
                                :before-upload="beforeUpload">
                                <img v-if="regForm.avatar" :src="BASE_URL + regForm.avatar" class="uploadAvatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                            <span>只能上传jpg/png文件，且不超过2M</span>
                        </el-form-item>
                        <el-form-item label="用户名" prop="uname">
                            <el-input v-model="regForm.uname"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="pwd">
                            <el-input type="password" v-model="regForm.pwd"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="regForm.email"></el-input>
                        </el-form-item>
                        <el-form-item label="学院" prop="dept">
                            <el-input v-model="regForm.dept"></el-input>
                        </el-form-item>
                        <el-form-item label="性别" prop="gender">
                            <el-select v-model="regForm.gender" placeholder="请选择性别">
                                <el-option label="男" value="1"></el-option>
                                <el-option label="女" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitRegForm('regForm')">注册</el-button>
                            <el-button @click="resetForm('regForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-dialog>
        </el-header>
        <!-- 页面主体区域 -->
            <el-main>
                <router-view @userInfoUpdate="updateUserInfo" :key="key" :user="user"></router-view>
            </el-main>
            <div class="back2top" @click="backtop"><i class="el-icon-caret-top"></i></div>
            <div class="back" @click="goback"><i class="el-icon-caret-left"></i></div>
    </el-container>
</template>

<script>
import qs from 'qs'
export default {
    computed: {
        key() {
            return this.$route.path + Math.random()
        }
    },
    data() {
        var checkUname = (rule, value, callback) => {
                if (value.match(/^[-_a-zA-Z0-9]{2,10}$/) === null) {
                    callback(new Error('用户名由英文数字下划线组成'))
                } else {
                    callback()
                }
            }
        var checkUnameExist = async (rule, value, callback) => {
            const { data: res } = await this.$http.get('/exist', {
                params: {
                    uname: value
                }
            })
            if (res.code === 201) {
                callback(new Error('用户名已存在'))
            } else if (res.code === 200) {
                callback()
            } else {
                this.$message.warning('服务器出现问题，可能导致注册失败')
            }
        }
        return {
            dialogVisible: false,
            visible: false,
            login: false,
            user: {
                uid: '',
                uname: '',
                avatar: ''
            },
            loginForm: {
                uname: '',
                pwd: ''
            },
            disabled: false,
            regForm: {
                uname: '',
                pwd: '',
                avatar: '',
                dept: '',
                gender: '',
                email: ''
            },
            rules: {
                uname: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' },
                    { validator: checkUname, message: '用户名仅由英文 数字 下划线 和 - 组成', trigger: 'change' },
                    { validator: checkUnameExist, message: '用户名已存在', trigger: 'blur' }
                ],
                pwd: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 8, max: 15, message: '长度在 8 到 15 个字符', trigger: 'blur' },
                    { pattern: /(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{8,15}$/, message: '密码8~15位，至少包含字母与数字', trigger: 'blur' }
                ],
                dept: [
                    { required: true, message: '请输入学院', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
                ],
                gender: [
                    { required: true, message: '请选择性别', trigger: 'change' }
                ]
            }
        }
    },
    created() {
        this.user.avatar = window.sessionStorage.getItem('avatar')
        this.user.uname = window.sessionStorage.getItem('uname')
        this.user.uid = window.sessionStorage.getItem('uid')
        this.login = true
        if (this.user.avatar === null || this.user.uname === null || this.user.uid === null) {
            window.sessionStorage.clear()
            this.login = false
        }
    },
    methods: {
        goback() {
            this.$router.back()
        },
        backtop() {
            window.scrollTo(0, 0)
        },
        logout() {
            window.sessionStorage.clear()
            this.login = false
            this.$router.go(0)
        },
        handleSuccess(res, file, filelist) {
            this.regForm.avatar = res.data
        },
        beforeUpload(file) {
            const isJPG = file.type === 'image/jpeg'
            const isPNG = file.type === 'image/png'
            const isPG = (isJPG || isPNG)
            const isLt2M = file.size / 1024 / 1024 < 4
            if (!isPG) {
                this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 4MB!')
            }
            return isPG && isLt2M
        },
        submitRegForm(formname) {
            this.$refs[formname].validate(async (valid) => {
                if (!valid) {
                    this.$message.error('请填写表格')
                    return false
                } else {
                    if (this.$refs.upload.uploadFiles.length === 0) {
                        this.$message.error('请上传图片')
                        return false
                    }
                    const { data: res } = await this.$http.post('user', qs.stringify(this.regForm))
                    if (res.code === 200) {
                        window.sessionStorage.setItem('token', res.data.token)
                        this.setUserInfo(res)
                        this.$router.go(0)
                    } else {
                        this.$message.warning('请刷新或稍后再试，仍有问题请联系管理员')
                    }
                }
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
        },
        async submitLoginForm() {
            try {
                const { data: res } = await this.$http.post('login', qs.stringify(this.loginForm))
                if (res.code === 200) {
                    window.sessionStorage.setItem('token', res.data.token)
                    this.setUserInfo(res)
                    this.$router.go(0)
                    return
                }
                if (res.code === 400) this.$message.error(res.msg)
                else this.$message.warning('请刷新或稍后再试，仍有问题请联系管理员')
            } catch (error) {
                this.$message.warning('请刷新或稍后再试，仍有问题请联系管理员')
            }
        },
        setUserInfo(res) {
            this.user.avatar = res.data.avatar
            this.user.uname = res.data.uname
            this.user.uid = res.data.uid
            window.sessionStorage.setItem('uname', res.data.uname)
            window.sessionStorage.setItem('avatar', res.data.avatar)
            window.sessionStorage.setItem('uid', res.data.uid)
            this.login = true
            this.dialogVisible = false
        },
        async updateUserInfo() {
            const { data: res } = await this.$http.get('user/' + this.user.uid)
            if (res.code === 200) {
                this.setUserInfo(res)
            }
        }
    }
}
</script>

<style lang="less" scoped>
.el-header {
    background-color: #507385;
    color: #333;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
        display: flex;
        align-items: center;
        margin-left: auto;
    }
}

.el-main {
    padding: 0;
    background-color:white;
    color: #333;
    text-align: center;
    align-items: center;
}

body > .el-container {
    margin-bottom: 40px;
}

.el-form-item{
    text-align: center;
}

#loginButton{
    margin-right: 10px;
}

#logoutButton{
    margin-right: 10px;
    margin-left: 10px;
}

#loginName{
    margin-right: 10px;
}

#avatar{
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.bg-purple-dark {
background: red;
}

#touxiang{
    width: 100%;
    height: 100%;
    border-radius: 50%;
}

.logo{
    position: absolute;
    left: 50px;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 218px;
    height: 218px;
    line-height: 218px;
    text-align: center;
}
.uploadAvatar {
    max-width: 218px;
    max-height: 218px;
    width: 218px;
    height: 218px;
    display: block;
}

.avatar-uploader{
    margin: auto;
    width: 218px;
    height: 218px;
    border: 1px dashed #d9d9d9;
    border-radius: 109px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.back2top{
    right: 100px;
    bottom: 150px;
    position: fixed;
    background-color: #fff;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: #409eff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 0 6px rgba(0,0,0,.12);
    cursor: pointer;
    z-index: 5;
}

.back{
    right: 100px;
    bottom: 100px;
    position: fixed;
    background-color: #fff;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: #409eff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 0 6px rgba(0,0,0,.12);
    cursor: pointer;
    z-index: 5;
}
</style>
