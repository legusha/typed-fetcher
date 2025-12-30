export function arrayBufferToObject<T>(buffer: ArrayBuffer): T {
  const text = new TextDecoder('utf-8').decode(buffer)
  return JSON.parse(text) as T
}