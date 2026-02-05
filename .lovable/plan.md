
# Correção do Deslocamento de Data em Adições Manuais

## Problema Identificado

As datas estão sendo deslocadas para um dia anterior devido ao uso de funções que interpretam strings de data como UTC:

1. **`parseISO()`** - Interpreta "2026-02-05" como `2026-02-05T00:00:00Z` (UTC)
2. **`new Date(string)`** - Mesmo comportamento de interpretar como UTC

Para usuários no Brasil (UTC-3), isso resulta em:
- `2026-02-05T00:00:00Z` = `2026-02-04T21:00:00-03:00` (dia anterior)

## Locais Afetados

| Arquivo | Linha | Problema |
|---------|-------|----------|
| SquadMetricsForm.tsx | 96-97 | `parseISO()` em `detectPeriodType()` |
| SquadMetricsForm.tsx | 192 | `parseISO()` no `defaultValues` |
| SquadMetricsForm.tsx | 211 | `parseISO()` no `useEffect` de reset |
| SDRWeeklyComparisonChart.tsx | 47 | `parseISO()` no agrupamento semanal |
| CloserWeeklyComparisonChart.tsx | 47 | `parseISO()` no agrupamento semanal |
| MetricsTable.tsx | 156-158 | `new Date()` na exibição |
| MetricsForm.tsx | 67, 70 | `new Date()` no `defaultValues` |
| PeriodFilter.tsx | 32-33, 89-90 | `new Date()` na exibição |
| useMetrics.ts | 175, 285 | `new Date()` na referência |

## Solução

Substituir todas as ocorrências de `parseISO()` e `new Date(string)` pela função `parseDateString()` que já existe no projeto e faz o parsing correto no timezone local.

```typescript
// De (incorreto - interpreta como UTC):
const date = parseISO(metric.period_start);
const date = new Date(metric.period_start);

// Para (correto - interpreta no timezone local):
import { parseDateString } from '@/lib/utils';
const date = parseDateString(metric.period_start);
```

## Arquivos a Modificar

1. **`src/components/dashboard/SquadMetricsForm.tsx`**
   - Linha 5: Remover `parseISO` da importação de date-fns
   - Linha 17: Adicionar `parseDateString` à importação de utils
   - Linhas 96-97: Trocar `parseISO` por `parseDateString`
   - Linha 192: Trocar `parseISO` por `parseDateString`
   - Linha 211: Trocar `parseISO` por `parseDateString`

2. **`src/components/dashboard/sdr/SDRWeeklyComparisonChart.tsx`**
   - Linha 13: Remover `parseISO` da importação
   - Adicionar importação de `parseDateString`
   - Linha 47: Trocar `parseISO` por `parseDateString`

3. **`src/components/dashboard/closer/CloserWeeklyComparisonChart.tsx`**
   - Linha 13: Remover `parseISO` da importação
   - Adicionar importação de `parseDateString`
   - Linha 47: Trocar `parseISO` por `parseDateString`

4. **`src/components/dashboard/MetricsTable.tsx`**
   - Adicionar importação de `parseDateString`
   - Linhas 156-158: Trocar `new Date()` por `parseDateString()`

5. **`src/components/dashboard/MetricsForm.tsx`**
   - Adicionar importação de `parseDateString`
   - Linhas 67, 70: Trocar `new Date()` por `parseDateString()`

6. **`src/components/dashboard/PeriodFilter.tsx`**
   - Adicionar importação de `parseDateString`
   - Linhas 32-33, 89-90: Trocar `new Date()` por `parseDateString()`

7. **`src/hooks/useMetrics.ts`**
   - Adicionar importação de `parseDateString`
   - Linhas 175, 285: Trocar `new Date()` por `parseDateString()`

## Resultado Esperado

Após as correções:
- As datas selecionadas no formulário serão salvas exatamente como escolhidas
- As datas exibidas nas tabelas e gráficos corresponderão às datas no banco de dados
- O comportamento será consistente independente do timezone do usuário
