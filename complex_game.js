// complex_game.js
// 更复杂的交互体验，目标体验时长约20分钟
// 包含多分支剧情、动态事件、角色关系、资源管理、多结局等

const complexGameState = {
    year: 2024,
    month: 1,
    satisfaction: 60,
    development: 50,
    reputation: 50,
    risk: 0,
    level: 0,
    eventIndex: 0,
    achievements: [],
    totalEvents: 0,
    promotionProgress: 0,
    consecutiveCorrect: 0,
    correctChoices: 0,
    resources: {
        money: 300000,
        staff: 10,
        projects: 2
    },
    relationships: {
        mayor: 50,
        secretary: 50,
        media: 50,
        public: 50
    },
    branchFlags: {},
    endings: []
};

const complexCareerLevels = [
    { title: "基层科员", position: "街道办", badge: "👤", requirement: 0 },
    { title: "副主任科员", position: "街道办", badge: "📋", requirement: 20 },
    { title: "主任科员", position: "街道办", badge: "📁", requirement: 50 },
    { title: "副科长", position: "区民政局", badge: "💼", requirement: 90 },
    { title: "科长", position: "区民政局", badge: "🎖", requirement: 140 },
    { title: "副处长", position: "市发改委", badge: "🏅", requirement: 200 },
    { title: "处长", position: "市发改委", badge: "🎗", requirement: 270 },
    { title: "副局长", position: "市政府办", badge: "⭐", requirement: 350 },
    { title: "局长", position: "市政府办", badge: "🌟", requirement: 450 },
    { title: "副市长", position: "市政府", badge: "🏛️", requirement: 600 },
    { title: "市长", position: "市政府", badge: "👔", requirement: 800 },
    { title: "副厅长", position: "省厅", badge: "🏢", requirement: 1100 },
    { title: "厅长", position: "省厅", badge: "🎩", requirement: 1500 },
    { title: "副省长", position: "省政府", badge: "🏆", requirement: 2000 },
    { title: "省长", position: "省政府", badge: "👑", requirement: 2600 },
    { title: "副国级领导", position: "国务院", badge: "🦅", requirement: 3400 },
    { title: "国务委员", position: "国务院", badge: "🏅", requirement: 4400 },
    { title: "副总理", position: "国务院", badge: "🎖️", requirement: 5600 },
    { title: "总理", position: "国务院", badge: "🏆", requirement: 7000 },
    { title: "国家副主席", position: "国家机关", badge: "🦾", requirement: 9000 },
    { title: "国家主席", position: "国家机关", badge: "🦉", requirement: 12000 }
];

