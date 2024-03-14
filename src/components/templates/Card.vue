<template>
  <div
    id="card-item"
    class="max-w-[300px] xs:max-w-[380px] sm:max-w-[400px] md:max-w-[430px] relative z-[2] w-full mx-auto"
    :class="{ '-active': isCardFlipped }"
  >
    <div class="card-item__side -front">
      <div
        ref="focusElement"
        class="card-item__focus"
        :style="focusElementStyle"
        :class="{ '-active': focusElementStyle }"
      ></div>
      <div class="card-item__cover">
        <img src="@/assets/images/card-cover.webp" class="card-item__bg" />
      </div>

      <div
        class="flex flex-col justify-between gap-6 relative h-full select-none p-4"
      >
        <div>
          <div class="flex items-baseline justify-between mb-10">
            <img
              src="@/assets/images/chip.webp"
              class="max-w-[40px] md:max-w-[60px]"
              alt="chip"
            />
            <div
              class="h-7 md:h-11 flex justify-end max-w-[60px] md:max-w-[100px] w-full ml-auto"
            >
              <img
                v-if="cardType"
                :src="cardLogo"
                :key="cardType"
                alt="cardType"
              />
            </div>
          </div>
          <label
            for="cardNumber"
            ref="cardNumber"
            class="font-medium text-white sm:whitespace-nowrap text-2xl md:text-[28px] cursor-pointer px-4 py-1 md:py-2.5"
          >
            <span v-for="(n, index) in currentPlaceholder" :key="index">
              <transition name="slide-fade-right">
                <div
                  v-if="!getIsNumberMasked(index, n)"
                  class="inline-block"
                  :class="{ '-active': labels.cardNumber.length > index }"
                >
                  {{ labels.cardNumber[index] || n }}
                </div>
                <div v-else class="inline-block w-4">*</div>
              </transition>
            </span>
          </label>
        </div>

        <div class="text-white flex items-center justify-between">
          <label
            for="cardName"
            ref="cardName"
            class="text-white w-full max-w-[calc(100%_-_85px)] font-medium cursor-pointer px-4 py-1 md:py-2.5"
          >
            <div class="opacity-70 text-xs">Card Holder</div>
            <div class="max-w-max truncate" :key="fields.cardName">
              {{ labels.cardName || 'Full Name' }}
            </div>
          </label>

          <label
            ref="cardDate"
            for="cardMonth"
            class="text-white flex-1 font-medium cursor-pointer px-4 py-1 md:py-2.5"
          >
            <div class="opacity-70 text-xs">Expires</div>
            <div class="flex items-center">
              <transition name="slide-fade-up">
                <label
                  for="cardMonth"
                  class="cursor-pointer"
                  :key="labels.cardMonth || 'MM'"
                >
                  {{ labels.cardMonth || 'MM' }}
                </label>
              </transition>
              /
              <transition name="slide-fade-up">
                <label
                  for="cardYear"
                  class="cursor-pointer"
                  :key="labels.cardYear || 'YY'"
                >
                  {{ String(labels.cardYear).slice(2, 4) || 'YY' }}
                </label>
              </transition>
            </div>
          </label>
        </div>
      </div>
    </div>

    <div class="card-item__side -back">
      <div class="card-item__cover">
        <img src="@/assets/images/card-cover.webp" class="card-item__bg" />
      </div>
      <div class="w-full h-[50px] relative mt-7 bg-black"></div>
      <div class="text-right relative p-4">
        <div class="text-sm font-medium text-white mb-[6px] pr-2.5">CVV</div>
        <div
          class="h-[45px] text-right flex items-center bg-white justify-end text-primary text-lg rounded shadow mb-8 pr-2.5"
        >
          <span v-for="(n, index) in labels.cardCvv" :key="index">*</span>
        </div>
        <div
          class="h-7 flex justify-end max-w-[40px] w-full ml-auto relative -top-4"
        >
          <img v-if="cardType" :src="cardLogo" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    labels: Object,
    fields: Object,
    isCardNumberMasked: Boolean,
  },
  data() {
    return {
      currentFocus: null,
      isCardFlipped: false,
      currentPlaceholder: '',
      focusElementStyle: null,
    }
  },
  watch: {
    currentFocus(newFocus, oldFocus) {
      this.changeFocus(newFocus)
    },
    cardType(newType, oldType) {
      this.changePlaceholder()
    },
  },
  mounted() {
    this.changePlaceholder()
    this.initFieldListeners()
  },
  computed: {
    cardType() {
      const { cardNumber } = this.labels
      const types = {
        visa: '^4',
        troy: '^9792',
        unionpay: '^62',
        amex: '^(34|37)',
        discover: '^6011',
        mastercard: '^5[1-5]',
        jcb: '^35(2[89]|[3-8])',
        dinersclub: '^3(?:0([0-5]|9)|[689]\\d?)\\d{0,11}',
      }

      return (
        Object.keys(types).find((type) =>
          new RegExp(types[type]).test(cardNumber),
        ) || ''
      )
    },
    cardLogo() {
      return new URL(
        `../../assets/images/${this.cardType}.webp`,
        import.meta.url,
      ).href
    },
  },
  methods: {
    initFieldListeners() {
      document.querySelectorAll('[data-card-field]').forEach((element) => {
        element.addEventListener('focus', this.handleFocus)
        element.addEventListener('blur', this.handleBlur)
      })
    },
    handleFocus(event) {
      const { id } = event.target
      this.currentFocus = ['cardYear', 'cardMonth'].includes(id)
        ? 'cardDate'
        : id

      this.isCardFlipped = id === 'cardCvv'
    },
    handleBlur() {
      this.isCardFlipped = false
      setTimeout(() => {
        if (!document.activeElement.closest('[data-card-field]')) {
          this.currentFocus = null
        }
      }, 300)
    },
    changeFocus() {
      const target = this.$refs[this.currentFocus]
      this.focusElementStyle = target
        ? {
            width: `${target.offsetWidth}px`,
            height: `${target.offsetHeight}px`,
            transform: `translateX(${target.offsetLeft}px) translateY(${target.offsetTop}px)`,
          }
        : null
    },
    changePlaceholder() {
      switch (this.cardType) {
        case 'amex':
          this.currentPlaceholder = '#### ###### #####'
          break
        case 'dinersclub':
          this.currentPlaceholder = '#### ###### ####'
          break
        default:
          this.currentPlaceholder = '#### #### #### ####'
      }
      this.$nextTick(() => this.changeFocus())
    },

    getIsNumberMasked(index, n) {
      return (
        index > 4 &&
        index < 14 &&
        this.labels.cardNumber.length > index &&
        n.trim() !== '' &&
        this.isCardNumberMasked
      )
    },
  },
}
</script>

