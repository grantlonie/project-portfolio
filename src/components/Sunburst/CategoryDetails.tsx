import React from 'react'
import Typography from '@material-ui/core/Typography'

import { sunburstScaleDown } from './dimensioning'

const totalHeight = 400
const itemTopMargin = 2
const itemLeftMargin = 3

const categoryWidth = 175
const skillWidth = 150
const projectWidth = 200
const categoryTranslate = 175

const skillTranslate = categoryTranslate + categoryWidth + itemLeftMargin
const projectTranslate = skillTranslate + skillWidth + itemLeftMargin

export const categoryInfo = {
	totalHeight,
	itemTopMargin,
	category: {
		width: categoryWidth,
		translate: categoryTranslate,
	},
	skill: {
		width: skillWidth,
		translate: skillTranslate,
	},
	project: {
		width: projectWidth,
		translate: projectTranslate,
	},
}

interface Props {
	show: any
}

const CategoryDetails = (props: Props) => {
	return (
		<div style={{ opacity: props.show ? 1 : 0, transition: 'all 500ms', transform: `scale(${sunburstScaleDown})` }}>
			<div style={{ position: 'absolute', left: skillTranslate + 10, top: -totalHeight / 2 - 40 }}>
				<Typography variant="h6">Skill</Typography>
			</div>

			<div style={{ position: 'absolute', left: projectTranslate + 10, top: -totalHeight / 2 - 40 }}>
				<Typography variant="h6">Project</Typography>
			</div>
		</div>
	)
}

export default CategoryDetails
