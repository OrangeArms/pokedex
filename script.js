// 全局变量
let currentPage = 1;
const pokemonsPerPage = 20;
let allPokemons = [];
let filteredPokemons = [];
let currentGeneration = 'all';

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
    'umbreon': '月亮伊布', 'murkrow': '黑暗鸦', 'slowking': '呆呆王',
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
    'tyrogue': '巴尔郎', 'hitmontop': '柯波朗', 'smoochum': '迷唇娃',
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
    'wailord': '吼鲸王',
// 全局变量
let currentPage = 1;
const pokemonsPerPage = 20;
let allPokemons = [];
let filteredPokemons = [];
let currentGeneration = 'all';

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
    'umbreon': '月亮伊布', 'murkrow': '黑暗鸦', 'slowking': '呆呆王',
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
    'tyrogue': '巴尔郎', 'hitmontop': '柯波朗', 'smoochum': '迷唇娃',
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
    'shaymin': '谢米', 'arceus': '阿尔宙斯'
// 全局变量
let currentPage = 1;
const pokemonsPerPage = 20;
let allPokemons = [];
let filteredPokemons = [];
let currentGeneration = 'all';

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
    'umbreon': '月亮伊布', 'murkrow': '黑暗鸦', 'slowking': '呆呆王',
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
    'tyrogue': '巴尔郎', 'hitmontop': '柯波朗', 'smoochum': '迷唇娃',
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
    'wailord': '吼鲸王',
// 全局变量
let currentPage = 1;
const pokemonsPerPage = 20;
let allPokemons = [];
let filteredPokemons = [];
let currentGeneration = 'all';

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
    'umbreon': '月亮伊布', 'murkrow': '黑暗鸦', 'slowking': '呆呆王',
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
    'tyrogue': '巴尔郎', 'hitmontop': '柯波朗', 'smoochum': '迷唇娃',
    'elekid': '电击怪', 'magby': '鸭嘴宝宝', 'miltank': '大奶罐',
    'blissey': '幸福蛋', 'raikou': '雷公', 'entei': '炎帝',
    'suicune': '水君', 'larvitar': '幼基拉斯', 'pupitar': '沙基拉斯',
    'tyranitar': '班基拉斯', 'lugia': '洛奇亚', 'ho-oh': '凤王',
    'celebi': '时拉比'
};

// DOM 元素
let pokemonContainer;
let searchInput;
let searchButton;
let prevButton;
let nextButton;
let firstPageButton;
let lastPageButton;
let currentPageSpan;
let totalPagesSpan;
let pageInput;
let jumpButton;
let modal;
let modalClose;
let pokemonDetails;

// 获取宝可梦数据
async function fetchPokemons() {
    try {
        pokemonContainer.innerHTML = '<p class="loading">正在加载宝可梦数据，请稍候...</p>';
        
        // 初始只加载第一世代宝可梦，提高首次加载速度
        const gen1 = await fetchPokemonsByRange(1, 151);
        
        // 按ID排序
        allPokemons = [...gen1].filter(p => p !== null);
        allPokemons.sort((a, b) => a.id - b.id);
        
        filteredPokemons = [...allPokemons];
        displayPokemons();
        
        console.log(`成功加载了第一世代 ${allPokemons.length} 个宝可梦`);
        
        // 在后台继续加载其他世代
        loadRemainingGenerations();
    } catch (error) {
        console.error('获取宝可梦数据失败:', error);
        pokemonContainer.innerHTML = '<p class="error">获取数据失败，请稍后再试</p>';
    }
}

