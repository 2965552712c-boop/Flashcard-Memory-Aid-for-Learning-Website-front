<script setup>
import { ref, onMounted, inject } from 'vue';
import router from '@/router'
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router'

const $request = inject('request')
const $route = useRoute()

const title = ref('我的卡片集');
const input = ref('');
const loading = ref(false);
const goBackFlag = ref(false);
const timer = ref(null);
const currentTarget = ref(1);


const user = ref({
  id: 0,
  nickname: 'John Doe',
  username: 'admin',
  age: 25,
  url: ''
});

const menuList = ref([
  {
    id: 1,
    name: "我的卡片集",
    icon: "Menu",
    url: "/list/我的卡片集"
  }, {
    id: 2,
    name: "我的收藏",
    icon: "Star",
    url: "/list/我的收藏"
  }, {
    id: 3,
    name: "回收站",
    icon: "Delete",
    url: "/list/回收站"
  }, {
    id: 4,
    name: "我的统计",
    icon: "PieChart",
    url: "/count"
  }, {
    id: 5,
    name: "搜索",
    icon: "Search",
    url: "/search"
  },
]);

const closeLoading = () => {
  timer.value = null
  timer.value = setTimeout(() => {
    loading.value = false
  }, 500)
};

const clickNav = (item, flag) => {
  loading.value = true
  title.value = item.name
  goBackFlag.value = flag
  currentTarget.value = item.id

  router.push({ path: item.url, query: { type: item.name } })

  closeLoading()

}

const logout = () => {
  console.log('退出登录')
  $request.get('/user/logout')
    .then(res => {
      if (res.code === '200') {
        console.log('退出登录')
        localStorage.removeItem('user-token')  // 清除当前的token和用户数据
        router.push('/login')
        ElMessage.success('退出成功')
      } else {
        console.log(res)
      }
    })
    .catch(e => {
      console.log('退出登录失败')
      console.log(e)
    })

}

const addCardGroup = async () => {
  console.log('添加卡片集')
  await $request.post('/cardGroup')
    .then(res => {
      if (res.code === '200') {
        console.log('添加卡片集成功:', res)
        router.push({ path: '/detail', query: { id: res.data } })
      } else if (res.code === '404') {
        ElMessage.error(res.msg)
        console.log(res)
      }
    })
    .catch(e => {
      console.log('添加卡片集失败')
      console.log(e)
    })
}

onMounted(() => {
  $request.get("/user")
    .then(res => {
      if (res.code === '200') {
        console.log("查询用户数据", res)
        user.value = res.data
      } else if (res.code === '404') {
        ElMessage.error(res.msg)
        console.log(res)
      }
    }
    ).catch(e => {
      console.log('获取用户数据失败')
      console.log(e)
    })
})
</script>

<template>
  <div id="mm" style="">
    <el-container>
      <el-aside width="270px" style="background-color: #ffffff;">
        <el-row style="margin-top: 10px" align="middle">
          
          <div>
            <el-popover placement="right">
              <template #reference>
                <el-avatar size="medium" icon="Avatar" style="margin-left: 25px"></el-avatar>
              </template>
              <div>
                <el-row justify="center" @click="logout" style="cursor: default;">
                  <span>退出登录</span>
                </el-row>
              </div>
            </el-popover>
          </div>

          <span style="margin-left: 15px;font-size: x-large;margin-top: 1px;">{{ user.nickname }}</span>
        </el-row>

        <el-row style="padding: 0 20px 0 20px;margin-top: 20px;">
          <el-button @click="addCardGroup" style="color:white; width: 100%;height: 40PX ;background-color: #7477ff">
            新建卡片集
          </el-button>
        </el-row>

        <!-- <el-row style="padding: 0 20px 0 20px;margin-top: 20px;">
          <el-button @click="logout" style="color:white; width: 100%;height: 40PX ;background-color: #7477ff">
            退出登录
          </el-button>
        </el-row> -->

        <el-divider></el-divider>

        <div class="nav">
          <ul style="">
            <template v-for="item in menuList">
              <li class="nav-item" @click="clickNav(item, false)">
                <div style="padding-left: 20px;" class="nav-item"
                  :style="{ background: (currentTarget === item.id ? '#f5f8ff' : 'transparent'), color: (currentTarget === item.id ? '#7477ff' : '#1d1d1f') }">
                  <button class="nav-btn">
                    <component :is="item.icon" :style="{ color: (currentTarget === item.id ? '#7477ff' : '#1d1d1f') }"
                      style="width: 18px;"></component>&nbsp;
                    {{ item.name }}
                  </button>
                </div>
              </li>
              <div v-if="item.id === 3">
                <el-divider style="margin-top: 20px;margin-bottom: 20px"></el-divider>
              </div>
            </template>
          </ul>
        </div>

      </el-aside>

      <el-container>
        <el-header v-if="title != '搜索'">
          <el-row :gutter="20" style="margin: 0;padding-top: 10px;">
            <el-col :span="6" style="margin-top: 10px;text-align: left">
              <span style="font-size: large">{{ title }}</span>
            </el-col>
          </el-row>
        </el-header>

        <el-main>
          <!-- <router-view></router-view> -->
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive" />

        </el-main>

      </el-container>

    </el-container>
  </div>
</template>

<style scoped>
@import "../style/layout.css";
@import "../style/index.css";
</style>
