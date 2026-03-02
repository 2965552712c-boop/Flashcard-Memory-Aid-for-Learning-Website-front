<script setup>
import { ref, onMounted, inject } from 'vue';
import { ElMessage } from 'element-plus';
import router from '@/router'

const $request = inject('request')
const key = ref('')

const set = (id) => {
    console.log('点击的卡片集为', id)
    router.push({ path: '/share',query: { id: id }})
}

const search = () => {
    console.log(key.value)
    const url = '/cardGroup/search/' + key.value
    $request.get(url)
        .then(res => {
            if (res.code === '200') {
                console.log('搜索成功:', res)
                cards.value = res.data
            } else if (res.code === '404') {
                ElMessage.error(res.msg)
                console.log(res)
            }
        })
        .catch(err => {
            console.log(err)
        })
}

const cards = ref([]);

</script>

<template>
    <div id="mm">
        <el-row justify="center" class="top">
            <div class="searchcontainer">
                <input v-model="key" type="text" placeholder="搜索" class="search" @keydown.enter="search()">
                <button @click="search" class="btnsearch">搜索</button>
            </div>
        </el-row>
        <el-row justify="start">
            <el-col v-for="item in cards" :key="item.id" :xs="12" :sm="12" :lg="8" style="margin-bottom: 25px;">
                <div class="card" @click="set(item.id)">
                    <el-card :index="item.id" class="box-card" style="">
                        <div class="header">
                            <span>{{ item.name }}</span>
                            <div class="radius5" @click.stop
                                style="background-color:transparent;float: right; padding: 3px 0;height: 25px; width: 30px;"
                                type="text">
                            </div>
                        </div>
                        <el-row style="margin-top: 15px">
                            <el-col :span="18">
                                <span style="font-size: medium">卡片:{{ item.cardTotal }}</span>
                            </el-col>
                            <el-col :span="6" style="display: flex;align-items: center;">
                                <el-icon :size="16" >
                                    <Star />
                                </el-icon> 
                                <span style="font-size: medium;margin-bottom: 3px;margin-left: 3px;">{{ 5 }}</span>
                            </el-col>
                        </el-row>
                    </el-card>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<style scoped>
@import "../style/index.css";

.top {
    height: 30%;
}

/* 外部盒子,控制搜索框在页面中的位置 */
.searchcontainer {
    display: flex;
    justify-content: center;
    /*水平方向居中*/
    align-items: center;

}

/* 搜索框样式 */
.search {
    width: 500px;
    height: 60px;
    background-repeat: no-repeat;
    border-radius: 30px 0px 0px 30px;
    padding-left: 50px;
    background-position: 10px 10px;
    color: darkgray;
    font-size: 18px;
    border: none;
}

/* 搜索框获得焦点时样式 */
.search:focus {
    outline: #d8d8d8 solid 1px;
}

/* 搜索按钮样式 */
.btnsearch {
    width: 90px;
    height: 63px;
    border: none;
    background-color: #7477ff;
    color: #fff;
    border-radius: 0px 20px 20px 0px;
    font-size: 20px;
    cursor: pointer;
}

/* 按钮悬浮时样式 */
.btnsearch:hover {
    background-color: #7477ff;
}

.card {
    width: 92%;
}



.el-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}

.el-row .el-card {
    min-width: 100%;
    height: 100%;
    /* margin-right: 20px; */
    transition: all .5s;
}

.el-form-item {
    margin-bottom: 0 !important;
}

.box-card {
    .header {
        position: relative;

        .label {
            padding: 0 3px;
            background-color: #fdf0da;
            color: #f19901;
        }
    }
}
</style>