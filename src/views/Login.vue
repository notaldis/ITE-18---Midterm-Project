<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Pickaxe, ShieldCheck, Truck, Wrench } from 'lucide-vue-next'
import { enterWorkspace } from '../auth'

const route = useRoute()
const router = useRouter()
const email = ref('')
const password = ref('')
const passwordVisible = ref(false)

async function submit() {
  enterWorkspace(email.value)
  const redirect = typeof route.query.redirect === 'string'
    && route.query.redirect.startsWith('/')
    && !route.query.redirect.startsWith('//')
    ? route.query.redirect
    : '/dashboard'
  await router.replace(redirect)
}
</script>

<template>
  <main class="access-page">
    <section class="access-visual" aria-label="Mining equipment">
      <img class="quarry-art" src="/mineops-quarry.jpg" alt="Open-pit quarry with mining trucks, excavators, and a conveyor" />
      <div class="visual-shade"></div>
      <RouterLink class="access-brand" to="/login" aria-label="MineOps home">
        <span class="access-brand-mark"><Pickaxe :size="22" /></span>
        <span class="access-brand-word">MINE<span>OPS</span></span>
      </RouterLink>

      <div class="visual-copy">
        <div class="visual-kicker"><span></span> MINING OPERATIONS MANAGEMENT</div>
        <h1>Built for the<br />demands of the mine.</h1>
        <p>Bring your equipment, inventory, and maintenance records together in one clear workspace.</p>
        <div class="visual-capabilities">
          <div><Truck :size="16" /><span>Fleet &amp; equipment</span></div>
          <div><Pickaxe :size="16" /><span>Parts &amp; inventory</span></div>
          <div><Wrench :size="16" /><span>Maintenance planning</span></div>
        </div>
      </div>
      <div class="visual-caption"><span>FIELD OPERATIONS</span><i></i><span>EQUIPMENT MANAGEMENT</span></div>
    </section>

    <section class="access-panel">
      <div class="access-panel-inner">
        <RouterLink class="mobile-brand" to="/login" aria-label="MineOps home">
          <span class="access-brand-mark"><Pickaxe :size="21" /></span>
          <span class="access-brand-word">MINE<span>OPS</span></span>
        </RouterLink>

        <div class="form-heading">
          <span class="form-eyebrow">YOUR OPERATIONS WORKSPACE</span>
          <h2>Welcome back</h2>
          <p>Enter your details to open your MineOps workspace.</p>
        </div>

        <form class="access-form" @submit.prevent="submit">
          <label for="email">Work email</label>
          <div class="access-input">
            <Mail :size="17" />
            <input id="email" v-model="email" type="email" name="email" placeholder="name@company.com" autocomplete="username" required />
          </div>

          <div class="password-label">
            <label for="password">Password</label>
          </div>
          <div class="access-input">
            <LockKeyhole :size="17" />
            <input id="password" v-model="password" :type="passwordVisible ? 'text' : 'password'" name="password" placeholder="Enter your password" autocomplete="current-password" required />
            <button class="password-visibility" type="button" :aria-label="passwordVisible ? 'Hide password' : 'Show password'" @click="passwordVisible = !passwordVisible">
              <EyeOff v-if="passwordVisible" :size="17" />
              <Eye v-else :size="17" />
            </button>
          </div>

          <button class="access-submit" type="submit">
            Open workspace <ArrowRight :size="17" />
          </button>
        </form>

        <div class="local-access-note" role="note">
          <ShieldCheck :size="17" />
          <p><strong>Local workspace access</strong><br />This frontend has no account service. The email is used for this browser session; passwords are not checked or saved.</p>
        </div>

        <div class="access-footer">
          <span>© 2026 MineOps</span>
          <span><i></i> Equipment · Inventory · Maintenance</span>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.access-page {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(460px, 0.92fr);
  min-height: 100vh;
  background: #fff;
}
.access-visual {
  position: relative;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  padding: 34px clamp(34px, 5.3vw, 78px) 29px;
  color: #fff;
  background: #172b25;
}
.quarry-art, .visual-shade {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.quarry-art { object-fit: cover; object-position: 55% center; }
.visual-shade {
  background:
    linear-gradient(90deg, rgb(13 29 24 / 60%), rgb(13 29 24 / 9%) 92%),
    linear-gradient(0deg, rgb(13 29 24 / 87%), transparent 63%, rgb(13 29 24 / 32%));
}
.access-brand, .visual-copy, .visual-caption {
  position: relative;
  z-index: 1;
}
.access-brand, .mobile-brand {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 11px;
  text-decoration: none;
}
.access-brand-mark {
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border: 1px solid rgb(255 255 255 / 18%);
  border-radius: 11px;
  color: #fff;
  background: #0a8050;
  box-shadow: 0 8px 22px rgb(0 0 0 / 18%);
}
.access-brand-word {
  color: #fff;
  font: 800 18px Manrope, sans-serif;
  letter-spacing: 1.15px;
}
.access-brand-word span { color: #7bdfa6; }
.visual-copy {
  width: min(100%, 570px);
  margin-top: auto;
  padding: 90px 0 45px;
}
.visual-kicker, .form-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #9be0b6;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.55px;
}
.visual-kicker > span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #82dfa5;
  box-shadow: 0 0 14px rgb(130 223 165 / 80%);
}
.visual-copy h1 {
  margin: 20px 0 13px;
  color: #fff;
  font: 700 clamp(38px, 5vw, 66px)/1.08 Manrope, sans-serif;
  letter-spacing: -2.7px;
}
.visual-copy > p {
  max-width: 430px;
  margin: 0;
  color: #d0dbd2;
  font-size: 14px;
  line-height: 1.8;
}
.visual-capabilities {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 27px;
}
.visual-capabilities > div {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 11px;
  border: 1px solid rgb(255 255 255 / 18%);
  border-radius: 7px;
  color: #eff6f0;
  background: rgb(12 34 26 / 44%);
  font-size: 10px;
  font-weight: 500;
  backdrop-filter: blur(8px);
}
.visual-capabilities svg { color: #9be0b6; }
.visual-caption {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgb(231 239 232 / 68%);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1.3px;
}
.visual-caption i {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #89d9a5;
}
.access-panel {
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding: 54px 48px;
}
.access-panel-inner { width: min(100%, 390px); }
.mobile-brand { display: none; }
.form-heading { margin-bottom: 32px; }
.form-eyebrow { color: #168152; font-size: 9px; }
.form-heading h2 {
  margin: 13px 0 8px;
  color: #192820;
  font: 700 31px Manrope, sans-serif;
  letter-spacing: -1.1px;
}
.form-heading p {
  margin: 0;
  color: #78847d;
  font-size: 13px;
  line-height: 1.65;
}
.access-form { display: flex; flex-direction: column; }
.access-form > label, .password-label > label {
  margin-bottom: 9px;
  color: #293a32;
  font-size: 12px;
  font-weight: 600;
}
.access-input {
  display: flex;
  height: 49px;
  align-items: center;
  gap: 11px;
  padding: 0 13px;
  border: 1px solid #e1e8e3;
  border-radius: 8px;
  color: #89968f;
  background: #fff;
  transition: border-color .15s, box-shadow .15s;
}
.access-input:focus-within {
  border-color: #49a979;
  box-shadow: 0 0 0 3px #e8f5ec;
}
.access-input input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  color: #1b2924;
  background: transparent;
  font-size: 12px;
}
.access-input input::placeholder { color: #9da8a2; }
.password-label { display: flex; justify-content: space-between; margin-top: 21px; }
.password-label > label { margin-bottom: 9px; }
.password-visibility {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  padding: 4px;
  border: 0;
  color: #85938b;
  background: transparent;
}
.password-visibility:hover { color: #087f4b; }
.access-submit {
  display: flex;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 25px;
  border: 0;
  border-radius: 8px;
  color: #fff;
  background: #087f4b;
  box-shadow: 0 5px 14px rgb(8 127 75 / 17%);
  font-size: 12px;
  font-weight: 700;
  transition: background .15s, transform .15s;
}
.access-submit:hover { transform: translateY(-1px); background: #076a40; }
.local-access-note {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  margin-top: 22px;
  padding: 13px;
  border: 1px solid #e7ece8;
  border-radius: 8px;
  color: #718078;
  background: #f8faf8;
}
.local-access-note > svg {
  flex: 0 0 auto;
  margin-top: 1px;
  color: #168152;
}
.local-access-note p { margin: 0; font-size: 10px; line-height: 1.65; }
.local-access-note strong { color: #32453a; font-size: 11px; }
.access-footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px;
  margin-top: 42px;
  color: #919c95;
  font-size: 9px;
}
.access-footer > span:last-child { display: inline-flex; align-items: center; gap: 7px; }
.access-footer i { width: 5px; height: 5px; border-radius: 50%; background: #61b981; }
@media (max-width: 900px) {
  .access-page { grid-template-columns: minmax(0, 1fr) minmax(390px, .9fr); }
  .access-visual { padding-right: 32px; padding-left: 32px; }
  .access-panel { padding-right: 32px; padding-left: 32px; }
  .visual-capabilities { gap: 7px; }
  .visual-capabilities > div { padding: 8px; }
}
@media (max-width: 680px) {
  .access-page { display: flex; flex-direction: column; background: #f7f9f7; }
  .access-visual {
    min-height: 270px;
    padding: 22px 23px 24px;
    background-position: center 58%;
  }
  .quarry-art { object-position: 58% 57%; }
  .visual-shade { background: linear-gradient(90deg, rgb(13 29 24 / 60%), rgb(13 29 24 / 10%)), linear-gradient(0deg, rgb(13 29 24 / 84%), transparent 77%); }
  .access-brand { display: none; }
  .visual-copy { padding: 62px 0 0; }
  .visual-kicker { font-size: 8px; }
  .visual-copy h1 { margin: 12px 0 6px; font-size: 32px; letter-spacing: -1.3px; }
  .visual-copy > p { max-width: 440px; font-size: 11px; line-height: 1.55; }
  .visual-capabilities { gap: 6px; margin-top: 13px; }
  .visual-capabilities > div { gap: 5px; padding: 6px 7px; font-size: 8px; }
  .visual-capabilities svg { width: 13px; height: 13px; }
  .visual-caption { display: none; }
  .access-panel { min-height: auto; flex: 1; place-items: start center; padding: 0 18px 24px; }
  .access-panel-inner {
    width: min(100%, 450px);
    margin-top: -1px;
    padding: 25px 22px 20px;
    border: 1px solid #e8ede9;
    border-top: 0;
    border-radius: 0 0 13px 13px;
    background: #fff;
    box-shadow: 0 12px 30px rgb(30 54 40 / 5%);
  }
  .mobile-brand { display: none; }
  .form-heading { margin-bottom: 23px; }
  .form-heading h2 { margin-top: 9px; font-size: 25px; }
  .access-footer { margin-top: 26px; }
}
@media (max-width: 380px) {
  .access-visual { min-height: 250px; padding-right: 17px; padding-left: 17px; }
  .visual-capabilities { gap: 5px; }
  .visual-capabilities > div { padding: 6px; }
  .access-panel { padding-right: 12px; padding-left: 12px; }
  .access-panel-inner { padding-right: 17px; padding-left: 17px; }
}
</style>
