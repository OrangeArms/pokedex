let currentPage = 1;
const pokemonsPerPage = 20;
let allPokemons = [];
let filteredPokemons = [];
let currentGeneration = 'all';

// DOM 元素引用
let pokemonContainer, searchInput, searchButton, prevButton, nextButton;
let firstPageButton, lastPageButton, currentPageSpan, totalPagesSpan;
let pageInput, jumpButton, modal, modalClose, pokemonDetails;

// 世代范围定义
const generations = {
    '1': { start: 1, end: 151, name: '关都地区' },
    '2': { start: 152, end: 251, name: '城都地区' },
    '3': { start: 252, end: 386, name: '丰缘地区' },
    '4': { start: 387, end: 493, name: '神奥地区' },
    '5': { start: 494, end: 649, name: '合众地区' },
    '6': { start: 650, end: 721, name: '卡洛斯地区' },
    '7': { start: 722, end: 809, name: '阿罗拉地区' },
    '8': { start: 810, end: 905, name: '伽勒尔地区' },
    '9': { start: 906, end: 1025, name: '帕底亚地区' }
};

// 中文名称映射
const chineseNames = {
    // 第一世代 (关都地区)
    'bulbasaur': '妙蛙种子', 'ivysaur': '妙蛙草', 'venusaur': '妙蛙花',
    'charmander': '小火龙', 'charmeleon': '火恐龙', 'charizard': '喷火龙',
    'squirtle': '杰尼龟', 'wartortle': '卡咪龟', 'blastoise': '水箭龟',
    'caterpie': '绿毛虫', 'metapod': '铁甲蛹', 'butterfree': '巴大蝶',
    'weedle': '独角虫', 'kakuna': '铁壳蛹', 'beedrill': '大针蜂',
    'pidgey': '波波', 'pidgeotto': '比比鸟', 'pidgeot': '大比鸟',
    'rattata': '小拉达', 'raticate': '拉达', 'spearow': '烈雀',
    'fearow': '大嘴雀', 'ekans': '阿柏蛇', 'arbok': '阿柏怪',
    'pikachu': '皮卡丘', 'raichu': '雷丘', 'sandshrew': '穿山鼠',
    'sandslash': '穿山王', 'nidoran-f': '尼多兰', 'nidorina': '尼多娜',
    'nidoqueen': '尼多后', 'nidoran-m': '尼多朗', 'nidorino': '尼多力诺',
    'nidoking': '尼多王', 'clefairy': '皮皮', 'clefable': '皮可西',
    'vulpix': '六尾', 'ninetales': '九尾', 'jigglypuff': '胖丁',
    'wigglytuff': '胖可丁', 'zubat': '超音蝠', 'golbat': '大嘴蝠',
    'oddish': '走路草', 'gloom': '臭臭花', 'vileplume': '霸王花',
    'paras': '派拉斯', 'parasect': '派拉斯特', 'venonat': '毛球',
    'venomoth': '摩鲁蛾', 'diglett': '地鼠', 'dugtrio': '三地鼠',
    'meowth': '喵喵', 'persian': '猫老大', 'psyduck': '可达鸭',
    'golduck': '哥达鸭', 'mankey': '猴怪', 'primeape': '火暴猴',
    'growlithe': '卡蒂狗', 'arcanine': '风速狗', 'poliwag': '蚊香蝌蚪',
    'poliwhirl': '蚊香君', 'poliwrath': '蚊香泳士', 'abra': '凯西',
    'kadabra': '勇基拉', 'alakazam': '胡地', 'machop': '腕力',
    'machoke': '豪力', 'machamp': '怪力', 'bellsprout': '喇叭芽',
    'weepinbell': '口呆花', 'victreebel': '大食花', 'tentacool': '玛瑙水母',
    'tentacruel': '毒刺水母', 'geodude': '小拳石', 'graveler': '隆隆石',
    'golem': '隆隆岩', 'ponyta': '小火马', 'rapidash': '烈焰马',
    'slowpoke': '呆呆兽', 'slowbro': '呆河马', 'magnemite': '小磁怪',
    'magneton': '三合一磁怪', 'farfetchd': '大葱鸭', 'doduo': '嘟嘟',
    'dodrio': '嘟嘟利', 'seel': '小海狮', 'dewgong': '白海狮',
    'grimer': '臭泥', 'muk': '臭臭泥', 'shellder': '大舌贝',
    'cloyster': '刺甲贝', 'gastly': '鬼斯', 'haunter': '鬼斯通',
    'gengar': '耿鬼', 'onix': '大岩蛇', 'drowzee': '催眠貘',
    'hypno': '引梦貘人', 'krabby': '大钳蟹', 'kingler': '巨钳蟹',
    'voltorb': '霹雳电球', 'electrode': '顽皮雷弹', 'exeggcute': '蛋蛋',
    'exeggutor': '椰蛋树', 'cubone': '卡拉卡拉', 'marowak': '嘎啦嘎啦',
    'hitmonlee': '飞腿郎', 'hitmonchan': '快拳郎', 'lickitung': '大舌头',
    'koffing': '瓦斯弹', 'weezing': '双弹瓦斯', 'rhyhorn': '独角犀牛',
    'rhydon': '钻角犀兽', 'chansey': '吉利蛋', 'tangela': '蔓藤怪',
    'kangaskhan': '袋兽', 'horsea': '墨海马', 'seadra': '海刺龙',
    'goldeen': '角金鱼', 'seaking': '金鱼王', 'staryu': '海星星',
    'starmie': '宝石海星', 'mr-mime': '魔墙人偶', 'scyther': '飞天螳螂',
    'jynx': '迷唇姐', 'electabuzz': '电击兽', 'magmar': '鸭嘴火兽',
    'pinsir': '凯罗斯', 'tauros': '肯泰罗', 'magikarp': '鲤鱼王',
    'gyarados': '暴鲤龙', 'lapras': '拉普拉斯', 'ditto': '百变怪',
    'eevee': '伊布', 'vaporeon': '水伊布', 'jolteon': '雷伊布',
    'flareon': '火伊布', 'porygon': '多边兽', 'omanyte': '菊石兽',
    'omastar': '多刺菊石兽', 'kabuto': '化石盔', 'kabutops': '镰刀盔',
    'aerodactyl': '化石翼龙', 'snorlax': '卡比兽', 'articuno': '急冻鸟',
    'zapdos': '闪电鸟', 'moltres': '火焰鸟', 'dratini': '迷你龙',
    'dragonair': '哈克龙', 'dragonite': '快龙', 'mewtwo': '超梦',
    'mew': '梦幻',
    
    // 第二世代 (城都地区)
    'chikorita': '菊草叶', 'bayleef': '月桂叶', 'meganium': '大竺葵',
    'cyndaquil': '火球鼠', 'quilava': '火岩鼠', 'typhlosion': '火暴兽',
    'totodile': '小锯鳄', 'croconaw': '蓝鳄', 'feraligatr': '大力鳄',
    'sentret': '尾立', 'furret': '大尾立', 'hoothoot': '咕咕',
    'noctowl': '猫头夜鹰', 'ledyba': '芭瓢虫', 'ledian': '安瓢虫',
    'spinarak': '圆丝蛛', 'ariados': '阿利多斯', 'crobat': '叉字蝠',
    'chinchou': '灯笼鱼', 'lanturn': '电灯怪', 'pichu': '皮丘',
    'cleffa': '皮宝宝', 'igglybuff': '宝宝丁', 'togepi': '波克比',
    'togetic': '波克基古', 'natu': '天然雀', 'xatu': '天然鸟',
    'mareep': '咩利羊', 'flaaffy': '茸茸羊', 'ampharos': '电龙',
    'bellossom': '美丽花', 'marill': '玛力露', 'azumarill': '玛力露丽',
    'sudowoodo': '树才怪', 'politoed': '蚊香蛙皇', 'hoppip': '毽子草',
    'skiploom': '毽子花', 'jumpluff': '毽子棉', 'aipom': '长尾怪手',
    'sunkern': '向日种子', 'sunflora': '向日花怪', 'yanma': '蜻蜻蜓',
    'wooper': '乌波', 'quagsire': '沼王', 'espeon': '太阳伊布',
    'umbreon': '月亮伊布', 'murkrow': '黑暗鸦', 'slowking': '河马王',
    'misdreavus': '梦妖', 'unown': '未知图腾', 'wobbuffet': '果然翁',
    'girafarig': '麒麟奇', 'pineco': '榛果球', 'forretress': '佛烈托斯',
    'dunsparce': '土龙弟弟', 'gligar': '天蝎', 'steelix': '大钢蛇',
    'snubbull': '布鲁', 'granbull': '布鲁皇', 'qwilfish': '千针鱼',
    'scizor': '巨钳螳螂', 'shuckle': '壶壶', 'heracross': '赫拉克罗斯',
    'sneasel': '狃拉', 'teddiursa': '熊宝宝', 'ursaring': '圈圈熊',
    'slugma': '熔岩虫', 'magcargo': '熔岩蜗牛', 'swinub': '小山猪',
    'piloswine': '长毛猪', 'corsola': '太阳珊瑚', 'remoraid': '铁炮鱼',
    'octillery': '章鱼桶', 'delibird': '信使鸟', 'mantine': '巨翅飞鱼',
    'skarmory': '盔甲鸟', 'houndour': '戴鲁比', 'houndoom': '黑鲁加',
    'kingdra': '刺龙王', 'phanpy': '小小象', 'donphan': '顿甲',
    'porygon2': '多边兽Ⅱ', 'stantler': '惊角鹿', 'smeargle': '图图犬',
    'tyrogue': '无畏小子', 'hitmontop': '战舞郎', 'smoochum': '迷唇娃',
    'elekid': '电击怪', 'magby': '鸭嘴宝宝', 'miltank': '大奶罐',
    'blissey': '幸福蛋', 'raikou': '雷公', 'entei': '炎帝',
    'suicune': '水君', 'larvitar': '幼基拉斯', 'pupitar': '沙基拉斯',
    'tyranitar': '班基拉斯', 'lugia': '洛奇亚', 'ho-oh': '凤王',
    'celebi': '时拉比',
    
    // 第三世代 (丰缘地区)
    'treecko': '木守宫', 'grovyle': '森林蜥蜴', 'sceptile': '蜥蜴王',
    'torchic': '火稚鸡', 'combusken': '力壮鸡', 'blaziken': '火焰鸡',
    'mudkip': '水跃鱼', 'marshtomp': '沼跃鱼', 'swampert': '巨沼怪',
    'poochyena': '土狼犬', 'mightyena': '大狼犬', 'zigzagoon': '蛇纹熊',
    'linoone': '直冲熊', 'wurmple': '刺尾虫', 'silcoon': '甲壳茧',
    'beautifly': '狩猎凤蝶', 'cascoon': '盾甲茧', 'dustox': '毒粉蛾',
    'lotad': '莲叶童子', 'lombre': '莲帽小童', 'ludicolo': '乐天河童',
    'seedot': '橡实果', 'nuzleaf': '长鼻叶', 'shiftry': '狡猾天狗',
    'taillow': '傲骨燕', 'swellow': '大王燕', 'wingull': '长翅鸥',
    'pelipper': '大嘴鸥', 'ralts': '拉鲁拉丝', 'kirlia': '奇鲁莉安',
    'gardevoir': '沙奈朵', 'surskit': '溜溜糖球', 'masquerain': '雨翅蛾',
    'shroomish': '蘑蘑菇', 'breloom': '斗笠菇', 'slakoth': '懒人獭',
    'vigoroth': '过动猿', 'slaking': '请假王', 'nincada': '土居忍士',
    'ninjask': '铁面忍者', 'shedinja': '脱壳忍者', 'whismur': '咕妞妞',
    'loudred': '吼爆弹', 'exploud': '爆音怪', 'makuhita': '幕下力士',
    'hariyama': '铁掌力士', 'azurill': '露力丽', 'nosepass': '朝北鼻',
    'skitty': '向尾喵', 'delcatty': '优雅猫', 'sableye': '勾魂眼',
    'mawile': '大嘴娃', 'aron': '可可多拉', 'lairon': '可多拉',
    'aggron': '波士可多拉', 'meditite': '玛沙那', 'medicham': '恰雷姆',
    'electrike': '落雷兽', 'manectric': '雷电兽', 'plusle': '正电拍拍',
    'minun': '负电拍拍', 'volbeat': '电萤虫', 'illumise': '甜甜萤',
    'roselia': '毒蔷薇', 'gulpin': '溶食兽', 'swalot': '吞食兽',
    'carvanha': '利牙鱼', 'sharpedo': '巨牙鲨', 'wailmer': '吼吼鲸',
    'wailord': '吼鲸王', 'numel': '呆火驼', 'camerupt': '喷火驼',
    'torkoal': '煤炭龟', 'spoink': '跳跳猪', 'grumpig': '噗噗猪',
    'spinda': '晃晃斑', 'trapinch': '大颚蚁', 'vibrava': '超音波幼虫',
    'flygon': '沙漠蜻蜓', 'cacnea': '刺球仙人掌', 'cacturne': '梦歌仙人掌',
    'swablu': '青绵鸟', 'altaria': '七夕青鸟', 'zangoose': '猫鼬斩',
    'seviper': '饭匙蛇', 'lunatone': '月石', 'solrock': '太阳岩',
    'barboach': '泥泥鳅', 'whiscash': '鲶鱼王', 'corphish': '龙虾小兵',
    'crawdaunt': '铁螯龙虾', 'baltoy': '天秤偶', 'claydol': '念力土偶',
    'lileep': '触手百合', 'cradily': '摇篮百合', 'anorith': '太古羽虫',
    'armaldo': '太古盔甲', 'feebas': '丑丑鱼', 'milotic': '美纳斯',
    'castform': '飘浮泡泡', 'kecleon': '变隐龙', 'shuppet': '怨影娃娃',
    'banette': '诅咒娃娃', 'duskull': '夜巡灵', 'dusclops': '彷徨夜灵',
    'tropius': '热带龙', 'chimecho': '风铃铃', 'absol': '阿勃梭鲁',
    'wynaut': '小果然', 'snorunt': '雪童子', 'glalie': '冰鬼护',
    'spheal': '海豹球', 'sealeo': '海魔狮', 'walrein': '帝牙海狮',
    'clamperl': '珍珠贝', 'huntail': '猎斑鱼', 'gorebyss': '樱花鱼',
    'relicanth': '古空棘鱼', 'luvdisc': '爱心鱼', 'bagon': '宝贝龙',
    'shelgon': '甲壳龙', 'salamence': '暴飞龙', 'beldum': '铁哑铃',
    'metang': '金属怪', 'metagross': '巨金怪', 'regirock': '雷吉洛克',
    'regice': '雷吉艾斯', 'registeel': '雷吉斯奇鲁', 'latias': '拉帝亚斯',
    'latios': '拉帝欧斯', 'kyogre': '盖欧卡', 'groudon': '固拉多',
    'rayquaza': '烈空坐', 'jirachi': '基拉祈', 'deoxys': '代欧奇希斯',
    
    // 第四世代 (神奥地区)
    'turtwig': '草苗龟', 'grotle': '树林龟', 'torterra': '土台龟',
    'chimchar': '小火猴', 'monferno': '猛火猴', 'infernape': '烈焰猴',
    'piplup': '波加曼', 'prinplup': '波皇子', 'empoleon': '帝王拿波',
    'starly': '姆克儿', 'staravia': '姆克鸟', 'staraptor': '姆克鹰',
    'bidoof': '大牙狸', 'bibarel': '大尾狸', 'kricketot': '圆法师',
    'kricketune': '音箱蟀', 'shinx': '小猫怪', 'luxio': '勒克猫',
    'luxray': '伦琴猫', 'budew': '含羞苞', 'roserade': '罗丝雷朵',
    'cranidos': '头盖龙', 'rampardos': '战槌龙', 'shieldon': '盾甲龙',
    'bastiodon': '护城龙', 'burmy': '结草儿', 'wormadam': '结草贵妇',
    'mothim': '绅士蛾', 'combee': '三蜜蜂', 'vespiquen': '蜂女王',
    'pachirisu': '帕奇利兹', 'buizel': '泳圈鼬', 'floatzel': '浮潜鼬',
    'cherubi': '樱花宝', 'cherrim': '樱花儿', 'shellos': '无壳海兔',
    'gastrodon': '海兔兽', 'ambipom': '双尾怪手', 'drifloon': '飘飘球',
    'drifblim': '随风球', 'buneary': '卷卷耳', 'lopunny': '长耳兔',
    'mismagius': '梦妖魔', 'honchkrow': '乌鸦头头', 'glameow': '魅力喵',
    'purugly': '东施喵', 'chingling': '铃铛响', 'stunky': '臭鼬噗',
    'skuntank': '坦克臭鼬', 'bronzor': '铜镜怪', 'bronzong': '青铜钟',
    'bonsly': '盆才怪', 'mime-jr': '魔尼尼', 'happiny': '小福蛋',
    'chatot': '聒噪鸟', 'spiritomb': '花岩怪', 'gible': '圆陆鲨',
    'gabite': '尖牙陆鲨', 'garchomp': '烈咬陆鲨', 'munchlax': '小卡比兽',
    'riolu': '利欧路', 'lucario': '路卡利欧', 'hippopotas': '沙河马',
    'hippowdon': '河马兽', 'skorupi': '钳尾蝎', 'drapion': '龙王蝎',
    'croagunk': '不良蛙', 'toxicroak': '毒骷蛙', 'carnivine': '尖牙笼',
    'finneon': '荧光鱼', 'lumineon': '霓虹鱼', 'mantyke': '小球飞鱼',
    'snover': '雪笠怪', 'abomasnow': '暴雪王', 'weavile': '玛狃拉',
    'magnezone': '自爆磁怪', 'lickilicky': '大舌舔', 'rhyperior': '超甲狂犀',
    'tangrowth': '巨蔓藤', 'electivire': '电击魔兽', 'magmortar': '鸭嘴炎兽',
    'togekiss': '波克基斯', 'yanmega': '远古巨蜓', 'leafeon': '叶伊布',
    'glaceon': '冰伊布', 'gliscor': '天蝎王', 'mamoswine': '象牙猪',
    'porygon-z': '多边兽Z', 'gallade': '艾路雷朵', 'probopass': '大朝北鼻',
    'dusknoir': '黑夜魔灵', 'froslass': '雪妖女', 'rotom': '洛托姆',
    'uxie': '由克希', 'mesprit': '艾姆利多', 'azelf': '亚克诺姆',
    'dialga': '帝牙卢卡', 'palkia': '帕路奇亚', 'heatran': '席多蓝恩',
    'regigigas': '雷吉奇卡斯', 'giratina': '骑拉帝纳', 'cresselia': '克雷色利亚',
    'phione': '霏欧纳', 'manaphy': '玛纳霏', 'darkrai': '达克莱伊',
    'shaymin': '谢米', 'arceus': '阿尔宙斯',
    
    // 第五世代 (合众地区)
    'victini': '比克提尼', 'snivy': '藤藤蛇', 'servine': '青藤蛇',
    'serperior': '君主蛇', 'tepig': '暖暖猪', 'pignite': '炒炒猪',
    'emboar': '炎武王', 'oshawott': '水水獭', 'dewott': '双刃丸',
    'samurott': '大剑鬼', 'patrat': '探探鼠', 'watchog': '步哨鼠',
    'lillipup': '小约克', 'herdier': '哈约克', 'stoutland': '长毛狗',
    'purrloin': '扒手猫', 'liepard': '酷豹', 'pansage': '花椰猴',
    'simisage': '花椰猿', 'pansear': '爆香猴', 'simisear': '爆香猿',
    'panpour': '冷水猴', 'simipour': '冷水猿', 'munna': '食梦梦',
    'musharna': '梦梦蚀', 'pidove': '豆豆鸽', 'tranquill': '咕咕鸽',
    'unfezant': '高傲雉鸡', 'blitzle': '斑斑马', 'zebstrika': '雷电斑马',
    'roggenrola': '石丸子', 'boldore': '地幔岩', 'gigalith': '庞岩怪',
    'woobat': '滚滚蝙蝠', 'swoobat': '心蝙蝠', 'drilbur': '螺钉地鼠',
    'excadrill': '龙头地鼠', 'audino': '差不多娃娃', 'timburr': '搬运小匠',
    'gurdurr': '铁骨土人', 'conkeldurr': '修建老匠', 'tympole': '圆蝌蚪',
    'palpitoad': '蓝蟾蜍', 'seismitoad': '蟾蜍王', 'throh': '投摔鬼',
    'sawk': '打击鬼', 'sewaddle': '虫宝包', 'swadloon': '宝包茧',
    'leavanny': '保姆虫', 'venipede': '百足蜈蚣', 'whirlipede': '车轮球',
    'scolipede': '蜈蚣王', 'cottonee': '木棉球', 'whimsicott': '风妖精',
    'petilil': '百合根娃娃', 'lilligant': '裙儿小姐', 'basculin': '野蛮鲈鱼',
    'sandile': '黑眼鳄', 'krokorok': '混混鳄', 'krookodile': '流氓鳄',
    'darumaka': '火红不倒翁', 'darmanitan': '达摩狒狒', 'maractus': '沙铃仙人掌',
    'dwebble': '石居蟹', 'crustle': '岩殿居蟹', 'scraggy': '滑滑小子',
    'scrafty': '头巾混混', 'sigilyph': '象征鸟', 'yamask': '哭哭面具',
    'cofagrigus': '死神棺', 'tirtouga': '原盖海龟', 'carracosta': '肋骨海龟',
    'archen': '始祖小鸟', 'archeops': '始祖大鸟', 'trubbish': '破破袋',
    'garbodor': '灰尘山', 'zorua': '索罗亚', 'zoroark': '索罗亚克',
    'minccino': '泡沫栗鼠', 'cinccino': '奇诺栗鼠', 'gothita': '哥德宝宝',
    'gothorita': '哥德小童', 'gothitelle': '哥德小姐', 'solosis': '单卵细胞球',
    'duosion': '双卵细胞球', 'reuniclus': '人造细胞卵', 'ducklett': '鸭宝宝',
    'swanna': '舞天鹅', 'vanillite': '迷你冰', 'vanillish': '多多冰',
    'vanilluxe': '双倍多多冰', 'deerling': '四季鹿', 'sawsbuck': '萌芽鹿',
    'emolga': '电飞鼠', 'karrablast': '盖盖虫', 'escavalier': '骑士蜗牛',
    'foongus': '哎呀球菇', 'amoonguss': '败露球菇', 'frillish': '轻飘飘',
    'jellicent': '胖嘟嘟', 'alomomola': '保姆曼波', 'joltik': '电电虫',
    'galvantula': '电蜘蛛', 'ferroseed': '种子铁球', 'ferrothorn': '坚果哑铃',
    'klink': '齿轮儿', 'klang': '齿轮组', 'klinklang': '齿轮怪',
    'tynamo': '麻麻小鱼', 'eelektrik': '麻麻鳗', 'eelektross': '麻麻鳗鱼王',
    'elgyem': '小灰怪', 'beheeyem': '大宇怪', 'litwick': '烛光灵',
    'lampent': '灯火幽灵', 'chandelure': '水晶灯火灵', 'axew': '牙牙',
    'fraxure': '斧牙龙', 'haxorus': '双斧战龙', 'cubchoo': '喷嚏熊',
    'beartic': '冻原熊', 'cryogonal': '几何雪花', 'shelmet': '小嘴蜗',
    'accelgor': '敏捷虫', 'stunfisk': '泥巴鱼', 'mienfoo': '功夫鼬',
    'mienshao': '师父鼬', 'druddigon': '赤面龙', 'golett': '泥偶小人',
    'golurk': '泥偶巨人', 'pawniard': '驹刀小兵', 'bisharp': '劈斩司令',
    'bouffalant': '爆炸头水牛', 'rufflet': '毛头小鹰', 'braviary': '勇士雄鹰',
    'vullaby': '秃鹰丫头', 'mandibuzz': '秃鹰娜', 'heatmor': '熔蚁兽',
    'durant': '铁蚁', 'deino': '单首龙', 'zweilous': '双首暴龙',
    'hydreigon': '三首恶龙', 'larvesta': '燃烧虫', 'volcarona': '火神蛾',
    'cobalion': '勾帕路翁', 'terrakion': '代拉基翁', 'virizion': '毕力吉翁',
    'tornadus': '龙卷云', 'thundurus': '雷电云', 'reshiram': '莱希拉姆',
    'zekrom': '捷克罗姆', 'landorus': '土地云', 'kyurem': '酋雷姆',
    'keldeo': '凯路迪欧', 'meloetta': '美洛耶塔', 'genesect': '盖诺赛克特',
    
    // 第六世代 (卡洛斯地区)
    'chespin': '哈力栗', 'quilladin': '胖胖哈力', 'chesnaught': '布里卡隆',
    'fennekin': '火狐狸', 'braixen': '长尾火狐', 'delphox': '妖火红狐',
    'froakie': '呱呱泡蛙', 'frogadier': '呱头蛙', 'greninja': '甲贺忍蛙',
    'bunnelby': '掘掘兔', 'diggersby': '掘地兔', 'fletchling': '小箭雀',
    'fletchinder': '火箭雀', 'talonflame': '烈箭鹰', 'scatterbug': '粉蝶虫',
    'spewpa': '粉蝶蛹', 'vivillon': '彩粉蝶', 'litleo': '小狮狮',
    'pyroar': '火炎狮', 'flabebe': '花蓓蓓', 'floette': '花叶蒂',
    'florges': '花洁夫人', 'skiddo': '坐骑小羊', 'gogoat': '坐骑山羊',
    'pancham': '顽皮熊猫', 'pangoro': '流氓熊猫', 'furfrou': '多丽米亚',
    'espurr': '妙喵', 'meowstic': '超能妙喵', 'honedge': '独剑鞘',
    'doublade': '双剑鞘', 'aegislash': '坚盾剑怪', 'spritzee': '粉香香',
    'aromatisse': '芳香精', 'swirlix': '绵绵泡芙', 'slurpuff': '胖甜妮',
    'inkay': '好啦鱿', 'malamar': '乌贼王', 'binacle': '龟脚脚',
    'barbaracle': '龟足巨铠', 'skrelp': '垃垃藻', 'dragalge': '毒藻龙',
    'clauncher': '铁臂枪虾', 'clawitzer': '钢炮臂虾', 'helioptile': '伞电蜥',
    'heliolisk': '光电伞蜥', 'tyrunt': '宝宝暴龙', 'tyrantrum': '怪颚龙',
    'amaura': '冰雪龙', 'aurorus': '冰雪巨龙', 'sylveon': '仙子伊布',
    'hawlucha': '摔角鹰人', 'dedenne': '咚咚鼠', 'carbink': '小碎钻',
    'goomy': '黏黏宝', 'sliggoo': '黏美儿', 'goodra': '黏美龙',
    'klefki': '钥圈儿', 'phantump': '小木灵', 'trevenant': '朽木妖',
    'pumpkaboo': '南瓜精', 'gourgeist': '南瓜怪人', 'bergmite': '冰宝',
    'avalugg': '冰岩怪', 'noibat': '嗡蝠', 'noivern': '音波龙',
    'xerneas': '哲尔尼亚斯', 'yveltal': '伊裴尔塔尔', 'zygarde': '基格尔德',
    'diancie': '蒂安希', 'hoopa': '胡帕', 'volcanion': '波尔凯尼恩',
    
    // 第七世代 (阿罗拉地区)
    'rowlet': '木木枭', 'dartrix': '投羽枭', 'decidueye': '狙射树枭',
    'litten': '火斑喵', 'torracat': '炎热喵', 'incineroar': '炽焰咆哮虎',
    'popplio': '球球海狮', 'brionne': '花漾海狮', 'primarina': '西狮海壬',
    'pikipek': '小笃儿', 'trumbeak': '喇叭啄鸟', 'toucannon': '铳嘴大鸟',
    'yungoos': '猫鼬少', 'gumshoos': '猫鼬探长', 'grubbin': '强颚鸡母虫',
    'charjabug': '虫电宝', 'vikavolt': '锹农炮虫', 'crabrawler': '好胜蟹',
    'crabominable': '好胜毛蟹', 'oricorio': '花舞鸟', 'cutiefly': '萌虻',
    'ribombee': '蝶结萌虻', 'rockruff': '岩狗狗', 'lycanroc': '鬃岩狼人',
    'wishiwashi': '弱丁鱼', 'mareanie': '好坏星', 'toxapex': '超坏星',
    'mudbray': '泥驴仔', 'mudsdale': '重泥挽马', 'dewpider': '滴蛛',
    'araquanid': '滴蛛霸', 'fomantis': '伪螳草', 'lurantis': '兰螳花',
    'morelull': '睡睡菇', 'shiinotic': '灯罩夜菇', 'salandit': '夜盗火蜥',
    'salazzle': '焰后蜥', 'stufful': '童偶熊', 'bewear': '穿着熊',
    'bounsweet': '甜竹竹', 'steenee': '甜舞妮', 'tsareena': '甜冷美后',
    'comfey': '花疗环环', 'oranguru': '智挥猩', 'passimian': '投掷猴',
    'wimpod': '胆小虫', 'golisopod': '具甲武者', 'sandygast': '沙丘娃',
    'palossand': '噬沙堡爷', 'pyukumuku': '拳海参', 'type-null': '属性：空',
    'silvally': '银伴战兽', 'minior': '小陨星', 'komala': '树枕尾熊',
    'turtonator': '爆焰龟兽', 'togedemaru': '托戈德玛尔', 'mimikyu': '谜拟丘',
    'bruxish': '磨牙彩皮鱼', 'drampa': '老翁龙', 'dhelmise': '破破舵轮',
    'jangmo-o': '心鳞宝', 'hakamo-o': '鳞甲龙', 'kommo-o': '杖尾鳞甲龙',
    'tapu-koko': '卡璞・鸣鸣', 'tapu-lele': '卡璞・蝶蝶', 'tapu-bulu': '卡璞・哞哞',
    'tapu-fini': '卡璞・鳍鳍', 'cosmog': '科斯莫古', 'cosmoem': '科斯莫姆',
    'solgaleo': '索尔迦雷欧', 'lunala': '露奈雅拉', 'nihilego': '虚吾伊德',
    'buzzwole': '爆肌蚊', 'pheromosa': '费洛美螂', 'xurkitree': '电束木',
    'celesteela': '铁火辉夜', 'kartana': '纸御剑', 'guzzlord': '恶食大王',
    'necrozma': '奈克洛兹玛', 'magearna': '玛机雅娜', 'marshadow': '玛夏多',
    'poipole': '毒贝比', 'naganadel': '四颚针龙', 'stakataka': '垒磊石',
    'blacephalon': '砰头小丑', 'zeraora': '捷拉奥拉', 'meltan': '美录坦',
    'melmetal': '美录梅塔',
    
    // 第八世代 (伽勒尔地区)
    'grookey': '敲音猴', 'thwackey': '啪咚猴', 'rillaboom': '轰擂金刚猩',
    'scorbunny': '炎兔儿', 'raboot': '腾蹴小将', 'cinderace': '闪焰王牌',
    'sobble': '泪眼蜥', 'drizzile': '变涩蜥', 'inteleon': '千面避役',
    'skwovet': '贪心栗鼠', 'greedent': '藏饱栗鼠', 'rookidee': '稚山雀',
    'corvisquire': '蓝鸦', 'corviknight': '钢铠鸦', 'blipbug': '索侦虫',
    'dottler': '天罩虫', 'orbeetle': '以欧路普', 'nickit': '偷儿狐',
    'thievul': '狐大盗', 'gossifleur': '幼棉棉', 'eldegoss': '白蓬蓬',
    'wooloo': '毛辫羊', 'dubwool': '毛毛角羊', 'chewtle': '咬咬龟',
    'drednaw': '暴噬龟', 'yamper': '来电汪', 'boltund': '逐电犬',
    'rolycoly': '小炭仔', 'carkol': '大炭车', 'coalossal': '巨炭山',
    'applin': '啃果虫', 'flapple': '苹裹龙', 'appletun': '丰蜜龙',
    'silicobra': '沙包蛇', 'sandaconda': '沙螺蟒', 'cramorant': '古月鸟',
    'arrokuda': '刺梭鱼', 'barraskewda': '戽斗尖梭', 'toxel': '电音婴',
    'toxtricity': '颤弦蝾螈', 'sizzlipede': '烧火蚣', 'centiskorch': '焚焰蚣',
    'clobbopus': '拳拳蛸', 'grapploct': '八爪武师', 'sinistea': '来悲茶',
    'polteageist': '怖思壶', 'hatenna': '迷布莉姆', 'hattrem': '提布莉姆',
    'hatterene': '布莉姆温', 'impidimp': '捣蛋小妖', 'morgrem': '诈唬魔',
    'grimmsnarl': '长毛巨魔', 'obstagoon': '堵拦熊', 'perrserker': '喵头目',
    'cursola': '魔灵珊瑚', 'sirfetchd': '葱游兵', 'mr-rime': '踏冰人偶',
    'runerigus': '死神板', 'milcery': '小仙奶', 'alcremie': '霜奶仙',
    'falinks': '列阵兵', 'pincurchin': '啪嚓海胆', 'snom': '雪吞虫',
    'frosmoth': '雪绒蛾', 'stonjourner': '巨石丁', 'eiscue': '冰砌鹅',
    'indeedee': '爱管侍', 'morpeko': '莫鲁贝可', 'cufant': '铜象',
    'copperajah': '大王铜象', 'dracozolt': '雷鸟龙', 'arctozolt': '雷鸟海兽',
    'dracovish': '鳃鱼龙', 'arctovish': '鳃鱼海兽', 'duraludon': '铝钢龙',
    'dreepy': '多龙梅西亚', 'drakloak': '多龙奇', 'dragapult': '多龙巴鲁托',
    'zacian': '苍响', 'zamazenta': '藏玛然特', 'eternatus': '无极汰那',
    'kubfu': '熊徒弟', 'urshifu': '武道熊师', 'zarude': '萨戮德',
    'regieleki': '雷吉艾勒奇', 'regidrago': '雷吉铎拉戈', 'glastrier': '雪暴马',
    'spectrier': '灵幽马', 'calyrex': '蕾冠王',
    
    // 第九世代 (帕底亚地区)
    'sprigatito': '新叶喵', 'floragato': '蒂蕾喵', 'meowscarada': '魔幻假面喵',
    'fuecoco': '呆火鳄', 'crocalor': '炙烫鳄', 'skeledirge': '骨纹巨声鳄',
    'quaxly': '润水鸭', 'quaxwell': '涌跃鸭', 'quaquaval': '狂欢浪舞鸭',
    'lechonk': '爱吃豚', 'oinkologne': '飘香豚', 'tarountula': '团珠蛛',
    'spidops': '操陷蛛', 'nymble': '蛛小将', 'lokix': '蛛将军',
    'pawmi': '布拉姆', 'pawmo': '布拉姆温', 'pawmot': '布拉姆温特',
    'tandemaus': '一对鼠', 'maushold': '一家鼠', 'fidough': '狗仔包',
    'dachsbun': '麻花犬', 'smoliv': '迷你芙', 'dolliv': '奥利纽',
    'arboliva': '奥利瓦', 'squawkabilly': '怒鹦哥', 'nacli': '盐石宝',
    'naclstack': '盐石垒', 'garganacl': '盐石巨神', 'charcadet': '炭小侍',
    'armarouge': '红莲铠骑', 'ceruledge': '苍炎刃鬼', 'tadbulb': '光蚪仔',
    'bellibolt': '电肚蛙', 'wattrel': '电海燕', 'kilowattrel': '电海燕',
    'maschiff': '狠辣椒', 'mabosstiff': '狠大椒', 'shroodle': '墨海马',
    'grafaiai': '画画海马', 'bramblin': '枯叶小妖', 'brambleghast': '怨灵枯叶',
    'toedscool': '原野水母', 'toedscruel': '陆地水母', 'klawf': '毛崖蟹',
    'capsakid': '热辣娃', 'scovillain': '狠辣椒', 'rellor': '虫滚泥',
    'rabsca': '虫甲圣', 'flittle': '飘飘雏', 'espathra': '超能艳鸵',
    'tinkatink': '摇铃儿', 'tinkatuff': '叮叮儿', 'tinkaton': '叮铛儿',
    'wiglett': '长翅鳗', 'wugtrio': '三翅鳗', 'bombirdier': '轰炸鸟',
    'finizen': '波普海豚', 'palafin': '海豚侠', 'varoom': '噗隆隆',
    'revavroom': '普隆隆姆', 'cyclizar': '轮环龙', 'orthworm': '岩居蟹',
    'glimmet': '晶光芽', 'glimmora': '晶光花', 'greavard': '墓仔狗',
    'houndstone': '墓扬犬', 'flamigo': '红鹤',
    'cetoddle': '海豹球', 'cetitan': '海豹球', 'veluza': '眠睡鱼',
    'dondozo': '大睡鱼', 'tatsugiri': '寿司鱼', 'annihilape': '暴猿',
    'clodsire': '毒泥猪', 'farigiraf': '长颈鹿',
    'dudunsparce': '土龙节节', 'kingambit': '黑暗鸦', 'great-tusk': '古代长牙',
    'scream-tail': '古代咆哮', 'brute-bonnet': '古代蘑菇', 'flutter-mane': '古代美发',
    'slither-wing': '古代飞蛾', 'sandy-shocks': '古代电龙', 'iron-treads': '古代车轮',
    'iron-bundle': '古代海兽', 'iron-hands': '古代巨人', 'iron-jugulis': '古代暴龙',
    'iron-moth': '古代飞龙', 'iron-thorns': '古代荆棘', 'frigibax': '冰霜龙',
    'arctibax': '冰霜巨龙', 'baxcalibur': '冰霜剑龙', 'gimmighoul': '幽尘灵',
    'gholdengo': '金币怪', 'wo-chien': '古代龙王', 'chien-pao': '古代虎王',
    'ting-lu': '古代象王', 'chi-yu': '古代鹰王', 'roaring-moon': '啸月',
    'iron-valiant': '铁武者', 'koraidon': '故勒顿', 'miraidon': '密勒顿',
    'walking-wake': '行走之烬', 'iron-leaves': '铁之叶', 'dipplin': '苹裹龙',
    'poltchageist': '来悲茶', 'sinistcha': '怖思壶', 'okidogi': '犬仙',
    'munkidori': '猴仙', 'fezandipiti': '鸟仙', 'ogerpon': '面具精灵',
    'archaludon': '铝钢龙', 'hydrapple': '多首龙', 'vampeagus': '吸血鬼',
    'bloodmoon-ursaluna': '血月熊', 'gouging-fire': '炽焰金刚', 'raging-bolt': '雷鸣暴君',
    'iron-boulder': '铁石巨人', 'iron-crown': '铁王冠', 'terapagos': '太晶神',
    'pecharunt': '桃仙'
};

