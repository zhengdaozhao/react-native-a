import React, {useCallback, useState, useEffect} from 'react';
import {useUser, useRealm, useQuery} from '@realm/react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Alert, FlatList, StyleSheet, Switch, Text, View} from 'react-native';
import {Button, Overlay, ListItem} from '@rneui/base';
import {dataExplorerLink} from '../atlasConfig.json';

import {CreateToDoPrompt} from './CreateToDoPrompt';
// import { SubjectLists } from './SubjectLists';

import {Item} from './ItemSchema';
import { Initdson } from './InitdsonSchema';
import { Writing } from './WritingSchema';
import {colors} from './Colors';

// import { useNavigation } from '@react-navigation/native';

// If you're getting this app code by cloning the repository at
// https://github.com/mongodb/ template-app-react-native-todo,
// it does not contain the data explorer link. Download the
// app template from the Atlas UI to view a link to your data
const dataExplorerMessage = `View your todo in MongoDB Atlas: ${dataExplorerLink}.`;

// const itemSubscriptionName = 'items';
// const ownItemsSubscriptionName = 'ownItems';
const allSubscription = 'initdsons';
const ownSubscription = 'ownInitdsons';
// const allSubscription = 'writings';
// const ownSubscription = 'ownWritings';

export function ItemListView({navigation}) {
  const realm = useRealm();
  // const items = useQuery(Item).sorted('_id');
  const user = useUser();
  // 2024/8/9 add
  // const writings = useQuery(Writing);
  // console.log('writings=',writings);
  // const items = useQuery(Item);
  // console.log('items=',items);
  const dsons = useQuery(Initdson).sorted('_id');
  // console.log('dsons=',dsons);

  const [showNewItemOverlay, setShowNewItemOverlay] = useState(false);
  // const navigation = useNavigation();
  // This state will be used to toggle between showing all items and only showing the current user's items
  // This is initialized based on which subscription is already active
  const [showAllItems, setShowAllItems] = useState(
    !!realm.subscriptions.findByName(allSubscription),
  );

  // This effect will initialize the subscription to the items collection
  // By default it will filter out all items that do not belong to the current user
  // If the user toggles the switch to show all items, the subscription will be updated to show all items
  // The old subscription will be removed and the new subscription will be added
  // This allows for tracking the state of the toggle switch by the name of the subscription
  useEffect(() => {
    if (showAllItems) {
      realm.subscriptions.update(mutableSubs => {
        mutableSubs.removeByName(ownSubscription);
        // mutableSubs.add(realm.objects(Item), {name: itemSubscriptionName});
        // ganlina
        mutableSubs.add(realm.objects(Initdson), {name: allSubscription});
        // mutableSubs.add(realm.objects(Item), {name: allSubscription});
      });
    } else {
      realm.subscriptions.update(mutableSubs => {
        mutableSubs.removeByName(allSubscription);
        // mutableSubs.add(
        //   realm.objects(Item).filtered(`owner_id == "${user?.id}"`),
        //   {name: ownItemsSubscriptionName},
        // );
        mutableSubs.add(
          realm.objects(Initdson).filtered(`username == "${user?.profile?.email}"`),{name: ownSubscription}
        );
        // mutableSubs.add(
        //   realm.objects(Item),{name: ownSubscription}
        // );
      });
    }
  }, [realm, user, showAllItems]);


  const renderItem = useCallback(
    // ({ item }: { item: Initdson }) => (
    ({ item }) => (
      <ListItem
        key={`${item._id}`}
        bottomDivider
        topDivider
        onPress={() =>
        // 2024/8/21 
          navigation.navigate('zhipingdabi', {
            subject: String(JSON.parse(item.allsub)[0].key),
          })
        }
      >
        <ListItem.Title style={styles.itemContent}>
          {String(JSON.parse(item.allsub)[0].key).replace(
            String(JSON.parse(item.allsub)[0].label),''
          ) }
        </ListItem.Title>
        {/* <ListItem.Title style={styles.itemContent}>
          {item.sample.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, " ")}
        </ListItem.Title> */}
      </ListItem>
    ),
    []
  );

  // createItem() takes in a summary and then creates an Item object with that summary
  const createItem = useCallback(
    ({summary}) => {
      // if the realm exists, create an Item
      realm.write(() => {
        console.log(dataExplorerMessage);

        return new Item(realm, {
          summary,
          owner_id: user?.id,
        });
      });
    },
    [realm, user],
  );

  // deleteItem() deletes an Item with a particular _id
  // const deleteItem = useCallback(
  //   (id: BSON.ObjectId) => {
  //     // if the realm exists, get the Item with a particular _id and delete it
  //     const item = realm.objectForPrimaryKey(Item, id); // search for a realm object with a primary key that is an objectId
  //     if (item) {
  //       if (item.owner_id !== user?.id) {
  //         Alert.alert("You can't delete someone else's task!");
  //       } else {
  //         realm.write(() => {
  //           realm.delete(item);
  //         });
  //         console.log(dataExplorerMessage);
  //       }
  //     }
  //   },
  //   [realm, user],
  // );

  return (
    <SafeAreaProvider>
      <View style={styles.viewWrapper}>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleText}>iszhipingdadingavailable?</Text>
          <Switch
            trackColor={{true: '#00ED64'}}
            onValueChange={() => {
              if (realm.syncSession?.state !== 'active') {
                Alert.alert(
                  'Switching subscriptions does not affect Realm data when the sync is offline.',
                );
              }
              setShowAllItems(!showAllItems);
            }}
            value={showAllItems}
          />
        </View>
        <Overlay
          isVisible={showNewItemOverlay}
          overlayStyle={styles.overlay}
          onBackdropPress={() => setShowNewItemOverlay(false)}>
          <CreateToDoPrompt
            onSubmit={({summary}) => {
              setShowNewItemOverlay(false);
              createItem({summary});
            }}
          />
        </Overlay>
        <FlatList
          keyExtractor={item => item._id.toString()}
          data={dsons}
          renderItem={renderItem}
        />
        {/* <Button
          title="Add To-Do"
          buttonStyle={styles.addToDoButton}
          onPress={() => setShowNewItemOverlay(true)}
        /> */}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  addToDoButton: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    margin: 5,
  },
  completeButton: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    margin: 5,
  },
  showCompletedButton: {
    borderRadius: 4,
    margin: 5,
  },
  showCompletedIcon: {
    marginRight: 5,
  },
  itemTitle: {
    color: 'white',
    backgroundColor:'green',
    flex: 1,
  },
  itemContent: {
    color: '#9966cc',
    // backgroundColor:'yellow',
    flex: 1,
    fontSize:28
  },
  itemSubtitle: {
    color: '#979797',
    flex: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  toggleText: {
    flex: 1,
    fontSize: 16,
  },
  overlay: {
    backgroundColor: 'white',
  },
});
