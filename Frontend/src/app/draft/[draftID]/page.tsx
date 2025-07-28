
export default async function DraftRoom({ params }: { params: { draftID: string } }) {
  const draftId = (await params).draftID
  //console.log("draftId", draftId)

  return <h1>Hello draft page! Link: {draftId}</h1>
}