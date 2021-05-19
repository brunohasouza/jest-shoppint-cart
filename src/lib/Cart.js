import Dinero from 'dinero.js'
import { calculateDiscount } from './discount.utils'

const Money = Dinero
Money.defaultCurrency = 'BRL'
Money.defaultPrecision = 2

export default class Cart {
    items = []

    getTotal() {
        const total = this.items.reduce((acc, { quantity, product, condition }) => {
            const amount = Money({ amount: quantity * product.price })
            let discount = Money({ amount: 0 })

            if (condition) {
                discount = calculateDiscount(amount, quantity, condition)
            }

            return acc.add(amount).subtract(discount)
        }, Money({ amount: 0 }))

        return total.getAmount()
    }

    add(item) {
        const index = this.items.findIndex(i => i.product === item.product)

        if (index > -1) {
            this.items.splice(index, 1)
        }

        this.items.push(item)
    }

    remove(product) {
        this.items = this.items.filter(item => item.product.title !== product.title)
    }

    summary() {
        const total = this.getTotal()
        const items = this.items
        const formatted = Money({ amount: total }).toFormat('$0,0.00')

        return { total, items, formatted }
    }

    checkout() {
        const payload = this.summary()

        this.items = []

        return payload
    }
}