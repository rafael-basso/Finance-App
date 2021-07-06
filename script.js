// criar objeto para inserir os dados do transactions no HTML pelo JS
const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    
    addTransaction(transaction, index) {
        //console.log('cheguei aqui') 
        //console.log(transaction) 
        
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        //console.log(tr.innerHTML) 
        tr.dataset.index = index
        //console.log(tr.dataset.index)

        DOM.transactionsContainer.appendChild(tr)
    },
    
    innerHTMLTransaction(transaction, index) {
        const html = `
        <td class="description">${transaction.description}</td>
        <td class="expense">${transaction.amount}</td>
        <td class="date">${transaction.date}</td>
        <td onclick="DOM.deleteTransaction(event, ${index})" class="imgTable"> <img src="./Images/delete.webp" alt="remover transacao"> </td>
        `
        return html
    },
    
    deleteTransaction(event, index) {                           
        //console.log(Amount[index])
        let income = Number(document.getElementById('income-display').innerText)
        let total = 0

        total = income - Amount[index]

        document.getElementById('income-display').innerText = total

        // Amount.splice(index, 1)
        // console.log(Amount)

        const imgDelete = event.currentTarget  
        imgDelete.parentNode.remove() 
    }

}

// trabalhar com o Form
const Form = {
    // selecionar os inputs:
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),
    
    // Receber os objetos com os valores de cada input:
    getValues() {
        let date  = Calculations.formatDate(Form.date.value)
        //console.log(date)
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            //date: Form.date.value
            date
        }
    },

    showInputs() {          
        // mostrar os valores dos inputs na tag <tr> criada no DOM.addTransaction   
        DOM.addTransaction(this.getValues(), Calculations.addAmount())
        //console.log(this.getValues().amount) 
        //console.log(this.getValues().date)        
    },
    
    clearInputs() {
        this.description.value = ""
        this.amount.value = ""
        this.date.value = ""
    },

    // validateFields() {
    //     const { description, amount, date } = Form.getValues()
    //     //console.log(description, amount, date)
    //     if (description.trim() === "" || amount.trim() === "" || date.trim() === "" ) {
    //         throw new Error("Por favor, preencha todos os campos")
    //     }
    // },

    submit(event) {    
        event.preventDefault()
        //Form.showInputs() 
        
        //Form.validateFields()

        Calculations.sum()
        //console.log(Amount)   
        
        Form.showInputs()
            
        Active.close()
        scrollTop()
        Form.clearInputs()       
    }
}

// guardar Form.amount.value
const Amount = []

// somar valores
const Calculations = {
    sum() {
        let income = Number(document.getElementById('income-display').innerText)
        //let format = Number(income.replace(/\D/g, "")) // \D = retira o que nao for nro
        //console.log(income)
        
        let number = Number(Form.getValues().amount)
        //console.log(number)    
        
        Amount.push(number)

        document.getElementById('income-display').innerText = income + number

        return Math.round(income + number, 2)
    },
    
    // updateValues() {
    //     document.getElementById('income-display').innerText = Calculations.sum() //+ 1
    // },

    addAmount() {
        let number = Number(Form.getValues().amount)
        //return number
        //Amount.push(number)
        //console.log(Amount.indexOf(number), number)
        return Amount.indexOf(number)
    },

    formatDate(dateFormat) {
        //let dateFormat = String(Form.getValues().date)
        const splitDate = dateFormat.split("-")
        return `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`
    }
}

// ativar/desativar class ACTIVE
const Active = {
    open() {
        document.querySelector('.test').classList.add('active')
    },
    
    close() {
        document.querySelector('.test').classList.remove('active')
    }
}

function scrollTop() {
    window.scrollTo(0, 0);
}

// botao salvar dados
// function saveButton() {
//     //const transaction = Calculations.sum()
//     const transaction = 
//     console.log(transaction)
// }

// // salvar dados usando LocalStorage
// const Storage = {
//     saveData(transaction) {
//         localStorage.setItem("dev.finance", JSON.stringify(transaction))
//     },

//     deleteData() {

//     }
// }

