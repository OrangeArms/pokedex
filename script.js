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

// 中文名称映射 (这里只包含部分，完整版太长了)
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
    
    // 第二世代 (城都地区) 部分代表
    'chikorita': '菊草叶', 'bayleef': '月桂叶', 'meganium': '大竺葵',
    'cyndaquil': '火球鼠', 'quilava': '火岩鼠', 'typhlosion': '火暴兽',
    'totodile': '小锯鳄', 'croconaw': '蓝鳄', 'feraligatr': '大力鳄',
    'togepi': '波克比', 'togetic': '波克基古', 'togekiss': '波克基斯',
    'ampharos': '电龙', 'marill': '玛力露', 'azumarill': '玛力露丽',
    'sudowoodo': '树才怪', 'politoed': '蚊香蛙皇', 'espeon': '太阳伊布',
    'umbreon': '月亮伊布', 'slowking': '呆呆王', 'unown': '未知图腾',
    'wobbuffet': '果然翁', 'girafarig': '麒麟奇', 'pineco': '榛果球',
    'forretress': '佛烈托斯', 'dunsparce': '土龙弟弟', 'gligar': '天蝎',
    'steelix': '大钢蛇', 'scizor': '巨钳螳螂', 'heracross': '赫拉克罗斯',
    'sneasel': '狃拉', 'teddiursa': '熊宝宝', 'ursaring': '圈圈熊',
    'piloswine': '长毛猪', 'corsola': '太阳珊瑚', 'octillery': '章鱼桶',
    'delibird': '信使鸟', 'mantine': '巨翅飞鱼', 'skarmory': '盔甲鸟',
    'houndour': '戴鲁比', 'houndoom': '黑鲁加', 'kingdra': '刺龙王',
    'phanpy': '小小象', 'donphan': '顿甲', 'porygon2': '多边兽Ⅱ',
    'stantler': '惊角鹿', 'smeargle': '图图犬', 'tyrogue': '巴尔郎',
    'hitmontop': '柯波朗', 'smoochum': '迷唇娃', 'elekid': '电击怪',
    'magby': '鸭嘴宝宝', 'miltank': '大奶罐', 'blissey': '幸福蛋',
    'raikou': '雷公', 'entei': '炎帝', 'suicune': '水君',
    'larvitar': '幼基拉斯', 'pupitar': '沙基拉斯', 'tyranitar': '班基拉斯',
    'lugia': '洛奇亚', 'ho-oh': '凤王', 'celebi': '时拉比',
    
    // 第八世代 (伽勒尔地区) 部分代表
    'grookey': '敲音猴', 'thwackey': '啪咚猴', 'rillaboom': '轰擂金刚猩',
    'scorbunny': '炎兔儿', 'raboot': '腾蹴小将', 'cinderace': '闪焰王牌',
    'sobble': '泪眼蜥', 'drizzile': '变涩蜥', 'inteleon': '千面避役',
    'wooloo': '毛辫羊', 'dubwool': '毛毛角羊', 'yamper': '来电汪',
    'boltund': '逐电犬', 'corviknight': '铠鸦', 'toxtricity': '颤弦蝾螈',
    'eternatus': '无极汰那', 'zacian': '苍响', 'zamazenta': '藏玛然特',
    
    // 第九世代 (帕底亚地区) 部分代表
    'sprigatito': '新叶喵', 'floragato': '蒂蕾喵', 'meowscarada': '魔幻假面喵',
    'fuecoco': '呆火鳄', 'crocalor': '炙烫鳄', 'skeledirge': '骨纹巨声鳄',
    'quaxly': '润水鸭', 'quaxwell': '涌跃鸭', 'quaquaval': '狂欢浪舞鸭',
    'lechonk': '爱吃豚', 'oinkologne': '飘香豚', 'pawmi': '电气鼠',
    'pawmo': '电气猫', 'pawmot': '电气魔兽', 'koraidon': '故勒顿',
    'miraidon': '密勒顿', 'gimmighoul': '小木灵', 'gholdengo': '金丝猴'
};

// DOM 元素
let pokemonContainer;
let searchInput;
let searchButton;
let prevButton;
let nextButton;
let currentPageSpan;
let modal;
let modalClose;
let pokemonDetails;

