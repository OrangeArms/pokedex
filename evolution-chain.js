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

        html += '</div>'; // 关闭 evolution-branches
    }

    html += '</div>'; // 关闭 evolution-flow
    html += '</div>'; // 关闭 evolution-chain

    return html;
}