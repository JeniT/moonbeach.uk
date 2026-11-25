// Long lists show a batch at a time; without JavaScript everything is shown.
// Markup: <ol data-batch="6"> … </ol> followed (in the same parent) by <button class="more" hidden>.
for (const list of document.querySelectorAll<HTMLOListElement>('ol[data-batch]:not([data-ready])')) {
  list.dataset.ready = '';
  const batch = Number(list.dataset.batch);
  const items = [...list.children] as HTMLElement[];
  const button = list.parentElement?.querySelector<HTMLButtonElement>(':scope > .more');
  if (!button || items.length <= batch) continue;
  let shown = batch;
  const update = () => {
    items.forEach((li, i) => { li.hidden = i >= shown; });
    button.hidden = shown >= items.length;
  };
  button.addEventListener('click', () => {
    const first = items[shown];
    shown += batch;
    update();
    first?.querySelector<HTMLElement>('a')?.focus();
  });
  update();
}
