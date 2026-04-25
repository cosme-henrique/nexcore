const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

export function formatFileSize(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 B';

  const unitIndex = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / 1024 ** unitIndex;
  const unit = FILE_SIZE_UNITS[unitIndex];

  return `${value.toFixed(decimals)} ${unit}`;
}
