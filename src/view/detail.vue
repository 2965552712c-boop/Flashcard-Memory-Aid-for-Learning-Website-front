<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { onBeforeUnmount, ref, shallowRef, onMounted, computed, inject,} from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import { ElMessage, ElMessageBox } from 'element-plus'

const $request = inject('request')
const $route = useRoute()
//  编辑器
components: { Editor, Toolbar }
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...', scroll: true }
const model = ref('0')

toolbarConfig.toolbarKeys = [
    // 菜单 key
    'headerSelect',

    // 菜单 key
    'bold', 'italic', 'underline', 'bgColor', 'fontSize', 'bulletedList', 'numberedList', 'insertTable',

]


// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})


const handleCreated = (editor) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}

const init = () => {
    console.log('当前卡片集的id:' + $route.query.id)
    const url = '/cardGroup/' + $route.query.id
    $request.get(url)
        .then(res => {
            if (res.code === '200') {
                console.log('卡片集:', res)
                cardGroup.value = res.data
                model.value = res.msg
            } else if (res.code === '404') {
                ElMessage.error(res.msg)
                console.log(res)
                model.value = res.msg
            }
        })
        .catch(e => {
            console.log(e)
            model.value = '2'
        })
}

onMounted(() => {
    init()
    console.log('model:', model.value)
})

const changeCard = (index, type) => {

    if (type === 10) return

    if (isActive.value != index) {
        isActive.value = index //如果点击的div没有处于置亮状态，则置亮
    } else {
        isActive.value = -1
    }
}


const isActive = ref(-1)
const noteType = ref("笔记卡") //当前选择的笔记类型
const editOrAddDialogVisible = ref(false) //笔记卡片弹窗是否显示
const showDialogVisible = ref(false) // 显示卡片弹窗
const currentChapterId = ref(1) //当前选中的目录id
const mode = ref('新建') //弹窗模式

const noteTypes = ref([
    { id: 0, name: "笔记卡", content: "适合摘录、灵感、读书笔记等", icon: "List" },
    { id: 1, name: "问答卡", content: "适合问题、答案、知识点等", icon: "Checked" },
    { id: 2, name: "慨念卡", content: "适合概念、定义、公式等", icon: "Ticket" },
    
])
// { id: 3, name: "选择卡", content: "适合选择题、判断题等", icon: "WalletFilled" }

const cardData = ref({
    id: 1,
    chapter: 1,
    headline: "",
    content: "",
    type: 0,
})

// const cardGroup = ref({
//     id: 1,
//     name: "微机原理",
//     chapterTotal: 10,
//     cardTotal: 10,
//     learned: 5,
//     unlearned: 5,
//     review: 5,
//     collection: 5,
//     isPublic: 0,
//     chapterList: [{
//         id: 1,
//         name: "目录1",
//         cartTotal: 3,
//         total: 20,
//         cardList: [{
//             id: 1,
//             type: 0,
//             headline: "测试1",
//             content: "测试内容"
//         }, {
//             id: 2,
//             type: 1,
//             headline: "测试2",
//             content: "测试内容"
//         }, {
//             id: 3,
//             type: 2,
//             headline: "测试3",
//             content: "测试内容"
//         }, {
//             id: 4,
//             type: 1,
//             headline: "测试4",
//             content: "测试内容"
//         }]
//     }, {
//         id: 2,
//         name: "目录2",
//         cartTotal: 2,
//         cardList: [{
//             id: 1,
//             type: 1,
//             headline: "测试1",
//             content: "测试内容"
//         }, {
//             id: 2,
//             type: 1,
//             headline: "测试2",
//             content: "测试内容"
//         }, {
//             id: 3,
//             type: 1,
//             headline: "测试3",
//             content: "测试内容"
//         }, {
//             id: 4,
//             type: 1,
//             headline: "测试4",
//             content: "测试内容"
//         }, {
//             id: 5,
//             type: 1,
//             headline: "测试5",
//             content: "测试内容"
//         }]
//     }],

// })

const cardGroup = ref({})


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
        if (pages.length === 0) {
            pages.push([]); // 添加这行代码
        }
        if (model.value === '0') // 只有创建者才能看见添加卡片
            pages[pages.length - 1].push({ type: 10 })
        pageList.push(pages)
    })
    return pageList
})