// 复杂事件示例
const complexEvents = [
    {
        id: 1,
        type: "多线任务",
        scene: "🏢",
        title: "三线并举：扶贫、环保、招商",
        description: "你需要在扶贫、环保和招商引资三项任务中分配有限的资金和人力，如何权衡？",
        choices: [
            {
                text: "优先扶贫，兼顾环保，招商次之",
                effects: { satisfaction: 15, development: 5, reputation: 10, risk: 2, money: -30000, staff: -4 },
                branch: "poverty_first"
            },
            {
                text: "优先招商，带动经济，扶贫和环保适度投入",
                effects: { satisfaction: 5, development: 20, reputation: 5, risk: 8, money: -50000, staff: -5 },
                branch: "business_first"
            },
            {
                text: "环保优先，严格执法，扶贫和招商适度",
                effects: { satisfaction: 8, development: 8, reputation: 18, risk: 5, money: -40000, staff: -6 },
                branch: "eco_first"
            }
        ]
    },
    {
        id: 2,
        type: "角色关系",
        scene: "🤝",
        title: "秘书长的请求",
        description: "秘书长希望你帮忙安排其亲戚进单位，你如何应对？",
        choices: [
            {
                text: "拒绝秘书长，坚守原则",
                effects: { reputation: 10, risk: -5, secretary: -20 },
                branch: "refuse_secretary"
            },
            {
                text: "答应秘书长，安排亲戚进单位",
                effects: { satisfaction: -10, risk: 15, secretary: 20 },
                branch: "accept_secretary"
            },
            {
                text: "拖延推诿，既不答应也不拒绝",
                effects: { reputation: -5, secretary: -5 },
                branch: "delay_secretary"
            }
        ]
    },
    {
        id: 3,
        type: "危机处理",
        scene: "🚨",
        title: "突发安全事故",
        description: "辖区内一家化工厂发生泄漏事故，需要紧急处理，你的决策至关重要。",
        choices: [
            {
                text: "立即封锁现场，疏散群众，如实上报",
                effects: { satisfaction: 10, reputation: 15, risk: -10, money: -80000, media: 10 },
                branch: "crisis_honest"
            },
            {
                text: "控制消息传播，私下处理，避免恐慌",
                effects: { satisfaction: -15, reputation: -20, risk: 25, media: -15 },
                branch: "crisis_cover"
            },
            {
                text: "迅速处理事故，同时做好宣传安抚工作",
                effects: { satisfaction: 5, reputation: 8, risk: 3, money: -60000, media: 5 },
                branch: "crisis_balanced"
            }
        ]
    },
    {
        id: 4,
        type: "资源分配",
        scene: "💰",
        title: "年度预算分配",
        description: "新一年度的预算已经下达，各部门都在争取更多资金，你需要合理分配。",
        choices: [
            {
                text: "重点投入基础设施建设",
                effects: { development: 20, satisfaction: 8, money: -100000, projects: 3 },
                branch: "budget_infrastructure"
            },
            {
                text: "优先保障民生项目",
                effects: { satisfaction: 18, reputation: 12, money: -80000, public: 15 },
                branch: "budget_livelihood"
            },
            {
                text: "平均分配，各部门都有份",
                effects: { satisfaction: 5, development: 5, reputation: 5, money: -90000 },
                branch: "budget_average"
            }
        ]
    },
    {
        id: 5,
        type: "人事调整",
        scene: "👥",
        title: "重要职位空缺",
        description: "一个关键部门的负责人即将退休，需要选择继任者，人选各有优劣。",
        choices: [
            {
                text: "提拔年轻有为的干部",
                effects: { development: 12, risk: 5, staff: 2, reputation: 8 },
                branch: "promote_young"
            },
            {
                text: "选择经验丰富的老同志",
                effects: { satisfaction: 8, risk: -8, reputation: 10 },
                branch: "promote_experienced"
            },
            {
                text: "从外单位引进人才",
                effects: { development: 15, risk: 10, reputation: 5, money: -20000 },
                branch: "recruit_external"
            }
        ]
    },
    {
        id: 6,
        type: "媒体应对",
        scene: "📺",
        title: "负面报道应对",
        description: "有媒体报道了你所在部门的工作问题，引起了一定关注，你如何应对？",
        choices: [
            {
                text: "主动召开发布会，公开回应质疑",
                effects: { reputation: 10, media: 15, risk: -5, satisfaction: 5 },
                branch: "media_transparent"
            },
            {
                text: "通过关系施压，要求撤稿",
                effects: { reputation: -15, media: -20, risk: 20, satisfaction: -10 },
                branch: "media_pressure"
            },
            {
                text: "暂时不回应，让事情自然平息",
                effects: { reputation: -8, media: -5, satisfaction: -5 },
                branch: "media_ignore"
            }
        ]
    },
    {
        id: 7,
        type: "政策制定",
        scene: "📜",
        title: "新政策出台",
        description: "上级要求制定新的便民政策，但实施起来会增加工作量和成本。",
        choices: [
            {
                text: "严格按要求执行，确保政策落地",
                effects: { satisfaction: 15, reputation: 12, risk: -3, money: -50000, staff: -3 },
                branch: "policy_strict"
            },
            {
                text: "适度调整，既执行政策又控制成本",
                effects: { satisfaction: 8, reputation: 5, money: -30000, staff: -1 },
                branch: "policy_moderate"
            },
            {
                text: "表面执行，实际打折扣",
                effects: { satisfaction: -5, reputation: -10, risk: 15, money: -10000 },
                branch: "policy_superficial"
            }
        ]
    },
    {
        id: 8,
        type: "廉政考验",
        scene: "⚖️",
        title: "利益诱惑",
        description: "有企业老板暗示可以提供好处，希望在项目审批上得到关照。",
        choices: [
            {
                text: "严词拒绝，按程序办事",
                effects: { reputation: 20, risk: -10, satisfaction: 5 },
                branch: "reject_bribe"
            },
            {
                text: "接受好处，给予便利",
                effects: { reputation: -25, risk: 30, money: 50000, development: 5 },
                branch: "accept_bribe"
            },
            {
                text: "不收好处，但暗示可以通融",
                effects: { reputation: -5, risk: 15, satisfaction: -3 },
                branch: "hint_favor"
            }
        ]
    },
    {
        id: 9,
        type: "群众工作",
        scene: "👨‍👩‍👧‍👦",
        title: "信访问题处理",
        description: "有群众长期上访反映问题，涉及历史遗留问题，处理难度大。",
        choices: [
            {
                text: "深入调研，彻底解决问题",
                effects: { satisfaction: 20, reputation: 15, risk: -5, money: -70000, staff: -2 },
                branch: "solve_thoroughly"
            },
            {
                text: "简单处理，息事宁人",
                effects: { satisfaction: 5, reputation: -3, risk: 8, money: -20000 },
                branch: "solve_simply"
            },
            {
                text: "推诿扯皮，不想管这事",
                effects: { satisfaction: -15, reputation: -20, risk: 20, public: -15 },
                branch: "avoid_problem"
            }
        ]
    },
    {
        id: 10,
        type: "创新项目",
        scene: "💡",
        title: "数字化改革试点",
        description: "上级推广数字化改革，要求你们单位作为试点，但投入巨大且风险未知。",
        choices: [
            {
                text: "积极响应，全力推进数字化改革",
                effects: { development: 25, reputation: 18, risk: 12, money: -120000, staff: -4 },
                branch: "digital_aggressive"
            },
            {
                text: "稳步推进，边试点边总结",
                effects: { development: 15, reputation: 10, risk: 5, money: -80000, staff: -2 },
                branch: "digital_steady"
            },
            {
                text: "消极应付，做做样子",
                effects: { development: 2, reputation: -8, risk: 8, money: -30000 },
                branch: "digital_passive"
            }
        ]
    },
    {
        id: 11,
        type: "国际合作",
        scene: "🌍",
        title: "国际交流项目",
        description: "有机会参与一个国际合作项目，但需要投入大量精力和资源。",
        choices: [
            {
                text: "积极参与，展示中国形象",
                effects: { reputation: 20, development: 15, risk: 8, money: -100000, staff: -3 },
                branch: "international_active"
            },
            {
                text: "谨慎参与，控制风险",
                effects: { reputation: 8, development: 8, risk: 2, money: -50000 },
                branch: "international_cautious"
            },
            {
                text: "婉拒邀请，专注本职工作",
                effects: { satisfaction: 5, development: -3, reputation: -5 },
                branch: "international_decline"
            }
        ]
    },
    {
        id: 12,
        type: "团队建设",
        scene: "👨‍💼",
        title: "团队士气问题",
        description: "最近团队士气低落，工作效率下降，你需要采取措施提升团队凝聚力。",
        choices: [
            {
                text: "组织团建活动，增进感情",
                effects: { satisfaction: 12, development: 8, money: -25000, staff: 2 },
                branch: "team_building"
            },
            {
                text: "提高福利待遇，物质激励",
                effects: { satisfaction: 15, development: 5, money: -60000, staff: 1 },
                branch: "material_incentive"
            },
            {
                text: "严格管理，提高要求",
                effects: { satisfaction: -5, development: 10, risk: 5, staff: -1 },
                branch: "strict_management"
            }
        ]
    },
    {
        id: 13,
        type: "技术升级",
        scene: "💻",
        title: "信息化系统升级",
        description: "现有的办公系统已经落后，需要升级，但会影响短期工作效率。",
        choices: [
            {
                text: "全面升级，一步到位",
                effects: { development: 25, satisfaction: -10, risk: 15, money: -150000 },
                branch: "full_upgrade"
            },
            {
                text: "分步升级，逐步实施",
                effects: { development: 15, satisfaction: 3, risk: 5, money: -80000 },
                branch: "gradual_upgrade"
            },
            {
                text: "维持现状，节约成本",
                effects: { development: -8, satisfaction: 2, money: -10000 },
                branch: "maintain_status"
            }
        ]
    },
    {
        id: 14,
        type: "教育培训",
        scene: "🎓",
        title: "干部培训计划",
        description: "上级要求实施干部培训计划，提升队伍素质，但需要投入时间和资金。",
        choices: [
            {
                text: "制定全面培训计划，提升能力",
                effects: { development: 20, reputation: 12, money: -70000, staff: -2 },
                branch: "comprehensive_training"
            },
            {
                text: "选择重点人员培训",
                effects: { development: 12, reputation: 8, money: -40000, staff: -1 },
                branch: "selective_training"
            },
            {
                text: "形式化培训，应付检查",
                effects: { development: 2, reputation: -5, risk: 8, money: -15000 },
                branch: "formal_training"
            }
        ]
    },
    {
        id: 15,
        type: "环境治理",
        scene: "🌳",
        title: "环境污染整治",
        description: "辖区内出现环境污染问题，群众反映强烈，需要立即处理。",
        choices: [
            {
                text: "铁腕治污，严厉整治",
                effects: { reputation: 18, satisfaction: 15, risk: 10, money: -90000, development: -5 },
                branch: "strict_pollution_control"
            },
            {
                text: "协调企业，逐步改善",
                effects: { reputation: 8, satisfaction: 8, development: 5, money: -50000 },
                branch: "gradual_pollution_control"
            },
            {
                text: "睁一只眼闭一只眼",
                effects: { reputation: -20, satisfaction: -15, risk: 25, public: -20 },
                branch: "ignore_pollution"
            }
        ]
    },
    {
        id: 16,
        type: "突发事件",
        scene: "🚨",
        title: "重大安全事故",
        description: "辖区内发生工厂爆炸事故，造成人员伤亡，媒体高度关注，上级要求紧急处理。",
        choices: [
            {
                text: "立即赶赴现场，全力救援，公开透明处理",
                effects: { satisfaction: 20, reputation: 25, risk: -15, money: -150000, staff: -5, media: 20 },
                branch: "emergency_transparent"
            },
            {
                text: "先控制消息传播，再处理事故",
                effects: { satisfaction: -25, reputation: -30, risk: 35, media: -25, public: -20 },
                branch: "emergency_cover"
            },
            {
                text: "紧急救援同时做好舆论引导",
                effects: { satisfaction: 10, reputation: 15, risk: 8, money: -100000, staff: -3, media: 8 },
                branch: "emergency_balanced"
            }
        ]
    },
    {
        id: 17,
        type: "突发事件",
        scene: "🌊",
        title: "特大洪涝灾害",
        description: "连日暴雨引发特大洪涝，群众生命财产受威胁，需要立即组织抢险救灾。",
        choices: [
            {
                text: "全力动员，不惜一切代价救援群众",
                effects: { satisfaction: 30, reputation: 20, risk: -10, money: -200000, staff: -6 },
                branch: "flood_all_out"
            },
            {
                text: "等待上级支援，避免盲目行动",
                effects: { satisfaction: -20, reputation: -25, risk: 15, public: -25 },
                branch: "flood_wait"
            },
            {
                text: "有序组织救援，确保人员安全",
                effects: { satisfaction: 18, reputation: 12, risk: 3, money: -120000, staff: -3 },
                branch: "flood_organized"
            }
        ]
    },
    {
        id: 18,
        type: "突发事件",
        scene: "🔥",
        title: "森林火灾告急",
        description: "辖区森林发生大火，火势蔓延迅速，威胁附近村庄，情况十分紧急。",
        choices: [
            {
                text: "立即调集所有力量扑火救灾",
                effects: { satisfaction: 25, development: -5, reputation: 18, money: -180000, staff: -4 },
                branch: "fire_immediate"
            },
            {
                text: "先撤离群众，再组织专业扑火",
                effects: { satisfaction: 15, reputation: 10, risk: 5, money: -100000, staff: -2 },
                branch: "fire_evacuate_first"
            },
            {
                text: "请求省里派遣专业消防队伍",
                effects: { satisfaction: -10, reputation: -8, risk: 12, mayor: -10 },
                branch: "fire_request_help"
            }
        ]
    },
    {
        id: 19,
        type: "突发事件",
        scene: "🦠",
        title: "疫情突然爆发",
        description: "发现多例确诊病例，疫情有扩散风险，需要立即采取防控措施。",
        choices: [
            {
                text: "立即封控，全面排查，不惜代价",
                effects: { satisfaction: 20, reputation: 25, development: -15, risk: -8, money: -250000 },
                branch: "epidemic_strict"
            },
            {
                text: "精准防控，最小化影响经济发展",
                effects: { satisfaction: 8, development: 5, reputation: 10, risk: 8, money: -120000 },
                branch: "epidemic_precise"
            },
            {
                text: "隐瞒疫情，维持正常生产生活",
                effects: { satisfaction: -30, reputation: -40, risk: 50, public: -30, media: -25 },
                branch: "epidemic_cover"
            }
        ]
    },
    {
        id: 20,
        type: "突发事件",
        scene: "⚡",
        title: "大面积停电事故",
        description: "电网故障导致全市大面积停电，医院、学校等重要场所受影响。",
        choices: [
            {
                text: "紧急启动应急预案，优先保障重点区域",
                effects: { satisfaction: 15, development: 8, reputation: 12, money: -80000, staff: -2 },
                branch: "blackout_priority"
            },
            {
                text: "全力抢修电网，恢复正常供电",
                effects: { satisfaction: 12, development: 10, risk: 5, money: -60000, staff: -1 },
                branch: "blackout_repair"
            },
            {
                text: "推卸责任，称是电力部门问题",
                effects: { satisfaction: -18, reputation: -22, risk: 18, public: -20, media: -15 },
                branch: "blackout_blame"
            }
        ]
    },
    {
        id: 21,
        type: "突发事件",
        scene: "🚗",
        title: "重大交通事故",
        description: "高速公路发生多车连撞事故，伤亡严重，交通严重拥堵。",
        choices: [
            {
                text: "立即赶赴现场指挥救援和疏通",
                effects: { satisfaction: 20, reputation: 15, risk: -5, money: -90000, staff: -3 },
                branch: "accident_onsite"
            },
            {
                text: "派遣下属处理，自己坐镇指挥",
                effects: { satisfaction: 8, reputation: 5, risk: 3, money: -50000, staff: -1 },
                branch: "accident_delegate"
            },
            {
                text: "让交警和医院自行处理",
                effects: { satisfaction: -15, reputation: -20, risk: 15, public: -18, media: -12 },
                branch: "accident_ignore"
            }
        ]
    },
    {
        id: 22,
        type: "突发事件",
        scene: "🏭",
        title: "化工厂泄漏事件",
        description: "化工厂发生有毒气体泄漏，附近居民出现不适症状，环保部门要求紧急处置。",
        choices: [
            {
                text: "立即停产整顿，全面检测治理",
                effects: { satisfaction: 22, reputation: 20, development: -10, risk: -12, money: -160000 },
                branch: "chemical_shutdown"
            },
            {
                text: "要求企业限期整改，监督治理",
                effects: { satisfaction: 10, development: 3, reputation: 8, risk: 5, money: -80000 },
                branch: "chemical_reform"
            },
            {
                text: "淡化问题严重性，避免经济损失",
                effects: { satisfaction: -25, reputation: -30, risk: 35, development: 5, public: -25 },
                branch: "chemical_downplay"
            }
        ]
    },
    {
        id: 23,
        type: "突发事件",
        scene: "📱",
        title: "网络舆情危机",
        description: "网上出现大量针对你的不实传言，引起广泛关注和讨论，影响很大。",
        choices: [
            {
                text: "主动澄清事实，公开回应质疑",
                effects: { reputation: 15, media: 20, risk: -8, satisfaction: 8, public: 10 },
                branch: "rumor_clarify"
            },
            {
                text: "联系网络管理部门删除不实信息",
                effects: { reputation: -5, media: -10, risk: 10, satisfaction: -5 },
                branch: "rumor_delete"
            },
            {
                text: "置之不理，相信谣言会不攻自破",
                effects: { reputation: -20, media: -15, risk: 20, public: -18, satisfaction: -12 },
                branch: "rumor_ignore"
            }
        ]
    },
    {
        id: 24,
        type: "突发事件",
        scene: "🏥",
        title: "医疗纠纷群体事件",
        description: "市医院发生医疗纠纷，患者家属聚众闹事，影响医院正常运营。",
        choices: [
            {
                text: "亲自协调处理，公正解决纠纷",
                effects: { satisfaction: 18, reputation: 12, risk: -5, money: -40000, public: 12 },
                branch: "medical_mediate"
            },
            {
                text: "派遣安保力量维持秩序",
                effects: { satisfaction: -8, reputation: -5, risk: 12, money: -20000, public: -10 },
                branch: "medical_security"
            },
            {
                text: "协调双方私下和解",
                effects: { satisfaction: 5, reputation: 3, risk: 5, money: -30000 },
                branch: "medical_private"
            }
        ]
    },
    {
        id: 25,
        type: "突发事件",
        scene: "🎓",
        title: "学校安全事故",
        description: "学校食堂发生食物中毒事件，多名学生住院，家长情绪激动要求严肃处理。",
        choices: [
            {
                text: "立即启动应急预案，全面调查处理",
                effects: { satisfaction: 25, reputation: 18, risk: -8, money: -100000, staff: -3 },
                branch: "school_emergency"
            },
            {
                text: "先安抚家长，再调查原因",
                effects: { satisfaction: 10, reputation: 5, risk: 5, money: -60000, public: 5 },
                branch: "school_appease"
            },
            {
                text: "推说是学校管理问题，自己不负责",
                effects: { satisfaction: -22, reputation: -25, risk: 25, public: -20, media: -18 },
                branch: "school_shirk"
            }
        ]
    },
    {
        id: 26,
        type: "资金获取",
        scene: "💰",
        title: "招商引资成功",
        description: "经过努力，成功引进一家大型企业投资，为本地带来税收和就业机会。",
        choices: [
            {
                text: "合理规划，最大化利用投资效益",
                effects: { development: 20, satisfaction: 10, money: 200000, projects: 2, reputation: 15 },
                branch: "investment_success"
            },
            {
                text: "快速推进项目，尽早见效",
                effects: { development: 15, money: 150000, projects: 1, risk: 5 },
                branch: "investment_fast"
            },
            {
                text: "保守处理，确保项目质量",
                effects: { development: 10, money: 120000, reputation: 8, risk: -3 },
                branch: "investment_conservative"
            }
        ]
    },
    {
        id: 27,
        type: "资金获取",
        scene: "🏛️",
        title: "申请专项资金成功",
        description: "向上级申请的民生改善专项资金获得批准，可用于基础设施建设。",
        choices: [
            {
                text: "全部用于民生项目，惠及群众",
                effects: { satisfaction: 25, money: 180000, public: 20, reputation: 12 },
                branch: "fund_livelihood"
            },
            {
                text: "部分用于基础设施，部分改善民生",
                effects: { satisfaction: 15, development: 15, money: 160000, reputation: 8 },
                branch: "fund_balanced"
            },
            {
                text: "重点投入基础建设，带动发展",
                effects: { development: 25, money: 140000, satisfaction: 8, projects: 2 },
                branch: "fund_infrastructure"
            }
        ]
    },
    {
        id: 28,
        type: "资金获取",
        scene: "🎯",
        title: "绩效奖励获得",
        description: "由于工作出色，获得上级绩效奖励资金，可自主安排使用。",
        choices: [
            {
                text: "奖励下属，提升团队积极性",
                effects: { satisfaction: 18, staff: 3, money: 80000, reputation: 10 },
                branch: "reward_staff"
            },
            {
                text: "投入新项目开发",
                effects: { development: 20, projects: 2, money: 100000 },
                branch: "reward_projects"
            },
            {
                text: "设立应急资金储备",
                effects: { money: 120000, risk: -8, reputation: 5 },
                branch: "reward_reserve"
            }
        ]
    },
    {
        id: 29,
        type: "资金获取",
        scene: "🏢",
        title: "土地出让收益",
        description: "一块商业用地成功出让，获得可观收益，如何使用这笔资金？",
        choices: [
            {
                text: "投入教育医疗等民生事业",
                effects: { satisfaction: 22, money: 250000, public: 18, reputation: 15 },
                branch: "land_livelihood"
            },
            {
                text: "用于城市基础设施建设",
                effects: { development: 25, money: 220000, projects: 3, reputation: 10 },
                branch: "land_infrastructure"
            },
            {
                text: "部分留存，部分投入发展项目",
                effects: { development: 15, money: 200000, satisfaction: 10, projects: 1 },
                branch: "land_mixed"
            }
        ]
    },
    {
        id: 30,
        type: "资金获取",
        scene: "🌟",
        title: "获得创新发展奖",
        description: "创新工作方式获得省里表彰，并获得创新发展专项奖励资金。",
        choices: [
            {
                text: "继续投入创新研发",
                effects: { development: 22, money: 150000, reputation: 18, staff: 2 },
                branch: "innovation_continue"
            },
            {
                text: "推广成功经验，扩大影响",
                effects: { reputation: 25, money: 120000, satisfaction: 12, media: 15 },
                branch: "innovation_promote"
            },
            {
                text: "稳妥使用，避免风险",
                effects: { money: 130000, risk: -10, reputation: 10 },
                branch: "innovation_safe"
            }
        ]
    },
    {
        id: 31,
        type: "满意度奖励",
        scene: "🎉",
        title: "群众推举先进个人",
        description: "由于你的工作得到群众高度认可，被推举为市级先进工作者，获得嘉奖和奖金。",
        choices: [
            {
                text: "谦虚接受，继续努力为民服务",
                effects: { reputation: 15, money: 50000, satisfaction: -80, staff: 1 },
                branch: "humble_accept"
            },
            {
                text: "借机扩大影响，提升知名度",
                effects: { reputation: 25, media: 15, money: 40000, risk: 5, satisfaction: -80 },
                branch: "expand_influence"
            },
            {
                text: "低调处理，专注本职工作",
                effects: { reputation: 8, money: 30000, risk: -3, satisfaction: -80 },
                branch: "low_profile"
            }
        ],
        condition: "satisfaction >= 100"
    },
    {
        id: 32,
        type: "满意度奖励",
        scene: "🌟",
        title: "上级重点关注",
        description: "你的工作成绩突出，上级领导决定重点培养，调你到更重要的岗位历练。",
        choices: [
            {
                text: "欣然接受挑战，迎接新职位",
                effects: { development: 20, reputation: 20, mayor: 25, money: 80000, projects: 2, satisfaction: -80 },
                branch: "accept_promotion"
            },
            {
                text: "请求继续在基层积累经验",
                effects: { public: 20, reputation: 10, money: 30000, satisfaction: -80 },
                branch: "stay_grassroots"
            },
            {
                text: "谦逊推辞，表示还需要学习",
                effects: { reputation: 5, mayor: -5, satisfaction: -80 },
                branch: "decline_humbly"
            }
        ],
        condition: "satisfaction >= 100"
    },
    {
        id: 33,
        type: "满意度奖励",
        scene: "🏆",
        title: "申请重大项目成功",
        description: "凭借良好的群众基础，你申请的民生改善重大项目获得上级批准，资金到位。",
        choices: [
            {
                text: "精心规划，确保项目质量和效果",
                effects: { development: 30, money: 200000, projects: 3, satisfaction: -80, staff: 2 },
                branch: "quality_first"
            },
            {
                text: "快速推进，尽早让群众受益",
                effects: { development: 25, money: 180000, projects: 2, risk: 8, satisfaction: -80 },
                branch: "speed_first"
            },
            {
                text: "稳步实施，边建设边总结经验",
                effects: { development: 20, reputation: 10, money: 160000, projects: 2, satisfaction: -80 },
                branch: "steady_implementation"
            }
        ],
        condition: "satisfaction >= 100"
    },
    {
        id: 34,
        type: "发展度奖励",
        scene: "🚀",
        title: "经济发展典型经验推广",
        description: "你负责的区域发展成效显著，被确定为全省典型，各地纷纷前来学习交流。",
        choices: [
            {
                text: "开放交流，无私分享发展经验",
                effects: { reputation: 25, media: 20, money: 100000, mayor: 15, projects: 1, development: -80 },
                branch: "open_sharing"
            },
            {
                text: "有选择地分享，保留核心优势",
                effects: { reputation: 15, money: 80000, risk: 5, development: -80 },
                branch: "selective_sharing"
            },
            {
                text: "专注自身发展，减少对外交流",
                effects: { money: 50000, reputation: -5, media: -10, development: -80 },
                branch: "focus_internal"
            }
        ],
        condition: "development >= 100"
    },
    {
        id: 35,
        type: "发展度奖励",
        scene: "💼",
        title: "招商引资重大突破",
        description: "凭借良好的发展基础，成功引入一家大型企业总部，带来巨额投资。",
        choices: [
            {
                text: "完善配套，确保企业顺利落户",
                effects: { money: 300000, staff: 3, projects: 4, satisfaction: 10, development: -80 },
                branch: "perfect_support"
            },
            {
                text: "以此为契机，打造产业集群",
                effects: { money: 250000, projects: 5, reputation: 15, risk: 10, development: -80 },
                branch: "build_cluster"
            },
            {
                text: "稳妥推进，避免盲目扩张",
                effects: { money: 200000, projects: 2, risk: -5, development: -80 },
                branch: "steady_progress"
            }
        ],
        condition: "development >= 100"
    },
    {
        id: 36,
        type: "声誉奖励",
        scene: "🎖️",
        title: "省级表彰大会",
        description: "因工作出色，你被邀请参加省级表彰大会并作典型发言，影响力大增。",
        choices: [
            {
                text: "抓住机会，展示工作成果和理念",
                effects: { media: 25, mayor: 20, money: 120000, development: 10, reputation: -80 },
                branch: "showcase_achievement"
            },
            {
                text: "谦虚发言，强调团队和群众功劳",
                effects: { public: 25, satisfaction: 15, staff: 2, money: 80000, reputation: -80 },
                branch: "credit_team"
            },
            {
                text: "简短发言，不过分张扬",
                effects: { money: 50000, risk: -5, reputation: -80 },
                branch: "brief_speech"
            }
        ],
        condition: "reputation >= 100"
    },
    {
        id: 37,
        type: "关系奖励",
        scene: "🤝",
        title: "市长高度信任",
        description: "市长对你的工作非常认可，邀请你参与重要决策，并给予特殊权限。",
        choices: [
            {
                text: "积极参与决策，发挥更大作用",
                effects: { reputation: 20, money: 100000, projects: 3, development: 15, mayor: -80 },
                branch: "mayor_trust_active"
            },
            {
                text: "谦逊低调，稳步推进工作",
                effects: { reputation: 10, money: 60000, risk: -5, mayor: -80 },
                branch: "mayor_trust_modest"
            },
            {
                text: "推辞重任，专注本职工作",
                effects: { money: 40000, satisfaction: 5, mayor: -80 },
                branch: "mayor_trust_decline"
            }
        ],
        condition: "mayor >= 100"
    },
    {
        id: 38,
        type: "关系奖励",
        scene: "📺",
        title: "媒体重点推荐",
        description: "媒体对你的工作高度认可，主动为你制作专题报道，大大提升影响力。",
        choices: [
            {
                text: "配合报道，展示工作成果",
                effects: { reputation: 25, public: 20, money: 80000, satisfaction: 10, media: -80 },
                branch: "media_feature_cooperate"
            },
            {
                text: "谦虚回应，强调团队功劳",
                effects: { reputation: 15, staff: 2, money: 60000, media: -80 },
                branch: "media_feature_humble"
            },
            {
                text: "低调处理，减少曝光",
                effects: { money: 30000, risk: -8, media: -80 },
                branch: "media_feature_lowkey"
            }
        ],
        condition: "media >= 100"
    },
    {
        id: 39,
        type: "关系奖励",
        scene: "👨‍👩‍👧‍👦",
        title: "群众自发支持",
        description: "群众对你的工作非常满意，自发组织支持活动，要求上级给你更多支持。",
        choices: [
            {
                text: "感谢支持，承诺更好服务",
                effects: { satisfaction: 15, reputation: 20, money: 90000, projects: 2, public: -80 },
                branch: "public_support_grateful"
            },
            {
                text: "号召群众理性表达",
                effects: { reputation: 10, money: 50000, risk: -5, public: -80 },
                branch: "public_support_rational"
            },
            {
                text: "劝说群众回归正常生活",
                effects: { money: 40000, satisfaction: -5, public: -80 },
                branch: "public_support_normal"
            }
        ],
        condition: "public >= 100"
    },
    {
        id: 40,
        type: "每月正面事件",
        scene: "📈",
        title: "日常工作成效",
        description: "你的日常工作得到了群众和同事的认可，各项指标稳步提升。",
        choices: [
            {
                text: "继续保持良好状态",
                effects: { satisfaction: 5, development: 3, reputation: 2, money: 20000 },
                branch: "maintain_good_work"
            },
            {
                text: "进一步提升工作标准",
                effects: { satisfaction: 8, development: 5, reputation: 5, money: 10000, staff: -1 },
                branch: "improve_standards"
            },
            {
                text: "适度放松，避免过度劳累",
                effects: { satisfaction: 3, risk: -3, money: 15000 },
                branch: "work_life_balance"
            }
        ]
    },
    {
        id: 41,
        type: "每月正面事件",
        scene: "🌟",
        title: "工作亮点被发现",
        description: "上级在检查中发现了你工作的亮点，给予了积极评价。",
        choices: [
            {
                text: "谦虚接受表扬，继续努力",
                effects: { reputation: 8, satisfaction: 5, mayor: 10, money: 30000 },
                branch: "humble_praise"
            },
            {
                text: "主动汇报更多工作成果",
                effects: { reputation: 12, development: 5, mayor: 15, risk: 3, money: 25000 },
                branch: "proactive_report"
            },
            {
                text: "低调处理，专注工作本身",
                effects: { satisfaction: 3, risk: -5, money: 20000 },
                branch: "low_key_work"
            }
        ]
    }
];