// 从 script.js 复制中文名称映射

// 初始化函数
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM 加载完成，初始化 UI');

    // 初始化DOM元素
    pokemonContainer = document.getElementById('pokemon-container');
    searchInput = document.getElementById('search-input');
    searchButton = document.getElementById('search-button');
    prevButton = document.getElementById('prev-button');
    nextButton = document.getElementById('next-button');
    firstPageButton = document.getElementById('first-page-button');
    lastPageButton = document.getElementById('last-page-button');
    currentPageSpan = document.getElementById('current-page');
    totalPagesSpan = document.getElementById('total-pages');
    pageInput = document.getElementById('page-input');
    jumpButton = document.getElementById('jump-button');
    modal = document.getElementById('pokemon-modal');
    modalClose = document.querySelector('.close');
    pokemonDetails = document.getElementById('pokemon-details');

    const themeToggle = document.getElementById('theme-toggle');
    const favoritesButton = document.getElementById('favorites-button');

    // 键盘导航
    document.addEventListener('keydown', (e) => {
        // 如果模态框打开，不处理键盘导航
        if (modal.style.display === 'block') return;

        // 左箭头 - 上一页
        if (e.key === 'ArrowLeft' && !prevButton.disabled) {
            currentPage--;
            displayPokemons();
        }
        // 右箭头 - 下一页
        else if (e.key === 'ArrowRight' && !nextButton.disabled) {
            currentPage++;
            displayPokemons();
        }
        // Home键 - 首页
        else if (e.key === 'Home' && !firstPageButton.disabled) {
            currentPage = 1;
            displayPokemons();
        }
        // End键 - 末页
        else if (e.key === 'End' && !lastPageButton.disabled) {
            currentPage = Math.ceil(filteredPokemons.length / pokemonsPerPage);
            displayPokemons();
        }
    });

    // 初始化事件监听器
    searchButton.addEventListener('click', () => {
        searchPokemons();
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchPokemons();
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayPokemons();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage < Math.ceil(filteredPokemons.length / pokemonsPerPage)) {
            currentPage++;
            displayPokemons();
        }
    });

    firstPageButton.addEventListener('click', () => {
        currentPage = 1;
        displayPokemons();
    });

    lastPageButton.addEventListener('click', () => {
        currentPage = Math.ceil(filteredPokemons.length / pokemonsPerPage);
        displayPokemons();
    });

    jumpButton.addEventListener('click', () => {
        jumpToPage();
    });

    pageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            jumpToPage();
        }
    });

    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // 初始化类型按钮
    document.querySelectorAll('.type-button').forEach(button => {
        button.addEventListener('click', () => {
            const isActive = button.classList.contains('active');
            document.querySelectorAll('.type-button').forEach(btn => btn.classList.remove('active'));
            if (!isActive) {
                button.classList.add('active');
                filterByType(button.getAttribute('data-type'));
            } else {
                resetTypeFilter();
            }
        });
    });

    // 初始化世代按钮
    document.querySelectorAll('.gen-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.gen-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentGeneration = button.getAttribute('data-gen');
            resetTypeFilter();
            searchPokemons();
        });
    });

    // 初始化夜间模式
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️ 日间模式';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
        themeToggle.textContent = isDark ? '☀️ 日间模式' : '🌙 夜间模式';
    });

    // 初始化收藏按钮
    favoritesButton.addEventListener('click', () => {
        toggleFavorites();
    });

    // 加载宝可梦数据
    fetchPokemons();
});

