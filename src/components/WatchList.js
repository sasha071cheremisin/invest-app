import React, {useCallback, useEffect, useMemo, useState} from 'react';

const WatchList = () => {
	const [watchList, setWatchList] = useState({});
	const [value, setValue] = useState('');
	const [status, setStatus] = useState('');
	const [removeStatus, setRemoveStatus] = useState('');

	useEffect(() => {
		fetch(`/api/watchList`)
			.then(response => response.json())
			.then(result => setWatchList(result));
	}, [status, removeStatus]);

	const sendHandler = useCallback((e) => {
		e.preventDefault();
		fetch('/api/watchList/add', {
			method: 'post',
			headers: {
				'content-type': 'application/json; charset=UTF-8'
			},
			body: JSON.stringify({value: value})
		}).then(response => response.json()).then(res => setStatus(res)).catch(err => console.log(err));
		setValue('');
	}, [value])

	const changeHandler = useCallback((e) => {
		setValue(e.target.value.toUpperCase());
	}, [])

	const removeHandler = useCallback(key => {
		fetch('/api/watchList/remove', {
			method: 'post',
			headers: {
				'content-type': 'application/json; charset=UTF-8'
			},
			body: JSON.stringify({value: key})
		}).then(response => response.json()).then(res => setRemoveStatus(res)).catch(err => console.log(err));
	}, [])

	const renderWatchList = useMemo(() => {
		const keys = Object.keys(watchList);
		return keys.map(key => {
			return (
				<li className="list-group-item py-3" key={key}>
					<div className="d-flex flex-row justify-content-between">
						<span>{key} : {watchList[key].figi}</span>
						<button className="btn btn-primary" onClick={() => removeHandler(key)}>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
								 className="bi bi-trash-fill" viewBox="0 0 16 16">
								<path
									d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
							</svg>
						</button>
					</div>
				</li>
			)
		});
	}, [watchList, removeHandler])

	return (
		<div className="pb-4">
			<ul className="list-group">
				<li className="list-group-item list-group-item-primary py-3"><h4>WatchList</h4></li>
				{renderWatchList}
				<li className="list-group-item list-group-item-primary py-3">
					<form onSubmit={sendHandler}>
						<div className="d-flex flex-row align-items-center">
							<div className="pe-3">Add company to the list</div>
							<div className="pe-3">
								<input
									id="name"
									type="text"
									value={value}
									name="name"
									className="form-control"
									onChange={changeHandler}
								/>
							</div>
							<div className="pe-3">
								<button type="submit" className="btn btn-primary">Submit</button>
							</div>
							{status &&
								<div>
									{status}
								</div>
							}
						</div>
					</form>
				</li>
			</ul>
		</div>
	)
}

export default WatchList;