// 复杂结局示例
const complexEndings = [
    {
        id: "excellent",
        title: "传奇仕途",
        description: "你以卓越的领导能力和高尚的品格，成为人民敬仰的优秀领导干部，名垂青史。",
        condition: () => this.state.level >= 15 && this.state.reputation >= 90 && this.state.achievements.length >= 8
    },
    {
        id: "good",
        title: "仕途辉煌",
        description: "你凭借卓越的能力和清正廉洁的作风，最终成为高级领导干部，造福一方。",
        condition: () => this.state.level >= 10 && this.state.reputation >= 70
    },
    {
        id: "corruption",
        title: "锒铛入狱",
        description: "贪污腐败最终败露，你被判刑入狱，身败名裂，家破人亡。",
        condition: () => this.state.branchFlags.accept_bribe && this.state.risk >= 60
    },
    {
        id: "scandal",
        title: "丑闻缠身",
        description: "各种负面事件让你声名狼藉，被迫提前退休，晚节不保。",
        condition: () => this.state.reputation <= 30 && this.state.risk >= 50
    },
    {
        id: "incompetent",
        title: "能力不足",
        description: "由于工作能力不足，屡次犯错，最终被调离重要岗位。",
        condition: () => this.state.development <= 30 && this.state.satisfaction <= 30
    },
    {
        id: "bad",
        title: "仕途终结",
        description: "因违纪违法或民心尽失，你被查处或免职，仕途戛然而止。",
        condition: () => this.state.risk >= 70 || this.state.satisfaction <= 20
    },
    {
        id: "mediocre",
        title: "碌碌无为",
        description: "你在平凡的岗位上度过了职业生涯，没有突出贡献，也没有大的过失。",
        condition: () => this.state.level <= 5 && this.state.totalEvents >= 15
    },
    {
        id: "normal",
        title: "平稳退休",
        description: "你安稳度过仕途生涯，虽无大功，但也无大过，平淡退休。",
        condition: () => true // 默认结局
    },
    {
        id: "early_retirement",
        title: "提前退休",
        description: "你选择提前退休，享受安逸的晚年生活，虽然没有达到职业巅峰，但心情舒畅。",
        condition: () => this.state.branchFlags.early_retirement
    },
    {
        id: "reform_pioneer",
        title: "改革先锋",
        description: "你在改革创新方面作出了突出贡献，成为新时代的改革先锋。",
        condition: () => this.state.branchFlags.digital_aggressive && this.state.development >= 80
    }
];

