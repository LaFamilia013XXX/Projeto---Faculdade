// Realizando a seleção de elementos da página
const buttonLogout = document.getElementById('buttonLogout');
const nome = document.querySelector('#first');
const email = document.querySelector('#second');
const cookie = document.cookie;
const buttonEntrada = document.querySelector('#entradaProduto');

// Funções da página -->

function getCookie(name) {
    const cookie = document.cookie;
    const separandoCookie = cookie.split('; ');
    for( let buscando of separandoCookie) {
        const [cookieNome, cookieValor] = buscando.split('=');
        if(cookieNome === name) {
            return decodeURIComponent(cookieValor);
        }
    }

    return null
}

// <-- FIM

// --> Definindo variáveis a serem usadas no front-end - Nome e E-mail;
const nameUSer = getCookie('name'); 
const emailUSer = getCookie('email');

nome.innerHTML = nameUSer;
email.innerHTML = emailUSer;

// <-- FIM 


// eventos da página -->

// Realiza o logout do sistema
buttonLogout.addEventListener('click', () => {
    fetch('/auth/logout', {
        method: 'POST',
    })
    .then(response => {
        window.location.href = '/login';
    })
    .catch(error => {
        console.error('Erro ao fazer logout:', error);
    });
});



fetch('/entradas/produtos')
.then(response => {
  if(!response.ok) {
    throw new Error('Erro ao buscar os dados');
  }
  return response.json();
})
.then(data => {

  let entrada_produtos = data.entradas

  let i = 0;
  const ul = document.querySelector('#tbody')

  entrada_produtos.forEach((item) => {

    let tr = document.createElement('tr');

    let  td_id_produto = document.createElement('td');
    td_id_produto.setAttribute('id', 'id_prod');
    let  td_nome_produto = document.createElement('td');
    td_nome_produto.setAttribute('id', 'id_nome_prod');
    let  td_data_produto = document.createElement('td');
    td_data_produto.setAttribute('id', 'id_data_prod');
    let  td_preco_total_produto = document.createElement('td');
    td_preco_total_produto.setAttribute('id', 'id_preco_total_prod');
    let  td_preco_unit_produto = document.createElement('td');
    td_preco_unit_produto.setAttribute('id', 'id_preco_unit_prod');
    let  td_qtd_comp_prod = document.createElement('td');
    td_qtd_comp_prod.setAttribute('id', 'id_qtd_comp_prod');
   
    // tranformando a data em valor válido.
    let transformando_data = new Date(item.data_entrada).toLocaleDateString()
    

    td_id_produto.innerHTML = item.id
    td_nome_produto.innerHTML = item.nome_produto
    td_data_produto.innerHTML = transformando_data
    td_preco_total_produto.innerHTML =  `R$ ${item.preco_total}`
    td_preco_unit_produto.innerHTML = `R$ ${item.preco_unitario}`
    td_qtd_comp_prod.innerHTML = item.qtd_comprada

    tr.appendChild(td_id_produto)
    tr.appendChild(td_nome_produto)
    tr.appendChild(td_data_produto)
    tr.appendChild(td_qtd_comp_prod)
    tr.appendChild(td_preco_unit_produto)
    tr.appendChild(td_preco_total_produto)

      if (i % 2 == 0) {
        tr.setAttribute('class', 'linha-par');
      } else {
        tr.setAttribute('class', 'linha-impar');
      }

      ul.appendChild(tr);
      i++
  })


})
.catch(error => {
  console.error("Erro:", error);
});

// <-- FIM

// <-- FIM 

function atribuirValorTotal(listaProdutos) {
  for (let i = 0; i < listaProdutos.length; i++) {
    listaProdutos[i].valorTotal = (listaProdutos[i].quantidade * listaProdutos[i].preco);
  }
}


function filtrar() {
  var input,
    ul,
    tr,
    td_id_produto,
    td_nome_produto,
    td_data_produto,
    td_preco_total_produto,
    td_preco_unit_produto,
    td_qtd_comp_prod,
    count = 0;

  input = document.querySelector('#searchbar');
  ul = document.querySelector('#tbody');

  filter = input.value.toUpperCase();

  tr = ul.getElementsByTagName("tr");

  // Esconde todas as linhas da tabela
  for (let i = 0; i < tr.length; i++) {
    tr[i].style.display = 'none'; 
  }

  // Mostra as linhas que correspondem à pesquisa
  for (let i = 0; i < tr.length; i++) {

    td_nome_produto = tr[i].querySelector('#id_nome_prod').innerHTML;

    if (td_nome_produto.toUpperCase().indexOf(filter) > -1) {
      tr[i].style.display = 'table-row'; // Mostra a linha
    }
  }
}


