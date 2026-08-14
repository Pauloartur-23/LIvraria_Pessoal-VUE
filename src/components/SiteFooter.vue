<script setup>
import { ref } from 'vue'
import { useCartStore } from '../stores/store'
import { categories } from '../data/books'
import paypalImg from './img-app.vue/paipal.png'
import mastercardImg from './img-app.vue/MasterCard.png'
import visaImg from './img-app.vue/VISA.png'

const cartStore = useCartStore()
const email = ref('')

const subscribe = () => {
  if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
    cartStore.addToast('Informe um e-mail válido para se inscrever.', 'error')
    return
  }
  cartStore.addToast('Inscrição confirmada! Bem-vindo(a) à newsletter IFbooks.', 'success')
  email.value = ''
}
</script>

<template>
  <footer>
    <section id="newsletter" class="newsletter">
      <div class="container newsletter-inner">
        <div class="newsletter-text">
          <h2>Fique por dentro das novidades</h2>
          <p>Lançamentos, promoções e dicas de leitura direto no seu e-mail.</p>
        </div>
        <form class="newsletter-form" @submit.prevent="subscribe">
          <div class="newsletter-input">
            <span class="mdi mdi-email-outline"></span>
            <input v-model="email" type="email" placeholder="Seu melhor e-mail" />
          </div>
          <button type="submit" class="btn newsletter-btn">Inscrever</button>
        </form>
      </div>
    </section>

    <div class="footer-main">
      <div class="container footer-grid">
        <div class="footer-col brand">
          <RouterLink to="/" class="footer-logo">
            <span class="mdi mdi-book-open-page-variant"></span>
            <span>IFbooks</span>
          </RouterLink>
          <p>
            Livros novos, usados e seminovos de milhares de sebos e livrarias.
            Acreditamos que toda boa história merece um novo leitor.
          </p>
          <div class="social">
            <a href="#" aria-label="Facebook"><span class="mdi mdi-facebook"></span></a>
            <a href="#" aria-label="Instagram"><span class="mdi mdi-instagram"></span></a>
            <a href="#" aria-label="Twitter"><span class="mdi mdi-twitter"></span></a>
          </div>
        </div>

        <div class="footer-col">
          <h3>Categorias</h3>
          <RouterLink
            v-for="cat in categories"
            :key="cat.id"
            :to="{ path: '/livros', query: { categoria: cat.id } }"
            class="footer-link"
          >
            {{ cat.nome }}
          </RouterLink>
        </div>

        <div class="footer-col">
          <h3>Institucional</h3>
          <a href="#" class="footer-link">Sobre nós</a>
          <a href="#" class="footer-link">Termos de uso</a>
          <a href="#" class="footer-link">Política de privacidade</a>
          <a href="#" class="footer-link">Política de cookies</a>
          <a href="#" class="footer-link">Devoluções e reembolsos</a>
        </div>

        <div class="footer-col">
          <h3>Atendimento</h3>
          <div class="contact-line">
            <span class="mdi mdi-phone"></span>
            <span>+55 47 40045263</span>
          </div>
          <div class="contact-line">
            <span class="mdi mdi-clock-outline"></span>
            <span>8h às 23h · Seg a Sex</span>
          </div>
          <div class="contact-line">
            <span class="mdi mdi-email-outline"></span>
            <span>contato@ifbooks.com</span>
          </div>
          <div class="payments">
            <img :src="paypalImg" alt="PayPal" />
            <img :src="mastercardImg" alt="Mastercard" />
            <img :src="visaImg" alt="Visa" />
          </div>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} IFbooks · Alguns direitos reservados. Feito com <span class="mdi mdi-heart"></span> para leitores.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer {
  background: var(--color-ink);
  color: #d6d3d1;
  margin-top: 80px;
}

/* Newsletter */
.newsletter {
  background: var(--color-primary);
  padding: 48px 0;
}

.newsletter-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

.newsletter-text h2 {
  color: #fff;
  font-size: clamp(1.4rem, 2.5vw, 1.9rem);
  margin-bottom: 6px;
}

.newsletter-text p {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
}

.newsletter-form {
  display: flex;
  gap: 10px;
  min-width: 380px;
}

.newsletter-input {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  background: #fff;
  border-radius: var(--radius-sm);
  padding: 0 16px;
}

.newsletter-input span {
  color: var(--color-primary);
}

.newsletter-input input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 12px 0;
  font-size: 0.95rem;
}

.newsletter-input input:focus {
  outline: none;
}

.newsletter-btn {
  background: var(--color-ink);
  color: #fff;
}

.newsletter-btn:hover {
  background: #000;
}

/* Main */
.footer-main {
  padding: 56px 0 40px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
  gap: 40px;
}

.footer-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.6rem;
  color: #fff;
}

.footer-logo .mdi {
  font-size: 1.9rem;
  color: var(--color-primary);
}

.brand p {
  font-size: 0.9rem;
  color: #a8a29e;
  line-height: 1.7;
}

.social {
  display: flex;
  gap: 10px;
  margin-top: 18px;
}

.social a {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.08);
  color: #e7e5e4;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.social a:hover {
  background: var(--color-primary);
  color: #fff;
  transform: translateY(-2px);
}

.footer-col h3 {
  color: #fff;
  font-size: 1rem;
  margin-bottom: 18px;
}

.footer-link {
  display: block;
  padding: 5px 0;
  font-size: 0.9rem;
  color: #a8a29e;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #fff;
}

.contact-line {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
  font-size: 0.9rem;
  color: #a8a29e;
}

.contact-line .mdi {
  color: var(--color-primary);
  font-size: 1.1rem;
}

.payments {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.payments img {
  height: 34px;
  width: auto;
  border-radius: 4px;
  background: #fff;
  padding: 4px;
}

/* Bottom */
.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 20px 0;
}

.footer-bottom p {
  text-align: center;
  font-size: 0.82rem;
  color: #78716c;
}

.footer-bottom .mdi {
  color: var(--color-danger);
}

/* Responsive */
@media (max-width: 900px) {
  .newsletter-inner {
    flex-direction: column;
    align-items: flex-start;
  }

  .newsletter-form {
    min-width: 0;
    width: 100%;
  }

  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 560px) {
  .newsletter-form {
    flex-direction: column;
  }

  .footer-grid {
    grid-template-columns: 1fr;
  }
}
</style>
