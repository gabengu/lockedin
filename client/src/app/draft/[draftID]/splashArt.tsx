import Image from "next/image";

type SplashArtProps = {
  name: string;
};

export default function SplashArt(props: SplashArtProps) {
  return (
    <div className="overflow-hidden relative w-full h-full">
      <Image
        alt={props.name}
        className="object-cover object-right"
        fill
        src={
          "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/" +
          props.name +
          "_0.jpg"
        }
      />
  </div>
  );
}
