
# Plano: Melhorar UX/UI da Adição de Métricas Manuais para Closers

## Problema Identificado

O formulário atual de métricas para Closers (`SquadMetricsForm`) é:
- **Complexo demais**: 12 campos distribuídos em 3 seções
- **Visual desatualizado**: Sem ícones, cores ou hierarquia visual
- **Muitos passos**: O usuário precisa entender tipo de período, datas, múltiplos valores
- **Inconsistente**: Design diferente do formulário SDR (que já foi melhorado)

## Solução Proposta

Redesenhar completamente o `SquadMetricsForm` e `SquadMetricsDialog` seguindo o padrão moderno já aplicado no SDR, com:

### 1. Novo Design Visual

| Elemento | Antes | Depois |
|----------|-------|--------|
| Seletor de Closer | Select básico | Select com avatar/inicial colorida |
| Seletor de Data | Apenas calendário | Calendário + botões "Hoje", "Ontem" |
| Tipo de Período | Toggle Group simples | Toggle Group com ícones destacados |
| Campos numéricos | Inputs básicos | Inputs com ícones coloridos por categoria |
| Seções | Divisórias com texto | Cards com gradientes e ícones |

### 2. Reorganização dos Campos

```text
┌─────────────────────────────────────────────────────────────┐
│  [🔵 Closer Selector com Avatar]                            │
├─────────────────────────────────────────────────────────────┤
│  [📅 Tipo de Período] [Dia] [Semana] [Mês]                  │
├─────────────────────────────────────────────────────────────┤
│  [📆 Data]                        [Hoje] [Ontem]            │
│   Período: 03/02/2026 a 09/02/2026                          │
├─────────────────────────────────────────────────────────────┤
│  ⚡ MÉTRICAS PRINCIPAIS                                     │
│  ┌────────────┐  ┌────────────┐                             │
│  │ 📞 Calls   │  │ 🎯 Vendas  │                             │
│  │    [___]   │  │    [___]   │                             │
│  └────────────┘  └────────────┘                             │
├─────────────────────────────────────────────────────────────┤
│  💰 FATURAMENTO                                             │
│  ┌────────────┐  ┌────────────┐                             │
│  │ 💵 Fatur.  │  │ 💵 Entradas│                             │
│  │  R$ [___]  │  │  R$ [___]  │                             │
│  ├────────────┤  ├────────────┤                             │
│  │ 📈 Tend.   │  │ 📈 Tend.   │                             │
│  │  R$ [___]  │  │  R$ [___]  │                             │
│  └────────────┘  └────────────┘                             │
├─────────────────────────────────────────────────────────────┤
│  🔴 CANCELAMENTOS (colapsável)                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │ ❌ Qtd   │  │ 💸 Valor │  │ 💸 Ent.  │                   │
│  │   [___]  │  │  R$ [__] │  │  R$ [__] │                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

### 3. Funcionalidades de Atalho

- **Botões de data rápida**: "Hoje", "Ontem", "Esta Semana"
- **Preview do período**: Mostrar "Período: 03/02 a 09/02" em tempo real
- **Seção de cancelamentos colapsável**: Oculta por padrão, expande ao clicar
- **Indicadores visuais de campos obrigatórios**

### 4. Cores e Ícones por Categoria

| Categoria | Cor | Ícones |
|-----------|-----|--------|
| Performance | Azul | Phone, Target |
| Faturamento | Verde | DollarSign, TrendingUp |
| Cancelamentos | Vermelho | XCircle, AlertTriangle |

## Arquivos a Modificar

| Arquivo | Mudança |
|---------|---------|
| `src/components/dashboard/SquadMetricsForm.tsx` | Redesign completo com novo visual |
| `src/components/dashboard/SquadMetricsDialog.tsx` | Backdrop blur, header melhorado |
| `src/components/dashboard/PeriodTypeSelector.tsx` | Melhorar visual com cores |

## Seção Técnica

### Componente MetricInput Reutilizável

Criar helper component igual ao usado no SDR:

```tsx
function MetricInput({ icon: Icon, label, iconColor, children }) {
  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-1.5">
        <div className={cn("p-1 rounded-md", iconBgColor)}>
          <Icon className={cn("h-3.5 w-3.5", iconColor)} />
        </div>
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </div>
      {children}
    </div>
  );
}
```

### Collapsible para Cancelamentos

Usar `@radix-ui/react-collapsible` (já instalado) para seção opcional:

```tsx
<Collapsible open={showCancellations} onOpenChange={setShowCancellations}>
  <CollapsibleTrigger asChild>
    <Button variant="ghost" className="w-full justify-between">
      <span>Cancelamentos</span>
      <ChevronDown className={cn("transition-transform", open && "rotate-180")} />
    </Button>
  </CollapsibleTrigger>
  <CollapsibleContent>
    {/* Campos de cancelamento */}
  </CollapsibleContent>
</Collapsible>
```

### Quick Date Buttons

```tsx
const setQuickDate = (type: 'today' | 'yesterday' | 'thisWeek') => {
  const today = new Date();
  switch (type) {
    case 'today':
      form.setValue('selected_date', today);
      form.setValue('period_type', 'day');
      break;
    case 'yesterday':
      form.setValue('selected_date', subDays(today, 1));
      form.setValue('period_type', 'day');
      break;
    case 'thisWeek':
      form.setValue('selected_date', today);
      form.setValue('period_type', 'week');
      break;
  }
};
```

## Benefícios Esperados

1. **Redução de tempo de entrada**: Atalhos de data reduzem cliques
2. **Menos erros**: Hierarquia visual guia o usuário
3. **Consistência**: Mesmo padrão visual do SDR
4. **Entrada mais rápida para cancelamentos zero**: Seção colapsada por padrão
5. **Feedback visual**: Cores indicam categorias de dados

## Ordem de Implementação

1. Atualizar `PeriodTypeSelector.tsx` com cores e melhor visual
2. Redesenhar `SquadMetricsForm.tsx` com novo layout
3. Melhorar `SquadMetricsDialog.tsx` com backdrop e header
4. Testar fluxo completo de adição de métrica
