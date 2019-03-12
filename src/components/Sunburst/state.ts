import { Machine, interpret } from 'xstate'

interface States {
	states: {
		sunburst: {}
		category: {}
		project: {}
	}
}

type Events = { type: 'sunburst' } | { type: 'category' } | { type: 'project' }

const stateMachine = Machine<null, States, Events>({
	id: 'state',
	initial: 'sunburst',
	states: {
		sunburst: {
			on: { category: 'category' },
		},
		category: {
			on: { sunburst: 'sunburst', project: 'project' },
		},
		project: {
			on: { category: 'category', sunburst: 'sunburst' },
		},
	},
})

const service = interpret(stateMachine).start()
export default service
