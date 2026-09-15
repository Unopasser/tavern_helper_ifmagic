<template>
  <div v-if="stat" class="mv-root opening">
    <div class="head">
      <div class="mv-stamp">代号<br />魔法师</div>
      <div class="creator-note">
        「选择吧。位面等你落笔。」<br />
        <small>—— 那位存在，位面之外的观测者</small>
      </div>
    </div>

    <section class="field">
      <label>① 身份 · 决定生活方式与起点资源</label>
      <div class="opts col">
        <button v-for="x in 身份列表" :key="x.name" :class="{ on: form.身份 === x.name }" @click="form.身份 = x.name">
          <b>{{ x.name }}</b>
          <small v-if="x.item">起始道具：{{ x.item }}</small>
          <small>{{ x.effect }}</small>
        </button>
      </div>
    </section>

    <section class="field">
      <label>② 起点 · 决定初期势力关系与遭遇</label>
      <div class="opts">
        <button v-for="x in 起点列表" :key="x.name" :class="{ on: form.起点 === x.name }" @click="form.起点 = x.name">
          {{ x.name }}
          <small>{{ x.region }}{{ x.place !== x.region ? ' · ' + x.place : '' }}</small>
        </button>
      </div>
    </section>

    <section class="field">
      <label>③ 开局技能 / 能力 · 七选一</label>
      <div class="opts col">
        <button v-for="x in 开局技能列表" :key="x.name" :class="{ on: form.技能 === x.name }" @click="form.技能 = x.name">
          <b>{{ x.name }}</b><span class="mv-chip">{{ x.type }}</span>
          <small>{{ x.effect }}</small>
          <small class="cost">代价：{{ x.cost }}</small>
        </button>
      </div>
    </section>

    <section class="field">
      <label>④ 开局境界 · 选择后取该境界最低等级</label>
      <div class="opts">
        <button v-for="x in 境界列表" :key="x.name" :class="{ on: form.境界 === x.name }" @click="form.境界 = x.name">
          {{ x.name }}<small>LV{{ x.lv }}</small>
        </button>
      </div>
    </section>

    <section class="field">
      <label>⑤ 基础属性</label>
      <div class="form-grid">
        <div class="input">
          <span>姓名 *</span>
          <input v-model="form.姓名" maxlength="12" placeholder="你的名字" />
        </div>
        <div class="input">
          <span>年龄 *</span>
          <input v-model.number="form.年龄" type="number" min="1" max="99" />
        </div>
        <div class="input">
          <span>性别</span>
          <div class="opts">
            <button v-for="g in ['男', '女', '未定']" :key="g" :class="{ on: form.性别 === g }" @click="form.性别 = g">{{ g }}</button>
          </div>
        </div>
        <div class="input">
          <span>身高 cm</span>
          <input v-model.number="form.身高" type="number" min="1" />
        </div>
        <div class="input">
          <span>体重 kg</span>
          <input v-model.number="form.体重" type="number" min="1" />
        </div>
        <div class="input">
          <span>初始金钱（铜角）</span>
          <input v-model.number="form.金钱" type="number" min="0" />
        </div>
        <div class="input wide">
          <span>外貌</span>
          <textarea v-model="form.外貌" rows="2" maxlength="120" placeholder="发色、瞳色、体态、标志性特征……"></textarea>
        </div>
      </div>
    </section>

    <button class="submit" :disabled="!ready || done" @click="submit">
      {{ done ? '✓ 已确认，正在落笔' : ready ? '确认开局' : '请完成必填项' }}
    </button>
    <p v-if="done" class="done-tip">已写入角色数据，正在生成开场场景……</p>
  </div>

  <div v-else class="mv-root loading">等待变量系统初始化…</div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useDataStore, 身份列表, 起点列表, 开局技能列表, 境界列表 } from '../store';

const store = useDataStore();
const stat = computed(() => store.stat_data as any);
const done = ref(false);

const form = reactive({
  身份: '',
  起点: '',
  技能: '',
  境界: '',
  姓名: '',
  年龄: 18,
  性别: '未定',
  身高: 170,
  体重: 60,
  外貌: '',
  金钱: 0,
});

const ready = computed(() => {
  return !!(
    form.身份 &&
    form.起点 &&
    form.技能 &&
    form.境界 &&
    form.姓名.trim() &&
    Number(form.年龄) > 0
  );
});

