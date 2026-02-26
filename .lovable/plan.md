

# Reestruturar "Desempenho por Funil" com dados abertos e filtro

## Situação atual
A seção "Desempenho por Funil" mostra cards resumidos para cada funil. Ao clicar num card, o usuário é levado a uma visão detalhada com gráfico. O filtro de funil no header já existe mas controla a visão detalhada separadamente.

## Mudança proposta

Remover os cards de resumo por funil e substituir por uma **tabela aberta** com todos os dados de todos os funis visíveis de uma vez. O filtro de funil no header (Select dropdown) passa a controlar quais linhas aparecem na tabela — "Todos os Funis" mostra todas as linhas, selecionar um funil específico filtra apenas aquele.

### Alterações em `ReportsPage.tsx`
1. Remover a seção "All funnels summary cards" que renderiza `FunnelSummaryCard` em grid
2. Remover o `ArrowLeft` e a lógica de `selectedFunnelId` para navegação de detalhe
3. Substituir por uma **tabela de dados** mostrando todos os funis com colunas: Funil, Categoria, Leads, Qualificados, Agendadas, Realizadas, Vendas, Faturamento, Conversão
4. O filtro Select no header filtra as linhas da tabela (client-side, filtrando `summaries`)
5. Manter o `FunnelChart` — quando um funil é selecionado no dropdown, mostrar o gráfico dele acima da tabela
6. Os cards de totais no topo se adaptam: quando um funil é selecionado, mostram os totais daquele funil; quando "Todos", mostram o agregado

### Dados computados
- `displayedSummaries`: `selectedFunnelId ? summaries.filter(f => f.funnel_id === selectedFunnelId) : summaries`
- `totals`: recalcular com base em `displayedSummaries` em vez de `summaries`

### Nova tabela inline
Usar os componentes `Table` existentes (`@/components/ui/table`) para renderizar a tabela com scroll horizontal em mobile.

### Arquivos alterados
- `src/components/dashboard/reports/ReportsPage.tsx` — reestruturar layout

