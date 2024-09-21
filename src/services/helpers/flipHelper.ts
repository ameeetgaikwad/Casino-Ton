import { Cookies } from 'react-cookie';
export const requestFlipCoin = async (guess: number, amountBet: number) => {
    const cookies = new Cookies();
    const token = cookies.get('token');
    const res = await fetch('/api/flip', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            guess: guess,
            amountBet: amountBet,
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

export const requestResolveGame = async (gameId: string) => {
    const cookies = new Cookies();
    const token = cookies.get('token');
    const res = await fetch('/api/flip', {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            gameId,
        }),
    });
    if (!res.ok) {
        throw new Error("Failed to resolve game");
    }

    const resolvedGame = await res.json();
    console.log(resolvedGame, 'resolved game');

    return resolvedGame;
}


export const requestHouseBalance = async () => {
    const cookies = new Cookies();
    const token = cookies.get('token');
    const res = await fetch('/api/flip?action=balance', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw new Error("Failed to get house balance");
    }

    const result = await res.json();
    return result.balance;
}

export const requestGameCount = async () => {
    const cookies = new Cookies();
    const token = cookies.get('token');
    const res = await fetch('/api/flip?action=count', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw new Error("Failed to get game count");
    }
    const result = await res.json();
    return result.count;
}

export const requestGameEntries = async (limit: number) => {
    const cookies = new Cookies();
    const token = cookies.get('token');
    const res = await fetch(`/api/flip?action=entries&limit=${limit}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw new Error("Failed to get game entries");
    }
    const result = await res.json();
    return result;
}