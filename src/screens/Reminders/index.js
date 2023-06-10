import {View, Text, TouchableOpacity, Image, Alert} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  getReminder,
  getTest,
  info,
  reminders,
  test,
} from '../../ducks/testPost';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FlatList} from 'react-native-gesture-handler';
import styles from '../Reminders/styles';
import {SwipeListView} from 'react-native-swipe-list-view';
import {Shadow} from 'react-native-shadow';
import {Colors, Images} from '../../theme';
import {useNavigation} from '@react-navigation/native';
import {ScreeNames} from '../../naviagtor';
import {transform} from 'lodash';
import {RemindersData} from '../../utils/Data/RemindersData';
import StatusBar from '../../components/StatusBar';
import {images} from '../../utils/Images/images';
// import PushNotification from 'react-native-push-notification';

const Index = ({route}) => {
  //===================== useState ============================//
  const [data, setData] = useState();
  const [swipeRow, setSwipeRow] = useState({});
  const viewref = useRef(null);
  const navigation = useNavigation();
  const SavedData = route?.params?.myName;
  const showLocation = route?.params?.showLocation;
  const dispatch = useDispatch();
  const getRemindersData = useSelector(getReminder);
  const openRowRef = useRef(null);
  // console.log(
  //   getRemindersData.indexOf(getRemindersData[2]),
  //   '========== ===mouse',
  // );
  useEffect(() => {
    // createChannel();
    console.log(getRemindersData, '============== get complete reminders data');
  }, []);
  const removeItem = itemToRemove => {
    const updatedData = getRemindersData.filter(item => item !== itemToRemove);
    dispatch(reminders(updatedData));
  };
  // const createChannel = () => {
  //   PushNotification.createChannel({
  //     channelId: 'test-channel',
  //     channelName: 'Test Channel',
  //   });
  // };
  const renderItem = rowData => {
    // console.log(rowData.item, '================= description');
    return (
      <View key={rowData.item.id} style={[styles.frontRowView]}>
        <Text style={[styles.frontRowtxt, {color: Colors.teal}]}>
          {rowData.item.name}
        </Text>
        <Text style={[styles.frontRowDestxt, {color: Colors.black}]}>
          {rowData.item.location}
        </Text>
        <Text style={[styles.frontRowtxt, {color: Colors.black}]}>
          {rowData.item.radius} km
        </Text>
      </View>
    );
  };
  const renderHiddenItem = (rowData, rowMap, item) => {
    return (
      <View key={rowData.item.id} ref={viewref} style={styles.backRowView}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.backRowEditView}
          onPress={() => {
            rowMap[rowData.item.id].closeRow();
            navigation.navigate(ScreeNames.RemindersAddUpdate, {
              items: rowData.item,
              isEdit: true,
            });
          }}>
          <Text style={styles.backRowEditTxt}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.backRowDeleteView}
          onPress={() => {
            Alert.alert(
              'Delete Reminder',
              'Are you sure you want to delete this reminder ?',
              [
                {
                  text: 'No',
                  onPress: () => rowMap[rowData.item.id].closeRow(),
                  style: 'default',
                },
                {
                  text: 'Yes',
                  onPress: () => removeItem(rowData.item),
                  style: 'cancel',
                },
              ],
              {cancelable: false},
            );
          }}>
          <Text style={styles.backRowDeleteTxt}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const ListEmptyComponent = () => (
    <View style={styles.emptytxtView}>
      <Image style={styles.reminderIcon} source={Images.general.reminderIcon} />
      <Text style={styles.emptyTxt}>Reminders will appear here</Text>
    </View>
  );

  const onRowDidOpen = (rowKey, rowMap) => {
    openRowRef.current = rowMap[rowKey];
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <SwipeListView
        style={{marginTop: 20,}}
        data={getRemindersData}
        keyExtractor={(item, index) => item.id}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        leftOpenValue={75}
        rightOpenValue={-75}
        ListEmptyComponent={ListEmptyComponent}
        showsVerticalScrollIndicator={false}
        onRowDidOpen={onRowDidOpen}
      />
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.addIconViewStyles}
        onPress={() => navigation.navigate(ScreeNames.RemindersAddUpdate)}>
        <Image style={styles.addIconStyles} source={Images.general.addIcon} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Index;
