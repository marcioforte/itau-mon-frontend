function validaLogin() {
    var user = localStorage.getItem("userLogged");
    if (!user) {
        window.location = "index.html";
    }
}

function logout() {
    localStorage.removeItem("userLogged");
    window.location = "index.html";
}

function voltar() {
    window.location = "dashmenu.html";
}

function gerarRelatorioAlarmes(){
    var dataini = document.getElementById("dtinicio").value;
    var datafim = document.getElementById("dtfinal").value;

    var dataMsg = {
        dt1: dataini, 
        dt2: datafim
    }

    var cabecalho = {
        method:'POST',
        body: JSON.stringify(dataMsg),
        headers: {
            'Content-type':'application/json'
        }
    }

    fetch("http://localhost:8080/evento/alarmes", cabecalho)
        .then(res => res.json()) //Extrai os dados do retorno para JSON
        .then(result => preencheTotalAlarmes(result));
}

function preencheTotalAlarmes(dados) {
    
    if (dados.length == 0) {
        var tabela = '<table class="table table-sm text-light"> <td><h5>Nenhum registro encontrado no periodo selecionado</h5></td>';

    tabela = tabela + "</table>"
    document.getElementById("tabela").innerHTML = tabela;
    document.getElementById("btn_export").innerHTML = null;

    } else {    
    
    var tabela = '<table class="table table-sm text-light"> <tr> <th><font color="#4B515D">Tipo de Alerta</font></th> <th><font color="#4B515D">Quantidade no periodo</font></th></tr>';
       for (var i = 0; i < dados.length; i++) {
       tabela = tabela + `<tr> 
            <td>${dados[i][0]} </td> 
            <td>${dados[i][1]} </td>
                          </tr>`          
    }

    tabela = tabela + `</tbody>
                    </table>`;
    document.getElementById("tabela").innerHTML = tabela;
    var botao = `<button class="btn btn-primary" id="btn1" onclick="exportTableToCSV('alertas_periodo.csv')">Exportar (CSV)</button>`;
    var botao1 = `<button class="btn btn-primary" id="btn1" onclick="CriaPDF();">Imprimir</button>`;

    document.getElementById("btn_export").innerHTML = botao + botao1;
}

}

function exportTableToCSV(filename) {
    var csv = [];
    var rows = document.querySelectorAll("table tr");
    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");
        for (var j = 0; j < cols.length; j++) 
            row.push(cols[j].innerText);
        csv.push(row.join(","));        
    }
    // Download CSV file
    downloadCSV(csv.join("\n"), filename);
}

function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink;
    // CSV file
    csvFile = new Blob([csv], {type: "text/csv"});
    // Download link
    downloadLink = document.createElement("a");
    // File name
    downloadLink.download = filename;
    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);
    // Hide download link
    downloadLink.style.display = "none";
    // Add the link to DOM
    document.body.appendChild(downloadLink);
    // Click download link
    downloadLink.click();
}

function CriaPDF() {
    var minhaTabela = document.getElementById("tabela").innerHTML;
    var style = "<style>";
    style = style + "table {width: 100%;font: 20px Calibri;}";
    style = style + "table, th, td {border: solid 1px #DDD; border-collapse: collapse;";
    style = style + "padding: 2px 3px;text-align: center;}";
    style = style + "</style>";
    // CRIA UM OBJETO WINDOW
    var win = window.open('', '', 'height=800,width=700');
    win.document.write('<html><head>');
    win.document.write('<title>Relatório de Alarmes</title>');   // <title> CABEÇALHO DO PDF.
    win.document.write(style);                                     // INCLUI UM ESTILO NA TAB HEAD
    win.document.write('</head>');
    win.document.write('<body>');
    win.document.write('<br>');
    win.document.write('<center><font color="#4B515D" face="Verdana, Geneva, sans-serif"><h3>Relatório de quantidade de alertas no período</h3><center>');
    win.document.write(minhaTabela);                          // O CONTEUDO DA TABELA DENTRO DA TAG BODY
    win.document.write('</body></html>');
    win.document.close();                                            // FECHA A JANELA
    win.print();                                                            // IMPRIME O CONTEUDO
}