<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '../stores/store'
import { formatPrice } from '../utils/format'
import { coverFor } from '../utils/cover'

const route = useRoute()
const cartStore = useCartStore()

const order = computed(() => {
  const id = route.query.id
  if (id) return cartStore.orders.find((o) => o.id === id) || cartStore.lastOrder
  return cartStore.lastOrder
})

const deliveryEstimate = computed(() => {
  if (!order.value) return ''
  const date = new Date(order.value.data)
  date.setDate(date.getDate() + 5)
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long'
  })
})

const paymentLabel = computed(() => {
  switch (order.value?.paymentMethod) {
    case 'pix':
      return 'PIX'
    case 'boleto':
      return 'Boleto bancário'
    default:
      return `Cartão final ${order.value.cardLast4 || '••••'}`
  }
})
</script>

<template>
  <main class="success page container">
    <div v-if="order" class="card">
      <div class="success-icon">
        <span class="mdi mdi-check"></span>
      </div>

      <h1>Pedido confirmado!</h1>
      <p class="lead">
        Obrigado pela sua compra. Em instantes você receberá a confirmação no e-mail.
      </p>

      <div class="order-meta">
        <div>
          <span class="mdi mdi-receipt-text-outline"></span>
          <p><small>Número do pedido</small><strong>{{ order.id }}</strong></p>
        </div>
        <div>
          <span class="mdi mdi-credit-card-outline"></span>
          <p><small>Pagamento</small><strong>{{ paymentLabel }}</strong></p>
        </div>
        <div>
          <span class="mdi mdi-truck-fast"></span>
          <p><small>Previsão de entrega</small><strong class="cap">{{ deliveryEstimate }}</strong></p>
        </div>
      </div>

      <section class="items">
        <h2>Itens do pedido</h2>
        <ul>
          <li v-for="item in order.items" :key="item.id">
            <img :src="coverFor(item)" :alt="item.titulo" />
            <div class="item-info">
              <p>{{ item.titulo }}</p>
              <span>{{ item.quantity }}x {{ formatPrice(item.preco) }}</span>
            </div>
            <strong>{{ formatPrice(item.preco * item.quantity) }}</strong>
          </li>
        </ul>

        <div class="totals">
          <p>
            <span>Subtotal</span>
            <strong>{{ formatPrice(order.subtotal) }}</strong>
          </p>
          <p v-if="order.discount > 0">
            <span>Desconto ({{ order.discountCode }})</span>
            <strong class="discount">-{{ formatPrice(order.subtotal * order.discount) }}</strong>
          </p>
          <p>
            <span>Frete</span>
            <strong class="free">Grátis</strong>
          </p>
          <p class="total">
            <span>Total pago</span>
            <strong>{{ formatPrice(order.total) }}</strong>
          </p>
        </div>
      </section>

      <section class="address">
        <h2>Endereço de entrega</h2>
        <p>
          {{ order.address.nome }}<br>
          {{ order.address.endereco }}, {{ order.address.numero }}
          <template v-if="order.address.complemento"> — {{ order.address.complemento }}</template><br>
          {{ order.address.cidade }} - {{ order.address.estado }}, CEP {{ order.address.cep }}
        </p>
      </section>

      <div class="actions">
        <RouterLink to="/livros" class="btn btn-primary">
          <span class="mdi mdi-store-outline"></span>
          Continuar comprando
        </RouterLink>
        <RouterLink to="/" class="btn btn-outline">
          <span class="mdi mdi-home-outline"></span>
          Voltar ao início
        </RouterLink>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon"><span class="mdi mdi-receipt-text-outline"></span></div>
      <h2>Nenhum pedido encontrado</h2>
      <p>Você ainda não finalizou nenhuma compra.</p>
      <RouterLink to="/livros" class="btn btn-primary">Explorar livros</RouterLink>
    </div>
  </main>
</template>

<style scoped>
.success {
  padding-top: 56px;
  padding-bottom: 40px;
}

.card {
  max-width: 720px;
  margin: 0 auto;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 48px 40px;
  text-align: center;
}

.success-icon {
  width: 84px;
  height: 84px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: var(--color-success);
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 2.6rem;
  box-shadow: 0 0 0 10px rgba(22, 163, 74, 0.12);
}

.card h1 {
  font-size: clamp(1.7rem, 4vw, 2.3rem);
  margin-bottom: 10px;
}

.lead {
  color: var(--color-muted);
  margin-bottom: 28px;
}

.order-meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  background: var(--color-bg);
  border-radius: var(--radius);
  padding: 18px;
  margin-bottom: 30px;
}

.order-meta > div {
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
}

.order-meta .mdi {
  font-size: 1.6rem;
  color: var(--color-primary);
}

.order-meta small {
  display: block;
  font-size: 0.72rem;
  color: var(--color-muted);
}

.order-meta strong {
  font-size: 0.9rem;
  line-height: 1.3;
}

.order-meta .cap {
  text-transform: capitalize;
}

/* Items */
.items,
.address {
  text-align: left;
  border-top: 1px solid var(--color-border);
  padding-top: 24px;
  margin-top: 24px;
}

.items h2,
.address h2 {
  font-size: 1.15rem;
  margin-bottom: 16px;
}

.items ul li {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-surface-2);
}

.items img {
  width: 44px;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  border-radius: 4px;
  background: var(--color-surface-2);
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-info p {
  font-weight: 600;
  font-size: 0.92rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-info span {
  font-size: 0.8rem;
  color: var(--color-muted);
}

.totals {
  padding-top: 16px;
}

.totals p {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 0.92rem;
  color: var(--color-ink-soft);
}

.totals p.total {
  border-top: 1px dashed var(--color-border);
  margin-top: 8px;
  padding-top: 14px;
}

.totals p.total span {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
}

.totals p.total strong {
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--color-primary-dark);
}

.totals .discount,
.totals .free {
  color: var(--color-success);
}

.address p {
  color: var(--color-ink-soft);
  line-height: 1.8;
  font-size: 0.95rem;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 32px;
}

@media (max-width: 640px) {
  .card {
    padding: 32px 22px;
  }

  .order-meta {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-direction: column;
  }
}
</style>
