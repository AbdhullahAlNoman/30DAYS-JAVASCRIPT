// -----------------------------
// Recipe Finder (Vanilla JS)
// -----------------------------
const root = document.getElementById('app');

// Application State
const state = {
  recipes: [],
  favorites: JSON.parse(localStorage.getItem('rf:favorites') || '[]'),
  query: '',
  cuisine: 'Any',
  diet: 'Any',
  maxTime: '',
  sortBy: 'relevance',
  page: 1,
  perPage: 6,
};

// Dummy Recipe Data
const sampleRecipes = [
  { id: 1, name: 'Spaghetti Carbonara', cuisine: 'Italian', diet: 'Non-Veg', time: 25, rating: 4.8 },
  { id: 2, name: 'Vegetable Stir Fry', cuisine: 'Chinese', diet: 'Vegan', time: 20, rating: 4.6 },
  { id: 3, name: 'Chicken Biryani', cuisine: 'Indian', diet: 'Non-Veg', time: 45, rating: 4.9 },
  { id: 4, name: 'Paneer Butter Masala', cuisine: 'Indian', diet: 'Veg', time: 30, rating: 4.7 },
  { id: 5, name: 'Caesar Salad', cuisine: 'American', diet: 'Veg', time: 15, rating: 4.3 },
  { id: 6, name: 'Sushi Roll', cuisine: 'Japanese', diet: 'Non-Veg', time: 50, rating: 4.9 },
  { id: 7, name: 'Tom Yum Soup', cuisine: 'Thai', diet: 'Non-Veg', time: 35, rating: 4.5 },
  { id: 8, name: 'Miso Ramen', cuisine: 'Japanese', diet: 'Vegan', time: 40, rating: 4.4 },
  { id: 9, name: 'Falafel Wrap', cuisine: 'Middle Eastern', diet: 'Vegan', time: 25, rating: 4.2 },
  { id: 10, name: 'Pasta Primavera', cuisine: 'Italian', diet: 'Veg', time: 30, rating: 4.6 },
];

// Initialize recipes
state.recipes = sampleRecipes;

// Render UI
function render() {
  const filtered = state.recipes
    .filter(r => (!state.query || r.name.toLowerCase().includes(state.query.toLowerCase())))
    .filter(r => (state.cuisine === 'Any' || r.cuisine === state.cuisine))
    .filter(r => (state.diet === 'Any' || r.diet === state.diet))
    .filter(r => (!state.maxTime || r.time <= parseInt(state.maxTime)))
    .sort((a, b) => {
      if (state.sortBy === 'rating') return b.rating - a.rating;
      if (state.sortBy === 'time') return a.time - b.time;
      return 0;
    });

  const start = (state.page - 1) * state.perPage;
  const paginated = filtered.slice(start, start + state.perPage);

  root.innerHTML = `
    <div class="p-6 max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold mb-4">Recipe Finder</h1>
      <div class="flex flex-wrap gap-3 mb-6">
        <input id="search" type="text" placeholder="Search recipes..." 
          class="border rounded-lg px-3 py-2 flex-1" value="${state.query}">
        <select id="cuisine" class="border rounded-lg px-2 py-2">
          <option>Any</option>
          <option>Italian</option>
          <option>Indian</option>
          <option>Chinese</option>
          <option>Japanese</option>
          <option>Thai</option>
          <option>American</option>
        </select>
        <select id="diet" class="border rounded-lg px-2 py-2">
          <option>Any</option>
          <option>Veg</option>
          <option>Vegan</option>
          <option>Non-Veg</option>
        </select>
        <input id="maxtime" type="number" placeholder="Max time (min)" 
          class="border rounded-lg px-3 py-2 w-32" value="${state.maxTime}">
        <select id="sort" class="border rounded-lg px-2 py-2">
          <option value="relevance">Relevance</option>
          <option value="rating">Rating</option>
          <option value="time">Time</option>
        </select>
        <button id="clear" class="bg-gray-200 px-3 py-2 rounded-lg">Clear</button>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        ${paginated.map(r => `
          <div class="border rounded-xl p-4 shadow hover:shadow-lg transition">
            <h2 class="text-xl font-semibold">${r.name}</h2>
            <p class="text-sm text-gray-600">${r.cuisine} • ${r.diet}</p>
            <p class="text-sm text-gray-500">Time: ${r.time} mins • ⭐ ${r.rating}</p>
            <div class="mt-3 flex justify-between">
              <button class="view bg-blue-500 text-white px-3 py-1 rounded" data-id="${r.id}">View</button>
              <button class="${state.favorites.includes(String(r.id)) ? 'bg-red-500' : 'bg-gray-300'} fav px-3 py-1 rounded" data-id="${r.id}">
                ${state.favorites.includes(String(r.id)) ? '♥' : '♡'}
              </button>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="flex justify-between mt-6">
        <button id="prev" class="px-3 py-2 bg-gray-200 rounded">Prev</button>
        <span>Page ${state.page}</span>
        <button id="next" class="px-3 py-2 bg-gray-200 rounded">Next</button>
      </div>

      <div class="mt-8">
        <h2 class="text-2xl font-semibold mb-3">Favorites</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          ${state.favorites.map(id => {
            const f = state.recipes.find(r => String(r.id) === id);
            if (!f) return '';
            return `
              <div class="border rounded-xl p-4 shadow">
                <h2 class="text-xl font-semibold">${f.name}</h2>
                <p class="text-sm text-gray-600">${f.cuisine} • ${f.diet}</p>
                <p class="text-sm text-gray-500">⭐ ${f.rating}</p>
                <button class="favremove bg-red-500 text-white px-3 py-1 rounded mt-2" data-id="${f.id}">Remove</button>
              </div>
            `;
          }).join('')}
        </div>
        ${state.favorites.length ? '<button id="clearfav" class="mt-4 bg-gray-200 px-3 py-2 rounded">Clear Favorites</button>' : ''}
      </div>
    </div>
  `;

  attachHandlers();
}

// Show modal for details
function showModal(id) {
  const recipe = state.recipes.find(r => r.id == id);
  if (!recipe) return;

  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black/50 flex items-center justify-center';
  overlay.innerHTML = `
    <div class="bg-white rounded-xl p-6 w-96 relative">
      <h2 class="text-2xl font-semibold mb-2">${recipe.name}</h2>
      <p><strong>Cuisine:</strong> ${recipe.cuisine}</p>
      <p><strong>Diet:</strong> ${recipe.diet}</p>
      <p><strong>Time:</strong> ${recipe.time} mins</p>
      <p><strong>Rating:</strong> ${recipe.rating}</p>
      <button class="close absolute top-2 right-2 bg-gray-200 rounded-full px-3 py-1">✖</button>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector('.close').addEventListener('click', () => overlay.remove());
}

