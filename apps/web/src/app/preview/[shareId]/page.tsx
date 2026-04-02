import PreviewClient from './PreviewClient'

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ shareId: string }>
}) {
  const { shareId } = await params
  return <PreviewClient shareId={shareId} />
}