// 复杂游戏主流程、事件推进、资源管理、分支剧情、结局判定等逻辑

class ComplexGameEngine {
    constructor() {
        this.state = complexGameState;
        this.levels = complexCareerLevels;
        this.events = complexEvents;
        this.endings = complexEndings;
    }

    // 初始化游戏
    initGame() {
        this.state.year = 2024;
        this.state.month = 1;
        this.state.satisfaction = 60;
        this.state.development = 50;
        this.state.reputation = 50;
        this.state.risk = 0;
        this.state.level = 0;
        this.state.eventIndex = 0;
        this.state.achievements = [];
        this.state.totalEvents = 0;
        this.state.promotionProgress = 0;
        this.state.consecutiveCorrect = 0;
        this.state.correctChoices = 0;
        this.state.resources = { money: 300000, staff: 10, projects: 2 };
        this.state.relationships = { mayor: 50, secretary: 50, media: 50, public: 50 };
        this.state.branchFlags = {};
        this.state.endings = [];
    }

    // 获取当前职务信息
    getCurrentLevel() {
        return this.levels[this.state.level] || this.levels[0];
    }

    // 获取下一级职务信息
    getNextLevel() {
        return this.levels[this.state.level + 1] || null;
    }

    // 检查是否可以升职
    canPromote() {
        const nextLevel = this.getNextLevel();
        return nextLevel && this.state.promotionProgress >= nextLevel.requirement;
    }

