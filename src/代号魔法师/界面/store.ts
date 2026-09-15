import { defineMvuDataStore } from '@util/mvu';
import { Schema } from '../schema';

export const useDataStore = defineMvuDataStore(Schema, {
  type: 'message',
  message_id: getCurrentMessageId(),
});

// ---------------------------------------------------------------- 状态栏常量
export const 界面页签 = [
  { key: 'home', name: '首页', icon: '🧭' },
  { key: 'bag', name: '包裹', icon: '🎒' },
  { key: 'relation', name: '关系', icon: '💠' },
  { key: 'world', name: '世界', icon: '🌐' },
  { key: 'map', name: '地图', icon: '🗺' },
];

export const 地图区域 = [
  { name: '帝国中央', note: '玛瑙城 · 帝国学院 · 皇都' },
  { name: '北境', note: '铁冠要塞 · 霜语堡 · 霜脊山脉' },
  { name: '西部', note: '树语者之墓 · 藤桥镇 · 教团城镇' },
  { name: '南部', note: '金穗港 · 海盐城 · 自由城邦' },
  { name: '东部', note: '哈默恩 · 蛇人部落 · 农业区' },
  { name: '哭嚎沼泽', note: '裂隙禁地 · 食骨者' },
  { name: '其他', note: '位面之外 · 过渡空间' },
];

export const 装备槽 = [
  { key: '武器', name: '武器', limit: 1 },
  { key: '防具', name: '防具', limit: 3 },
  { key: '饰品', name: '饰品', limit: 2 },
];

export const 包裹分类 = [
  { key: '药品', name: '药品' },
  { key: '材料', name: '材料' },
  { key: '书籍', name: '书籍' },
  { key: '杂物', name: '杂物' },
  { key: '任务物品', name: '任务物品' },
  { key: '仓库', name: '仓库' },
];

// ---------------------------------------------------------------- 开局表单常量
export const 身份列表 = [
  { name: '特级厨师', item: '厨神锅铲', effect: '烹饪的食物即使失败也能美味' },
  { name: '大胃农夫', item: '', effect: '体力值上限翻倍' },
  { name: '倒霉商人', item: '杂货铺契约书', effect: '证明拥有一家无法经营正常生意的店铺，可出售' },
  { name: '帝国兵王', item: '', effect: '怒气值上限翻倍' },
  { name: '落魄男爵', item: '男爵徽章', effect: '证明你是一位男爵的信物，但是没有其他资产' },
  { name: '皇家教员', item: '魔法有限书', effect: '无咏唱释放威力为 T5 范围内的魔法，初测期过后道具失效' },
  { name: '无身份难民', item: '神谕水杯', effect: '摔碎后可向创世神许愿且仅作用于面前的第三方个体，一次性道具' },
];

export const 起点列表 = [
  { name: '帝国中央', region: '帝国中央', place: '玛瑙城' },
  { name: '北境', region: '北境', place: '铁冠要塞' },
  { name: '西部', region: '西部', place: '教团城镇' },
  { name: '南部', region: '南部', place: '金穗港' },
  { name: '东部', region: '东部', place: '哈默恩' },
  { name: '蛇人部落', region: '东部', place: '蛇人部落' },
  { name: '自由城邦', region: '南部', place: '自由城邦' },
];

export const 开局技能列表 = [
  {
    name: '禁魔光环',
    type: '主动',
    resource: '体力',
    effect: '半径一公里内魔力封禁，不受等级限制',
    cost: '范围内友方与<user>自身的普通魔法也会被封禁；持续开启消耗体力、魔力或怒气；高阶存在可能短暂抵抗',
  },
  {
    name: '虚空造物',
    type: '主动',
    resource: '魔力',
    effect: '制造同境界可使用的一次性道具，覆盖攻击、防御、恢复等类型',
    cost: '每次造物累积虚空债；过度使用会吸引漏洞生物或导致道具失控；高品质造物有数量限制',
  },
  {
    name: '憎恶面容',
    type: '被动',
    resource: '魔力',
    effect: '胆小者只会惧怕<user>，欺瞒者不敢欺骗<user>',
    cost: '普通社交更难建立信任，容易被孤立或误解；无法主动关闭',
  },
  {
    name: '绝对命令',
    type: '主动',
    resource: '魔力',
    effect: '对同境界或更低目标下一道简短命令，目标难以违抗',
    cost: '每次使用永久消耗少量生命上限；对高境界只能短暂影响',
  },
  {
    name: '时间缓滞',
    type: '主动',
    resource: '魔力',
    effect: '局部时间流速减慢，<user>相对加速',
    cost: '消耗金钱；对半神、规则级存在无效；领域内友方也会被影响',
  },
  {
    name: '空间锚点',
    type: '主动',
    resource: '魔力',
    effect: '设置人物锚点后可瞬移至对方身边安全处',
    cost: '不能跨位面；锚点死亡或封印时产生反噬伤害与状态标记',
  },
  {
    name: '元素统御',
    type: '被动',
    resource: '魔力',
    effect: '对应元素魔法对<user>无法造成伤害，无视境界差',
    cost: '等级提升所需经验翻倍',
  },
];

export const 境界列表 = [
  { name: 'T1微尘', lv: 1 },
  { name: 'T2碎石', lv: 10 },
  { name: 'T3穿铁', lv: 20 },
  { name: 'T4铸铜', lv: 30 },
  { name: 'T5精钢', lv: 40 },
];
