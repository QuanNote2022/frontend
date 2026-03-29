export interface MineralInfo {
  name: string
  formula: string
  hardness: string
  luster: string
  color: string
  origin: string
  uses: string
  description: string
  thumbnail: string
}

export interface DetectionResult {
  label: string
  confidence: number
  bbox: [number, number, number, number]
  mineralInfo: MineralInfo
}

export interface DetectionRecord {
  detectId: string
  imageUrl: string
  results: DetectionResult[]
  createdAt: string
}

export interface MineralCategory {
  id: string
  name: string
  count: number
}