    // 执行升职
    promote() {
        if (this.canPromote()) {
            const oldLevel = this.state.level;
            this.state.level++;
            const newLevel = this.getCurrentLevel();
            
            // 升职奖励：根据职级给予不同奖励
            const levelBonus = {
                money: (oldLevel + 1) * 50000,  // 每级5万基础奖励
                staff: Math.floor(oldLevel / 2) + 2,  // 员工奖励
                projects: oldLevel >= 5 ? 2 : 1  // 项目奖励
            };
            
            this.state.resources.money += levelBonus.money;
            this.state.resources.staff += levelBonus.staff;
            this.state.resources.projects += levelBonus.projects;
            
            // 升职后难度增加：属性小幅降低，要求更高
            this.state.satisfaction = Math.max(30, this.state.satisfaction - (oldLevel * 2));
            this.state.development = Math.max(30, this.state.development - (oldLevel * 2));
            this.state.reputation = Math.max(30, this.state.reputation - (oldLevel * 1.5));
            
            this.state.promotionProgress = 0; // 重置升职进度
            this.addAchievement(`升职为${newLevel.title}`);
            return true;
        }
        return false;
    }

    // 获取随机事件
    getRandomEvent() {
        // 优先检查奖励事件
        const rewardEvents = this.events.filter(event => {
            if (!event.condition) return false;
            
            // 解析条件字符串
            if (event.condition === "satisfaction >= 100" && this.state.satisfaction >= 100) {
                return true;
            }
            if (event.condition === "development >= 100" && this.state.development >= 100) {
                return true;
            }
            if (event.condition === "reputation >= 100" && this.state.reputation >= 100) {
                return true;
            }
            if (event.condition === "mayor >= 100" && this.state.relationships.mayor >= 100) {
                return true;
            }
            if (event.condition === "media >= 100" && this.state.relationships.media >= 100) {
                return true;
            }
            if (event.condition === "public >= 100" && this.state.relationships.public >= 100) {
                return true;
            }
            
            return false;
        });
        
        // 如果有符合条件的奖励事件，有较高概率选择它们
        if (rewardEvents.length > 0 && Math.random() < 0.7) {
            return rewardEvents[Math.floor(Math.random() * rewardEvents.length)];
        }
        
        // 如果满意度较低，增加正面事件概率
        const positiveEvents = this.events.filter(event =>
            event.type === "每月正面事件" ||
            event.type === "资金获取" ||
            (event.type === "群众工作" && event.id === 9) ||
            (event.type === "政策制定" && event.id === 7)
        );
        
        if (this.state.satisfaction < 40 && positiveEvents.length > 0 && Math.random() < 0.4) {
            return positiveEvents[Math.floor(Math.random() * positiveEvents.length)];
        }
        
        // 否则选择普通事件
        const availableEvents = this.events.filter(event => {
            // 排除奖励事件和正面事件（已单独处理）
            if (event.condition || event.type === "每月正面事件") return false;
            
            // 根据分支标记过滤事件
            if (event.requireBranch && !this.state.branchFlags[event.requireBranch]) {
                return false;
            }
            if (event.excludeBranch && this.state.branchFlags[event.excludeBranch]) {
                return false;
            }
            return true;
        });
        
        return availableEvents[Math.floor(Math.random() * availableEvents.length)];
    }

