/**
 * Halcyon — Entry Point
 * 
 * Redirects to splash screen on initial load.
 */
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/splash" />;
}
