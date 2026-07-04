export function formatDate(date: Date) {
   const now = new Date();
  const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);

  // مصفوفة الوحدات الزمنية وقيمها بالثواني
  const units: { name: Intl.RelativeTimeFormatUnit; amount: number }[] = [
    { name: 'second', amount: 60 },
    { name: 'minute', amount: 60 },
    { name: 'hour', amount: 24 },
    { name: 'day', amount: 30 },
    { name: 'month', amount: 12 },
    { name: 'year', amount: Infinity }
  ];

  let duration = diffInSeconds;
  
  for (const unit of units) {
    if (Math.abs(duration) < unit.amount) {
      const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
      return rtf.format(Math.round(duration), unit.name);
    }
    duration /= unit.amount;
  }
}
