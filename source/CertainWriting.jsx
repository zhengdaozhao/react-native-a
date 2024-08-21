import React, {useCallback, useEffect,useState} from 'react';
import {useUser, useRealm, useQuery} from '@realm/react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import { FlatList, StyleSheet, View,Button,TouchableOpacity,Text, Alert} from 'react-native';
import {Overlay,ListItem} from '@rneui/base';
import { Writing } from './WritingSchema';
import { colors } from './Colors';
import {CreateToDoPrompt} from './CreateToDoPrompt';

const ownSubscription = 'certainWriting';

export function CertainWriting({navigation, route}) {

    const realm = useRealm();
    const user = useUser();
    const writings = useQuery(Writing);
    const [showNewItemOverlay, setShowNewItemOverlay] = useState(false);
  
    useEffect(() => {
          realm.subscriptions.update(mutableSubs => {
            mutableSubs.add(
              realm.objects(Writing).filtered(`subject == "${route.params.subject}"`),{name: ownSubscription}
            );
          });
    }, [realm, user]);

    const MyListItem = ({ item, navigation }) => (  
        <TouchableOpacity  
          onPress={() => navigation.navigate('YourTargetScreen', { /* 你可以在这里传递参数 */ })}  
          style={styles.itemContainer}  
        >  
          <View >  
            <Text >{item.title}</Text>  
          </View>  
          <View >  
            {/* <Button title="入苹逼" onPress={() => Alert.alert(`Button pressed for item ${title}`)} />   */}
            <Button title="入苹肥腚" onPress={() => Alert.alert(`Button pressed for item`)} />  
          </View>  
        </TouchableOpacity>  
      );      

    const renderItem = useCallback(
        // ({ item }: { item: Initdson }) => (
        ({ item }) => (
        //   <ListItem
        //     key={`${item._id}`}
        //     bottomDivider
        //     topDivider
        //     onPress={() =>
        //     // 2024/8/21 
        //       navigation.navigate('zhipingdadingyan', {
        //         // subject: item.subject,
        //         sample: item.sample,
        //       })
        //     }
        //   >
        //     <ListItem.Title style={styles.itemContent}>
        //       {item.title }
        //     </ListItem.Title>
        //     <ListItem.ButtonGroup>
        //         <Button>
        //             title="update"
        //         </Button>
        //         <Button>
        //             title="delete"
        //         </Button>
        //     </ListItem.ButtonGroup>
        //   </ListItem>
            <MyListItem item={item} navigation={navigation} />
        ),
        []
      );
        
      return (
        <SafeAreaProvider>
          <View style={styles.viewWrapper}>
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
              data={writings}
              renderItem={renderItem}
            />
            <Button
            title="插志苹"
            buttonStyle={styles.addToDoButton}
            onPress={() => setShowNewItemOverlay(true)}
            />

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
      itemContainer: {  
        flexDirection: 'row',  
        justifyContent: 'space-between',  
        alignItems: 'center',  
        padding: 10,  
        // 去掉borderBottomWidth和borderBottomColor，或者根据需要进行调整  
      }, 
      itemContent: {
        color: '#a52a2a',
        // backgroundColor:'yellow',
        flex: 1,
        fontSize:28
      },
      overlay: {
        backgroundColor: 'white',
      },
    });