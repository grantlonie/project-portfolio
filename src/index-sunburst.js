import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import Amplify from '@aws-amplify/core'
import '@aws-amplify/auth'

// import './index.css'
import aws_exports from './aws-exports'
import { getSunburstDataWithApi } from './js/apiStartupMethods'
import Sunburst from './components/Sunburst'

function SunburstWrapper({ userId }) {
	const [data, setData] = useState({ projects: [], allCategories: [], allSkills: [] })
	useEffect(() => {
		getSunburstDataWithApi(userId).then(data => {
			setData(data)
		})
	}, [])

	return <Sunburst {...data} />
}

export function render(userId, apiKey, element) {
	const apiConfig = {
		...aws_exports,
		aws_appsync_authenticationType: 'API_KEY',
		aws_appsync_apiKey: apiKey,
	}

	Amplify.configure(apiConfig)

	ReactDOM.render(<SunburstWrapper userId={userId} />, document.getElementById(element))
}
