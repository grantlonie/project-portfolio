import React, { Component } from 'react'
import { connect } from 'react-redux'

import Node from './Node'

class ListProjects extends Component {
	render() {
		const { projects } = this.props
		if (projects.length === 0) return <h3>Loading...</h3>

		const radius = 100
		const phi = 360 / projects.length
		const length = 200

		// return (
		// 	<div
		// 		style={{ transform: `rotate(${-phi}rad) translateX(${radius}px)`, transformOrigin: '0 0' }}>
		// 		<Node text={'hi'} radius={radius} phi={phi} length={length} />
		// 	</div>
		// )
		return (
			<div
				style={{
					position: 'absolute',
					transform: `translate(${400}px, ${400}px)`,
				}}>
				{projects.map((project, projectI) => {
					return (
						<div
							key={project.id}
							style={{
								position: 'absolute',
								transform: `rotate(${phi * projectI}deg) translateX(${radius}px)`,
								transformOrigin: '0 0',
							}}>
							<Node text={project.name} radius={radius} phi={phi} length={length} />
						</div>
					)
				})}
			</div>
		)
	}
}

const mapStateToProps = ({ projects }) => ({ projects })

export default connect(mapStateToProps)(ListProjects)
