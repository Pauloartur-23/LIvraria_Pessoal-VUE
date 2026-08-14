<script setup>
import { computed } from 'vue'
import { useCartStore } from '../stores/store'
import BookCard from '../components/BookCard.vue'

const cartStore = useCartStore()

const favorites = computed(() => cartStore.favorites)
</script>

<template>
  <main class="like page container">
    <div class="page-head">
      <div>
        <p class="page-eyebrow">Sua lista</p>
        <h1>Livros curtidos</h1>
        <p class="page-sub">
          {{ favorites.length }} {{ favorites.length === 1 ? 'título salvo' : 'títulos salvos' }}
        </p>
      </div>
    </div>

    <div v-if="favorites.length === 0" class="empty-state">
      <div class="empty-icon"><span class="mdi mdi-heart-outline"></span></div>
      <h2>Você ainda não curtiu nenhum livro</h2>
      <p>Toque no coração de um livro para salvá-lo aqui e encontrá-lo facilmente depois.</p>
      <RouterLink to="/livros" class="btn btn-primary">
        <span class="mdi mdi-store-outline"></span>
        Explorar livros
      </RouterLink>
    </div>

    <div v-else class="book-grid">
      <BookCard v-for="book in favorites" :key="book.id" :book="book" />
    </div>
  </main>
</template>

<style scoped>
.like {
  padding-top: 48px;
  padding-bottom: 40px;
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

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 32px;
}
</style>
