// 游戏状态
let gameState = {
    year: 2024, month: 1, satisfaction: 60, development: 50, reputation: 50, risk: 0,
    level: 0, eventIndex: 0, achievements: [], totalEvents: 0,
    promotionProgress: 0, consecutiveCorrect: 0, correctChoices: 0
};

// 职级系统
const careerLevels = [
    { title: "科员", position: "街道办事处", badge: "👤", requirement: 0, bgColor: "#2d4a3e", scene: "街道社区" },
    { title: "副主任科员", position: "街道办事处", badge: "📋", requirement: 10, bgColor: "#2d4a3e", scene: "街道社区" },
    { title: "主任科员", position: "街道办事处", badge: "📁", requirement: 25, bgColor: "#2d4a3e", scene: "街道社区" },
    { title: "副科长", position: "区民政局", badge: "💼", requirement: 45, bgColor: "#3d4a5e", scene: "区政府大楼" },
    { title: "科长", position: "区民政局", badge: "🎖", requirement: 70, bgColor: "#3d4a5e", scene: "区政府大楼" },
    { title: "副处长", position: "市发改委", badge: "🏅", requirement: 100, bgColor: "#4a3d5e", scene: "市行政中心" },
    { title: "处长", position: "市发改委", badge: "🎗", requirement: 140, bgColor: "#4a3d5e", scene: "市行政中心" },
    { title: "副局长", position: "市政府办", badge: "⭐", requirement: 190, bgColor: "#5e3d3d", scene: "市政府大院" },
    { title: "局长", position: "市政府办", badge: "🌟", requirement: 250, bgColor: "#5e3d3d", scene: "市政府大院" }
];

// 违法定罪类型
const crimeTypes = {
    bribery: { name: "受贿罪", law: "刑法第385条", penalty: "三年以上有期徒刑" },
    embezzlement: { name: "贪污罪", law: "刑法第382条", penalty: "三年以上有期徒刑" },
    abuse: { name: "滥用职权罪", law: "刑法第397条", penalty: "三年以下有期徒刑" },
    dereliction: { name: "玩忽职守罪", law: "刑法第397条", penalty: "三年以下有期徒刑" },
    fraud: { name: "徇私舞弊罪", law: "刑法第399条", penalty: "五年以下有期徒刑" }
};

// 八项规定
const eightRules = [
    { title: "改进调查研究", content: "轻车简从、减少陪同，不张贴悬挂标语横幅，不安排群众迎送。" },
    { title: "精简会议活动", content: "减少会议活动，控制会议规模，提高会议效率，开短会、讲短话。" },
    { title: "精简文件简报", content: "减少文件简报，切实改进文风，没有实质内容的文件一律不发。" },
    { title: "规范出访活动", content: "严格控制出访随行人员，严格按照规定乘坐交通工具。" },
    { title: "改进警卫工作", content: "减少交通管制，一般情况下不得封路、不清场闭馆。" },
    { title: "改进新闻报道", content: "根据工作需要、新闻价值决定是否报道，压缩报道数量。" },
    { title: "严格文稿发表", content: "个人不公开出版著作、讲话单行本，不发贺信、贺电。" },
    { title: "厉行勤俭节约", content: "严格执行住房、车辆配备等有关规定，不得违规多占住房。" }
];

// 成就系统
const achievementsList = [
    { id: "first_right", title: "初心不改", desc: "首次做出正确选择", icon: "🌱" },
    { id: "clean_10", title: "清正廉洁", desc: "累计10次正确选择", icon: "💎" },
    { id: "promoted", title: "步步高升", desc: "首次获得升职", icon: "📈" },
    { id: "max_satisfaction", title: "人民公仆", desc: "群众满意度达到100", icon: "❤" },
    { id: "year_passed", title: "岁月如歌", desc: "度过完整的一年", icon: "📅" }
];

