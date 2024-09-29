
import { Cookies } from 'react-cookie';


export const requestWithdrawUSDC = async (amount: number) => {
    const cookies = new Cookies();
    const token = cookies.get('token');
    const res = await fetch('/api/withdraw', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            amount: amount,
        }),
    }
    )
    if (!res.ok) {
        throw new Error("Failed to withdraw USDC");
    }


    const result = await res.json()
    console.log(result, 'result')

    return result
}

export const getWithdrawHistory = async () => {
    const cookies = new Cookies();
    const token = cookies.get('token');
    const res = await fetch('/api/history/withdraw', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
    if (!res.ok) {
        throw new Error("Failed to get withdraw history");
    }


    const result = await res.json()
    console.log(result, 'result')

    return result
}   