// 获取宝可梦数据
async function fetchPokemons() {
    try {
        showLoading();
        
        // 检查本地缓存
        const cachedData = localStorage.getItem('pokemons_data');
        const cacheTimestamp = localStorage.getItem('pokemons_cache_timestamp');
        const now = Date.now();
        
        // 如果有缓存且缓存时间不超过24小时，则使用缓存数据
        if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp)) < 86400000) {
            allPokemons = JSON.parse(cachedData);
            filteredPokemons = [...allPokemons];
            displayPokemons();
            hideLoading();
            return;
        }
        
        try {
            // 获取宝可梦总数
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1');
            const data = await response.json();
            const count = Math.min(data.count, 1025); // 限制最大数量为1025（第九世代）
            
            // 获取所有宝可梦基本信息
            const allResponse = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${count}`);
            const allData = await allResponse.json();
            
            allPokemons = allData.results.map((pokemon, index) => {
                return {
                    id: index + 1,
                    name: pokemon.name,
                    url: pokemon.url
                };
            });
            
            // 保存到本地缓存
            localStorage.setItem('pokemons_data', JSON.stringify(allPokemons));
            localStorage.setItem('pokemons_cache_timestamp', now.toString());
            
            filteredPokemons = [...allPokemons];
            displayPokemons();
        } catch (networkError) {
            console.warn('网络请求失败，使用离线数据:', networkError);
            
            // 如果有缓存数据，即使过期也使用
            if (cachedData) {
                allPokemons = JSON.parse(cachedData);
                filteredPokemons = [...allPokemons];
                displayPokemons();
                showOfflineNotification();
            } else {
                // 如果没有缓存数据，显示错误
                throw new Error('无法获取宝可梦数据，且没有可用的离线数据');
            }
        }
        
        hideLoading();
    } catch (error) {
        console.error('获取宝可梦数据失败:', error);
        pokemonContainer.innerHTML = '<div class="error">获取宝可梦数据失败，请稍后再试</div>';
        hideLoading();
    }
}

// 显示离线通知
function showOfflineNotification() {
    const notification = document.createElement('div');
    notification.className = 'network-status offline';
    notification.textContent = '离线模式 - 使用缓存数据';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('minimized');
    }, 5000);
}

// 显示宝可梦列表
function displayPokemons() {
    const start = (currentPage - 1) * pokemonsPerPage;
    const end = start + pokemonsPerPage;
    const currentPokemons = filteredPokemons.slice(start, end);
    
    // 使用文档片段提高性能
    const fragment = document.createDocumentFragment();
    
    currentPokemons.forEach(pokemon => {
        const pokemonCard = document.createElement('div');
        pokemonCard.className = 'pokemon-card';
        pokemonCard.onclick = () => fetchAndShowPokemonById(pokemon.id);
        
        const generation = getGeneration(pokemon.id);
        const chineseName = getChineseName(pokemon.name, pokemon.id);
        
        // 创建图片元素并设置属性
        const img = document.createElement('img');
        img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
        img.alt = pokemon.name;
        img.loading = 'lazy';
        img.decoding = 'async'; // 异步解码图片
        
        // 创建标题元素
        const title = document.createElement('h3');
        title.textContent = chineseName;
        
        // 创建ID段落
        const idPara = document.createElement('p');
        idPara.textContent = `No.${pokemon.id.toString().padStart(3, '0')}`;
        
        // 创建世代段落
        const genPara = document.createElement('p');
        genPara.className = 'generation';
        genPara.textContent = generation ? generation.name : '';
        
        // 将所有元素添加到卡片
        pokemonCard.appendChild(img);
        pokemonCard.appendChild(title);
        pokemonCard.appendChild(idPara);
        pokemonCard.appendChild(genPara);
        
        // 将卡片添加到文档片段
        fragment.appendChild(pokemonCard);
    });
    
    // 清空容器并一次性添加所有卡片
    pokemonContainer.innerHTML = '';
    pokemonContainer.appendChild(fragment);
    
    // 预加载下一页的图片
    preloadNextPageImages();
    
    updatePagination();
}

// 预加载下一页的图片
function preloadNextPageImages() {
    const totalPages = Math.ceil(filteredPokemons.length / pokemonsPerPage);
    
    // 如果有下一页，预加载下一页的图片
    if (currentPage < totalPages) {
        const nextPageStart = currentPage * pokemonsPerPage;
        const nextPageEnd = Math.min(nextPageStart + pokemonsPerPage, filteredPokemons.length);
        const nextPagePokemons = filteredPokemons.slice(nextPageStart, nextPageEnd);
        
        nextPagePokemons.forEach(pokemon => {
            const img = new Image();
            img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
        });
    }
}

// 更新分页信息
function updatePagination() {
    const totalPages = Math.ceil(filteredPokemons.length / pokemonsPerPage);
    currentPageSpan.textContent = currentPage;
    totalPagesSpan.textContent = totalPages;
    
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
    firstPageButton.disabled = currentPage === 1;
    lastPageButton.disabled = currentPage === totalPages;
    
    pageInput.max = totalPages;
}

// 跳转到指定页面
function jumpToPage() {
    const pageNumber = parseInt(pageInput.value);
    const totalPages = Math.ceil(filteredPokemons.length / pokemonsPerPage);
    
    if (pageNumber && pageNumber >= 1 && pageNumber <= totalPages) {
        currentPage = pageNumber;
        displayPokemons();
        pageInput.value = '';
        pageInput.classList.remove('invalid');
    } else {
        pageInput.classList.add('invalid');
        setTimeout(() => {
            pageInput.classList.remove('invalid');
        }, 1000);
    }
}

// 搜索宝可梦
function searchPokemons() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filterByGeneration();
        return;
    }
    
    filteredPokemons = allPokemons.filter(pokemon => {
        // 检查是否符合当前选择的世代
        if (currentGeneration !== 'all') {
            const gen = generations[currentGeneration];
            if (pokemon.id < gen.start || pokemon.id > gen.end) {
                return false;
            }
        }
        
        // 按ID搜索
        if (!isNaN(searchTerm) && pokemon.id === parseInt(searchTerm)) {
            return true;
        }
        
        // 按英文名称搜索
        if (pokemon.name.includes(searchTerm)) {
            return true;
        }
        
        // 按中文名称搜索
        const chineseName = getChineseName(pokemon.name, pokemon.id);
        if (chineseName && chineseName.includes(searchTerm)) {
            return true;
        }
        
        return false;
    });
    
    currentPage = 1;
    displayPokemons();
}

// 按世代筛选
function filterByGeneration() {
    if (currentGeneration === 'all') {
        filteredPokemons = [...allPokemons];
    } else {
        const gen = generations[currentGeneration];
        filteredPokemons = allPokemons.filter(pokemon => 
            pokemon.id >= gen.start && pokemon.id <= gen.end
        );
    }
    
    currentPage = 1;
    displayPokemons();
}

// 按属性筛选
function filterByType(type) {
    showLoading();
    
    // 检查缓存中是否有类型数据
    const cachedTypeData = localStorage.getItem(`pokemon_type_${type}`);
    const cacheTimestamp = localStorage.getItem(`pokemon_type_timestamp_${type}`);
    const now = Date.now();
    
    // 如果有缓存且缓存时间不超过7天，则使用缓存数据
    if (cachedTypeData && cacheTimestamp && (now - parseInt(cacheTimestamp)) < 7 * 86400000) {
        processTypeData(JSON.parse(cachedTypeData), type);
        return;
    }
    
    fetch(`https://pokeapi.co/api/v2/type/${type}`)
        .then(response => response.json())
        .then(data => {
            // 缓存类型数据
            localStorage.setItem(`pokemon_type_${type}`, JSON.stringify(data));
            localStorage.setItem(`pokemon_type_timestamp_${type}`, now.toString());
            
            processTypeData(data, type);
        })
        .catch(error => {
            console.error('按属性筛选失败:', error);
            
            // 如果有缓存数据，即使过期也使用
            if (cachedTypeData) {
                processTypeData(JSON.parse(cachedTypeData), type);
                showOfflineNotification();
            } else {
                pokemonContainer.innerHTML = '<div class="error">无法获取属性数据，请检查网络连接</div>';
                hideLoading();
            }
        });
}

