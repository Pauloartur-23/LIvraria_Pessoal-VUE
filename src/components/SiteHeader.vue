<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import throttle from 'lodash.throttle'
import { useCartStore } from '../stores/store'
import { categories, searchBooks } from '../data/books'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()

const headerEl = ref(null)
const lastScrollTop = ref(0)
const menuOpen = ref(false)
const categoriesOpen = ref(false)
const searchQuery = ref('')
const searchFocused = ref(false)
const suggestions = ref([])
const searchBox = ref(null)
let searchTimer = null

const cartCount = computed(() => cartStore.count)
const favCount = computed(() => cartStore.favoritesCount)

const handleScroll = throttle(() => {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop
  if (currentScroll > lastScrollTop.value && currentScroll > 160) {
    headerEl.value?.classList.add('hidden')
  } else {
    headerEl.value?.classList.remove('hidden')
  }
  lastScrollTop.value = Math.max(currentScroll, 0)
}, 180)

const onSearchInput = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    suggestions.value = searchQuery.value.trim()
      ? searchBooks(searchQuery.value).slice(0, 6)
      : []
  }, 200)
}

const submitSearch = () => {
  const q = searchQuery.value.trim()
  router.push({ path: '/livros', query: q ? { q } : {} })
  searchFocused.value = false
  suggestions.value = []
}

const goBook = (id) => {
  router.push(`/livro/${id}`)
  searchQuery.value = ''
  suggestions.value = []
  searchFocused.value = false
}

const goCategory = (id) => {
  router.push({ path: '/livros', query: { categoria: id } })
  categoriesOpen.value = false
  menuOpen.value = false
}

const closeSuggestions = (event) => {
  if (searchBox.value && !searchBox.value.contains(event.target)) {
    searchFocused.value = false
    suggestions.value = []
  }
}

watch(
  () => route.fullPath,
  () => {
    searchQuery.value = ''
    suggestions.value = []
    menuOpen.value = false
    categoriesOpen.value = false
  }
)

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', closeSuggestions)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', closeSuggestions)
  clearTimeout(searchTimer)
})
</script>

