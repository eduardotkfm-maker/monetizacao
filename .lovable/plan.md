
# Bloquear edição na visão "Todos os Funis"

## Objetivo

Quando o filtro de funil estiver em "Todos os Funis", os dados exibidos sao agregados (somados) e nao representam um registro individual do banco. Portanto, a edição e exclusão devem ser bloqueadas nessa visão. Somente quando um funil individual for selecionado, os botões de editar/excluir devem aparecer.

## Alterações

### Arquivo: `src/components/dashboard/sdr/SDRDetailPage.tsx`

Passar `onEditMetric` e `onDeleteMetric` como `undefined` quando nenhum funil individual estiver selecionado e o SDR tiver múltiplos funis:

```typescript
// Ao renderizar SDRDataTable, condicionar os handlers:
const isAggregatedView = !selectedFunnel && hasFunnels;

<SDRDataTable 
  metrics={displayMetrics || []} 
  showFunnelColumn={!selectedFunnel && hasFunnels}
  onEditMetric={isAggregatedView ? undefined : handleEditMetric}
  onDeleteMetric={isAggregatedView ? undefined : handleDeleteMetric}
/>
```

Isso remove automaticamente a coluna de ações (os 3 pontinhos) na tabela quando o usuário está na visão agregada, pois o componente `SDRDataTable` já verifica `hasActions = onEditMetric || onDeleteMetric` para decidir se exibe a coluna.

### Arquivo: `src/components/dashboard/sdr/SDRDetailPage.tsx` (botão Adicionar)

Tambem ocultar o botão "Adicionar" na visão agregada, ja que sem funil selecionado nao faz sentido adicionar manualmente:

```typescript
{!isAggregatedView && (
  <Button onClick={() => setShowMetricsDialog(true)} size="sm" className="gap-1.5">
    <Plus size={16} />
    <span className="hidden sm:inline">Adicionar</span>
  </Button>
)}
```

## Resultado

- Visão "Todos os Funis": tabela mostra dados somados, sem botões de edição/exclusão/adição
- Visão com funil individual selecionado: edição, exclusão e adição funcionam normalmente
- SDRs com apenas 1 funil: comportamento atual mantido (edição sempre disponível)
