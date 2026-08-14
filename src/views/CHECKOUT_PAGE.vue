<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/store'
import { formatPrice } from '../utils/format'
import { coverFor } from '../utils/cover'

const cartStore = useCartStore()
const router = useRouter()

const paymentMethod = ref('cartao')
const processing = ref(false)
const errors = reactive({})

const address = reactive({
  nome: '',
  email: '',
  telefone: '',
  cep: '',
  endereco: '',
  numero: '',
  complemento: '',
  cidade: '',
  estado: ''
})

const card = reactive({
  numero: '',
  nome: '',
  validade: '',
  cvv: ''
})

onMounted(() => {
  if (cartStore.items.length === 0) {
    router.replace('/carrinho')
  }
})

const paymentMethods = [
  { id: 'cartao', label: 'Cartão de crédito', mdi: 'mdi-credit-card-outline' },
  { id: 'pix', label: 'PIX', mdi: 'mdi-qrcode' },
  { id: 'boleto', label: 'Boleto bancário', mdi: 'mdi-barcode-scan' }
]

const validate = () => {
  Object.keys(errors).forEach((k) => delete errors[k])

  if (!address.nome.trim()) errors.nome = 'Informe seu nome completo.'
  if (!address.email.trim() || !/\S+@\S+\.\S+/.test(address.email)) {
    errors.email = 'Informe um e-mail válido.'
  }
  if (!address.cep.trim()) errors.cep = 'Informe o CEP.'
  if (!address.endereco.trim()) errors.endereco = 'Informe o endereço.'
  if (!address.numero.trim()) errors.numero = 'Informe o número.'
  if (!address.cidade.trim()) errors.cidade = 'Informe a cidade.'
  if (!address.estado.trim()) errors.estado = 'Informe o estado.'

  if (paymentMethod.value === 'cartao') {
    const digits = card.numero.replace(/\D/g, '')
    if (digits.length < 13) errors.cardNumero = 'Número do cartão inválido.'
    if (!card.nome.trim()) errors.cardNome = 'Informe o nome impresso no cartão.'
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.validade)) {
      errors.cardValidade = 'Use o formato MM/AA.'
    }
    if (card.cvv.trim().length < 3) errors.cardCvv = 'CVV inválido.'
  }

  return Object.keys(errors).length === 0
}

const confirmOrder = () => {
  if (!validate()) return
  processing.value = true

  const order = {
    items: cartStore.items,
    subtotal: cartStore.subtotal,
    discount: cartStore.discount,
    discountCode: cartStore.discountCode,
    total: cartStore.totalPrice,
    paymentMethod: paymentMethod.value,
    address: { ...address },
    cardLast4: paymentMethod.value === 'cartao'
      ? card.numero.replace(/\D/g, '').slice(-4)
      : ''
  }

  setTimeout(() => {
    const placed = cartStore.placeOrder(order)
    router.push({ path: '/pedido-confirmado', query: { id: placed.id } })
  }, 1200)
}

const formatCardNumber = (event) => {
  const digits = event.target.value.replace(/\D/g, '').slice(0, 16)
  card.numero = digits.replace(/(\d{4})(?=\d)/g, '$1 ')
}

const formatValidade = (event) => {
  const digits = event.target.value.replace(/\D/g, '').slice(0, 4)
  card.validade = digits.replace(/(\d{2})(?=\d)/, '$1/')
}

const formatCvv = (event) => {
  card.cvv = event.target.value.replace(/\D/g, '').slice(0, 4)
}
</script>

