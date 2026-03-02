<script setup>
import * as echarts from "echarts";
import { ref, onMounted, inject } from "vue";

const $request = inject('request');
const count = ref({
    'cardCount': 0,
    'learnedCount': 0,
    'collectCount': 0,
    'todayEditCount': 0,
    'todayLearnedCount': 0,
    'chartData': null,
})

const days = ref([
    { value: 7, label: "7天" },
    { value: 14, label: "14天" },
    { value: 30, label: "30天" },
]);

const day = ref(7);

//声明周期函数，自动执行初始化
onMounted(() => {
    init();
});

const option = ref({
    title: {
        text: '学习统计',
        left: 'center',
    },
    tooltip: {
        trigger: 'axis',
    },
    legend: {
        left: 'left',
    },
    xAxis: {
        data: []
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: '学习数量',
            type: 'line',
            data: []
        },
        {
            name: '编辑数量',
            type: 'line',
            data: []
        }
    ]
})


//初始化函数
const initChart = () => {
    // 基于准备好的dom，初始化echarts实例
    let Chart = echarts.init(document.getElementById("myChart"));
    // 渲染图表
    Chart.setOption(option.value);
    //监听窗口变化，自动调整图表大小
    window.addEventListener("resize", () => {
        Chart.resize();
    });
}

const init = () => {
    let url = '/count/' + day.value;
    $request.get(url)
        .then(res => {
            console.log(res);
            count.value = res.data;
            setTimeout(() => {
                option.value.xAxis.data = count.value.chartData?.learnedCount?.map(item => item.date) || []
                option.value.series[0].data = count.value.chartData?.learnedCount?.map(item => item.value) || []
                option.value.series[1].data = count.value.chartData?.editCount?.map(item => item.value) || []
                initChart();
            }, 100);
        })
        .catch(err => {
            console.log(err);
        })
}
</script>

<template>
    <div id="mm">
        <el-container style="background-color: transparent;">
            <el-col :xs="24" :sm="18" :md="24" :lg="16" style="padding: 10px;margin: 0 auto; ;margin-bottom: 30px;">
                <el-row justify="space-around">
                    <el-col class="mb" :xs="22" :sm="22" :md="11">
                        <el-row>
                            今日统计
                        </el-row>
                        <el-row justify="space-around">
                            <el-col :span="10" class="count-item center">
                                <div style="width: 100%;text-align: center;">
                                    <span>已编辑</span>
                                    <div class="count-item-n sc center" style="color: #ffdf85;">{{ count.todayEditCount
                                        }}</div>
                                    <span>卡片</span>
                                </div>
                            </el-col>
                            <el-col :span="10" class="count-item center">
                                <div style="width: 100%;text-align: center;">
                                    <span>已学习</span>
                                    <el-row class="count-item-n sc center" style="color: #7fbcf3;">{{
                                        count.todayLearnedCount }}</el-row>
                                    <span>卡片</span>
                                </div>
                            </el-col>
                        </el-row>
                    </el-col>

                    <el-col class="mb" :xs="22" :sm="22" :md="11" style="padding: 30px 40px 30px 40px;">
                        <el-row style="font-size: 14px;">
                            <el-col :span="3">
                                <div class="radius5 center shadow" style="height: 30px;width: 40px;padding-top: 12px;">
                                    <el-icon :size="18" style="color:#ffce1e">
                                        <DocumentCopy />
                                    </el-icon>
                                </div>
                            </el-col>
                            <el-col :push="2" :span="20">
                                <el-row>
                                    <span style="color: #727276;">您共拥有</span>
                                </el-row>
                                <el-row style="margin-top: 4px;">
                                    {{ count.cardCount }}张卡片
                                </el-row>
                            </el-col>
                        </el-row>

                        <hr class="divider" />

                        <el-row style="font-size: 14px;">
                            <el-col :span="3">
                                <div class="radius5 center shadow" style="height: 30px;width: 40px;padding-top: 12px;">
                                    <el-icon :size="20" style="color:#89ca94">
                                        <Timer />
                                    </el-icon>
                                </div>
                            </el-col>
                            <el-col :push="2" :span="20">
                                <el-row>
                                    <span style="color: #727276;">积累学习</span>
                                </el-row>
                                <el-row style="margin-top: 4px;">
                                    {{ count.learnedCount }}张卡片
                                </el-row>
                            </el-col>
                        </el-row>
                        <hr class="divider" />
                        <el-row style="font-size: 14px;">
                            <el-col :span="3">
                                <div class="radius5 center shadow" style="height: 30px;width: 40px;padding-top: 12px;">
                                    <el-icon :size="18" style="color:#f97788">
                                        <Share />
                                    </el-icon>
                                </div>
                            </el-col>
                            <el-col :push="2" :span="20">
                                <el-row>
                                    <span style="color: #727276;">您分享的卡片集</span>
                                </el-row>
                                <el-row style="margin-top: 4px;">
                                    {{ count.collectCount }}人收藏
                                </el-row>
                            </el-col>
                        </el-row>

                    </el-col>
                </el-row>
                <el-row style="margin-top: 30px" id="table" class="radius5">
                    <el-col :span="20" :push="2">
                        <el-row>
                            <el-col>
                                <el-select v-model="day" @change="init()" placeholder="Select" size="middle"
                                    style="width: 140px;float: right;">
                                    <el-option v-for="item in days" :key="item.value" :label="item.label"
                                        :value="item.value" />
                                </el-select>
                            </el-col>
                        </el-row>
                        <el-row>
                            <div id="myChart"></div>
                        </el-row>
                    </el-col>
                </el-row>
            </el-col>


        </el-container>
    </div>
</template>

<style scoped>
@import "../style/count.css";
@import "../style/index.css";
</style>
