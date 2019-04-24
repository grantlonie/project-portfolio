import SunburstWrapper from '../components/SunburstWrapper'
import ListProjects from '../components/ListProjects'
import Projects from '../components/Projects'
import EditProject from '../components/EditProject'
import EditSkills from '../components/EditSkills'
import EditTools from '../components/EditTools'

interface RouteObject {
	/** react-router path to the component */
	path: string
	/** rendered component */
	component: React.Component | React.FunctionComponent
	/** use widthBodyWrapper HOC to apply minWidth and padding to content */
	addBodyWrapper?: boolean
	/** if provided, add to slide out drawer using provided text */
	drawerText?: string
}

interface Routes {
	home: RouteObject
	listProjects: RouteObject
	projects: RouteObject
	editProject: RouteObject
	skills: RouteObject
	tools: RouteObject
}

const routes: Routes = {
	home: {
		path: '/',
		component: SunburstWrapper,
		drawerText: 'Sunburst',
	},
	listProjects: {
		path: '/listProjects',
		component: ListProjects,
		addBodyWrapper: true,
		drawerText: 'List Projects',
	},
	projects: {
		path: '/projects',
		component: Projects,
		addBodyWrapper: true,
		drawerText: 'Projects',
	},
	editProject: {
		path: '/editProject/:id/:isNew?',
		component: EditProject,
		addBodyWrapper: true,
	},
	skills: {
		path: '/skills',
		component: EditSkills,
		addBodyWrapper: true,
		drawerText: 'Edit Skills',
	},
	tools: {
		path: '/tools',
		component: EditTools,
		addBodyWrapper: true,
		drawerText: 'Edit Tools',
	},
}

export default routes
