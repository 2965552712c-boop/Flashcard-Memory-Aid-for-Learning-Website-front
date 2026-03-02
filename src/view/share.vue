<script setup>
import '@wangeditor/editor/dist/css/style.css'
import { ref, onMounted, computed, inject } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import { ElMessage } from 'element-plus'

const $request = inject('request')
const $route = useRoute()
const isActive = ref(-1)
const showDialogVisible = ref(false) // 显示卡片弹窗
const currentChapterId = ref(1) //当前选中的目录id
const model = ref('0') // 1有该分享码，2有groupId ，0无该分享码
const code = ref('') //分享码
const cardGroupId = ref(0) //卡片集id


const shareCode = () => {
    let url = '/shareList/' + code.value
    $request.get(url, { params: { code: $route.query.code } })
        .then(res => {
            if (res.code === '200') {
                console.log('获取卡片集成功', res)
                cardGroup.value = res.data
                model.value = '1'
            } else if (res.code === '404') {
                console.log(res)
                model.value = '0'
            }
        })
        .catch(e => {
            console.log('获取卡片集失败')
            console.log(e)
        })
}

const getCardGroup = (id) => {
    let url = '/cardGroup/collect/' + cardGroupId.value
    $request.get(url)
        .then(res => {
            if (res.code === '200') {
                console.log('获取卡片集成功', res)
                cardGroup.value = res.data
                model.value = '2'
            } else if (res.code === '404') {
                console.log(res)
                model.value = '0'
            }
        })
        .catch(e => {
            console.log('获取卡片集失败')
            console.log(e)
        })
}


onMounted(() => {

    code.value = $route.query.code
    cardGroupId.value = $route.query.id
    if (code.value) {
        model.value = '1'
        console.log('分享码:', code.value)
        shareCode()
    } else if (cardGroupId.value) {
        model.value = '2'
        console.log('卡片集id:', cardGroupId.value)
        getCardGroup()
    } else {
        model.value = '0'
        return
    }

})

const changeCard = (index, type) => {

    if (type === 10) return

    if (isActive.value != index) {
        isActive.value = index //如果点击的div没有处于置亮状态，则置亮
    } else {
        isActive.value = -1
    }
}

const cardData = ref({
    id: 1,
    chapter: 1,
    headline: "",
    content: "",
    type: 0,
})

const cardGroup = ref({
    id: 1,
    name: "微机原理",
    chapterTotal: 10,
    cardTotal: 10,
    isPublic: 0,
    chapterList: [{
        id: 1,
        name: "目录1",
        cartTotal: 3,
        total: 20,
        cardList: [{
            id: 1,
            type: 0,
            headline: "测试1",
            content: "测试内容"
        }, {
            id: 2,
            type: 1,
            headline: "测试2",
            content: "测试内容"
        }, {
            id: 3,
            type: 2,
            headline: "测试3",
            content: "测试内容"
        }, {
            id: 4,
            type: 1,
            headline: "测试4",
            content: "测试内容"
        }]
    }, {
        id: 2,
        name: "目录2",
        cartTotal: 2,
        cardList: [{
            id: 1,
            type: 1,
            headline: "测试1",
            content: "测试内容"
        }, {
            id: 2,
            type: 1,
            headline: "测试2",
            content: "测试内容"
        }, {
            id: 3,
            type: 1,
            headline: "测试3",
            content: "测试内容"
        }, {
            id: 4,
            type: 1,
            headline: "测试4",
            content: "测试内容"
        }, {
            id: 5,
            type: 1,
            headline: "测试5",
            content: "测试内容"
        }]
    }],

})


// 目录的样式
const rowStyle = ({ row, rowIndex }) => {
    if (currentChapterId.value === row.id) {
        // 此处返回选中行的样式对象，按需设置
        return {
            'background-color': '#f5f7fb',
            'font-size': '14px',
            'color': '#000000',
            'height': '20px'
        }
    } else {
        return {
            'background-color': '#f5f7fb',
            'font-size': '14px',
            'color': '#606266',
            'height': '20px'
        }
    }

}

const changeCurrentRow = (row, column, event) => {
    if (currentChapterId.value === row.id) return
    currentChapterId.value = row.id
    // do something
}

// 跳转目录
const goto = (id) => {
    var item = document.querySelector("#ml" + id);
    item.scrollIntoView();
}

const back = () => {
    console.log('返回')
    router.push({ path: '/list/我的卡片集' })
}


