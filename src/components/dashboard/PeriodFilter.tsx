import React, { useState } from 'react';
import { format, startOfWeek, endOfWeek, subWeeks, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface PeriodFilterProps {
  periodStart: string | undefined;
  periodEnd: string | undefined;
  onPeriodChange: (start: string | undefined, end: string | undefined) => void;
}

type PeriodOption = 'all' | 'current-week' | 'last-week' | 'this-month' | 'custom';

export function PeriodFilter({ periodStart, periodEnd, onPeriodChange }: PeriodFilterProps) {
  const [selectedOption, setSelectedOption] = useState<PeriodOption>('all');
  const [customStart, setCustomStart] = useState<Date | undefined>();
  const [customEnd, setCustomEnd] = useState<Date | undefined>();
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  const handleOptionChange = (option: PeriodOption) => {
    setSelectedOption(option);
    const today = new Date();

    switch (option) {
      case 'all':
        onPeriodChange(undefined, undefined);
        setCustomStart(undefined);
        setCustomEnd(undefined);
        break;
      case 'current-week':
        const weekStart = startOfWeek(today, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
        onPeriodChange(format(weekStart, 'yyyy-MM-dd'), format(weekEnd, 'yyyy-MM-dd'));
        break;
      case 'last-week':
        const lastWeekStart = startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
        const lastWeekEnd = endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
        onPeriodChange(format(lastWeekStart, 'yyyy-MM-dd'), format(lastWeekEnd, 'yyyy-MM-dd'));
        break;
      case 'this-month':
        const monthStart = startOfMonth(today);
        const monthEnd = endOfMonth(today);
        onPeriodChange(format(monthStart, 'yyyy-MM-dd'), format(monthEnd, 'yyyy-MM-dd'));
        break;
      case 'custom':
        setIsCustomOpen(true);
        break;
    }
  };

  const handleCustomDateApply = () => {
    if (customStart && customEnd) {
      onPeriodChange(format(customStart, 'yyyy-MM-dd'), format(customEnd, 'yyyy-MM-dd'));
      setIsCustomOpen(false);
    }
  };

  const handleClearFilter = () => {
    setSelectedOption('all');
    setCustomStart(undefined);
    setCustomEnd(undefined);
    onPeriodChange(undefined, undefined);
  };

  const getDisplayLabel = () => {
    if (!periodStart && !periodEnd) return 'Todas as semanas';
    if (periodStart && periodEnd) {
      return `${format(new Date(periodStart), 'dd/MM', { locale: ptBR })} - ${format(new Date(periodEnd), 'dd/MM', { locale: ptBR })}`;
    }
    return 'Período';
  };

  const hasActiveFilter = periodStart || periodEnd;

  return (
    <div className="flex items-center gap-2">
      <Popover open={isCustomOpen} onOpenChange={setIsCustomOpen}>
        <div className="flex items-center gap-2">
          <Select value={selectedOption} onValueChange={(value) => handleOptionChange(value as PeriodOption)}>
            <SelectTrigger className="w-[180px] bg-card border-border">
              <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Selecionar período">
                {getDisplayLabel()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-card border-border z-50">
              <SelectItem value="all">Todas as semanas</SelectItem>
              <SelectItem value="current-week">Semana atual</SelectItem>
              <SelectItem value="last-week">Última semana</SelectItem>
              <SelectItem value="this-month">Este mês</SelectItem>
              <SelectItem value="custom">Período personalizado</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilter && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearFilter}
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <PopoverContent className="w-auto p-4 bg-card border-border z-50" align="end">
          <div className="space-y-4">
            <div className="text-sm font-medium text-foreground">Selecione o período</div>
            
            <div className="flex gap-4">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Data inicial</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[140px] justify-start text-left font-normal",
                        !customStart && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customStart ? format(customStart, "dd/MM/yyyy") : "Início"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-card border-border z-50" align="start">
                    <Calendar
                      mode="single"
                      selected={customStart}
                      onSelect={setCustomStart}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Data final</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[140px] justify-start text-left font-normal",
                        !customEnd && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customEnd ? format(customEnd, "dd/MM/yyyy") : "Fim"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-card border-border z-50" align="start">
                    <Calendar
                      mode="single"
                      selected={customEnd}
                      onSelect={setCustomEnd}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Button 
              onClick={handleCustomDateApply} 
              disabled={!customStart || !customEnd}
              className="w-full"
            >
              Aplicar período
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