// 处理类型数据
function processTypeData(data, type) {
    const pokemonsByType = data.pokemon.map(p => {
        const id = extractPokemonId(p.pokemon.url);
        return {
            id: id,
            name: p.pokemon.name,
            url: p.pokemon.url
        };
    }).filter(p => p.id <= 1025); // 限制最大ID为1025
    
    if (currentGeneration !== 'all') {
        const gen = generations[currentGeneration];
        filteredPokemons = pokemonsByType.filter(pokemon => 
            pokemon.id >= gen.start && pokemon.id <= gen.end
        );
    } else {
        filteredPokemons = pokemonsByType;
    }
    
    currentPage = 1;
    displayPokemons();
    hideLoading();
}

// 重置属性筛选
function resetTypeFilter() {
    document.querySelectorAll('.type-button').forEach(btn => btn.classList.remove('active'));
    filterByGeneration();
}

// 获取宝可梦所属世代
function getGeneration(id) {
    for (const [genId, gen] of Object.entries(generations)) {
        if (id >= gen.start && id <= gen.end) {
            return { id: genId, ...gen };
        }
    }
    return null;
}

// 从URL中提取宝可梦ID
function extractPokemonId(url) {
    const matches = url.match(/\/(\d+)\/$/);
    return matches ? parseInt(matches[1]) : null;
}

