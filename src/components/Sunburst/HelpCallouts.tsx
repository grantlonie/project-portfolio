import React from 'react'

import { CategoryDetailsPositioning } from './types'
import { Typography } from '@material-ui/core'

const Callout = props => (
	<svg xmlns="http://www.w3.org/2000/svg" width="200px" height="100px" viewBox="0 0 200 100">
		<filter id="dropshadow" height="130%">
			<feGaussianBlur in="SourceAlpha" stdDeviation="3" />
			<feOffset dx="2" dy="2" result="offsetblur" />
			<feComponentTransfer>
				<feFuncA type="linear" slope="0.5" />
			</feComponentTransfer>
			<feMerge>
				<feMergeNode />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<path fill="white" stroke="black" d="M0 0 H170 V75 H30 L0 100 Z" style={{ filter: 'url(#dropshadow)' }} />
	</svg>
)

/** category or project will show respective callouts. 'hide project' will show project callout next time a category is select */
export type HelpCalloutType = 'category' | 'project' | 'hide project'

interface Props {
	type: HelpCalloutType
	sunburstRadius: number
	categoryDetailsPositioning: CategoryDetailsPositioning
}

const HelpCallouts = (props: Props) => {
	const { type, sunburstRadius, categoryDetailsPositioning } = props

	if (!type || type === 'hide project') return null

	let text
	const style: React.CSSProperties = {
		position: 'absolute',
		userSelect: 'none',
		width: '160px',
		pointerEvents: 'none',
		transition: 'all 500ms',
	}

	if (type === 'category') {
		text = 'Click a category to expand!'
		style.left = 0.7 * sunburstRadius * Math.cos(0.5)
		style.bottom = 0.7 * sunburstRadius * Math.sin(0.5)
	} else if (type === 'project') {
		text = 'Click for project details!'
		const { project, totalHeight } = categoryDetailsPositioning
		style.left = project.translate + project.width - 20
		style.bottom = totalHeight * 0.1
	}

	return (
		<div style={style}>
			<Callout />
			<Typography style={{ position: 'relative', bottom: '93px', left: '10px' }} variant="h6">
				{text}
			</Typography>
		</div>
	)
}

export default HelpCallouts
