

# Adicionar "Agendado no Follow Up" nas Metricas SDR

## Resumo

Adicionar uma nova coluna `scheduled_follow_up` (Agendado no Follow Up) ao sistema de metricas de SDR, permitindo entrada manual e exibicao em todos os dashboards.

## Alteracoes

### 1. Banco de Dados
Adicionar coluna `scheduled_follow_up` (integer, default 0) na tabela `sdr_metrics`.

```sql
ALTER TABLE public.sdr_metrics 
ADD COLUMN scheduled_follow_up integer NOT NULL DEFAULT 0;
```

### 2. Hook de Dados (`src/hooks/useSdrMetrics.ts`)
- Adicionar `scheduled_follow_up` na interface `SDRMetric`
- Adicionar `totalScheduledFollowUp` na interface `SDRAggregatedMetrics`
- Incluir no calculo de `calculateAggregatedMetrics`
- Incluir nas mutations de create/update

### 3. Formulario Manual (`src/components/dashboard/sdr/SDRMetricsForm.tsx`)
- Adicionar campo `scheduled_follow_up` no schema zod
- Adicionar input no grid de metricas (icone `CalendarCheck` ou similar, cor distinta)

### 4. Tabela de Dados (`src/components/dashboard/sdr/SDRDataTable.tsx`)
- Adicionar coluna "Agend. Follow Up" entre "Agendados" e "% Agend."

### 5. Dashboard Individual (`src/components/dashboard/sdr/SDRDetailPage.tsx`)
- Adicionar card "Agend. Follow Up" na secao de metricas
- Incluir na funcao local `calculateAggregatedMetrics` e `aggregateMetricsByDate`

### 6. Dashboard Geral (`src/components/dashboard/sdr/SDRDashboard.tsx`)
- Adicionar card "Agend. Follow Up" no grid consolidado

### 7. Grafico Semanal (`src/components/dashboard/sdr/SDRWeeklyComparisonChart.tsx`)
- Considerar adicionar a metrica no grafico (opcional, depende do espaco visual)

## Secao Tecnica

### Fluxo de dados
```text
sdr_metrics.scheduled_follow_up (DB)
  -> useSdrMetrics.ts (interface + aggregation)
    -> SDRDetailPage (card + table)
    -> SDRDashboard (card consolidado)
    -> SDRMetricsForm (input)
```

### Posicionamento no formulario
O campo sera adicionado na grid 2x3 existente, entre "Agendados" e "Agend. no dia", com icone `CalendarPlus` e cor `text-indigo-500` para diferenciar visualmente.

### Posicionamento na tabela
Nova coluna "Agend. FU" sera inserida apos "Agendados" e antes de "% Agend."

