import stateService from './state'

describe('Sunburst State Service', () => {
	it('should stay at sunburst', () => {
		stateService.send('project')
		expect(stateService.state.value).toBe('sunburst')
	})
	it('should transition to category', () => {
		stateService.send('sdf')
		expect(stateService.state.value).toBe('category')
	})
	it('should go back to sunburst', () => {
		stateService.send('sunburst')
		expect(stateService.state.value).toBe('sunburst')
	})
	it('transition twice to project', () => {
		stateService.send('category')
		stateService.send('project')
		expect(stateService.state.value).toBe('project')
	})
	it('transition to sunburst', () => {
		stateService.send('sunburst')
		expect(stateService.state.value).toBe('sunburst')
	})
	it('transition back to project and go to category', () => {
		stateService.send('category')
		stateService.send('project')
		stateService.send('category')
		expect(stateService.state.value).toBe('category')
	})
})
