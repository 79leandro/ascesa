// Utilitários de Debug de Performance
// Use no console: window.perfLog() para ver dados de tempo

interface PerfEntry {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

class PerformanceLogger {
  private entries: PerfEntry[] = [];
  private enabled: boolean = true;

  start(label: string) {
    if (!this.enabled) return;
    const entry: PerfEntry = {
      name: label,
      startTime: performance.now(),
    };
    this.entries.push(entry);
    console.log(`[PERF] Início: ${label}`);
  }

  end(label: string) {
    if (!this.enabled) return;
    const entry = this.entries.find(e => e.name === label && !e.endTime);
    if (entry) {
      entry.endTime = performance.now();
      entry.duration = entry.endTime - entry.startTime;
      console.log(`[PERF] Fim: ${label} - ${entry.duration.toFixed(2)}ms`);
    }
  }

  log(label: string) {
    if (!this.enabled) return;
    console.log(`[PERF] ${label} - ${performance.now().toFixed(2)}ms`);
  }

  getReport(): string {
    const report = this.entries
      .filter(e => e.duration !== undefined)
      .sort((a, b) => b.duration! - a.duration!)
      .map(e => `${e.name}: ${e.duration?.toFixed(2)}ms`)
      .join('\n');
    return report || 'Nenhuma entrada';
  }

  clear() {
    this.entries = [];
  }

  disable() {
    this.enabled = false;
  }

  enable() {
    this.enabled = true;
  }
}

export const perf = new PerformanceLogger();

// Hook React para medir tempo de renderização
export function useRenderTime(label: string) {
  if (typeof window !== 'undefined') {
    perf.log(`${label} renderizado`);
  }
}

// Hook para rastrear tempo de montagem do componente
export function useMountTime(label: string) {
  if (typeof window !== 'undefined') {
    perf.log(`${label} montado`);
  }
}

// Disponibilizar globalmente para debug no console
if (typeof window !== 'undefined') {
  (window as any).perfLog = () => {
    console.log('\n=== RELATÓRIO DE PERFORMANCE ===\n');
    console.log(perf.getReport());
    console.log('\n=========================\n');
  };
  (window as any).perfClear = () => {
    perf.clear();
    console.log('[PERF] Log limpo');
  };
  (window as any).perfDisable = () => {
    perf.disable();
    console.log('[PERF] Registro desabilitado');
  };
  (window as any).perfEnable = () => {
    perf.enable();
    console.log('[PERF] Registro habilitado');
  };
}
