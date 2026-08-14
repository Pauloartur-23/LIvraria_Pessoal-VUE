import { defineStore } from 'pinia'

const loadFromStorage = (key, fallback) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : fallback
  } catch {
    return fallback
  }
}

const saveToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const normalizePrice = (price) => {
  if (typeof price === 'number') return price
  return parseFloat(String(price).replace('R$', '').replace('.', '').replace(',', '.')) || 0
}

const normalizeItem = (item) => ({
  ...item,
  quantity: item.quantity || 1,
  preco: normalizePrice(item.preco)
})

let toastSeq = 0

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: loadFromStorage('cart-items', []).map(normalizeItem),
    favorites: loadFromStorage('cart-favorites', []).map((fav) => ({
      ...fav,
      preco: normalizePrice(fav.preco)
    })),
    orders: loadFromStorage('cart-orders', []),
    discount: 0,
    discountCode: '',
    toasts: []
  }),

  getters: {
    count(state) {
      return state.items.reduce((total, item) => total + item.quantity, 0)
    },

    subtotal(state) {
      return state.items.reduce((total, item) => total + item.preco * item.quantity, 0)
    },

    discountValue(state) {
      return this.subtotal * state.discount
    },

    totalPrice() {
      return this.subtotal - this.discountValue
    },

    favoritesCount(state) {
      return state.favorites.length
    },

    isFavorite: (state) => (id) =>
      state.favorites.some((fav) => String(fav.id) === String(id)),

    lastOrder(state) {
      return state.orders[0] || null
    }
  },

  actions: {
    /* ---------------- Toasts ---------------- */
    addToast(message, type = 'success') {
      const id = ++toastSeq
      this.toasts.push({ id, message, type })
      setTimeout(() => this.removeToast(id), 3200)
    },

    removeToast(id) {
      this.toasts = this.toasts.filter((t) => t.id !== id)
    },

    /* ---------------- Carrinho ---------------- */
    addItem(item) {
      const normalized = normalizeItem(item)
      const existing = this.items.find((i) => String(i.id) === String(normalized.id))
      if (existing) {
        existing.quantity += normalized.quantity || 1
      } else {
        this.items.push(normalized)
      }
      saveToStorage('cart-items', this.items)
      this.addToast(`"${normalized.titulo}" adicionado ao carrinho`, 'success')
    },

    removeItem(itemId) {
      this.items = this.items.filter((item) => String(item.id) !== String(itemId))
      saveToStorage('cart-items', this.items)
    },

    updateQuantity(itemId, newQuantity) {
      const item = this.items.find((i) => String(i.id) === String(itemId))
      if (!item) return
      if (newQuantity <= 0) {
        this.removeItem(itemId)
        return
      }
      item.quantity = newQuantity
      saveToStorage('cart-items', this.items)
    },

    clearCart() {
      this.items = []
      saveToStorage('cart-items', this.items)
    },

    /* ---------------- Cupons ---------------- */
    applyCoupon(code) {
      const coupons = {
        Kennedy10: 0.1,
        Eduardo20: 0.2
      }
      const key = Object.keys(coupons).find(
        (k) => k.toLowerCase() === String(code).trim().toLowerCase()
      )
      if (key) {
        this.discount = coupons[key]
        this.discountCode = key
        this.addToast('Cupom aplicado com sucesso!', 'success')
        return true
      }
      return false
    },

    removeCoupon() {
      this.discount = 0
      this.discountCode = ''
    },

    /* ---------------- Curtidas ---------------- */
    toggleFavorite(book) {
      const exists = this.favorites.find((fav) => String(fav.id) === String(book.id))
      if (exists) {
        this.favorites = this.favorites.filter(
          (fav) => String(fav.id) !== String(book.id)
        )
        this.addToast(`"${book.titulo}" removido dos curtidos`, 'info')
      } else {
        this.favorites.push({ ...book, isFavorite: true })
        this.addToast(`"${book.titulo}" salvo nos curtidos`, 'success')
      }
      saveToStorage('cart-favorites', this.favorites)
    },

    removeItemLike(favoriteId) {
      this.favorites = this.favorites.filter(
        (fav) => String(fav.id) !== String(favoriteId)
      )
      saveToStorage('cart-favorites', this.favorites)
    },

    /* ---------------- Pedidos ---------------- */
    placeOrder(order) {
      const newOrder = {
        ...order,
        id: `IF-${Date.now().toString().slice(-6)}`,
        data: new Date().toISOString()
      }
      this.orders.unshift(newOrder)
      saveToStorage('cart-orders', this.orders)
      this.clearCart()
      return newOrder
    }
  }
})