// 获取宝可梦中文名称
function getChineseName(name, id) {
    // 如果有中文名称，直接返回
    if (chineseNames[name]) {
        return chineseNames[name];
    }
    
    // 尝试从本地存储获取
    const storedName = localStorage.getItem(`pokemon_name_${id}`);
    if (storedName) {
        return storedName;
    }
    
    // 如果没有中文名称，返回格式化的英文名称
    return name.split('-')[0].charAt(0).toUpperCase() + name.split('-')[0].slice(1);
}

// 显示加载中提示
function showLoading() {
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.id = 'loading-indicator';
    loadingIndicator.textContent = '加载中...';
    document.body.appendChild(loadingIndicator);
}

// 隐藏加载中提示
function hideLoading() {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.remove();
    }
}

// 获取并显示宝可梦详情
async function fetchAndShowPokemonById(id) {
    try {
        showLoading();
        modal.style.display = 'block';
        
        // 检查缓存中是否有详情数据
        const cachedPokemonDetails = localStorage.getItem(`pokemon_details_${id}`);
        const cacheTimestamp = localStorage.getItem(`pokemon_details_timestamp_${id}`);
        const now = Date.now();
        
        // 如果有缓存且缓存时间不超过7天，则使用缓存数据
        if (cachedPokemonDetails && cacheTimestamp && (now - parseInt(cacheTimestamp)) < 7 * 86400000) {
            const cachedData = JSON.parse(cachedPokemonDetails);
            displayPokemonDetails(cachedData.pokemon, cachedData.species, cachedData.evolutionData);
            hideLoading();
            return;
        }
        
        try {
            // 获取宝可梦基本信息
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const pokemon = await response.json();
            
            // 获取宝可梦种族信息
            const speciesResponse = await fetch(pokemon.species.url);
            const species = await speciesResponse.json();
            
            // 获取进化链
            const evolutionChainUrl = species.evolution_chain.url;
            const evolutionResponse = await fetch(evolutionChainUrl);
            const evolutionData = await evolutionResponse.json();
            
            // 缓存详情数据
            const detailsToCache = { pokemon, species, evolutionData };
            localStorage.setItem(`pokemon_details_${id}`, JSON.stringify(detailsToCache));
            localStorage.setItem(`pokemon_details_timestamp_${id}`, now.toString());
            
            // 显示宝可梦详情
            displayPokemonDetails(pokemon, species, evolutionData);
        } catch (networkError) {
            console.warn('网络请求失败，尝试使用离线数据:', networkError);
            
            // 如果有缓存数据，即使过期也使用
            if (cachedPokemonDetails) {
                const cachedData = JSON.parse(cachedPokemonDetails);
                displayPokemonDetails(cachedData.pokemon, cachedData.species, cachedData.evolutionData);
                showOfflineNotification();
            } else {
                // 如果没有缓存数据，显示错误
                throw new Error('无法获取宝可梦详情，且没有可用的离线数据');
            }
        }
        
        hideLoading();
    } catch (error) {
        console.error('获取宝可梦详情失败:', error);
        pokemonDetails.innerHTML = '<div class="error">获取宝可梦详情失败，请稍后再试<br>如果您处于离线状态，可能需要先在线浏览过该宝可梦才能离线查看</div>';
        hideLoading();
    }
}