const pageList = computed(() => {
    const pageList = []
    cardGroup.value.chapterList.forEach((chapter, index) => {
        const pages = []
        chapter.cardList.forEach((card, iindex) => {

            const page = Math.floor(iindex / 3)//3代表3条为一行，随意更改
            if (!pages[page]) {
                pages[page] = []
            }

            pages[page].push(card)
        })
        console.log('长度为:', pages.length)
        if (pages.length === 0) {
            pages.push([]); // 添加这行代码
        }
        pages[pages.length - 1].push({ type: 10 })
        pageList.push(pages)
    })
    console.log('分页数据', pageList)
    return pageList
})



const getCard = async (id) => {
    clearFrom()
    console.log('获取卡片', id)
    await $request.get('/card', { params: { id: id } })
        .then(res => {
            if (res.code === '200') {
                console.log('获取卡片成功', res)
                cardData.value = res.data

            } else if (res.code === '401') {
                ElMessage.error(res.msg)
                console.log(res)
            } else if (res.code === '404') {
                ElMessage.error(res.msg)
                console.log(res)
            }
        })
        .catch(e => {
            model.value = '0'
            console.log('获取卡片失败')
            console.log(e)
        })
}


const openShowDialog = (id) => {
    console.log('打开显示弹窗', id)
    getCard(id)
    showDialogVisible.value = true
}


const clearFrom = () => {
    console.log('清空表单')
    cardData.value = {
        id: 0,
        chapter: 0,
        headline: "",
        content: "",
        type: 0,
    }
}

const collect = () => {
    console.log('收藏')
    let url = '/collect/code/' + code.value
    $request.post(url)
        .then(res => {
            if (res.code === '200') {
                console.log('收藏成功')
                ElMessage.success('收藏成功')
            } else if (res.code === '404') {
                ElMessage.error(res.msg)
                console.log(res)
            }
        })
        .catch(e => {
            console.log('收藏失败')
            console.log(e)
        })
}

const collectById = () => {
    console.log('收藏')
    let url = '/collect/id/' + cardGroupId.value
    $request.post(url)
        .then(res => {
            if (res.code === '200') {
                console.log('收藏成功')
                ElMessage.success('收藏成功')
            } else if (res.code === '404') {
                ElMessage.error(res.msg)
                console.log(res)
            }
        })
        .catch(e => {
            console.log('收藏失败')
            console.log(e)
        })
}

const handleCollect = () => {
    if (model.value === '1') {
        collect()
    } else if (model.value === '2') {
        collectById()
    }
}

</script>

