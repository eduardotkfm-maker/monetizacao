

# Persistir Rascunhos de Texto em Reunioes

## Problema
Ao digitar uma nota ou descricao de acao e sair da aba (ou navegar para outra secao), o texto digitado e perdido antes de ser salvo.

## Solucao
Usar `localStorage` para salvar automaticamente o rascunho enquanto o usuario digita. O texto sera restaurado ao voltar para a aba/reuniao e limpo apos o envio com sucesso.

## Arquivos Alterados

### 1. `src/components/dashboard/meetings/MeetingNotes.tsx`
- Salvar o conteudo do textarea no `localStorage` com chave unica por reuniao (`draft-note-{meetingId}`)
- Ao montar o componente, carregar o rascunho do `localStorage`
- Ao enviar a nota com sucesso, limpar o rascunho do `localStorage`

### 2. `src/components/dashboard/meetings/ActionItems.tsx`
- Salvar o titulo da acao no `localStorage` com chave `draft-action-{meetingId}`
- Ao montar/abrir o formulario, carregar o rascunho
- Ao adicionar a acao com sucesso, limpar o rascunho

## Detalhes Tecnicos

Exemplo da logica para MeetingNotes:

```typescript
const STORAGE_KEY = `draft-note-${meetingId}`;

// Inicializar com rascunho salvo
const [content, setContent] = useState(() => {
  return localStorage.getItem(STORAGE_KEY) || '';
});

// Salvar no localStorage a cada alteracao
useEffect(() => {
  if (content) {
    localStorage.setItem(STORAGE_KEY, content);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}, [content, STORAGE_KEY]);

// Ao enviar com sucesso, limpar
setContent('');
localStorage.removeItem(STORAGE_KEY);
```

A mesma abordagem sera aplicada ao campo de titulo em ActionItems.

Nenhuma alteracao de banco de dados necessaria.

