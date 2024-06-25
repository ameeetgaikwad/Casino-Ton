'use client';

import { Button } from '@/components/ui/button';

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<html>
			<body className="flex min-h-screen flex-col items-center justify-center">
				<h2 className="text-pretty text-3xl font-bold">
					Something went wrong!
				</h2>
				<pre className="text-destructive">{error.message}</pre>
				<Button variant="secondary" onClick={reset}>
					Try again
				</Button>
			</body>
		</html>
	);
}