// 事件库
const events = [
    {
        type: "日常工作", scene: "🏢", title: "接待上级领导调研", stars: 1,
        description: "上级领导要来调研工作，办公室主任问你要不要准备欢迎横幅和安排群众夹道欢迎？",
        choices: [
            { text: "坚决不用！只准备一份极简的汇报材料，拒绝一切形式主义，哪怕领导不高兴也无所谓！", effects: { satisfaction: 10, reputation: 10, risk: -5 }, correct: true },
            { text: "必须大张旗鼓！不仅要横幅，还要安排群众穿统一服装，喊口号，场面要震撼！", effects: { satisfaction: -10, reputation: -8, risk: 20 }, correct: false }
        ],
        rule: "第一条：改进调查研究，不张贴悬挂标语横幅。"
    },
    {
        type: "人情往来", scene: "🎁", title: "企业老板送礼", stars: 4, crime: "bribery",
        description: "辖区内一位企业老板送来一张5000元购物卡，说是过节心意。",
        choices: [
            { text: "当场拒绝并公开批评老板，坚决维护纪律，哪怕对方当场尴尬！", effects: { satisfaction: 15, reputation: 20, risk: -15 }, correct: true },
            { text: "不仅收下，还主动要求老板再送一台最新款手机，彻底突破底线！", effects: { satisfaction: -20, reputation: -25, risk: 50 }, correct: false }
        ],
        rule: "第八条：严格遵守廉洁自律各项规定。"
    },
    {
        type: "会议安排", scene: "📋", title: "部门工作会议", stars: 2,
        description: "需要召开季度工作总结会，有人建议去度假村开会。",
        choices: [
            { text: "坚决反对度假村！会议只开十分钟，所有人站着开，效率拉满！", effects: { satisfaction: 8, development: 8, reputation: 10, risk: -3 }, correct: true },
            { text: "不仅去度假村，还安排豪华自助餐和温泉，会议变成旅游！", effects: { satisfaction: -12, development: -8, reputation: -15, risk: 30 }, correct: false }
        ],
        rule: "第二条：精简会议活动，提高会议效率。"
    },
    {
        type: "公务接待", scene: "🍽", title: "接待兄弟单位", stars: 2,
        description: "兄弟单位来交流学习，需要安排工作餐。食堂还是酒店？",
        choices: [
            { text: "只提供最简单的工作餐，甚至让大家自带饭盒，绝不铺张浪费！", effects: { satisfaction: 10, reputation: 8, risk: -5 }, correct: true },
            { text: "不仅去高档酒店，还安排KTV和豪华酒水，彻底变成吃喝盛宴！", effects: { satisfaction: -15, reputation: -10, risk: 35 }, correct: false }
        ],
        rule: "第八条：严格执行公务接待标准。"
    },
    {
        type: "群众来访", scene: "👥", title: "群众反映问题", stars: 2, crime: "dereliction",
        description: "有群众来反映小区路灯不亮的问题，已经反映过几次了。",
        choices: [
            { text: "马上带队连夜修灯，拍视频发到全网，群众满意度爆表！", effects: { satisfaction: 20, development: 10, reputation: 15, risk: -5 }, correct: true },
            { text: "直接无视群众，甚至把反映问题的人拉黑，彻底冷漠！", effects: { satisfaction: -25, reputation: -20, risk: 40 }, correct: false }
        ],
        rule: "密切联系群众，切实解决群众实际困难。"
    },
    {
        type: "用车管理", scene: "🚗", title: "周末用车请求", stars: 3, crime: "embezzlement",
        description: "周末要参加朋友婚礼，司机说可以开公车送你去。",
        choices: [
            { text: "坚决拒绝，甚至主动举报司机，绝不让公车私用有任何机会！", effects: { reputation: 12, risk: -8 }, correct: true },
            { text: "不仅用公车，还让司机帮忙跑私事一整天，完全无视规定！", effects: { reputation: -18, risk: 40 }, correct: false }
        ],
        rule: "第八条：公车私用是严重违纪行为。"
    },
    {
        type: "基层调研", scene: "🏘", title: "下乡调研安排", stars: 2,
        description: "准备去村里调研扶贫工作，镇里问要不要提前通知。",
        choices: [
            { text: "坚决不通知，直接突击检查，真实情况一览无余！", effects: { satisfaction: 15, development: 10, reputation: 12, risk: -4 }, correct: true },
            { text: "提前通知，要求村里准备欢迎仪式和汇报材料，彻底走过场！", effects: { satisfaction: -10, development: -8, reputation: -12, risk: 20 }, correct: false }
        ],
        rule: "第一条：深入了解真实情况。"
    },
    {
        type: "办公用品", scene: "🖥", title: "办公室装修", stars: 3, crime: "embezzlement",
        description: "办公室比较旧了，有人建议趁机豪华装修一下。",
        choices: [
            { text: "只做最基础修缮，甚至自己动手刷墙，绝不浪费一分钱！", effects: { satisfaction: 12, reputation: 10, risk: -6 }, correct: true },
            { text: "豪华装修，买最贵的家具和电器，办公室变成豪宅！", effects: { satisfaction: -15, reputation: -15, risk: 35 }, correct: false }
        ],
        rule: "第八条：严格遵守办公用房管理规定。"
    }
];

