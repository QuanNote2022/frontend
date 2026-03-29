/**
 * 矿物相关类型定义
 */

/**
 * 矿物信息接口
 */
export interface MineralInfo {
  /** 矿物名称 */
  name: string
  /** 化学式 */
  formula: string
  /** 硬度 */
  hardness: string
  /** 光泽 */
  luster: string
  /** 颜色 */
  color: string
  /** 产地 */
  origin: string
  /** 用途 */
  uses: string
  /** 描述 */
  description: string
  /** 缩略图 */
  thumbnail: string
}

/**
 * 检测结果接口
 */
export interface DetectionResult {
  /** 矿物标签 */
  label: string
  /** 置信度 */
  confidence: number
  /** 边界框 [x, y, width, height] */
  bbox: [number, number, number, number]
  /** 矿物信息 */
  mineralInfo: MineralInfo
}

/**
 * 检测记录接口
 */
export interface DetectionRecord {
  /** 检测ID */
  detectId: string
  /** 图像URL */
  imageUrl: string
  /** 检测结果列表 */
  results: DetectionResult[]
  /** 创建时间 */
  createdAt: string
}

/**
 * 矿物分类接口
 */
export interface MineralCategory {
  /** 分类ID */
  id: string
  /** 分类名称 */
  name: string
  /** 数量 */
  count: number
}
