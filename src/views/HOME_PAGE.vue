<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/store'
import { livros, categories } from '../data/books'
import { coverFor } from '../utils/cover'
import BookCard from '../components/BookCard.vue'

const router = useRouter()
const cartStore = useCartStore()

const lancamentos = computed(() =>
  [...livros].sort((a, b) => b.ano - a.ano).slice(0, 10)
)

const bestsellers = computed(() =>
  livros.filter((b) => b.rating >= 4.7).slice(0, 8)
)

const featured = computed(() => [livros[12], livros[8], livros[0], livros[15]])

const scrollRow = ref(null)
const canPrev = ref(false)
const canNext = ref(true)

const updateArrows = () => {
  const el = scrollRow.value
  if (!el) return
  canPrev.value = el.scrollLeft > 8
  canNext.value = el.scrollLeft < el.scrollWidth - el.clientWidth - 8
}

const scrollBy = (dir) => {
  const el = scrollRow.value
  if (!el) return
  el.scrollBy({ left: dir * 280, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('resize', updateArrows)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateArrows)
})

const copyCoupon = async (code) => {
  try {
    await navigator.clipboard.writeText(code)
    cartStore.addToast(`Cupom ${code} copiado! Use no carrinho.`, 'success')
  } catch {
    cartStore.addToast(`Use o cupom ${code} no carrinho.`, 'info')
  }
}
</script>

<template>
  <main class="home page">
    <!-- ============ HERO ============ -->
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-copy">
          <span class="hero-eyebrow">Livraria IFbooks</span>
          <h1>Sua próxima grande leitura começa aqui.</h1>
          <p class="hero-text">
            Livros novos, usados e seminovos de milhares de sebos e livrarias.
            Curadoria feita por quem ama histórias — e histórias boas merecem um novo leitor.
          </p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" @click="router.push('/livros')">
              Explorar a loja
              <span class="mdi mdi-arrow-right"></span>
            </button>
            <button class="btn btn-outline btn-lg" @click="router.push('/livros')">
              Ver lançamentos
            </button>
          </div>
          <div class="hero-stats">
            <div class="stat">
              <strong>16+</strong>
              <span>títulos em catálogo</span>
            </div>
            <div class="stat">
              <strong>4,7</strong>
              <span>avaliação média</span>
            </div>
            <div class="stat">
              <strong>Grátis</strong>
              <span>frete para SC</span>
            </div>
          </div>
        </div>

        <div class="hero-visual">
          <div class="stack">
            <RouterLink
              v-for="(book, i) in featured"
              :key="book.id"
              :to="`/livro/${book.id}`"
              class="stack-card"
              :class="`stack-${i + 1}`"
            >
              <img :src="coverFor(book)" :alt="book.titulo" />
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ CATEGORIES ============ -->
    <section class="categories">
      <div class="container">
        <div class="section-head">
          <div>
            <p class="section-eyebrow">Navegue por tema</p>
            <h2>Explore as categorias</h2>
          </div>
          <button class="btn btn-ghost" @click="router.push('/livros')">
            Ver todos <span class="mdi mdi-arrow-right"></span>
          </button>
        </div>
        <div class="cat-grid">
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="cat-card"
            @click="router.push({ path: '/livros', query: { categoria: cat.id } })"
          >
            <span class="cat-icon mdi" :class="cat.mdi"></span>
            <div class="cat-info">
              <strong>{{ cat.nome }}</strong>
              <span>{{ cat.descricao }}</span>
            </div>
            <span class="mdi mdi-chevron-right cat-arrow"></span>
          </button>
        </div>
      </div>
    </section>

    <!-- ============ LANÇAMENTOS ============ -->
    <section class="carousel-sec">
      <div class="container">
        <div class="section-head">
          <div>
            <p class="section-eyebrow">Recém-chegados</p>
            <h2>Lançamentos</h2>
          </div>
          <div class="carousel-nav">
            <button class="nav-btn" :disabled="!canPrev" aria-label="Anterior" @click="scrollBy(-1)">
              <span class="mdi mdi-chevron-left"></span>
            </button>
            <button class="nav-btn" :disabled="!canNext" aria-label="Próximo" @click="scrollBy(1)">
              <span class="mdi mdi-chevron-right"></span>
            </button>
          </div>
        </div>
        <div
          ref="scrollRow"
          class="book-row"
          @scroll.passive="updateArrows"
        >
          <BookCard v-for="book in lancamentos" :key="book.id" :book="book" class="row-item" />
        </div>
      </div>
    </section>

    <!-- ============ PROMO BANNER ============ -->
    <section class="promo">
      <div class="container promo-inner">
        <div class="promo-copy">
          <span class="promo-badge">Oferta por tempo limitado</span>
          <h2>10% OFF na primeira compra</h2>
          <p>Copie o cupom e aplique no seu carrinho. Válido para todo o catálogo.</p>
        </div>
        <button class="btn promo-btn" @click="copyCoupon('Kennedy10')">
          <span class="mdi mdi-content-copy"></span>
          Copiar cupom Kennedy10
        </button>
      </div>
    </section>

    <!-- ============ MAIS VENDIDOS ============ -->
    <section class="bestsellers">
      <div class="container">
        <div class="section-head">
          <div>
            <p class="section-eyebrow">Os queridinhos</p>
            <h2>Mais vendidos</h2>
          </div>
          <button class="btn btn-ghost" @click="router.push('/livros')">
            Ver todos <span class="mdi mdi-arrow-right"></span>
          </button>
        </div>
        <div class="book-grid">
          <BookCard v-for="book in bestsellers" :key="book.id" :book="book" />
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.home {
  overflow-x: hidden;
}

