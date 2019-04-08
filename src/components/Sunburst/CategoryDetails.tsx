import React from 'react'
import Typography from '@material-ui/core/Typography'

import { CategoryDetailsPositioning } from './types'

interface Props {
	show: boolean
	categoryDetailsPositioning: CategoryDetailsPositioning
}

const CategoryDetails = (props: Props) => {
	const { show, categoryDetailsPositioning } = props
	const { skill, project, totalHeight } = categoryDetailsPositioning

	return (
		<div style={{ opacity: show ? 1 : 0, transition: 'all 500ms' }}>
			<div style={{ position: 'absolute', left: skill.translate + 10, top: -totalHeight / 2 - 30 }}>
				<Typography variant="h6">Skill</Typography>
			</div>

			<div style={{ position: 'absolute', left: project.translate + 10, top: -totalHeight / 2 - 30 }}>
				<Typography variant="h6">Project</Typography>
			</div>
		</div>
	)
}

export default CategoryDetails
