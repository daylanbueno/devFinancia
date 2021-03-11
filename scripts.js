const Modal = {
    open() {
      document.querySelector('.modal-overlay').classList.add('active')
    },
    close() {
        document.querySelector('.modal-overlay').classList.remove('active')
    }
}

const transactions = []

const Storege = {
    get(){
        return JSON.parse(localStorage.getItem("dev.financia"))
    },
    set(transactionsList) {
        localStorage.setItem('dev.financia', JSON.stringify(transactionsList))
    }
}

const Transaction = {
    all: Storege.get(),

    add(transaction) {
        Transaction.all.push(transaction)
        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)
        App.reload()
    },

    incomes() {
        let income = 0;
        Transaction.all.forEach((transaction) => {
            if(transaction.amount > 0 ) {
                income += transaction.amount
            }
        })
        return income
    },

    expenses() {
        let expense = 0;
        Transaction.all.forEach((transaction) => {
            if(transaction.amount < 0 ) {
                expense += transaction.amount
            }
        })
        return expense
    },

    total() {
        return Transaction.incomes() + Transaction.expenses()
    }
}

const Utils = {
    formatCurreny(value) {
        const signal = Number(value) < 0 ? "-" :""
        value = String(value).replace(/\D/g, "")
        value  = Number(value) /100

        value  = value.toLocaleString("pt-BR", {
            style:"currency",
            currency:'BRL'
        })
        return (signal + value)
    },
    formatAmount(value) {
        value = Number(value) * 100
        return value
    },
    formatDate(date) {
        const splitedDate = date.split('-')
        return `${splitedDate[2]}/${splitedDate[1]}/${splitedDate[0]}`
    }
}

const DOM = {
    
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction,index)
        tr.dataset.index = index
        DOM.transactionsContainer.appendChild(tr)
        
    },
    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount  > 0 ? 'income' : 'expense'
        const html = `
        <tr>
            <td class="description">${transaction.description}</td>
            <td class=${CSSclass}>R$ ${Utils.formatCurreny(transaction.amount)}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick={Transaction.remove(${index})} src="./assets/minus.svg" alt="remover transação">
            </td>
        </tr>
        `
        return html
    },
    updateBalance() {
        document.getElementById("incomeDisplay")
        .innerHTML = Utils.formatCurreny(Transaction.incomes()) 

        document.getElementById("expenseDisplay")
        .innerHTML = Utils.formatCurreny(Transaction.expenses())

        document.getElementById("totalDisplay")
        .innerHTML = Utils.formatCurreny(Transaction.total()) 
    },

    cleanTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
} 

const Form = {
    description: document.querySelector("#description"),
    amount: document.querySelector("#amount"),
    date: document.querySelector('#date'),
    getValues() {
        return {
            description: description.value,
            amount:amount.value,
            date:date.value
        }
    },

    cleanFields() {
        Form.description.value = ''
        Form.amount.value = ''
        Form.date.value = ''
    },

    formatDate() {
        let { description, amount, date }  = this.getValues()
        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)
        return {
            description,
            amount,
            date
        }
    },
    validteField () {
        const { description, amount, date }  = this.getValues()

        if(description.trim() === "" || amount.trim() === '' || date.trim() ==='') {
            throw new Error('Por favor, preencha todos os campos')
        }
        console.log(this.getValues())
    },

    saveTransaction(transaction) {
        Transaction.add(transaction)
    },

    submit(event) {
        event.preventDefault()

        try {
            Form.validteField()
           const newTransaction =  Form.formatDate()
           Form.saveTransaction(newTransaction)
           Form.cleanFields()
           Modal.close()
        } catch (error) {
            alert(error.message)
        }
        
    }
}

const App = {
    init() {
        Storege.set(transactions)
        Transaction.all.forEach((item,index) =>  DOM.addTransaction(item,index))
        DOM.updateBalance()
        Storege.set(Transaction.all)
    },
    reload() {
        DOM.cleanTransactions()
        this.init()
    }
}


App.init()