// 新增更多夸张事件
const extraEvents = [
    {
        type: "突发事件", scene: "🔥", title: "办公室突然失火", stars: 5,
        description: "你的办公室突然着火，大家都在慌乱中等待你的指示。",
        choices: [
            { text: "冷静指挥，带领大家安全撤离并亲自灭火，成为英雄！", effects: { satisfaction: 25, reputation: 20, risk: -10 }, correct: true },
            { text: "自己先跑，完全不管同事死活，事后还甩锅！", effects: { satisfaction: -30, reputation: -25, risk: 50 }, correct: false }
        ],
        rule: "遇到突发事件要以人为本，保障安全。"
    },
    {
        type: "媒体曝光", scene: "📺", title: "被媒体误报丑闻", stars: 4,
        description: "媒体误报你收受贿赂，群众议论纷纷。",
        choices: [
            { text: "积极澄清事实，公开透明，赢得群众信任！", effects: { satisfaction: 18, reputation: 25, risk: -8 }, correct: true },
            { text: "置之不理，任由谣言发酵，形象彻底崩塌！", effects: { satisfaction: -20, reputation: -30, risk: 40 }, correct: false }
        ],
        rule: "面对舆情要及时回应，维护清正形象。"
    },
    {
        type: "家庭压力", scene: "🏠", title: "家人要求特殊照顾", stars: 3,
        description: "家人希望你帮忙安排工作，违反公平原则。",
        choices: [
            { text: "坚决拒绝家人请求，维护原则，哪怕家庭关系紧张！", effects: { satisfaction: 10, reputation: 15, risk: -5 }, correct: true },
            { text: "答应家人，安排特殊岗位，彻底突破底线！", effects: { satisfaction: -12, reputation: -18, risk: 30 }, correct: false }
        ],
        rule: "用人唯贤，杜绝亲情干扰。"
    },
    {
        type: "网络舆论", scene: "🌐", title: "网络暴力攻击", stars: 4,
        description: "网络上出现大量针对你的负面评论。",
        choices: [
            { text: "主动发声，正面回应，赢得网友支持！", effects: { satisfaction: 15, reputation: 20, risk: -6 }, correct: true },
            { text: "沉默不语，任由网络暴力蔓延，形象受损！", effects: { satisfaction: -18, reputation: -22, risk: 28 }, correct: false }
        ],
        rule: "积极应对网络舆情，维护自身形象。"
    },
    {
        type: "极端天气", scene: "🌪", title: "台风来袭", stars: 5,
        description: "台风即将登陆，你作为负责人需要做决策。",
        choices: [
            { text: "提前部署防灾措施，亲自巡查，保障群众安全！", effects: { satisfaction: 22, reputation: 18, risk: -12 }, correct: true },
            { text: "无视预警，什么都不做，灾后被追责！", effects: { satisfaction: -28, reputation: -24, risk: 45 }, correct: false }
        ],
        rule: "防灾减灾，责任重大。"
    }
];

events.push(...extraEvents);

// 更多事件
const moreEvents = [
    {
        type: "项目审批", scene: "📝", title: "工程项目招标", stars: 5, crime: "bribery",
        description: "一个500万的工程项目招标，有熟人承诺事成后给你10万好处费。",
        choices: [
            { text: "严格按程序办事，公平公正公开招标", effects: { satisfaction: 8, development: 10, reputation: 12, risk: -8 }, correct: true },
            { text: "都是熟人，适当照顾一下", effects: { satisfaction: -15, development: -8, reputation: -20, risk: 35 }, correct: false }
        ],
        rule: "不得利用职权为他人谋取私利。"
    },
    {
        type: "人事安排", scene: "👔", title: "人员招聘", stars: 4, crime: "fraud",
        description: "单位招聘，领导的亲戚也来应聘，条件明显不符合要求。",
        choices: [
            { text: "坚持原则，按照招聘标准公平选拔", effects: { satisfaction: 6, reputation: 10, risk: -4 }, correct: true },
            { text: "领导的面子要给，想办法安排", effects: { satisfaction: -8, reputation: -12, risk: 18 }, correct: false }
        ],
        rule: "严格按照规定程序选人用人。"
    },
    {
        type: "财务报销", scene: "💰", title: "虚假报销", stars: 5, crime: "embezzlement",
        description: "财务科长拿来一叠发票，说是帮领导报销私人消费，让你签字。",
        choices: [
            { text: "拒绝签字，并提醒这是违纪违法行为", effects: { reputation: 15, risk: -10 }, correct: true },
            { text: "领导的事，签了吧", effects: { reputation: -20, risk: 40 }, correct: false }
        ],
        rule: "严禁虚假报销，套取公款。"
    },
    {
        type: "土地审批", scene: "🏠", title: "违规用地", stars: 5, crime: "bribery",
        description: "某企业想在农用地上建厂房，老板私下许诺给你一套房子。",
        choices: [
            { text: "严格按照土地法规办事，不能违规审批", effects: { satisfaction: 10, development: 5, reputation: 15, risk: -10 }, correct: true },
            { text: "经济发展重要，变通一下也行", effects: { satisfaction: -20, development: -10, reputation: -25, risk: 45 }, correct: false }
        ],
        rule: "严格遵守土地管理法规。"
    },
    {
        type: "节日福利", scene: "🧧", title: "中秋节福利", stars: 3, crime: "embezzlement",
        description: "中秋节到了，有人提议用公款给大家发高档月饼礼盒。",
        choices: [
            { text: "按规定标准发放普通慰问品", effects: { satisfaction: 2, reputation: 4, risk: -2 }, correct: true },
            { text: "过节嘛，发好一点大家高兴", effects: { satisfaction: -3, reputation: -6, risk: 12 }, correct: false }
        ],
        rule: "严禁用公款购买发放高档礼品。"
    },
    {
        type: "民生工程", scene: "🏗", title: "老旧小区改造", stars: 2, crime: "abuse",
        description: "老旧小区改造项目，居民意见不统一，有人建议先开工再说。",
        choices: [
            { text: "充分听取居民意见，达成共识后再开工", effects: { satisfaction: 10, development: 6, reputation: 4 }, correct: true },
            { text: "时间紧任务重，先干起来再说", effects: { satisfaction: -12, development: 2, reputation: -4, risk: 8 }, correct: false }
        ],
        rule: "充分听取群众意见，维护群众利益。"
    },
    {
        type: "信息公开", scene: "📢", title: "政务公开", stars: 2, crime: "abuse",
        description: "有群众申请公开一项政府采购信息，内容有些敏感。",
        choices: [
            { text: "依法依规公开，接受群众监督", effects: { satisfaction: 8, reputation: 6, risk: -2 }, correct: true },
            { text: "找个理由拒绝，多一事不如少一事", effects: { satisfaction: -10, reputation: -8, risk: 8 }, correct: false }
        ],
        rule: "推进政务公开，自觉接受群众监督。"
    },
    {
        type: "加班工作", scene: "🌙", title: "周末加班", stars: 3, crime: "embezzlement",
        description: "周末加班后，有人提议去KTV放松，费用走公账。",
        choices: [
            { text: "加班可以，但娱乐活动不能用公款", effects: { development: 3, reputation: 4, risk: -2 }, correct: true },
            { text: "大家辛苦了，放松一下也应该", effects: { development: -2, reputation: -6, risk: 10 }, correct: false }
        ],
        rule: "严禁用公款进行娱乐消费。"
    }
];

