// Images are uploaded straight from the browser to Cloudinary (unsigned preset); the backend only stores the URL.
const CLOUD = 'dbb5nj0ht'
const PRESET = 'ml_default'

export async function uploadImage(file) {
  const form = new FormData()
  form.append('file', file)
  form.append('upload_preset', PRESET)
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, { method: 'POST', body: form })
  const data = await res.json().catch(() => ({}))
  if (!data.secure_url) throw new Error(data.error?.message || 'Upload failed')
  return data.secure_url
}
