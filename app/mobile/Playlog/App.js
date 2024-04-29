
import { ProfileProvider } from './context/ProfileProvider';
import NavigationContent from './components/navigator/NavigationContent';



export default function App() {
  return (
    <ProfileProvider>
      <NavigationContent />
    </ProfileProvider>
  );
}