const updateGroupName = async () => {
    console.log('修改卡片集名称')
    await $request.put('/cardGroup', { id: cardGroup.value.id, name: cardGroup.value.name })
        .then(res => {
            if (res.code === '200') {
                console.log('修改卡片集成功')
                ElMessage.success('修改成功')
            } else if (res.code === '404') {
                ElMessage.error(res.msg)
                console.log(res)
            }
        })
        .catch(e => {
            console.log('修改卡片集名称失败')
            console.log(e)
        })
}

const updateChapterName = async (item) => {
    console.log('修改章节名称')
    await $request.put('/chapter', { id: item.id, name: item.name })
        .then(res => {
            if (res.code === '200') {
                console.log('修改章节名称成功')
                ElMessage.success('修改成功')
            } else if (res.code === '404') {
                ElMessage.error(res.msg)
                console.log(res)
            }
        })
        .catch(e => {
            console.log('修改章节名称失败')
            console.log(e)
        })
}

const addChapter = async () => {
    console.log('新增章节')
    await $request.post('/chapter', { cardGroup: cardGroup.value.id })
        .then(res => {
            if (res.code === '200') {
                console.log('新增章节成功')
                init()
                ElMessage.success('添加成功')
            }
        })
        .catch(e => {
            console.log('新增章节失败')
            console.log(e)
        })
}

const deleteChapter = (id) => {
    console.log('删除章节', id)
    $request.delete('/chapter', { params: { id: id } })
        .then(res => {
            if (res.code === '200') {
                console.log('删除章节成功')
                init()
                ElMessage.success('删除成功')
            } else if (res.code === '404') {
                ElMessage.error(res.msg)
                console.log(res)
            }
        })
        .catch(e => {
            console.log('删除章节失败')
            console.log(e)
        })
}


const deletedCard = (id) => {
    console.log('删除卡片', id)
    $request.delete('/card', { params: { id: id } })
        .then(res => {
            if (res.code === '200') {
                console.log('删除卡片成功')
                init()
                ElMessage.success('删除成功')
            } else if (res.code === '404') {
                ElMessage.error(res.msg)
                console.log(res)
            }
        })
        .catch(e => {
            console.log('删除卡片失败')
            console.log(e)
        })
}

const getCard = async (id) => {
    clearFrom()
    console.log('获取卡片', id)
    await $request.get('/card', { params: { id: id } })
        .then(res => {
            if (res.code === '200') {
                console.log('获取卡片成功', res)
                cardData.value = res.data
            } else if (res.code === '404') {
                ElMessage.error(res.msg)
                console.log(res)
            }
        })
        .catch(e => {
            console.log('获取卡片失败')
            console.log(e)
        })
}

const addCard = async () => {
    console.log('新增卡片')
    await $request.post('/card', { chapter: currentChapterId.value, type: cardData.value.type, headline: cardData.value.headline, content: cardData.value.content })
        .then(res => {
            if (res.code === '200') {
                console.log('新增卡片成功')
                editOrAddDialogVisible.value = false
                init()
                ElMessage.success('添加成功')
            } else if (res.code === '404') {
                ElMessage.error(res.msg)
                console.log(res)
            }
        })
        .catch(e => {
            console.log('新增卡片失败')
            console.log(e)
        })
}

const editCard = async () => {
    console.log('编辑卡片', cardData.value.id)
    await $request.put('/card', { id: cardData.value.id, type: cardData.value.type, headline: cardData.value.headline, content: cardData.value.content })
        .then(res => {
            if (res.code === '200') {
                console.log('编辑卡片成功')
                editOrAddDialogVisible.value = false
                init()
                ElMessage.success('编辑成功')
            } else if (res.code === '404') {
                ElMessage.error(res.msg)
                console.log(res)
            }
        })
        .catch(e => {
            console.log('编辑卡片失败')
            console.log(e)
        })

}

const editOrAddCard = () => {
    console.log('编辑或新增卡片', mode.value)
    if (mode.value === '新建') {
        addCard()
    } else if (mode.value === '编辑') {
        editCard()
    } else {
        return
    }
}

// 打开添加卡片弹窗
const openDialogAdd = (id) => {
    clearFrom()
    mode.value = '新建'
    console.log('打开弹窗')
    editOrAddDialogVisible.value = true
    currentChapterId.value = id
}

