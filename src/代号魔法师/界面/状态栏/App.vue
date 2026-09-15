<template>
  <div v-if="stat" class="mv-root codex" :class="{ 'danger-pulse': dangerMode }">
    <!-- 标题栏 -->
    <header class="topbar mv-panel">
      <div class="who">
        <div class="name">
          {{ stat.数据面板.身份.人物名字 }}
          <span class="title" v-if="stat.数据面板.身份.称号 && stat.数据面板.身份.称号 !== '无'">「{{ stat.数据面板.身份.称号 }}」</span>
        </div>
        <div class="sub">
          <span class="mv-chip">{{ stat.数据面板.身份.种族 }}</span>
          <span class="mv-chip">{{ stat.数据面板.身份.身份 }}</span>
          <span class="mv-chip">{{ stat.数据面板.身份.社会地位 }}</span>
        </div>
      </div>

      <div class="realm">
        <div class="lv">LV {{ stat.数据面板.等级.等级 }}</div>
        <div class="stage">{{ stat.数据面板.等级.境界 }}</div>
        <div class="mv-bar exp"><i :style="bar(expPct, 'var(--c-primary)')"></i></div>
        <div class="tiny">{{ stat.数据面板.等级.经验 }} / {{ stat.数据面板.等级.下一级经验 }} 经验</div>
      </div>

      <div class="clock">
        <div class="line">{{ stat.数据面板.时间.日期 }} · {{ stat.数据面板.时间.时间 }}</div>
        <div class="line">{{ stat.数据面板.时间.地点 }} · {{ stat.数据面板.时间.天气 }} · {{ stat.数据面板.时间.季节 }}</div>
        <div class="countdown" :class="{ warn: countdownWarn, jumped: stat.数据面板.时间.跳跃 }">
          {{ stat.数据面板.时间.跳跃 ? '时间跳跃已发生' : '初测期剩余 ' + stat.数据面板.时间.倒计时 + ' 天' }}
        </div>
      </div>
    </header>

    <!-- Tab 导航 -->
    <nav class="tabs">
      <button v-for="t in tabs" :key="t.key" :class="{ on: tab === t.key }" @click="tab = t.key">
        <span class="ico">{{ t.icon }}</span>{{ t.name }}
      </button>
    </nav>

    <!-- 首页 -->
    <section v-show="tab === 'home'" class="pane">
      <div class="grid">
        <div class="card mv-panel">
          <h3>战斗资源</h3>
          <div class="res" v-for="r in resources" :key="r.label">
            <label>{{ r.label }} <b>{{ r.value }} / {{ r.max }}</b></label>
            <div class="mv-bar"><i :style="bar(r.pct, r.color)"></i></div>
          </div>
          <div class="kv"><span>综合战力</span><b>{{ stat.数据面板.数值.综合战力 }}</b></div>
          <div class="kv"><span>装备加成 / 技能威力</span><b>+{{ stat.数据面板.数值.装备加成 }} / {{ stat.数据面板.数值.技能威力 }}</b></div>
          <div class="kv"><span>防御 / 速度</span><b>{{ stat.数据面板.数值.防御 }} / {{ stat.数据面板.数值.速度 }}</b></div>
        </div>

        <div class="card mv-panel">
          <h3>身份与职业</h3>
          <div class="kv"><span>主职</span><b>{{ stat.数据面板.职业.主职 }}</b></div>
          <div class="kv"><span>副职</span><b>{{ stat.数据面板.职业.副职 }}</b></div>
          <div class="prof" v-for="(v, k) in stat.数据面板.职业.熟练度" :key="k">
            <label>{{ k }} <b>{{ v }}</b></label>
            <div class="mv-bar"><i :style="bar(v, 'var(--c-gold)')"></i></div>
          </div>
          <div class="tags">
            <span class="mv-chip" v-for="a in stat.数据面板.职业.已解锁能力" :key="a">{{ a }}</span>
            <span v-if="!stat.数据面板.职业.已解锁能力.length" class="mv-chip empty">尚未解锁职业能力</span>
          </div>
          <div class="kv"><span>所属势力</span><b>{{ stat.数据面板.身份.所属势力 }}</b></div>
          <div class="kv"><span>声望 / 通缉度</span><b>{{ stat.数据面板.身份.声望 }} / {{ stat.数据面板.身份.通缉度 }}</b></div>
        </div>

        <div class="card mv-panel">
          <h3>开局技能 / 能力</h3>
          <div class="skill-name">{{ stat.数据面板.能力.开局技能能力 }}</div>
          <div class="kv"><span>技能等级</span><b>{{ stat.数据面板.能力.技能等级 }}</b></div>
          <div class="kv"><span>消耗资源</span><b>{{ stat.数据面板.能力.消耗资源 }}</b></div>
          <div class="kv"><span>充能 / 冷却</span><b>{{ stat.数据面板.能力.技能充能 }} / {{ stat.数据面板.能力.技能冷却 }}</b></div>
          <div class="note">代价：{{ stat.数据面板.能力.限制与代价 }}</div>
          <div class="skill-list" v-for="(list, key) in skillLists" :key="key" v-show="list.length">
            <h4>{{ key }}</h4>
            <div class="tags">
              <span class="mv-chip" v-for="(s, i) in list" :key="i">{{ s.名称 }} · Lv{{ s.等级 }}</span>
            </div>
          </div>
        </div>

        <div class="card mv-panel">
          <h3>身体与生活状态</h3>
          <div class="kv">
            <span>健康状态</span>
            <b :class="{ danger: healthDanger }">{{ stat.数据面板.状态.健康状态 }}</b>
          </div>
          <div class="res" v-for="s in lifeStats" :key="s.label">
            <label>{{ s.label }} <b>{{ s.value }}</b></label>
            <div class="mv-bar"><i :style="bar(s.value, s.color)"></i></div>
          </div>
          <div class="tags">
            <span class="mv-chip danger" v-for="x in stat.数据面板.状态.伤病列表" :key="'i' + x">伤 {{ x }}</span>
            <span class="mv-chip" v-for="x in stat.数据面板.状态.增益列表" :key="'b' + x">益 {{ x }}</span>
            <span class="mv-chip danger" v-for="x in stat.数据面板.状态.减益列表" :key="'d' + x">减 {{ x }}</span>
            <span class="mv-chip" v-for="x in stat.数据面板.状态.状态标记" :key="'m' + x">{{ x }}</span>
          </div>
        </div>

        <div class="card mv-panel dark" v-if="darkValues.length">
          <h3>位面回响</h3>
          <div class="kv" v-for="d in darkValues" :key="d.label">
            <span>{{ d.label }}</span><b class="danger">{{ d.value }}</b>
          </div>
        </div>
      </div>
    </section>

    <!-- 包裹 -->
    <section v-show="tab === 'bag'" class="pane">
      <div class="card mv-panel">
        <h3>金钱</h3>
        <div class="tags">
          <span class="mv-chip gold">金币冠 {{ stat.包裹.金钱.金币冠 }}</span>
          <span class="mv-chip">银镑 {{ stat.包裹.金钱.银镑 }}</span>
          <span class="mv-chip">银角 {{ stat.包裹.金钱.银角 }}</span>
          <span class="mv-chip">铜角 {{ stat.包裹.金钱.铜角 }}</span>
        </div>
      </div>

      <div class="card mv-panel">
        <h3>当前装备</h3>
        <div class="equip-row" v-for="slot in equipSlots" :key="slot.key">
          <label>{{ slot.name }}（上限 {{ slot.limit }}）</label>
          <div class="tags">
            <span class="mv-chip" v-for="x in stat.数据面板.装备[slot.key]" :key="x">
              {{ x }}<template v-if="stat.数据面板.装备.耐久[x]"> · 耐久 {{ stat.数据面板.装备.耐久[x] }}</template>
            </span>
            <span v-if="!stat.数据面板.装备[slot.key].length" class="mv-chip empty">空</span>
          </div>
        </div>
      </div>

      <div class="card mv-panel" v-for="cat in bagCats" :key="cat.key">
        <h3>{{ cat.name }}</h3>
        <div class="tags">
          <span class="mv-chip" v-for="x in stat.包裹[cat.key]" :key="x">{{ x }}</span>
          <span v-if="!stat.包裹[cat.key].length" class="mv-chip empty">空</span>
        </div>
      </div>
    </section>

    <!-- 关系 -->
    <section v-show="tab === 'relation'" class="pane">
      <div class="card mv-panel">
        <h3>命运纺线</h3>
        <div class="char-grid">
          <div class="char-card" v-for="(c, name) in stat.命运纺线" :key="name">
            <div class="char-head">
              <b>{{ name }}</b>
              <span class="mv-chip">{{ c.关系阶段 }}</span>
            </div>
            <div class="kv small"><span>境界</span><b>{{ c.境界 }} · LV{{ c.等级 }}</b></div>
            <div class="res"><label>好感 <b>{{ c.好感度 }}</b></label><div class="mv-bar"><i :style="bar(c.好感度, 'var(--c-primary)')"></i></div></div>
            <div class="res"><label>信任 <b>{{ c.信任度 }}</b></label><div class="mv-bar"><i :style="bar(c.信任度, 'var(--c-accent)')"></i></div></div>
            <div class="res"><label>占有欲 <b>{{ c.占有欲 }}</b></label><div class="mv-bar"><i :style="bar(c.占有欲, 'var(--c-danger)')"></i></div></div>
            <div class="res" v-if="stat.NSFW.成年标记"><label>情欲 <b>{{ c.情欲值 }}</b></label><div class="mv-bar"><i :style="bar(c.情欲值, 'var(--c-fire)')"></i></div></div>
            <div class="kv small"><span>位置</span><b>{{ c.位置 }}</b></div>
            <div class="kv small"><span>状态</span><b>{{ c.状态 }}</b></div>
            <div class="note" v-if="c.当前事件 && c.当前事件 !== '无'">当前：{{ c.当前事件 }}</div>
            <div class="note" v-if="c.专属支线 && c.专属支线 !== '无'">支线：{{ c.专属支线 }}</div>
          </div>
        </div>
      </div>

      <div class="card mv-panel">
        <h3>在场人物</h3>
        <div class="tags">
          <span class="mv-chip" v-for="p in stat.在场人物" :key="p.人物姓名">{{ p.人物姓名 }} · {{ p.关系阶段 }}</span>
          <span v-if="!stat.在场人物.length" class="mv-chip empty">当前场景没有记录在案的人物</span>
        </div>
      </div>
    </section>

    <!-- 世界 -->
    <section v-show="tab === 'world'" class="pane">
      <div class="card mv-panel">
        <h3>主线与支线</h3>
        <div class="kv"><span>主线进度</span><b>{{ stat.世界信息.主线进度 }}</b></div>
        <div class="kv"><span>阵营选择</span><b>{{ stat.世界信息.阵营选择 }}</b></div>
        <div class="tags">
          <span class="mv-chip" v-for="x in stat.世界信息.活跃支线" :key="x">{{ x }}</span>
          <span v-if="!stat.世界信息.活跃支线.length" class="mv-chip empty">暂无活跃支线</span>
        </div>
        <div class="task" v-for="(t, i) in stat.任务.支线任务" :key="i">
          <div class="task-head"><b>{{ t.任务名称 }}</b><span class="mv-chip">{{ t.任务类型 }}</span><span class="mv-chip">{{ t.状态 }}</span></div>
          <div class="note">{{ t.任务目标 }}</div>
        </div>
      </div>

      <div class="card mv-panel">
        <h3>势力关系</h3>
        <div class="faction" v-for="(f, name) in stat.世界信息.势力关系" :key="name">
          <div class="kv"><span>{{ name }}</span><b>{{ f.状态 }} · 好感 {{ f.好感 }} / 敌对 {{ f.敌对 }}</b></div>
          <div class="mv-bar"><i :style="bar((f.好感 + 100) / 2, f.好感 >= 0 ? 'var(--c-success)' : 'var(--c-danger)')"></i></div>
        </div>
      </div>

      <div class="card mv-panel">
        <h3>世界动态</h3>
        <div class="tags">
          <span class="mv-chip" v-for="x in stat.世界信息.世界事件" :key="x">{{ x }}</span>
          <span class="mv-chip danger" v-for="x in stat.世界信息.战争状态" :key="'w' + x">战争 {{ x }}</span>
          <span class="mv-chip" v-for="x in stat.世界信息.灾荒物价" :key="'d' + x">灾荒 {{ x }}</span>
          <span v-if="!stat.世界信息.世界事件.length && !stat.世界信息.战争状态.length && !stat.世界信息.灾荒物价.length" class="mv-chip empty">世界暂时平静</span>
        </div>
      </div>

      <div class="card mv-panel">
        <h3>线索与未解之谜</h3>
        <div class="tags">
          <span class="mv-chip" v-for="x in stat.世界信息.世界线索" :key="x">{{ x }}</span>
          <span class="mv-chip" v-for="x in stat.世界信息.未解之谜" :key="'m' + x">？{{ x }}</span>
          <span v-if="!stat.世界信息.世界线索.length && !stat.世界信息.未解之谜.length" class="mv-chip empty">尚未发现线索</span>
        </div>
      </div>
    </section>

    <!-- 地图 -->
    <section v-show="tab === 'map'" class="pane">
      <div class="card mv-panel">
        <h3>已知区域 · 静态地图</h3>
        <div class="map-grid">
          <div class="zone" v-for="z in mapZones" :key="z.name" :class="{ here: stat.数据面板.时间.区域 === z.name }">
            <b>{{ z.name }}</b>
            <small>{{ z.note }}</small>
          </div>
        </div>
        <div class="note">当前所在：{{ stat.数据面板.时间.地点 }}（{{ stat.数据面板.时间.区域 }}）</div>
        <div class="tags">
          <span class="mv-chip" v-for="x in stat.世界信息.已发现地点" :key="x">{{ x }}</span>
          <span v-if="!stat.世界信息.已发现地点.length" class="mv-chip empty">尚未发现地点</span>
        </div>
        <div class="note">地图为静态 UI，不显示隐藏地点，不承担探索度 / 快速旅行 / 迷雾系统。</div>
      </div>
    </section>
  </div>

  <div v-else class="mv-root loading">等待变量系统初始化…</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDataStore, 界面页签, 地图区域, 装备槽, 包裹分类 } from '../store';

