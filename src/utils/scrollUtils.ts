
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
  mostVisibleMonthID: string;
  maxVisibleWidth: number;
  year: number;
  month: number;
}

export function calculateMostVisibleMonth(container: HTMLElement): MostVisibleMonthResult {
  let maxVisibleWidth = 0;
  let mostVisibleMonthID = '';

  const monthElements = container.querySelectorAll('[id^="month-"]');
  monthElements.forEach((month: Element) => {
    const { left, right } = month.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const visibleLeft = Math.max(left, containerRect.left);
    const visibleRight = Math.min(right, containerRect.right);
    const visibleWidth = Math.max(0, visibleRight - visibleLeft);

    if (visibleWidth > maxVisibleWidth) {
      maxVisibleWidth = visibleWidth;
      mostVisibleMonthID = month.id;
    }
  });

  let year = 0, month = 0;
  if (mostVisibleMonthID) {
    const parts = mostVisibleMonthID.split('-');
    year = parseInt(parts[1], 10);
    month = parseInt(parts[2], 10);
  }

  return { mostVisibleMonthID, maxVisibleWidth, year, month };
}
