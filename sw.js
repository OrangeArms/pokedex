// 缓存名称和版本
const CACHE_NAME = 'pokedex-cache-v1';

// 需要缓存的资源列表
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/sw.js',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'
];

// 预缓存的宝可梦图片（前20个）
const pokemonImagesToCache = Array.from({ length: 20 }, (_, i) => 
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${i + 1}.png`
);

// 预缓存的API请求
const apiToCache = [
  'https://pokeapi.co/api/v2/pokemon?limit=1025',
  'https://pokeapi.co/api/v2/pokemon/1/',
  'https://pokeapi.co/api/v2/pokemon/4/',
  'https://pokeapi.co/api/v2/pokemon/7/',
  'https://pokeapi.co/api/v2/pokemon/25/',
  'https://pokeapi.co/api/v2/type/fire',
  'https://pokeapi.co/api/v2/type/water',
  'https://pokeapi.co/api/v2/type/grass',
  'https://pokeapi.co/api/v2/type/electric'
];

// 合并所有需要缓存的资源
const allResourcesToCache = [...urlsToCache, ...pokemonImagesToCache, ...apiToCache];

// 安装 Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('缓存已打开');
        // 分批缓存资源，避免一次性缓存过多资源导致失败
        const cacheStaticResources = cache.addAll(urlsToCache);
        
        // 尝试缓存宝可梦图片，但不阻止安装过程
        const cachePokemonImages = Promise.allSettled(
          pokemonImagesToCache.map(url => 
            fetch(url, { mode: 'no-cors' })
              .then(response => cache.put(url, response))
              .catch(err => console.warn(`缓存图片失败: ${url}`, err))
          )
        );
        
        // 尝试缓存API请求，但不阻止安装过程
        const cacheApiRequests = Promise.allSettled(
          apiToCache.map(url => 
            fetch(url)
              .then(response => {
                if (response.ok) {
                  return cache.put(url, response.clone());
                }
                throw new Error(`API请求失败: ${url}`);
              })
              .catch(err => console.warn(`缓存API请求失败: ${url}`, err))
          )
        );
        
        // 只等待静态资源缓存完成
        return cacheStaticResources;
      })
      .then(() => self.skipWaiting())
  );
});

// 激活 Service Worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 处理网络请求
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);
  
  // 对于 PokeAPI 请求，使用网络优先策略
  if (event.request.url.includes('pokeapi.co')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // 如果请求成功，将响应克隆并存储在缓存中
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
          }
          return response;
        })
        .catch(() => {
          // 如果网络请求失败，尝试从缓存中获取
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              
              // 如果是宝可梦详情请求，尝试返回一个通用的离线响应
              if (event.request.url.match(/\/pokemon\/\d+\/?$/)) {
                return caches.match('/offline-pokemon.json')
                  .then(offlineResponse => {
                    if (offlineResponse) {
                      return offlineResponse;
                    }
                    // 如果没有离线响应，返回一个简单的JSON
                    return new Response(JSON.stringify({
                      offline: true,
                      message: '您当前处于离线状态，无法获取新的宝可梦数据'
                    }), {
                      headers: { 'Content-Type': 'application/json' }
                    });
                  });
              }
              
              // 如果是类型请求，尝试返回一个通用的离线响应
              if (event.request.url.includes('/type/')) {
                return new Response(JSON.stringify({
                  offline: true,
                  message: '您当前处于离线状态，无法获取新的类型数据'
                }), {
                  headers: { 'Content-Type': 'application/json' }
                });
              }
              
              // 其他API请求
              return new Response(JSON.stringify({
                offline: true,
                message: '您当前处于离线状态，无法获取新数据'
              }), {
                headers: { 'Content-Type': 'application/json' }
              });
            });
        })
    );
  } 
  // 对于宝可梦图片请求，使用缓存优先策略，并提供备用图片
  else if (event.request.url.includes('raw.githubusercontent.com') && 
           event.request.url.includes('/sprites/')) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(event.request)
            .then(response => {
              if (response && response.status === 200) {
                const responseToCache = response.clone();
                caches.open(CACHE_NAME)
                  .then(cache => {
                    cache.put(event.request, responseToCache);
                  });
              }
              return response;
            })
            .catch(() => {
              // 如果图片获取失败，返回一个备用图片
              return caches.match('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png')
                .then(fallbackResponse => {
                  if (fallbackResponse) {
                    return fallbackResponse;
                  }
                  // 如果连备用图片也没有，返回一个简单的图片占位符
                  return new Response('', {
                    status: 404,
                    statusText: 'Not found'
                  });
                });
            });
        })
    );
  }
  // 对于其他资源，使用缓存优先策略
  else {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // 如果在缓存中找到匹配的响应，则返回缓存的响应
          if (response) {
            return response;
          }
          
          // 否则发起网络请求
          return fetch(event.request)
            .then(response => {
              // 如果请求失败，直接返回响应
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              
              // 如果请求成功，将响应克隆并存储在缓存中
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
                
              return response;
            })
            .catch(error => {
              // 如果是HTML请求，返回离线页面
              if (event.request.headers.get('accept').includes('text/html')) {
                return caches.match('/index.html');
              }
              
              throw error;
            });
        })
    );
  }
});

// 后台同步
self.addEventListener('sync', event => {
  if (event.tag === 'sync-favorites') {
    event.waitUntil(syncFavorites());
  }
});

// 同步收藏夹数据
async function syncFavorites() {
  // 这里可以实现将本地收藏夹数据同步到服务器的逻辑
  // 当网络恢复时会执行
  console.log('同步收藏夹数据');
}

// 接收消息
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});