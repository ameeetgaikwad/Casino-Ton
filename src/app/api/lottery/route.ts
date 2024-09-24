import { NextRequest, NextResponse } from "next/server";
import {
    startLottery,
    buyTickets,
    runLottery,
    forceCompleteLottery,
    getLotteryInfo,
    getPlayerTickets,
    getActiveLotteries,
    getPlayerLotteries,
    getAllLotteries,
} from "@/services/lotteryService";
import { protect, protectAdmin } from "@/middlewares/authMiddlewares";

export async function POST(request: NextRequest) {
    const {
        action,
        prizePool,
        ticketPrice,
        totalTickets,
        lotteryId,
        numberOfTickets,
        playerAddress,
    } = await request.json();

    switch (action) {
        case "startLottery": {
            const token = request.headers
                .get("Authorization")
                ?.replace("Bearer ", "");

            if (!token) {
                return NextResponse.json(
                    { error: "No token provided" },
                    { status: 401 }
                );
            }
            const user = await protectAdmin(token);

            if (!user) {
                return NextResponse.json({ error: "Invalid token" }, { status: 401 });
            }

            const result = await startLottery(prizePool, ticketPrice, totalTickets);
            return NextResponse.json(result);
        }

        case "buyTickets": {
            const token = request.headers
                .get("Authorization")
                ?.replace("Bearer ", "");

            if (!token) {
                return NextResponse.json(
                    { error: "No token provided" },
                    { status: 401 }
                );
            }
            const user = await protect(token);

            if (!user) {
                return NextResponse.json({ error: "Invalid token" }, { status: 401 });
            }

            const tickets = await buyTickets(
                lotteryId,
                numberOfTickets,
                playerAddress
            );
            return NextResponse.json(tickets);
        }

        case "runLottery": {
            const token = request.headers
                .get("Authorization")
                ?.replace("Bearer ", "");

            if (!token) {
                return NextResponse.json(
                    { error: "No token provided" },
                    { status: 401 }
                );
            }
            const user = await protectAdmin(token);

            if (!user) {
                return NextResponse.json({ error: "Invalid token" }, { status: 401 });
            }

            const runResult = await runLottery(lotteryId);
            return NextResponse.json(runResult);
        }

        case "forceCompleteLottery": {
            const token = request.headers
                .get("Authorization")
                ?.replace("Bearer ", "");

            if (!token) {
                return NextResponse.json(
                    { error: "No token provided" },
                    { status: 401 }
                );
            }
            const user = await protectAdmin(token);

            if (!user) {
                return NextResponse.json({ error: "Invalid token" }, { status: 401 });
            }

            const forceResult = await forceCompleteLottery(lotteryId);
            return NextResponse.json(forceResult);
        }

        default:
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    switch (action) {
        case "getLotteryInfo": {
            const lotteryId = searchParams.get("lotteryId");
            if (lotteryId) {
                const lotteryInfo = await getLotteryInfo(Number(lotteryId));
                return NextResponse.json(lotteryInfo);
            }
            break;
        }

        case "getPlayerTickets": {
            const playerAddress = searchParams.get("playerAddress");
            if (playerAddress) {
                const playerTickets = await getPlayerTickets(playerAddress);
                return NextResponse.json(playerTickets);
            }
            break;
        }

        case "getActiveLotteries": {
            const activeLotteries = await getActiveLotteries();
            return NextResponse.json(activeLotteries);
        }

        case "getAllLotteries": {
            const allLotteries = await getAllLotteries();
            return NextResponse.json(allLotteries);
        }

        case "getPlayerLotteries": {
            const player = searchParams.get("playerAddress");
            if (player) {
                console.log(player, 'reached player22');
                const playerLotteries = await getPlayerLotteries(player);
                if (playerLotteries.length === 0) {
                    return NextResponse.json([], { status: 200 });
                }
                return NextResponse.json(playerLotteries);
            }
            break;
        }

        default:
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
    );
}