// 在后台加载其余世代的宝可梦
async function loadRemainingGenerations() {
    try {
        // 显示加载提示
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading-indicator';
        loadingIndicator.textContent = '正在后台加载更多宝可梦...';
        document.body.appendChild(loadingIndicator);
        
        // 第二世代 (152-251)
        const gen2 = await fetchPokemonsByRange(152, 251);
        allPokemons = [...allPokemons, ...gen2.filter(p => p !== null)];
        updatePokemonData();
        
        // 第三世代 (252-386)
        const gen3 = await fetchPokemonsByRange(252, 386);
        allPokemons = [...allPokemons, ...gen3.filter(p => p !== null)];
        updatePokemonData();
        
        // 第四世代 (387-493)
        const gen4 = await fetchPokemonsByRange(387, 493);
        allPokemons = [...allPokemons, ...gen4.filter(p => p !== null)];
        updatePokemonData();
        
        // 第五世代 (494-649)
        const gen5 = await fetchPokemonsByRange(494, 649);
        allPokemons = [...allPokemons, ...gen5.filter(p => p !== null)];
        updatePokemonData();
        
        // 第六世代 (650-721)
        const gen6 = await fetchPokemonsByRange(650, 721);
        allPokemons = [...allPokemons, ...gen6.filter(p => p !== null)];
        updatePokemonData();
        
        // 第七世代 (722-809)
        const gen7 = await fetchPokemonsByRange(722, 809);
        allPokemons = [...allPokemons, ...gen7.filter(p => p !== null)];
        updatePokemonData();
        
        // 第八世代 (810-905)
        const gen8 = await fetchPokemonsByRange(810, 905);
        allPokemons = [...allPokemons, ...gen8.filter(p => p !== null)];
        updatePokemonData();
        
        // 第九世代 (906-1025)
        const gen9 = await fetchPokemonsByRange(906, 1025);
        allPokemons = [...allPokemons, ...gen9.filter(p => p !== null)];
        
        // 最终更新
        updatePokemonData();
        
        // 移除加载提示
        document.body.removeChild(loadingIndicator);
        
        console.log(`成功加载了所有 ${allPokemons.length} 个宝可梦`);
    } catch (error) {
        console.error('后台加载宝可梦数据失败:', error);
    }
}

// 更新宝可梦数据
function updatePokemonData() {
    // 按ID排序
    allPokemons.sort((a, b) => a.id - b.id);
    
    // 如果当前选择的是"全部"，则更新过滤后的宝可梦
    if (currentGeneration === 'all') {
        filteredPokemons = [...allPokemons];
        displayPokemons();
    }
}

// 按ID范围获取宝可梦
async function fetchPokemonsByRange(startId, endId) {
    pokemonContainer.innerHTML = `<p class="loading">正在加载第${getGeneration(startId).number}世代宝可梦数据，请稍候...</p>`;
    
    const pokemonPromises = [];
    for (let id = startId; id <= endId; id++) {
        pokemonPromises.push(fetchPokemonById(id));
    }
    
    return await Promise.all(pokemonPromises);
}

// 通过ID获取单个宝可梦
async function fetchPokemonById(id) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        return await response.json();
    } catch (error) {
        console.error(`获取宝可梦 ID:${id} 数据失败:`, error);
        return null;
    }
}

// 显示宝可梦
function displayPokemons() {
    pokemonContainer.innerHTML = '';
    
    const totalPages = Math.ceil(filteredPokemons.length / pokemonsPerPage);
    currentPageSpan.textContent = currentPage;
    totalPagesSpan.textContent = totalPages;
    
    const start = (currentPage - 1) * pokemonsPerPage;
    const end = start + pokemonsPerPage;
    const pokemonsToDisplay = filteredPokemons.slice(start, end);
    
    if (pokemonsToDisplay.length === 0) {
        pokemonContainer.innerHTML = '<p class="no-results">没有找到匹配的宝可梦</p>';
        return;
    }
    
    // 添加平滑滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // 创建一个文档片段来提高性能
    const fragment = document.createDocumentFragment();
    
    pokemonsToDisplay.forEach(pokemon => {
        const pokemonCard = document.createElement('div');
        pokemonCard.classList.add('pokemon-card');
        pokemonCard.addEventListener('click', () => showPokemonDetails(pokemon));
        
        const types = pokemon.types.map(type => {
            return `<span class="type type-${type.type.name}">${getChineseType(type.type.name)}</span>`;
        }).join('');
        
        // 获取中文名称
        const chineseName = getChineseName(pokemon.name, pokemon.id);
        
        // 获取世代信息
        const generation = getGeneration(pokemon.id);
        
        pokemonCard.innerHTML = `
            <img src="${pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default}" alt="${pokemon.name}" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png'">
            <h3>#${pokemon.id.toString().padStart(4, '0')} ${chineseName}</h3>
            <div>${types}</div>
            <p class="generation">第${generation.number}世代 (${generation.name})</p>
        `;
        
        fragment.appendChild(pokemonCard);
    });
    
    pokemonContainer.appendChild(fragment);
    
    // 更新分页按钮状态
    firstPageButton.disabled = currentPage === 1;
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
    lastPageButton.disabled = currentPage === totalPages;
}

