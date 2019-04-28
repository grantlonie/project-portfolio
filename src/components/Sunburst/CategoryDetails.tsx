import React from 'react'
import Typography from '@material-ui/core/Typography'
import { transitionDuration } from './utils'

import { CategoryDetailsPositioning } from './types'

interface Props {
	show: boolean
	categoryDetailsPositioning: CategoryDetailsPositioning
}

const CategoryDetails = (props: Props) => {
	const { show, categoryDetailsPositioning } = props
	const { skillStart, projectStart, totalHeight } = categoryDetailsPositioning

	return (
		<div style={{ opacity: show ? 1 : 0, transition: `all ${transitionDuration}ms` }}>
			<div style={{ position: 'absolute', left: skillStart + 10, top: -totalHeight / 2 - 30 }}>
				<Typography variant="h6">Skill</Typography>
			</div>

			<div style={{ position: 'absolute', left: projectStart + 10, top: -totalHeight / 2 - 30 }}>
				<Typography variant="h6">Project</Typography>
			</div>
		</div>
	)
}

export default CategoryDetails
