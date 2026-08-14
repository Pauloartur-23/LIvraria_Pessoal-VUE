<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getBook, relatedBooks, categories } from '../data/books'
import { coverFor } from '../utils/cover'
import { formatPrice } from '../utils/format'
import { useCartStore } from '../stores/store'
import BookCard from '../components/BookCard.vue'
import StarRating from '../components/StarRating.vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const quantity = ref(1)

const book = computed(() => getBook(route.params.id))
const category = computed(() =>
  book.value ? categories.find((c) => c.id === book.value.categoria) : null
)
const cover = computed(() => (book.value ? coverFor(book.value) : ''))
const isFav = computed(() => (book.value ? cartStore.isFavorite(book.value.id) : false))
const related = computed(() => (book.value ? relatedBooks(book.value) : []))

const installment = computed(() =>
  book.value ? (book.value.preco / 6).toFixed(2) : '0.00'
)

const stockLabel = computed(() => {
  if (!book.value) return ''
  if (book.value.estoque === 0) return 'Esgotado'
  if (book.value.estoque <= 5) return `Últimas ${book.value.estoque} unidades`
  return 'Em estoque'
})

const stockClass = computed(() => {
  if (!book.value) return ''
  if (book.value.estoque === 0) return 'out'
  if (book.value.estoque <= 5) return 'low'
  return 'ok'
})

const addToCart = () => {
  cartStore.addItem({
    id: book.value.id,
    titulo: book.value.titulo,
    autor: book.value.autor,
    preco: book.value.preco,
    img: book.value.img,
    quantity: quantity.value
  })
}

const buyNow = () => {
  addToCart()
  router.push('/carrinho')
}

const toggleFavorite = () => cartStore.toggleFavorite(book.value)

watch(
  () => route.params.id,
  () => {
    quantity.value = 1
  }
)
</script>

<template>
  <main class="detail page">
    <template v-if="book">
      <div class="container">
        <!-- Breadcrumb -->
        <nav class="breadcrumb">
          <RouterLink to="/">Início</RouterLink>
          <span class="mdi mdi-chevron-right"></span>
          <RouterLink to="/livros">Loja</RouterLink>
          <span class="mdi mdi-chevron-right"></span>
          <RouterLink
            :to="{ path: '/livros', query: { categoria: category.id } }"
          >
            {{ category.nome }}
          </RouterLink>
          <span class="mdi mdi-chevron-right"></span>
          <span class="current">{{ book.titulo }}</span>
        </nav>

        <div class="detail-layout">
          <!-- Cover -->
          <div class="cover-col">
            <div class="cover-wrap">
              <img :src="cover" :alt="book.titulo" />
            </div>
          </div>

          <!-- Info -->
          <div class="info-col">
            <span class="chip">
              <span class="mdi" :class="category.mdi"></span>
              {{ category.nome }}
            </span>

            <h1>{{ book.titulo }}</h1>
            <p class="author">por <strong>{{ book.autor }}</strong></p>

            <div class="rating-row">
              <StarRating :value="book.rating" :size="18" />
              <span class="rating-num">{{ book.rating.toFixed(1) }}</span>
              <span class="rating-count">({{ book.avaliacoes.toLocaleString('pt-BR') }} avaliações)</span>
            </div>

            <div class="price-block">
              <p class="price">{{ formatPrice(book.preco) }}</p>
              <p class="installment">ou 6x de {{ formatPrice(Number(installment)) }} sem juros</p>
            </div>

            <p class="stock" :class="stockClass">
              <span class="mdi" :class="book.estoque > 0 ? 'mdi-check-circle' : 'mdi-close-circle'"></span>
              {{ stockLabel }}
            </p>

            <p class="resumo">{{ book.resumo }}</p>

            <div class="actions">
              <div class="qty">
                <button
                  class="qty-btn"
                  :disabled="quantity <= 1"
                  aria-label="Diminuir quantidade"
                  @click="quantity--"
                >
                  <span class="mdi mdi-minus"></span>
                </button>
                <span class="qty-value">{{ quantity }}</span>
                <button
                  class="qty-btn"
                  :disabled="quantity >= Math.max(book.estoque, 1)"
                  aria-label="Aumentar quantidade"
                  @click="quantity++"
                >
                  <span class="mdi mdi-plus"></span>
                </button>
              </div>

              <button class="btn btn-primary buy-btn" :disabled="book.estoque === 0" @click="addToCart">
                <span class="mdi mdi-cart-plus"></span>
                Adicionar ao carrinho
              </button>

              <button class="btn btn-outline buy-btn" :disabled="book.estoque === 0" @click="buyNow">
                Comprar agora
              </button>

              <button class="btn fav-btn" :class="{ active: isFav }" aria-label="Curtir" @click="toggleFavorite">
                <span class="mdi" :class="isFav ? 'mdi-heart' : 'mdi-heart-outline'"></span>
              </button>
            </div>

            <div class="perks">
              <div class="perk">
                <span class="mdi mdi-truck-fast"></span>
                <div>
                  <strong>Frete grátis SC</strong>
                  <small>acima de R$ 79</small>
                </div>
              </div>
              <div class="perk">
                <span class="mdi mdi-seal-check"></span>
                <div>
                  <strong>Compra garantida</strong>
                  <small>troca em 7 dias</small>
                </div>
              </div>
              <div class="perk">
                <span class="mdi mdi-shield-check"></span>
                <div>
                  <strong>Pagamento seguro</strong>
                  <small>cartão, PIX ou boleto</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Details + description -->
        <div class="detail-sections">
          <section class="description">
            <h2>Sobre o livro</h2>
            <p>{{ book.descricao }}</p>
          </section>

          <section class="specs">
            <h2>Ficha técnica</h2>
            <ul>
              <li>
                <span>Autor</span>
                <strong>{{ book.autor }}</strong>
              </li>
              <li>
                <span>Categoria</span>
                <strong>{{ category.nome }}</strong>
              </li>
              <li>
                <span>Ano de publicação</span>
                <strong>{{ book.ano }}</strong>
              </li>
              <li>
                <span>Páginas</span>
                <strong>{{ book.paginas }}</strong>
              </li>
              <li>
                <span>Idioma</span>
                <strong>Português</strong>
              </li>
            </ul>
          </section>
        </div>
      </div>

      <!-- Related -->
      <section class="related">
        <div class="container">
          <div class="section-head">
            <div>
              <p class="section-eyebrow">Complementos</p>
              <h2>Você também pode gostar</h2>
            </div>
          </div>
          <div class="book-grid">
            <BookCard v-for="rel in related" :key="rel.id" :book="rel" />
          </div>
        </div>
      </section>
    </template>

    <div v-else class="empty-state container">
      <div class="empty-icon"><span class="mdi mdi-book-remove"></span></div>
      <h2>Livro não encontrado</h2>
      <p>O livro que você procura não existe ou não está mais disponível.</p>
      <button class="btn btn-primary" @click="router.push('/livros')">
        <span class="mdi mdi-store-outline"></span>
        Ver todos os livros
      </button>
    </div>
  </main>