events.push(...moreEvents);

// 当前事件
let currentEvent = null;

// 页面切换
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
    document.getElementById(pageId).classList.add('active');
}

// 开始新游戏
function startGame() {
    gameState = {
        year: 2024, month: 1, satisfaction: 60, development: 50, reputation: 50, risk: 0,
        level: 0, eventIndex: 0, achievements: [], totalEvents: 0,
        correctChoices: 0, promotionProgress: 0, consecutiveCorrect: 0
    };
    saveGame();
    showPage('game-page');
    updateUI();
    showNextEvent();
}

// 继续游戏
function continueGame() {
    loadGame();
    showPage('game-page');
    updateUI();
    showNextEvent();
}

// 更新界面
function updateUI() {
    var level = careerLevels[gameState.level];
    document.getElementById('player-name').textContent = level.title;
    document.getElementById('player-position').textContent = level.position;
    document.getElementById('avatar').textContent = level.badge;
    document.getElementById('current-year').textContent = gameState.year;
    document.getElementById('current-month').textContent = gameState.month;
    document.getElementById('tenure-months').textContent = gameState.totalEvents;
    
    updateBackground(level);
    
    var nextLevel = gameState.level + 1;
    if (nextLevel < careerLevels.length) {
        var requirement = careerLevels[nextLevel].requirement;
        var progress = Math.min(100, (gameState.promotionProgress / requirement) * 100);
        document.getElementById('promotion-fill').style.width = progress + '%';
        document.getElementById('promotion-progress-text').textContent = gameState.promotionProgress + '/' + requirement;
    } else {
        document.getElementById('promotion-fill').style.width = '100%';
        document.getElementById('promotion-progress-text').textContent = '已达最高';
    }
    
    document.getElementById('streak-count').textContent = gameState.consecutiveCorrect;
    var streakBadge = document.getElementById('streak-badge');
    if (gameState.consecutiveCorrect >= 5) {
        streakBadge.style.background = 'rgba(246,224,94,0.2)';
        streakBadge.style.color = '#f6e05e';
    } else if (gameState.consecutiveCorrect >= 3) {
        streakBadge.style.background = 'rgba(252,129,129,0.15)';
        streakBadge.style.color = '#fc8181';
    } else {
        streakBadge.style.background = 'rgba(160,174,192,0.1)';
        streakBadge.style.color = '#a0aec0';
    }
    
    updateStatBar('satisfaction', gameState.satisfaction);
    updateStatBar('development', gameState.development);
    updateStatBar('reputation', gameState.reputation);
    updateStatBar('risk', gameState.risk);
}

function updateBackground(level) {
    var gamePage = document.getElementById('game-page');
    gamePage.style.background = 'linear-gradient(180deg, ' + level.bgColor + ' 0%, #0f172a 100%)';
    var sceneTag = document.getElementById('scene-tag');
    if (sceneTag) sceneTag.textContent = '📍 ' + level.scene;
}

function updateStatBar(stat, value) {
    value = Math.max(0, Math.min(100, value));
    document.getElementById('bar-' + stat).style.width = value + '%';
    document.getElementById('val-' + stat).textContent = value;
}

