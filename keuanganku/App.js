import TabNavigator from './src/TabNavigator';
import { useEffect, useState } from 'react';
import { initDB } from './src/database/db';
import Toast from 'react-native-toast-message';

export default function App() {

  const [loading, setLoading] = useState(true);

  const initDatabase = async () => {
    initDB();
    setLoading(false);
  }

  useEffect(() => {
    initDatabase();
  }, [])

  if (loading) {
    return null
  }

  return <>
    <Toast />
    <TabNavigator />
  </>
}
