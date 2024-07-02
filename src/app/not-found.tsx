import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

export default () => {
	return (
		<>
			<div className="flex min-h-screen items-center justify-center bg-background py-48">
				<div className="flex flex-col">
					<div className="flex flex-col items-center">
						<div className="text-7xl  font-heading font-bold text-primary">
							404
						</div>
						<div className="mt-10 text-3xl font-heading font-bold md:text-5xl lg:text-6xl xl:text-7xl">
							This page does not exist
						</div>
						<Link href="/" className={buttonVariants({ variant: 'link' })}>
							Go to Home
						</Link>
					</div>
				</div>
			</div>
		</>
	);
};
