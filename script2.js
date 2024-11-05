
//// Variaveis globais 
let clientesData;
let promocaoData;
let foraDeLinhaData;
let listaPrecosData;
let icmsSTData;
//// Variaveis globais 


// Inicio -- busca dos dados -------------------------------------------------------------------------------------////////

// Função para carregar o JSON de clientes
fetch('Clientes.json')
    .then(response => response.json())
    .then(data => {
        clientesData = data;
    });

// Função para carregar o JSON de promoções
fetch('Promocao.json')
    .then(response => response.json())
    .then(data => {
        promocaoData = data;
    });

// Função para carregar o JSON de fora de linha
fetch('Fora de linha.json')
    .then(response => response.json())
    .then(data => {
        foraDeLinhaData = data;
    });

// Função para carregar o JSON de lista de preços
fetch('Lista-precos.json')
.then(response => response.json())
.then(data => {
    listaPrecosData = data;
});

// Função para carregar o JSON de ICMS-ST
fetch('ICMS-ST.json')
.then(response => response.json())
.then(data => {
    icmsSTData = data;
});

// Fim -- busca dos dados -------------------------------------------------------------------------------------////////




// Inicio -- Tratamento dos dados -------------------------------------------------------------------------------------////////

// Função para buscar o produto em promoção
function buscarPromocao(cod) {
    for (let i = 1; i < promocaoData.length; i++) {
        if (promocaoData[i][0] == cod) {
            return promocaoData[i];
        }
    }
    return null;
}

// Função para verificar se o código está fora de linha
function verificarForaDeLinha(cod) {
    for (let i = 1; i < foraDeLinhaData.length; i++) {
        if (foraDeLinhaData[i][0] == cod) {
            return true;
        }
    }
    return false;
}

// Função para buscar dados na Lista de Preços
function buscarListaPrecos(cod) {
    for (let i = 1; i < listaPrecosData.length; i++) {
        if (listaPrecosData[i][2] == cod) {
            return listaPrecosData[i];
        }
    }
    return null;
}


// Fim -- Tratamento dos dados -------------------------------------------------------------------------------------////////



// Inicio -- Bloco dados do clientes-------------------------------------------------------------------------------------////////

// Função para buscar os dados do cliente pelo CNPJ
function buscarCliente(cnpj) {
    for (let i = 1; i < clientesData.length; i++) {
        if (clientesData[i][1].toString() === cnpj) {
            return clientesData[i];
        }
    }
    return null;
 }

// Função para preencher os campos ao digitar o CNPJ
document.getElementById('cnpj').addEventListener('blur', function () {
    let cnpj = this.value;
    let cliente = buscarCliente(cnpj);
    if (cliente) {
        document.getElementById('razao_social').value = cliente[3];
        document.getElementById('ie').value = cliente[2];
        document.getElementById('representante').value = cliente[15];
        document.getElementById('endereco').value = cliente[8];
        document.getElementById('bairro').value = cliente[9];
        document.getElementById('cidade').value = cliente[10];
        document.getElementById('uf').value = cliente[11];
        document.getElementById('cep').value = cliente[12];
        document.getElementById('telefone').value = cliente[4];
        document.getElementById('email').value = cliente[6];
        document.getElementById('email_fiscal').value = cliente[7];
        document.getElementById('contato').value = cliente[13];
        document.getElementById('cod_cliente').value = cliente[17];
        document.getElementById('pay').value = cliente[14];
        document.getElementById('group').value = cliente[19];
        document.getElementById('transp').value = cliente[20];
        document.getElementById('codgroup').value = cliente[18];
      
    } else {
        alert("Cliente não encontrado.");
    }
});

// Fim -- Bloco dados do clientes-------------------------------------------------------------------------------------////////




// Função para adicionar uma nova linha à tabela
document.getElementById('adicionarLinha').addEventListener('click', function () {

    let tbody = document.querySelector('#dadosPedido tbody');
    let tr = document.createElement('tr');

    for (let i = 0; i < 9; i++) {

        let td = document.createElement('td');
        let input = document.createElement('input');
        input.type = 'text';

        if (i === 0) {
            input.addEventListener('blur', function () {
                let tipoPedido = document.getElementById('tipo_pedido').value;
                let cod = this.value;
                let ufCliente = document.getElementById('uf').value; // Pegar UF do cliente

                // Verificar se o item está fora de linha
                if (verificarForaDeLinha(cod)) {
                    alert("Item fora de linha, favor digitar outro item");
                    this.value = '';
                    return;
                }

                let promocao = buscarPromocao(cod);
                let listaPrecos = buscarListaPrecos(cod);

                if (tipoPedido === 'Promoção') {
                    if (promocao) {
                        preencherLinha(tr, listaPrecos, promocao, ufCliente);
                    } else {
                        alert("Item não está em promoção, digite outro item");
                        this.value = '';
                    }
                } else if (tipoPedido === 'Venda' || tipoPedido === 'Bonificação') {
                    if (promocao) {
                        alert("Item está em promoção, favor mudar o tipo para promoção");
                        this.value = '';
                    } else if (listaPrecos) {
                        preencherLinha(tr, listaPrecos, null, ufCliente);
                    } else {
                        alert("Item não encontrado na lista de preços.");
                        this.value = '';
                    }
                }
            });
        }
        td.appendChild(input);
        tr.appendChild(td);
    }
    tbody.appendChild(tr);

});

