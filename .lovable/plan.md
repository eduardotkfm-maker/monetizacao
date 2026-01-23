
# Plano: Corrigir Mapeamento de Métricas para Alcateia

## Problema Identificado

A análise dos logs revelou que a estrutura da planilha do **Alcateia** tem um **offset entre blocos diferente** da configuração padrão (13 linhas). 

### Evidências:

**Logs da coluna H para Gisele:**
```
R5:"12"   ← Week 1: Calls (correto)
R6:"1"    ← Week 1: Sales (correto)
R7:"8%"   ← Taxa de conversão
R8:"R$ 14.367,00" ← Revenue (correto)
...
R15:"SEMANAL" ← Header do Bloco 2 (linha 15)
R16:""
R17:"14"  ← Week 2: Calls
R18:"4"   ← Week 2: Sales
R19:"31%" ← Taxa (NÃO é revenue!)
R20:"57164" ← Esse valor está sendo lido como "sales" na Week 3!
```

**Problema de cálculo:**
- `firstBlockStartRow: 5`
- `blockOffset: 13`
- Bloco 2 começa em: 5 + 13 = **linha 18** (mas o header está na linha 15!)
- Bloco 3 começa em: 5 + 26 = **linha 31** (mas os dados da semana 3 estão nas linhas 28-37)

O offset padrão de 13 linhas não corresponde à estrutura real da planilha Alcateia.

## Estrutura Real da Planilha

Analisando a coluna H do Alcateia:

| Linha | Conteúdo | Bloco |
|-------|----------|-------|
| R3 | "SEMANAL" | Header |
| R5-R14 | Dados Semana 1 | Bloco 1 (10 linhas) |
| R15 | "SEMANAL" | Header Bloco 2 |
| R17-R26 | Dados Semana 2 | Bloco 2 |
| R28 | "SEMANAL" | Header Bloco 3 |
| R30-R39 | Dados Semana 3 | Bloco 3 |

**O offset real é ~13 linhas**, mas os blocos começam nas linhas **5, 17, 30, 43** (não 5, 18, 31, 44).

## Solução Proposta

### Opção 1: Ajustar configuração padrão (Recomendado)

Modificar o `DEFAULT_CONFIG` na Edge Function para refletir a estrutura correta:

```typescript
const DEFAULT_CONFIG: WeekBlockConfig = {
  firstBlockStartRow: 5,
  blockOffset: 12, // Mudou de 13 para 12
  numberOfBlocks: 4,
  dateRow: 1,
  column: 'H',
  metrics: {
    calls: 0,    // Linha relativa 1: Calls
    sales: 1,    // Linha relativa 2: Sales
    revenue: 3,  // Linha relativa 4: Revenue
    entries: 4,  // Linha relativa 5: Entries
    revenueTrend: 5,
    entriesTrend: 6,
    cancellations: 7,
    cancellationValue: 9,
    cancellationEntries: 10
  }
};
```

### Opção 2: Permitir configuração por squad

Adicionar UI no `SquadSheetsConfig` para ajustar o `row_mapping` por squad:
- Eagles: offset 13, column G
- Alcateia: offset 12, column H
- Sharks: offset 12, column H (verificar)

## Análise de Debug Adicional Necessário

Antes de implementar, preciso confirmar a estrutura real dos blocos verificando mais linhas. O problema pode ser:

1. **Offset errado**: 13 vs 12 linhas entre blocos
2. **Primeira linha errada**: 5 vs 4
3. **Métricas em posições diferentes**: Sales pode estar em offset 2 ao invés de 1 nos blocos seguintes

## Arquivo a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `supabase/functions/sync-squad-sheets/index.ts` | Adicionar debug detalhado para identificar posições corretas |
| `squad_sheets_config` | Depois, salvar configuração correta para Alcateia |

## Plano de Implementação

### Fase 1: Debug Detalhado
Adicionar log que mostra exatamente quais linhas estão sendo lidas para cada métrica:

```typescript
console.log(`[sync-squad-sheets] ${closer.name} Week ${weekNumber}:`);
console.log(`  Block starts at row: ${blockStartRow}`);
console.log(`  Calls (offset ${blockConfig.metrics.calls}): row ${blockStartRow + blockConfig.metrics.calls} = ${getBlockValue(blockConfig.metrics.calls)}`);
console.log(`  Sales (offset ${blockConfig.metrics.sales}): row ${blockStartRow + blockConfig.metrics.sales} = ${getBlockValue(blockConfig.metrics.sales)}`);
console.log(`  Revenue (offset ${blockConfig.metrics.revenue}): row ${blockStartRow + blockConfig.metrics.revenue} = ${getBlockValue(blockConfig.metrics.revenue)}`);
```

### Fase 2: Corrigir Configuração
Com base nos logs, ajustar:
- `blockOffset` para o valor correto
- `firstBlockStartRow` se necessário
- Offsets das métricas individuais

### Fase 3: Testar e Validar
1. Sincronizar Alcateia novamente
2. Verificar se os dados salvos correspondem à planilha
3. Confirmar que a taxa de conversão (sales/calls) está correta

## Resultado Esperado

Após a correção, os dados do Alcateia devem mostrar:
- **Isis Week 3**: calls=33, sales=? (valor correto da planilha), revenue=?
- Taxa de conversão calculada corretamente como `(sales / calls) * 100`

