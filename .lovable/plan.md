

# Plano: Corrigir Coluna da Planilha do Eagles

## Diagnóstico

A configuração do Eagles no `squad_sheets_config` está usando a **coluna H** como padrão, mas a planilha do Eagles só vai até a **coluna G**.

| Squad | Coluna de Totais |
|-------|------------------|
| Alcateia | H (padrão) |
| Sharks | H (padrão) |
| **Eagles** | **G** (diferente!) |

## Solução

Atualizar a configuração do Eagles para usar a coluna **G** em vez de **H**.

## Alteração no Banco de Dados

Atualizar o `row_mapping` do Eagles para usar coluna G:

```sql
UPDATE squad_sheets_config 
SET row_mapping = jsonb_set(
  row_mapping, 
  '{column}', 
  '"G"'
),
updated_at = now()
WHERE squad_id = 'd007406c-5354-4188-b1a7-83818abfa354';
```

## Após a Correção

1. **Disparar sincronização** do Eagles novamente
2. A edge function `sync-squad-sheets` lerá a coluna G
3. Os dados dos closers (Deyvid, Carlos, Hannah) serão restaurados

## Resultado Esperado

| Closer | Antes | Depois |
|--------|-------|--------|
| Deyvid | 0 vendas, R$ 0 | Dados corretos da coluna G |
| Carlos | 0 vendas, R$ 0 | Dados corretos da coluna G |
| Hannah | 0 vendas, R$ 0 | Dados corretos da coluna G |

## Passos

1. Executar UPDATE no banco para mudar coluna para G
2. Sincronizar planilha do Eagles
3. Verificar que os dados foram restaurados

