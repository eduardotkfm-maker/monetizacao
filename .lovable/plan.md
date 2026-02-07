
# Modulo de Reunioes

## Objetivo

Criar um modulo completo de "Reunioes" acessivel para admins e gerentes, com funcionalidades de criar reunioes (data, hora, participantes), plano de acao (tarefas entre reunioes) e notas de reuniao.

## Banco de Dados - Novas Tabelas

### 1. `meetings` - Reunioes

| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | uuid (PK) | Identificador |
| title | text | Titulo da reuniao |
| description | text | Descricao opcional |
| meeting_date | timestamptz | Data e hora da reuniao |
| created_by | uuid | Quem criou |
| created_at | timestamptz | Criado em |
| updated_at | timestamptz | Atualizado em |
| status | text | 'scheduled', 'completed', 'cancelled' |

### 2. `meeting_participants` - Participantes

| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | uuid (PK) | Identificador |
| meeting_id | uuid (FK meetings) | Reuniao |
| user_id | uuid | Participante (ref profiles) |
| created_at | timestamptz | Adicionado em |

### 3. `meeting_notes` - Notas da reuniao

| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | uuid (PK) | Identificador |
| meeting_id | uuid (FK meetings) | Reuniao |
| content | text | Conteudo da nota |
| created_by | uuid | Autor |
| created_at | timestamptz | Criado em |
| updated_at | timestamptz | Atualizado em |

### 4. `meeting_action_items` - Plano de acao

| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | uuid (PK) | Identificador |
| meeting_id | uuid (FK meetings) | Reuniao de origem |
| title | text | Descricao da acao |
| assigned_to | uuid | Responsavel (ref profiles) |
| due_date | date | Prazo |
| status | text | 'pending', 'in_progress', 'done' |
| created_by | uuid | Quem criou |
| created_at | timestamptz | Criado em |
| updated_at | timestamptz | Atualizado em |

### RLS Policies

- Admins: acesso total (ALL) em todas as 4 tabelas
- Managers: acesso total (ALL) em todas as 4 tabelas
- Viewers/Users: sem acesso

## Frontend - Novos Arquivos

### Navegacao

- Adicionar `'meetings'` ao tipo `ModuleId` em `Sidebar.tsx`
- Novo item no menu principal: icone `CalendarDays`, label "Reunioes", visivel para admin e manager
- Rota no `Index.tsx` renderizando o componente `MeetingsPage`

### Componentes

| Arquivo | Descricao |
|---------|-----------|
| `src/components/dashboard/meetings/MeetingsPage.tsx` | Pagina principal com lista de reunioes, filtros por status e botao criar |
| `src/components/dashboard/meetings/CreateMeetingDialog.tsx` | Dialog para criar/editar reuniao (titulo, descricao, data/hora, participantes) |
| `src/components/dashboard/meetings/MeetingDetailPage.tsx` | Pagina de detalhe com 3 abas: Detalhes, Plano de Acao, Notas |
| `src/components/dashboard/meetings/MeetingNotes.tsx` | Lista e formulario de notas da reuniao |
| `src/components/dashboard/meetings/ActionItems.tsx` | Lista de acoes com status (pending/in_progress/done), responsavel e prazo |
| `src/components/dashboard/meetings/index.ts` | Barrel export |
| `src/hooks/useMeetings.ts` | Hook com queries e mutations para reunioes, notas e acoes |

### Fluxo do usuario

1. Admin/gerente acessa "Reunioes" na sidebar
2. Ve lista de reunioes com status (agendada, concluida, cancelada)
3. Clica "Nova Reuniao" - preenche titulo, data/hora, seleciona participantes da lista de usuarios
4. Ao abrir uma reuniao, ve 3 secoes em tabs:
   - **Detalhes**: info da reuniao, participantes, botao editar/cancelar
   - **Plano de Acao**: lista de acoes com checkbox de status, responsavel, prazo, botao adicionar acao
   - **Notas**: campo de texto para adicionar notas, lista de notas existentes com autor e data

## Detalhes Tecnicos

### SQL da Migracao

```sql
-- Tabela de reunioes
CREATE TABLE public.meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  meeting_date timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'scheduled',
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage meetings" ON public.meetings FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Managers can manage meetings" ON public.meetings FOR ALL
  USING (has_role(auth.uid(), 'manager'::app_role))
  WITH CHECK (has_role(auth.uid(), 'manager'::app_role));

-- Participantes
CREATE TABLE public.meeting_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id uuid NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(meeting_id, user_id)
);
ALTER TABLE public.meeting_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage meeting_participants" ON public.meeting_participants FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Managers can manage meeting_participants" ON public.meeting_participants FOR ALL
  USING (has_role(auth.uid(), 'manager'::app_role))
  WITH CHECK (has_role(auth.uid(), 'manager'::app_role));

-- Notas
CREATE TABLE public.meeting_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id uuid NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  content text NOT NULL DEFAULT '',
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.meeting_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage meeting_notes" ON public.meeting_notes FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Managers can manage meeting_notes" ON public.meeting_notes FOR ALL
  USING (has_role(auth.uid(), 'manager'::app_role))
  WITH CHECK (has_role(auth.uid(), 'manager'::app_role));

-- Plano de acao
CREATE TABLE public.meeting_action_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id uuid NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  title text NOT NULL,
  assigned_to uuid,
  due_date date,
  status text NOT NULL DEFAULT 'pending',
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.meeting_action_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage meeting_action_items" ON public.meeting_action_items FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Managers can manage meeting_action_items" ON public.meeting_action_items FOR ALL
  USING (has_role(auth.uid(), 'manager'::app_role))
  WITH CHECK (has_role(auth.uid(), 'manager'::app_role));
```

### Hook `useMeetings.ts`

- `useMeetings()` - lista reunioes com participantes
- `useCreateMeeting()` - cria reuniao + participantes
- `useUpdateMeeting()` - atualiza reuniao
- `useMeetingNotes(meetingId)` - lista notas
- `useAddNote()` - adiciona nota
- `useActionItems(meetingId)` - lista acoes
- `useAddActionItem()` - adiciona acao
- `useUpdateActionItem()` - atualiza status da acao

### Sidebar e Navegacao

Adicionar `'meetings'` ao `ModuleId`, novo item com icone `CalendarDays` na secao Principal, visivel para `isAdmin || isManager`. Adicionar case no `renderContent` do `Index.tsx`.
