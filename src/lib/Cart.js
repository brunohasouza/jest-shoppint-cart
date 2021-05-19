import Dinero from 'dinero.js'

const Money = Dinero
Money.defaultCurrency = 'BRL'
Money.defaultPrecision = 2

export default class Cart {
    items = []

    getTotal() {
        const total = this.items.reduce((acc, curr) => {
            const amount = Money({ amount: curr.quantity * curr.product.price })
            let discount = Money({ amount: 0 })

            if (curr.condition && curr.condition.percentage && curr.quantity > curr.condition.minimum) {
                discount = amount.percentage(curr.condition.percentage)
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

    sumary() {
        const total = this.getTotal()
        const items = this.items

        return { total, items }
    }

    checkout() {
        const payload = this.sumary()

        this.items = []

        return payload
    }
}