<template>
  <main class="checkout page container">
    <div class="page-head">
      <div>
        <p class="page-eyebrow">Quase lá</p>
        <h1>Finalizar compra</h1>
      </div>
    </div>

    <div class="checkout-layout">
      <!-- Form -->
      <form class="form-col" @submit.prevent="confirmOrder">
        <!-- Entrega -->
        <section class="form-section">
          <div class="section-title">
            <span class="step">1</span>
            <h2>Dados de entrega</h2>
          </div>

          <div class="grid-2">
            <div class="field" :class="{ invalid: errors.nome }">
              <label>Nome completo *</label>
              <input v-model="address.nome" type="text" placeholder="Seu nome" />
              <p v-if="errors.nome" class="error-msg">{{ errors.nome }}</p>
            </div>
            <div class="field" :class="{ invalid: errors.email }">
              <label>E-mail *</label>
              <input v-model="address.email" type="email" placeholder="voce@email.com" />
              <p v-if="errors.email" class="error-msg">{{ errors.email }}</p>
            </div>
          </div>

          <div class="grid-2">
            <div class="field" :class="{ invalid: errors.telefone }">
              <label>Telefone</label>
              <input v-model="address.telefone" type="tel" placeholder="(00) 00000-0000" />
            </div>
            <div class="field" :class="{ invalid: errors.cep }">
              <label>CEP *</label>
              <input v-model="address.cep" type="text" placeholder="00000-000" />
              <p v-if="errors.cep" class="error-msg">{{ errors.cep }}</p>
            </div>
          </div>

          <div class="field" :class="{ invalid: errors.endereco }">
            <label>Endereço *</label>
            <input v-model="address.endereco" type="text" placeholder="Rua, avenida..." />
            <p v-if="errors.endereco" class="error-msg">{{ errors.endereco }}</p>
          </div>

          <div class="grid-2">
            <div class="field" :class="{ invalid: errors.numero }">
              <label>Número *</label>
              <input v-model="address.numero" type="text" placeholder="123" />
              <p v-if="errors.numero" class="error-msg">{{ errors.numero }}</p>
            </div>
            <div class="field">
              <label>Complemento</label>
              <input v-model="address.complemento" type="text" placeholder="Apto, bloco..." />
            </div>
          </div>

          <div class="grid-2">
            <div class="field" :class="{ invalid: errors.cidade }">
              <label>Cidade *</label>
              <input v-model="address.cidade" type="text" placeholder="Sua cidade" />
              <p v-if="errors.cidade" class="error-msg">{{ errors.cidade }}</p>
            </div>
            <div class="field" :class="{ invalid: errors.estado }">
              <label>Estado *</label>
              <select v-model="address.estado">
                <option value="" disabled>Selecione</option>
                <option>AC</option><option>AL</option><option>AP</option><option>AM</option>
                <option>BA</option><option>CE</option><option>DF</option><option>ES</option>
                <option>GO</option><option>MA</option><option>MT</option><option>MS</option>
                <option>MG</option><option>PA</option><option>PB</option><option>PR</option>
                <option>PE</option><option>PI</option><option>RJ</option><option>RN</option>
                <option>RS</option><option>RO</option><option>RR</option><option>SC</option>
                <option>SP</option><option>SE</option><option>TO</option>
              </select>
              <p v-if="errors.estado" class="error-msg">{{ errors.estado }}</p>
            </div>
          </div>
        </section>

        <!-- Pagamento -->
        <section class="form-section">
          <div class="section-title">
            <span class="step">2</span>
            <h2>Pagamento</h2>
          </div>

          <div class="pay-methods">
            <button
              v-for="pm in paymentMethods"
              :key="pm.id"
              type="button"
              class="pay-method"
              :class="{ active: paymentMethod === pm.id }"
              @click="paymentMethod = pm.id"
            >
              <span class="mdi" :class="pm.mdi"></span>
              {{ pm.label }}
              <span class="radio" :class="{ checked: paymentMethod === pm.id }"></span>
            </button>
          </div>

          <div v-if="paymentMethod === 'cartao'" class="card-fields">
            <div class="field" :class="{ invalid: errors.cardNumero }">
              <label>Número do cartão *</label>
              <input
                :value="card.numero"
                type="text"
                inputmode="numeric"
                placeholder="0000 0000 0000 0000"
                @input="formatCardNumber"
              />
              <p v-if="errors.cardNumero" class="error-msg">{{ errors.cardNumero }}</p>
            </div>
            <div class="field" :class="{ invalid: errors.cardNome }">
              <label>Nome impresso no cartão *</label>
              <input v-model="card.nome" type="text" placeholder="Como está no cartão" />
              <p v-if="errors.cardNome" class="error-msg">{{ errors.cardNome }}</p>
            </div>
            <div class="grid-2">
              <div class="field" :class="{ invalid: errors.cardValidade }">
                <label>Validade *</label>
                <input
                  :value="card.validade"
                  type="text"
                  inputmode="numeric"
                  placeholder="MM/AA"
                  @input="formatValidade"
                />
                <p v-if="errors.cardValidade" class="error-msg">{{ errors.cardValidade }}</p>
              </div>
              <div class="field" :class="{ invalid: errors.cardCvv }">
                <label>CVV *</label>
                <input
                  :value="card.cvv"
                  type="password"
                  inputmode="numeric"
                  placeholder="123"
                  @input="formatCvv"
                />
                <p v-if="errors.cardCvv" class="error-msg">{{ errors.cardCvv }}</p>
              </div>
            </div>
          </div>

          <p v-else-if="paymentMethod === 'pix'" class="pay-note">
            <span class="mdi mdi-qrcode-scan"></span>
            O código PIX será gerado após a confirmação do pedido.
          </p>
          <p v-else class="pay-note">
            <span class="mdi mdi-file-document-outline"></span>
            O boleto será enviado para o seu e-mail após a confirmação.
          </p>
        </section>
      </form>

      <!-- Summary -->
      <aside class="summary">
        <h2>Resumo do pedido</h2>
        <ul class="summary-items">
          <li v-for="item in cartStore.items" :key="item.id" class="summary-item">
            <img :src="coverFor(item)" :alt="item.titulo" />
            <div>
              <p>{{ item.titulo }}</p>
              <span>{{ item.quantity }}x {{ formatPrice(item.preco) }}</span>
            </div>
            <strong>{{ formatPrice(item.preco * item.quantity) }}</strong>
          </li>
        </ul>

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

        <button
          class="btn btn-primary confirm-btn"
          :disabled="processing"
          @click="confirmOrder"
        >
          <span v-if="processing" class="spinner"></span>
          <span v-if="processing" class="mdi mdi-lock-outline"></span>
          {{ processing ? 'Processando pagamento...' : `Confirmar pagamento` }}
        </button>
        <RouterLink to="/carrinho" class="back-link">
          <span class="mdi mdi-arrow-left"></span>
          Voltar ao carrinho
        </RouterLink>
      </aside>
    </div>
  </main>
