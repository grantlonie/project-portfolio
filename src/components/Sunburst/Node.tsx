import React, { Component } from 'react'

import LinesEllipsis from 'react-lines-ellipsis'
import '../../styles/node.css'

interface Props {
	/** If used, the change node into rectangle with given values, else take the shape to fit in Sunburst */
	rectangleShape?: { width: number; height: number }
	/** The displayed text */
	text: string
	/** Inner radius of the node */
	radius: number
	/** The arc angle that determines the Node's width */
	phi: number
	/** Length of the Node */
	length: number
	/** For text */
	fontSize: number
	/** Color of Node */
	fill: string
	/** id of the Node - category, skill or project */
	id: string
	/** Fires when hovering starts over project */
	hoverNode: (id: string) => void
	/** Fires when node is clicked */
	selectNode: (id: string) => void
}

class Node extends Component<Props> {
	shouldComponentUpdate(nextProps) {
		// Only rerender if location changes
		if (nextProps.rectangleShape !== this.props.rectangleShape) return true

		return false
	}

	render() {
		const {
			text,
			radius,
			phi,
			length,
			fontSize,
			fill,
			id,
			hoverNode,
			selectNode,
			rectangleShape,
		} = this.props

		let x1, x2, y1, y2, c1, c2, displayRadius
		if (rectangleShape) {
			x1 = 0
			x2 = rectangleShape.width
			c1 = rectangleShape.height
			c2 = c1
			y1 = c1 / 2
			y2 = c2 / 2
			displayRadius = 100000
		} else {
			const cosPhi = Math.cos((phi * Math.PI) / 180)
			displayRadius = radius

			const nodeMargin = 1

			// Law of cosines to determine thickness at inner and outer radius
			c1 = Math.sqrt(2 * Math.pow(displayRadius, 2) * (1 - cosPhi))
			c2 = Math.sqrt(2 * Math.pow(displayRadius + length, 2) * (1 - cosPhi))

			const alpha = (180 - phi / 2) / 2
			const tanAlpha = Math.tan((alpha * Math.PI) / 180)
			x1 = -c1 / 2 / tanAlpha + nodeMargin
			x2 = length - c2 / 2 / tanAlpha - nodeMargin
			y1 = c1 / 2 - nodeMargin
			y2 = c2 / 2 - nodeMargin
		}

		return (
			<div>
				<svg width={length} height={c2} style={{ position: 'absolute', overflow: 'visible' }}>
					<path
						d={`
						M${x1} ${-y1}
						A ${displayRadius} ${displayRadius} 0 0 1 ${x1} ${y1} L${x2} ${y2} 
						A ${displayRadius + length} ${displayRadius + length} 0 0 0 ${x2} ${-y2} 
						Z
          `}
						fill={fill}
						style={{ transition: 'all 500ms' }}
					/>
				</svg>
				<div
					className="text-wrapper"
					onMouseOver={() => hoverNode(id)}
					onMouseUp={() => selectNode(id)}
					style={{
						top: Math.floor(-c1 / 2) + 'px',
						height: c1 + 'px',
						width: length + 'px',
						fontSize,
					}}>
					<LinesEllipsis
						className="text"
						style={{ lineHeight: fontSize + 'px' }}
						text={text}
						maxLine={Math.floor(c1 / fontSize)}
						trimRight
						basedOn="letters"
					/>
				</div>
			</div>
		)
	}
}

export default Node
