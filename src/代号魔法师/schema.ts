// ============================================================================
// 代号魔法师 · MVU 变量结构（schema.ts）
// 事实来源：创作规划.yaml 的 mvu.structure / mvu.variables（v0.2）
// 运行时由 MVU 注入全局 z（Zod 4）与 _（lodash）；本文件禁止任何 import。
// 约定：所有字段 .prefault 兜底；范围用 transform + _.clamp 收敛；
//       对象 .prefault({})、数组 .prefault([])、record .prefault({})，保证 D 级回退。
// ============================================================================

export const Schema = z.object({
  // -------------------------------------------------------------- 数据面板
  数据面板: z.object({
    // 世界时间与场景状态
    时间: z.object({
      日期: z.string().prefault('帝国历1001/03/01'),
      时间: z.string().prefault('08:00'),
      地点: z.string().prefault('玛瑙城'),
      区域: z.enum(['帝国中央', '北境', '西部', '南部', '东部', '哭嚎沼泽', '其他']).prefault('帝国中央'),
      天气: z.string().prefault('晴'),
      季节: z.enum(['春', '夏', '秋', '冬']).prefault('春'),
      倒计时: z.coerce.number().transform(v => _.clamp(v, 0, 365)).prefault(365),
      跳跃: z.boolean().prefault(false),
    }).prefault({}),

    // <user> 身份档案；身份/社会地位/所属势力三分
    身份: z.object({
      人物名字: z.string().prefault('异界旅客'),
      称号: z.string().prefault('无'),
      年龄: z.coerce.number().transform(v => Math.max(0, v)).prefault(18),
      出生日期: z.string().prefault('帝国历983年1月1日'),
      性别: z.string().prefault('未定'),
      种族: z.enum(['人类', '魔人', '蛇人', '雪妖', '树人', '精灵', '其他']).prefault('人类'),
      身份: z.string().prefault('无身份难民'),
      社会地位: z.string().prefault('平民'),
      所属势力: z.string().prefault('无'),
      身高: z.coerce.number().transform(v => Math.max(0, v)).prefault(170),
      体重: z.coerce.number().transform(v => Math.max(0, v)).prefault(60),
      外貌: z.string().prefault(''),
      声望: z.coerce.number().prefault(0),
      通缉度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    }).prefault({}),

    // 等级、十境与成长
    等级: z.object({
      等级: z.coerce.number().transform(v => _.clamp(v, 1, 99)).prefault(1),
      境界: z.enum(['T1微尘', 'T2碎石', 'T3穿铁', 'T4铸铜', 'T5精钢', 'T6黑岩', 'T7山岳', 'T8天穹', 'T9神话', 'T10半神']).prefault('T1微尘'),
      经验: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
      下一级经验: z.coerce.number().transform(v => Math.max(0, v)).prefault(10),
      突破进度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      突破瓶颈: z.string().prefault('无'),
      属性点: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
      元素亲和: z.string().prefault('无'),
      魔脉: z.string().prefault('普通'),
    }).prefault({}),

    // 战斗资源与状态数值；综合战力为只读推导值（等级/境界基准 + 技能/能力 + 装备加成 + 状态修正）
    数值: z.object({
      生命值: z.coerce.number().transform(v => Math.max(0, v)).prefault(100),
      生命上限: z.coerce.number().transform(v => Math.max(0, v)).prefault(100),
      魔力值: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
      魔力上限: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
      怒气值: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
      怒气上限: z.coerce.number().transform(v => Math.max(0, v)).prefault(100),
      体力: z.coerce.number().transform(v => Math.max(0, v)).prefault(100),
      体力上限: z.coerce.number().transform(v => Math.max(0, v)).prefault(100),
      装备加成: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
      技能威力: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
      防御: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
      速度: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
      综合战力: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
      失控值: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      元素冲突值: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      精神污染值: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      虚空债: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
      命运债: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
      神明关注度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      位面注意度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    }).prefault({}),

    // 技能、能力与代价；五类列表共用同一单项结构
    能力: z.object({
      开局技能能力: z.enum(['禁魔光环', '虚空造物', '憎恶面容', '绝对命令', '时间缓滞', '空间锚点', '元素统御']).prefault('禁魔光环'),
      技能等级: z.coerce.number().transform(v => _.clamp(v, 1, 99)).prefault(1),
      技能充能: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
      技能冷却: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
      主动技能列表: z.array(z.object({
        名称: z.string().prefault(''),
        类型: z.string().prefault(''),
        效果: z.string().prefault(''),
        消耗: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
        冷却: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
        等级: z.coerce.number().transform(v => _.clamp(v, 1, 99)).prefault(1),
      }).prefault({})).prefault([]),
      被动能力列表: z.array(z.object({
        名称: z.string().prefault(''),
        类型: z.string().prefault(''),
        效果: z.string().prefault(''),
        消耗: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
        冷却: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
        等级: z.coerce.number().transform(v => _.clamp(v, 1, 99)).prefault(1),
      }).prefault({})).prefault([]),
      已学咒法: z.array(z.object({
        名称: z.string().prefault(''),
        类型: z.string().prefault(''),
        效果: z.string().prefault(''),
        消耗: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
        冷却: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
        等级: z.coerce.number().transform(v => _.clamp(v, 1, 99)).prefault(1),
      }).prefault({})).prefault([]),
      已学仪式: z.array(z.object({
        名称: z.string().prefault(''),
        类型: z.string().prefault(''),
        效果: z.string().prefault(''),
        消耗: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
        冷却: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
        等级: z.coerce.number().transform(v => _.clamp(v, 1, 99)).prefault(1),
      }).prefault({})).prefault([]),
      已解锁权能: z.array(z.object({
        名称: z.string().prefault(''),
        类型: z.string().prefault(''),
        效果: z.string().prefault(''),
        消耗: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
        冷却: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
        等级: z.coerce.number().transform(v => _.clamp(v, 1, 99)).prefault(1),
      }).prefault({})).prefault([]),
      限制与代价: z.string().prefault('无'),
      消耗资源: z.enum(['魔力', '怒气', '体力']).prefault('魔力'),
    }).prefault({}),

    // 职业只保留主职/副职/熟练度/已解锁能力
    职业: z.object({
      主职: z.string().prefault('无'),
      副职: z.string().prefault('无'),
      熟练度: z.record(z.string().describe('职业名'), z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0)).prefault({}),
      已解锁能力: z.array(z.string()).prefault([]),
    }).prefault({}),

    // 身体与生活状态
    状态: z.object({
      健康状态: z.enum(['健康', '虚弱', '重伤', '濒死', '死亡']).prefault('健康'),
      伤病列表: z.array(z.string()).prefault([]),
      增益列表: z.array(z.string()).prefault([]),
      减益列表: z.array(z.string()).prefault([]),
      饥饿: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      口渴: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      疲劳: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      睡眠: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      卫生: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(100),
      发情状态: z.boolean().prefault(false),
      状态标记: z.array(z.string()).prefault([]),
    }).prefault({}),

    // 装备栏与耐久；耐久以装备名为键
    装备: z.object({
      武器: z.array(z.string()).prefault([]),
      防具: z.array(z.string()).prefault([]),
      饰品: z.array(z.string()).prefault([]),
      耐久: z.record(z.string().describe('装备名'), z.coerce.number().transform(v => Math.max(0, v)).prefault(0)).prefault({}),
    }).prefault({}),
  }).prefault({}),

  // ---------------------------------------------------------------- 包裹
  包裹: z.object({
    金钱: z.object({
      铜角: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
      银角: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
      银镑: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
      金币冠: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
    }).prefault({}),
    武器: z.array(z.string()).prefault([]),
    防具: z.array(z.string()).prefault([]),
    饰品: z.array(z.string()).prefault([]),
    药品: z.array(z.string()).prefault([]),
    材料: z.array(z.string()).prefault([]),
    书籍: z.array(z.string()).prefault([]),
    杂物: z.array(z.string()).prefault([]),
    任务物品: z.array(z.string()).prefault([]),
    仓库: z.array(z.string()).prefault([]),
  }).prefault({}),

  // ------------------------------------------------------------ 在场人物
  在场人物: z.array(z.object({
    人物姓名: z.string().prefault(''),
    人物身份: z.string().prefault(''),
    关系阶段: z.string().prefault('陌生'),
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    信任度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    恐惧度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    情欲值: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    位置: z.string().prefault(''),
    状态: z.string().prefault('正常'),
    是否重要角色: z.boolean().prefault(false),
  }).prefault({})).prefault([]),

  // ------------------------------------------------------------ 命运纺线
  // key 为角色名（短名，与 EJS 的 stat_data.命运纺线.{角色名}.好感度 对齐）
  命运纺线: z.record(z.string().describe('魔人姓名'), z.object({
    性别: z.string().prefault('女'),
    出生日期: z.string().prefault(''),
    等级: z.coerce.number().transform(v => _.clamp(v, 1, 99)).prefault(1),
    境界: z.enum(['T1微尘', 'T2碎石', 'T3穿铁', 'T4铸铜', 'T5精钢', 'T6黑岩', 'T7山岳', 'T8天穹', 'T9神话', 'T10半神']).prefault('T1微尘'),
    生命值: z.coerce.number().transform(v => Math.max(0, v)).prefault(100),
    魔力值: z.coerce.number().transform(v => Math.max(0, v)).prefault(100),
    体力: z.coerce.number().transform(v => Math.max(0, v)).prefault(100),
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    信任度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    占有欲: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    情欲值: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    关系阶段: z.string().prefault('初始期'),
    位置: z.string().prefault(''),
    状态: z.string().prefault('正常'),
    当前事件: z.string().prefault('无'),
    专属支线: z.string().prefault('无'),
    综合战力: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
  }).prefault({})).prefault({}),

  // -------------------------------------------------- 重要角色各部位状态
  // 角色名 → 部位名 → 状态描述字符串（仅成年后由内容层使用）
  重要角色各部位状态: z.record(z.string().describe('角色名'), z.record(z.string().describe('部位名'), z.string().prefault('')).prefault({})).prefault({}),

  // -------------------------------------------------------------- 世界信息
  世界信息: z.object({
    世界事件: z.array(z.string()).prefault([]),
    世界八卦: z.array(z.string()).prefault([]),
    主线进度: z.string().prefault('未开始'),
    活跃支线: z.array(z.string()).prefault([]),
    世界线索: z.array(z.string()).prefault([]),
    已发现地点: z.array(z.string()).prefault([]),
    位面裂隙: z.array(z.string()).prefault([]),
    未解之谜: z.array(z.string()).prefault([]),
    势力关系: z.record(z.string().describe('势力名'), z.object({
      好感: z.coerce.number().transform(v => _.clamp(v, -100, 100)).prefault(0),
      敌对: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      状态: z.string().prefault('中立'),
    }).prefault({})).prefault({}),
    战争状态: z.array(z.string()).prefault([]),
    灾荒物价: z.array(z.string()).prefault([]),
    阵营选择: z.string().prefault('未定'),
    结局标记: z.array(z.string()).prefault([]),
  }).prefault({}),

  // ------------------------------------------------------------------ 任务
  任务: z.object({
    主线任务: z.string().prefault('无'),
    支线任务: z.array(z.object({
      任务名称: z.string().prefault(''),
      任务类型: z.enum(['支线', '职业转职', '职业任务', '个人', '其他']).prefault('支线'),
      关联职业: z.string().prefault('无'),
      任务目标: z.string().prefault(''),
      状态: z.enum(['未开始', '进行中', '已完成', '失败']).prefault('未开始'),
      期限: z.string().prefault('无'),
      奖励: z.array(z.string()).prefault([]),
    }).prefault({})).prefault([]),
    委托: z.array(z.object({
      名称: z.string().prefault(''),
      目标: z.string().prefault(''),
      报酬: z.string().prefault(''),
      期限: z.string().prefault('无'),
      状态: z.enum(['未开始', '进行中', '已完成', '失败']).prefault('未开始'),
    }).prefault({})).prefault([]),
    期限: z.string().prefault('无'),
    任务奖励: z.array(z.string()).prefault([]),
  }).prefault({}),

  // -------------------------------------------------------------- 遇见敌人
  遇见敌人: z.array(z.object({
    名称: z.string().prefault(''),
    等级: z.coerce.number().transform(v => _.clamp(v, 1, 99)).prefault(1),
    境界: z.enum(['T1微尘', 'T2碎石', 'T3穿铁', 'T4铸铜', 'T5精钢', 'T6黑岩', 'T7山岳', 'T8天穹', 'T9神话', 'T10半神']).prefault('T1微尘'),
    生命值: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
    魔力值: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
    状态: z.string().prefault('正常'),
    数量: z.coerce.number().transform(v => Math.max(0, v)).prefault(1),
  }).prefault({})).prefault([]),

  // ------------------------------------------------------------------ NSFW
  // 字段默认启用，仅时间跳跃后、角色成年后由内容层使用
  NSFW: z.object({
    成年标记: z.boolean().prefault(false),
    关系阶段: z.record(z.string().describe('角色名'), z.string().prefault('陌生')).prefault({}),
    同意状态: z.record(z.string().describe('角色名'), z.string().prefault('未确认')).prefault({}),
    边界设置: z.array(z.string()).prefault([]),
    最近场景标记: z.array(z.string()).prefault([]),
    活跃伴侣: z.array(z.string()).prefault([]),
  }).prefault({}),

  // ------------------------------------------------------------------ 系统
  系统: z.object({
    变量版本: z.string().prefault('1.0'),
    校验状态: z.string().prefault('正常'),
    回退标记: z.string().prefault('无'),
    UI页签: z.string().prefault('首页'),
    存档快照: z.array(z.object({
      时间: z.string().prefault(''),
      摘要: z.string().prefault(''),
      变量快照: z.record(z.string().describe('变量路径'), z.any()).prefault({}),
    }).prefault({})).prefault([]),
    重演标记: z.string().prefault('无'),
  }).prefault({}),
}).prefault({});

export type Schema = z.output<typeof Schema>;
