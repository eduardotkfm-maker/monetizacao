
# Plano: Corrigir Mapeamento dos Valores de Cancelamento

## Diagnóstico

Analisando os logs da sincronização, identificamos o problema no mapeamento dos offsets de cancelamento. A estrutura real da planilha é diferente da configuração atual:

### Estrutura Real da Planilha (Exemplo Tainara - Semana 1)
| Row | Offset | Valor na Planilha | Campo Real |
|-----|--------|-------------------|------------|
| 5   | 0      | 15                | Calls |
| 6   | 1      | 1                 | Sales |
| 7   | 2      | 13,00%            | % Conversão |
| 8   | 3      | R$ 14.388,00      | Revenue |
| 9   | 4      | R$ 8.036,00       | Entries |
| 10  | 5      | (vazio)           | Revenue Trend |
| 11  | 6      | (vazio)           | Entries Trend |
| 12  | 7      | R$ 1,00           | Cancellations (count) |
| 13  | 8      | R$ 12.000,00      | **Valor Venda Cancelado** |
| 14  | 9      | R$ 3.200,00       | **Valor Entrada Cancelado** |

### Configuração Atual (Incorreta)
```json
{
  "cancellations": 7,      // OK
  "cancellationValue": 9,  // ERRADO - Está lendo Valor Entrada como Valor Venda
  "cancellationEntries": 10 // ERRADO - Offset inexistente, retorna 0
}
```

### Configuração Correta
```json
{
  "cancellations": 7,      // OK - Contagem de cancelamentos
  "cancellationValue": 8,  // Valor de VENDA cancelado (Row 13)
  "cancellationEntries": 9 // Valor de ENTRADA cancelado (Row 14)
}
```

## Solução

Atualizar os DEFAULT_CONFIG em ambas as edge functions para usar os offsets corretos.

## Alterações

### 1. `supabase/functions/sync-google-sheets/index.ts`

Linha ~45-62: Atualizar o DEFAULT_CONFIG:

```typescript
const DEFAULT_CONFIG: WeekBlockConfig = {
  firstBlockStartRow: 5,
  blockOffset: 13,
  numberOfBlocks: 4,
  dateRow: 1,
  column: 'G',
  metrics: {
    calls: 0,
    sales: 1,
    revenue: 3,
    entries: 4,
    revenueTrend: 5,
    entriesTrend: 6,
    cancellations: 7,
    cancellationValue: 8,     // Corrigido: era 9
    cancellationEntries: 9    // Corrigido: era 10
  }
};
```

### 2. `supabase/functions/sync-squad-sheets/index.ts`

Linha ~48-65: Atualizar o DEFAULT_CONFIG:

```typescript
const DEFAULT_CONFIG: WeekBlockConfig = {
  firstBlockStartRow: 5,
  blockOffset: 12,
  numberOfBlocks: 4,
  dateRow: 1,
  column: 'H',
  metrics: {
    calls: 0,
    sales: 1,
    revenue: 3,
    entries: 4,
    revenueTrend: 5,
    entriesTrend: 6,
    cancellations: 7,
    cancellationValue: 8,     // Corrigido: era 9
    cancellationEntries: 9    // Corrigido: era 10
  }
};
```

### 3. Atualizar configurações existentes no banco de dados

Após o deploy das edge functions, atualizar as configurações já salvas:

```sql
-- Atualizar google_sheets_config
UPDATE google_sheets_config 
SET row_mapping = jsonb_set(
  jsonb_set(row_mapping, '{metrics,cancellationValue}', '8'),
  '{metrics,cancellationEntries}', '9'
);

-- Atualizar squad_sheets_config
UPDATE squad_sheets_config 
SET row_mapping = jsonb_set(
  jsonb_set(row_mapping, '{metrics,cancellationValue}', '8'),
  '{metrics,cancellationEntries}', '9'
);
```

## Arquivos a Modificar

| Arquivo | Ação |
|---------|------|
| `supabase/functions/sync-google-sheets/index.ts` | Corrigir offsets no DEFAULT_CONFIG |
| `supabase/functions/sync-squad-sheets/index.ts` | Corrigir offsets no DEFAULT_CONFIG |

## Resultado Esperado

Após as correções e nova sincronização:
1. **Valor Venda Cancelado** (offset 8): Lerá corretamente `R$ 12.000,00`
2. **Valor Entrada Cancelado** (offset 9): Lerá corretamente `R$ 3.200,00`

## Validação

Após deploy, sincronizar novamente e verificar:
```sql
SELECT c.name, m.cancellation_value, m.cancellation_entries
FROM metrics m
JOIN closers c ON c.id = m.closer_id
WHERE m.period_start >= '2026-01-01'
ORDER BY c.name, m.period_start;
```

Os valores devem corresponder à planilha:
- `cancellation_value` = Valor na coluna "Valor Venda Cancelado"
- `cancellation_entries` = Valor na coluna "Valor Entrada Cancelado"
