export default function Icons(props: any) {
  return (
    <img
      src={
        "https://ddragon.leagueoflegends.com/cdn/15.15.1/img/champion/" +
        props.name +
        ".png"
      }
    />
  );
}
