import { Cookies } from 'react-cookie';
export const requestStartLottery = async (prizePool: number, ticketPrice: number, totalTickets: number) => {
    const cookies = new Cookies();
    const token = cookies.get('token');
    const adminPassword = cookies.get('adminPassword');
    const res = await fetch('/api/lottery', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            prizePool: prizePool,
            ticketPrice: ticketPrice,
            totalTickets: totalTickets,
            action: 'startLottery',
            adminPassword: adminPassword,
        }),
    }
    )

    if (!res.ok) {
        throw new Error("Failed to place bet");
    }


    const result = await res.json()

    return result
}

export const requestBuyTickets = async (lotteryId: number, numberOfTickets: number, playerAddress: string) => {
    const cookies = new Cookies();
    const token = cookies.get('token');
    const res = await fetch('/api/lottery', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            lotteryId: lotteryId,
            numberOfTickets: numberOfTickets,
            playerAddress: playerAddress,
            action: 'buyTickets',
        }),
    })

    const result = await res.json()

    return result
}

export const requestRunLottery = async (lotteryId: number) => {
    const cookies = new Cookies();
    const token = cookies.get('token');
    const adminPassword = cookies.get('adminPassword');
    const res = await fetch('/api/lottery', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            lotteryId: lotteryId,
            action: 'runLottery',
            adminPassword: adminPassword,
        }),
    })

    const result = await res.json()

    return result
}

export const requestForceCompleteLottery = async (lotteryId: number) => {
    const cookies = new Cookies();
    const token = cookies.get('token');
    const adminPassword = cookies.get('adminPassword');
    const res = await fetch('/api/lottery', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            lotteryId: lotteryId,
            action: 'forceCompleteLottery',
            adminPassword: adminPassword,
        }),
    })

    const result = await res.json()

    return result
}

export const requestActiveLotteries = async () => {
    const cookies = new Cookies();
    const token = cookies.get('token');
    const res = await fetch('/api/lottery?action=getActiveLotteries', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    const result = await res.json();
    return result;
}

export const requestMyLotteries = async (player: string) => {
    const cookies = new Cookies();
    const token = cookies.get('token');
    const res = await fetch(`/api/lottery?action=getPlayerLotteries&playerAddress=${player}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    const result = await res.json();
    return result;
}