// 按世代过滤宝可梦
function filterByGeneration(genNumber) {
    console.log(`过滤世代: ${genNumber}, 当前宝可梦总数: ${allPokemons.length}`);
    
    if (genNumber === 'all') {
        filteredPokemons = [...allPokemons];
    } else {
        const gen = generations[genNumber];
        if (!gen) {
            console.error(`未找到世代信息: ${genNumber}`);
            return;
        }
        
        filteredPokemons = allPokemons.filter(pokemon => 
            pokemon.id >= gen.start && pokemon.id <= gen.end
        );
    }
    
    console.log(`过滤后宝可梦数量: ${filteredPokemons.length}`);
    
    // 重置页码并显示
    currentPage = 1;
    displayPokemons();
}

// 搜索宝可梦
function searchPokemons() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        // 如果搜索词为空，则按当前选择的世代过滤
        filterByGeneration(currentGeneration);
    } else {
        // 先按世代过滤
        let genFiltered = [];
        if (currentGeneration === 'all') {
            genFiltered = [...allPokemons];
        } else {
            const gen = generations[currentGeneration];
            genFiltered = allPokemons.filter(pokemon => 
                pokemon.id >= gen.start && pokemon.id <= gen.end
            );
        }
        
        // 再按搜索词过滤
        filteredPokemons = genFiltered.filter(pokemon => {
            // 英文名称搜索
            const nameMatch = pokemon.name.toLowerCase().includes(searchTerm);
            // ID搜索
            const idMatch = pokemon.id.toString() === searchTerm;
            // 属性搜索
            const typeMatch = pokemon.types.some(type => 
                type.type.name.toLowerCase().includes(searchTerm) || 
                getChineseType(type.type.name).includes(searchTerm)
            );
            // 中文名称搜索
            const chineseName = chineseNames[pokemon.name] || '';
            const chineseNameMatch = chineseName.includes(searchTerm);
            
            return nameMatch || idMatch || typeMatch || chineseNameMatch;
        });
    }
    
    currentPage = 1;
    displayPokemons();
}