// Attach all event listeners (fixed debounce + focus restore)
function attachHandlers() {
  const { favorites } = state;
  const searchEl = root.querySelector('#search');
  const cuisineEl = root.querySelector('#cuisine');
  const dietEl = root.querySelector('#diet');
  const maxtimeEl = root.querySelector('#maxtime');
  const sortEl = root.querySelector('#sort');

  // 🧠 FIX: Debounce search + retain focus after re-render
  let searchTimeout;
  if (searchEl) {
    const currentValue = state.query;
    searchEl.value = currentValue;
    searchEl.addEventListener('input', e => {
      clearTimeout(searchTimeout);
      const val = e.target.value;
      state.query = val;
      searchTimeout = setTimeout(() => {
        state.page = 1;
        render();
        const newSearchEl = document.querySelector('#search');
        if (newSearchEl) {
          newSearchEl.focus();
          newSearchEl.selectionStart = newSearchEl.selectionEnd = val.length;
        }
      }, 400);
    });
  }

  if (cuisineEl) cuisineEl.addEventListener('change', e => { state.cuisine = e.target.value; state.page = 1; render(); });
  if (dietEl) dietEl.addEventListener('change', e => { state.diet = e.target.value; state.page = 1; render(); });
  if (maxtimeEl) maxtimeEl.addEventListener('input', e => { state.maxTime = e.target.value; state.page = 1; render(); });
  if (sortEl) sortEl.addEventListener('change', e => { state.sortBy = e.target.value; render(); });

  const clearBtn = root.querySelector('#clear');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    state.query = ''; state.cuisine = 'Any'; state.diet = 'Any'; state.maxTime = ''; state.sortBy = 'relevance'; state.page = 1; render();
  });

  const clearFavBtn = root.querySelector('#clearfav');
  if (clearFavBtn) clearFavBtn.addEventListener('click', () => {
    state.favorites = []; localStorage.setItem('rf:favorites', JSON.stringify([])); render();
  });

  const prev = root.querySelector('#prev');
  if (prev) prev.addEventListener('click', () => { if (state.page > 1) { state.page--; render(); } });

  const next = root.querySelector('#next');
  if (next) next.addEventListener('click', () => { state.page++; render(); });

  root.querySelectorAll('.fav, .fav2').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = e.currentTarget.dataset.id;
      const favs = state.favorites.includes(String(id))
        ? state.favorites.filter(x => x !== String(id))
        : [...state.favorites, String(id)];
      state.favorites = favs;
      localStorage.setItem('rf:favorites', JSON.stringify(favs));
      render();
    });
  });

  root.querySelectorAll('.favremove').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = e.currentTarget.dataset.id;
      state.favorites = state.favorites.filter(x => x !== String(id));
      localStorage.setItem('rf:favorites', JSON.stringify(state.favorites));
      render();
    });
  });

  root.querySelectorAll('.view').forEach(btn => {
    btn.addEventListener('click', e => showModal(e.currentTarget.dataset.id));
  });
}

// Initial render
render();
