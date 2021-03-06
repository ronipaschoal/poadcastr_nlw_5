import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import { api } from '../../services/api';
import { format, parseISO } from 'date-fns';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import { ptBR } from 'date-fns/locale';

import styles from './episode.module.scss';
import { usePlayer } from '../../contexts/PlayerContexts';

type Episode = {
    id: string;
    title: string;
    thumbnail: string;
    members: string;
    publishedAt: string;
    duration: number;
    durationAsString: string;
    description: string;
    url: string;
}

type EpisodeProps = {
    episode: Episode;
}

export default function Episode({ episode }: EpisodeProps) {

    // const router = useRouter();

    // if(router.isFallback) {
    //     return <p>Carregando...</p>
    // }
    const { play } = usePlayer();

    return (
        <div className={styles.episodeContainer}>
            <Head>
                <title>{episode.title} | Podcaster</title>
            </Head>
            <div className={styles.episode}>

                <div className={styles.thumbnailContainer}>
                    <Link href="/">
                        <button>
                            <img src="/arrow-left.svg" alt="Voltar" />
                        </button>
                    </Link>

                    <Image width={700} height={160} src={episode.thumbnail} objectFit="cover" />
                    <button type="button" onClick={() => play(episode)}>
                        <img src="/play.svg" alt="Tocar Episódio" />
                    </button>
                </div>

                <header>
                    <h1>Episodios {episode.title}</h1>
                    <span>{episode.members}</span>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>
                </header>

                <div className={styles.description} dangerouslySetInnerHTML={{ __html: episode.description }} />
            </div>
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [
            {
                params: {
                    slug: 'a-importancia-da-contribuicao-em-open-source'
                }
            }
        ],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params;
    const { data } = await api.get(`episodes/${slug}`);

    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url
    }

    return {
        props: { episode },
        revalidate: 60 * 60 * 8,
    }
}