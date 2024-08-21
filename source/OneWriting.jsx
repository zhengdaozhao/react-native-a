import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import { Text, StyleSheet, View,ScrollView} from 'react-native';

export function OneWriting({navigation, route}) {

    // const realm = useRealm();
    // const user = useUser();
    // const writings = useQuery(Writing);
  
    // useEffect(() => {
    //       realm.subscriptions.update(mutableSubs => {
    //         mutableSubs.add(
    //           realm.objects(Writing).filtered(`subject == "${route.params.subject}" and title == "${route.params.title}"`),{name: ownSubscription}
    //         );
    //       });
    // }, [realm, user]);
    
    // const renderItem = useCallback(
    //     // ({ item }: { item: Initdson }) => (
    //     ({ item }) => (
    //       <ListItem
    //         key={`${item._id}`}
    //       >
    //         <ListItem.Title style={styles.itemContent}>
    //           {item.sample.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, " ")}
    //         </ListItem.Title>
    //       </ListItem>
    //     ),
    //     []
    //   );
        
      return (
        <SafeAreaProvider>
          <ScrollView style={styles.viewWrapper}>
            {/* <FlatList
              keyExtractor={item => item._id.toString()}
              data={writings}
              renderItem={renderItem}
            /> */}
            <Text style={styles.itemContent}>
              {route.params.sample.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, " ")}
            </Text>
          </ScrollView>
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
      itemContent: {
        color: 'white',
        backgroundColor:'#87a96b',
        flex: 1,
        fontSize:24
      },
      overlay: {
        backgroundColor: 'white',
      },
    });