// 显示下一个事件
function showNextEvent() {
    // 记录已出现事件索引，降低重复概率
    if (!window.appearedEventIndices) window.appearedEventIndices = [];
    var availableIndices = [];
    for (var i = 0; i < events.length; i++) {
        if (!window.appearedEventIndices.includes(i)) {
            availableIndices.push(i);
        }
    }
    // 如果所有事件都出现过，重置记录
    if (availableIndices.length === 0) {
        window.appearedEventIndices = [];
        availableIndices = Array.from({length: events.length}, (_, i) => i);
    }
    // 随机选取未出现过的事件，重复概率降低
    var randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    window.appearedEventIndices.push(randomIndex);
    currentEvent = events[randomIndex];
    
    document.getElementById('event-type').textContent = currentEvent.type;
    document.getElementById('event-scene').textContent = currentEvent.scene;
    document.getElementById('event-title').textContent = currentEvent.title;
    document.getElementById('event-description').textContent = currentEvent.description;
    
    var starsHtml = '';
    for (var i = 0; i < 5; i++) {
        starsHtml += i < currentEvent.stars ? '⭐' : '☆';
    }
    document.getElementById('event-stars').innerHTML = starsHtml;
    
    var choicesArea = document.getElementById('choices-area');
    choicesArea.innerHTML = '';
    
    var indices = [0, 1];
    if (Math.random() > 0.5) indices.reverse();
    
    indices.forEach(function(idx) {
        var choice = currentEvent.choices[idx];
        var btn = document.createElement('div');
        btn.className = 'choice-btn';
        btn.innerHTML = '<span class="choice-text">' + choice.text + '</span>';
        btn.onclick = function() { makeChoice(idx); };
        choicesArea.appendChild(btn);
    });
}

// 做出选择
function makeChoice(choiceIndex) {
    var choice = currentEvent.choices[choiceIndex];
    var effects = choice.effects;
    var stars = currentEvent.stars || 1;
    var multiplier = 1 + (stars - 1) * 0.2;
    
    if (effects.satisfaction) gameState.satisfaction += Math.round(effects.satisfaction * multiplier);
    if (effects.development) gameState.development += Math.round(effects.development * multiplier);
    if (effects.reputation) gameState.reputation += Math.round(effects.reputation * multiplier);
    if (effects.risk) gameState.risk += Math.round(effects.risk * multiplier);
    
    gameState.satisfaction = Math.max(0, Math.min(100, gameState.satisfaction));
    gameState.development = Math.max(0, Math.min(100, gameState.development));
    gameState.reputation = Math.max(0, Math.min(100, gameState.reputation));
    gameState.risk = Math.max(0, Math.min(100, gameState.risk));
    
    gameState.totalEvents++;
    if (choice.correct) {
        gameState.correctChoices++;
        gameState.consecutiveCorrect++;
        var progressGain = 3 + stars;
        if (gameState.consecutiveCorrect >= 3) progressGain += 2;
        if (gameState.consecutiveCorrect >= 5) progressGain += 3;
        gameState.promotionProgress += progressGain;
    } else {
        gameState.consecutiveCorrect = 0;
        gameState.promotionProgress = Math.max(0, gameState.promotionProgress - (5 + stars * 2));
    }
    
    gameState.month++;
    if (gameState.month > 12) {
        gameState.month = 1;
        gameState.year++;
        checkAchievement('year_passed');
    }
    
    showResult(choice, effects, stars);
    checkAchievements(choice);
    checkPromotion();
    if (checkGameOver()) return;
    updateUI();
    saveGame();
}

// 显示选择结果
function showResult(choice, effects, stars) {
    var modal = document.getElementById('result-modal');
    var icon = document.getElementById('result-icon');
    var title = document.getElementById('result-title');
    var text = document.getElementById('result-text');
    var effectsDiv = document.getElementById('result-effects');
    var ruleTip = document.getElementById('rule-tip');
    var crimeDiv = document.getElementById('crime-info');
    
    if (choice.correct) {
        icon.textContent = '✅';
        title.textContent = '做得好！';
        text.textContent = '你的选择符合八项规定精神，赢得了群众和组织的认可。';
        if (crimeDiv) crimeDiv.style.display = 'none';
    } else {
        icon.textContent = '⚠️';
        title.textContent = '违规警告';
        text.textContent = '这个选择违反了相关规定，要引以为戒！';
        
        if (currentEvent.crime && crimeDiv) {
            var crime = crimeTypes[currentEvent.crime];
            crimeDiv.style.display = 'block';
            crimeDiv.innerHTML = '<div class="crime-header">⚖️ 涉嫌违法</div>' +
                '<div class="crime-name">' + crime.name + '</div>' +
                '<div class="crime-law">' + crime.law + '</div>' +
                '<div class="crime-penalty">可能面临：' + crime.penalty + '</div>';
        } else if (crimeDiv) {
            crimeDiv.style.display = 'none';
        }
    }
    
    effectsDiv.innerHTML = '';
    var effectNames = { satisfaction: '群众满意', development: '城镇发展', reputation: '政治声望', risk: '廉政风险' };
    var multiplier = 1 + (stars - 1) * 0.2;
    
    for (var key in effects) {
        if (effects[key] !== 0) {
            var tag = document.createElement('span');
            var actualEffect = Math.round(effects[key] * multiplier);
            var isPositive = (key === 'risk') ? actualEffect < 0 : actualEffect > 0;
            tag.className = 'effect-tag ' + (isPositive ? 'effect-positive' : 'effect-negative');
            var sign = actualEffect > 0 ? '+' : '';
            tag.textContent = effectNames[key] + ' ' + sign + actualEffect;
            effectsDiv.appendChild(tag);
        }
    }
    
    if (currentEvent.rule) {
        ruleTip.style.display = 'block';
        ruleTip.innerHTML = '<strong>📜 相关规定：</strong>' + currentEvent.rule;
    } else {
        ruleTip.style.display = 'none';
    }
    
    modal.classList.add('active');
}

