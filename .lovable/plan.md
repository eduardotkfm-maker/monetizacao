

# Ajuste dos Funis no Módulo de Relatórios

## Situação Atual vs. Desejada

| Atual | Ação | Novo Nome |
|-------|------|-----------|
| Implementação | Merge → Implementação Julia | sdr_metrics: renomear |
| Implementação Carlos | Merge → Implementação Julia | sdr_metrics: renomear, desativar funil |
| Implementação Dienifer | Merge → Implementação Julia | sdr_metrics: renomear, desativar funil |
| Implementaçao Julia (typo) | Corrigir nome | Implementação Julia |
| SS Cleiton | Renomear | Social Selling Cleiton |
| SS Julia | Renomear | Social Selling Julia |
| Orgânico Cleiton | Renomear | Aplicação Orgânico Cleiton |
| MPM | Desativar | — |
| Reels magnético | Desativar | — |
| Teste | Manter | — |
| 50 Scripts | Manter | — |
| Mentoria Julia | Manter | — |
| Mentoria Cleiton | Manter | — |

**Novos funis a criar:**
- Indicação Cleiton
- Indicação Julia
- Indicação Interna
- Aplicação Orgânico Julia

## Operações

### 1. Renomear funis na tabela `funnels`
- "Implementaçao Julia" → "Implementação Julia"
- "SS Cleiton" → "Social Selling Cleiton"
- "SS Julia" → "Social Selling Julia"
- "Orgânico Cleiton" → "Aplicação Orgânico Cleiton"

### 2. Merge dos funis de implementação
- Atualizar `sdr_metrics.funnel` de "Implementação", "Implementação Carlos", "Implementação Dienifer" → "Implementação Julia"
- Atualizar `sdr_metrics.funnel` de "SS Cleiton" → "Social Selling Cleiton", "SS Julia" → "Social Selling Julia", "Orgânico Cleiton" → "Aplicação Orgânico Cleiton"
- Mover `user_funnels` e `sdr_funnels` dos funis mergeados para "Implementação Julia"
- Desativar funis: "Implementação", "Implementação Carlos", "Implementação Dienifer"

### 3. Desativar funis removidos
- MPM (`is_active = false`)
- Reels magnético (`is_active = false`)

### 4. Criar novos funis
- Indicação Cleiton, Indicação Julia, Indicação Interna, Aplicação Orgânico Julia

### 5. Atualizar a `ReportsPage`
- Nenhuma alteração de código necessária — a página já lista todos os funis ativos via RPC `get_all_funnels_summary`

### Impacto nos dados
- 73 registros em `sdr_metrics` serão renomeados (10 "Implementação" + 31 "Implementação Carlos" + 32 "Implementação Dienifer")
- Dados históricos preservados, apenas o campo `funnel` será atualizado

