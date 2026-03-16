# Distrital Analytics

Dashboard em React para análise de dados de planilhas (Excel/CSV). Tema escuro e layout responsivo.

## Como rodar

```bash
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173).

## Uso

1. Na tela inicial, **envie um arquivo** (.xlsx, .xls ou .csv) arrastando ou clicando na área.
2. O dashboard exibe:
   - **Cards de resumo** com totais e médias das colunas numéricas
   - **Gráfico de evolução** (se houver coluna de data e colunas numéricas)
   - **Tabela** com busca e paginação
3. Use **"Trocar planilha"** para carregar outro arquivo.

## Configurar colunas da sua planilha

Edite `src/config/columns.ts`:

- **NUMERIC_COLUMN_KEYS**: nomes das colunas que são números (para totais e gráficos).
- **DATE_COLUMN_KEY**: nome da coluna de data (para o gráfico no tempo). Use `null` se não houver.

Quando você tiver a lista dos nomes das colunas da sua planilha, basta colar nesse arquivo e indicar quais são numéricas e qual é a de data.

## Build

```bash
npm run build
npm run preview
```
