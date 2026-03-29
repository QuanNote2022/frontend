<template>
  <div class="page-container">
    <h2 class="page-title">识别历史</h2>

    <!-- 筛选条件 -->
    <el-card shadow="hover" class="filter-card">
      <el-form :inline="true" :model="filters">
        <el-form-item label="关键词">
          <el-input v-model="filters.keyword" placeholder="搜索矿物名称" clearable @clear="handleSearch" />
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker v-model="dateRange" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon>搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 历史记录列表 -->
    <el-card shadow="hover" style="margin-top: 16px;">
      <el-table :data="historyStore.detectionRecords" v-loading="historyStore.loading" stripe>
        <el-table-column label="时间" width="180">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="识别结果" min-width="250">
          <template #default="{ row }">
            <el-tag v-for="r in row.results" :key="r.label" size="small" style="margin: 2px;">
              {{ r.label }} ({{ (r.confidence * 100).toFixed(0) }}%)
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="矿物数量" width="100" align="center">
          <template #default="{ row }">{{ row.results.length }}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template #default="{ row }">
            <el-button text size="small" type="primary" @click="router.push(`/detect/${row.detectId}`)">详情</el-button>
            <el-popconfirm title="确定要删除此记录吗？" @confirm="handleDelete(row.detectId)">
              <template #reference>
                <el-button text size="small" type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页控件 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="10"
          :total="historyStore.total"
          layout="total, prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHistoryStore } from '@/stores/history'
import { formatDate } from '@/utils/format'

/**
 * 识别历史页面组件
 * 展示用户的矿物识别历史，支持搜索、筛选和分页
 */

// 路由和状态管理
const router = useRouter()
const historyStore = useHistoryStore()

// 分页和筛选状态
const currentPage = ref(1)
const dateRange = ref<[string, string] | null>(null)
const filters = reactive({ keyword: '' })

/**
 * 组件挂载后加载数据
 */
onMounted(() => {
  loadData()
})

/**
 * 加载识别历史数据
 */
function loadData() {
  historyStore.fetchDetectionHistory({
    page: currentPage.value,
    pageSize: 10,
    keyword: filters.keyword || undefined,
    startDate: dateRange.value?.[0],
    endDate: dateRange.value?.[1],
  })
}

/**
 * 处理搜索
 */
function handleSearch() {
  currentPage.value = 1
  loadData()
}

/**
 * 处理页码变化
 * @param page 新的页码
 */
function handlePageChange(page: number) {
  currentPage.value = page
  loadData()
}

/**
 * 处理删除记录
 * @param id 记录ID
 */
async function handleDelete(id: string) {
  await historyStore.removeDetectionRecord(id)
}
</script>

<style scoped lang="scss">
.page-title {
  font-size: 20px;
  margin-bottom: 20px;
  color: #303133;
}
.filter-card {
  :deep(.el-card__body) { padding: 16px 16px 0; }
}
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