<style scoped>
#card-item.-active .card-item__side.-front {
  transform: perspective(1000px) rotateY(180deg) rotateX(0deg) rotateZ(0deg);
}

#card-item.-active .card-item__side.-back {
  transform: perspective(1000px) rotateY(0) rotateX(0deg) rotateZ(0deg);
}

.card-item__focus {
  @apply absolute z-30 w-full h-full transition-all duration-[0.35s] ease-in-out  opacity-0 pointer-events-none overflow-hidden rounded border-2 border-solid border-white border-opacity-65 left-0 top-0 after:absolute after:w-full after:h-full after:blur-[25px] after:opacity-50 after:rounded-[5px] after:left-0 after:top-0 after:bg-[#08142f];
}

.card-item__focus.-active {
  @apply opacity-100;
}

.card-item__side {
  @apply overflow-hidden shadow transition-all duration-[0.8s] ease-in-out  h-full rounded-[15px];
  transform: perspective(2000px) rotateY(0deg) rotateX(0deg) rotate(0deg);
  transform-style: preserve-3d;
  backface-visibility: hidden;
}

.card-item__side.-back {
  @apply absolute w-full z-[2] h-full p-0 left-0 top-0;
  transform: perspective(2000px) rotateY(-180deg) rotateX(0deg) rotate(0deg);
}

.card-item__side.-back .card-item__cover {
  transform: rotateY(-180deg);
}

.card-item__bg {
  @apply max-w-full block max-h-full h-full w-full object-cover;
}

.card-item__cover {
  @apply h-full bg-black absolute h-full bg-black w-full overflow-hidden rounded-[15px] left-0 top-0 after:content-[""] after:absolute after:w-full after:h-full after:left-0 after:top-0;
}

.card-item__cover:after {
  background: rgba(6, 2, 29, 0.45);
}

.slide-fade-up-enter-active {
  @apply transition-all duration-[0.25s] ease-[ease-in-out] delay-[0.1s] relative;
}

.slide-fade-up-leave-active {
  @apply transition-all duration-[0.25s] ease-[ease-in-out] absolute;
}

.slide-fade-up-enter {
  @apply opacity-0 translate-y-[15px] pointer-events-none;
}

.slide-fade-up-leave-to {
  @apply opacity-0 translate-y-[-15px] pointer-events-none;
}

.slide-fade-right-enter-active {
  @apply transition-all duration-[0.25s] ease-[ease-in-out] delay-[0.1s] relative;
}

.slide-fade-right-leave-active {
  @apply transition-all duration-[0.25s] ease-[ease-in-out] absolute;
}

.slide-fade-right-enter {
  @apply opacity-0 translate-x-2.5 rotate-45 pointer-events-none;
}

.slide-fade-right-leave-to {
  @apply opacity-0 -translate-x-2.5 rotate-45 pointer-events-none;
}
</style>