const store = useDataStore();
const stat = computed(() => store.stat_data as any);
const tab = ref('home');

const tabs = 界面页签;
const mapZones = 地图区域;
const equipSlots = 装备槽;
const bagCats = 包裹分类;

function pct(v: number, max: number) {
  return max > 0 ? (v / max) * 100 : 0;
}

function bar(v: number, color: string) {
  return { width: Math.min(100, Math.max(0, v)) + '%', background: color };
}

const expPct = computed(() => {
  const s = stat.value;
  if (!s) return 0;
  return pct(s.数据面板.等级.经验, s.数据面板.等级.下一级经验);
});

const resources = computed(() => {
  const s = stat.value;
  if (!s) return [];
  const n = s.数据面板.数值;
  return [
    { label: '生命', value: n.生命值, max: n.生命上限, pct: pct(n.生命值, n.生命上限), color: 'var(--c-success)' },
    { label: '魔力', value: n.魔力值, max: n.魔力上限, pct: pct(n.魔力值, n.魔力上限), color: 'var(--c-accent)' },
    { label: '怒气', value: n.怒气值, max: n.怒气上限, pct: pct(n.怒气值, n.怒气上限), color: 'var(--c-danger)' },
    { label: '体力', value: n.体力, max: n.体力上限, pct: pct(n.体力, n.体力上限), color: 'var(--c-earth)' },
  ];
});