// 显示宝可梦详情
function displayPokemonDetails(pokemon, species, evolutionData) {
    const chineseName = getChineseName(pokemon.name, pokemon.id);
    const generation = getGeneration(pokemon.id);
    
    // 检查是否收藏
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const isFavorite = favorites.includes(pokemon.id);
    
    let html = `
        <h2>${chineseName} <span style="color: #666;">No.${pokemon.id.toString().padStart(3, '0')}</span></h2>
        <p class="generation-detail">${generation ? generation.name : ''}</p>
        
        <div class="pokemon-images">
            <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" alt="${pokemon.name}" class="main-image">
            
            <div class="sprite-gallery">
    `;
    
    // 添加所有可用的精灵图
    for (const [key, url] of Object.entries(pokemon.sprites)) {
        if (url && typeof url === 'string' && !key.includes('other')) {
            html += `<img src="${url}" alt="${key}" onclick="document.querySelector('.main-image').src='${url}'">`;
        }
    }
    
    html += `
            </div>
        </div>
        
        <div class="pokemon-info">
            <div class="info-section">
                <h3>基本信息</h3>
                <p><strong>属性：</strong> 
    `;
    
    // 添加属性类型
    pokemon.types.forEach(type => {
        const typeName = getTypeNameInChinese(type.type.name);
        html += `<span class="type type-${type.type.name}">${typeName}</span>`;
    });
    
    html += `
                </p>
                <p><strong>身高：</strong> ${pokemon.height / 10} 米</p>
                <p><strong>体重：</strong> ${pokemon.weight / 10} 千克</p>
                <p><strong>特性：</strong> ${pokemon.abilities.map(ability => 
                    ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1)
                ).join(', ')}</p>
                
                <button class="favorite-button" onclick="toggleFavoritePokemon(${pokemon.id})">${isFavorite ? '❤️ 已收藏' : '🤍 收藏'}</button>
            </div>
            
            <div class="info-section">
                <h3>能力值</h3>
                <div class="stats">
    `;
    
    // 添加能力值
    const statNames = {
        'hp': '生命',
        'attack': '攻击',
        'defense': '防御',
        'special-attack': '特攻',
        'special-defense': '特防',
        'speed': '速度'
    };
    
    pokemon.stats.forEach(stat => {
        const statName = statNames[stat.stat.name] || stat.stat.name;
        const percentage = Math.min(stat.base_stat / 255 * 100, 100);
        
        html += `
            <div class="stat-bar">
                <div class="stat-fill" style="width: ${percentage}%"></div>
                <span class="stat-name">${statName}</span>
                <span class="stat-value">${stat.base_stat}</span>
            </div>
        `;
    });
    
    html += `
                </div>
            </div>
            
            <div class="info-section">
                <h3>进化</h3>
                <div class="evolution-container">
                    ${renderEvolutionChain(evolutionData.chain)}
                </div>
            </div>
        </div>
    `;
    
    pokemonDetails.innerHTML = html;
    
    // 添加收藏功能
    window.toggleFavoritePokemon = function(id) {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const index = favorites.indexOf(id);
        
        if (index === -1) {
            favorites.push(id);
            document.querySelector('.favorite-button').textContent = '❤️ 已收藏';
        } else {
            favorites.splice(index, 1);
            document.querySelector('.favorite-button').textContent = '🤍 收藏';
        }
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
    };
}

