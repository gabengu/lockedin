import Image from "next/image";

type IconsProps = {
  name: string;
  height: number;
  width: number;
  disable: boolean;
};

export default function Icons(props: IconsProps) {
  return (
      <Image
        alt={props.name}
        height={props.height}
        width={props.width}
        src={
          "https://ddragon.leagueoflegends.com/cdn/15.15.1/img/champion/" +
          (props.name === "Wukong" ? "MonkeyKing" : props.name) +
          ".png"
        }
      />
  );
}
