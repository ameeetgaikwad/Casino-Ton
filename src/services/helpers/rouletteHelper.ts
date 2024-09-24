import { Cookies } from 'react-cookie';

export const requestPlayRoulette = async (guess: number[], guessType: number[], amount: number[]) => {
    const cookies = new Cookies();
    const token = cookies.get('token');
    const res = await fetch('/api/roulette', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            action: 'play',
            guesses: guess,
            guessTypes: guessType,
            betAmounts: amount,
        }),
    });

    if (!res.ok) {
        throw new Error("Failed to play roulette");
    }

    return await res.json();
};

// export const requestHouseBalance = async () => {
//     const cookies = new Cookies();
//     const token = cookies.get('token');
//     const res = await fetch('/api/roulette?action=balance', {
//         method: 'GET',
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//         },
//     });

//     if (!res.ok) {
//         throw new Error("Failed to get house balance");
//     }

//     const result = await res.json();
//     return result.balance;
// };