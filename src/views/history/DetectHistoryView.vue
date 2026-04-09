<template>
  <div class="history-page">
    <div class="page-header">
      <div class="header-content">
        <div class="header-badge">
          <el-icon><Clock /></el-icon>
          <span>历史记录</span>
        </div>
        <h2 class="page-title">识别历史</h2>
        <p class="page-subtitle">查看和管理您的矿物识别记录</p>
      </div>
    </div>

    <div class="filter-section">
      <div class="filter-card">
        <div class="filter-row">
          <div class="filter-item">
            <label class="filter-label">关键词</label>
            <el-input
              v-model="filters.keyword"
              placeholder="搜索矿物名称"
              clearable
              class="filter-input"
              @clear="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
          
          <div class="filter-item">
            <label class="filter-label">日期范围</label>
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              class="filter-date"
            />
          </div>
          
          <el-button type="primary" class="search-btn" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
        </div>
      </div>
    </div>

    <div class="history-content">
      <transition name="fade" mode="out-in">
        <div v-if="historyStore.loading" class="loading-state">
          <div class="skeleton-grid">
            <div v-for="i in 6" :key="i" class="skeleton-card">
              <el-skeleton :rows="4" animated />
            </div>
          </div>
        </div>
        
        <div v-else-if="historyStore.detectionRecords.length === 0" class="empty-state">
          <div class="empty-illustration">
            <div class="empty-icon">
              <el-icon :size="64"><Document /></el-icon>
            </div>
          </div>
          <h4 class="empty-title">暂无识别记录</h4>
          <p class="empty-desc">开始您的第一次矿物识别吧</p>
          <el-button type="primary" @click="router.push('/detect')">
            <el-icon><Camera /></el-icon>
            开始识别
          </el-button>
        </div>
        
        <div v-else class="records-grid">
          <transition-group name="card-reveal">
            <div
              v-for="(record, index) in historyStore.detectionRecords"
              :key="record.detectId"
              class="record-card"
              :style="{ animationDelay: `${index * 0.05}s` }"
            >
              <div class="card-header">
                <div class="record-time">
                  <el-icon><Clock /></el-icon>
                  <span>{{ formatDate(record.createdAt) }}</span>
                </div>
                <el-dropdown trigger="click" @command="(cmd: string) => handleAction(cmd, record.detectId)">
                  <button class="more-btn">
                    <el-icon><MoreFilled /></el-icon>
                  </button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="detail">
                        <el-icon><View /></el-icon>
                        查看详情
                      </el-dropdown-item>
                      <el-dropdown-item command="delete" divided>
                        <el-icon><Delete /></el-icon>
                        删除记录
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
              
              <div class="card-body">
                <div class="mineral-count">
                  <span class="count-value">{{ record.results.length }}</span>
                  <span class="count-label">种矿物</span>
                </div>
                
                <div class="mineral-tags">
                  <el-tag
                    v-for="r in record.results.slice(0, 3)"
                    :key="r.label"
                    size="small"
                    class="mineral-tag"
                    :style="{ background: getTagColor(r.confidence) }"
                  >
                    {{ r.label }}
                    <span class="confidence">{{ (r.confidence * 100).toFixed(0) }}%</span>
                  </el-tag>
                  <span v-if="record.results.length > 3" class="more-count">
                    +{{ record.results.length - 3 }}
                  </span>
                </div>
              </div>
              
              <div class="card-footer">
                <el-button
                  text
                  type="primary"
                  class="detail-btn"
                  @click="router.push(`/detect/${record.detectId}`)"
                >
                  查看详情
                  <el-icon><ArrowRight /></el-icon>
                </el-button>
              </div>
            </div>
          </transition-group>
        </div>
      </transition>
      
      <div v-if="historyStore.total > 10" class="pagination-section">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="10"
          :total="historyStore.total"
          layout="prev, pager, next"
          background
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHistoryStore } from '@/stores/history'
import { formatDate } from '@/utils/format'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const historyStore = useHistoryStore()

const currentPage = ref(1)
const dateRange = ref<[string, string] | null>(null)
const filters = reactive({ keyword: '' })

onMounted(() => {
  loadData()
})

function loadData() {
  historyStore.fetchDetectionHistory({
    page: currentPage.value,
    pageSize: 10,
    keyword: filters.keyword || undefined,
    startDate: dateRange.value?.[0],
    endDate: dateRange.value?.[1],
  })
}

function handleSearch() {
  currentPage.value = 1
  loadData()
}

function handlePageChange(page: number) {
  currentPage.value = page
  loadData()
}

async function handleAction(cmd: string, id: string) {
  if (cmd === 'detail') {
    router.push(`/detect/${id}`)
  } else if (cmd === 'delete') {
    try {
      await ElMessageBox.confirm('确定要删除此记录吗？', '确认删除', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      })
      await historyStore.removeDetectionRecord(id)
    } catch {
      // 用户取消
    }
  }
}

function getTagColor(confidence: number) {
  if (confidence >= 0.9) return 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
  if (confidence >= 0.7) return 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
  return 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)'
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.history-page {
  padding: 0;
  background: $bg-primary;
  min-height: calc(100vh - $header-height - $spacing-10);
}

