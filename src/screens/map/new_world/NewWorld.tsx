import {useNavigation, useRoute} from '@react-navigation/native';
import {apiPostFictionCreate} from 'helper/mapHelper';
import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Svg, {Path, Rect} from 'react-native-svg';
import {FantasyMapView} from '../components';
import {CreateNew} from './components/create_new';
import {FullExploreCountry} from './components/full_explore_country';
import {PinLocation} from './components/pin_location';
import {Success} from './components/success';
import {Welcome} from './components/welcome';
import {MyCountries} from './components/my_countries';
import {CountryDetail} from './components/country_detail';

import {styles} from './index.styles';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/interfaces';

const NewWorldPage = () => {
  const {goBack} = useNavigation();
  const route = useRoute();
  const initCountry = route.params?.countryDetail;
  const {user} = useSelector((state: RootState) => state.auth);

  const [currentLocation, setCurrentLocation] = useState([
    -3.4391102017079973, 14.508972045354852,
  ]);
  const [showCountryLocation, setShowCountryLocation] = useState([
    initCountry.latitude || 0,
    initCountry.longitude || 0,
  ]);
  const [newCountry, setNewCountry] = useState({});
  const [step, setStep] = useState(initCountry ? -1 : 0);

  const [showFullExplore, setShowFullExplore] = useState(false);
  const [showCountryDetail, setShowCountryDetail] = useState(!!initCountry);
  const [country, setCountry] = useState(initCountry);
  const [showMyCountries, setShowMyCountries] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);

  const onGoBack = () => {
    goBack();
  };

  const onContinue = data => {
    setNewCountry(data);
    setStep(3);
  };

  const onPin = async () => {
    const req = {
      ...newCountry,
      latitude: currentLocation[0],
      longitude: currentLocation[1],
    };
    const res = await apiPostFictionCreate(req);

    if (res.success) {
      setIsRefresh(!isRefresh);
      setStep(4);
    } else {
      alert(res.error);
    }
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.txtTitle}>New World</Text>
        <TouchableOpacity style={styles.backBtn} onPress={onGoBack}>
          <BackIcon />
        </TouchableOpacity>
      </View>
    );
  };

  const renderTopView = () => {
    if (step === 2 || step === 3 || step === 4 || !!initCountry) return;
    return (
      <View style={styles.topView}>
        <EnergyIcon />
        <Text style={styles.txtCreationEnergy}>Creation Energy</Text>
        <Text style={styles.txtCountry}>1 country</Text>
        <TouchableOpacity onPress={() => setStep(2)} style={styles.btnCreate}>
          <Text style={styles.txtCreate}>Create</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderWelcomSheet = () => {
    return (
      <Welcome
        show={step === 0}
        onClose={() => {}}
        onExplore={() => {
          setStep(-1);
          setShowMyCountries(true);
        }}
      />
    );
  };

  const renderMyCountries = () => {
    return (
      <MyCountries
        show={showMyCountries}
        onClose={() => {
          setShowMyCountries(false);
          setShowCountryLocation([]);
        }}
        onExplore={() => {
          setStep(-1);
          setShowFullExplore(true);
        }}
        onDetail={data => {
          setShowCountryLocation([data.latitude, data.longitude]);
          setCountry(data);
          setShowMyCountries(false);
          setShowCountryDetail(true);
        }}
      />
    );
  };

  const renderCreateNewSheet = () => {
    return (
      <CreateNew
        show={step === 2}
        onClose={() => setStep(1)}
        onContinue={onContinue}
      />
    );
  };

  const renderPinLocationSheet = () => {
    return (
      <PinLocation show={step === 3} onClose={() => setStep(2)} onPin={onPin} />
    );
  };

  const renderSuccessSheet = () => {
    return (
      <Success
        show={step === 4}
        onClose={() => setStep(5)}
        onView={() => setStep(5)}
      />
    );
  };

  const renderFullExploreCountrySheet = () => {
    return (
      <FullExploreCountry
        show={showFullExplore}
        onClose={() => setShowFullExplore(false)}
        onDetail={data => {
          setShowCountryLocation([data.latitude, data.longitude]);
          setCountry(data);
          setShowFullExplore(false);
          setShowCountryDetail(true);
        }}
      />
    );
  };

  const renderCountryDetailSheet = () => {
    return (
      <CountryDetail
        show={showCountryDetail}
        onClose={() => setShowCountryDetail(false)}
        country={country}
      />
    );
  };

  const renderCreateHint = () => {
    if (step === 5)
      return (
        <View style={styles.createHintContainer}>
          <View style={styles.createHintTopIcon}>
            <CreateHintTopIcon />
          </View>
          <Text style={styles.createHint}>
            {'You just can create one\ncountry a day!'}
          </Text>
          <Text style={styles.createSubHint}>
            {
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sit ut in amet elit, dictum.'
            }
          </Text>
          <TouchableOpacity
            style={styles.btnContinue}
            onPress={() => setStep(2)}>
            <Text style={styles.txtBtnCreate}>Continue</Text>
          </TouchableOpacity>
        </View>
      );

    if (step === 1)
      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setStep(2)}
          style={styles.createHintContainer}>
          <View style={styles.createHintTopIcon}>
            <CreateHintTopIcon />
          </View>
          <Text style={styles.createHint}>
            {
              'This is your energy to create your own country.\nClick Create Now!'
            }
          </Text>
          <Text style={styles.createSubHint}>
            {
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sit ut in amet elit, dictum.'
            }
          </Text>
        </TouchableOpacity>
      );
  };

  return (
    <View style={styles.container}>
      <FantasyMapView
        isRefresh={isRefresh}
        showSuccess={step === 4}
        showPinLocation={step === 3}
        showCountryLocation={showCountryLocation}
        setCurrentLocation={setCurrentLocation}>
        {renderHeader()}
        {renderTopView()}
        {renderWelcomSheet()}
        {!user.fictionOnboarding && renderCreateHint()}
        {renderCreateNewSheet()}
        {renderPinLocationSheet()}
        {renderSuccessSheet()}
        {renderFullExploreCountrySheet()}
        {renderCountryDetailSheet()}
        {renderMyCountries()}
      </FantasyMapView>
    </View>
  );
};

export default NewWorldPage;

const BackIcon = () => (
  <Svg width="24" height="24" fill="none" viewBox="0 0 24 24">
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 18l-6-6 6-6"></Path>
  </Svg>
);

const EnergyIcon = () => (
  <Svg width="32" height="32" fill="none" viewBox="0 0 32 32">
    <Rect width="32" height="32" fill="#FFA51F" rx="16"></Rect>
    <Path
      fill="#fff"
      d="M21.247 13.733a.667.667 0 00-.58-.4h-3.054l.847-3.16a.666.666 0 00-.64-.84h-4.667a.667.667 0 00-.666.494L10.7 16.493a.665.665 0 00.647.84h2.58l-1.207 4.494a.667.667 0 001.14.62l7.267-8a.667.667 0 00.12-.714zM14.72 19.52l.713-2.667a.665.665 0 00-.64-.84h-2.56l1.427-5.346h3.287l-.847 3.16a.667.667 0 00.667.84h2.38L14.72 19.52z"></Path>
  </Svg>
);

const CreateHintTopIcon = () => (
  <Svg width={24} height={20} viewBox="0 0 24 20" fill="none">
    <Path
      d="M15.578 3.155L24 20H0L8.422 3.155c1.474-2.948 5.682-2.948 7.156 0z"
      fill="#fff"
    />
  </Svg>
);
