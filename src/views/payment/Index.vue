<template>
  <div class="flex flex-col space-y-8">
    <h1 class="text-3xl font-bold">Payment</h1>
    <div>
      <div class="mb-[-130px]">
        <Card
          :fields="fields"
          :labels="fields"
          :isCardNumberMasked="isCardNumberMasked"
        />
      </div>
      <div
        class="flex flex-col gap-8 card-shadow pt-[180px] p-6 rounded-lg bg-white"
      >
        <TextField
          type="tel"
          isRequired
          id="cardNumber"
          label="Card Number"
          v-model="fields.cardNumber"
          inputRestriction="numberOnly"
          :maxlength="cardNumberMaxLength"
          placeholder="0000 0000 0000 0000"
          @focus="focusCardNumber"
          @blur="blurCardNumber"
          @validation:error="validationErrors.cardNumber = $event"
        />

        <TextField
          type="text"
          isRequired
          id="cardName"
          label="Card Name"
          placeholder="Full Name"
          v-model="fields.cardName"
          inputRestriction="letterOnly"
          @validation:error="validationErrors.cardName = $event"
        />

        <div class="flex flex-col md:flex-row gap-8">
          <div class="flex flex-col w-full md:w-2/3">
            <label for="cardMonth" class="input-label">Expiration Date</label>
            <div class="flex items-center gap-4">
              <SelectField
                id="cardMonth"
                isRequired
                :options="monthOptions"
                placeholder="Select Month"
                v-model="fields.cardMonth"
                @validation:error="validationErrors.cardMonth = $event"
              />

              <SelectField
                isRequired
                id="cardYear"
                :options="yearOptions"
                placeholder="Select Year"
                v-model="fields.cardYear"
                @validation:error="validationErrors.cardYear = $event"
              />
            </div>
          </div>
          <TextField
            type="tel"
            label="CVV"
            isRequired
            id="cardCvv"
            :maxlength="4"
            containerClass="md:w-1/3"
            v-model="fields.cardCvv"
            inputRestriction="numberOnly"
            @validation:error="validationErrors.cardCvv = $event"
          />
        </div>

        <Button
          text="Submit"
          type="primary"
          extraClasses="w-full py-4 text-xl font-medium"
          @click="validate"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Card from '@/components/templates/Card.vue'
import Button from '@/components/atoms/Button.vue'
import TextField from '@/components/atoms/TextField.vue'
import SelectField from '@/components/atoms/SelectField.vue'

export default {
  components: {
    Card,
    Button,
    TextField,
    SelectField,
  },
  data() {
    return {
      fields: {
        cardCvv: '',
        cardName: '',
        cardYear: '',
        cardMonth: '',
        cardNumber: '',
      },
      minCardYear: new Date().getFullYear(),
      isCardNumberMasked: true,
      mainCardNumber: this.cardNumber,
      cardNumberMaxLength: 19,
      cardNumberNotMask: '',

      hasErrors: false,
      validationErrors: {},
    }
  },
  computed: {
    minCardMonth() {
      if (+this.fields.cardYear === +this.minCardYear)
        return new Date().getMonth() + 1
      return 1
    },

    monthOptions() {
      return Array.from({ length: 12 }, (_, i) => {
        const month = i + 1
        const value = month < 10 ? `0${month}` : `${month}`

        return {
          value,
          text: value,
          disabled: month < this.minCardMonth,
        }
      })
    },
    yearOptions() {
      return Array.from({ length: 12 }, (_, i) => {
        const value = i + this.minCardYear
        return {
          value,
          text: value,
        }
      })
    },
  },
  watch: {
    fields: {
      deep: true,
      immediate: true,
      handler() {
        if (this.fields.cardMonth < this.minCardMonth) {
          this.fields.cardMonth = ''
        }

        this.hasErrors =
          Object.values(this.validationErrors).some((value) => value) ||
          Object.values(this.fields).some((value) => !value)
      },
    },
  },
  mounted() {
    this.maskCardNumber()
  },
  methods: {
    validate() {
      if (!this.hasErrors) {
        let number = this.cardNumberNotMask.replace(/\s+/g, '') // Remove all spaces
        let sum = 0
        let shouldDouble = false // Start with the rightmost digit

        // Iterate over the string from right to left
        for (let i = number.length - 1; i >= 0; i--) {
          let digit = parseInt(number.charAt(i), 10)

          if (shouldDouble) {
            digit *= 2
            if (digit > 9) {
              digit -= 9 // Subtract 9 if the doubled digit is greater than 9
            }
          }

          sum += digit
          shouldDouble = !shouldDouble // Flip the flag
        }

        if (sum % 10 !== 0) {
          alert('Invalid Card Number')
        } else {
          alert('Valid Card Number')
        }
      } else {
        alert('Please correct the errors first')
      }
    },
    blurCardNumber() {
      if (this.isCardNumberMasked) {
        this.maskCardNumber()
      }
    },
    maskCardNumber() {
      this.cardNumberNotMask = this.fields.cardNumber
      this.mainCardNumber = this.fields.cardNumber
      let arr = this.fields.cardNumber.split('')
      arr.forEach((element, index) => {
        if (index > 4 && index < 14 && element.trim() !== '') {
          arr[index] = '*'
        }
      })
      this.fields.cardNumber = arr.join('')
    },
    unMaskCardNumber() {
      this.fields.cardNumber = this.mainCardNumber
    },
    focusCardNumber() {
      this.unMaskCardNumber()
    },
    toggleMask() {
      this.isCardNumberMasked = !this.isCardNumberMasked
      if (this.isCardNumberMasked) {
        this.maskCardNumber()
      } else {
        this.unMaskCardNumber()
      }
    },
  },
}
</script>
