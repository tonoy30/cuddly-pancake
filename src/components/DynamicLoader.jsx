import { Typography } from '@mui/material';
import React, { lazy, Suspense } from 'react';

const DynamicLoader = ({ componentName, props }) => {
	const DynamicComponent = lazy(() => import(`./${componentName}`));

	return (
		<Suspense fallback={<Typography>Loading...</Typography>}>
			<DynamicComponent {...props} />
		</Suspense>
	);
};

export default DynamicLoader;
