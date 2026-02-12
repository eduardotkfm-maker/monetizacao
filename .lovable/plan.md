
# Reestruturacao de Squads e Closers

## Resumo
Remover os closers Isis e Carlos do sistema, migrar Gisele e Tainara do squad Alcateia para o Eagles, e eliminar o squad Alcateia. O sistema passara a ter apenas 2 squads: **Eagles** (Deyvid, Hannah, Gisele, Tainara) e **Sharks** (Leandro).

## Dados Afetados

| Closer | Acao | Metricas historicas |
|--------|------|---------------------|
| Isis | Remover | 12 registros (serao deletados) |
| Carlos | Remover | 8 registros (serao deletados) |
| Gisele | Mover para Eagles | 16 registros (mantidos) |
| Tainara | Mover para Eagles | 15 registros (mantidos) |

**Squad Alcateia**: sera removido junto com sua config de planilha e permissoes associadas.

## Etapas

### 1. Migration SQL (banco de dados)
- Mover Gisele e Tainara para o squad Eagles (`squad_id` atualizado)
- Deletar metricas de Isis e Carlos
- Deletar goals de Isis e Carlos (se existirem)
- Deletar user_entity_links de Isis e Carlos (se existirem)
- Deletar closers Isis e Carlos
- Deletar `squad_sheets_config` do Alcateia
- Deletar `module_permissions` com module = 'alcateia'
- Deletar squad Alcateia

### 2. Codigo - Remover referencias ao Alcateia
Arquivos que precisam de alteracao:

- **`src/components/dashboard/Sidebar.tsx`**: Remover item "Squad Alcateia" do menu, remover 'alcateia' do tipo `ModuleId`
- **`src/components/dashboard/AdminPanel.tsx`**: Remover 'alcateia' do array `MODULES`
- **`src/components/dashboard/BottomNavigation.tsx`**: Remover 'alcateia' da verificacao `isSquadActive`
- **`src/pages/Index.tsx`**: Remover case 'alcateia' do switch e da lista de modulos validos
- **`src/hooks/useMetrics.ts`**: Remover logica `isAlcateia` (todos os squads passam a usar calculo de vendas liquidas)
- **`src/components/dashboard/closer/CloserDetailPage.tsx`**: Remover logica `isAlcateia` (usar vendas liquidas para todos)
- **`src/components/dashboard/SquadSection.tsx`**: Remover case 'alcateia' do switch de estilos
- **`src/components/dashboard/CombinedMetricCard.tsx`**: Remover variant 'alcateia'
- **`src/components/dashboard/MetricCard.tsx`**: Remover variant 'alcateia'
- **`src/components/dashboard/GoalsConfig.tsx`**: Verificar e remover filtros do Alcateia

### 3. Impacto no calculo de vendas liquidas
Com o fim do Alcateia, a excecao "Alcateia exibe bruto" deixa de existir. **Todos os squads passarao a usar Net Sales** (Vendas Brutas - Cancelamentos), simplificando a logica.

### 4. CSS/Tailwind (opcional - limpeza)
As variaveis CSS `--alcateia` e `--alcateia-light` e a config Tailwind podem ser removidas, mas nao causam erro se mantidas.