    // 处理选择效果
    applyChoice(choice) {
        const effects = choice.effects;
        
        // 职级难度系数：级别越高，负面效果放大，正面效果减少
        const levelFactor = 1 + (this.state.level * 0.1); // 每级增加10%难度
        const positiveFactor = Math.max(0.5, 1 - (this.state.level * 0.05)); // 正面效果递减
        
        // 应用基础属性变化（考虑职级影响）
        let satisfactionChange = (effects.satisfaction || 0);
        let developmentChange = (effects.development || 0);
        let reputationChange = (effects.reputation || 0);
        let riskChange = (effects.risk || 0);
        
        // 高职级面临更大挑战
        if (satisfactionChange < 0) satisfactionChange *= levelFactor;
        else satisfactionChange *= positiveFactor;
        
        if (developmentChange < 0) developmentChange *= levelFactor;
        else developmentChange *= positiveFactor;
        
        if (reputationChange < 0) reputationChange *= levelFactor;
        else reputationChange *= positiveFactor;
        
        if (riskChange > 0) riskChange *= levelFactor;
        else riskChange *= positiveFactor;
        
        this.state.satisfaction = Math.max(0, Math.min(100, this.state.satisfaction + satisfactionChange));
        this.state.development = Math.max(0, Math.min(100, this.state.development + developmentChange));
        this.state.reputation = Math.max(0, Math.min(100, this.state.reputation + reputationChange));
        this.state.risk = Math.max(0, Math.min(100, this.state.risk + riskChange));
        
        // 应用资源变化
        if (effects.money) {
            this.state.resources.money = Math.max(0, this.state.resources.money + effects.money);
        }
        if (effects.staff) {
            this.state.resources.staff = Math.max(1, this.state.resources.staff + effects.staff);
            // 员工数量影响工作效率：员工少于5人时，所有属性获得负面影响（减弱影响）
            if (this.state.resources.staff < 5) {
                this.state.satisfaction = Math.max(0, this.state.satisfaction - 3);
                this.state.development = Math.max(0, this.state.development - 3);
                this.state.reputation = Math.max(0, this.state.reputation - 2);
                this.state.risk = Math.min(100, this.state.risk + 2);
            }
            // 员工数量超过20人时，获得效率加成
            if (this.state.resources.staff > 20) {
                this.state.satisfaction = Math.min(100, this.state.satisfaction + 2);
                this.state.development = Math.min(100, this.state.development + 2);
            }
            // 员工数量在10-15人时，获得平衡加成
            if (this.state.resources.staff >= 10 && this.state.resources.staff <= 15) {
                this.state.satisfaction = Math.min(100, this.state.satisfaction + 1);
            }
        }
        if (effects.projects) {
            this.state.resources.projects = Math.max(0, this.state.resources.projects + effects.projects);
        }
        
        // 应用关系变化
        Object.keys(this.state.relationships).forEach(key => {
            if (effects[key]) {
                this.state.relationships[key] = Math.max(0, Math.min(100, this.state.relationships[key] + effects[key]));
            }
        });
        
        // 设置分支标记
        if (choice.branch) {
            this.state.branchFlags[choice.branch] = true;
        }
        
        // 计算升职进度
        const scoreIncrease = (effects.satisfaction || 0) + (effects.development || 0) + (effects.reputation || 0) - (effects.risk || 0);
        this.state.promotionProgress += Math.max(0, scoreIncrease);
        
        // 更新统计
        this.state.totalEvents++;
        if (scoreIncrease > 0) {
            this.state.correctChoices++;
            this.state.consecutiveCorrect++;
        } else {
            this.state.consecutiveCorrect = 0;
        }
        
        // 检查成就
        this.checkAchievements();
        
        // 推进时间
        this.advanceTime();
        
        // 检查升职
        if (this.canPromote()) {
            this.promote();
        }
        
        // 检查游戏结束条件
        return this.checkGameEnd();
    }

