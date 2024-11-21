// Inicializa o array 'compra' com dados armazenados no sessionStorage
let compra = JSON.parse(sessionStorage.getItem('compra')) || [];

// Busca dados dos produtos cadastrados no banco
fetch('/chamada/produto')
.then(response => {
    if (!response.ok) throw new Error('Erro ao buscar os dados');
    return response.json();
})
.then(data => construirTabela(data)) //Chama a função que constroi a tabela e exibe os produtos encontrados
.catch(error => console.error('Erro:', error));

function construirTabela(dados){
  let i = 0;
  const produtos = dados.produtos;

  const tabela = document.querySelector('#tabelaProdutos');
  const template = document.querySelector('#produto-template');

  produtos.forEach(item => {
    if(item.qtd_TotProduto <= 0) return;

    const td = template.content.cloneNode(true);  // Clona o conteúdo do template

    // Popula o conteúdo do clone com os dados do produto
    td.querySelector('#prod').textContent = item.nome_Prd;
    td.querySelector('#vlrUnitario').textContent = `R$ ${item.vlr_Unit}`;

    
    // Percorre pelo "sessionStorage" para verificar se o produto já foi armazenado
    for(let i of compra){
      if(i.nome == item.nome_Prd){
        td.querySelector('.qtdAtual').textContent = i.qtd;

        // Carrega o valor total
        let totalElemento = td.querySelector('#vlrTotal');
        let totalText = parseFloat(totalElemento.textContent.replace(/^R\$ /, '').replace(/\./g, '').replace(/(\d{2})$/, '.$1'));
        let produto = parseFloat(item.vlr_Unit) * i.qtd;
        totalElemento.innerHTML = `R$ ${(totalText + produto).toFixed(2)}`;
      }
    }
    let tr = td.querySelector('tr');
    tabela.appendChild(td); // Adiciona a linha à tabela
    if (i % 2 == 0) tr.setAttribute('class', 'linha-par');
    else tr.setAttribute('class', 'linha-impar');
    i++;
  })
  verificaClick(tabela); // Chama a função que verifica os clicks na tabela
}

function verificaClick(tabela){
  tabela.addEventListener('click', (e) => {
    const tag = e.target;
    let span = tag.parentElement;
    const tr = span.parentElement;
    const spanQtd = span.querySelector('.qtdAtual');

    if(tag.classList.contains('addProdutos')){
      atualizaValorTotal(tr,'add');
      
    }
    if(tag.classList.contains('removeProdutos')){
      atualizaValorTotal(tr,'remove');
    }
  })
};

// Função que realiza conta do valor TOTAL (qtd * valor unitario) e adiciona no front
function atualizaValorTotal (tr,button){
  let valorUni = tr.querySelector('#vlrUnitario').textContent;
  let valorTotal = tr.querySelector('#vlrTotal');
  

  valorUni = parseFloat(valorUni.replace(/^R\$ /, '').replace(/\./g, '').replace(/(\d{2})$/, '.$1'));
  let qtdAtual = tr.querySelector('.qtdAtual').textContent;
  qtdAtual = parseFloat(qtdAtual);

  if(button == 'add') {
    qtdAtual++;
  }
  else if(button === 'remove' && qtdAtual > 0) qtdAtual--;

  tr.querySelector('.qtdAtual').textContent = qtdAtual;
  const resultado = (qtdAtual * valorUni).toFixed(2);
  valorTotal.innerHTML = `R$ ${resultado}`;
  armazenarCompra(tr);
}

// Função para adicionar ou remover um item do sessionStorage/carrinho
function armazenarCompra(tr){
  const nome = tr.querySelector('#prod').textContent; // Obtem o nome do produto
  const valor = tr.querySelector('#vlrTotal').textContent; // Obtem o valor
  let qtd = tr.querySelector('.qtdAtual').textContent;
  qtd = Number(qtd);

  // Filtra os produtos para atualizar a qtd ou remover se for 0
  let igual = false; // booleano para verificar se o produto já existe no sessionStorage
  compra = compra.filter(produto => {
      if(nome == produto.nome){
          produto.qtd = qtd;
          produto.valor = valor;
          igual = true;
      }
      return produto.qtd > 0;
  })

  // Se o produto não for encontrado no sessionStorage, adiciona-o como um novo item
  if(!igual) compra.push({'nome': nome,'qtd': qtd, 'valor': valor});
  sessionStorage.setItem('compra', JSON.stringify(compra)); 

  return true;
}


// Função que realiza a filtragem de valores após uma pesquisa
function filtrar() {
  var input,tabela,tr,td_nome;
  input = document.querySelector('#searchbar');
  tabela = document.querySelector('#tabelaProdutos');
  filter = input.value.toUpperCase();
  tr = tabela.getElementsByTagName("tr");

  // Esconde todas as linhas da tabela
  for (let i = 1; i < tr.length; i++) {
    tr[i].style.display = 'none'; 
  }

  // Mostra as linhas que correspondem à pesquisa
  for (let i = 1; i < tr.length; i++) {
    td_nome = tr[i].querySelector('#prod').innerHTML;
    if (td_nome.toUpperCase().indexOf(filter) > -1) {
      tr[i].style.display = 'table-row'; // Mostra a linha
    }
  }
}
