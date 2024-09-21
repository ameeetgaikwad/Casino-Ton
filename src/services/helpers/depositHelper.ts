
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
        throw new Error("Failed to place bet");
    }


    const result = await res.json()
    console.log(result, 'result')

    return result
}