import { createRouter, createWebHistory } from 'vue-router'
import LayoutVue from '@/view/Layout.vue'
import detailVue from '@/view/detail.vue'
import cartListVue from '@/view/cartList.vue'
import countVue from '@/view/count.vue'
import LoginVue from '@/view/login.vue'
import ShareVue from '@/view/share.vue'
import SearchVue from '@/view/search.vue'


const routes = [
    {
        path: '/',
        name: 'home',
        component: LayoutVue,
        redirect: '/list/我的卡片集',
        children: [
            {
                path: '/list/:type',
                name: 'cartList',
                component: cartListVue,
                meta: {
                    keepAlive: false
                  }
            },
            {
                path: '/count',
                name: 'count',
                component: countVue,
                meta: {
                    keepAlive: false
                  }
            },
            {
                path: '/search',
                name: 'search',
                component: SearchVue,
                meta: {
                    keepAlive: true // 需要缓存
                  }
            }
        ],
        mata: {
            keepAlive: true // 需要缓存
          }
    },
    { 
        path: '/detail', 
        name: 'detail',
        component: detailVue
    },
    {
        path: '/login',
        name: 'login',
        component: LoginVue
    },
    {
        path: '/share',
        name: 'share',
        component: ShareVue
    }

]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

export default router