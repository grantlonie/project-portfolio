import React, { useMemo } from 'react'
import { createStyles, withStyles } from '@material-ui/core/styles'
import LinesEllipsis from 'react-lines-ellipsis'

interface Props {
	/** Type of Node */
	type: 'category' | 'skill' | 'project'
	/** If used, the change node into rectangle with given values, else take the shape to fit in Sunburst */
	rectangleShape?: { width: number; height: number }
	/** The displayed text */
	text: string
	/** Inner radius of the node */
	innerRadius: number
	/** The arc angle in degrees that determines the Node's width */
	phi: number
	/** Outer radius of the node */
	outerRadius: number
	/** For text */
	fontSize: number
	/** Color of Node */
	fill: string
	/** id of the Node - category, skill or project */
	id: string
	/** Fires when hovering starts over project */
	hoverNode: (id: string, type: this['type']) => void
	/** Fires when node is clicked */
	selectNode: (id: string, type: this['type']) => void
	/** Material UI withStyles classes object */
	classes: any
}

const styles = createStyles({
	textWrapper: { pointerEvents: 'none', position: 'absolute', paddingLeft: '5px' },
	text: { position: 'relative', top: '50%', transform: 'translateY(-50%)' },
})

const Node = (props: Props) => {
	const { type, text, innerRadius, phi, outerRadius, fontSize, fill, id, hoverNode, selectNode, rectangleShape, classes } = props

	const width = outerRadius - innerRadius

	let x1, x2, y1, y2, c1, c2
	let adjInnerRadius = innerRadius
	let adjOuterRadius = outerRadius

	if (rectangleShape) {
		x1 = 0
		x2 = rectangleShape.width
		c1 = rectangleShape.height
		c2 = c1
		y1 = c1 / 2
		y2 = c2 / 2
		adjInnerRadius = 10000
		adjOuterRadius = 10000
	} else {
		// Law of cosines to determine thickness at inner and outer radius
		const cosPhi = Math.cos(phi)
		c1 = Math.sqrt(2 * Math.pow(adjInnerRadius, 2) * (1 - cosPhi))
		c2 = Math.sqrt(2 * Math.pow(outerRadius, 2) * (1 - cosPhi))

		// Determine the node corners adjusting for margin
		const margin = 1
		const alpha = (Math.PI - phi / 2) / 2
		const tanAlpha = Math.tan(alpha)
		x1 = -c1 / 2 / tanAlpha + margin
		x2 = width - c2 / 2 / tanAlpha - margin + 0.7 * phi
		y1 = c1 / 2 - margin
		y2 = c2 / 2 - margin - 0.7 * phi
	}

	const displayText = useMemo(
		() => (
			<LinesEllipsis
				className={classes.text}
				style={{ lineHeight: fontSize + 'px' }}
				text={text}
				maxLine={Math.floor(c1 / fontSize)}
				trimRight
				basedOn="letters"
			/>
		),
		[fontSize, text]
	)

	if (id === '6e83a2af-b527-4593-ad37-3c3660bcbab3') {
		console.log('y2: ', y2)
		console.log('x2: ', x2)
		console.log('y1: ', y1)
		console.log('x1: ', x1)
	}

	return (
		<div>
			<svg width={width} height={c2} style={{ position: 'absolute', overflow: 'visible' }} pointerEvents="none">
				<path
					d={`
						M${x1} ${-y1}
						A ${adjInnerRadius} ${adjInnerRadius} 0 0 1 ${x1} ${y1} L${x2} ${y2} 
						A ${adjOuterRadius} ${adjOuterRadius} 0 0 0 ${x2} ${-y2} 
						Z
					`}
					pointerEvents="visible"
					cursor="pointer"
					fill={fill}
					style={{ transition: 'all 500ms' }}
					onMouseOver={() => hoverNode(id, type)}
					onMouseUp={() => selectNode(id, type)}
				/>
			</svg>
			<div
				className={classes.textWrapper}
				style={{
					top: Math.floor(-c1 / 2) + 'px',
					height: c1 + 'px',
					width: width + 'px',
					fontSize,
				}}
			>
				{displayText}
			</div>
		</div>
	)
}

export default withStyles(styles)(Node)