const lifeStats = computed(() => {
  const s = stat.value;
  if (!s) return [];
  const t = s.数据面板.状态;
  return [
    { label: '饥饿', value: t.饥饿, color: 'var(--c-fire)' },
    { label: '口渴', value: t.口渴, color: 'var(--c-water)' },
    { label: '疲劳', value: t.疲劳, color: 'var(--c-muted)' },
    { label: '睡眠', value: t.睡眠, color: 'var(--c-accent)' },
    { label: '卫生', value: t.卫生, color: 'var(--c-success)' },
  ];
});

const skillLists = computed(() => {
  const s = stat.value;
  if (!s) return {};
  const a = s.数据面板.能力;
  return {
    主动技能: a.主动技能列表,
    被动能力: a.被动能力列表,
    已学咒法: a.已学咒法,
    已学仪式: a.已学仪式,
    已解锁权能: a.已解锁权能,
  };
});

const darkValues = computed(() => {
  const s = stat.value;
  if (!s) return [];
  const n = s.数据面板.数值;
  return [
    { label: '失控值', value: n.失控值 },
    { label: '元素冲突值', value: n.元素冲突值 },
    { label: '精神污染值', value: n.精神污染值 },
    { label: '虚空债', value: n.虚空债 },
    { label: '命运债', value: n.命运债 },
    { label: '神明关注度', value: n.神明关注度 },
    { label: '位面注意度', value: n.位面注意度 },
  ].filter(d => d.value > 0);
});

