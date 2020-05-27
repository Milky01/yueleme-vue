<template>
    <div>
    <el-container>
        <el-header>
            <div id="top-container">
                <div id="left">
                    <h5>发布</h5>
                    <span>发布您的活动</span>
                </div>
            </div>
        </el-header>
        <el-main>
            <div id="mainDiv">
                <el-form :model="activity" :rules="rules" ref="activity" label-width="100px">
                    <el-form-item label="活动名称" prop="title">
                        <el-input v-model="activity.title"></el-input>
                    </el-form-item>
                    <el-form-item label="活动描述" prop="detail">
                        <el-input type="textarea" v-model="activity.detail" maxlength="200"></el-input>
                    </el-form-item>
                    <el-form-item label="联系方式" prop="contact">
                        <el-input v-model="activity.contact"></el-input>
                    </el-form-item>
                    <el-form-item label="活动时间" required>
                        <el-col :span="11">
                            <el-form-item prop="atime">
                                <el-date-picker type="datetime" placeholder="选择日期" :picker-options="pickerOptions0" v-model="activity.atime" style="width: 100%;" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="图片" prop="files">
                        <el-upload
                            ref="upload"
                            :headers="myHeaders"
                            class="upload-demo"
                            :auto-upload="true"
                            :action="BASE_URL"
                            :before-upload="handleBefore"
                            :on-remove="handleRemove"
                            :on-success="handleSuccess"
                            list-type="picture-card"
                            :limit="4"
                            accept=".jpg,.jpeg,.png"
                            :disabled="disabled"
                            >
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传四张jpg/png文件，且不超过2M</div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('activity')">发布</el-button>
                        <el-button @click="resetForm('activity')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-main>
    </el-container>
    </div>
</template>

<script>
import qs from 'qs'
var token = window.sessionStorage.getItem('token')
export default {
    data() {
        return {
            myHeaders: { Authorization: token },
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7
                }
            },
            disabled: false,
            activity: {
                uid: '',
                title: '',
                detail: '',
                atime: '',
                contact: '',
                pic: ''
            },
            rules: {
                title: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],
                detail: [
                    { required: true, message: '请输入活动描述', trigger: 'blur' },
                    { min: 2, max: 200, message: '长度在 2 到 200 个字符', trigger: 'blur' }
                ],
                contact: [
                    { required: true, message: '请输入联系方式', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                ],
                atime: [
                    { required: true, message: '请选择活动时间', trigger: 'change' }
                ]
            }
        }
    },
    beforeRouteEnter (to, from, next) {
        if (window.sessionStorage.getItem('token') !== null) {
            next()
        }
    },
    methods: {
        submitForm(formname) {
            this.$refs[formname].validate(async (valid) => {
                if (!valid) {
                    this.$message.error('请填写表格')
                    return false
                } else {
                    if (this.$refs.upload.uploadFiles.length === 0) {
                        this.$message.error('请上传图片')
                        return false
                    }
                    this.activity.uid = window.sessionStorage.getItem('uid')
                    const { data: res } = await this.$http.post('activity', qs.stringify(this.activity))
                    if (res.code === 200) {
                        this.$message.success('发布成功')
                        this.$router.push('/activities/' + res.data.aid)
                    } else {
                        this.$message.error('发布失败，请刷新或稍后重试')
                    }
                }
            })
        },
        handleRemove(file, filelist) {
            this.fileList = filelist
        },
        handleSuccess(res, file, filelist) {
            if (res.code === 200) {
                this.disabled = false
                this.activity.pic += (res.data + ' ')
            } else {
                this.$message.error('上传失败，请刷新或稍后重试')
            }
        },
        handleBefore(file) {
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
            // this.disabled = true
            return isPG && isLt2M
        }
    }
}
</script>

<style lang="less" scoped>

.el-container{
    align-items: center;
}

.el-header{
    background-color: white;
    width: 100%;
    height: 90px;
    background: #ffffff;
    box-shadow: 0 15px 15px 0 rgba(15,37,64,0.1);
    animation: skyset 300ms linear;
    display: flex;
}

.el-main{
    margin-top: 5px;
    width: 95%;
    height: auto;
    align-items: center;
    text-align: center;
}

#left{
    display: flex;
    -webkit-box-align: center;
    align-items: center;
}

#right{
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    margin-left: auto;
}

#top-container{
    width: 80%;
    display: flex;
    margin-left: auto;
    margin-right: auto;
        h5 {
        font-family: PingFangSC-Regular;
        font-size: 24px;
        color: #424E66;
        line-height: 24px;
        display: inline-block;
        padding-right: 10px;
        border-right: 1px solid #E5E5E5;
        }
        span {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #666666;
        line-height: 24px;
        padding-left: 10px;
    }
}

#mainDiv{
    width: 1200px;
    margin-left: auto;
    margin-right: auto;
    .content-list-image{
        width: 100%;
        height: 200px;
    }
}

</style>