// 渲染进化链
function renderEvolutionChain(chain) {
    if (!chain) return '<p>无进化信息</p>';

    let html = '<div class="evolution-chain">';
    html += '<h3 class="evolution-title">进化链</h3>';
    html += '<div class="evolution-flow">';

    // 获取当前宝可梦
    const currentPokemon = chain.species;
    const currentPokemonId = extractPokemonId(currentPokemon.url);
    const currentPokemonName = getChineseName(currentPokemon.name, currentPokemonId);

    html += `
        <div class="evolution-pokemon" onclick="fetchAndShowPokemonById(${currentPokemonId})">
            <div class="evolution-pokemon-image">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${currentPokemonId}.png" alt="${currentPokemon.name}">
            </div>
            <p class="evolution-pokemon-name">${currentPokemonName}</p>
            <p class="evolution-pokemon-id">No.${currentPokemonId.toString().padStart(3, '0')}</p>
        </div>
    `;

    // 如果有进化形态
    if (chain.evolves_to && chain.evolves_to.length > 0) {
        // 处理每个进化分支
        chain.evolves_to.forEach(evolution => {
            const evoPokemonId = extractPokemonId(evolution.species.url);
            const evoPokemonName = getChineseName(evolution.species.name, evoPokemonId);
            
            // 获取进化条件
            let evolutionDetails = '';
            if (evolution.evolution_details && evolution.evolution_details.length > 0) {
                const details = evolution.evolution_details[0];
                if (details.min_level) {
                    evolutionDetails = `Lv.${details.min_level}`;
                } else if (details.item) {
                    evolutionDetails = `使用${details.item.name}`;
                } else if (details.trigger && details.trigger.name === 'trade') {
                    evolutionDetails = '交换';
                } else if (details.happiness) {
                    evolutionDetails = '亲密度提高';
                } else {
                    evolutionDetails = '特殊条件';
                }
            }

            html += `
                <div class="evolution-arrow">
                    <span class="arrow-line">→</span>
                    <span class="evolution-condition">${evolutionDetails}</span>
                </div>
                <div class="evolution-branch">
                    <div class="evolution-pokemon" onclick="fetchAndShowPokemonById(${evoPokemonId})">
                        <div class="evolution-pokemon-image">
                            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evoPokemonId}.png" alt="${evolution.species.name}">
                        </div>
                        <p class="evolution-pokemon-name">${evoPokemonName}</p>
                        <p class="evolution-pokemon-id">No.${evoPokemonId.toString().padStart(3, '0')}</p>
                    </div>
            `;

            // 递归处理下一级进化
            if (evolution.evolves_to && evolution.evolves_to.length > 0) {
                evolution.evolves_to.forEach(nextEvolution => {
                    const nextEvoPokemonId = extractPokemonId(nextEvolution.species.url);
                    const nextEvoPokemonName = getChineseName(nextEvolution.species.name, nextEvoPokemonId);
                    
                    // 获取进化条件
                    let nextEvolutionDetails = '';
                    if (nextEvolution.evolution_details && nextEvolution.evolution_details.length > 0) {
                        const details = nextEvolution.evolution_details[0];
                        if (details.min_level) {
                            nextEvolutionDetails = `Lv.${details.min_level}`;
                        } else if (details.item) {
                            nextEvolutionDetails = `使用${details.item.name}`;
                        } else if (details.trigger && details.trigger.name === 'trade') {
                            nextEvolutionDetails = '交换';
                        } else if (details.happiness) {
                            nextEvolutionDetails = '亲密度提高';
                        } else {
                            nextEvolutionDetails = '特殊条件';
                        }
                    }

                    html += `
                        <div class="evolution-arrow">
                            <span class="arrow-line">→</span>
                            <span class="evolution-condition">${nextEvolutionDetails}</span>
                        </div>
                        <div class="evolution-pokemon" onclick="fetchAndShowPokemonById(${nextEvoPokemonId})">
                            <div class="evolution-pokemon-image">
                                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${nextEvoPokemonId}.png" alt="${nextEvolution.species.name}">
                            </div>
                            <p class="evolution-pokemon-name">${nextEvoPokemonName}</p>
                            <p class="evolution-pokemon-id">No.${nextEvoPokemonId.toString().padStart(3, '0')}</p>
                        </div>
                    `;
                });
            }

            html += '</div>'; // 关闭 evolution-branch
        });
    }

    html += '</div>'; // 关闭 evolution-flow
    html += '</div>'; // 关闭 evolution-chain

    return html;
}

