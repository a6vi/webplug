import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import { AppRegistry } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SkiDataPage from './app/ski-data';
import AiAnalysisPage from './app/ai-analysis';
import ResortWeatherPage from './app/resort-weather';

function withNativeRoot(Page: React.ComponentType) {
  return function NativeRoot() {
    return <SafeAreaProvider><StatusBar style="dark" /><Page /></SafeAreaProvider>;
  };
}

const SkiDataRoot = withNativeRoot(SkiDataPage);
const AiAnalysisRoot = withNativeRoot(AiAnalysisPage);
const ResortWeatherRoot = withNativeRoot(ResortWeatherPage);

// Brownfield hosts open one of these module names directly.
AppRegistry.registerComponent('SkiData', () => SkiDataRoot);
AppRegistry.registerComponent('AiAnalysis', () => AiAnalysisRoot);
AppRegistry.registerComponent('ResortWeather', () => ResortWeatherRoot);

// A host that omits the module name still opens a real page, never a menu.
registerRootComponent(SkiDataRoot);
