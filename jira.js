
(function() {

	const CSV_DOWNLOAD_URL = location.protocol + '//' + location.hostname + '/sr/jira.issueviews:searchrequest-csv-all-fields/temp/SearchRequest.csv?jqlQuery=order+by+created+DESC&tempMax=1000';

	const report = R.pipe(
		R.path(['data']),
		R.reduce(
			(acc, issue) => {

				if (issue['Custom field (Story Points)'])
					return R.assoc('story_points', acc.story_points + parseInt(issue['Custom field (Story Points)'], 10), acc)

				return acc;

			},
			{
				story_points: 0,
			}
		)
	);

	fetch(CSV_DOWNLOAD_URL)
	.then((r) => r.text())
	.then((r) => Papa.parse(r, { header: true }))
	.then(report)
	.then(({ story_points }) => {

		document.querySelector('[title="Sort By Story Points"]').textContent = 'Story Points (' + story_points + ')';

	})

})();
