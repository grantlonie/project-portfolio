import React, { Component } from 'react'

import LinesEllipsis from 'react-lines-ellipsis'
import '../../styles/node.css'

interface Props {
	/** If used, the location where the node should go, else it is in sunburst */
	location?: string
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
		if (nextProps.location !== this.props.location) return true

		return false
	}

	render() {
		const { text, radius, phi, length, fontSize, fill, id, hoverNode, selectNode } = this.props
		const cosPhi = Math.cos((phi * Math.PI) / 180)

		const nodeMargin = 1

		// Law of cosines to determine thickness at inner and outer radius
		const c1 = Math.sqrt(2 * Math.pow(radius, 2) * (1 - cosPhi))
		const c2 = Math.sqrt(2 * Math.pow(radius + length, 2) * (1 - cosPhi))

		const alpha = (180 - phi / 2) / 2
		const tanAlpha = Math.tan((alpha * Math.PI) / 180)
		const x1 = -c1 / 2 / tanAlpha + nodeMargin
		const x2 = length - c2 / 2 / tanAlpha - nodeMargin
		const y1 = c1 / 2 - nodeMargin
		const y2 = c2 / 2 - nodeMargin

		return (
			<div>
				<svg
					width={length}
					height={c2}
					style={{
						position: 'absolute',
						overflow: 'visible',
					}}>
					<path
						d={`
						M${x1} ${-y1}
						A ${radius} ${radius} 0 0 1 ${x1} ${y1} L${x2} ${y2} 
						A ${radius + length} ${radius + length} 0 0 0 ${x2} ${-y2} 
						Z
          `}
						fill={fill}
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
