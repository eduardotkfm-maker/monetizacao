

# Limpeza de Logs Orfaos do Banco de Dados

## Resumo
Executar TRUNCATE nas tabelas de logs historicos que consomem ~19 MB sem utilidade, liberando ~60% do armazenamento atual.

## Alteracoes

### Migration SQL
```sql
TRUNCATE cron.job_run_details;
TRUNCATE net._http_response;
```

## Resultado Esperado
- **Antes**: ~32 MB ocupados
- **Depois**: ~13 MB ocupados
- **Liberado**: ~19 MB (60%)

Nenhuma funcionalidade sera afetada, pois os cron jobs ja foram desativados e removidos anteriormente.

