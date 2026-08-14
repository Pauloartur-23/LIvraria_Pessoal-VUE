<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/store'
import { coverFor } from '../utils/cover'
import { formatPrice } from '../utils/format'
import { categories } from '../data/books'
import StarRating from './StarRating.vue'

const props = defineProps({
  book: { type: Object, required: true }
})

const router = useRouter()
const cartStore = useCartStore()

const cover = computed(() => coverFor(props.book))
const category = computed(() =>
  categories.find((c) => c.id === props.book.categoria)
)
const isFav = computed(() => cartStore.isFavorite(props.book.id))

const openDetail = () => router.push(`/livro/${props.book.id}`)
const toggleFavorite = (event) => {
  event.stopPropagation()
  cartStore.toggleFavorite(props.book)
}
const addToCart = (event) => {
  event.stopPropagation()
  cartStore.addItem({
    id: props.book.id,
    titulo: props.book.titulo,
    autor: props.book.autor,
    preco: props.book.preco,
    img: props.book.img
  })
}
</script>

<template>
  <article class="book-card" @click="openDetail">
    <div class="cover-wrap">
      <img :src="cover" :alt="book.titulo" class="cover" loading="lazy" />
      <button
        class="fav-btn"
        :class="{ active: isFav }"
        :aria-label="isFav ? 'Remover dos curtidos' : 'Adicionar aos curtidos'"
        @click="toggleFavorite"
      >
        <span class="mdi" :class="isFav ? 'mdi-heart' : 'mdi-heart-outline'"></span>
      </button>
      <span v-if="category" class="cat-chip">{{ category.nome }}</span>
    </div>

    <div class="card-body">
      <div class="rating-row">
        <StarRating :value="book.rating" :size="14" />
        <span class="rating-value">{{ book.rating.toFixed(1) }}</span>
      </div>
      <h3 class="title">{{ book.titulo }}</h3>
      <p class="author">por {{ book.autor }}</p>
      <p class="price">{{ formatPrice(book.preco) }}</p>
      <button class="btn btn-primary buy-btn" @click="addToCart">
        <span class="mdi mdi-cart-plus"></span>
        Adicionar
      </button>
    </div>
  </article>
</template>

<style scoped>
.book-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  display: flex;
  flex-direction: column;
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.cover-wrap {
  position: relative;
  padding: 14px 14px 0;
}

.cover {
  width: 100%;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  border-radius: var(--radius-sm);
  background: var(--color-surface-2);
  box-shadow: var(--shadow-sm);
}

.fav-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.92);
  color: var(--color-muted);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.fav-btn:hover {
  transform: scale(1.1);
}

.fav-btn.active {
  color: var(--color-danger);
}

.cat-chip {
  position: absolute;
  left: 20px;
  bottom: 8px;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #fff;
  background: rgba(12, 10, 9, 0.55);
  backdrop-filter: blur(4px);
  padding: 3px 9px;
  border-radius: var(--radius-full);
}

.card-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 14px 16px 16px;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.rating-value {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-ink-soft);
}

.title {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.98rem;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 4px;
}

.author {
  color: var(--color-muted);
  font-size: 0.84rem;
  margin-bottom: 10px;
}

.price {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-primary-dark);
  margin-top: auto;
  margin-bottom: 12px;
}

.buy-btn {
  width: 100%;
  padding: 10px 16px;
  font-size: 0.9rem;
}
</style>
