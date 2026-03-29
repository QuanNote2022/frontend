import type { MockHandler } from './index'

const mineralData = [
  {
    name: '石英',
    formula: 'SiO\u2082',
    hardness: '7',
    luster: '玻璃光泽',
    color: '无色、白色、紫色、粉色等',
    origin: '巴西、马达加斯加、美国、中国',
    uses: '用于制造玻璃、电子元器件、光学仪器等。石英晶体还被用于钟表和电子设备中作为振荡器。',
    description: '石英是地壳中最常见的矿物之一，化学成分为二氧化硅。它具有很高的硬度和化学稳定性，在自然界中分布极为广泛。石英有多种变体，包括紫水晶、黄水晶、玫瑰石英等。',
    thumbnail: '',
  },
  {
    name: '长石',
    formula: 'KAlSi\u2083O\u2088',
    hardness: '6-6.5',
    luster: '玻璃光泽至珍珠光泽',
    color: '白色、粉色、灰色',
    origin: '全球广泛分布，主要产自挪威、美国、中国',
    uses: '陶瓷工业的重要原料，也用于玻璃制造和搪瓷工业。',
    description: '长石是一族含钾、钠、钙的铝硅酸盐矿物，是地壳中最丰富的矿物族群，约占地壳重量的60%。',
    thumbnail: '',
  },
  {
    name: '方解石',
    formula: 'CaCO\u2083',
    hardness: '3',
    luster: '玻璃光泽',
    color: '无色、白色、淡黄色',
    origin: '墨西哥、冰岛、中国、美国',
    uses: '水泥和石灰的主要原料，也用于冶金助熔剂、化工原料等。冰洲石是优质的光学材料。',
    description: '方解石是碳酸钙的最稳定的多晶型矿物，具有完全的菱面体解理。它是石灰�ite和大理石的主要组成矿物。',
    thumbnail: '',
  },
  {
    name: '萤石',
    formula: 'CaF\u2082',
    hardness: '4',
    luster: '玻璃光泽',
    color: '紫色、绿色、蓝色、黄色',
    origin: '中国、墨西哥、南非、蒙古',
    uses: '冶金工业助熔剂，化学工业制造氢氟酸的原料，光学镜片材料。',
    description: '萤石又称氟石，是自然界中最常见的含氟矿物。它在紫外线照射下会发出荧光，荧光一词正是由萤石而来。',
    thumbnail: '',
  },
  {
    name: '黄铁矿',
    formula: 'FeS\u2082',
    hardness: '6-6.5',
    luster: '金属光泽',
    color: '浅黄铜色',
    origin: '西班牙、意大利、中国、秘鲁',
    uses: '硫酸工业的重要原料，也是提取硫和制造硫酸的主要矿物原料。在矿石加工中作为伴生矿物有重要价值。',
    description: '黄铁矿因其金黄色的外观常被误认为黄金，因此又称"愚人金"。它是自然界中分布最广的硫化物矿物。',
    thumbnail: '',
  },
  {
    name: '云母',
    formula: 'KAl\u2082(AlSi\u2083O\u2081\u2080)(OH)\u2082',
    hardness: '2-3',
    luster: '珍珠光泽至玻璃光泽',
    color: '无色、银白色、棕色、绿色',
    origin: '印度、巴西、美国、中国',
    uses: '电气绝缘材料，也用于化妆品、涂料和建筑材料。',
    description: '云母是一族层状硅酸盐矿物，具有完全的底面解理，可以剥成极薄的透明薄片。它具有优异的绝缘性能和耐热性。',
    thumbnail: '',
  },
  {
    name: '赤铁矿',
    formula: 'Fe\u2082O\u2083',
    hardness: '5.5-6.5',
    luster: '金属光泽至土状光泽',
    color: '钢灰色至黑色，粉末呈红色',
    origin: '巴西、澳大利亚、中国、印度',
    uses: '最重要的铁矿石之一，炼铁的主要原料。也用作红色颜料（赭石）。',
    description: '赤铁矿是自然界中分布最广的铁矿物，其名称来自希腊语"血"，因其粉末呈红色。它是最重要的炼铁矿石。',
    thumbnail: '',
  },
  {
    name: '孔雀石',
    formula: 'Cu\u2082(CO\u2083)(OH)\u2082',
    hardness: '3.5-4',
    luster: '玻璃光泽至丝绢光泽',
    color: '翠绿色',
    origin: '刚果、赞比亚、俄罗斯、中国',
    uses: '铜矿石，也是著名的观赏石和装饰材料。在古代还被用作绿色颜料。',
    description: '孔雀石因其鲜艳的翠绿色和独特的同心环状花纹而得名。它是一种含铜碳酸盐矿物，常与蓝铜矿共生。',
    thumbnail: '',
  },
]

function randomPick<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

const minerals: MockHandler[] = [
  {
    url: '/api/mineral/detect',
    method: 'post',
    handler: () => {
      const count = Math.floor(Math.random() * 3) + 1
      const picked = randomPick(mineralData, count)
      const results = picked.map((m, i) => ({
        label: m.name,
        confidence: +(0.75 + Math.random() * 0.24).toFixed(2),
        bbox: [
          50 + i * 180,
          30 + Math.floor(Math.random() * 100),
          140 + Math.floor(Math.random() * 60),
          140 + Math.floor(Math.random() * 60),
        ],
        mineralInfo: m,
      }))
      return {
        code: 200,
        message: 'success',
        data: {
          detectId: 'det_' + Date.now(),
          imageUrl: '',
          results,
          createdAt: new Date().toISOString(),
        },
      }
    },
  },
  {
    url: '/api/mineral/categories',
    method: 'get',
    handler: () => ({
      code: 200,
      message: 'success',
      data: mineralData.map((m, i) => ({ id: `cat_${i}`, name: m.name, count: Math.floor(Math.random() * 100) + 10 })),
    }),
  },
  {
    url: '/api/mineral/info/',
    method: 'get',
    matchPrefix: true,
    handler: (_body, url) => {
      const name = decodeURIComponent(url?.split('/').pop() || '')
      const found = mineralData.find((m) => m.name === name) || mineralData[0]
      return { code: 200, message: 'success', data: found }
    },
  },
  {
    url: '/api/mineral/detect/',
    method: 'get',
    matchPrefix: true,
    handler: () => {
      const count = Math.floor(Math.random() * 3) + 1
      const picked = randomPick(mineralData, count)
      return {
        code: 200,
        message: 'success',
        data: {
          detectId: 'det_' + Date.now(),
          imageUrl: '',
          results: picked.map((m, i) => ({
            label: m.name,
            confidence: +(0.8 + Math.random() * 0.19).toFixed(2),
            bbox: [50 + i * 180, 40, 160, 160],
            mineralInfo: m,
          })),
          createdAt: new Date().toISOString(),
        },
      }
    },
  },
]

export default minerals
export { mineralData }
