<template>
  <div class="page-container">
    <h2 class="page-title">问答历史</h2>

    <el-card shadow="hover">
      <!-- 问答历史表格 -->
      <el-table :data="historyStore.chatRecords" v-loading="historyStore.loading" stripe>
        <el-table-column prop="title" label="会话标题" min-width="200" />
        <el-table-column label="关联矿物" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.mineralName" size="small">{{ row.mineralName }}</el-tag>
            <span v-else class="text-muted">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="messageCount" label="消息数" width="100" align="center" />
        <el-table-column label="最后活跃" width="180">
          <template #default="{ row }">{{ formatDate(row.lastActiveAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template #default="{ row }">
            <el-button text size="small" type="primary" @click="router.push(`/chat/${row.sessionId}`)">继续对话</el-button>
            <el-popconfirm title="确定要删除此会话吗？" @confirm="handleDelete(row.sessionId)">
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHistoryStore } from '@/stores/history'
import { formatDate } from '@/utils/format'
import { deleteSessionApi } from '@/api/chat'

/**
 * 问答历史页面组件
 * 展示用户的聊天会话历史，支持分页和删除操作
 */

// 路由和状态管理
const router = useRouter()
const historyStore = useHistoryStore()

// 当前页码
const currentPage = ref(1)

/**
 * 组件挂载后加载数据
 */
onMounted(() => {
  loadData()
})

/**
 * 加载问答历史数据
 */
function loadData() {
  historyStore.fetchChatHistory(currentPage.value, 10)
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
 * 处理删除会话
 * @param sessionId 会话ID
 */
async function handleDelete(sessionId: string) {
  await deleteSessionApi(sessionId)
  loadData()
}
</script>

<style scoped lang="scss">
.page-title {
  font-size: 20px;
  margin-bottom: 20px;
  color: #303133;
}
.text-muted { color: #c0c4cc; }
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
