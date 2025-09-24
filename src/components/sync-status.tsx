import { AlertCircle, CheckCircle, Cloud, CloudOff, Loader2 } from 'lucide-react';

interface SyncStatusProps {
  isLoading?: boolean;
  isSyncing?: boolean;
  error?: string | null;
  className?: string;
}

export function SyncStatus({ 
  isLoading = false, 
  isSyncing = false, 
  error = null,
  className = "" 
}: SyncStatusProps) {
  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 p-3 rounded-lg border border-blue-200 bg-blue-50 ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
        <span className="text-sm text-blue-800">Cargando perfiles...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center gap-2 p-3 rounded-lg border border-red-200 bg-red-50 ${className}`}>
        <AlertCircle className="h-4 w-4 text-red-600" />
        <span className="text-sm text-red-800">{error}</span>
      </div>
    );
  }

  if (isSyncing) {
    return (
      <div className={`flex items-center gap-2 p-3 rounded-lg border border-amber-200 bg-amber-50 ${className}`}>
        <Cloud className="h-4 w-4 text-amber-600" />
        <span className="text-sm text-amber-800">Sincronizando con la nube...</span>
      </div>
    );
  }

  return null;
}

interface SyncIndicatorProps {
  isSyncing: boolean;
  error?: string | null;
}

export function SyncIndicator({ isSyncing, error }: SyncIndicatorProps) {
  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600">
        <CloudOff className="h-4 w-4" />
        <span>Sin conexión</span>
      </div>
    );
  }

  if (isSyncing) {
    return (
      <div className="flex items-center gap-2 text-sm text-blue-600">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Sincronizando...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-green-600">
      <CheckCircle className="h-4 w-4" />
      <span>Sincronizado</span>
    </div>
  );
}
