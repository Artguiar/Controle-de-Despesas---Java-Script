const transactionsUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')

const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))
let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = ID => {
    transactions = transactions.filter(transaction => 
        transaction.id !== ID) 
    updateLocalStorage()

    init()
}
const addTransactionIntoDOM = transaction => {  // Aqui foram criadas e setadas as transacoes que buscamos do array de objetos

    const operator = transaction.amount < 0 ? '-' : '+'
    const CSSClass = transaction.amount < 0 ? 'minus' : 'plus'
    const amountWithoutOperator = Math.abs(transaction.amount)
    const li = document.createElement('li')

   li.classList.add(CSSClass)
   li.innerHTML = `
     ${transaction.name} 
     <span>${operator} R$ ${amountWithoutOperator}</span>
     <button class='delete-btn' onClick='removeTransaction(${transaction.id})'>
     X
     </button>
   ` 
   transactionsUl.append(li)

}
// Aqui foram criada e setadas as receitas, despesas e saldo total
const updateBalanceValues = () => {
    const transactionsAmounts = transactions // valor das transacoes
        .map(transaction => transaction.amount)
    const total = transactionsAmounts // valor total do saldo
        .reduce((accumulator, transaction) => accumulator + transaction, 0)
        .toFixed(2)
    const income = transactionsAmounts // valor total das receitas
        .filter(value => value > 0)
        .reduce((accumulator, value) => accumulator + value, 0)
        .toFixed(2)
    const expense = Math.abs(transactionsAmounts.filter(value => value < 0)
        .reduce((accumulator, value) => accumulator + value, 0)
        .toFixed(2))

    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`
}

 // função que ira executar o preenchimento das informacoes do estado da aplicacoa quando a pagina for carregada

 const init = () => {
    transactionsUl.innerHTML = ''
    transactions.forEach(addTransactionIntoDOM) // forEach ira iterar por todas as transaçoes no array e dummy e mostrar na tela
    updateBalanceValues()

 }

 init()

 const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
 }

 const generateID = () => Math.round(Math.random() * 1000)

 form.addEventListener('submit', event => {
    event.preventDefault() // impedimos que o form fosse enviado para lidar com os dados dentro da nossa function

    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim()

    if (transactionName === '' || transactionAmount === '') {
        alert('Por favor, preencha os dados necessários (nome) e (valor)')
        return
    } 

    const transaction = { 
        id: generateID(), 
        name: transactionName, 
        amount: Number(transactionAmount)
    }

    transactions.push(transaction)
    init()
    updateLocalStorage()

    inputTransactionName.value = ''
    inputTransactionAmount.value = ''


 })