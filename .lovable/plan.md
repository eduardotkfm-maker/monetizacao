
# Plano: Corrigir Sincronização de Sharks e Alcateia

## Diagnóstico Definitivo

Os logs da Edge Function revelam o problema:

| Closer | Aba Encontrada | Resultado |
|--------|----------------|-----------|
| **Hannah** (Eagles) | HANNAH | ✅ calls=9, sales=3, revenue=117997 |
| **Carlos** (Eagles) | CARLOS | ✅ calls=13, sales=3, revenue=38394 |
| **Leandro** (Sharks) | TOTAL SQUAD LEANDRO. | ❌ calls=0, sales=0, revenue=0 |
| **Isis** (Alcateia) | ISIS | ❌ calls=0, sales=0, revenue=0 |
| **Gisele** (Alcateia) | GISELE | ❌ calls=0, sales=0, revenue=0 |
| **Tainara** (Alcateia) | TAINARA | ❌ calls=0, sales=0, revenue=0 |

**Conclusão**: A Edge Function encontra as abas corretamente, mas lê **células vazias** porque as abas Alcateia/Sharks têm:
1. **Estrutura diferente** - métricas em posições diferentes (colunas ou linhas)
2. **Coluna diferente** - usando coluna B-F ao invés de G

## Causa Raiz

A configuração atual assume que **TODAS as abas** usam:
- Coluna G (SEMANAL)
- Primeira linha de dados: 5
- Offset entre blocos: 13

Mas as abas Alcateia/Sharks podem usar posições diferentes.

## Soluções Propostas

### Solução 1: Adicionar Log de Debug para Identificar Estrutura (Recomendado Primeiro)

Modificar a Edge Function para mostrar os valores das primeiras linhas de cada aba, permitindo identificar onde estão os dados reais.

```typescript
// Adicionar antes do loop de blocos
console.log(`[${closer.name}] First 20 rows of column ${blockConfig.column}:`, 
  values.slice(0, 20).map((row, i) => `Row ${i+1}: ${row[columnIndex] || 'empty'}`));
```

### Solução 2: Configuração por Squad/Aba

Se os Squads usam estruturas diferentes, criar suporte para configuração individual:

| Squad | Coluna | Primeira Linha | Offset |
|-------|--------|----------------|--------|
| Eagles | G | 5 | 13 |
| Alcateia | ? | ? | ? |
| Sharks | ? | ? | ? |

### Solução 3: Auto-Detecção de Estrutura

Implementar lógica que detecta automaticamente onde estão os dados em cada aba, procurando por padrões conhecidos.

## Plano de Implementação

### Fase 1: Diagnóstico (Implementar Agora)

Adicionar logs detalhados para visualizar os dados brutos de cada aba:

```typescript
// Mostrar conteúdo bruto das células para debug
for (const { sheetName, closer } of validSheets) {
  // ... código existente ...
  
  // DEBUG: Mostrar primeiras linhas da coluna configurada
  const debugRows = values.slice(0, 25).map((row, idx) => {
    const colValue = row[columnIndex] || '';
    return `Row ${idx + 1}: "${colValue}"`;
  });
  console.log(`[DEBUG ${closer.name}] Column ${blockConfig.column} content:`, debugRows.join(' | '));
}
```

### Fase 2: Correção

Após identificar a estrutura correta de Alcateia/Sharks, uma das opções:

1. **Ajustar a planilha** - padronizar todas as abas para usar mesma estrutura
2. **Configuração por squad** - permitir configurações diferentes por squad
3. **Auto-detecção** - detectar automaticamente a estrutura

## Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `supabase/functions/sync-google-sheets/index.ts` | Adicionar logs de debug para visualizar conteúdo bruto das células |

## Próximos Passos

1. Implementar logs de debug
2. Executar sincronização
3. Analisar logs para identificar estrutura real de Alcateia/Sharks
4. Implementar correção apropriada baseada nos dados reais

## Resultado Esperado

Com os logs de debug, poderemos ver exatamente o conteúdo das células e identificar:
- Se os dados estão em outra coluna
- Se os dados começam em outra linha
- Se a estrutura de blocos é diferente