.page-header {
  position: relative;
  padding: $spacing-10 $spacing-8;
  background: $gradient-primary;
  border-radius: $radius-2xl;
  margin-bottom: $spacing-6;
  overflow: hidden;
  
  .header-content {
    position: relative;
    z-index: 2;
  }
  
  .header-badge {
    display: inline-flex;
    align-items: center;
    gap: $spacing-2;
    padding: $spacing-2 $spacing-4;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(8px);
    border-radius: $radius-full;
    margin-bottom: $spacing-4;
    
    .el-icon { font-size: 14px; }
    span {
      font-size: $font-size-xs;
      font-weight: $font-weight-medium;
      color: white;
      letter-spacing: $letter-spacing-wide;
    }
  }
  
  .page-title {
    font-size: $font-size-4xl;
    font-weight: $font-weight-extrabold;
    color: white;
    margin: 0 0 $spacing-2;
    letter-spacing: $letter-spacing-tight;
  }
  
  .page-subtitle {
    font-size: $font-size-base;
    color: rgba(255, 255, 255, 0.85);
    margin: 0;
  }
}

.filter-section {
  margin-bottom: $spacing-6;
}

.filter-card {
  background: $bg-card;
  border-radius: $radius-xl;
  border: 1px solid rgba($gray-200, 0.5);
  padding: $spacing-5;
}

.filter-row {
  display: flex;
  align-items: flex-end;
  gap: $spacing-4;
  
  @media (max-width: $breakpoint-md) {
    flex-direction: column;
    align-items: stretch;
  }
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: $spacing-2;
  
  .filter-label {
    font-size: $font-size-xs;
    font-weight: $font-weight-medium;
    color: $gray-500;
    text-transform: uppercase;
    letter-spacing: $letter-spacing-wider;
  }
}

.filter-input {
  width: 240px;
  
  @media (max-width: $breakpoint-md) {
    width: 100%;
  }
}

.filter-date {
  width: 280px;
  
  @media (max-width: $breakpoint-md) {
    width: 100%;
  }
}

.search-btn {
  height: 40px;
  padding: 0 $spacing-6;
  background: $gradient-primary;
  border: none;
  border-radius: $radius-lg;
  font-weight: $font-weight-semibold;
  transition: $transition-slow;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-primary;
  }
}

.history-content {
  min-height: 400px;
}

.loading-state {
  padding: $spacing-4;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-5;
  
  @media (max-width: $breakpoint-lg) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: $breakpoint-sm) {
    grid-template-columns: 1fr;
  }
}

.skeleton-card {
  background: $bg-card;
  border-radius: $radius-xl;
  padding: $spacing-5;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-16;
  
  .empty-illustration {
    margin-bottom: $spacing-6;
    
    .empty-icon {
      width: 120px;
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: $gray-50;
      border-radius: 50%;
      color: $gray-300;
      @include float-animation(10px, 3s);
    }
  }
  
  .empty-title {
    font-size: $font-size-xl;
    font-weight: $font-weight-semibold;
    color: $gray-700;
    margin: 0 0 $spacing-2;
  }
  
  .empty-desc {
    font-size: $font-size-sm;
    color: $gray-500;
    margin: 0 0 $spacing-6;
  }
}

.records-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-5;
  
  @media (max-width: $breakpoint-lg) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: $breakpoint-sm) {
    grid-template-columns: 1fr;
  }
}

.record-card {
  background: $bg-card;
  border-radius: $radius-xl;
  border: 1px solid rgba($gray-200, 0.5);
  overflow: hidden;
  transition: $transition-slow;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;
    border-color: rgba($primary-500, 0.2);
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-4 $spacing-5;
  border-bottom: 1px solid $gray-100;
}

.record-time {
  display: flex;
  align-items: center;
  gap: $spacing-2;
  font-size: $font-size-xs;
  color: $gray-500;
  
  .el-icon { font-size: 14px; }
}

.more-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: $radius-md;
  color: $gray-400;
  cursor: pointer;
  transition: $transition-fast;
  
  &:hover {
    background: $gray-100;
    color: $gray-600;
  }
}

.card-body {
  padding: $spacing-5;
}

.mineral-count {
  display: flex;
  align-items: baseline;
  gap: $spacing-2;
  margin-bottom: $spacing-4;
  
  .count-value {
    font-size: $font-size-3xl;
    font-weight: $font-weight-bold;
    @include gradient-text();
  }
  
  .count-label {
    font-size: $font-size-sm;
    color: $gray-500;
  }
}

.mineral-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-2;
}

.mineral-tag {
  border: none;
  color: white;
  font-weight: $font-weight-medium;
  
  .confidence {
    margin-left: $spacing-1;
    opacity: 0.85;
    font-size: $font-size-xs;
  }
}

.more-count {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 24px;
  padding: 0 $spacing-2;
  background: $gray-100;
  border-radius: $radius-sm;
  font-size: $font-size-xs;
  color: $gray-500;
}

.card-footer {
  padding: $spacing-4 $spacing-5;
  border-top: 1px solid $gray-100;
}

.detail-btn {
  font-weight: $font-weight-medium;
  
  .el-icon {
    margin-left: $spacing-1;
    transition: transform $transition-fast;
  }
  
  &:hover .el-icon {
    transform: translateX(4px);
  }
}

.pagination-section {
  display: flex;
  justify-content: center;
  margin-top: $spacing-8;
  
  :deep(.el-pagination) {
    .btn-prev, .btn-next, .el-pager li {
      background: $bg-card;
      border: 1px solid $gray-200;
      border-radius: $radius-md;
      margin: 0 4px;
      
      &:hover {
        color: $primary-500;
        border-color: $primary-500;
      }
    }
    
    .el-pager li.is-active {
      background: $gradient-primary;
      border-color: transparent;
      color: white;
    }
  }
}

.card-reveal-enter-active {
  transition: all 0.4s $ease-out;
}

.card-reveal-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: $breakpoint-md) {
  .page-header {
    padding: $spacing-6 $spacing-4;
    
    .page-title {
      font-size: $font-size-2xl;
    }
  }
  
  .filter-card {
    padding: $spacing-4;
  }
}
</style>