<template>
    <div id="mm">
        <el-container style="width: 100%;">
            <!-- 头部 -->
            <el-header style="background-color:#ffffff;height: 0;width: 100%;">
               
            </el-header>
            <div v-if="model != '0'">
                <!-- 左侧目录 -->
                <el-container hidden-xs-only style="white:100%;height:100%;background-color:#f5f7fb;">
                    <el-col :xs="0" :sm="7" :md="5" :lg="6">
                        <el-affix v-if="cardGroup.chapterTotal != 0" :offset="150">
                            <div id="aside" style=" margin-right:20px">
                                <el-row :sm="24" :md="16" :lg="12" justify="end">
                                    <el-row
                                        style="margin-right:15px;padding: 5px;background-color: white;border: 1px solid white;border-radius: 5px;font-size: 16px">
                                        <span style="margin-right:90px;text-align:left">目录</span>
                                    </el-row>
                                </el-row>
                                <el-row justify="end" style="margin-top:10px">
                                    <el-table :show-header="false" :data="cardGroup.chapterList" :row-style="rowStyle"
                                        @row-click="changeCurrentRow" style="width:150px;">
                                        <el-table-column label="name">
                                            <template #default="scope">
                                                <div @click="goto(scope.row.id)" style="">
                                                    <el-icon>
                                                        <Document />
                                                    </el-icon>
                                                    <span style="margin-left: 10px">{{ scope.row.name }}</span>
                                                </div>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-row>
                            </div>
                        </el-affix>
                    </el-col>

                    <el-col :sm="20" :md="19" :lg="18" style="padding: 20px;">
                        <div id="main" style="margin-top:15px">
                            <el-row>
                                <span class="title">{{ cardGroup.name }}</span>
                            </el-row>

                            <!-- 状态框 -->
                            <el-row>
                                <el-col :lg="16" :md="20" :sm="24" :xs="24">
                                    <div id="display">
                                        <el-row style="justify-content: center;align-items: center;height: 50%">
                                            <span>全部&nbsp;<span style="color: #5fb1f3;font-size: large">{{
                                                cardGroup.cardTotal
                                                    }}</span>&nbsp&nbsp&nbsp;</span>
                                        </el-row>
                                        <el-row justify="center">
                                            <el-button @click="handleCollect"
                                                class="start">收藏</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
                                        </el-row>
                                    </div>
                                </el-col>
                            </el-row>

                            <el-row>
                                <el-col :lg="16" :md="20" :sm="24" :xs="24">
                                    <template v-for="(item, index) of cardGroup.chapterList" :key="item.id">
                                        <el-row :index="item.id" :span="22" :id="'ml' + item.id" class="catalogue">
                                            <div style="width: 80%;">
                                                <span>{{ item.name }}</span>
                                            </div>
                                        </el-row>

                                        <el-row v-for="(page, index1) of pageList[index]" justify="start" :key="index1"
                                            :gutter="20">
                                            <template v-for="(card, index2) of page" :id="card.id">
                                                <el-popover placement="top-start" :width="205" trigger="click">
                                                    <template #reference>
                                                        <el-col :span="8" v-if="card.type != 9">
                                                            <div :key="card.id"
                                                                :class="isActive === card.id ? 'item-selected s-item' : 'item-noselected s-item'"
                                                                @click="changeCard(card.id, card.type)"
                                                                @dblclick="openShowDialog(card.id)">
                                                                <!-- 笔记卡片 -->
                                                                <div class="card" v-if="card.type === 0">
                                                                    <span v-html="card.content"
                                                                        :style="{ 'color': card.type === 1 || card.type === 2 ? '#909090' : '#000000' }">

                                                                    </span>
                                                                </div>
                                                                <!-- 问答卡 -->
                                                                <div class="card" v-if="card.type === 1">
                                                                    <div class="content_text">
                                                                        <div class="content_front">
                                                                            <p class="headline_info"
                                                                                v-html="card.headline">
                                                                            </p>
                                                                        </div>
                                                                        <el-divider></el-divider>
                                                                        <div class="content_back">
                                                                            <p class="content_info"
                                                                                v-html="card.content"
                                                                                :style="{ 'color': card.type === 1 ? '#909090' : '#000000' }">
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <!-- 慨念卡 -->
                                                                <div class="card" v-if="card.type === 2">
                                                                    <span v-html="card.headline"></span>
                                                                    <el-divider></el-divider>
                                                                    <span v-html="card.content"
                                                                        :style="{ 'color': card.type === 2 ? '#909090' : '#000000' }">
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </el-col>
                                                    </template>
                                                    <div>
                                                        <el-row>
                                                            <el-col :span="8" style="text-align:center;"
                                                                @click="openShowDialog(card.id)">
                                                                <el-icon size="medium">
                                                                    <FullScreen />
                                                                </el-icon>
                                                            </el-col>
                                                        </el-row>
                                                    </div>
                                                </el-popover>
                                            </template>
                                        </el-row>
                                    </template>
                                </el-col>
                            </el-row>

                        </div>
                    </el-col>
                </el-container>

                <!-- 显示弹出框 -->
                <el-dialog v-model="showDialogVisible" width="4500" :show-close="false" :before-close="handleClose"
                    center class="dialog" style="min-height: 400px;">
                    <template #header>
                        <el-row>
                            <div style="position: relative;left: 45%;">
                                <span style="color: #7c7c80;">{{ cardGroup.name }}</span><br>
                            </div>
                        </el-row>
                    </template>
                    <div class="show">
                        <div class="show_content">
                            <div class="show_headline" v-if="cardData.type === 1 || cardData.type === 2">
                                <h2 v-html="cardData.headline"></h2>
                                <el-divider />
                            </div>

                            <div class="show_text">
                                <p v-html="cardData.content"></p>
                            </div>
                        </div>
                    </div>

                </el-dialog>

            </div>
            <div v-else>
                <el-row justify="center" align="middle" style="height: 100%">
                    <h1>分享码错误或卡片不存在</h1>
                </el-row>
            </div>
        </el-container>

    </div>
</template>

<style scoped>
@import "../style/detail.css";
@import "../style/index.css";
</style>