function closeResultAndContinue() {
    document.getElementById('result-modal').classList.remove('active');
    showNextEvent();
}

// 检查成就
function checkAchievements(choice) {
    if (choice.correct && !gameState.achievements.includes('first_right')) unlockAchievement('first_right');
    if (gameState.correctChoices >= 10 && !gameState.achievements.includes('clean_10')) unlockAchievement('clean_10');
    if (gameState.satisfaction >= 100 && !gameState.achievements.includes('max_satisfaction')) unlockAchievement('max_satisfaction');
}

function checkAchievement(id) {
    if (!gameState.achievements.includes(id)) unlockAchievement(id);
}

function unlockAchievement(id) {
    var achievement = achievementsList.find(function(a) { return a.id === id; });
    if (achievement && !gameState.achievements.includes(id)) gameState.achievements.push(id);
}

// 检查升职
function checkPromotion() {
    var nextLevel = gameState.level + 1;
    if (nextLevel < careerLevels.length && 
        gameState.promotionProgress >= careerLevels[nextLevel].requirement &&
        gameState.risk < 50 && gameState.satisfaction >= 40 && gameState.reputation >= 30) {
        
        var oldLevel = careerLevels[gameState.level];
        gameState.level = nextLevel;
        var newLevel = careerLevels[gameState.level];
        
        document.getElementById('promotion-from').textContent = oldLevel.title;
        document.getElementById('promotion-to').textContent = newLevel.badge + ' ' + newLevel.title;
        document.getElementById('promotion-msg').textContent = '调任' + newLevel.position + '，继续为人民服务！';
        
        setTimeout(function() {
            document.getElementById('promotion-modal').classList.add('active');
        }, 500);
        
        if (!gameState.achievements.includes('promoted')) unlockAchievement('promoted');
    }
}

// 检查游戏结束
function checkGameOver() {
    var gameOver = false, reason = '', icon = '😔';
    
    if (gameState.risk >= 100) {
        gameOver = true;
        reason = '廉政风险过高，你因违纪违法被查处，仕途终结。';
        icon = '🚨';
    } else if (gameState.satisfaction <= 0) {
        gameOver = true;
        reason = '群众满意度过低，你因脱离群众被免职。';
        icon = '😞';
    } else if (gameState.reputation <= 0) {
        gameOver = true;
        reason = '政治声望过低，你被调离领导岗位。';
        icon = '📉';
    }
    
    if (gameOver) {
        showGameOver(reason, icon);
        return true;
    }
    return false;
}

function showGameOver(reason, icon) {
    document.getElementById('gameover-icon').textContent = icon;
    document.getElementById('gameover-reason').textContent = reason;
    
    var stats = document.getElementById('gameover-stats');
    stats.innerHTML = '<div class="gameover-stat"><span>最终职位</span><span>' + careerLevels[gameState.level].title + '</span></div>' +
        '<div class="gameover-stat"><span>任职时长</span><span>' + gameState.totalEvents + '个月</span></div>' +
        '<div class="gameover-stat"><span>正确决策</span><span>' + gameState.correctChoices + '次</span></div>' +
        '<div class="gameover-stat"><span>获得成就</span><span>' + gameState.achievements.length + '个</span></div>';
    
    document.getElementById('gameover-modal').classList.add('active');
    localStorage.removeItem('gameState');
}

function restartGame() {
    document.getElementById('gameover-modal').classList.remove('active');
    startGame();
}

// 显示八项规定
function showRules() {
    var list = document.getElementById('rules-list');
    list.innerHTML = '';
    eightRules.forEach(function(rule, index) {
        var item = document.createElement('div');
        item.className = 'rule-item';
        item.innerHTML = '<div class="rule-item-title">第' + (index + 1) + '条：' + rule.title + '</div>' +
            '<div class="rule-item-content">' + rule.content + '</div>';
        list.appendChild(item);
    });
    document.getElementById('rules-modal').classList.add('active');
}

// 显示成就
function showAchievements() {
    var list = document.getElementById('achievements-list');
    list.innerHTML = '';
    achievementsList.forEach(function(achievement) {
        var unlocked = gameState.achievements.includes(achievement.id);
        var item = document.createElement('div');
        item.className = 'achievement-item ' + (unlocked ? '' : 'locked');
        item.innerHTML = '<div class="achievement-icon">' + (unlocked ? achievement.icon : '🔒') + '</div>' +
            '<div class="achievement-info"><h4>' + achievement.title + '</h4><p>' + achievement.desc + '</p></div>';
        list.appendChild(item);
    });
    document.getElementById('achievements-modal').classList.add('active');
}

// 显示仕途
function showCareer() {
    var path = document.getElementById('career-path');
    path.innerHTML = '';
    careerLevels.forEach(function(level, index) {
        var isCurrent = index === gameState.level;
        var isUnlocked = index <= gameState.level;
        var item = document.createElement('div');
        item.className = 'career-level ' + (isCurrent ? 'current' : '') + ' ' + (isUnlocked ? '' : 'locked');
        item.innerHTML = '<div class="career-badge">' + (isUnlocked ? level.badge : '🔒') + '</div>' +
            '<div class="career-info"><h4>' + level.title + '</h4><p>' + level.position + '</p></div>';
        path.appendChild(item);
    });
    document.getElementById('career-modal').classList.add('active');
}

