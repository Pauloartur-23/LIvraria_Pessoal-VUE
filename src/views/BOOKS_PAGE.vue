<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { livros, categories } from '../data/books'
import BookCard from '../components/BookCard.vue'

const route = useRoute()
const router = useRouter()

const sortBy = ref('relevancia')

const selectedCategory = computed(() => route.query.categoria || '')
const searchQuery = computed(() => route.query.q || '')

const currentCategory = computed(() =>
  categories.find((c) => c.id === selectedCategory.value)
)

const filtered = computed(() => {
  let result = livros

  if (selectedCategory.value) {
    result = result.filter((b) => b.categoria === selectedCategory.value)
  }

  if (searchQuery.value) {
    const q = searchQuery.value.trim().toLowerCase()
    result = result.filter(
      (b) =>
        b.titulo.toLowerCase().includes(q) || b.autor.toLowerCase().includes(q)
    )
  }

  switch (sortBy.value) {
    case 'menor':
      result = [...result].sort((a, b) => a.preco - b.preco)
      break
    case 'maior':
      result = [...result].sort((a, b) => b.preco - a.preco)
      break
    case 'titulo':
      result = [...result].sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR'))
      break
    case 'rating':
      result = [...result].sort((a, b) => b.rating - a.rating)
      break
    default:
      result = [...result]
  }

  return result
})

const categoryCount = (id) =>
  id ? livros.filter((b) => b.categoria === id).length : livros.length

const selectCategory = (id) => {
  const query = { ...route.query }
  if (id) query.categoria = id
  else delete query.categoria
  router.push({ path: '/livros', query })
}

const clearFilters = () => {
  router.push('/livros')
  sortBy.value = 'relevancia'
}

watch(
  () => route.query,
  () => {
    if (route.query.q) sortBy.value = 'relevancia'
  }
)
</script>

<template>
  <main class="books-page page container">
    <div class="page-head">
      <div>
        <p class="page-eyebrow">
          {{ searchQuery ? `Resultados para "${searchQuery}"` : 'Nossa coleção' }}
        </p>
        <h1>{{ currentCategory ? currentCategory.nome : 'Todos os livros' }}</h1>
        <p class="page-sub">
          {{ filtered.length }} {{ filtered.length === 1 ? 'título encontrado' : 'títulos encontrados' }}
        </p>
      </div>
      <select v-model="sortBy" class="sort-select" aria-label="Ordenar por">
        <option value="relevancia">Mais relevantes</option>
        <option value="rating">Melhor avaliados</option>
        <option value="menor">Menor preço</option>
        <option value="maior">Maior preço</option>
        <option value="titulo">Título (A-Z)</option>
      </select>
    </div>

    <div class="layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <h3 class="sidebar-title">Categorias</h3>
        <ul class="cat-list">
          <li>
            <button
              class="cat-item"
              :class="{ active: !selectedCategory }"
              @click="selectCategory('')"
            >
              <span class="mdi mdi-view-grid-outline"></span>
              Todas
              <span class="count">{{ categoryCount('') }}</span>
            </button>
          </li>
          <li v-for="cat in categories" :key="cat.id">
            <button
              class="cat-item"
              :class="{ active: selectedCategory === cat.id }"
              @click="selectCategory(cat.id)"
            >
              <span class="mdi" :class="cat.mdi"></span>
              {{ cat.nome }}
              <span class="count">{{ categoryCount(cat.id) }}</span>
            </button>
          </li>
        </ul>
      </aside>

      <!-- Grid -->
      <section class="results">
        <div v-if="filtered.length" class="book-grid">
          <BookCard v-for="book in filtered" :key="book.id" :book="book" />
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon"><span class="mdi mdi-book-search"></span></div>
          <h2>Nenhum livro encontrado</h2>
          <p>
            Não encontramos resultados para a sua busca. Tente outro termo ou
            navegue por todas as categorias.
          </p>
          <button class="btn btn-primary" @click="clearFilters">
            <span class="mdi mdi-refresh"></span>
            Limpar filtros
          </button>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.books-page {
  padding-top: 48px;
  padding-bottom: 40px;
}

.page-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}

.page-eyebrow {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-primary);
  margin-bottom: 6px;
}

.page-head h1 {
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  margin-bottom: 6px;
}

.page-sub {
  color: var(--color-muted);
  font-size: 0.95rem;
}

.sort-select {
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  font-size: 0.9rem;
  cursor: pointer;
}

.layout {
  display: grid;
  grid-template-columns: 230px 1fr;
  gap: 36px;
  align-items: start;
}

/* Sidebar */
.sidebar {
  position: sticky;
  top: calc(var(--header-height) + 24px);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 18px;
}

.sidebar-title {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-muted);
  margin-bottom: 14px;
}

.cat-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--color-ink-soft);
  transition: all 0.18s ease;
}

.cat-item:hover {
  background: var(--color-bg);
}

.cat-item.active {
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
  font-weight: 600;
}

.cat-item .mdi {
  font-size: 1.1rem;
  color: var(--color-primary);
}

.cat-item .count {
  margin-left: auto;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-muted);
  background: var(--color-surface-2);
  border-radius: var(--radius-full);
  padding: 1px 8px;
}

.cat-item.active .count {
  background: var(--color-primary);
  color: #fff;
}

/* Grid */
.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

/* Responsive */
@media (max-width: 860px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
  }

  .cat-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .cat-item {
    width: auto;
    padding: 8px 14px;
    border: 1px solid var(--color-border);
  }
}
</style>