// 获取宝可梦数据
async function fetchPokemons() {
    try {
        pokemonContainer.innerHTML = '<p class="loading">正在加载宝可梦数据，请稍候...</p>';
        
        // 由于API限制，我们分批次获取宝可梦数据
        // 第一世代 (1-151)
        const gen1 = await fetchPokemonsByRange(1, 151);
        // 第二世代 (152-251)
        const gen2 = await fetchPokemonsByRange(152, 251);
        // 第三世代 (252-386)
        const gen3 = await fetchPokemonsByRange(252, 386);
        // 第四世代 (387-493)
        const gen4 = await fetchPokemonsByRange(387, 493);
        // 第五世代 (494-649)
        const gen5 = await fetchPokemonsByRange(494, 649);
        // 第六世代 (650-721)
        const gen6 = await fetchPokemonsByRange(650, 721);
        // 第七世代 (722-809)
        const gen7 = await fetchPokemonsByRange(722, 809);
        // 第八世代 (810-905)
        const gen8 = await fetchPokemonsByRange(810, 905);
        // 第九世代 (906-1025)
        const gen9 = await fetchPokemonsByRange(906, 1025);
        
        // 合并所有世代的数据
        allPokemons = [...gen1, ...gen2, ...gen3, ...gen4, ...gen5, ...gen6, ...gen7, ...gen8, ...gen9].filter(p => p !== null);
        
        // 按ID排序
        allPokemons.sort((a, b) => a.id - b.id);
        
        filteredPokemons = [...allPokemons];
        displayPokemons();
        
        console.log(`成功加载了 ${allPokemons.length} 个宝可梦`);
    } catch (error) {
        console.error('获取宝可梦数据失败:', error);
        pokemonContainer.innerHTML = '<p class="error">获取数据失败，请稍后再试</p>';
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
    currentPageSpan.textContent = currentPage;
    
    const start = (currentPage - 1) * pokemonsPerPage;
    const end = start + pokemonsPerPage;
    const pokemonsToDisplay = filteredPokemons.slice(start, end);
    
    if (pokemonsToDisplay.length === 0) {
        pokemonContainer.innerHTML = '<p class="no-results">没有找到匹配的宝可梦</p>';
        return;
    }
    
    pokemonsToDisplay.forEach(pokemon => {
        const pokemonCard = document.createElement('div');
        pokemonCard.classList.add('pokemon-card');
        pokemonCard.addEventListener('click', () => showPokemonDetails(pokemon));
        
        const types = pokemon.types.map(type => {
            return `<span class="type type-${type.type.name}">${getChineseType(type.type.name)}</span>`;
        }).join('');
        
        // 获取中文名称
        const chineseName = chineseNames[pokemon.name] || capitalizeFirstLetter(pokemon.name);
        
        // 获取世代信息
        const generation = getGeneration(pokemon.id);
        
        pokemonCard.innerHTML = `
            <img src="${pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default}" alt="${pokemon.name}" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png'">
            <h3>#${pokemon.id.toString().padStart(4, '0')} ${chineseName}</h3>
            <div>${types}</div>
            <p class="generation">第${generation.number}世代 (${generation.name})</p>
        `;
        
        pokemonContainer.appendChild(pokemonCard);
    });
    
    // 更新分页按钮状态
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === Math.ceil(filteredPokemons.length / pokemonsPerPage);
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
    const chineseName = chineseNames[pokemon.name] || capitalizeFirstLetter(pokemon.name);
    
    // 获取世代信息
    const generation = getGeneration(pokemon.id);
    
    pokemonDetails.innerHTML = `
        <h2>#${pokemon.id.toString().padStart(4, '0')} ${chineseName} (${capitalizeFirstLetter(pokemon.name)})</h2>
        <p class="generation-detail">第${generation.number}世代 (${generation.name})</p>
        <img src="${pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default}" alt="${pokemon.name}" style="width: 200px; height: 200px;" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png'">
        <div>${types}</div>
        <p>身高: ${pokemon.height / 10}m</p>
        <p>体重: ${pokemon.weight / 10}kg</p>
        <p>特性: ${abilities}</p>
        <div class="stats">
            <h3>能力值</h3>
            ${stats}
        </div>
    `;
    
    modal.style.display = 'block';
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

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM 加载完成，初始化 UI');
    
    // 初始化DOM元素
    pokemonContainer = document.getElementById('pokemon-container');
    searchInput = document.getElementById('search-input');
    searchButton = document.getElementById('search-button');
    prevButton = document.getElementById('prev-button');
    nextButton = document.getElementById('next-button');
    currentPageSpan = document.getElementById('current-page');
    modal = document.getElementById('pokemon-modal');
    modalClose = document.querySelector('.close');
    pokemonDetails = document.getElementById('pokemon-details');
    
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
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // 世代选择按钮事件监听
    document.querySelectorAll('.gen-button').forEach(button => {
        button.addEventListener('click', function() {
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
    
    // 开始获取宝可梦数据
    fetchPokemons();
});