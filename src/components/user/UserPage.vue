<template>
    <div id="main">
        <div id="top">
        </div>
        <div id="center">
            <div id="user">
                <div id="user-avatar"><img class="img-cover" :src="BASE_URL + user.avatar"></div>
                <div id="user-name">{{user.uname}}</div>
                <div id="user-edit" v-if="isLoginUser">
                        <el-button type="primary" @click="dialogVisible = true">编辑</el-button>
                        <el-button type="success" @click="toChangePwd">修改密码</el-button>
                        <el-dialog
                        title="个人资料"
                        :visible.sync="dialogVisible"
                        width="85%">
                                <el-form :model="form" :rules="rules" ref="user" label-width="100px">
                                    <el-form-item label="头像" prop="file">
                                        <el-upload
                                            class="avatar-uploader"
                                            :action="BASE_URL"
                                            :show-file-list="false"
                                            :on-success="handleSuccess"
                                            :before-upload="beforeUpload">
                                            <img :src="BASE_URL + form.avatar" class="avatar">
                                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div>
                                        </el-upload>
                                    </el-form-item>
                                    <el-form-item label="学院" prop="dept">
                                        <el-input v-model="form.dept"></el-input>
                                    </el-form-item>
                                    <el-form-item label="性别" prop="gender">
                                        <el-select v-model="form.gender" placeholder="请选择性别">
                                            <el-option label="男" :value="1"></el-option>
                                            <el-option label="女" :value="0"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" @click="submitForm('user')">修改</el-button>
                                        <el-button @click="cancleEdit">取消</el-button>
                                    </el-form-item>
                                </el-form>
                        </el-dialog>
                    </div>
                <div id="user-detail">
                    <p>{{user.gender==1?'男':'女'}}</p>
                    <p>{{user.dept}}</p>
                </div>
            </div>
        </div>
        <div id="bottom">
            <div id="nav"><p>活动</p></div>
            <div v-if="empty" id="emptyAct">喵喵喵喵，这里什么也没有</div>
            <div v-else>
                <el-row :gutter="24" style="max-width: 2000px; margin: 0 auto" >
                    <el-col :xl="6" :lg="6" :md="8" :sm="12" :xs="24" v-for="activity in activities" :key="activity.aid">
                        <router-link target="_blank" :to="{path:'/activities/'+activity.aid}">
                        <el-card :body-style="{ padding: '0px' }">
                            <img :src="BASE_URL + activity.pic.split(' ')[0]" class="content-list-image">
                            <div style="padding: 0px 14px 14px 14px;">
                                <p>{{activity.title}}</p>
                                <span>活动时间：{{activity.atime}}</span>
                                <div class="content-list-bottom">
                                    <br/><br/>
                                    <span>{{activity.user.uname}}</span><br/>
                                    <span>30分钟前</span>
                                </div>
                            </div>
                        </el-card>
                        </router-link>
                    </el-col>
                </el-row>
                <div>
                    <el-pagination
                    @current-change="handleCurrentChange"
                    :page-size="queryInfo.pagesize"
                    layout="prev, pager, next, jumper"
                    :total="total">
                    </el-pagination>
                </div>
            </div>

        </div>

            <el-dialog
            title="密码"
            :visible.sync="pwdDialog"
            style="max-width: 1000px; margin: 0 auto"
            width="90%">
                    <Pwd ref="changePwd" style="max-width: 1000px; margin: 0 auto"></Pwd>
            </el-dialog>
    </div>

</template>

