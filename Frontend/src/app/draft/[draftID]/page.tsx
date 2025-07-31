import champion from "./champion.json" assert { type: "json" };
import Icons from "./icons.tsx";

const champsString = JSON.stringify(champion);
const champsObj = JSON.parse(champsString);
const names = Object.keys(champsObj.data);
const iconElements = names.map((name) => {
  return <Icons name={name} />;
});
export default async function DraftRoom({
  params,
}: {
  params: { draftID: string };
}) {
  const draftId = (await params).draftID;

  //https://ddragon.leagueoflegends.com/cdn/15.15.1/data/en_US/champion.json

  // https://ddragon.leagueoflegends.com/cdn/15.15.1/img/champion/Aatrox.png

  return <main>{iconElements}</main>;
}
