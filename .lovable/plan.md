

# Plano: Segmentação por Mês e Transição para Dados Manuais

## Contexto

O sistema atual tem dados de **Janeiro de 2025** (mês anterior) importados via Google Sheets. A partir de **Fevereiro de 2025**, os dados serão inseridos **manualmente** em vez de sincronizados com planilhas.

## Objetivo

1. Adicionar um **seletor de mês** global para segmentar os dados
2. Manter os dados históricos (Janeiro) enquanto permite entrada manual para novos meses
3. Simplificar a navegação entre meses

## Estrutura Proposta

```text
┌─────────────────────────────────────────────────────────────┐
│  Header                                                     │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Dashboard Geral     [◀ Jan 2025 ▶] [+ Adicionar]      ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  Métricas filtradas pelo mês selecionado                    │
└─────────────────────────────────────────────────────────────┘
```

## Alterações Planejadas

### 1. Novo Componente: MonthSelector

Criar um componente de seleção de mês com:
- Setas para navegar entre meses (◀ ▶)
- Exibição do mês atual em formato "Fevereiro de 2025"
- Integração com o filtro de período existente

### 2. Atualizar PeriodFilter

Substituir o filtro de período atual por um seletor de mês mais simples:
- Remover seleção de range customizado
- Manter atalhos "Este Mês", "Mês Anterior"
- Calcular automaticamente `period_start` e `period_end` baseado no mês

### 3. Atualizar DashboardOverview e SquadPage

Integrar o novo seletor de mês:
- Inicializar com o mês atual (Fevereiro 2025)
- Filtrar métricas pelo mês selecionado

### 4. Formulário de Entrada Manual

O formulário já existe (`SquadMetricsForm`) e suporta:
- Seleção por Dia, Semana ou Mês
- Todos os campos de métricas

Adicionar melhorias:
- Botão "Adicionar Métrica" mais visível no header
- Validação para não permitir datas no mês anterior (Janeiro)

## Fluxo de Dados

| Mês | Fonte de Dados | Ação |
|-----|----------------|------|
| Janeiro 2025 | Google Sheets | Apenas visualização |
| Fevereiro 2025+ | Manual | Entrada via formulário |

## Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/components/dashboard/MonthSelector.tsx` | **Novo** - Componente de seleção de mês |
| `src/components/dashboard/PeriodFilter.tsx` | Simplificar para seleção por mês |
| `src/components/dashboard/DashboardOverview.tsx` | Integrar MonthSelector |
| `src/components/dashboard/SquadPage.tsx` | Integrar MonthSelector |
| `src/components/dashboard/closer/CloserDetailPage.tsx` | Integrar MonthSelector |

## Comportamento Esperado

1. Ao abrir o dashboard, exibe o **mês atual** (Fevereiro 2025)
2. Usuário pode navegar para meses anteriores para ver histórico
3. Botão "Adicionar Métrica" disponível em todas as páginas
4. Dados são filtrados automaticamente pelo mês selecionado

---

## Seção Técnica

### Novo Componente MonthSelector

```typescript
interface MonthSelectorProps {
  selectedMonth: Date;
  onMonthChange: (month: Date) => void;
}

// Calcula automaticamente:
// period_start = primeiro dia do mês
// period_end = último dia do mês
```

### Lógica de Filtro

A query de métricas já suporta `periodStart` e `periodEnd`. O MonthSelector irá:
1. Quando o usuário seleciona um mês, calcular:
   - `periodStart = startOfMonth(selectedDate)`
   - `periodEnd = endOfMonth(selectedDate)`
2. Passar esses valores para os hooks existentes

### Inicialização

Por padrão, inicializar com:
- `selectedMonth = new Date()` (data atual = Fevereiro 2025)
- Ao carregar, já filtra dados de Fevereiro

