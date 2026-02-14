

# Adicionar Confirmacao de Exclusao em Reunioes

## Problema
Notas e itens de acao podem ser deletados com um unico clique, sem confirmacao. Isso causou perda de dados irrecuperavel.

## Solucao
Adicionar dialogo de confirmacao (AlertDialog) antes de excluir:
- Notas de reuniao
- Itens de acao (plano de acao)
- Reunioes inteiras

## Alteracoes

### 1. `src/components/dashboard/meetings/MeetingNotes.tsx`
- Adicionar AlertDialog ao botao de deletar nota
- Exibir mensagem "Tem certeza que deseja excluir esta nota? Esta acao nao pode ser desfeita."

### 2. `src/components/dashboard/meetings/ActionItems.tsx`
- Adicionar AlertDialog ao botao de deletar item de acao
- Exibir mensagem "Tem certeza que deseja excluir esta acao? Esta acao nao pode ser desfeita."

### 3. `src/components/dashboard/meetings/MeetingsPage.tsx`
- Verificar se a exclusao de reuniao ja possui confirmacao; caso nao, adicionar AlertDialog tambem.

Nenhuma alteracao de banco de dados e necessaria.
