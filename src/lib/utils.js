export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
};

export const classifyRhythm = (bpm) => {
  if (!bpm) return 'Unknown';
  if (bpm < 60) return 'Bradycardia';
  if (bpm > 100) return 'Tachycardia';
  return 'Normal';
};

export const getRhythmColor = (rhythm) => {
  const colors = {
    'Normal': 'text-success',
    'Bradycardia': 'text-warning',
    'Tachycardia': 'text-danger',
    'Unknown': 'text-gray-500',
  };
  return colors[rhythm] || 'text-gray-500';
};

export const getSeverityColor = (severity) => {
  const colors = {
    'CRITICAL': 'bg-red-100 text-red-800 border-red-300',
    'WARNING': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  };
  return colors[severity] || 'bg-gray-100 text-gray-800 border-gray-300';
};

export const getSeverityBadgeColor = (severity) => {
  const colors = {
    'CRITICAL': 'bg-red-500',
    'WARNING': 'bg-yellow-500',
  };
  return colors[severity] || 'bg-gray-500';
};
