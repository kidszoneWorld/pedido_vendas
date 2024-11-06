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
        html2canvas: { scale: 2, windowWidth: 1400 }, // Largura de 1200px
        jsPDF: { unit: "px", format: [1200, 929], orientation: "portrait" }, // Tamanho da página ajustado
        pagebreak: { mode: 'avoid-all' } // Evita quebras de página
    };

        // Gera e baixa o PDF
        html2pdf().set(options).from(content).save().then(() => {
            // Restaura a exibição dos elementos após a geração do PDF
            elementsToHide.forEach(el => el.style.display = 'block');
        });
});