function closeModal(modalId) { document.getElementById(modalId).classList.remove('active'); }
function confirmExit() { if (confirm('确定要退出吗？')) { saveGame(); showPage('start-page'); } }
function saveGame() { localStorage.setItem('gameState', JSON.stringify(gameState)); }
function loadGame() { var saved = localStorage.getItem('gameState'); if (saved) gameState = JSON.parse(saved); }
function checkSavedGame() { if (localStorage.getItem('gameState')) document.getElementById('btn-continue').style.display = 'block'; }

document.addEventListener('DOMContentLoaded', function() { checkSavedGame(); });


// 案例数据
var casesData = {
    categories: [
        { id: "all", name: "全部案例", icon: "📋" },
        { id: "bribery", name: "受贿案例", icon: "💰" },
        { id: "embezzlement", name: "贪污案例", icon: "📦" },
        { id: "abuse", name: "滥用职权", icon: "⚖️" },
        { id: "lifestyle", name: "违规吃喝", icon: "🍽" },
        { id: "vehicle", name: "公车私用", icon: "🚗" },
        { id: "gift", name: "违规收礼", icon: "🎁" }
    ],
    cases: [
        {
            id: 1, category: "bribery", title: "某县住建局局长受贿案", year: "2023",
            location: "某省某县", position: "住建局局长",
            summary: "利用职务便利，在工程项目承揽、工程款拨付等方面为他人谋取利益，非法收受财物共计人民币286万元。",
            violation: "违反廉洁纪律，利用职权为他人谋取利益并收受财物",
            law: "《刑法》第三百八十五条",
            result: "判处有期徒刑十年六个月，并处罚金80万元",
            lesson: "权力是人民赋予的，只能用来为人民服务，绝不能成为谋取私利的工具。"
        },
        {
            id: 2, category: "bribery", title: "某市交通局副局长受贿案", year: "2022",
            location: "某省某市", position: "交通局副局长",
            summary: "在道路工程招投标、工程验收等环节为多家企业提供帮助，先后收受贿赂共计152万元。",
            violation: "违反廉洁纪律，在工程建设领域大肆敛财",
            law: "《刑法》第三百八十五条",
            result: "判处有期徒刑七年，并处罚金50万元",
            lesson: "工程建设领域是腐败高发区，必须严格遵守招投标程序。"
        },
        {
            id: 3, category: "embezzlement", title: "某镇财政所所长贪污案", year: "2023",
            location: "某省某镇", position: "财政所所长",
            summary: "利用管理惠农补贴资金的职务便利，通过虚报冒领、截留侵吞等方式，贪污公款共计89万元。",
            violation: "违反廉洁纪律，侵吞惠农资金",
            law: "《刑法》第三百八十二条",
            result: "判处有期徒刑五年六个月，并处罚金30万元",
            lesson: "惠农资金是农民的救命钱，任何人都不能打歪主意。"
        },
        {
            id: 4, category: "embezzlement", title: "某区民政局科长套取资金案", year: "2022",
            location: "某省某区", position: "民政局救助科科长",
            summary: "通过虚构救助对象、虚报救助金额等方式，套取低保金、临时救助金共计43万元据为己有。",
            violation: "违反廉洁纪律，套取民生资金",
            law: "《刑法》第三百八十二条",
            result: "判处有期徒刑四年，并处罚金20万元",
            lesson: "民生资金关系群众切身利益，必须专款专用。"
        },
        {
            id: 5, category: "abuse", title: "某县自然资源局局长滥用职权案", year: "2023",
            location: "某省某县", position: "自然资源局局长",
            summary: "违规审批农用地转建设用地，为某房地产公司违法占地提供便利，造成国家土地出让金损失1200余万元。",
            violation: "违反工作纪律，滥用职权造成国家重大经济损失",
            law: "《刑法》第三百九十七条",
            result: "判处有期徒刑三年，缓刑四年",
            lesson: "土地是不可再生资源，必须严格依法依规审批。"
        },
        {
            id: 6, category: "abuse", title: "某街道办主任玩忽职守案", year: "2022",
            location: "某省某市", position: "街道办事处主任",
            summary: "对辖区内违法建设监管不力，未及时制止和上报，导致违建面积扩大至3000平方米。",
            violation: "违反工作纪律，玩忽职守",
            law: "《刑法》第三百九十七条",
            result: "判处有期徒刑一年六个月，缓刑二年",
            lesson: "基层干部要切实履行监管职责，发现问题及时处理。"
        },
        {
            id: 7, category: "lifestyle", title: "某局违规公款吃喝案", year: "2023",
            location: "某省某市", position: "某局党组书记、局长",
            summary: "多次组织或参与公款吃喝，在高档酒店宴请客商，消费高档烟酒，累计金额达12万元。",
            violation: "违反中央八项规定精神，违规公款吃喝",
            law: "《党纪处分条例》第一百零三条",
            result: "给予党内严重警告处分，免去局长职务",
            lesson: "公款姓公，一分一厘都不能乱花。"
        },
        {
            id: 8, category: "vehicle", title: "某局长公车私用案", year: "2023",
            location: "某省某县", position: "某局局长",
            summary: "多次使用公务用车接送子女上下学、办理私人事务，累计行驶里程超过2000公里。",
            violation: "违反中央八项规定精神，公车私用",
            law: "《党纪处分条例》第一百零七条",
            result: "给予党内警告处分，补缴相关费用",
            lesson: "公车姓公，私用必究。要严格区分公私界限。"
        },
        {
            id: 9, category: "gift", title: "某处长违规收受礼品礼金案", year: "2023",
            location: "某省某厅", position: "某处处长",
            summary: "在春节、中秋等节日期间，收受管理服务对象所送购物卡、高档烟酒等礼品礼金，价值共计6.8万元。",
            violation: "违反廉洁纪律，违规收受礼品礼金",
            law: "《党纪处分条例》第八十八条",
            result: "给予党内严重警告处分，违纪所得全部收缴",
            lesson: "节日期间是四风问题高发期，要坚决拒收任何礼品礼金。"
        },
        {
            id: 10, category: "gift", title: "某科长借婚丧嫁娶敛财案", year: "2022",
            location: "某省某区", position: "某局科长",
            summary: "借女儿结婚之机，违规大操大办，宴请管理服务对象120余人，收受礼金9.2万元。",
            violation: "违反廉洁纪律，借机敛财",
            law: "《党纪处分条例》第九十一条",
            result: "给予党内严重警告处分，违规收受礼金全部退还",
            lesson: "婚丧嫁娶要从简，不能借机敛财。"
        }
    ]
};

