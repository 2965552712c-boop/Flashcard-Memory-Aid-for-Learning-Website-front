<script setup>
import { ref, inject, onMounted, onUpdated } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import router from '@/router'
import { useRoute } from 'vue-router'


const $request = inject('request')
const $route = useRoute()
const model = ref('我的卡片集')
const perPlanNum = ref(0)
const cardGroupCardtotal = ref('0')

// const cards = ref([{
//   id: 1,
//   name: "微机原理",
//   chapterTotal: 10,
//   cardTotal: 10,
//   learned: 5,
//   unlearned: 5,
//   review: 5,
//   isPublic: 0
// }, {
//   id: 2,
//   name: "C语言",
//   chapterTotal: 51,
//   cardTotal: 10,
//   learned: 5,
//   unlearned: 25,
//   review: 5,
//   isPublic: 1
// }, {
//   id: 3,
//   name: "高等数学",
//   chapterTotal: 6,
//   cardTotal: 10,
//   learned: 5,
//   unlearned: 5,
//   review: 5,
//   isPublic: 0
// }, {
//   id: 4,
//   name: "英语",
//   chapterTotal: 16,
//   cardTotal: 10,
//   learned: 5,
//   unlearned: 5,
//   review: 5,
//   isPublic: 1
// },
// ]);

const cards = ref([])

const set = (item) => {
  // 如果是回收站，不跳转
  if (model.value === '回收站') {
    return
  }
  console.log('点击的卡片集:', item.name)
  router.push({ path: '/detail', query: { id: item.id } })
}

const cancelCollect = (id) => {
  console.log('取消收藏:', id)
  $request.delete('/collect', { params: { cardGroupId: id } })
    .then(res => {
      if (res.code === '200') {
        console.log('取消收藏成功')
        init()
      } else if (res.code === '404') {
        ElMessage.error(res.msg)
        console.log(res)
      }
    })
    .catch(e => {
      console.log('取消收藏失败')
      console.log(e)
    })
}

const handleCollect = (id) => {
  ElMessageBox.confirm(
    '是否取消收藏该卡片集?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      customClass: 'confirmButton'
    }
  )
    .then(() => {
      cancelCollect(id)
    })
    .catch(() => {

    })
}

const handleDelete = (id) => {
  ElMessageBox.confirm(
    '是否删除该卡片集?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      customClass: 'confirmButton'
    }
  )
    .then(() => {
      deleteCards(id)
    })
    .catch(() => {

    })
}


const deleteCards = (id) => {
  console.log('删除卡片集:', id)
  $request.delete('/cardGroup', { params: { id: id } })
    .then(res => {
      if (res.code === '200') {
        console.log('删除卡片集成功')
        init()
      } else if (res.code === '404') {
        ElMessage.error(res.msg)
        console.log(res)
      }
    })
    .catch(e => {
      console.log('删除卡片集失败')
      console.log(e)
    })
}

const handleAllDelete = (id) => {
  ElMessageBox.confirm(
    '是否彻底删除该卡片集?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      customClass: 'confirmButton'
    }
  )
    .then(() => {
      allDeleteCards(id)
    })
    .catch(() => {

    })
}

const allDeleteCards = (id) => {
  console.log('彻底删除卡片集:', id)
  $request.delete('/cardGroup/all', { params: { id: id } })
    .then(res => {
      if (res.code === '200') {
        console.log('彻底删除卡片集成功')
        init()
      } else if (res.code === '404') {
        ElMessage.error(res.msg)
        console.log(res)
      }
    })
    .catch(e => {
      console.log('彻底删除卡片集失败')
      console.log(e)
    })
}

const handleRecover = (id) => {
  ElMessageBox.confirm(
    '是否恢复该卡片集?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      customClass: 'confirmButton'
    }
  )
    .then(() => {
      recoverCards(id)
    })
    .catch(() => {

    })
}

const recoverCards = (id) => {
  console.log("恢复卡片集", id)
  $request.put("/cardGroup/recover", { id: id })
    .then(res => {
      if (res.code === '200') {
        console.log('恢复成功')
        init()
      } else if (res.code === '404') {
        ElMessage.error(res.msg)
        console.log(res)
      }
    }).catch(e => {
      console.log('恢复失败')
      console.log(e)
    })
}

const init = async () => {
  const res = $route.query.type
  console.log('当前路由:', res)
  let type = res
  if (!type) type = '我的卡片集'
  model.value = type
  console.log('当前model:', model.value)
  const url = '/cardGroup/all/' + type
  await $request.get(url)
    .then(res => {
      if (res.code === '200') {
        console.log('全部卡片集:', res.data)
        cards.value = res.data
      }
    })
    .catch(e => {
      console.log('获取卡片集失败')
      console.log(e)
    })
}

const openPublic = (item) => {
  console.log('是否公开:', item)
  $request.put('/cardGroup/open', { id: item.id, isPublic: item.isPublic })
    .then(res => {
      if (res.code === '200') {
        console.log('修改成功')
      } else if (res.code === '404') {
        ElMessage.error(res.msg)
        console.log(res)
      }
    })
    .catch(e => {
      console.log('修改失败')
      console.log(e)
    })

}