<template>
  <header ref="headerEl">
    <div class="strip">
      <div class="container strip-inner">
        <p>
          <span class="mdi mdi-truck-fast"></span>
          Frete grátis para SC em pedidos acima de R$ 79
        </p>
        <p class="strip-coupon">
          Use o cupom <strong>Kennedy10</strong> e ganhe 10% OFF
        </p>
      </div>
    </div>

    <div class="main-bar">
      <div class="container main-row">
        <button class="hamburger" aria-label="Abrir menu" @click="menuOpen = !menuOpen">
          <span class="mdi" :class="menuOpen ? 'mdi-close' : 'mdi-menu'"></span>
        </button>

        <RouterLink to="/" class="logo">
          <span class="logo-mark mdi mdi-book-open-page-variant"></span>
          <span class="logo-text">
            <span class="logo-name">IFbooks</span>
            <span class="logo-tag">livraria online</span>
          </span>
        </RouterLink>

        <div class="search" ref="searchBox">
          <div class="search-box">
            <span class="mdi mdi-magnify"></span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar por título ou autor..."
              @input="onSearchInput"
              @focus="searchFocused = true"
              @keyup.enter="submitSearch"
            />
            <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">
              <span class="mdi mdi-close"></span>
            </button>
          </div>

          <transition name="pop">
            <div v-if="searchFocused && suggestions.length" class="suggestions">
              <button
                v-for="book in suggestions"
                :key="book.id"
                class="suggestion"
                @mousedown.prevent="goBook(book.id)"
              >
                <span class="suggestion-title">{{ book.titulo }}</span>
                <span class="suggestion-author">{{ book.autor }}</span>
              </button>
              <button class="suggestion see-all" @mousedown.prevent="submitSearch">
                <span class="mdi mdi-magnify"></span>
                Ver todos os resultados para "{{ searchQuery }}"
              </button>
            </div>
          </transition>
        </div>

        <nav class="actions">
          <RouterLink to="/like" class="action" aria-label="Curtidos">
            <span class="mdi mdi-heart-outline"></span>
            <span class="action-label">Curtidos</span>
            <span v-if="favCount > 0" class="badge">{{ favCount }}</span>
          </RouterLink>
          <RouterLink to="/login" class="action" aria-label="Entrar">
            <span class="mdi mdi-account-outline"></span>
            <span class="action-label">Entrar</span>
          </RouterLink>
          <RouterLink to="/carrinho" class="action" aria-label="Carrinho">
            <span class="mdi mdi-cart-outline"></span>
            <span class="action-label">Carrinho</span>
            <span v-if="cartCount > 0" class="badge">{{ cartCount }}</span>
          </RouterLink>
        </nav>
      </div>
    </div>

    <nav class="desktop-nav">
      <div class="container nav-row">
        <RouterLink to="/" class="nav-link" exact-active-class="active">Início</RouterLink>
        <RouterLink to="/livros" class="nav-link" active-class="active">Loja</RouterLink>

        <div class="dropdown" @mouseenter="categoriesOpen = true" @mouseleave="categoriesOpen = false">
          <button class="nav-link dropdown-toggle">
            Categorias <span class="mdi mdi-chevron-down"></span>
          </button>
          <transition name="pop">
            <div v-if="categoriesOpen" class="dropdown-menu">
              <RouterLink
                to="/livros"
                class="dropdown-item"
                @click="categoriesOpen = false"
              >
                <span class="mdi mdi-view-grid-outline"></span>
                Todas as categorias
              </RouterLink>
              <button
                v-for="cat in categories"
                :key="cat.id"
                class="dropdown-item"
                @click="goCategory(cat.id)"
              >
                <span class="mdi" :class="cat.mdi"></span>
                {{ cat.nome }}
              </button>
            </div>
          </transition>
        </div>

        <RouterLink to="/like" class="nav-link" active-class="active">Curtidos</RouterLink>
        <a href="#newsletter" class="nav-link">Promoções</a>
      </div>
    </nav>

    <transition name="slide">
      <nav v-if="menuOpen" class="mobile-menu">
        <RouterLink to="/" class="mobile-link" @click="menuOpen = false">
          <span class="mdi mdi-home-outline"></span> Início
        </RouterLink>
        <RouterLink to="/livros" class="mobile-link" @click="menuOpen = false">
          <span class="mdi mdi-store-outline"></span> Loja
        </RouterLink>
        <p class="mobile-subtitle">Categorias</p>
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="mobile-link"
          @click="goCategory(cat.id)"
        >
          <span class="mdi" :class="cat.mdi"></span> {{ cat.nome }}
        </button>
        <RouterLink to="/like" class="mobile-link" @click="menuOpen = false">
          <span class="mdi mdi-heart-outline"></span> Curtidos
        </RouterLink>
        <RouterLink to="/carrinho" class="mobile-link" @click="menuOpen = false">
          <span class="mdi mdi-cart-outline"></span> Carrinho
        </RouterLink>
        <RouterLink to="/login" class="mobile-link" @click="menuOpen = false">
          <span class="mdi mdi-account-outline"></span> Entrar
        </RouterLink>
      </nav>
    </transition>
  </header>
</template>

<style scoped>
header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  transition: transform 0.3s ease;
}

header.hidden {
  transform: translateY(-100%);
}

/* Top strip */
.strip {
  background: var(--color-ink);
  color: #e7e5e4;
  font-size: 0.78rem;
}

.strip-inner {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
}

.strip p {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.strip-coupon strong {
  color: var(--color-accent);
}

/* Main bar */
.main-row {
  display: flex;
  align-items: center;
  gap: 24px;
  padding-top: 12px;
  padding-bottom: 12px;
}

.hamburger {
  display: none;
  width: 42px;
  height: 42px;
  border-radius: var(--radius-sm);
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--color-ink);
  background: var(--color-surface-2);
}

/* Logo */
.logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.logo-mark {
  font-size: 2rem;
  color: var(--color-primary);
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.logo-name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--color-ink);
}

