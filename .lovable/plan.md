
# Corrigir duplicacao da Clara + Adicionar funil "Mentoria Cleiton" para Carlos

## Problema 1: Dados duplicados da Clara

A Clara possui **7 registros com funil vazio** em fevereiro/2026, que sao duplicatas dos dados ja existentes por funil (SS Julia / Mentoria Julia). Quando o dashboard exibe "Todos os Funis", ele soma todos os registros por data, contando esses registros vazios junto com os registros por funil, resultando em valores dobrados.

Exemplo do dia 2026-02-04:
- Registro funil vazio: activated=50
- Registro "SS Julia": activated=50
- Registro "Mentoria Julia": activated=0
- Total exibido: 100 (deveria ser 50)

### Solucao

Deletar os 7 registros com funil vazio da Clara, pois sao duplicatas dos dados ja inseridos por funil:

```sql
DELETE FROM public.sdr_metrics 
WHERE sdr_id = '172ce4ba-5f0c-4aaf-ae9b-d9f5079bb3ed' 
  AND funnel = '';
```

Registros a serem removidos (datas: 02/02, 03/02, 04/02, 05/02, 06/02, 09/02, 11/02 de 2026).

## Problema 2: Funil "Mentoria Cleiton" para Carlos

Inserir um registro semente para que o funil apareca no seletor:

```sql
INSERT INTO public.sdr_metrics (sdr_id, date, funnel, activated, scheduled, scheduled_rate, scheduled_same_day, attended, attendance_rate, sales, conversion_rate, source)
VALUES (
  'a8163c8c-174c-4752-ba46-24b82df7a03f',
  '2026-02-01',
  'Mentoria Cleiton',
  0, 0, 0, 0, 0, 0, 0, 0,
  'manual'
);
```

## Resultado esperado

- Clara: totais de ativacao corretos, sem duplicacao
- Carlos: funil "Mentoria Cleiton" disponivel no seletor de funis
- Nenhuma alteracao de codigo necessaria
