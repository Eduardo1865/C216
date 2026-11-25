# C216

Repositório para a matéria C216.

## Como executar

```bash
make up-build
```

Levanta os containers necessários para executar a aplicação.

## Importação de produtos

Na tela inicial, use **Importar planilha** e selecione um arquivo `.xlsx`. A primeira aba deve ter uma linha de cabeçalho com `Nome`, `Lote`, `Data de fabricação`, `Data de validade`, `Preço` e `Estoque atual`. `Tags` é opcional; se houver mais de uma, separe-as por vírgula ou ponto e vírgula. Fotos também são opcionais.

A importação valida todas as linhas antes de salvar; se houver erro, nenhum produto do arquivo é inserido. Linhas de resumo `TOTAL` e `TOTAL GERAL` são ignoradas. Cada importação cria novos registros, então importar o mesmo arquivo novamente duplicará os produtos.

