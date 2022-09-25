document.addEventListener('DOMContentLoaded', () => {
  // initial load
  displayTimeframe('weekly');

  // CLICK EVENT: change timeframe
  document.querySelector("#navTimeframe").addEventListener('click', event => { 
    event.preventDefault();
    if (event.target.tagName !== 'A') return;

    // remove existing active nav item
    document.querySelectorAll('.nav_item').forEach(nav => nav.classList.remove('active'));

    // add active class on target nav item
    event.target.classList.add('active');

    // show loading
    document.querySelector('#actTimeframes').classList.add('loading');

    // remove all element inside data div
    document.querySelector('#actTimeframes .data-container').innerHTML = '';

    // displaytimeframe
    displayTimeframe(event.target.dataset.timeframe);
  });
});

function displayTimeframe(timeframe) {
  const container = document.querySelector('#actTimeframes');
  
  // fetch data
  fetch('./data.json').then(res => res.json())
    .then(data => {
      // loop data
      data.forEach(item => {
        // create card container
        const card = createCard(item, timeframe);
        // append card inside data-container
        container.querySelector('.data-container').append(card);
      })
    })
    .then(() => {
      // remove loading screen
      setTimeout(() => container.classList.remove('loading'), 1500);
    })
    .catch(() => {
      // just alert on error
      alert('Somethings went wrong. Please try again later');
    });
}

function createCard(data, timeframe) {
  const card = document.createElement('div');

  const _noun = (timeframe == 'daily') ? 'Day' : (timeframe == 'weekly') ? 'Week' : 'Month';
  const _current = data.timeframes[timeframe].current;
  const _previous = data.timeframes[timeframe].previous;

  card.className = `card card-${data.title.replace(/(\s+)/g, '-').toLowerCase()}`;
  card.innerHTML = `
    <div class="card_inner">
      <div class="card_header">
        <h4>${data.title}</h4>
        <button>
          <svg width="21" height="5" xmlns="http://www.w3.org/2000/svg">
            <path fill="#000" fill-rule="evenodd"
              d="M2.5 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" />
          </svg>
        </button>
      </div>
      <div class="card_content">
        <h1 class="current">${_current}hr${(parseInt(_current) > 1 || parseInt(_current) == 0) ? 's' : ''}</h1>
        <p class="previous">Last ${_noun} - ${_previous}hr${(parseInt(_previous) == 1) ? '' : 's'}</p>
      </div>
    </div>
  `;

  return card;
}