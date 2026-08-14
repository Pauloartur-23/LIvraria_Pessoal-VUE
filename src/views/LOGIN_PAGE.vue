<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/store'

const router = useRouter()
const cartStore = useCartStore()

const isLogin = ref(true)
const errorMessage = ref('')

const loginForm = reactive({ email: '', password: '' })
const registerForm = reactive({ nome: '', email: '', password: '', confirm: '' })

const validateEmail = (email) => /\S+@\S+\.\S+/.test(email)

const toggleForm = () => {
  isLogin.value = !isLogin.value
  errorMessage.value = ''
  loginForm.email = ''
  loginForm.password = ''
  registerForm.nome = ''
  registerForm.email = ''
  registerForm.password = ''
  registerForm.confirm = ''
}

const handleLogin = () => {
  if (!loginForm.email || !loginForm.password) {
    errorMessage.value = 'Preencha todos os campos.'
    return
  }
  if (!validateEmail(loginForm.email)) {
    errorMessage.value = 'Informe um e-mail válido.'
    return
  }
  errorMessage.value = ''
  cartStore.addToast('Login realizado com sucesso! Bem-vindo(a) de volta.', 'success')
  router.push('/')
}

const handleRegister = () => {
  if (!registerForm.nome || !registerForm.email || !registerForm.password || !registerForm.confirm) {
    errorMessage.value = 'Preencha todos os campos.'
    return
  }
  if (!validateEmail(registerForm.email)) {
    errorMessage.value = 'Informe um e-mail válido.'
    return
  }
  if (registerForm.password.length < 6) {
    errorMessage.value = 'A senha deve ter pelo menos 6 caracteres.'
    return
  }
  if (registerForm.password !== registerForm.confirm) {
    errorMessage.value = 'As senhas não coincidem.'
    return
  }
  errorMessage.value = ''
  cartStore.addToast('Conta criada com sucesso! Agora faça login.', 'success')
  toggleForm()
}
</script>

<template>
  <main class="auth page">
    <div class="auth-card">
      <!-- Branding -->
      <aside class="brand">
        <span class="brand-mark mdi mdi-book-open-page-variant"></span>
        <h2>Bem-vindo ao IFbooks</h2>
        <p>
          Uma livraria feita para quem ama histórias. Crie sua conta para guardar
          favoritos, acompanhar pedidos e aproveitar promoções exclusivas.
        </p>
        <blockquote>
          "Os livros são sonhos que você segura na mão."
          <footer>— Neil Gaiman</footer>
        </blockquote>
        <div class="brand-stats">
          <div><strong>16+</strong><span>títulos</span></div>
          <div><strong>4,7</strong><span>avaliação</span></div>
          <div><strong>Grátis</strong><span>frete SC</span></div>
        </div>
      </aside>

      <!-- Form -->
      <section class="form-side">
        <div v-if="isLogin">
          <h1>Entrar na conta</h1>
          <p class="subtitle">Que bom te ver de novo! Informe seus dados abaixo.</p>

          <form @submit.prevent="handleLogin">
            <div class="field">
              <label>E-mail</label>
              <input v-model="loginForm.email" type="email" placeholder="voce@email.com" />
            </div>
            <div class="field">
              <label>Senha</label>
              <input v-model="loginForm.password" type="password" placeholder="••••••••" />
            </div>

            <p v-if="errorMessage" class="form-error">
              <span class="mdi mdi-alert-circle-outline"></span>
              {{ errorMessage }}
            </p>

            <button type="submit" class="btn btn-primary submit-btn">
              <span class="mdi mdi-login"></span>
              Entrar
            </button>
          </form>

          <p class="toggle">
            Ainda não tem conta?
            <button class="toggle-link" @click="toggleForm">Crie gratuitamente</button>
          </p>
        </div>

        <div v-else>
          <h1>Criar conta</h1>
          <p class="subtitle">Leva menos de um minuto e é de graça.</p>

          <form @submit.prevent="handleRegister">
            <div class="field">
              <label>Nome completo</label>
              <input v-model="registerForm.nome" type="text" placeholder="Seu nome" />
            </div>
            <div class="field">
              <label>E-mail</label>
              <input v-model="registerForm.email" type="email" placeholder="voce@email.com" />
            </div>
            <div class="field">
              <label>Senha</label>
              <input v-model="registerForm.password" type="password" placeholder="Mínimo 6 caracteres" />
            </div>
            <div class="field">
              <label>Confirmar senha</label>
              <input v-model="registerForm.confirm" type="password" placeholder="Repita a senha" />
            </div>

            <p v-if="errorMessage" class="form-error">
              <span class="mdi mdi-alert-circle-outline"></span>
              {{ errorMessage }}
            </p>

            <button type="submit" class="btn btn-primary submit-btn">
              <span class="mdi mdi-account-plus-outline"></span>
              Criar conta
            </button>
          </form>

          <p class="toggle">
            Já tem uma conta?
            <button class="toggle-link" @click="toggleForm">Fazer login</button>
          </p>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.auth {
  min-height: calc(100vh - 120px);
  display: grid;
  place-items: center;
  padding: 48px 24px;
}

.auth-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 920px;
  width: 100%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

/* Brand */
.brand {
  background: linear-gradient(150deg, var(--color-primary) 0%, var(--color-primary-darker) 100%);
  color: #fff;
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.brand-mark {
  font-size: 2.6rem;
  margin-bottom: 20px;
}

.brand h2 {
  color: #fff;
  font-size: 1.6rem;
  margin-bottom: 12px;
}

.brand > p {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.94rem;
  line-height: 1.7;
  margin-bottom: 24px;
}

.brand blockquote {
  margin: 0 0 28px;
  padding: 16px 0 0;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1.05rem;
  line-height: 1.6;
}

.brand blockquote footer {
  font-family: var(--font-body);
  font-style: normal;
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 6px;
}

.brand-stats {
  display: flex;
  gap: 28px;
}

.brand-stats div {
  display: flex;
  flex-direction: column;
}

.brand-stats strong {
  font-family: var(--font-display);
  font-size: 1.4rem;
}

.brand-stats span {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.75);
}

/* Form */
.form-side {
  padding: 48px 40px;
}

.form-side h1 {
  font-size: 1.7rem;
  margin-bottom: 6px;
}

.subtitle {
  color: var(--color-muted);
  font-size: 0.92rem;
  margin-bottom: 26px;
}

.form-side form .field {
  margin-bottom: 16px;
}

.form-error {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: var(--color-danger);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  font-size: 0.88rem;
  margin-bottom: 16px;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  margin-top: 6px;
  font-size: 1rem;
}

.toggle {
  text-align: center;
  margin-top: 20px;
  font-size: 0.9rem;
  color: var(--color-muted);
}

.toggle-link {
  color: var(--color-primary);
  font-weight: 700;
  transition: color 0.2s ease;
}

.toggle-link:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

@media (max-width: 760px) {
  .auth-card {
    grid-template-columns: 1fr;
  }

  .brand {
    display: none;
  }
}
</style>