    // 推进时间
    advanceTime() {
        this.state.month++;
        if (this.state.month > 12) {
            this.state.month = 1;
            this.state.year++;
        }
    }

    // 检查成就
    checkAchievements() {
        const achievements = [
            {
                id: "first_promotion",
                name: "初次升职",
                condition: () => this.state.level > 0,
                description: "完成第一次职务晋升"
            },
            {
                id: "perfect_score",
                name: "完美表现",
                condition: () => this.state.satisfaction >= 90 && this.state.development >= 90 && this.state.reputation >= 90,
                description: "三项指标同时达到90以上"
            },
            {
                id: "risk_master",
                name: "风险控制大师",
                condition: () => this.state.risk <= 5 && this.state.totalEvents >= 10,
                description: "在处理10个事件后风险值保持在5以下"
            },
            {
                id: "consecutive_correct",
                name: "连胜达人",
                condition: () => this.state.consecutiveCorrect >= 5,
                description: "连续5次做出正确选择"
            },
            {
                id: "resource_manager",
                name: "资源管理专家",
                condition: () => this.state.resources.money >= 200000 && this.state.resources.staff >= 15,
                description: "资金超过20万，员工超过15人"
            },
            {
                id: "relationship_master",
                name: "关系协调专家",
                condition: () => Object.values(this.state.relationships).every(val => val >= 70),
                description: "所有关系指标都达到70以上"
            },
            {
                id: "rapid_promotion",
                name: "火箭提拔",
                condition: () => this.state.level >= 5 && this.state.year <= 2026,
                description: "在两年内晋升到科长级别"
            },
            {
                id: "clean_government",
                name: "清正廉洁",
                condition: () => this.state.branchFlags.reject_bribe && this.state.reputation >= 80,
                description: "拒绝腐败并保持高声誉"
            }
        ];
        
        achievements.forEach(achievement => {
            if (!this.state.achievements.includes(achievement.id) && achievement.condition()) {
                this.addAchievement(achievement.name);
            }
        });
    }

