import { GetStaticProps } from "next";
import React, { useContext } from "react";
import  Head  from "next/head";
import { api } from "../services/api";
import {format, parseISO} from 'date-fns'
import ptBr from 'date-fns/locale/pt-BR';
import { totimeString } from "../utils/totimeString";
import styles from "./home.module.scss";
import Image from 'next/image';
import Link from 'next/link';
import {  usePlayer } from "../contexts/PlayerContext";

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  member: string;
  duration: number;
  durationString: string;
  url: string;
  publishedAt: string;

}

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({latestEpisodes, allEpisodes}: HomeProps) {
  const {playList} = usePlayer();

  const episodeList = {...latestEpisodes, ...allEpisodes};

  return (

    
    <div className={styles.homepage}>
      <Head>
      <title>
        RadicalCast
        </title>
    </Head>
      <section className={styles.latestEpisode}>
        <h2>Últimos episódios</h2>
        <ul>
          {latestEpisodes.map((epi, index) =>{
          return (
                <li key={epi.id}>
                  
                    <Image 
                      width={192} 
                      height={192} 
                      src={epi.thumbnail} 
                      alt={epi.title}
                      objectFit='contain'
                      />
                    <div className={styles.episodeDetails}>
                      <Link href={`/episodes/${epi.id}`}>
                      <a >{epi.title}</a>
                      </Link>
                      <p>{epi.member}</p>
                      <span>{epi.publishedAt}</span>
                      <span>{epi.durationString}</span>
                    </div>

                <button type="button" 
                        onClick={() => playList(episodeList, getEpiIndex(epi) )}>

                  <img src="/play-green.svg" alt="Tocar episodio"/>
               
                </button>

                </li>
          )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr><th></th>
              <th>Podcast</th>
            <th>Integrantes</th>
            <th>Data</th>
            <th>Duração</th> </tr>
                    
          </thead>
            <tbody>
              {allEpisodes.map((epi, index) =>{
                return (
                  <tr key={epi.id}>
                    <td  style={{width:72}}>
                      <Image
                        width={120}
                        height={120}
                        src={epi.thumbnail}
                        alt={epi.title}
                        objectFit="cover"
                        />
                    </td>
                    <td>
                    <Link href={`/episodes/${epi.id}`}>
                      <a >{epi.title}</a>
                      </Link>
                    </td>
                    <td>{epi.member}</td>
                    <td style={{width:100}}>{epi.publishedAt}</td>
                    <td>{epi.durationString}</td>
                    <td>
                      <button type="button" onClick={() => playList(episodeList, getEpiIndex(epi)  )}>
                        <img 
                        src="/play-green.svg"
                        alt="Tocar episódio"
                        />
                      </button>
                      </td>
                  </tr>
                )
              })}
            </tbody>
        </table>

      </section>

    </div>
    
  );
}



export const getStaticProps: GetStaticProps = async () =>{
  const {data } = await api.get('episodes',{
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'asc'
    }
  })
  
  const episodes = data.map(episode =>{
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      member: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBr}),
      duration: Number(episode.file.duration),
      durationString: totimeString(Number(episode.file.duration)),
      url: episode.file.url,
    };
  })

  const latestEpisodes = episodes.slice(-2)
  const allEpisodes = episodes
  

  return { 
    props: {
     latestEpisodes,
     allEpisodes
    },
    revalidate: 60 * 60 * 8
  }
}

function getEpiIndex(epi: Episode): number {
  //console.log(epi)
  return Number(epi.id)-1;
}
