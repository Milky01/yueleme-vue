<template>
    <el-container>
        <el-header>
            <div id="top-container">
                <div id="left">
                    <h5>广场</h5>
                    <span>发现您的活动</span>
                </div>
                <div id="right">
                    <el-button type="primary" @click="toPublishPage">发布活动</el-button>
                </div>
            </div>
        </el-header>
        <el-main>
            <!-- <div id="mainDiv"> -->
                <el-row :gutter="24" id="mainDiv" style="max-width: 2000px; margin: 0 auto">
                <el-col  :xl="{span: 16, offset: 4}" :lg="{span: 18, offset: 3}" :md="{span: 20, offset: 2}" :sm="{span: 20, offset: 2}" :xs="24">
                <!--  -->
                <div style="margin-top: 15px; margin-bottom: 20px;">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" @keyup.enter.native="getActivities" clearable @clear="getActivities">
                        <el-button slot="append" icon="el-icon-search" @click="getActivities"></el-button>
                    </el-input>
                </div>
                <el-row :gutter="24">
                    <el-col :xl="6" :lg="6" :md="8" :sm="12" :xs="12" v-for="activity in activities" :key="activity.aid">
                        <router-link target="_blank" :to="{path:'/activities/'+activity.aid}">
                        <el-card :body-style="{ padding: '0px' }">
                            <img :src="BASE_URL + activity.pic.split(' ')[0]" class="content-list-image">
                            <div style="padding: 0px 14px 14px 14px;">
                                <p>{{activity.title}}</p>
                                <span>活动时间：{{activity.atime}}</span>
                                <div class="content-list-bottom">
                                    <br/><br/>
                                    <span>{{activity.user.uname}}</span><br/>
                                    <span>{{activity.ptime | updateTime}}</span>
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
                <!--  -->
                </el-col>
                </el-row>
            <!-- </div> -->
        </el-main>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            activities: [],
            total: 0,
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 16
            }
        }
    },
    created() {
        this.getActivities()
    },
    methods: {
        async getActivities() {
            const { data: res } = await this.$http.get('activities', {
                params: this.queryInfo
            })
            console.log(res)
            if (res.code === 200) {
                this.activities = res.data.list
                this.total = res.data.total
            } else {
                this.$message.error('获取活动失败，请刷新重试')
            }
        },
        handleCurrentChange(val) {
            this.queryInfo.pagenum = val
            this.getActivities()
        },
        toPublishPage() {
            if (!window.sessionStorage.getItem('token')) {
                this.$message.error('发布活动，请先登陆')
            }
            this.$router.push({ path: '/publish' })
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
    // width: 70%;
    // margin-left: auto;
    // margin-right: auto;
    .content-list-image{
        width: 100%;
        height: 200px;
    }
}

.el-col{
    margin-bottom: 40px;
    text-align: left;
    p {
        height: 25px;
    }
}

.content-list-bottom{
    font-family: PingFangSC-Regular;
    font-size: 13px;
    color: #C6C6C6;
    display: block;
    text-align: left;
}

</style>
