import React, {Component} from 'react';
import WatchList from './components/WatchList';
import Candles from './components/Candles';

class App extends Component {
	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		name: '',
	// 		greeting: ''
	// 	};
	// 	this.handleChange = this.handleChange.bind(this);
	// 	this.handleSubmit = this.handleSubmit.bind(this);
	// }
	//
	// handleChange(event) {
	// 	this.setState({name: event.target.value});
	// }
	//
	// handleSubmit(event) {
	// 	event.preventDefault();
	// 	fetch(`/api/greeting?name=${encodeURIComponent(this.state.name)}`)
	// 		.then(response => console.log(response.json()));
	// }

	render() {
		return (
			<div className="App container py-5">
				<WatchList />
				<Candles companyTicker={'AMD'} />
			</div>
		);
	}
}

export default App;