// 显示宝可梦详情
function showPokemonDetails(pokemon) {
    const types = pokemon.types.map(type => {
        return `<span class="type type-${type.type.name}">${getChineseType(type.type.name)}</span>`;
    }).join('');
    
    const stats = pokemon.stats.map(stat => {
        const statPercent = (stat.base_stat / 255) * 100;
        return `
            <div class="stat-bar">
                <div class="stat-fill" style="width: ${statPercent}%">
                    <span class="stat-name">${getChineseStat(stat.stat.name)}</span>
                    <span class="stat-value">${stat.base_stat}</span>
                </div>
            </div>
        `;
    }).join('');
    
    const abilities = pokemon.abilities.map(ability => {
        return capitalizeFirstLetter(ability.ability.name);
    }).join(', ');
    
    // 获取中文名称
    const chineseName = getChineseName(pokemon.name, pokemon.id);
    
    // 获取世代信息
    const generation = getGeneration(pokemon.id);
    
    // 获取宝可梦的进化链（如果可用）
    fetchEvolutionChain(pokemon.id).then(evolutionHTML => {
        pokemonDetails.innerHTML = `
            <h2>#${pokemon.id.toString().padStart(4, '0')} ${chineseName} (${capitalizeFirstLetter(pokemon.name)})</h2>
            <p class="generation-detail">第${generation.number}世代 (${generation.name})</p>
            <div class="pokemon-images">
                <img src="${pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default}" alt="${pokemon.name}" class="main-image" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png'">
                <div class="sprite-gallery">
                    ${pokemon.sprites.front_default ? `<img src="${pokemon.sprites.front_default}" alt="正面" title="正面">` : ''}
                    ${pokemon.sprites.back_default ? `<img src="${pokemon.sprites.back_default}" alt="背面" title="背面">` : ''}
                    ${pokemon.sprites.front_shiny ? `<img src="${pokemon.sprites.front_shiny}" alt="闪光正面" title="闪光正面">` : ''}
                    ${pokemon.sprites.back_shiny ? `<img src="${pokemon.sprites.back_shiny}" alt="闪光背面" title="闪光背面">` : ''}
                </div>
            </div>
            <div class="pokemon-info">
                <div class="info-section">
                    <h3>基本信息</h3>
                    <div>${types}</div>
                    <p>身高: ${pokemon.height / 10}m</p>
                    <p>体重: ${pokemon.weight / 10}kg</p>
                    <p>特性: ${abilities}</p>
                </div>
                
                <div class="info-section">
                    <h3>能力值</h3>
                    ${stats}
                </div>
                
                <div class="info-section evolution-chain">
                    <h3>进化链</h3>
                    <div class="evolution-container">
                        ${evolutionHTML}
                    </div>
                </div>
                
                <div class="info-section">
                    <h3>收藏</h3>
                    <button id="favorite-button" class="favorite-button" onclick="toggleFavorite(${pokemon.id})">
                        ${isFavorite(pokemon.id) ? '❤️ 取消收藏' : '🤍 添加收藏'}
                    </button>
                </div>
            </div>
        `;
        
        // 更新收藏按钮状态
        updateFavoriteButton(pokemon.id);
    });
    
    modal.style.display = 'block';
}

// 获取宝可梦进化链
async function fetchEvolutionChain(pokemonId) {
    try {
        // 先获取宝可梦种类信息
        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
        const speciesData = await speciesResponse.json();
        
        // 获取进化链URL
        const evolutionChainUrl = speciesData.evolution_chain.url;
        
        // 获取进化链数据
        const evolutionResponse = await fetch(evolutionChainUrl);
        const evolutionData = await evolutionResponse.json();
        
        // 处理进化链数据
        return renderEvolutionChain(evolutionData.chain);
    } catch (error) {
        console.error('获取进化链失败:', error);
        return '<p>无法加载进化信息</p>';
    }
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
        html += '<div class="evolution-arrow">→</div><div class="evolution-branches">';
        
        // 处理每个进化分支
        chain.evolves_to.forEach(evolution => {
            const evoPokemonId = extractPokemonId(evolution.species.url);
            const evoPokemonName = getChineseName(evolution.species.name, evoPokemonId);
            
            html += `
                <div class="evolution-branch">
                    <div class="evolution-pokemon" onclick="fetchAndShowPokemonById(${evoPokemonId})">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evoPokemonId}.png" alt="${evolution.species.name}">
                        <p>${evoPokemonName}</p>
                    </div>
            `;
            
            // 如果还有进一步进化
            if (evolution.evolves_to && evolution.evolves_to.length > 0) {
                html += '<div class="evolution-arrow">→</div><div class="evolution-branches">';
                
                evolution.evolves_to.forEach(finalEvolution => {
                    const finalEvoPokemonId = extractPokemonId(finalEvolution.species.url);
                    const finalEvoPokemonName = getChineseName(finalEvolution.species.name, finalEvoPokemonId);
                    
                    html += `
                        <div class="evolution-pokemon" onclick="fetchAndShowPokemonById(${finalEvoPokemonId})">
                            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${finalEvoPokemonId}.png" alt="${finalEvolution.species.name}">
                            <p>${finalEvoPokemonName}</p>
                        </div>
                    `;
                });
                
                html += '</div>';
            }
            
            html += '</div>';
        });
        
        html += '</div>';
    }
    
    html += '</div>';
    return html;
}

// 从URL中提取宝可梦ID
function extractPokemonId(url) {
    const matches = url.match(/\/(\d+)\/$/);
    return matches ? matches[1] : null;
}