    // 添加成就
    addAchievement(name) {
        this.state.achievements.push(name);
    }

    // 检查游戏结束条件
    checkGameEnd() {
        // 风险过高导致游戏结束
        if (this.state.risk >= 80) {
            return {
                ended: true,
                ending: "bad",
                reason: "风险过高，仕途终结"
            };
        }
        
        // 满意度过低导致游戏结束 - 放宽触发条件，增加缓冲机会
        if (this.state.satisfaction <= 3 && this.state.totalEvents >= 8) {
            return {
                ended: true,
                ending: "bad",
                reason: "民心尽失，被免职"
            };
        }
        
        // 资金耗尽
        if (this.state.resources.money <= 0 && this.state.totalEvents > 5) {
            return {
                ended: true,
                ending: "bad",
                reason: "资金枯竭，管理失控"
            };
        }
        
        // 达到最高级别
        if (this.state.level >= this.levels.length - 1) {
            return {
                ended: true,
                ending: "good",
                reason: "登峰造极，成就辉煌"
            };
        }
        
        // 时间过长，正常结束
        if (this.state.year >= 2034) {
            const avgScore = (this.state.satisfaction + this.state.development + this.state.reputation) / 3;
            if (avgScore >= 70) {
                return {
                    ended: true,
                    ending: "good",
                    reason: "任期圆满，成就显著"
                };
            } else {
                return {
                    ended: true,
                    ending: "normal",
                    reason: "平稳度过，安然退休"
                };
            }
        }
        
        return { ended: false };
    }

    // 获取当前游戏状态摘要
    getGameSummary() {
        return {
            level: this.getCurrentLevel(),
            nextLevel: this.getNextLevel(),
            canPromote: this.canPromote(),
            stats: {
                satisfaction: this.state.satisfaction,
                development: this.state.development,
                reputation: this.state.reputation,
                risk: this.state.risk
            },
            resources: this.state.resources,
            relationships: this.state.relationships,
            time: { year: this.state.year, month: this.state.month },
            achievements: this.state.achievements,
            totalEvents: this.state.totalEvents,
            promotionProgress: this.state.promotionProgress
        };
    }

    // 生成结局报告
    generateEndingReport(endResult) {
        const ending = this.endings.find(e => e.id === endResult.ending);
        const currentLevel = this.getCurrentLevel();
        
        return {
            title: ending.title,
            description: ending.description,
            finalLevel: currentLevel,
            stats: this.getGameSummary().stats,
            achievements: this.state.achievements,
            totalEvents: this.state.totalEvents,
            correctChoices: this.state.correctChoices,
            accuracy: this.state.totalEvents > 0 ? Math.round((this.state.correctChoices / this.state.totalEvents) * 100) : 0,
            playTime: `${this.state.year - 2024}年${this.state.month}个月`
        };
    }

    // 获取事件后续剧情
    getFollowUpEvent(branch) {
        const followUpEvents = {
            poverty_first: {
                id: 11,
                type: "后续剧情",
                scene: "🏠",
                title: "扶贫成果显现",
                description: "你优先投入扶贫的决策开始显现成效，贫困户生活有了明显改善。",
                choices: [
                    {
                        text: "继续加大扶贫投入",
                        effects: { satisfaction: 10, reputation: 8, money: -40000 }
                    },
                    {
                        text: "转向平衡发展",
                        effects: { development: 8, satisfaction: 5 }
                    }
                ]
            },
            crisis_honest: {
                id: 12,
                type: "后续剧情",
                scene: "🏆",
                title: "诚信处理获赞誉",
                description: "你诚实处理安全事故的做法得到了上级和群众的一致赞扬。",
                choices: [
                    {
                        text: "建立常态化安全监管机制",
                        effects: { reputation: 15, risk: -10, money: -50000 }
                    },
                    {
                        text: "总结经验，形成工作手册",
                        effects: { development: 10, reputation: 8 }
                    }
                ]
            },
            accept_bribe: {
                id: 13,
                type: "后续剧情",
                scene: "🚔",
                title: "纪委调查",
                description: "你的受贿行为被举报，纪委开始调查，情况很危险。",
                choices: [
                    {
                        text: "主动坦白，争取宽大处理",
                        effects: { risk: -20, reputation: -15, satisfaction: -10 }
                    },
                    {
                        text: "销毁证据，拒不承认",
                        effects: { risk: 25, reputation: -30 }
                    }
                ]
            }
        };
        
        return followUpEvents[branch] || null;
    }

    // 随机事件触发器
    getRandomEventTrigger() {
        const triggers = [
            { chance: 0.1, event: "突发新闻", description: "媒体突然关注你的工作" },
            { chance: 0.15, event: "上级视察", description: "上级领导突然来视察工作" },
            { chance: 0.05, event: "群众举报", description: "有群众举报你的工作问题" },
            { chance: 0.2, event: "同事求助", description: "同事请求你的帮助" },
            { chance: 0.1, event: "资源紧张", description: "预算削减，资源变得紧张" }
        ];
        
        for (const trigger of triggers) {
            if (Math.random() < trigger.chance) {
                return trigger;
            }
        }
        return null;
    }
}

// 创建游戏引擎实例
const complexGameEngine = new ComplexGameEngine();

// 导出对象供主程序调用
window.complexGame = {
    engine: complexGameEngine,
    state: complexGameState,
    levels: complexCareerLevels,
    events: complexEvents,
    endings: complexEndings,
    
    // 便捷方法
    init: () => complexGameEngine.initGame(),
    getRandomEvent: () => complexGameEngine.getRandomEvent(),
    applyChoice: (choice) => complexGameEngine.applyChoice(choice),
    getSummary: () => complexGameEngine.getGameSummary(),
    generateReport: (endResult) => complexGameEngine.generateEndingReport(endResult),
    getFollowUp: (branch) => complexGameEngine.getFollowUpEvent(branch),
    getTrigger: () => complexGameEngine.getRandomEventTrigger()
};
