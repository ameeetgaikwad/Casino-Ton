'use client';
import { CoinFace } from '@/components/coin-face';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCoinFip } from '@/hooks/use-coin-flip';
import { useContract, useContractListener } from '@/hooks/use-contract';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { Schema } from '.';
import { statusDialogRefFunc } from '../status-dialog';
import { formatTwoDigit } from '@/lib/utils';
interface BetSelectionProps {
	form: UseFormReturn<Schema>;
	fiatRate: number;
}
export const BetSelection = ({ form, fiatRate }: BetSelectionProps) => {
	const [loading, setLoading] = useState(false);
	const [totalWager, setTotalWager] = useState<string | null>(null);
	const { AudioEl, audioRef } = useCoinFip();
	const { contract, error, address, getBalance, getTotalWager } = useContract();
	const { isPending } = useContractListener(address as string, contract, form);

	const [contractBalance, setContractBalance] = useState<string>();
	const contractAddress = '0xAACFC4515093Ca7a40fF6F9EcddA22af4c6e616c';
	// Fetch contract balance when the component mounts or when the contract changes
	useEffect(() => {
		const fetchContractBalance = async () => {
		  try {
			const balance = await getBalance(contractAddress);
			setContractBalance(balance);
		  } catch (error) {
			console.error("Error fetching contract balance:", error);
		  }
		};
	  
		// Initial fetch when the component mounts
		fetchContractBalance();
	  
		// Periodically fetch and update the contract balance (every 3 seconds in this example)
		const intervalId = setInterval(fetchContractBalance, 3000);
	  
		// Cleanup the interval on component unmount
		return () => clearInterval(intervalId);
	  }, [getBalance, contractAddress]);
	
	useEffect(() => {
		getTotalWager().then((wager) => setTotalWager(wager[0].value));
	}, [getTotalWager]);
	const onSubmit = async (value: Schema) => {
		setLoading(true);
		try {
			if (error) {
				throw new Error(error);
			}
			if (!address) {
				throw new Error(`Connect Wallet`);
			}
			if (!contract) {
				throw new Error(`Contract not initialized`);
			}
			const option = {
				gasLimit: 500000,
				gasPrice: ethers.utils.parseUnits('100', 'gwei'),
				value: ethers.utils.parseEther(value.wager.toString()),
			};
			const selection = value.coinSide === 'head' ? 0 : 1;
			const tx = await contract?.flipit(selection, option);
			statusDialogRefFunc.toggleModal(true);
			audioRef?.play();
		} catch (err: any) {
			toast.error(err.message);
		} finally {
			setLoading(false);
		}
	};
	return (
		<Card className="bg-shade py-1">
			<CardHeader>
				<h3 className="font-sans">Make Your Bet</h3>
				
			</CardHeader>
			<Card className="h-[calc(100%_-_72px)]  bg-shade border-none flex justify-center items-center flex-col">
				<div className="max-w-[360px] w-full">
					<div className="grid w-full items-center gap-4">
						<div className="flex flex-col space-y-1.5">
						<FormField
    name="wager"
    control={form.control}
    render={({ field }) => {
      const maxWager = contractBalance
        ? (parseFloat(contractBalance) * 0.09).toFixed(4)
        : 0;

      return (
		<FormItem>
		<div className="flex justify-between">
		  <FormLabel
			htmlFor="wager"
			className="font-bold text-gray-500"
		  >
			Wager
		  </FormLabel>
		  <span className="font-bold">
			{formatTwoDigit(field.value || 0)} BNB
		  </span>
		</div>
		<FormControl>
		  <div className="relative">
			<Input
			  type="number"
			  className="rounded"
			  id="wager"
			  placeholder="10"
			  {...field}
			  onChange={(e) => {
				const inputValue = Number(e.currentTarget.value);
				const numericMaxWager = Number(maxWager); // Convert maxWager to a number
				const constrainedValue = Math.min(inputValue, numericMaxWager);
				field.onChange(constrainedValue);
				form.setValue('maxPayout', constrainedValue * 1.881);
			  }}
			/>
			<CoinFace.Head
			  width={20}
			  height={20}
			  className="absolute right-2 top-2"
			/>
		  </div>
		</FormControl>
		<div className="text-red-500 text-sm mt-1">
		  Max allowable wager: {maxWager} BNB
		</div>
	  </FormItem>
	  
      );
    }}
  />
						</div>
						<div className="grid grid-cols-2 gap-2">
							<div className="flex flex-col space-y-1.5">
								<FormField
									control={form.control}
									name="maxPayout"
									render={({ field }) => (
										<FormItem>
											<FormLabel
												htmlFor="maxPayout"
												className="font-bold text-gray-500"
											>
												Max Payout
											</FormLabel>
											<FormControl>
												<div className="relative">
													<Input
														disabled
														type="number"
														className="rounded"
														id="maxPayout"
														placeholder="12,624.95"
														{...field}
													/>
													<CoinFace.Head
														width={20}
														height={20}
														className="absolute right-2 top-2"
													/>
												</div>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
							<div className="flex flex-col space-y-1.5">
								<FormField
									control={form.control}
									name="totalWager"
									render={({ field }) => (
										<FormItem>
											<FormLabel
												htmlFor="totalWager"
												className="font-bold text-gray-500"
											>
												Total Wager
											</FormLabel>
											<FormControl>
												<div className="relative">
													<Input
														disabled
														type="number"
														className="rounded"
														id="totalWager"
														placeholder="12,624.95"
														value={totalWager ?? '0'}
													/>
													<CoinFace.Head
														width={20}
														height={20}
														className="absolute right-2 top-2"
													/>
												</div>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
						</div>
						<form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
							<Button
								className="font-heading text-xl w-full"
								type="submit"
								isLoading={loading || isPending}
							>
								{loading ? '' : 'FLIP'}
							</Button>
						</form>
					</div>
				</div>
			</Card>
			<AudioEl />
		</Card>
	);
};
