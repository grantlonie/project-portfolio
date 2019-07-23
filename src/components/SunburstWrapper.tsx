import React, { useEffect, useState } from 'react'
import { FormControlLabel, Switch } from '@material-ui/core'
import { connect } from 'react-redux'

import Sunburst from './Sunburst'
import { getSampleData } from '../js/sampleData'

const appBarHeight = 64
const toggleHeight = 50

const emptyData = { projects: [], allCategories: [], allSkills: [] }

const SunburstWrapper = ({ projects, allCategories, allSkills }) => {
	const [wantSampleData, setWantSampleData] = useState(false)
	const [sunburstData, setSunburstData] = useState(emptyData as any)

	useEffect(() => {
		if (!wantSampleData) {
			setSunburstData({ projects, allCategories, allSkills })
		} else {
			getSampleData().then(data => {
				setSunburstData(data)
			})
		}
	}, [wantSampleData, projects, allCategories, allSkills])

	return (
		<div>
			<div style={{ height: `calc(100vh - ${appBarHeight + toggleHeight}px)` }}>
				<Sunburst {...sunburstData} />
			</div>

			<FormControlLabel
				style={{ marginLeft: '20px' }}
				control={<Switch checked={wantSampleData} onChange={() => setWantSampleData(s => !s)} />}
				label="Sample Data"
			/>
		</div>
	)
}

const mapStateToProps = ({ projects, allCategories, allSkills }) => ({
	projects,
	allCategories,
	allSkills,
})

export default connect(mapStateToProps)(SunburstWrapper)