// 打开编辑卡片弹窗
const openDialogEdit = (id) => {
    clearFrom()
    getCard(id)
    mode.value = '编辑'
    editOrAddDialogVisible.value = true
    console.log('打开编辑弹窗')
}

const openShowDialog = (id) => {
    console.log('打开显示弹窗', id)
    isShow.value = false
    getCard(id)
    showDialogVisible.value = true
}

const intoEdit = () => {
    console.log('进入编辑模式')
    mode.value = '编辑'
    showDialogVisible.value = false
    editOrAddDialogVisible.value = true
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

const learningList = ref([])
const viceList = ref([])

const getLearningList = () => {
    console.log('获取学习列表')
    $request.get('/learnedCardGroup/learning', { params: { cardGroupId: cardGroup.value.id } })
        .then(res => {
            if (res.code === '200') {
                console.log('获取学习列表成功', res)
                learningList.value = res.data
            } else if (res.code === '404') {
                ElMessage.error(res.msg)
                console.log(res)
            } else if (res.code === '201') {
                ElMessage.success(res.msg)
                console.log(res)
            }
        })
        .catch(e => {
            console.log('获取学习列表失败')
            console.log(e)
        })
}

const getReviewList = () => {
    console.log('获取复习列表')
    $request.get('/learnedCardGroup/review', { params: { cardGroupId: cardGroup.value.id } })
        .then(res => {
            if (res.code === '200') {
                console.log('获取复习列表成功', res)
                learningList.value = res.data
            } else if (res.code === '404') {
                ElMessage.error(res.msg)
                console.log(res)
            } else if (res.code === '201') {
                ElMessage.success(res.msg)
                console.log(res)
            }
        })
        .catch(e => {
            console.log('获取复习列表失败')
            console.log(e)
            return false
        })
    return true
}

const isShow = ref(false)

const startReview = () => {
    console.log('开始复习')
    isShow.value = true
    if (learningList.value.length === 0) {
        getReviewList()
    }
    setTimeout(() => {
        if (learningList.value.length != 0) {
            cardData.value = learningList.value.shift()
            showDialogVisible.value = true
        }
    }, 500)

}

const startLearn = () => {
    console.log('开始学习')
    isShow.value = true
    if (learningList.value.length === 0) {
        getLearningList()
    }
    setTimeout(() => {
        if (learningList.value.length != 0) {
            cardData.value = learningList.value.shift()
            showDialogVisible.value = true
        }
    }, 500)
}

const next = () => {
    console.log('主列表', learningList.value)
    console.log('副列表', viceList.value)
    if ((learningList.value.length === 0 && viceList.value.length != 0)
        || (learningList.value.length > 3 && viceList.value.length > learningList.value.length / 3)
    ) {
        learningList.value = [...viceList.value, ...learningList.value]
        viceList.value = []
    }

    if (learningList.value.length === 0 && viceList.value.length === 0) {
        finishTask()
        return
    }
    cardData.value = learningList.value.shift()
}

const forget = () => {
    console.log('忘记了')
    if (!cardData.value['firstClick']) {
        cardData.value['firstClick'] = '忘记了'
    }
    cardData.value['status'] = 0
    viceList.value.push(cardData.value)
    next()
}

const vague = () => {
    console.log('模糊')
    if (!cardData.value['firstClick']) {
        cardData.value['status'] = 0
        cardData.value['firstClick'] = '模糊'
    } else {
        cardData.value['status'] += 3
    }
    viceList.value.push(cardData.value)
    next()
}

const remember = () => {
    console.log('记住了')
    if (!cardData.value['firstClick']) {
        cardData.value['status'] = 10
        cardData.value['firstClick'] = '记住了'
    } else {
        cardData.value['status'] += 4
    }
    if (cardData.value['status'] >= 10) {
        finishLearn()
        console.log('完成学习')
    } else {
        viceList.value.push(cardData.value)
    }
    next()
}

const finishTask = () => {
    showDialogVisible.value = false
    ElMessageBox.alert('已完成本次任务', '恭喜', {
        confirmButtonText: '确定',
        type: 'success'
    })
}

const finishLearn = () => {
    console.log('完成学习')
    $request.post('/learnedCardGroup/finishLearn', { cardGroupId: cardGroup.value.id, cardId: cardData.value.id, firstClick: cardData.value['firstClick'] })
        .then(res => {
            if (res.code === '200') {
                console.log('完成学习成功', res)
                ElMessage.success('完成')
                init()
            } else if (res.code === '404') {
                ElMessage.error(res.msg)
                console.log(res)
            }
        })
        .catch(e => {
            console.log('完成学习失败', e)
        })
}

</script>

<template>
    <div id="mm">
        <el-container>
            <!-- 头部 -->
            <el-header style="background-color:#ffffff;height: 60px;width: 100%;">
                <el-icon @click="back()" :size="30" style="height:60px;margin-left:20px;">
                    <ArrowLeft />
                </el-icon>
            </el-header>
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
                            <div v-if="model === '0'">
                                <input type="text" class="title" @blur="updateGroupName" placeholder="请输入卡片集标题"
                                    v-model="cardGroup.name" />
                            </div>
                            <div v-if="model === '1'">
                                <span class="title">{{ cardGroup.name }}</span>
                            </div>
                        </el-row>

                        <!-- 状态框 -->
                        <el-row>
                            <el-col :lg="16" :md="20" :sm="24" :xs="24">
                                <div id="display">
                                    <el-row style="justify-content: center;align-items: center;height: 50%">
                                        <span>全部&nbsp;<span style="color: #5fb1f3;font-size: large">{{
                                            cardGroup.cardTotal
                                                }}</span>&nbsp&nbsp&nbsp;</span>
                                        <span>未学习&nbsp;<span style="color: #5daf34;;font-size: large">{{
                                            cardGroup.needLearnNum
                                                }}</span>&nbsp&nbsp&nbsp;</span>
                                        <span>需复习&nbsp;<span style="color: #cf9236;font-size: large">{{ cardGroup.needReviewNum
                                                }}</span></span>
                                    </el-row>
                                    <el-row justify="center">
                                        <el-button @click="startLearn"
                                            class="start">开始学习</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
                                        <el-button @click="startReview" class="start">开始复习</el-button>
                                    </el-row>
                                </div>
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col :lg="16" :md="20" :sm="24" :xs="24">
                                <template v-for="(item, index) of cardGroup.chapterList" :key="item.id">
                                    <el-row :index="item.id" :span="22" :id="'ml' + item.id" class="catalogue">
                                        <div style="width: 80%;">
                                            <div v-if="model === '0'">
                                                <input style="" type="text" class="chapter"
                                                    @blur="updateChapterName(item)" placeholder="请输入章节标题"
                                                    v-model="item.name" />
                                            </div>
                                            <div v-if="model === '1'">
                                                <span>{{ item.name }}</span>
                                            </div>
                                        </div>
                                        <!-- 删除章节 -->
                                        <div class="child" v-if="model === '0'" style="width: 20% ;text-align: right;">
                                            <el-popconfirm title="是否删除该章节?" confirmButtonText="确定" cancelButtonText="取消"
                                                @confirm="deleteChapter(item.id)">
                                                <template #reference>
                                                    <button class="delete-button">
                                                        <el-icon style="width: 100%;height: 100%;" :size="20">
                                                            <Delete />
                                                        </el-icon>
                                                    </button>
                                                </template>
                                            </el-popconfirm>
                                        </div>
                                    </el-row>

                                    <el-row v-for="(page, index1) of pageList[index]" justify="start" :key="index1"
                                        :gutter="20">
                                        <template v-for="(card, index2) of page" :id="card.id">
                                            <el-popover placement="top-start" :width="205" :trigger = "(card.type === 10 ? 'contextmenu' : 'click')">
                                                <template #reference>
                                                    <el-col :span="8">
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
                                                                        <p class="headline_info" v-html="card.headline">
                                                                        </p>
                                                                    </div>
                                                                    <el-divider></el-divider>
                                                                    <div class="content_back">
                                                                        <p class="content_info" v-html="card.content"
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

                                                            <!-- 新增卡片 -->
                                                            <div class="add-card" v-if="card.type === 10">
                                                                <button @click="openDialogAdd(item.id)"
                                                                    class="add-card-button">
                                                                    <el-icon :size="30">
                                                                        <Plus />
                                                                    </el-icon>
                                                                </button>
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
                                                        <el-col :span="8" style="text-align:center;"
                                                            v-if="model === '0'" @click="openDialogEdit(card.id)">
                                                            <el-icon size="medium">
                                                                <Edit />
                                                            </el-icon>
                                                        </el-col>
                                                        <el-col :span="8" style="text-align:center;"
                                                            v-if="model === '0'" @click="deletedCard(card.id)">
                                                            <el-icon size="medium" style="">
                                                                <Delete />
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
            <el-dialog v-model="showDialogVisible" width="4500" :show-close="false" center class="dialog"
                style="min-height: 510px;">
                <template #header>
                    <el-row>
                        <div style="position: relative;left: 45%;">
                            <span style="color: #7c7c80;">顺序学习</span><br>
                            <span style="color: #7c7c80;">{{ learningList.length + viceList.length + 1 }}</span>
                        </div>
                        <div @click="intoEdit" v-if="model === '0'" style="position: relative;left: 80%;top: 10px;">
                            <el-icon size="25">
                                <Edit />
                            </el-icon>
                        </div>

                        <!-- <div class="cancel" style="position: relative;right:40%;top: 200px;">
                            <el-icon color="white" size="40">
                                <ArrowLeft />
                            </el-icon>
                        </div>
                        <div class="cancel" style="position: relative;left:88%;top: 200px;">
                            <el-icon color="white" size="40">
                                <ArrowRight />
                            </el-icon>
                        </div> -->
                    </el-row>
                </template>
                <div class="show" :style="{height: (isShow ? '300px' : '380px')}">
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

                <template #footer>
                    <div v-if="isShow">
                        <el-row>
                            <el-col :span="8">
                                <button @click="forget" class="option_button">
                                    <el-text type="danger" size="large">忘记了</el-text>
                                </button>
                            </el-col>
                            <el-col :span="8">
                                <button @click="vague" class="option_button">
                                    <el-text type="warning" size="large">模糊</el-text>
                                </button>
                            </el-col>
                            <el-col :span="8">
                                <button @click="remember" class="option_button">
                                    <el-text type="success" size="large">记住了</el-text>
                                </button>
                            </el-col>
                        </el-row>
                    </div>
                </template>
            </el-dialog>


            <!-- 添加和编辑弹出框 -->
            <el-dialog v-model="editOrAddDialogVisible" :show-close="false" v-if="model === '0'" class="dialog" center>
                <template #header>
                    <div :style="{ height: (cardData.type === 1 || cardData.type === 2 ? '0' : '30px') }">
                        <el-select v-model="cardData.type" placeholder="select"
                            style="width: 90px;position: relative;left: 50px;">
                            <el-option v-for="item in noteTypes" :key="item.id" :label="item.name"
                                :value="item.id"></el-option>
                        </el-select>
                        <!-- 完成按钮 -->
                        <button class="button" @click="editOrAddCard"
                            style="position: relative;left: 200px;height: 30px;width: 70px;margin-top: 5px;">完成</button>

                        <!-- 取消按钮 -->
                        <button class="cancel" @click="editOrAddDialogVisible = false"
                            style=" position: relative;z-index: 2;left: 250px;">
                            <el-icon color="white" :size="20">
                                <Close />
                            </el-icon>
                        </button>
                    </div>

                </template>
                <br>
                <div class="write">
                    <div v-if="cardData.type === 1 || cardData.type === 2" class="headline_input">
                        <input v-model="cardData.headline" placeholder="请输入标题" class="note_input" />
                        <el-divider />
                    </div>
                    <div class="edit">
                        <Toolbar class="toolber"
                            :style="{ top: (cardData.type === 1 || cardData.type === 2 ? '145px' : '90px') }"
                            :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
                        <Editor class="editor"
                            :style="{ height: (cardData.type === 1 || cardData.type === 2 ? '260px' : '310px') }"
                            v-model="cardData.content" :defaultConfig="editorConfig" :mode="mode"
                            @onCreated="handleCreated" />
                    </div>
                </div>
            </el-dialog>

            <div class="affix radius10" v-if="model === '0'">
                <el-button style="height: 100%;width: 100%;background-color: transparent;" @click="addChapter">
                    <el-icon size="35" color="white">
                        <Operation />
                    </el-icon>
                    <span style="color: white;font-size: 14px;"> 新建目录</span>
                </el-button>
            </div>

        </el-container>

    </div>
</template>

<style scoped>
@import "../style/detail.css";
@import "../style/index.css";
</style>
