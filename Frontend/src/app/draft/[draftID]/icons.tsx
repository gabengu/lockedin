import Image from "next/image";

type IconsProps = {
  name: string;
};

export default function Icons(props: IconsProps) {
  return (
    <Image
      alt={props.name}
      src={
        "https://ddragon.leagueoflegends.com/cdn/15.15.1/img/champion/" +
        props.name +
        ".png"
      }
    />
  );
}
