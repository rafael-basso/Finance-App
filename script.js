const Modal = {
    open(){
        // ativar Modal, ativar class active
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')
    },
    close(){
        // fechar Modal, desativar class active
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')
    }
}

// const transactions = [
//     {
//         id: 1,
//         description: 'Luz',
//         amount: -50000,
//         date: '23/01/2021'
//     }, 
//     {
//         id: 2,
//         description: 'Website',
//         amount: 540040,
//         date: '23/01/2021'
//     }, 
//     {
//         id: 3,
//         description: 'Internet',
//         amount: -20000,
//         date: '23/01/2021'
//     },
//     {
//         id: 4,
//         description: 'App',
//         amount: 340000,
//         date: '23/01/2021'
//     }
// ]

const Storage = {
    get() {
        //console.log(localStorage)
        return JSON.parse(localStorage.getItem("dev.finance")) || [] //caso nao tenha nenhum valor, retorna [] vazio
    },

    set(transactions) {
        localStorage.setItem("dev.finance", JSON.stringify(transactions))
    }
}

//Storage.set("teste")
//Storage.get()

const Transaction = {
    //all: transactions,
    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)
        //console.log(Transaction.all)
        App.reload()
    },

    removeTransaction(index) {
        Transaction.all.splice(index, 1)
        App.reload()
    },

    incomes() {
        let income = 0
        Transaction.all.forEach(transaction => { //pegar todas as transacoes
            if(transaction.amount > 0)
            income += transaction.amount //somar cada transacao
        })
        return income
    },

    expenses() {
        let expense = 0
        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0)
            expense += transaction.amount
        })
        return expense
    },

    total() {
        return Transaction.incomes() + Transaction.expenses()
    }
}

//Substituir os valores do html para javascript
const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        //console.log(transaction)
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)

        //console.log(tr.innerHTML)
    },    

    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td class="imgTable">
                <img onclick="Transaction.removeTransaction(${index})" src="./Images/delete.png" alt="remover transacao">
            </td>
            <td class="extra">extra</td>
        `
        return html
    },

    updateBalance() {
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes())
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount(value) {
        value = Number(value) * 100 //se fosse para editar o num retirando pontos e virgulas ficaria assim: value = Number(value.replace(/\,\./g, "")) * 100, mas ta funcionando do jeito que esta
        //console.log(value)
        return Math.round(value)
    },

    formatDate(date) {
        //date = date.split("-")
        //console.log(date)
        const splitDate = date.split("-")
        return  `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`
    },

    formatCurrency (value) {
        //console.log(value)
        const signal = Number(value) < 0 ? "-" : "+"
        //console.log(signal)
        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },

    validateFields() {
        //const description = Form.getValues().description
        //const amount = Form.getValues().amount
        //const date = Form.getValues().date 
        const { description, amount, date } = Form.getValues()
        //console.log(description, amount, date)
        if (description.trim() === "" || amount.trim() === "" || date.trim() === "" ) {
            throw new Error("Por favor, preencha todos os campos")
        }
    },

    formatValues() {
        let { description, amount, date} = Form.getValues()
        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)
        //console.log(date)
        return {
            //description: description // pode formatar para:
            description,
            amount,
            date
        }
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },
    
    submit(event) {
        //console.log(event)
        event.preventDefault()

        try {
            //verificar se o form foi preenchido
            Form.validateFields()
            
            //formatar os dados
            const transaction = Form.formatValues()
            
            //salvar
            Transaction.add(transaction)
           
            //apagar os dados no form
            Form.clearFields()

            //fechar o modal
            Modal.close()

            //atualizar a aplicacao    
            //App.reload() // nao vai precisar atualizar pois ja tem um App.reload() no Transaction.add ja tem um App.reload

        } catch (error) {
            alert(error.message)
        } 
        
     }
}

const App = {
    init(){     
        //DOM.addTransaction(transactions[0]) 
        //DOM.addTransaction(transactions[1]) 
        //DOM.addTransaction(transactions[2]) 
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
        })
        //Transaction.all.forEach(DOM.addTransaction)
        
        DOM.updateBalance()

        Storage.set(Transaction.all)
    },

    reload(){
        DOM.clearTransactions()
        App.init()
    }
}

App.init()

// Transaction.add({
//     id: 5,
//     description: "Hello",
//     amount: 200,
//     date: "22/02/2021"
// })

//Transaction.removeTransaction(0)
//Transaction.removeTransaction(0)
//Transaction.removeTransaction(0)

// console.log(Transaction.all)