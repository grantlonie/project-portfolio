import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import Amplify from '@aws-amplify/core'
import '@aws-amplify/auth'

// import './index.css'
import aws_exports from './aws-exports'
import { getAllData } from './js/apiStartupMethods'
import Sunburst from './components/Sunburst'

// in this way you are only importing Auth and configuring it.
Amplify.configure(aws_exports)

function SunburstWrapper({ userId }) {
	const [data, setData] = useState([])
	useEffect(() => {
		getAllData(userId).then(data => {
			setData(data)
		})
	}, [])

	return <Sunburst {...data} />
}

export function render(userId, element) {
	ReactDOM.render(<SunburstWrapper userId={userId} />, document.getElementById(element))
}
