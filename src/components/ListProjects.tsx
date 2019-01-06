import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ProjectItem } from '../types'
interface Props {
	projects: ProjectItem[]
}
class ListProjects extends Component<Props> {
	render() {
		const { projects } = this.props

		if (projects.length === 0) return <h3>Loading...</h3>

		return (
			<ul>
				{projects.map(project => (
					<li key={project.id}>{project.name}</li>
				))}
			</ul>
		)
	}
}

const mapStateToProps = ({ projects }) => ({ projects })

export default connect(mapStateToProps)(ListProjects)
