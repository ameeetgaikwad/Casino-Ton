import React, { Fragment } from 'react';
import { Sidenav } from '@/components/layout/sidenav';
import Footer from '@/components/layout/footer';
import MainLayout from '@/components/layout/MainLayout';
interface Props {
	children: React.ReactNode;
}

export default (props: Props) => {
	return (
		<Fragment>
			<div className="hidden md:flex flex-row gap-16 ">
				<Sidenav />
				<main className="w-full">
					{props.children}
					<Footer />
				</main>
			</div>
			<h1 className="md:hidden block">Mobile View Not Supported</h1>
		</Fragment>
	);
};
