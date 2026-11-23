import { initialComplaints } from '../data/mockData'

const keys = { complaints: 'civicconnect_complaints', users: 'civicconnect_users', session: 'civicconnect_session', notifications: 'civicconnect_notifications' }

export function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch (error) {
    console.error(`Unable to read ${key} from localStorage.`, error)
    return fallback
  }
}

export function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Unable to save ${key} to localStorage.`, error)
    throw new Error('Your browser could not save this update. Check available storage and try again.')
  }
}

export function initializeStore() {
  if (!localStorage.getItem(keys.complaints)) writeStore(keys.complaints, initialComplaints)
  if (!localStorage.getItem(keys.users)) writeStore(keys.users, [{ name: 'Aarav Sharma', email: 'demo@civicconnect.com', phone: '9876543210', password: 'Citizen123' }])
  if (!localStorage.getItem(keys.notifications)) writeStore(keys.notifications, [])
}

export const storageKeys = keys
