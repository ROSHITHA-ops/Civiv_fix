import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { readStore, writeStore, storageKeys, initializeStore } from '../utils/storage'

const Context = createContext(null)

export function AppProvider({ children }) {
  initializeStore()
  const [complaints, setComplaints] = useState(() => readStore(storageKeys.complaints, []))
  const [users, setUsers] = useState(() => readStore(storageKeys.users, []))
  const [notifications, setNotifications] = useState(() => readStore(storageKeys.notifications, []))
  const [user, setUser] = useState(() => readStore(storageKeys.session, null))

  useEffect(() => writeStore(storageKeys.complaints, complaints), [complaints])
  useEffect(() => writeStore(storageKeys.users, users), [users])
  useEffect(() => writeStore(storageKeys.notifications, notifications), [notifications])
  useEffect(() => {
    if (user) writeStore(storageKeys.session, user)
    else localStorage.removeItem(storageKeys.session)
  }, [user])

  const value = useMemo(() => ({
    complaints, setComplaints, users, setUsers, notifications, setNotifications, user, setUser,
    addNotification: (item) => setNotifications((current) => [{ id: `${Date.now()}`, ...item }, ...current]),
  }), [complaints, users, notifications, user])
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useApp() {
  const value = useContext(Context)
  if (!value) throw new Error('useApp must be used within AppProvider')
  return value
}
