import fs from 'fs'
import path from 'path'
import CryptoJS from 'crypto-js'

const memosFile = path.join(process.cwd(), 'data', 'memos.json')

// 환경 변수에서 암호화 키 가져오기
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY

if (!ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY is not set in environment variables')
}

// 메모 암호화 함수
function encryptMemo(content: string): string {
  return CryptoJS.AES.encrypt(content, ENCRYPTION_KEY).toString()
}

// 메모 복호화 함수
function decryptMemo(encryptedContent: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedContent, ENCRYPTION_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}

// 암호화된 메모 가져오기
function getEncryptedMemos() {
  if (!fs.existsSync(memosFile)) {
    return []
  }
  const fileContents = fs.readFileSync(memosFile, 'utf8')
  return JSON.parse(fileContents)
}

// 복호화된 메모 가져오기
export function getMemos() {
  const encryptedMemos = getEncryptedMemos()
  return encryptedMemos.map(memo => ({
    ...memo,
    content: decryptMemo(memo.content)
  }))
}

export function createMemo(content: string) {
  const memos = getEncryptedMemos()
  const newMemo = {
    id: Date.now().toString(),
    content: encryptMemo(content),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  memos.push(newMemo)
  fs.writeFileSync(memosFile, JSON.stringify(memos, null, 2))
  return {
    ...newMemo,
    content: content
  }
}

export function updateMemo(id: string, content: string) {
  const memos = getEncryptedMemos()
  const memoIndex = memos.findIndex((memo) => memo.id === id)
  if (memoIndex !== -1) {
    memos[memoIndex].content = encryptMemo(content)
    memos[memoIndex].updatedAt = new Date().toISOString()
    fs.writeFileSync(memosFile, JSON.stringify(memos, null, 2))
    return {
      ...memos[memoIndex],
      content: content
    }
  }
  return null
}

export function deleteMemo(id: string) {
  const memos = getEncryptedMemos()
  const updatedMemos = memos.filter((memo) => memo.id !== id)
  fs.writeFileSync(memosFile, JSON.stringify(updatedMemos, null, 2))
}

export function searchMemos(searchTerm: string) {
  const memos = getMemos()
  return memos.filter(memo => 
    memo.content.toLowerCase().includes(searchTerm.toLowerCase())
  )
}