.logo-tag {
  font-size: 0.68rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-muted);
}

/* Search */
.search {
  position: relative;
  flex: 1;
  max-width: 560px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-full);
  padding: 0 6px 0 16px;
  background: var(--color-bg);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-box:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(14, 124, 102, 0.12);
  background: var(--color-surface);
}

.search-box > span {
  color: var(--color-muted);
}

.search-box input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 11px 0;
  font-size: 0.94rem;
}

.search-box input:focus {
  outline: none;
}

.clear-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--color-muted);
  background: transparent;
}

.clear-btn:hover {
  background: var(--color-surface-2);
  color: var(--color-ink);
}

/* Suggestions */
.suggestions {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  z-index: 50;
}

.suggestion {
  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: left;
  padding: 11px 18px;
  border-bottom: 1px solid var(--color-surface-2);
  transition: background 0.15s ease;
}

.suggestion:hover {
  background: var(--color-bg);
}

.suggestion-title {
  font-weight: 600;
  font-size: 0.92rem;
  color: var(--color-ink);
}

.suggestion-author {
  font-size: 0.8rem;
  color: var(--color-muted);
}

.suggestion.see-all {
  flex-direction: row;
  align-items: center;
  gap: 8px;
  color: var(--color-primary);
  font-weight: 600;
  font-size: 0.88rem;
  border-bottom: none;
}

/* Actions */
.actions {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}

.action {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  color: var(--color-ink-soft);
  transition: color 0.2s ease, background 0.2s ease;
}

.action:hover {
  color: var(--color-primary);
  background: var(--color-bg);
}

.action > .mdi {
  font-size: 1.5rem;
}

.action-label {
  font-size: 0.72rem;
  font-weight: 500;
}

.badge {
  position: absolute;
  top: 2px;
  right: 4px;
  min-width: 19px;
  height: 19px;
  padding: 0 5px;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: #fff;
  font-size: 0.68rem;
  font-weight: 700;
  display: grid;
  place-items: center;
}

/* Desktop nav */
.desktop-nav {
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
}

.nav-row {
  display: flex;
  align-items: center;
  gap: 4px;
  padding-top: 0;
  padding-bottom: 0;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 12px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-ink-soft);
  border-bottom: 2px solid transparent;
  transition: color 0.2s ease;
}

.nav-link:hover,
.nav-link.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.dropdown {
  position: relative;
}

.dropdown-toggle {
  border-bottom-color: transparent;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 240px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-xl);
  padding: 8px;
  z-index: 40;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  color: var(--color-ink-soft);
  transition: background 0.15s ease, color 0.15s ease;
}

.dropdown-item:hover {
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
}

.dropdown-item .mdi {
  font-size: 1.15rem;
  color: var(--color-primary);
}

/* Mobile menu */
.mobile-menu {
  display: none;
  border-top: 1px solid var(--color-border);
  padding: 10px 0 18px;
  background: var(--color-surface);
}

.mobile-link {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  text-align: left;
  padding: 12px 28px;
  font-size: 0.98rem;
  font-weight: 500;
  color: var(--color-ink-soft);
}

.mobile-link:hover {
  color: var(--color-primary);
  background: var(--color-bg);
}

.mobile-subtitle {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-muted);
  padding: 14px 28px 6px;
}

/* Transitions */
.pop-enter-active,
.pop-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 960px) {
  .action-label {
    display: none;
  }

  .actions {
    gap: 0;
  }

  .action {
    padding: 8px 10px;
  }

  .desktop-nav {
    display: none;
  }

  .hamburger {
    display: inline-flex;
  }

  .mobile-menu {
    display: block;
  }

  .strip-coupon {
    display: none;
  }

  .main-row {
    gap: 12px;
  }
}

@media (max-width: 640px) {
  .logo-tag {
    display: none;
  }

  .action {
    padding: 8px 8px;
  }

  .search {
    max-width: none;
  }

  .main-row {
    flex-wrap: wrap;
  }

  .search {
    order: 3;
    flex-basis: 100%;
    max-width: 100%;
  }
}
</style>
