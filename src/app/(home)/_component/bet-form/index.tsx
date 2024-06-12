'use client';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { StatusDialog, statusDialogRef } from '../status-dialog';
import { BetSelection } from './bet-section';
import { CoinSelection } from './coin-selection';
const schema = z.object({
	coinSide: z.enum(['head', 'tail']),
	wager: z.number(),
	maxPayout: z.number().optional(),
	totalWager: z.number().optional(),
});
export type Schema = z.infer<typeof schema>;

interface BetFormProps {
	fiatRate: number;
}

export const BetForm = ({ fiatRate }: BetFormProps) => {
	const form = useForm<Schema>({
		defaultValues: {
			coinSide: 'head',
		},
		resolver: zodResolver(schema),
	});

	return (
		<Fragment>
			<Form {...form}>
				<FormField
					control={form.control}
					name="coinSide"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<CoinSelection
									onSelection={(value) => field.onChange(value)}
									selected={field.value}
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<BetSelection form={form} fiatRate={fiatRate} />
			</Form>
			<StatusDialog ref={statusDialogRef} />
		</Fragment>
	);
};