<script>
import Pwd from './Pwd.vue'
import qs from 'qs'
export default {
    components: {
        Pwd
    },
    data() {
        return {
            pwdDialog: false,
            dialogVisible: false,
            isLoginUser: false,
            user: {},
            form: {},
            activities: [],
            empty: true,
            total: 0,
            queryInfo: {
                uid: this.$route.params.uid,
                pagenum: 1,
                pagesize: 12
            },
            rules: {
                dept: [
                    { required: true, message: '请输入学院', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                ],
                gender: [
                    { required: true, message: '请选择性别', trigger: 'change' }
                ]
            }
        }
    },
    created() {
        this.checkLoginUser(this.$route.params.uid)
        this.getActivities()
        console.log(this.activities)
    },
    methods: {
        async toChangePwd() {
            const { data: res } = await this.$http.get('user/email')
            if (res.code === 200) {
                this.pwdDialog = true
                setTimeout(() => {
                    this.$refs.changePwd.data.email = res.data
                    this.$refs.changePwd.checked = true
                }, 0)
            } else {
                this.$message.error('请重新登陆重试')
            }
        },
        submitForm(formname) {
            this.$refs[formname].validate(async (valid) => {
                if (!valid) {
                    this.$message.error('请填写表格')
                    return false
                } else {
                    const { data: res } = await this.$http.put('user', qs.stringify(this.form))
                    if (res.code === 200) {
                        this.user = res.data
                        this.form = JSON.parse(JSON.stringify(this.user))
                        this.dialogVisible = false
                        this.$emit('userInfoUpdate')
                        this.$message.success('修改成功，如无效可重新登陆查看')
                    }
                }
            })
        },
        async checkLoginUser(uid) {
           const { data: res } = await this.$http.get('check', {
               params: {
                   uid: uid
               }
           })
            this.user = res.data
           if (res.code === 200) {
                this.form = JSON.parse(JSON.stringify(this.user))
                this.isLoginUser = true
           } else {
                this.isLoginUser = false
           }
        },
        async getActivities() {
            const { data: res } = await this.$http.get('activities', {
                params: this.queryInfo
            })
            this.activities = res.data.list
            this.total = res.data.total
            if (this.activities.length !== 0) this.empty = false
        },
        handleCurrentChange(val) {
            this.queryInfo.pagenum = val
            this.getActivities()
        },
        handleSuccess(res, file, filelist) {
            this.form.avatar = res.data
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
            this.disabled = true
        },
        cancleEdit() {
            this.form = JSON.parse(JSON.stringify(this.user))
            this.dialogVisible = false
        }
    }
}
</script>

<style lang="less" scoped>
    #main{
        background-color: #fafafa;
    }

    #top{
        background: url(~@/assets/background.jpg) no-repeat center;
        background-size: cover;
        height: 478px;
        margin: 0 auto;
        position: relative;
    }

    #center{
        width: 100%;
        background: #ffffff;
        padding-bottom: 16px;
    }

    #user{
        width: 75%;
        margin: 0 auto;
        position: relative;
        display: flex;
    }

    #user-avatar{
        width: 160px;
        height: 160px;
        border-radius: 50%;
        overflow: hidden;
        position: absolute;
        top: -80px;
        left: 0;
        border: 2px solid #ffffff;
        background-size: cover;
    }

    .img-cover{
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
        object-fit: cover;
    }

    #user-name{
        font-family: PingFangSC-Semibold;
        font-size: 26px;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: justify;
        line-height: 24px;
        position: absolute;
        top: -34px;
        left: 190px;
    }

    #user-edit{
        position: absolute;
        top: 80px;
        left: 180px;
        display: flex;
    }

    #user-detail{
        margin-left: 180px;
        max-width: 518px;
        p {
            margin: 14px;
            font-family: PingFangSC-Semibold;
            font-size: 18px;
            color: #B9B9B9;
            line-height: 16px;
            text-align: left;
        }
    }

    #bottom{
        width: 70%;
        margin-left: auto;
        margin-right: auto;
    }

    #nav{
        text-align: center;
        font-family: PingFangSC-Semibold;
        font-size: 24px;
        color: gray;
        line-height: 14px;
        margin: 0 30px;
        padding-bottom: 20px;
        cursor: pointer;
    }

    .content-list-bottom{
        font-family: PingFangSC-Regular;
        font-size: 13px;
        color: #C6C6C6;
        display: block;
        text-align: left;
    }

    .content-list-image{
        width: 100%;
        height: 200px;
    }

    .el-col{
        margin-bottom: 40px;
        text-align: left;
        p {
            height: 25px;
        }
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 164px;
        height: 164px;
        display: block;
    }

    #emptyAct{
        height: 400px;
        text-align: center;
        font-family: PingFangSC-Semibold;
        font-size: 30px;
        color: gray;
    }
</style>