// 通过ID获取并显示宝可梦详情
async function fetchAndShowPokemonById(id) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
        const pokemon = await response.json();
        showPokemonDetails(pokemon);
    } catch (error) {
        console.error(`获取宝可梦 ID:${id} 数据失败:`, error);
    }
}

// 收藏功能
function toggleFavorite(pokemonId) {
    let favorites = JSON.parse(localStorage.getItem('pokemonFavorites')) || [];
    
    if (isFavorite(pokemonId)) {
        // 移除收藏
        favorites = favorites.filter(id => id !== pokemonId);
        localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
    } else {
        // 添加收藏
        favorites.push(pokemonId);
        localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
    }
    
    // 更新按钮状态
    updateFavoriteButton(pokemonId);
}

// 检查是否已收藏
function isFavorite(pokemonId) {
    const favorites = JSON.parse(localStorage.getItem('pokemonFavorites')) || [];
    return favorites.includes(pokemonId);
}

// 更新收藏按钮状态
function updateFavoriteButton(pokemonId) {
    const favoriteButton = document.getElementById('favorite-button');
    if (favoriteButton) {
        favoriteButton.innerHTML = isFavorite(pokemonId) ? '❤️ 取消收藏' : '🤍 添加收藏';
    }
}

// 获取宝可梦所属的世代
function getGeneration(id) {
    for (const [genNumber, genData] of Object.entries(generations)) {
        if (id >= genData.start && id <= genData.end) {
            return {
                number: genNumber,
                name: genData.name
            };
        }
    }
    return { number: '?', name: '未知' };
}

// 辅助函数
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getChineseType(type) {
    const typeMap = {
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
    return typeMap[type] || type;
}

function getChineseStat(stat) {
    const statMap = {
        'hp': '生命',
        'attack': '攻击',
        'defense': '防御',
        'special-attack': '特攻',
        'special-defense': '特防',
        'speed': '速度'
    };
    return statMap[stat] || stat;
}

// 获取宝可梦中文名称，如果没有中文名称，则返回一个友好的显示
function getChineseName(name, id) {
    // 如果有中文名称，直接返回
    if (chineseNames[name]) {
        return chineseNames[name];
    }
    
    // 如果没有中文名称，尝试从官方API获取
    fetchChineseName(name, id);
    
    // 临时返回一个友好的显示
    const generation = getGeneration(id);
    return `${capitalizeFirstLetter(name)} (第${generation.number}世代)`;
}

// 尝试从官方API获取中文名称并缓存
async function fetchChineseName(name, id) {
    // 如果已经尝试过获取但失败，不再重复请求
    if (window.fetchedNames && window.fetchedNames[name] === false) {
        return;
    }
    
    // 初始化缓存
    if (!window.fetchedNames) {
        window.fetchedNames = {};
    }
    
    try {
        // 模拟API请求，实际项目中可以替换为真实的API调用
        // 这里我们使用本地存储来模拟持久化缓存
        const cachedNames = localStorage.getItem('pokemon_chinese_names');
        if (cachedNames) {
            const namesObj = JSON.parse(cachedNames);
            if (namesObj[name]) {
                chineseNames[name] = namesObj[name];
                return;
            }
        }
        
        // 标记为已尝试获取
        window.fetchedNames[name] = false;
    } catch (error) {
        console.error('获取中文名称失败:', error);
    }
}

// 全局变量
let selectedType = null;
let isFavoritesMode = false;

// 初始化
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
    
    // 应用保存的主题
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️ 日间模式';
    }
    
    // 事件监听
    searchButton.addEventListener('click', searchPokemons);
    searchInput.addEventListener('keyup', (e) => {
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
        const maxPage = Math.ceil(filteredPokemons.length / pokemonsPerPage);
        if (currentPage < maxPage) {
            currentPage++;
            displayPokemons();
        }
    });
    firstPageButton.addEventListener('click', () => {
        if (currentPage !== 1) {
            currentPage = 1;
            displayPokemons();
        }
    });
    lastPageButton.addEventListener('click', () => {
        const maxPage = Math.ceil(filteredPokemons.length / pokemonsPerPage);
        if (currentPage !== maxPage) {
            currentPage = maxPage;
            displayPokemons();
        }
    });
    
    // 页码跳转功能
    jumpButton.addEventListener('click', () => {
        jumpToPage();
    });
    
    pageInput.addEventListener('keyup', (e) => {
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
    
    // 夜间模式切换
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        themeToggle.textContent = isDarkMode ? '☀️ 日间模式' : '🌙 夜间模式';
    });
    
    // 添加键盘导航
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
            const maxPage = Math.ceil(filteredPokemons.length / pokemonsPerPage);
            currentPage = maxPage;
            displayPokemons();
        }
    });
    
    // 收藏按钮
    favoritesButton.addEventListener('click', () => {
        isFavoritesMode = !isFavoritesMode;
        favoritesButton.textContent = isFavoritesMode ? '🔍 显示全部' : '❤️ 我的收藏';
        
        if (isFavoritesMode) {
            showFavorites();
        } else {
            filterByGeneration(currentGeneration);
        }
    });
    
    // 世代选择按钮事件监听
    document.querySelectorAll('.gen-button').forEach(button => {
        button.addEventListener('click', function() {
            if (isFavoritesMode) {
                isFavoritesMode = false;
                favoritesButton.textContent = '❤️ 我的收藏';
            }
            
            // 移除所有按钮的active类
            document.querySelectorAll('.gen-button').forEach(btn => {
                btn.classList.remove('active');
            });
            // 给当前点击的按钮添加active类
            this.classList.add('active');
            
            // 设置当前选择的世代
            currentGeneration = this.getAttribute('data-gen');
            console.log('选择世代:', currentGeneration);
            
            // 重新过滤宝可梦并显示
            filterByGeneration(currentGeneration);
        });
    });
    
    // 属性筛选按钮事件监听
    document.querySelectorAll('.type-button').forEach(button => {
        button.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            
            if (isFavoritesMode) {
                isFavoritesMode = false;
                favoritesButton.textContent = '❤️ 我的收藏';
            }
            
            // 如果点击的是当前选中的属性，则取消选择
            if (selectedType === type) {
                selectedType = null;
                document.querySelectorAll('.type-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                filterByGeneration(currentGeneration);
            } else {
                selectedType = type;
                document.querySelectorAll('.type-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
                filterByType(type);
            }
        });
    });
    
    // 开始获取宝可梦数据
    fetchPokemons();
});

