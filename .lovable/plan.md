

# Dar acesso total à aba Relatórios para agendamento.comercial@mv4digital.com.br

## Situação atual
- **Usuário**: `agendamento.comercial@mv4digital.com.br` (ID: `fb232613-9cf9-49b1-b387-0cbcfd75640f`)
- **Role**: `manager`
- **Permissões atuais**: apenas `sdrs`
- **Problema**: sem permissão `reports`, o usuário não consegue nem ver a aba Relatórios no menu

## Ação necessária
Inserir permissão `reports` na tabela `module_permissions` para este usuário.

```sql
INSERT INTO module_permissions (user_id, module)
VALUES ('fb232613-9cf9-49b1-b387-0cbcfd75640f', 'reports');
```

Como o usuário já tem role `manager`, as políticas RLS existentes já concedem acesso de leitura/escrita às tabelas de métricas (sdr_metrics, funnel_daily_data, funnels). Basta adicionar a permissão do módulo para liberar a visualização da aba.

Nenhuma alteração de código necessária.