// Função para remover a última linha da tabela
document.getElementById('excluirLinha').addEventListener('click', function () {

    let tbody = document.querySelector('#dadosPedido tbody');
    if (tbody.rows.length > 0) {
        tbody.deleteRow(tbody.rows.length - 1);
    } else {
        alert("Nenhuma linha para remover");
    }

});



// Função para preencher os dados da linha com os cálculos baseados no IPI e R$ Unitário
function preencherLinha(tr, listaPrecos, promocao = null, ufCliente) { 

        let cells = tr.getElementsByTagName('td');
        let codProduto = cells[0].querySelector('input').value; // Código do produto
        let codGroup = document.getElementById('codgroup').value; // Código do grupo do cliente

       
        // Define o código a ser usado para a busca (com ou sem codGroup)
        let codigoConcatenado = codGroup ? `${codGroup}-${codProduto}` : codProduto;


        console.log(codigoConcatenado)

        // Busca o item concatenado na lista de preços
        let precoEncontrado = listaPrecosData.find(item => item[0] === codigoConcatenado);


        //////valor IPI //////////////////////////////////////////////////////
        if (precoEncontrado) {
            // Se o código concatenado existir, atribui o valor de IPI correspondente
            cells[5].querySelector('input').value = precoEncontrado[12] * 100; // IPI
        } else {
            // Se não encontrar o código concatenado, verifica apenas pelo código do produto
            let itemPorCodigo = listaPrecosData.find(item => item[2] == codProduto);

            if (itemPorCodigo) {
                cells[5].querySelector('input').value = itemPorCodigo[12] * 100 ; // IPI correspondente ao produto
            } else {
                cells[5].querySelector('input').value = ''; // Limpa o campo se não encontrar
            }
        }
          //////valor IPI //////////////////////////////////////////////////////



        //Verifica se o produto está em promoção
        let produtoPromocao = promocaoData.find(item => item[0] == codProduto);



        /////// Valor unitário//////////////////////////////////////////////////////////////   
        if (produtoPromocao) {
            // Se o produto está em promoção, usa o valor do índice 5 (Custo cxa) da promoção
            cells[6].querySelector('input').value = produtoPromocao[5];
        } else {
            // Caso contrário, busca o item concatenado na lista de preços
            let precoEncontrado = listaPrecosData.find(item => item[0] === codigoConcatenado);
            cells[6].querySelector('input').value = precoEncontrado[11];

                }
         /////// Valor unitário//////////////////////////////////////////////////////////////  




        ///////Calcula o valor com IPI/////////////////////////////////////////////////////////////////////////////////
        if (codProduto) {
                let ipi = Number(cells[5].querySelector('input').value) / 100; // Converte o valor de IPI para decimal
                let valorUnitario = Number(cells[6].querySelector('input').value); // Valor unitário
                
                // Calcula o valor com IPI
                let valorComIPI = valorUnitario * (1 + ipi);
                cells[7].querySelector('input').value = valorComIPI.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        } else {
        cells[7].querySelector('input').value = '';
        }
        ///////Calcula o valor com IPI/////////////////////////////////////////////////////////////////////////////////



        // Preenchimento dos demais campos da linha com base nos dados da lista de preços
        if (listaPrecos) {
            cells[1].querySelector('input').value = '1'; // Quantidade
            cells[2].querySelector('input').value = listaPrecos[9]; // UV
            cells[3].querySelector('input').value = listaPrecos[10]; // Pack
            cells[4].querySelector('input').value = listaPrecos[4]; // Descrição
        }
    


        // Função para atualizar o valor total
        function atualizarValorTotal() {
            if (codProduto) {
                let quantidade = Number(cells[1].querySelector('input').value); // Quantidade digitada
                let ipi = Number(cells[5].querySelector('input').value) / 100; // Converte o valor de IPI para decimal
                let valorUnitario = Number(cells[6].querySelector('input').value); // Valor unitário
                
                // Calcula o valor com IPI
                let valorComIPI = valorUnitario * (1 + ipi);

                // Calcula o valor total com a quantidade
                let valorTotal = valorComIPI * quantidade;
                
                // Atribui o valor total à célula correspondente
                cells[8].querySelector('input').value = valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); // Formata para duas casas decimais
            } else {
                cells[8].querySelector('input').value = '';
            }
        }

        // Adiciona o evento de escuta para detectar mudanças na quantidade
        cells[1].querySelector('input').addEventListener('input', atualizarValorTotal);

        
}