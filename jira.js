
(function() {

  const FRAMES = [
    '⠋',
    '⠙',
    '⠹',
    '⠸',
    '⠼',
    '⠴',
    '⠦',
    '⠧',
    '⠇',
    '⠏'
  ];
  
  const startLoader = () => {

    let frameIndex = 0;

    return setInterval(() => {

      frameIndex = (frameIndex >= FRAMES.length - 1)
      ? 0
      : frameIndex + 1;

      document.querySelector('[title="Sort By Story Points"]').textContent = 'Story Points (' + FRAMES[frameIndex] + ')';

    }, 80)

  }

  const report = (response) => response.data.reduce(
    (acc, issue) => {

      if (issue['Custom field (Story Points)'])
        return {
          ...acc,
          story_points: acc.story_points + parseInt(issue['Custom field (Story Points)'], 10) || 0,
        }

      return acc;

    },
    {
      story_points: 0,
    }
  )

  const getAndUpdateStoryPoints = () => {

    const loader = startLoader();
    const csvDownloadUrl = location.protocol + '//' + location.hostname + '/sr/jira.issueviews:searchrequest-csv-all-fields/temp/SearchRequest.csv?jqlQuery=' + window.location.href.match(/http(s?):\/\/(.*)\/issues\/\?jql=(.*)/)[3];


    return fetch(csvDownloadUrl)
    .then((r) => r.text())
    .then((r) => Papa.parse(r, { header: true }))
    .then(report)
    .then(({ story_points }) => {
  
      clearInterval(loader);
      document.querySelector('[title="Sort By Story Points"]').textContent = 'Story Points (' + story_points + ')';
  
    })

  };
  
  let currentUrl = window.location.href;

  setInterval(() => {

    if (window.location.href === currentUrl)
      return

    currentUrl = window.location.href;
    getAndUpdateStoryPoints();

  }, 500)

  getAndUpdateStoryPoints();

})();
