
import { Cookies } from 'react-cookie';


export const requestDepositUSDC = async (uuid: string) => {
    const cookies = new Cookies();
    const token = cookies.get('token');
    const res = await fetch('/api/deposit', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            uuid: uuid,
        }),
    }
    )
    if (!res.ok) {
        throw new Error("Failed to deposit USDC");
    }


    const result = await res.json()

    return result
}

export const getDepositHistory = async () => {
    const cookies = new Cookies();
    const token = cookies.get('token');
    const res = await fetch('/api/history/deposit', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
    if (!res.ok) {
        throw new Error("Failed to deposit USDC");
    }


    const result = await res.json()

    return result
}   