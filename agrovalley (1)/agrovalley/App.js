// App.js
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';

const Stack = createNativeStackNavigator();

const getCoffeeFact = () => {
  const curiosidades = [
    "O café é a segunda bebida mais consumida no mundo, perdendo apenas para a água.",
    "O café foi descoberto na Etiópia, por um pastor de cabras chamado Kaldi.",
    "A planta do café pode crescer até 10 metros de altura."
  ];
  return curiosidades[Math.floor(Math.random() * curiosidades.length)];
};

// ----------------- COMPONENTE DE CABEÇALHO -----------------
const Header = ({ title }) => {
  const { width, height } = useWindowDimensions();
  const topImageHeight = Math.round(height * 0.26);
  const logoSize = Math.round(Math.max(40, width * 0.30));
  const badgePaddingH = Math.round(width * 0.05);

  return (
    <View style={[headerStyles.topImageWrapper, { height: topImageHeight }]}>
      <ImageBackground
        source={require('./assets/bg-top.jpg')}
        style={headerStyles.topImage}
        imageStyle={headerStyles.topImageInner}
      >
        <View style={headerStyles.centerOverlay}>
          <View
            style={[
              headerStyles.overlayBadge,
              { paddingHorizontal: badgePaddingH, paddingVertical: Math.round(badgePaddingH / 1.2) },
            ]}
          >
            <Image
              source={require('./assets/logo.png')}
              style={[headerStyles.logoImage, { width: logoSize, height: logoSize }]}
              resizeMode="contain"
            />
            <View style={headerStyles.verticalSeparator} />
            <Text style={headerStyles.titleText}>{title}</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

// ----------------- HOME SCREEN -----------------
function HomeScreen({ navigation }) {
  const { width, height } = useWindowDimensions();

  const topImageHeight = Math.round(height * 0.26);
  const logoSize = Math.round(Math.max(40, width * 0.30));
  const badgePaddingH = Math.round(width * 0.05);
  const btnSize = Math.round(Math.max(60, width * 0.18));
  const bigCardHeight = Math.round(Math.min(height * 0.57, height * 0.72));

  return (
    <View style={[homeStyles.container]}>
      <View style={[homeStyles.topImageWrapper, { height: topImageHeight }]}>
        <ImageBackground
          source={require('./assets/bg-top.jpg')}
          style={homeStyles.topImage}
          imageStyle={homeStyles.topImageInner}
        >
          <View style={homeStyles.centerOverlay}>
            <View
              style={[
                homeStyles.overlayBadge,
                { paddingHorizontal: badgePaddingH, paddingVertical: Math.round(badgePaddingH / 1.2) },
              ]}
            >
              <Image
                source={require('./assets/logo.png')}
                style={[homeStyles.logoImage, { width: logoSize, height: logoSize }]}
                resizeMode="contain"
              />
              <View style={homeStyles.verticalSeparator} />
              <Text style={homeStyles.bigBrand}>Agro{'\n'}Valley</Text>
            </View>
          </View>
        </ImageBackground>
      </View>

      <View style={[homeStyles.bigCard, { height: bigCardHeight }]}>
        <Text style={homeStyles.bigCardText}>Vamos Analisar?</Text>
      </View>

      <View
        style={[
          homeStyles.actionButtons,
          { bottom: Math.round(Math.max(18, height * 0.03)) },
        ]}
      >
        <TouchableOpacity
          style={[
            homeStyles.actionButton,
            { width: btnSize, height: btnSize, borderRadius: Math.round(btnSize / 2) },
          ]}
          onPress={() => navigation.navigate('Capture', { mode: 'camera' })}
          activeOpacity={0.85}
        >
          <Image
            source={require('./assets/camera.png')}
            style={[homeStyles.actionIcon, { width: btnSize * 0.52, height: btnSize * 0.52 }]}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            homeStyles.actionButton,
            { width: btnSize, height: btnSize, borderRadius: Math.round(btnSize / 2) },
          ]}
          onPress={() => navigation.navigate('Capture', { mode: 'gallery' })}
          activeOpacity={0.85}
        >
          <Image
            source={require('./assets/gallery.png')}
            style={[homeStyles.actionIcon, { width: btnSize * 0.52, height: btnSize * 0.52 }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function CaptureScreen({ route, navigation }) {
  const { mode } = route.params || {};
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    try {
      if (mode === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão negada', 'É necessário liberar acesso à câmera.');
          return;
        }
        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 4],
          quality: 1,
        });
        if (!result.canceled) setImage(result.assets[0].uri);
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão negada', 'É necessário liberar acesso à galeria.');
          return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [4, 4],
          quality: 1,
        });
        if (!result.canceled) setImage(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível abrir.');
    }
  };

  React.useEffect(() => {
    pickImage();
  }, []);

  return (
    <View style={captureStyles.container}>
      <Text style={captureStyles.title}>Imagem selecionada:</Text>
      {image && <Image source={{ uri: image }} style={captureStyles.preview} />}

      {image && (
        <TouchableOpacity
          style={captureStyles.analyzeButton}
          onPress={() => navigation.navigate('Analyzing', { image })}
        >
          <Text style={captureStyles.buttonText}>Analisar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
// ----------------- ANALYZING SCREEN -----------------
function AnalyzingScreen({ route, navigation }) {
  const { image } = route.params;
  const [curiosity, setCuriosity] = useState(getCoffeeFact());

  React.useEffect(() => {
    const t = setTimeout(() => {
      navigation.navigate('Summary', { image });
    }, 3000);

    return () => clearTimeout(t);
  }, [navigation, image]);

  return (
    <View style={analyzingStyles.container}>
      <Header title="Analisando..." />
      <Text style={analyzingStyles.title}>Analisando...</Text>
      <Text style={analyzingStyles.curiosityText}>{curiosity}</Text>
    </View>
  );
}

// ----------------- SUMMARY SCREEN -----------------
function SummaryScreen({ route, navigation }) {
  const { image } = route.params;

  const resultado = {
    especie: 'Conilon',
    classificacao: 'Tipo 4',
    defeitos: 22,
    confianca: 87,
    imagem: image, 
  };
  
  return (
    <View style={summaryStyles.container}>
      <Header title="Resultado" />
      <View style={summaryStyles.resultCard}>
        <Text style={summaryStyles.especie}>Espécie: {resultado.especie}</Text>
        <Image 
          source={{ uri: resultado.imagem }}
          style={summaryStyles.imageResult}
        />
        <Text style={summaryStyles.classification}>
          A classificação do seu grão é: <Text style={summaryStyles.value}>{resultado.classificacao}</Text>
        </Text>
        <Text style={summaryStyles.details}>
          <Text style={summaryStyles.value}>{resultado.defeitos}</Text> defeitos em 300 g (Conforme COB)
        </Text>
        <Text style={summaryStyles.details}>
          Confiança da análise: <Text style={summaryStyles.value}>{resultado.confianca}%</Text>
        </Text>
      </View>
      <TouchableOpacity 
        style={summaryStyles.reanalyzeButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Image
          source={require('./assets/volte.png')}
          style={summaryStyles.reanalyzeIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}

// ----------------- NAVIGATION -----------------
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Capture" component={CaptureScreen} />
        <Stack.Screen name="Analyzing" component={AnalyzingScreen} />
        <Stack.Screen name="Summary" component={SummaryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ----------------- STYLES -----------------
const headerStyles = StyleSheet.create({
  topImageWrapper: {
    width: '98%',
    borderRadius: 20,
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: 10,
    position: 'absolute',
    top: 0,
  },
  topImage: { flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' },
  topImageInner: { resizeMode: 'cover', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  centerOverlay: { width: '100%', alignItems: 'center', justifyContent: 'center' },
  overlayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 30, 20, 0.60)',
    borderRadius: 14,
    padding: 8,
  },
  logoImage: { marginLeft: 6, marginRight: 10, borderRadius: 8 },
  verticalSeparator: { width: 12, height: '58%', backgroundColor: '#DB7E08', marginHorizontal: 10, borderRadius: 3 },
  titleText: { color: '#FFD34A', fontWeight: '800', fontSize: 20, lineHeight: 20 },
});

const homeStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#142111', alignItems: 'center' },
  topImageWrapper: { width: '98%', borderRadius: 20, overflow: 'hidden', alignSelf: 'center', marginTop: 10 },
  topImage: { flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' },
  topImageInner: { resizeMode: 'cover', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  centerOverlay: { width: '100%', alignItems: 'center', justifyContent: 'center' },
  overlayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 30, 20, 0.60)',
    borderRadius: 14,
    padding: 8,
  },
  logoImage: { marginLeft: 6, marginRight: 10, borderRadius: 8 },
  badgeTextBox: { justifyContent: 'center', alignItems: 'flex-start', marginRight: 8 },
  badgeSmall: { color: '#FFB800', fontWeight: '700', fontSize: 12, lineHeight: 14 },
  verticalSeparator: { width: 12, height: '58%', backgroundColor: '#DB7E08', marginHorizontal: 10, borderRadius: 3 },
  bigBrand: { color: '#FFD34A', fontWeight: '800', fontSize: 20, lineHeight: 20 },
  bigCard: { width: '98%', backgroundColor: '#502C09', marginTop: 12, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  bigCardText: { color: '#DB7E08', fontSize: 36, fontWeight: '700' },
  actionButtons: { position: 'absolute', flexDirection: 'row', alignSelf: 'center' },
  actionButton: { borderWidth: 3, borderColor: '#DB7E08', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', marginHorizontal: 12 },
  actionIcon: { tintColor: '#DB7E08' },
});

const captureStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#142111', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 },
  title: { fontSize: 20, color: '#DB7E08', marginBottom: 12 },
  preview: { width: 280, height: 280, borderRadius: 8, marginVertical: 16 },
  analyzeButton: { backgroundColor: '#DB7E08', padding: 14, borderRadius: 40, marginTop: 18 },
  buttonText: { color: '#142111', fontSize: 16, fontWeight: 'bold' },
});

const analyzingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#142111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    color: '#DB7E08',
    fontWeight: '700',
    marginBottom: 90,
  },
  curiosityText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
});

const summaryStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#142111',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 10,
  },
  resultCard: {
    width: '98%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 260,
  },
  especie: {
    fontSize: 22,
    color: '#DB7E08',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imageResult: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginVertical: 15,
    resizeMode: 'cover',
  },
  classification: {
    fontSize: 18,
    color: '#DB7E08',
    textAlign: 'center',
  },
  details: {
    fontSize: 16,
    color: '#DB7E08',
    marginTop: 5,
  },
  value: {
    fontWeight: 'bold',
  },
  reanalyzeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  reanalyzeIcon: {
    width: 64,
    height: 40,
  }
});