
# Configurar Usuarios Closer como Role "User" com Vinculos

## Resumo
Configurar 3 contas de usuario com role "user" e vincula-las aos respectivos closers para acesso autonomo aos dados.

## Estado Atual

| Email | Role Atual | Vinculo Atual |
|-------|-----------|---------------|
| closer1.juliaottoni@mv4digital.com.br | viewer | Nenhum |
| closer2.juliaottoni@mv4digital.com.br | user | Nenhum |
| closer3.juliaottoni@mv4digital.com.br | user | Nenhum |

## Alteracoes Necessarias

### 1. Atualizar role do closer1 para "user"
O closer1 esta como "viewer" e precisa ser alterado para "user".

### 2. Criar vinculos na tabela `user_entity_links`

| Email | Closer Vinculado | Closer ID |
|-------|-----------------|-----------|
| closer1.juliaottoni@mv4digital.com.br | Tainara | e87f0aef-ebfb-4f3a-9903-50ed81f40065 |
| closer2.juliaottoni@mv4digital.com.br | Gisele | c6d6a78f-4b19-4860-ae98-f1d9ea2cb9e4 |
| closer3.juliaottoni@mv4digital.com.br | Hannah | cab5f412-23bc-4239-bc2c-b82fb473a093 |

### 3. Atualizar permissoes de modulo
Remover permissoes de modulo desnecessarias do closer1 (dashboard, eagles) pois usuarios com role "user" acessam o UserDashboard diretamente.

## Detalhes Tecnicos

SQL a ser executado:

```sql
-- 1. Atualizar role do closer1 para 'user'
UPDATE user_roles SET role = 'user' 
WHERE user_id = 'ec25c5c8-8c92-4cd8-8837-10f687898241';

-- 2. Limpar permissoes de modulo do closer1 (users acessam UserDashboard)
DELETE FROM module_permissions 
WHERE user_id = 'ec25c5c8-8c92-4cd8-8837-10f687898241';

-- 3. Criar vinculos user <-> closer
INSERT INTO user_entity_links (user_id, entity_type, entity_id) VALUES
('ec25c5c8-8c92-4cd8-8837-10f687898241', 'closer', 'e87f0aef-ebfb-4f3a-9903-50ed81f40065'),
('f0b684e9-89b7-4590-bc59-84bb1e3b8991', 'closer', 'c6d6a78f-4b19-4860-ae98-f1d9ea2cb9e4'),
('e3dc1360-aae3-45b7-934a-7c2efbdb70f5', 'closer', 'cab5f412-23bc-4239-bc2c-b82fb473a093');
```

Nenhuma alteracao de codigo e necessaria -- a infraestrutura de UserDashboard e RLS ja suporta usuarios com role "user" vinculados a closers.
