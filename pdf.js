const btPdfGeneration = document.getElementById('button_pdf');

btPdfGeneration.addEventListener("click", () => {
    
    // Seleciona os elementos que devem ser ocultados na impressão
    const elementsToHide = document.querySelectorAll('.no-print');
    
    // Oculta os elementos temporariamente
    elementsToHide.forEach(el => el.style.display = 'none');

    // Conteúdo do PDF
    const content = document.querySelector('.container');

    // Configuração do arquivo de PDF
    const options = {
        margin: 0, // Sem margem
        filename: 'pedido_venda',
        html2canvas: { 
            scale: 2, 
            windowWidth: 1200, 
            useCORS: true // Permite carregamento de imagens externas
        },
        jsPDF: { unit: "px", format: [1200, 929], orientation: "portrait" },
        pagebreak: { mode: 'avoid-all' } // Mantém tudo em uma única página
    };

    // Gera e baixa o PDF
    html2pdf().set(options).from(content).save().then(() => {
        // Restaura a exibição dos elementos após a geração do PDF
        elementsToHide.forEach(el => el.style.display = 'block');
    });
});