/* ============ HERO ============ */
.hero {
  background:
    radial-gradient(60% 120% at 85% 10%, rgba(14, 124, 102, 0.14), transparent 60%),
    linear-gradient(180deg, #fff 0%, var(--color-bg) 100%);
  padding: 64px 0 72px;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 48px;
  align-items: center;
}

.hero-eyebrow {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-primary);
  margin-bottom: 18px;
}

.hero-copy h1 {
  font-size: clamp(2.3rem, 5vw, 3.6rem);
  margin-bottom: 20px;
}

.hero-text {
  color: var(--color-muted);
  font-size: 1.08rem;
  line-height: 1.7;
  max-width: 540px;
  margin-bottom: 30px;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.btn-lg {
  padding: 15px 28px;
  font-size: 1rem;
}

.hero-stats {
  display: flex;
  gap: 40px;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat strong {
  font-family: var(--font-display);
  font-size: 1.7rem;
  color: var(--color-ink);
}

.stat span {
  font-size: 0.82rem;
  color: var(--color-muted);
}

/* Hero visual */
.hero-visual {
  position: relative;
  min-height: 420px;
}

.stack {
  position: relative;
  height: 440px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.stack-card {
  position: absolute;
  display: block;
  width: 190px;
  transition: transform 0.35s ease;
  filter: drop-shadow(var(--shadow-lg));
}

.stack-card img {
  width: 100%;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  border-radius: 8px;
  background: var(--color-surface-2);
}

.stack-1 {
  transform: rotate(-12deg) translateX(-120px);
  z-index: 1;
}

.stack-2 {
  transform: rotate(-4deg) translateX(-30px);
  z-index: 2;
}

.stack-3 {
  transform: rotate(5deg) translateX(70px);
  z-index: 3;
}

.stack-4 {
  transform: rotate(14deg) translateX(160px);
  z-index: 0;
}

.hero-float-chip {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 12px 16px;
  box-shadow: var(--shadow-lg);
  animation: float 5s ease-in-out infinite;
}

.hero-float-chip > .mdi {
  font-size: 1.6rem;
  color: var(--color-primary);
}

.hero-float-chip strong {
  display: block;
  font-size: 0.9rem;
}

.hero-float-chip small {
  color: var(--color-muted);
  font-size: 0.78rem;
}

.chip-1 {
  bottom: 18px;
  left: 8px;
}

.chip-2 {
  top: 24px;
  right: 0;
  animation-delay: 1.6s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* ============ CATEGORIES ============ */
.categories {
  padding: 72px 0 8px;
}

.cat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.cat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  text-align: left;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 20px;
  transition: all 0.25s ease;
}

.cat-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-3px);
}

.cat-icon {
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: var(--radius);
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 1.6rem;
}

.cat-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.cat-info strong {
  font-size: 1rem;
}

.cat-info span {
  font-size: 0.8rem;
  color: var(--color-muted);
}

.cat-arrow {
  color: var(--color-muted);
  transition: transform 0.2s ease, color 0.2s ease;
}

.cat-card:hover .cat-arrow {
  color: var(--color-primary);
  transform: translateX(3px);
}

/* ============ CAROUSEL ============ */
.carousel-sec {
  padding: 64px 0 16px;
}

.carousel-nav {
  display: flex;
  gap: 10px;
}

.nav-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-ink);
  display: grid;
  place-items: center;
  font-size: 1.3rem;
  transition: all 0.2s ease;
}

.nav-btn:hover:not(:disabled) {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.book-row {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 12px;
  scrollbar-width: none;
}

.book-row::-webkit-scrollbar {
  display: none;
}

.row-item {
  flex: 0 0 230px;
  scroll-snap-align: start;
}

/* ============ PROMO ============ */
.promo {
  padding: 24px 0;
}

.promo-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  background: linear-gradient(120deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  border-radius: var(--radius-lg);
  padding: 44px 48px;
  color: #fff;
  position: relative;
  overflow: hidden;
}

.promo-inner::before {
  content: '';
  position: absolute;
  right: -80px;
  top: -80px;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
}

.promo-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-accent-light);
  background: rgba(0, 0, 0, 0.2);
  padding: 5px 12px;
  border-radius: var(--radius-full);
  margin-bottom: 12px;
}

.promo-copy h2 {
  color: #fff;
  font-size: clamp(1.5rem, 3vw, 2.1rem);
  margin-bottom: 8px;
}

.promo-copy p {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
}

.promo-btn {
  background: #fff;
  color: var(--color-primary-dark);
  font-weight: 700;
  flex-shrink: 0;
}

.promo-btn:hover {
  background: var(--color-bg);
  transform: translateY(-2px);
}

/* ============ BESTSELLERS ============ */
.bestsellers {
  padding: 56px 0 8px;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

/* ============ RESPONSIVE ============ */
@media (max-width: 1000px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }

  .hero-visual {
    min-height: 380px;
    margin-top: 8px;
  }

  .cat-grid {
    grid-template-columns: 1fr 1fr;
  }

  .book-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 720px) {
  .cat-grid {
    grid-template-columns: 1fr;
  }

  .book-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .promo-inner {
    flex-direction: column;
    align-items: flex-start;
    padding: 32px 28px;
  }

  .hero-stats {
    gap: 24px;
  }

  .stack-card {
    width: 150px;
  }

  .stack-1 {
    transform: rotate(-12deg) translateX(-70px);
  }

  .stack-2 {
    transform: rotate(-4deg) translateX(-15px);
  }

  .stack-3 {
    transform: rotate(5deg) translateX(40px);
  }

  .stack-4 {
    transform: rotate(14deg) translateX(95px);
  }

  .chip-1 {
    left: -6px;
  }
}
</style>
