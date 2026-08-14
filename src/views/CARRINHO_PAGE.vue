<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useCartStore } from '../stores/store'
import { formatPrice } from '../utils/format'
import { coverFor } from '../utils/cover'

const cartStore = useCartStore()
const router = useRouter()
const couponCode = ref('')
const couponMessage = ref('')

const updateQuantity = (itemId, newQuantity) => {
  if (newQuantity > 0) {
    cartStore.updateQuantity(itemId, newQuantity)
  } else {
    cartStore.removeItem(itemId)
  }
}

const lineTotal = (item) => item.preco * item.quantity

const applyCoupon = () => {
  const code = couponCode.value.trim()
  if (!code) {
    couponMessage.value = 'Digite um cupom para aplicar.'
    return
  }
  if (cartStore.applyCoupon(code)) {
    couponMessage.value = ''
  } else {
    couponMessage.value = 'Cupom inválido. Tente Kennedy10 ou Eduardo20.'
  }
}

const removeCoupon = () => {
  cartStore.removeCoupon()
  couponCode.value = ''
  couponMessage.value = ''
}
</script>

<template>
  <main class="cart page container">
    <div class="page-head">
      <div>
        <p class="page-eyebrow">Revise seus itens</p>
        <h1>Seu carrinho</h1>
        <p class="page-sub">
          {{ cartStore.count }} {{ cartStore.count === 1 ? 'item' : 'itens' }}
        </p>
      </div>
    </div>

    <div v-if="cartStore.items.length === 0" class="empty-state">
      <div class="empty-icon"><span class="mdi mdi-cart-off"></span></div>
      <h2>Seu carrinho está vazio</h2>
      <p>Que tal explorar nossa coleção e escolher o próximo livro da sua estante?</p>
      <RouterLink to="/livros" class="btn btn-primary">
        <span class="mdi mdi-store-outline"></span>
        Explorar livros
      </RouterLink>
    </div>

    <div v-else class="cart-layout">
      <!-- Items -->
      <div class="items-col">
        <div class="items-head">
          <span>Produto</span>
          <span>Preço</span>
          <span>Qtd.</span>
          <span>Total</span>
          <span></span>
        </div>

        <ul class="item-list">
          <li v-for="item in cartStore.items" :key="item.id" class="cart-item">
            <RouterLink :to="`/livro/${item.id}`" class="item-cover">
              <img :src="coverFor(item)" :alt="item.titulo" />
            </RouterLink>

            <div class="item-info">
              <RouterLink :to="`/livro/${item.id}`" class="item-title">
                {{ item.titulo }}
              </RouterLink>
              <p class="item-author">{{ item.autor }}</p>
              <button class="item-remove" @click="cartStore.removeItem(item.id)">
                <span class="mdi mdi-trash-can-outline"></span>
                Remover
              </button>
            </div>

            <p class="item-price">{{ formatPrice(item.preco) }}</p>

            <div class="qty">
              <button
                class="qty-btn"
                aria-label="Diminuir"
                @click="updateQuantity(item.id, item.quantity - 1)"
              >
                <span class="mdi mdi-minus"></span>
              </button>
              <span class="qty-value">{{ item.quantity }}</span>
              <button
                class="qty-btn"
                aria-label="Aumentar"
                @click="updateQuantity(item.id, item.quantity + 1)"
              >
                <span class="mdi mdi-plus"></span>
              </button>
            </div>

            <p class="item-total">{{ formatPrice(lineTotal(item)) }}</p>

            <button
              class="item-remove-mobile"
              aria-label="Remover"
              @click="cartStore.removeItem(item.id)"
            >
              <span class="mdi mdi-close"></span>
            </button>
          </li>
        </ul>

        <RouterLink to="/livros" class="continue-link">
          <span class="mdi mdi-arrow-left"></span>
          Continuar comprando
        </RouterLink>
      </div>

      <!-- Summary -->
      <aside class="summary">
        <h2>Resumo do pedido</h2>

        <div class="coupon">
          <div v-if="!cartStore.discount" class="coupon-row">
            <input
              v-model="couponCode"
              type="text"
              placeholder="Código do cupom"
              @keyup.enter="applyCoupon"
            />
            <button class="coupon-apply" @click="applyCoupon">Aplicar</button>
          </div>
          <div v-else class="coupon-active">
            <span class="mdi mdi-ticket-confirmation"></span>
            <div>
              <strong>{{ cartStore.discountCode }}</strong>
              <small>-{{ formatPrice(cartStore.discountValue) }}</small>
            </div>
            <button class="coupon-remove" aria-label="Remover cupom" @click="removeCoupon">
              <span class="mdi mdi-close"></span>
            </button>
          </div>
          <p v-if="couponMessage" class="coupon-msg">{{ couponMessage }}</p>
        </div>

        <ul class="totals">
          <li>
            <span>Subtotal</span>
            <strong>{{ formatPrice(cartStore.subtotal) }}</strong>
          </li>
          <li v-if="cartStore.discount > 0">
            <span>Desconto ({{ cartStore.discountCode }})</span>
            <strong class="discount">-{{ formatPrice(cartStore.discountValue) }}</strong>
          </li>
          <li>
            <span>Frete</span>
            <strong class="free">Grátis</strong>
          </li>
          <li class="total">
            <span>Total</span>
            <strong>{{ formatPrice(cartStore.totalPrice) }}</strong>
          </li>
        </ul>

        <button class="btn btn-primary checkout-btn" @click="router.push('/checkout')">
          Finalizar compra
          <span class="mdi mdi-arrow-right"></span>
        </button>
        <p class="secure-note">
          <span class="mdi mdi-shield-lock"></span>
          Compra segura e protegida
        </p>
      </aside>
    </div>
  </main>