var currentCaseCategory = 'all';

// 显示案例库
function showCases() {
    var categoriesDiv = document.getElementById('cases-categories');
    categoriesDiv.innerHTML = '';
    
    casesData.categories.forEach(function(cat) {
        var btn = document.createElement('div');
        btn.className = 'category-btn' + (cat.id === currentCaseCategory ? ' active' : '');
        btn.textContent = cat.icon + ' ' + cat.name;
        btn.onclick = function() { filterCases(cat.id); };
        categoriesDiv.appendChild(btn);
    });
    
    renderCasesList();
    document.getElementById('cases-modal').classList.add('active');
}

function filterCases(categoryId) {
    currentCaseCategory = categoryId;
    document.querySelectorAll('.category-btn').forEach(function(btn, index) {
        btn.className = 'category-btn' + (casesData.categories[index].id === categoryId ? ' active' : '');
    });
    renderCasesList();
}

function renderCasesList() {
    var listDiv = document.getElementById('cases-list');
    listDiv.innerHTML = '';
    
    var filteredCases = currentCaseCategory === 'all' 
        ? casesData.cases 
        : casesData.cases.filter(function(c) { return c.category === currentCaseCategory; });
    
    if (filteredCases.length === 0) {
        listDiv.innerHTML = '<div style="text-align:center;color:#a0aec0;padding:20px;">暂无案例</div>';
        return;
    }
    
    filteredCases.forEach(function(caseItem) {
        var item = document.createElement('div');
        item.className = 'case-item';
        item.innerHTML = '<div class="case-item-header">' +
            '<span class="case-item-title">' + caseItem.title + '</span>' +
            '<span class="case-item-year">' + caseItem.year + '</span>' +
            '</div>' +
            '<div class="case-item-summary">' + caseItem.summary + '</div>';
        item.onclick = function() { showCaseDetail(caseItem); };
        listDiv.appendChild(item);
    });
}

function showCaseDetail(caseItem) {
    document.getElementById('case-detail-title').textContent = caseItem.title;
    
    var detailDiv = document.getElementById('case-detail');
    detailDiv.innerHTML = '<div class="case-meta">' +
        '<span class="case-meta-item">📍 ' + caseItem.location + '</span>' +
        '<span class="case-meta-item">👤 ' + caseItem.position + '</span>' +
        '<span class="case-meta-item">📅 ' + caseItem.year + '年</span>' +
        '</div>' +
        '<div class="case-detail-section">' +
        '<div class="case-detail-label">案情摘要</div>' +
        '<div class="case-detail-value">' + caseItem.summary + '</div>' +
        '</div>' +
        '<div class="case-detail-section">' +
        '<div class="case-detail-label">违纪违法事实</div>' +
        '<div class="case-detail-value">' + caseItem.violation + '</div>' +
        '</div>' +
        '<div class="case-detail-section">' +
        '<div class="case-detail-label">适用法规</div>' +
        '<div class="case-detail-value">' + caseItem.law + '</div>' +
        '</div>' +
        '<div class="case-detail-section case-detail-result">' +
        '<div class="case-detail-label">处理结果</div>' +
        '<div class="case-detail-value">' + caseItem.result + '</div>' +
        '</div>' +
        '<div class="case-detail-section case-detail-lesson">' +
        '<div class="case-detail-label">警示教训</div>' +
        '<div class="case-detail-value">' + caseItem.lesson + '</div>' +
        '</div>';
    
    document.getElementById('case-detail-modal').classList.add('active');
}
