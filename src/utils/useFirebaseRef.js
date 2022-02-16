import { useEffect, useState } from 'react';

import { database as db } from '../firebase';
import { ref, onValue } from 'firebase/database';

function useFirebaseRef(path, once = false) {
	const [value, setValue] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		if (path) {
			const dbRef = ref(db, path);
			let unsubscribe = onValue(dbRef, (snapshot) => {
				setValue(snapshot.val());
				setLoading(false);
			},{onlyOnce:once});
			//if (once) unsubscribe();
			return () => {
				unsubscribe();
			};
		}
	}, [path, once]);

	return [value, loading];
}

export default useFirebaseRef;
