import ImageEditorClient from './ImageEditorClient'

export default async function ImageEditorPage({
  params,
}: {
  params: Promise<{ id?: string }>
}) {
  const { id } = await params
  return <ImageEditorClient id={id} />
}