</template>

<style scoped>
.detail {
  padding-top: 36px;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  font-size: 0.85rem;
  color: var(--color-muted);
  margin-bottom: 28px;
}

.breadcrumb a:hover {
  color: var(--color-primary);
}

.breadcrumb .mdi {
  font-size: 1rem;
  color: #d6d3d1;
}

.breadcrumb .current {
  color: var(--color-ink-soft);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 260px;
}

/* Layout */
.detail-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 48px;
  align-items: start;
}

.cover-wrap {
  position: sticky;
  top: calc(var(--header-height) + 24px);
}

.cover-wrap img {
  width: 100%;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  border-radius: var(--radius);
  box-shadow: var(--shadow-xl);
  background: var(--color-surface-2);
}

/* Info */
.info-col h1 {
  font-size: clamp(1.7rem, 3.5vw, 2.4rem);
  margin: 14px 0 6px;
}

.author {
  color: var(--color-muted);
  font-size: 1rem;
  margin-bottom: 16px;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.rating-num {
  font-weight: 700;
}

.rating-count {
  color: var(--color-muted);
  font-size: 0.88rem;
}

.price-block {
  background: var(--color-surface-2);
  border-radius: var(--radius);
  padding: 16px 20px;
  margin-bottom: 16px;
}

.price {
  font-family: var(--font-display);
  font-size: 2.1rem;
  font-weight: 700;
  color: var(--color-primary-dark);
}

.installment {
  color: var(--color-muted);
  font-size: 0.88rem;
}

.stock {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.88rem;
  font-weight: 600;
  margin-bottom: 18px;
}

.stock.ok {
  color: var(--color-success);
}

.stock.low {
  color: var(--color-accent-dark);
}

.stock.out {
  color: var(--color-danger);
}

.resumo {
  color: var(--color-ink-soft);
  line-height: 1.7;
  font-size: 1rem;
  margin-bottom: 24px;
}

/* Actions */
.actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.qty {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--color-surface);
}

.qty-btn {
  width: 42px;
  height: 48px;
  display: grid;
  place-items: center;
  color: var(--color-ink-soft);
  transition: background 0.2s ease, color 0.2s ease;
}

.qty-btn:hover:not(:disabled) {
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
}

.qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.qty-value {
  min-width: 40px;
  text-align: center;
  font-weight: 700;
}

.buy-btn {
  padding: 14px 26px;
}

.fav-btn {
  width: 48px;
  height: 48px;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-muted);
  display: grid;
  place-items: center;
  font-size: 1.3rem;
}

.fav-btn.active {
  color: var(--color-danger);
  border-color: var(--color-danger);
  background: #fef2f2;
}

/* Perks */
.perks {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border);
}

.perk {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.perk > .mdi {
  font-size: 1.5rem;
  color: var(--color-primary);
}

.perk strong {
  display: block;
  font-size: 0.9rem;
}

.perk small {
  color: var(--color-muted);
  font-size: 0.78rem;
}

/* Sections */
.detail-sections {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 36px;
  margin-top: 56px;
}

.description,
.specs {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 28px;
}

.description h2,
.specs h2 {
  font-size: 1.3rem;
  margin-bottom: 14px;
}

.description p {
  color: var(--color-ink-soft);
  line-height: 1.8;
}

.specs ul li {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-surface-2);
  font-size: 0.92rem;
}

.specs ul li:last-child {
  border-bottom: none;
}

.specs ul li span {
  color: var(--color-muted);
}

/* Related */
.related {
  padding: 64px 0 16px;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

/* Responsive */
@media (max-width: 960px) {
  .detail-layout {
    grid-template-columns: 220px 1fr;
    gap: 32px;
  }

  .perks {
    grid-template-columns: 1fr;
  }

  .detail-sections {
    grid-template-columns: 1fr;
  }

  .book-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 680px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }

  .cover-wrap {
    position: static;
    max-width: 260px;
    margin: 0 auto;
  }

  .book-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .actions {
    align-items: stretch;
    flex-direction: column;
  }

  .actions .qty {
    justify-content: center;
    margin-bottom: 4px;
  }

  .buy-btn {
    width: 100%;
  }

  .fav-btn {
    width: 100%;
  }
}
</style>