// 按属性筛选宝可梦
function filterByType(type) {
    if (currentGeneration === 'all') {
        filteredPokemons = allPokemons.filter(pokemon => 
            pokemon.types.some(t => t.type.name === type)
        );
    } else {
        const gen = generations[currentGeneration];
        filteredPokemons = allPokemons.filter(pokemon => 
            pokemon.id >= gen.start && 
            pokemon.id <= gen.end &&
            pokemon.types.some(t => t.type.name === type)
        );
    }
    
    currentPage = 1;
    displayPokemons();
}

// 显示收藏的宝可梦
function showFavorites() {
    const favorites = JSON.parse(localStorage.getItem('pokemonFavorites')) || [];
    
    if (favorites.length === 0) {
        filteredPokemons = [];
        pokemonContainer.innerHTML = '<p class="no-results">您还没有收藏任何宝可梦</p>';
        return;
    }
    
    filteredPokemons = allPokemons.filter(pokemon => favorites.includes(pokemon.id));
    currentPage = 1;
    displayPokemons();
}

// 跳转到指定页码
function jumpToPage() {
    const inputPage = parseInt(pageInput.value);
    const maxPage = Math.ceil(filteredPokemons.length / pokemonsPerPage);
    
    if (isNaN(inputPage) || inputPage < 1 || inputPage > maxPage) {
        // 输入无效，显示提示并保留输入值
        pageInput.classList.add('invalid');
        setTimeout(() => {
            pageInput.classList.remove('invalid');
        }, 800);
        return;
    }
    
    currentPage = inputPage;
    displayPokemons();
    // 保留输入值，方便用户继续操作
}