</template>

<style scoped>
.checkout {
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
}

.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 32px;
  align-items: start;
  margin-top: 32px;
}

/* Form */
.form-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 26px;
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 22px;
}

.step {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  display: grid;
  place-items: center;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.95rem;
}

.section-title h2 {
  font-size: 1.25rem;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.field {
  margin-bottom: 16px;
}

.field:last-child {
  margin-bottom: 0;
}

.field.invalid input,
.field.invalid select {
  border-color: var(--color-danger);
}

/* Payment methods */
.pay-methods {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.pay-method {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--color-ink-soft);
  transition: all 0.2s ease;
}

.pay-method .mdi {
  font-size: 1.4rem;
  color: var(--color-muted);
}

.pay-method:hover {
  border-color: var(--color-primary);
}

.pay-method.active {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
}

.pay-method.active .mdi {
  color: var(--color-primary);
}

.radio {
  width: 18px;
  height: 18px;
  margin-left: auto;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  transition: all 0.2s ease;
}

.radio.checked {
  border-color: var(--color-primary);
  box-shadow: inset 0 0 0 4px var(--color-primary);
}

.card-fields {
  background: var(--color-bg);
  border-radius: var(--radius-sm);
  padding: 18px;
}

.pay-note {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
  font-size: 0.92rem;
}

.pay-note .mdi {
  font-size: 1.4rem;
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
  margin-bottom: 18px;
}

.summary-items {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 8px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-surface-2);
}

.summary-item img {
  width: 44px;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  border-radius: 4px;
  background: var(--color-surface-2);
}

.summary-item div {
  flex: 1;
  min-width: 0;
}

.summary-item p {
  font-size: 0.86rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.summary-item span {
  font-size: 0.78rem;
  color: var(--color-muted);
}

.summary-item strong {
  font-size: 0.9rem;
}

.totals {
  border-top: 1px solid var(--color-border);
}

.totals li {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-size: 0.92rem;
  color: var(--color-ink-soft);
}

.totals li.total {
  border-top: 1px dashed var(--color-border);
  margin-top: 6px;
  padding-top: 14px;
}

.totals li.total span {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
}

.totals li.total strong {
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--color-primary-dark);
}

.totals .discount {
  color: var(--color-success);
}

.totals .free {
  color: var(--color-success);
}

.confirm-btn {
  width: 100%;
  padding: 15px;
  margin-top: 16px;
  gap: 10px;
}

.back-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 14px;
  font-size: 0.88rem;
  color: var(--color-muted);
  transition: color 0.2s ease;
}

.back-link:hover {
  color: var(--color-primary);
}

.spinner {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 960px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }

  .summary {
    position: static;
  }
}

@media (max-width: 560px) {
  .grid-2 {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>
