const snakeContainer = document.querySelector('.snake');

const draw = (blocks) => {
  const html = blocks.map((row) => {
    return `<div class="row">${row.map((block) => {
      return `<div class="snake__block snake__block--${block}"></div>`;
    }).join('')}</div>`;
  }).join('');

  snakeContainer.innerHTML = html;
}