// 切换收藏列表
function toggleFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const favoritesButton = document.getElementById('favorites-button');
    
    if (favoritesButton.classList.contains('active')) {
        // 显示所有宝可梦
        favoritesButton.classList.remove('active');
        favoritesButton.textContent = '❤️ 我的收藏';
        resetTypeFilter();
    } else {
        // 显示收藏的宝可梦
        favoritesButton.classList.add('active');
        favoritesButton.textContent = '🔄 显示全部';
        
        if (favorites.length === 0) {
            filteredPokemons = [];
            pokemonContainer.innerHTML = '<div class="error">您还没有收藏任何宝可梦</div>';
            updatePagination();
            return;
        }
        
        filteredPokemons = allPokemons.filter(pokemon => favorites.includes(pokemon.id));
        currentPage = 1;
        displayPokemons();
    }
}

// 获取属性的中文名称
function getTypeNameInChinese(type) {
    const typeNames = {
        'normal': '一般',
        'fire': '火',
        'water': '水',
        'grass': '草',
        'electric': '电',
        'ice': '冰',
        'fighting': '格斗',
        'poison': '毒',
        'ground': '地面',
        'flying': '飞行',
        'psychic': '超能力',
        'bug': '虫',
        'rock': '岩石',
        'ghost': '幽灵',
        'dragon': '龙',
        'dark': '恶',
        'steel': '钢',
        'fairy': '妖精'
    };
    
    return typeNames[type] || type;
}