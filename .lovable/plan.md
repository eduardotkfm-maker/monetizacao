
# Plano: Sincronizar Mês Selecionado com Formulário de Métricas

## Problema Identificado

Quando o usuário está visualizando dados de **Janeiro 2026** no dashboard e clica em "Adicionar Métrica", o formulário abre com a data de **Fevereiro 2026** (data atual), obrigando o usuário a navegar manualmente para o mês correto.

## Fluxo Atual

```text
Dashboard (Janeiro 2026 selecionado)
        ↓
  Clica "Adicionar Métrica"
        ↓
Formulário abre com Fevereiro 2026 ❌
```

## Fluxo Desejado

```text
Dashboard (Janeiro 2026 selecionado)
        ↓
  Clica "Adicionar Métrica"
        ↓
Formulário abre com Janeiro 2026 ✓
```

## Solução

Passar o `selectedMonth` do `SquadPage` para o `SquadMetricsDialog` e depois para o `SquadMetricsForm`, para que o formulário inicialize com o mês correto.

## Arquivos a Modificar

| Arquivo | Mudança |
|---------|---------|
| `src/components/dashboard/SquadPage.tsx` | Passar `selectedMonth` para `SquadMetricsDialog` |
| `src/components/dashboard/SquadMetricsDialog.tsx` | Receber e passar `selectedMonth` para `SquadMetricsForm` |
| `src/components/dashboard/SquadMetricsForm.tsx` | Usar `selectedMonth` como valor inicial do `selected_date` |

## Seção Técnica

### 1. SquadPage.tsx

```tsx
<SquadMetricsDialog
  open={isMetricsDialogOpen}
  onOpenChange={setIsMetricsDialogOpen}
  squadSlug={squadSlug}
  selectedMonth={selectedMonth}  // ← Adicionar
/>
```

### 2. SquadMetricsDialog.tsx

```tsx
interface SquadMetricsDialogProps {
  // ... props existentes
  selectedMonth?: Date;  // ← Adicionar
}

// Passar para o form
<SquadMetricsForm
  squadId={squad.id}
  defaultCloserId={defaultCloserId}
  defaultMetric={metric}
  selectedMonth={selectedMonth}  // ← Adicionar
  onSubmit={handleSubmit}
  isLoading={isPending}
/>
```

### 3. SquadMetricsForm.tsx

```tsx
interface SquadMetricsFormProps {
  // ... props existentes
  selectedMonth?: Date;  // ← Adicionar
}

// Usar no defaultValues
const form = useForm<SquadMetricsFormValues>({
  defaultValues: {
    selected_date: defaultMetric 
      ? new Date(defaultMetric.period_start) 
      : selectedMonth || new Date(),  // ← Usar selectedMonth
    // ...
  },
});
```

## Benefícios

1. **Consistência de dados**: O formulário reflete o contexto do dashboard
2. **Menos cliques**: Usuário não precisa navegar para o mês correto
3. **Menos erros**: Reduz risco de adicionar métrica no mês errado
4. **Experiência fluida**: O sistema "entende" o contexto do usuário
