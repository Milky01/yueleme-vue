<template>
    <el-container id="sec-container">
        <el-header id="sec-header">
            <div id="top-container">
                <div id="left">
                    <h5>广场</h5>
                    <span>发现您的活动</span>
                </div>
            </div>
        </el-header>
        <el-main id="sec-main">
            <!-- <div id="mainDiv"> -->
                <div id="breadcrumb">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>活动详情</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <!-- <div > -->
                    <el-row :gutter="24">
                        <el-col :xl="16" :lg="16" :md="14" :sm="24" :xs="24">
                            <div id="detail-left">
                                <div id="detail-left-1">
                                    <p>{{activity.title}}</p>
                                    <span>{{activity.ptime | updateTime}}</span>
                                </div>
                                <ul id="detail-left-2">
                                    <li>
                                        <span>活动时间：</span>
                                        <!-- <a>{{activity.atime}}</a> -->
                                    </li>
                                    <li>
                                        <span></span>
                                    </li>
                                    <li>
                                        <!-- <span>活动时间：</span> -->
                                        <a>{{activity.atime}}</a>
                                    </li>
                                    <li>
                                        <span></span>
                                    </li>
                                    <li v-if="disabled==false">
                                        <el-popover
                                            v-if="activity.status==0"
                                            placement="bottom"
                                            title="联系方式"
                                            width="200"
                                            trigger="manual"
                                            :content="contact"
                                            v-model="contactVisible">
                                            <el-button type="success" slot="reference" @click="getContact">联系方式</el-button>
                                        </el-popover>
                                    </li>
                                    <li>
                                        <el-button v-if="disabled==true" :disabled="disabled" type="info" @click="changeStatus">已完成</el-button>
                                        <el-button v-if="disabled==false" :disabled="disabled" type="info" @click="changeStatus">已完成</el-button>
                                    </li>
                                </ul>
                            </div>
                        </el-col>
                        <el-col :xl="4" :lg="6" :md="8" class="hidden-sm-and-down">
                            <div id="detail-right">
                                <div id="detail-right-1">
                                    <span>活动发布者</span>
                                    <dl>
                                        <dt><router-link :to="'/user/' + activity.user.uid"><img :src="BASE_URL + activity.user.avatar" id="avatar-2"></router-link></dt>
                                        <dd><h6>{{activity.user.uname}}</h6></dd>
                                    </dl>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row >
                        <el-col  :xl="14" :lg="14" :md="24" :sm="24" :xs="24">
                        <div id="detail-left-3">
                            <span>活动描述</span>
                            <p>{{activity.detail}}</p>
                            <div id="detail-left-3-pics">
                                <el-carousel height="400px" indicator-position="outside">
                                    <el-carousel-item v-for="pid in activity.pic.trim().split(' ')" :key="pid">
                                        <img class="activity-pics" :src="BASE_URL + pid">
                                    </el-carousel-item>
                                </el-carousel>
                            </div>
                        </div>
                        </el-col>
                    </el-row>
                            <!-- </div> -->
                <!-- </div> -->
            <!-- </div> -->
        </el-main>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            disabled: true,
            contactVisible: false,
            aid: this.$route.params.aid,
            visible: false,
            login: false,
            contact: '',
            activity: {}
        }
    },
    created() {
        this.getActivity()
        if (window.sessionStorage.getItem('token') !== null) {
             this.login = true
        } else this.login = false
    },
    methods: {
        async getActivity() {
            const { data: res } = await this.$http.get('activity/' + this.aid)
            if (res.code === 200) {
                this.activity = res.data
                if (this.login) {
                    if (window.sessionStorage.getItem('uid') === this.activity.user.uid + '') {
                        this.disabled = false
                    }
                    if (this.activity.status === 1) this.disabled = true
                }
            } else {
                this.$message.error('活动不存在，跳转至主页')
                this.$router.push('/activities')
            }
        },
        async getContact() {
            if (this.contactVisible) {
                this.contactVisible = false
                return
            }
            if (!this.login) {
                this.visible = true
                this.$message.error('请登录')
            } else {
                if (this.contact !== '') {
                    this.contactVisible = true
                    return
                }
               const { data: res } = await this.$http.get('contact/' + this.aid)
               if (res.code !== 200) {
                   this.$message.info('请刷新页面重新登陆')
               } else {
                    this.contact = res.data
                    this.contactVisible = true
               }
            }
        },
        async changeStatus() {
            const { data: res } = await this.$http.put('activity/' + this.aid)
            if (res.code === 200) {
                this.$message.success('成功')
                this.disabled = true
                this.contactVisible = false
            } else if (res.code === 400) {
                this.$message.error('活动已经结束，请刷新查看')
            } else {
                this.$message.error('失败，请稍后重试')
            }
        }
    }
}
</script>

<style lang="less" scoped>
#sec-container{
    align-items: center;
}

#sec-header{
    background-color: white;
    width: 100%;
    height: 90px;
    background: #ffffff;
    box-shadow: 0 15px 15px 0 rgba(15,37,64,0.1);
    animation: skyset 300ms linear;
    display: flex;
}

#sec-main{
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

// #mainDiv{
//     width: 1200px;
//     margin-left: auto;
//     margin-right: auto;
// }

#breadcrumb{
    margin: 30px 0 30px 0;
}

.el-breadcrumb{
    font-size: 15px;
}

#detail-left{
    text-align: left;
    float: left;
    // width: 900px;
    // height: 1200px;
}

#detail-right{
    font-family: PingFangSC-Regular;
    float: right;
    width: 300px;
    // height: 400px;
    span{
        font-size: 16px;
        color: #6c6c6c;
    }
}

#detail-right-1 {
    font-size: 14px;
    margin-bottom: 20px;
    padding-left: 10px;
}

#avatar-2{
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    display: block;
}

#detail-right-1 dl {
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    margin-left: 10px;
}

#detail-right-1 dd {
    width: 100%;
}

#detail-right-1 h6 {
    text-align: left;
    font-size: 20px;
    font-weight: 500;
}

#detail-left-1{
    padding-bottom: 15px;
    width: 100%;
    padding-left: 20px;
    p{
        font-family: PingFangSC-Medium;
        font-size: 30px;
        color: #333333;
        line-height: 10px;
    }
    span{
        font-size: 15px;
        color: #999999;
    }
}

#detail-left-2 span, #detail-left-3 span {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #666666;
    line-height: 16px;
    width: 80px;
    text-align: center;
}

#detail-left-2{
    padding-left: 20px;
    li {
        display: block;
        padding-bottom: 16px;
        word-wrap: break-word;
        line-height: 30px;
    }
    a {
        font-family: PingFangSC-Medium;
        font-size: 40px;
        color: #FF7474;
        letter-spacing: 0;
        line-height: 0px;
    }
}

#detail-left-3{
    margin-top: 50px;
    padding-left: 20px;
    p {
        font-size: 24px;
    }
}

#detail-left-3-pics{
    margin-top: 50px;
    align-items: center;
    text-align: center;
}

.activity-pics{
    max-width: 90%;
    max-height: 100%;
    height: 800px;
}

.logo{
    position: absolute;
    left: 50px;
}
</style>
