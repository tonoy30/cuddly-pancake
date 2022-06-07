import { Box, Container, Typography } from '@mui/material';
import React from 'react';

const Confirmation = ({ id, total_rent }) => {
	console.log(id, total_rent);
	return (
		<Container
			maxWidth='xl'
			sx={{
				display: 'flex',
				justifyContent: 'center',
				paddingTop: '1rem',
			}}
		>
			<Box sx={{ p: 3, pb: 1, textAlign: 'center' }} dir='ltr'>
				<Typography variant='h5' sx={{ mb: 2 }}>
					Your estimated price is ${total_rent}
				</Typography>
				<Typography variant='h5'>Do you want to procedure?</Typography>
			</Box>
		</Container>
	);
};

export default Confirmation;
