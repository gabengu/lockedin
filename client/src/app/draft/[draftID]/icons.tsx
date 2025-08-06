import Image from "next/image";

type IconsProps = {
    name: string;
};

export default function Icons(props: IconsProps) {
    return (
        <Image
            className="hover:scale-[105%] transition-all cursor-pointer"
            alt={props.name}
            height={100}
            width={100}
            src={
                "https://ddragon.leagueoflegends.com/cdn/15.15.1/img/champion/" +
                props.name +
                ".png"
            }
        />
    );
}
