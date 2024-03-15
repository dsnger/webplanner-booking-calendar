
export function isElementInViewport(el: HTMLElement, container: HTMLElement):boolean {
  const elRect = el.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  // Check if the element is in the container's viewport
  return (
    elRect.top >= containerRect.top &&
    elRect.left >= containerRect.left &&
    elRect.bottom <= containerRect.bottom &&
    elRect.right <= containerRect.right
  );
}


interface MostVisibleMonthResult {
  mostVisibleMonthsIDs: string[];
  maxVisibleWidth: number;
  months: { year: number; month: number }[];
}



export function calculateMostVisibleMonths(container: HTMLElement): MostVisibleMonthResult {
  let maxVisibleWidth = 0;
  const mostVisibleMonthsIDs: string[] = [];
  const months: { year: number; month: number }[] = [];

  const monthElements = container.querySelectorAll('[id^="month-"]');
  monthElements.forEach((month: Element) => {
    const { left, right } = month.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const visibleLeft = Math.max(left, containerRect.left);
    const visibleRight = Math.min(right, containerRect.right);
    const visibleWidth = Math.max(0, visibleRight - visibleLeft);

    if (visibleWidth > maxVisibleWidth) {
      maxVisibleWidth = visibleWidth;
      mostVisibleMonthsIDs.length = 0; // Clear the array
      mostVisibleMonthsIDs.push(month.id);
    } else if (visibleWidth === maxVisibleWidth) {
      mostVisibleMonthsIDs.push(month.id);
    }
  });

  mostVisibleMonthsIDs.forEach((id) => {
    const parts = id.split('-');
    const year = parseInt(parts[1], 10);
    const month = parseInt(parts[2], 10);
    months.push({ year, month });
  });

  return { mostVisibleMonthsIDs, maxVisibleWidth, months };
}
