import dynamic from 'next/dynamic';
import GameDisplay from '@/components/GameDisplay';
import gameData from '@/util/games.json';

const Layout = dynamic(() => import('@/components/Layout'), { ssr: false });

export default function GameDisplayPage() {
    return (
        <Layout>
            <GameDisplay data={gameData}/>
        </Layout>
    );
}