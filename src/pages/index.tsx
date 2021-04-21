import { useEffect } from "react";
import { GetStaticProps } from "next";

type Episode = {
  id: 'string';
  title: 'string';
  members: 'string';
}

type HomeProps = {
  episodes: Episode[];
}

export default function Home(props: HomeProps) {
  props.episodes[0].id;
  //SPA
  // useEffect(() => {
  //   fetch('http://localhost:3333/episodes')
  //   .then(response => response.json())
  //   .then(data => console.log(data));
  // }, []);

  return (
    <>
      <h1>index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </>
  )
}

//SSR
//export async function getServerSideProps() {
//SSG
export const getStaticProps: GetStaticProps = async () => {
  const response = await fetch('http://localhost:3333/episodes');
  const data = await response.json();

  return {
    props: {
      episodes: data,
    },
    // revalidade só funciona no SSG
    revalidate: 60 * 60 * 8,
  }
}