async function submit() {
  if (!ready.value || done.value) return;
  const s = store.stat_data as any;
  if (!s) return;

  const idObj = 身份列表.find(x => x.name === form.身份)!;
  const startObj = 起点列表.find(x => x.name === form.起点)!;
  const skillObj = 开局技能列表.find(x => x.name === form.技能)!;
  const realmObj = 境界列表.find(x => x.name === form.境界)!;
  const age = Math.max(1, Math.min(99, Number(form.年龄) || 18));

  // 身份档案
  s.数据面板.身份.人物名字 = form.姓名.trim();
  s.数据面板.身份.年龄 = age;
  s.数据面板.身份.出生日期 = `帝国历${Math.max(1, 1001 - age)}年1月1日`;
  s.数据面板.身份.性别 = form.性别;
  s.数据面板.身份.身高 = Number(form.身高) || 170;
  s.数据面板.身份.体重 = Number(form.体重) || 60;
  s.数据面板.身份.外貌 = form.外貌.trim();
  s.数据面板.身份.身份 = idObj.name;

  // 等级与境界
  s.数据面板.等级.境界 = realmObj.name;
  s.数据面板.等级.等级 = realmObj.lv;

  // 开局技能
  s.数据面板.能力.开局技能能力 = skillObj.name;
  s.数据面板.能力.消耗资源 = skillObj.resource;
  s.数据面板.能力.限制与代价 = skillObj.cost;

  // 时间与起点
  s.数据面板.时间.日期 = '帝国历1001/03/01';
  s.数据面板.时间.倒计时 = 365;
  s.数据面板.时间.跳跃 = false;
  s.数据面板.时间.地点 = startObj.place;
  s.数据面板.时间.区域 = startObj.region;
  s.数据面板.时间.季节 = '春';
  s.数据面板.时间.天气 = '晴';

  // 身份附带效果
  if (idObj.item) s.包裹.杂物.push(idObj.item);
  if (idObj.name === '大胃农夫') {
    s.数据面板.数值.体力上限 = s.数据面板.数值.体力上限 * 2;
    s.数据面板.数值.体力 = s.数据面板.数值.体力上限;
  }
  if (idObj.name === '帝国兵王') {
    s.数据面板.数值.怒气上限 = s.数据面板.数值.怒气上限 * 2;
    s.数据面板.数值.怒气值 = 0;
  }
  s.包裹.金钱.铜角 = Math.max(0, Number(form.金钱) || 0);

  done.value = true;

  const itemLine = idObj.item ? `，获得起始道具「${idObj.item}」` : '';
  const effectLine = idObj.name === '大胃农夫' ? '，体力上限翻倍' : idObj.name === '帝国兵王' ? '，怒气上限翻倍' : '';
  const desc =
    `（完成开局选择：身份「${idObj.name}」${itemLine}${effectLine}；` +
    `起点「${startObj.name}」（区域 ${startObj.region} · ${startObj.place}）；` +
    `开局技能「${skillObj.name}」；境界「${realmObj.name}」（LV${realmObj.lv}）；` +
    `姓名「${form.姓名.trim()}」，年龄 ${age}，性别 ${form.性别}，身高 ${Number(form.身高) || 170}，体重 ${Number(form.体重) || 60}` +
    `${form.外貌.trim() ? '，外貌：' + form.外貌.trim() : ''}。）` +
    `那位存在收回目光：「记下了。去吧。」`;

  await createChatMessages([{ role: 'user', name: '<user>', message: desc }]).then(() => {
    triggerSlash('/trigger');
  });
}
</script>

<style lang="scss" scoped>
.opening {
  max-width: 640px;
  margin: 6px auto;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 14px;
  padding: 14px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.45);
}

.head {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}

.creator-note {
  flex: 1;
  font-size: 13px;
  color: var(--c-text);
  background: var(--c-panel);
  border-left: 3px solid var(--c-primary);
  border-radius: 6px;
  padding: 8px 10px;
}

.creator-note small {
  color: var(--c-muted);
}

.field {
  margin-bottom: 12px;
}

.field > label {
  display: block;
  font-size: 13px;
  font-weight: 800;
  color: var(--c-primary);
  margin-bottom: 6px;
  letter-spacing: 0.04em;
}

.opts {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.opts.col {
  flex-direction: column;
}

.opts button {
  border: 1px solid var(--c-border);
  background: var(--c-panel);
  color: var(--c-text);
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  text-align: left;
}

.opts button small {
  display: block;
  color: var(--c-muted);
  font-size: 11px;
}

.opts button .mv-chip {
  margin-left: 5px;
  font-size: 11px;
}

.opts button.on {
  background: var(--c-primary);
  border-color: var(--c-primary);
  color: #1b1712;
}

.opts button.on small,
.opts button.on .mv-chip {
  color: rgba(27, 23, 18, 0.72);
}

.opts button small.cost {
  color: var(--c-danger);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 8px;
}

.input {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.input.wide {
  grid-column: 1 / -1;
}

.input > span {
  font-size: 12px;
  color: var(--c-muted);
}

.input input,
.input textarea {
  background: var(--c-panel);
  border: 1px solid var(--c-border);
  border-radius: 7px;
  color: var(--c-text);
  padding: 7px 9px;
  font-family: inherit;
  font-size: 13px;
  outline: none;
}

.input input:focus,
.input textarea:focus {
  border-color: var(--c-primary);
}

.submit {
  width: 100%;
  background: var(--c-primary);
  color: #1b1712;
  border: none;
  border-radius: 9px;
  padding: 12px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  letter-spacing: 0.08em;
}

.submit:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.done-tip {
  margin: 8px 0 0;
  font-size: 12px;
  color: var(--c-muted);
  text-align: center;
}

.loading {
  padding: 14px;
  text-align: center;
  color: var(--c-muted);
}
</style>
