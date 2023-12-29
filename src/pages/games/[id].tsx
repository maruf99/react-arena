import SeatDisplay from "@/components/SeatDisplay";
import dynamic from "next/dynamic";
import gameData from "@/util/games.json";

const Layout = dynamic(() => import('@/components/Layout'), { ssr: false });

export default function GamePage() {
    return (
        <Layout>
            <SeatDisplay data={gameData}/>
        </Layout>
    );
}