import Airtable from 'airtable'

const base = new Airtable({
  apiKey: import.meta.env.VITE_AIRTABLE_API_KEY,
}).base(import.meta.env.VITE_AIRTABLE_BASE_ID)

export const getMessages = async () => {
  const records = await base('GuestbookTable')
    .select({ sort: [{ field: 'createdAt', direction: 'desc' }] })
    .all()
  return records.map((record) => ({ id: record.id, ...record.fields }))
}

export const addMessage = async (data) => {
  const record = await base('GuestbookTable').create([
    { fields: { ...data, createdAt: new Date().toISOString() } },
  ])
  return { id: record[0].id, ...record[0].fields }
}

export const deleteMessage = async (id) => {
  await base('GuestbookTable').destroy([id])
}