const share = (id) => {
  console.log('分享卡片集:', id)
  $request.post('/share', { cardGroupId: id })
    .then(res => {
      if (res.code === '200') {
        console.log('分享成功')
        let content = '可以通过该链接进行分享 http://localhost:5173/share?code=' + res.data
        ElMessageBox.alert(content, '分享成功', {
          confirmButtonText: '确定',
          type: 'success',
        })
      } else if (res.code === '404') {
        ElMessage.error(res.msg)
        console.log(res)
      }
    })
    .catch(e => {
      console.log('分享失败')
      console.log(e)
    })
}

onUpdated(() => {
  init()
})

onMounted(() => {
  init()
})

const getDayPlanNum = (id) => {
  console.log('获取每次学习数:', id)
  $request.get('/learnedCardGroup/perPlan', { params: { cardGroupId: id } })
    .then(res => {
      if (res.code === '200') {
        console.log('获取成功', res)
        perPlanNum.value = res.data
        cardGroupCardtotal.value = res.msg
      } else if (res.code === '404') {
        ElMessage.error(res.msg)
        console.log(res)
      }
    })
    .catch(e => {
      console.log('获取失败')
      console.log(e)
    })
}

const updatePerPlan = (id) => {
  console.log('dayPlanNum', perPlanNum.value)
  const content = '请输入每次学习数(0-' + cardGroupCardtotal.value + ')'
  ElMessageBox.prompt(content, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /^\d+$/,
    inputErrorMessage: '请输入数字',
    inputPlaceholder: perPlanNum.value
  })
    .then(({ value }) => {
      console.log(value)
      $request.put('/learnedCardGroup/perPlan', { cardGroupId: id, perPlan: value })
        .then(res => {
          if (res.code === '200') {
            console.log('修改成功')
            init()
          } else if (res.code === '404') {
            ElMessage.error(res.msg)
            console.log(res)
          }
        })
        .catch(e => {
          console.log('修改失败')
          console.log(e)
        })
    })
    .catch(() => {
      console.log('取消修改')
    })
}

const handleDayPlan = (id) => {
  console.log('修改每次学习数:', id)
  getDayPlanNum(id)
  setTimeout(() => {
    updatePerPlan(id)
  }, 500);
}
</script>

<template>
  <div id="mm">
    <el-row justify="start">
      <el-col v-for="item in cards" :key="item.id" :xs="12" :sm="12" :lg="8" style="margin-bottom: 25px;">
        <div class="card">
          <el-card @click="set(item)" :index="item.id" class="box-card" style="">
            <div class="header">
              <span>{{ item.name }}</span>
              <div class="radius5" @click.stop
                style="background-color:transparent;float: right; padding: 3px 0;height: 25px; width: 30px;"
                type="text">
                <div>
                  <el-popover placement="right" width="120" trigger="click">
                    <template #reference>
                      <el-icon style="margin-left: 2px;width: 100%;height: 100%;" :size="16">
                        <More />
                      </el-icon>
                    </template>
                    <div v-if="model === '我的卡片集'">
                      <el-row justify="start" class="operation">
                        <el-col :span="16"><span>是否公开</span></el-col>
                        <el-col :span="8">
                          <el-switch v-model="item.isPublic" style="--el-switch-on-color: #7477ff" :active-value='1'
                            :inactive-value='0' @click="openPublic(item)" />
                        </el-col>
                      </el-row>
                      <el-row class="operation" @click="share(item.id)">
                        <span>分享</span>
                      </el-row>
                      <br>
                      <el-row class="operation" @click="handleDayPlan(item.id)">
                        <span>修改每日学习数</span>
                      </el-row>
                      <br>
                      <el-row class="operation" @click="handleDelete(item.id)">
                        <span>删除</span>
                      </el-row>
                    </div>
                    <div v-if="model === '我的收藏'">
                      <el-row class="operation" @click="handleCollect(item.id)">
                        <span>取消收藏</span>
                      </el-row>
                      <br>
                      <el-row class="operation" @click="handleDayPlan(item.id)">
                        <span>修改每日学习数</span>
                      </el-row>
                    </div>
                    <div v-if="model === '回收站'">
                      <el-row class="operation" @click="handleAllDelete(item.id)">
                        <span>彻底删除</span>
                      </el-row>
                      <br>
                      <el-row class="operation" @click="handleRecover(item.id)">
                        <span>恢复</span>
                      </el-row>
                    </div>
                  </el-popover>
                </div>
              </div>
            </div>
            <div style="margin-top: 12px">
              卡片:
              <span style="font-size: medium">{{ item.cardTotal }}</span>
            </div>
            <el-divider></el-divider>
            <div class="footer" style="height: 15px;">
              <div v-if="model != '回收站'">
                <el-row style="font-size: small">
                  <div v-if="item.needLearnNum != 0" style="display: flex;align-items: center;">
                    <el-icon :size="15">
                      <Timer />
                    </el-icon>&nbsp;
                    <span style="margin-right: 15px;color: #8c939d">
                      未学习{{ item.needLearnNum }}
                    </span>
                  </div>
                  <span style="color: red" v-if="item.needReviewNum != 0">
                    需复习{{ item.needReviewNum }}
                  </span>
                </el-row>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>



<style scoped>
@import '../style/cartList.css';
@import '../style/index.css';
</style>