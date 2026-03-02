<script setup>
import { ElMessage } from 'element-plus';
import { ref, onMounted, inject } from 'vue';
import router from '@/router'

const $request = inject('request')

const loginModel = ref('login')
const loginForm = ref({
    username: '',
    password: '',
    rpassword: ''
})


const handleLogin = () => {
    console.log('登录表格数据',loginForm.value)
    if (loginModel.value === 'register' && loginForm.value.password !== loginForm.value.rpassword) {
        ElMessage.error('两次密码不一致')
        return
    }
    if (loginForm.value.username === '' || loginForm.value.password === '') {
        ElMessage.error('请输入账号密码')
        return
    }

    login()

}

const login = async () => {
    console.log('用户登录')
    await $request.post("/user/login", loginForm.value)
    .then(res => {
        if (res.code === '200') {
            console.log(res.data)
            ElMessage.success('登录成功')
            localStorage.setItem('user-token', JSON.stringify(res.data.token))
            router.push('/list/我的卡片集')
        } else {
            ElMessage.error(res.msg)
            console.log(res)
        }
    })
};

const handleRegister = () => {
    console.log('注册表格数据',loginForm.value)
    if (loginForm.value.username === '' || loginForm.value.password === '') {
        ElMessage.error('请输入账号密码')
        return
    }
    if (loginForm.value.username.length < 6 || loginForm.value.password.length < 6) {
        ElMessage.error('账号密码长度不得小于6位')
        return
    }
    if (loginForm.value.password !== loginForm.value.rpassword) {
        ElMessage.error('两次密码不一致')
        return
    }
   
    register()
}

const register = async () => {
    console.log('用户注册')
    await $request.post("/user/register", loginForm.value)
    .then(res => {
        if (res.code === '200') {
            console.log(res.data)
            // localStorage.setItem('user-token', JSON.stringify(res.data.token))
            loginModel.value = 'login'
            setTimeout(() => {
                login()
            }, 1000)

            ElMessage.success('注册成功')
        } else if (res.code === '404') {
            ElMessage.error(res.msg)
            console.log(res)
        }
    })
    .catch(err => {
        ElMessage.error('注册失败')
        console.log(err)
    })
};


const validatePassowrd = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入重复密码'));
    } else if (value !== loginForm.value.password) {
        callback(new Error('两次输入密码不一致'));
    } else {
        callback();
    }
};

const rules = ref({
    username: [
        { required: true, message: '请输入账号', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
    ],
    rpassword: [
        { validator: validatePassowrd, trigger: 'blur' },
    ],
})

onMounted(() => {
    const container = document.getElementById('main');
    const btnRegister = document.getElementById('btnRegister');
    const btnLogin = document.getElementById('btnLogin');

    btnRegister.addEventListener('click', function () {
        container.classList.add('right-panel-active')
    })

    btnLogin.addEventListener('click', function () {
        container.classList.remove('right-panel-active')
    })
})
</script>

<template>
    <div class="main" id="main">
        <div class="form-container sign-up-container">
            <el-form :model="loginForm" :rules="rules" ref="loginRef">
                <h1 style="margin-bottom: 20px;">注 册</h1>
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" type="text" placeholder="账号"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password" placeholder="密码"></el-input>
                </el-form-item>
                <el-form-item prop="rpassword">
                    <el-input v-model="loginForm.rpassword" type="password" placeholder="重复密码"></el-input>
                </el-form-item>
                <button  @click.native.prevent="handleRegister">注 册</button>
            </el-form>
        </div>
        <div class="form-container sign-in-container">
            <el-form :model="loginForm" :rules="rules" ref="loginRef">
                <h1 style="margin-bottom: 20px;">登 录</h1>
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" type="text" placeholder="账号"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password" placeholder="密码"></el-input>
                </el-form-item>
                <a href="javascript:;">忘记密码？</a>
                <button @click.native.prevent="handleLogin">登 录</button>
            </el-form>
        </div>
        <div class="overlay-container">
            <div class="overlay">
                <div class="overlay-panel overlay-left">
                    <h1>已有帐号？</h1>
                    <p>请使用您的帐号进行登录</p>
                    <button class="switcher" id="btnLogin" @click="loginModel = 'login'">登 录</button>
                </div>
                <div class="overlay-panel overlay-right">
                    <h1>没有帐号？</h1>
                    <p>立即注册加入我们，和我们一起开始旅程吧</p>
                    <button class="switcher" id="btnRegister" @click="loginModel = 'register'">注 册</button>
                </div>
            </div>
        </div>
    </div>

</template>



<style scoped>
@import '../style/login.css';
</style>