</template>

<style scoped>
.cart {
  padding-top: 48px;
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

.cart-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 32px;
  align-items: start;
  margin-top: 32px;
}

/* Items */
.items-head {
  display: grid;
  grid-template-columns: 1.6fr 0.7fr 0.6fr 0.7fr 40px;
  gap: 16px;
  padding: 0 0 12px;
  border-bottom: 1px solid var(--color-border);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-muted);
}

.item-list {
  display: flex;
  flex-direction: column;
}

.cart-item {
  display: grid;
  grid-template-columns: 72px 1.6fr 0.7fr 0.6fr 0.7fr 40px;
  gap: 16px;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid var(--color-border);
}

.item-cover img {
  width: 72px;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: var(--shadow-sm);
  background: var(--color-surface-2);
}

.item-title {
  display: block;
  font-weight: 600;
  font-size: 0.98rem;
  line-height: 1.35;
  transition: color 0.2s ease;
}

.item-title:hover {
  color: var(--color-primary);
}

.item-author {
  color: var(--color-muted);
  font-size: 0.82rem;
  margin: 3px 0 8px;
}

.item-remove {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: var(--color-muted);
  transition: color 0.2s ease;
}

.item-remove:hover {
  color: var(--color-danger);
}

.item-price,
.item-total {
  font-weight: 600;
}

.item-total {
  font-family: var(--font-display);
  font-size: 1.05rem;
  color: var(--color-primary-dark);
}

.qty {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--color-surface);
}

.qty-btn {
  width: 34px;
  height: 38px;
  display: grid;
  place-items: center;
  color: var(--color-ink-soft);
  transition: background 0.2s ease;
}

.qty-btn:hover {
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
}

.qty-value {
  min-width: 30px;
  text-align: center;
  font-weight: 700;
  font-size: 0.95rem;
}

.item-remove-mobile {
  display: none;
  color: var(--color-muted);
}

.continue-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
  font-weight: 600;
  font-size: 0.92rem;
  color: var(--color-ink-soft);
  transition: color 0.2s ease;
}

.continue-link:hover {
  color: var(--color-primary);
}

/* Summary */
.summary {
  position: sticky;
  top: calc(var(--header-height) + 24px);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 26px;
}

.summary h2 {
  font-size: 1.25rem;
  margin-bottom: 20px;
}

.coupon-row {
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
}

.coupon-row input {
  flex: 1;
  padding: 11px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
}

.coupon-row input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.coupon-apply {
  padding: 0 16px;
  border-radius: var(--radius-sm);
  background: var(--color-ink);
  color: #fff;
  font-weight: 600;
  font-size: 0.88rem;
  transition: background 0.2s ease;
}

.coupon-apply:hover {
  background: #000;
}

.coupon-active {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--color-primary-light);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  margin-bottom: 18px;
}

.coupon-active > .mdi {
  font-size: 1.5rem;
  color: var(--color-primary);
}

.coupon-active strong {
  display: block;
  font-size: 0.9rem;
  color: var(--color-primary-dark);
}

.coupon-active small {
  color: var(--color-primary);
  font-weight: 600;
}

.coupon-remove {
  margin-left: auto;
  color: var(--color-muted);
}

.coupon-msg {
  font-size: 0.82rem;
  color: var(--color-danger);
  margin: -8px 0 14px;
}

.totals {
  border-top: 1px solid var(--color-border);
}

.totals li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  font-size: 0.94rem;
  color: var(--color-ink-soft);
}

.totals li.total {
  border-top: 1px dashed var(--color-border);
  margin-top: 6px;
  padding-top: 16px;
}

.totals li.total span {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-ink);
}

.totals li.total strong {
  font-family: var(--font-display);
  font-size: 1.6rem;
  color: var(--color-primary-dark);
}

.totals .discount {
  color: var(--color-success);
}

.totals .free {
  color: var(--color-success);
}

.checkout-btn {
  width: 100%;
  padding: 15px;
  margin-top: 18px;
}

.secure-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 14px;
  font-size: 0.8rem;
  color: var(--color-muted);
}

/* Responsive */
@media (max-width: 960px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }

  .summary {
    position: static;
  }

  .items-head {
    display: none;
  }

  .cart-item {
    grid-template-columns: 72px 1fr auto;
    grid-template-areas:
      'cover info qty'
      'cover total remove';
    row-gap: 10px;
  }

  .item-cover {
    grid-area: cover;
  }

  .item-info {
    grid-area: info;
  }

  .qty {
    grid-area: qty;
    justify-self: end;
  }

  .item-total {
    grid-area: total;
  }

  .item-remove-mobile {
    grid-area: remove;
    justify-self: end;
    display: grid;
  }

  .item-price {
    display: none;
  }

  .item-remove {
    display: none;
  }
}
</style>