const countdownWarn = computed(() => {
  const s = stat.value;
  return !!s && !s.数据面板.时间.跳跃 && s.数据面板.时间.倒计时 <= 30;
});

const dangerMode = computed(() => {
  const s = stat.value;
  if (!s) return false;
  return s.数据面板.数值.失控值 >= 60 || s.数据面板.数值.精神污染值 >= 60;
});

const healthDanger = computed(() => {
  const s = stat.value;
  if (!s) return false;
  return ['重伤', '濒死', '死亡'].includes(s.数据面板.状态.健康状态);
});
</script>

<style lang="scss" scoped>
.codex {
  max-width: 820px;
  margin: 6px auto;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 14px;
  padding: 10px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.45);
}

.danger-pulse {
  border-color: rgba(192, 69, 59, 0.6);
  animation: pulse 2.4s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.45);
  }
  50% {
    box-shadow: 0 6px 30px rgba(192, 69, 59, 0.35);
  }
}

.topbar {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.who {
  flex: 1;
  min-width: 200px;
}

.name {
  font-size: 18px;
  font-weight: 800;
  color: var(--c-primary);
}

.title {
  font-size: 13px;
  color: var(--c-muted);
  font-weight: 500;
}

.sub {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-top: 5px;
}

.realm {
  width: 150px;
}

.lv {
  font-size: 20px;
  font-weight: 800;
}

.stage {
  font-size: 12px;
  color: var(--c-primary);
  margin-bottom: 5px;
}

.tiny {
  font-size: 11px;
  color: var(--c-muted);
  margin-top: 3px;
}

.clock {
  text-align: right;
  font-size: 12px;
  color: var(--c-muted);
}

.clock .line {
  margin-bottom: 2px;
}

.countdown {
  display: inline-block;
  margin-top: 3px;
  padding: 2px 8px;
  border-radius: 10px;
  border: 1px solid var(--c-border);
  color: var(--c-primary);
}

.countdown.warn {
  color: #fff;
  background: var(--c-danger);
  border-color: var(--c-danger);
  animation: blink 1.2s steps(2, start) infinite;
}

.countdown.jumped {
  color: var(--c-muted);
  border-style: dashed;
}

@keyframes blink {
  50% {
    opacity: 0.55;
  }
}

.tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.tabs button {
  border: 1px solid var(--c-border);
  background: var(--c-panel);
  color: var(--c-text);
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  font-weight: 600;
}

.tabs button.on {
  background: var(--c-primary);
  border-color: var(--c-primary);
  color: #1b1712;
}

.tabs .ico {
  margin-right: 4px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 8px;
}

.pane {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card {
  margin-bottom: 0;
}

.card h3 {
  margin: 0 0 8px;
  font-size: 14px;
  color: var(--c-primary);
  border-bottom: 1px solid var(--c-border);
  padding-bottom: 5px;
  letter-spacing: 0.06em;
}

.card.dark {
  border-color: rgba(192, 69, 59, 0.45);
}

.res {
  margin-bottom: 7px;
}

.res label,
.prof label {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--c-muted);
  margin-bottom: 3px;
}

.res b,
.prof b {
  color: var(--c-text);
}

.kv {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 13px;
  padding: 3px 0;
}

.kv span {
  color: var(--c-muted);
}

.kv.small {
  font-size: 12px;
}

.danger {
  color: var(--c-danger) !important;
}

.skill-name {
  font-size: 16px;
  font-weight: 800;
  color: var(--c-accent);
  margin-bottom: 6px;
}

.note {
  font-size: 12px;
  color: var(--c-muted);
  margin-top: 5px;
  line-height: 1.6;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}

.skill-list {
  margin-top: 8px;
}

.skill-list h4 {
  margin: 0 0 3px;
  font-size: 12px;
  color: var(--c-muted);
}

.equip-row {
  margin-bottom: 8px;
}

.equip-row label {
  display: block;
  font-size: 12px;
  color: var(--c-muted);
  margin-bottom: 3px;
}

.char-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 8px;
}

.char-card {
  border: 1px solid var(--c-border);
  border-radius: 9px;
  padding: 9px;
  background: var(--c-panel-2);
}

.char-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.faction {
  margin-bottom: 8px;
}

.task {
  border-top: 1px dashed var(--c-border);
  padding-top: 6px;
  margin-top: 6px;
}

.task-head {
  display: flex;
  gap: 5px;
  align-items: center;
  flex-wrap: wrap;
}

.map-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.zone {
  border: 1px solid var(--c-border);
  border-radius: 8px;
  padding: 10px 8px;
  text-align: center;
  background: var(--c-panel-2);
}

.zone b {
  display: block;
  font-size: 13px;
}

.zone small {
  color: var(--c-muted);
  font-size: 11px;
}

.zone.here {
  border-color: var(--c-primary);
  box-shadow: inset 0 0 0 1px var(--c-primary);
  background: var(--c-primary-soft);
}

.loading {
  padding: 14px;
  text-align: center;
  color: var(--c-muted);
}
</style>
