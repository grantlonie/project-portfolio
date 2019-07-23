import isEmpty from 'lodash/isEmpty'

let sampleData = {}

export async function getSampleData() {
	if (!isEmpty(sampleData)) return sampleData

	sampleData = await fetch('/assets/sample-data.json').then(res => res.json())
	return sampleData
}
