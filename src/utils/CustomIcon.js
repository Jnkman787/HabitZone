import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './config.json';

//const Icon = createIconSetFromFontello(fontelloConfig);

//export default () => <Icon name='calendar' size={30} color='white'/>

export default createIconSetFromFontello(fontelloConfig, 'custom-icons');