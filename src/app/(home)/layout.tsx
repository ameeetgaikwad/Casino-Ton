import React, { Fragment } from 'react';
import { Sidenav } from './_component/sidenav';

interface Props {
	children: React.ReactNode;
}

export default (props: Props) => {
	return (
		<Fragment>
			<div className="flex flex-row gap-16 ">
				<Sidenav />
				{props.children}
			</div>
		</Fragment>
	);
};
