export function parseJsonSafe(input: string): { data:any; error?:string } {
  if(!input.trim()) return { data: null }
  try { return { data: JSON.parse(input) } } catch(e:any){ return { data:null, error:e.message } }
}
export type JsonNode = { key?: string; value: any; type: string; path: string }
