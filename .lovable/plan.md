
# Correção: "Erro ao atualizar métrica" - Funnil NULL na Edição

## Causa Raiz

No arquivo `SDRDetailPage.tsx`, linha 97, ao agregar métricas por data (quando o usuário visualiza "Todos os Funis"), o campo `funnel` é definido como `null`:

```typescript
m.funnel = null; // Clear funnel since it's aggregated
```

Quando o usuário clica em "Editar" em uma linha agregada, o `editingMetric` carrega `funnel: null`, que eventualmente pode chegar ao banco como NULL, violando a constraint NOT NULL.

## Correção

### Arquivo: `src/components/dashboard/sdr/SDRDetailPage.tsx`

**Linha 97** - Trocar `null` por string vazia:

```typescript
// De:
m.funnel = null; // Clear funnel since it's aggregated

// Para:
m.funnel = ''; // Clear funnel since it's aggregated
```

Isso garante consistência com o tipo `string` (não nullable) e com a constraint NOT NULL do banco de dados. A string vazia já é tratada corretamente em todo o fluxo: o formulário exibe "Nenhum" e o dialog envia `''` ao banco.
